/**
 * Cada variante de mecánica se ejercita de verdad, no solo se monta.
 *
 * POR QUÉ HACÍA FALTA. El guion de detalle ejercita **una idea por mecánica** porque ejercitarlas
 * todas es caro. Esa muestra se eligió cuando una mecánica era una sola cosa; en cuanto varias
 * ganaron modos —`red` estirando, `descomponer` como puerta, `repeticion` con programas,
 * `dos-figuras` con medidores— la muestra podía tocar siempre el modo antiguo y dar por buena una
 * variante rota. De hecho lo hizo: las cuatro variantes montaban y tres no llegaban a resolver.
 *
 * La lista NO se escribe a mano. Se deriva del contenido tomando una idea por cada combinación de
 * mecánica y modo, más todas las piezas propias. Así, añadir un modo nuevo mañana lo mete solo en la
 * comprobación, que es justo lo que no ocurrió la vez anterior.
 *
 * Qué se exige: que la pieza monte, que responda a todo lo que ofrece —botones, elementos
 * manipulables y mantener pulsado— y que llegue a decir qué se ha entendido. Y que después de
 * interactuar, que es cuando aparecen los rótulos largos, no quede texto fuera del marco.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173/galeria.html';

const carpeta = join(RAIZ, 'content', 'es', 'ideas');
const vistas = new Set();
const titulos = [];

for (const f of (await readdir(carpeta)).sort()) {
  const d = JSON.parse(await readFile(join(carpeta, f), 'utf8'));
  const v = d.visualizacion;
  // Las piezas propias no comparten código con nadie: entran todas.
  const clave = v.mecanica ? `${v.mecanica}/${v.parametros?.modo ?? 'base'}` : `propia/${d.id}`;
  if (vistas.has(clave)) continue;
  vistas.add(clave);
  titulos.push({ titulo: d.titulo, clave });
}

console.log(`${titulos.length} combinaciones de mecánica y modo, derivadas del contenido.`);

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
const pagina = await contexto.newPage();
const problemas = [];
pagina.on('pageerror', (e) => problemas.push(`error de página: ${e.message}`));

await pagina.goto(URL_BASE, { waitUntil: 'networkidle' });

for (const { titulo, clave } of titulos) {
  const sec = pagina.locator('.pieza', { has: pagina.locator('h2', { hasText: titulo }) }).first();
  if (!(await sec.count())) { problemas.push(`no encontrada en la galería: ${titulo}`); continue; }
  // Ver el arco en `capturar-detalle.mjs`: esperar a que la caja esté quieta es intermitente
  // en las piezas que se animan solas.
  await sec.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const montada = await sec.locator('.vis-svg, .vis-canvas, .vis-respaldo').first()
    .waitFor({ timeout: 25000 }).then(() => true).catch(() => false);
  if (!montada) { problemas.push(`no montó: ${titulo} [${clave}]`); continue; }
  // Las escenas 3D y el respaldo estático no se ejercitan aquí: tienen su propia comprobación.
  if (await sec.locator('.vis-respaldo').count()) continue;
  await pagina.waitForTimeout(400);

  /*
   * Se mira si EXISTE antes de leerla. `textContent()` espera a que el elemento aparezca, con treinta
   * segundos por defecto, y esto se consulta tras cada pulsación: en las piezas que todavía no habían
   * resuelto, cada consulta bloqueaba medio minuto y la comprobación no terminaba nunca.
   */
  const resolucionAhora = async () => {
    const loc = sec.locator('.vis-resolucion').first();
    if (!(await loc.count())) return '';
    return (await loc.textContent({ timeout: 1000 }).catch(() => null)) ?? '';
  };

  /*
   * Se pulsa todo, pero se APRENDE qué botones deshacen.
   *
   * Varias piezas ofrecen un «volver a empezar» junto al botón que avanza. Pulsándolos en bucle, el
   * guion construía el estado final y acto seguido lo destruía, y daba por rotas piezas que
   * funcionaban. Ahora, si un botón borra una conclusión que ya estaba, se anota y no se vuelve a
   * pulsar: un usuario tampoco reinicia sin querer una y otra vez.
   */
  const botones = sec.locator('.vis-controles button');
  const n = await botones.count();
  const deshacen = new Set();
  for (let ronda = 0; ronda < 26; ronda++) {
    for (let i = 0; i < n; i++) {
      if (deshacen.has(i)) continue;
      const b = botones.nth(i);
      if (!(await b.isEnabled().catch(() => false))) continue;
      const antes = await resolucionAhora();
      await b.click({ timeout: 3000 }).catch(() => {});
      if (antes.length > 20 && (await resolucionAhora()).length <= 20) deshacen.add(i);
    }
    /*
     * Se para en cuanto la pieza ha dicho lo suyo. Veintiséis rondas hacen falta para un programa de
     * recompensa que hay que afianzar, retirar y extinguir; para las demás son miles de pulsaciones
     * inútiles que llevaban la comprobación entera más allá de los veinte minutos.
     */
    if (ronda >= 2 && (await resolucionAhora()).length > 20) break;
  }

  // Los elementos manipulables del propio dibujo: en `red` estirando no hay ningún botón.
  const vivos = sec.locator('.vis-svg .vis-interactivo');
  for (let ronda = 0; ronda < 8; ronda++) {
    const m = await vivos.count();
    for (let i = 0; i < m; i++) await vivos.nth(i).click({ timeout: 2000, force: true }).catch(() => {});
    /*
     * Se para en cuanto la pieza ha dicho lo suyo, igual que la ronda de botones de arriba.
     *
     * Sin esto, lo que se mide en las piezas de conmutación es la PARIDAD del número de rondas y no
     * si funcionan. En «La identidad personal» hay seis hilos que se cortan al pulsar y se restituyen
     * al volver a pulsar: la ronda impar los deja cortados y la pieza resuelve, la par los devuelve a
     * su sitio y la conclusión se va. Con ocho rondas —número par— la comprobación terminaba siempre
     * en el estado restituido y daba por rota una pieza que resuelve perfectamente.
     *
     * El guion ya tenía esta cautela para los botones, que aprende cuáles deshacen. Faltaba aquí, y
     * es donde importa: hay mecánicas que no ofrecen ni un botón y se manipulan solo por el dibujo.
     * Si una pieza no resuelve nunca, sigue fallando: lo que se elimina es el falso negativo.
     */
    if ((await resolucionAhora()).length > 20) break;
  }

  /*
   * Teclado sobre lo manipulable. Varias piezas se resuelven al DESPLAZAR algo y no al pulsarlo: la
   * frontera de `eje` exige haberla movido a los dos lados, y sin esto la comprobación la daba por
   * rota estando bien. Las flechas son además la vía accesible que esas piezas ya ofrecen.
   */
  for (let i = 0; i < (await vivos.count()); i++) {
    const el = vivos.nth(i);
    await el.focus({ timeout: 1500 }).catch(() => {});
    /*
     * Hasta los extremos, no un empujoncito. `eje` pide haber llevado la frontera por debajo de 0,32
     * y por encima de 0,68, y su paso de teclado es pequeño: con tres pulsaciones no se salía del
     * centro y la pieza parecía no responder.
     */
    // Los eventos se lanzan DENTRO de la página. Ciento sesenta pulsaciones por elemento, cada una
    // con su ida y vuelta hasta el navegador, dejaban la comprobación en más de veinte minutos.
    await el.evaluate((nodo) => {
      const pulsar = (key) => nodo.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      for (let k = 0; k < 40; k++) pulsar('ArrowLeft');
      for (let k = 0; k < 80; k++) pulsar('ArrowRight');
      for (let k = 0; k < 40; k++) pulsar('ArrowLeft');
    }).catch(() => {});
  }
  await pagina.waitForTimeout(400);

  // Donde el gesto es mantener pulsado, se mantiene: un clic no tensa nada.
  const asa = vivos.last();
  if (await asa.count()) {
    const caja = await asa.boundingBox().catch(() => null);
    if (caja) {
      await pagina.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
      await pagina.mouse.down();
      await pagina.waitForTimeout(2600);
      await pagina.mouse.up();
      await pagina.waitForTimeout(2200);
    }
  }

  /*
   * Los deslizadores se BARREN, no se llevan al tope. `el-numero-como-orden` se resuelve al pasar
   * por tres proporciones exactas repartidas por el recorrido: saltando directamente al 100 no se
   * pisa ninguna, y la pieza quedaba marcada como rota estando bien.
   */
  const rangos = sec.locator('input[type=range]');
  for (let i = 0; i < (await rangos.count()); i++) {
    // El barrido también va dentro de la página, por el mismo motivo que las teclas.
    await rangos.nth(i).evaluate((nodo) => {
      for (let v = 0; v <= 100; v += 1) {
        nodo.value = String(v);
        nodo.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }).catch(() => {});
  }
  await pagina.waitForTimeout(700);

  /*
   * Antes de dar nada por roto, se deja reposar. Las piezas de física resuelven al ASENTARSE —la
   * balanza de la suspensión del juicio solo concluye cuando la aguja deja de oscilar—, así que
   * medir justo después de la última pulsación las declara rotas por no haber esperado.
   */
  let resuelto = await resolucionAhora();
  if (resuelto.trim().length < 20) {
    await pagina.waitForTimeout(4000);
    resuelto = await resolucionAhora();
  }
  if (resuelto.trim().length < 20) {
    problemas.push(`no llega a resolver: ${titulo} [${clave}]`);
  }

  const fuera = await sec.evaluate((el) => {
    const svg = el.querySelector('.vis-svg');
    if (!svg) return [];
    const caja = svg.getBoundingClientRect();
    const salidos = [];
    for (const t of el.querySelectorAll('.vis-svg text')) {
      const r = t.getBoundingClientRect();
      if (!r.width || getComputedStyle(t).opacity === '0') continue;
      if (r.left < caja.left - 1 || r.right > caja.right + 1 || r.top < caja.top - 1 || r.bottom > caja.bottom + 1) {
        salidos.push((t.textContent ?? '').slice(0, 40));
      }
    }
    return salidos;
  });
  for (const s of fuera) problemas.push(`texto fuera del marco tras interactuar en ${titulo}: "${s}"`);
}

await navegador.close();

if (problemas.length) {
  console.error('\nProblemas:');
  for (const p of problemas) console.error(`  ${p}`);
  process.exit(1);
}
console.log('Todas las variantes responden y resuelven, sin texto fuera del marco.');
