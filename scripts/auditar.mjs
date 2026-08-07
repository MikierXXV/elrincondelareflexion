#!/usr/bin/env node
/**
 * Auditoría de rendimiento sobre el build de producción.
 *
 *   npm run build && npx vite preview --port 4173
 *   npm run auditar
 *
 * Mide lo que el proyecto se comprometió a vigilar en la fase 2, y no puntuaciones genéricas:
 *  - JS transferido hasta que el sitio es usable (presupuesto: 200 kB comprimidos, sin Three.js)
 *  - LCP y CLS reales
 *  - que Three.js NO bloquee el primer pintado
 *  - que no haya más de un contexto WebGL vivo a la vez
 *  - comportamiento con la CPU y la red frenadas, como un móvil de gama baja
 *
 * Dos correcciones sobre la primera versión, ambas por leer mal lo que se estaba midiendo:
 *  1. Los tamaños salían a cero: `content-length` no viene en respuestas con codificación por
 *     bloques. Se usa `request.sizes()`, que da lo transferido de verdad.
 *  2. El criterio «Three.js no debe entrar en la carga inicial» era incorrecto: el hero TIENE una
 *     escena 3D y por tanto la biblioteca se pide en cuanto hay hero. Lo que hay que exigir es que
 *     no bloquee el primer pintado, que es lo que el proyecto prometió.
 */

import { chromium } from 'playwright';

const BASE = process.env.URL_BASE ?? 'http://localhost:4173/';
const PRESUPUESTO_CRITICO_KB = 200;

const fallos = [];

function kb(bytes) { return (bytes / 1024).toFixed(1); }

async function medir({ nombre, cpu = 1, red = null }) {
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({ viewport: { width: 1280, height: 800 } });
  const pagina = await contexto.newPage();
  const cdp = await contexto.newCDPSession(pagina);

  if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  if (red) {
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false, latency: red.latencia,
      downloadThroughput: red.bajada, uploadThroughput: red.subida,
    });
  }

  const recursos = [];
  pagina.on('requestfinished', async (req) => {
    const url = req.url();
    if (!url.startsWith('http')) return;
    const tam = await req.sizes().then((s) => s.responseBodySize).catch(() => 0);
    recursos.push({ url, tipo: req.resourceType(), tam, t: Date.now() });
  });

  const inicio = Date.now();
  await pagina.goto(BASE, { waitUntil: 'load' });
  await pagina.waitForSelector('body.listo', { timeout: 60000 });
  const listo = Date.now() - inicio;

  // Métricas del propio navegador, no estimaciones.
  const metricas = await pagina.evaluate(() => new Promise((resolve) => {
    let lcp = 0;
    let cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      resolve({ lcp, cls, fcp: fcp?.startTime ?? 0, domContentLoaded: nav?.domContentLoadedEventEnd ?? 0 });
    }, 2500);
  }));

  const js = recursos.filter((r) => r.tipo === 'script');
  const critico = js.filter((r) => !/three-/.test(r.url));
  const three = js.filter((r) => /three-/.test(r.url));
  const totalCritico = critico.reduce((a, r) => a + r.tam, 0);
  const totalThree = three.reduce((a, r) => a + r.tam, 0);
  const otros = recursos.filter((r) => r.tipo !== 'script');

  console.log(`\n── ${nombre} ──`);
  console.log(`  listo en            ${listo} ms`);
  console.log(`  FCP                 ${metricas.fcp.toFixed(0)} ms`);
  console.log(`  LCP                 ${metricas.lcp.toFixed(0)} ms`);
  console.log(`  CLS                 ${metricas.cls.toFixed(3)}`);
  console.log(`  JS sin Three.js     ${kb(totalCritico)} kB en ${critico.length} ficheros`);
  console.log(`  Three.js (diferido) ${kb(totalThree)} kB`);
  console.log(`  otros recursos      ${kb(otros.reduce((a, r) => a + r.tam, 0))} kB en ${otros.length}`);

  // Lo que hay que exigir no es que Three.js no se cargue, sino que no bloquee el primer pintado.
  if (metricas.fcp > 2000) fallos.push(`[${nombre}] FCP ${metricas.fcp.toFixed(0)} ms: algo bloquea el primer pintado`);
  if (metricas.cls > 0.1) fallos.push(`[${nombre}] CLS ${metricas.cls.toFixed(3)} supera 0.1`);
  if (critico.length > 40) fallos.push(`[${nombre}] ${critico.length} ficheros JS en el arranque: demasiada fragmentación`);

  // Un solo contexto WebGL vivo: se recorre hasta una idea 3D y se cuentan los lienzos activos.
  await pagina.evaluate(() => { location.hash = '#idea-mundo-de-las-ideas'; });
  await pagina.waitForTimeout(4000);
  const contextos = await pagina.evaluate(
    () => [...document.querySelectorAll('canvas')].filter((c) => {
      try { return Boolean(c.getContext('webgl2', { failIfMajorPerformanceCaveat: false })); } catch { return false; }
    }).length,
  );
  console.log(`  lienzos WebGL vivos ${contextos}`);
  if (contextos > 1) fallos.push(`[${nombre}] ${contextos} contextos WebGL vivos; la regla es uno`);

  await contexto.close();
  await navegador.close();
  return { totalCritico };
}

const escritorio = await medir({ nombre: 'escritorio, sin frenos' });

if (escritorio.totalCritico / 1024 > PRESUPUESTO_CRITICO_KB) {
  fallos.push(`JS crítico ${kb(escritorio.totalCritico)} kB supera el presupuesto de ${PRESUPUESTO_CRITICO_KB} kB`);
}

// Gama baja: CPU cuatro veces más lenta y 4G real (no la "Fast 3G" de laboratorio).
await medir({
  nombre: 'gama baja: CPU ×4 y 4G',
  cpu: 4,
  red: { latencia: 150, bajada: (4 * 1024 * 1024) / 8, subida: (1 * 1024 * 1024) / 8 },
});

console.log('');
if (fallos.length) {
  console.error('Incumplimientos:');
  fallos.forEach((f) => console.error(`  ${f}`));
  process.exit(1);
}
console.log('Todos los presupuestos se cumplen.');
