#!/usr/bin/env node
/**
 * Captura los prototipos de referencia para revisión visual.
 *
 *   npm run dev            (en otra terminal)
 *   node scripts/capturar-prototipos.mjs
 *
 * No es una prueba de regresión: es la única forma de responder a la pregunta que motiva la fase 4,
 * que es si las tres técnicas se sienten del mismo sistema. Eso no lo dice un build.
 * Además recoge errores de consola, que sí detectan fallos reales de runtime.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173/prototipos.html';
const SALIDA = 'capturas';

await mkdir(SALIDA, { recursive: true });

const navegador = await chromium.launch();
const problemas = [];

async function sesion(nombre, { tema, ancho, alto, reducirMovimiento = false }) {
  const contexto = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    deviceScaleFactor: 2,
    colorScheme: tema === 'oscuro' ? 'dark' : 'light',
    reducedMotion: reducirMovimiento ? 'reduce' : 'no-preference',
  });
  const pagina = await contexto.newPage();

  pagina.on('console', (m) => {
    if (m.type() === 'error') problemas.push(`[${nombre}] consola: ${m.text()}`);
  });
  pagina.on('pageerror', (e) => problemas.push(`[${nombre}] excepcion: ${e.message}`));

  await pagina.goto(URL_BASE, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(2200); // deja terminar la animacion de entrada

  return { contexto, pagina, nombre };
}

/** Interactua con las tres piezas para capturar tambien sus estados de resolucion. */
async function ejercitar(pagina) {
  // 1. SVG: arrastrar el marcador hasta la zona de acierto de la primera situacion (medio = 0.62).
  const svg = pagina.locator('#vis-svg svg');
  const caja = await svg.boundingBox();
  if (caja) {
    const destinoX = caja.x + caja.width * (64 + 0.62 * (560 - 128)) / 560;
    const y = caja.y + caja.height * 132 / 220;
    await pagina.mouse.move(caja.x + caja.width * 0.5, y);
    await pagina.mouse.down();
    await pagina.mouse.move(destinoX, y, { steps: 12 });
    await pagina.mouse.up();
  }

  // 2. Fisica: anadir argumentos y esperar a que la balanza se detenga sola.
  await pagina.locator('#vis-fisica button').first().click();
  await pagina.waitForTimeout(400);
  await pagina.locator('#vis-fisica button').nth(1).click();
  await pagina.waitForTimeout(5000);

  // 3. 3D: mover la luz y girarse a mirar detras.
  const rango = pagina.locator('#vis-3d input[type="range"]');
  if (await rango.count()) {
    await rango.fill('120');
    await pagina.waitForTimeout(300);
  }
  const girar = pagina.locator('#vis-3d button');
  if (await girar.count()) {
    await girar.first().click();
    await pagina.waitForTimeout(1400);
  }
}

const escenarios = [
  { nombre: 'claro-escritorio', tema: 'claro', ancho: 1280, alto: 1400 },
  { nombre: 'oscuro-escritorio', tema: 'oscuro', ancho: 1280, alto: 1400 },
  { nombre: 'claro-movil', tema: 'claro', ancho: 390, alto: 2400 },
  { nombre: 'reducido', tema: 'claro', ancho: 1280, alto: 1400, reducirMovimiento: true },
];

for (const e of escenarios) {
  const { contexto, pagina, nombre } = await sesion(e.nombre, e);
  await pagina.screenshot({ path: `${SALIDA}/${nombre}-inicial.png`, fullPage: true });
  await ejercitar(pagina);
  await pagina.screenshot({ path: `${SALIDA}/${nombre}-resuelto.png`, fullPage: true });
  console.log(`capturado: ${nombre}`);
  await contexto.close();
}

await navegador.close();

if (problemas.length) {
  console.error('\nProblemas detectados en runtime:');
  problemas.forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}
console.log('\nSin errores de consola ni excepciones.');
