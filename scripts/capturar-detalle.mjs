#!/usr/bin/env node
/**
 * Prueba funcional de las mecánicas: abre la galería, ejercita una pieza por mecánica pulsando
 * sus controles y captura cada una a tamaño legible.
 *
 * No es solo una captura bonita: si una pieza no llega a su estado de resolución, aquí se ve,
 * porque el script comprueba que aparezca el texto de resolución tras interactuar.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173/galeria.html';
const SALIDA = 'capturas/detalle';

/**
 * Una idea por mecánica: sobre estas se hace el ejercicio COMPLETO —pulsar, arrastrar, exigir que
 * lleguen a su estado de resolución— y se guarda la captura. Es lo caro, y con una por mecánica
 * basta porque el gesto es el mismo.
 *
 * Las comprobaciones baratas —desborde de texto y ocupación del marco— se hacen sobre LAS 59, no
 * sobre estas. La lista fija era el punto ciego de las rondas anteriores: los desbordes de las otras
 * 36 ideas nunca se miraban, y ahí es donde estaban.
 */
const MUESTRA = [
  'La vacuidad',
  'La duda metódica',
  'La causalidad como hábito',
  'El cálculo de la felicidad',
  'Aceptación y cambio',
  'El imperativo categórico',
  'La genealogía de la moral',
  'El principio del daño',
  'El materialismo histórico',
  'Hablar de lo que no existe',
  'El significado es el uso',
  'La banalidad del mal',
  'La dicotomía del control',
  'La angustia como vértigo de la libertad',
  'Flujo y permanencia',
  'El número como orden del mundo',
  'Wu wei: la eficacia de no forzar',
  'La voluntad y el pesimismo',
  'La vista desde arriba',
  'Las condiciones a priori',
  'La relatividad de las perspectivas',
  'Ser es ser percibido',
  'El velo de la ignorancia',
];

const RESET = /volver|restituir|vaciar|empezar|presente/i;

await mkdir(SALIDA, { recursive: true });
const navegador = await chromium.launch();
const problemas = [];
const sinResolver = [];

for (const tema of ['claro', 'oscuro']) {
  const contexto = await navegador.newContext({
    viewport: { width: 900, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: tema === 'oscuro' ? 'dark' : 'light',
  });
  const pagina = await contexto.newPage();
  pagina.on('console', (m) => { if (m.type() === 'error') problemas.push(`[${tema}] ${m.text()}`); });
  pagina.on('pageerror', (e) => problemas.push(`[${tema}] ${e.message}`));

  await pagina.goto(URL_BASE, { waitUntil: 'networkidle' });
  // Las secciones existen desde el principio; su contenido se monta al entrar en pantalla, así que
  // basta esperar a que estén listadas y luego esperar pieza a pieza al hacer scroll.
  await pagina.waitForSelector('.pieza', { timeout: 30000 });
  await pagina.waitForTimeout(600);

  const todas = await pagina.locator('.pieza h2').allTextContents();
  if (todas.length < 50) problemas.push(`[${tema}] la galería solo lista ${todas.length} piezas`);

  for (const titulo of todas) {
    const ejercitar = MUESTRA.includes(titulo);
    const seccion = pagina.locator('.pieza', { has: pagina.locator('h2', { hasText: titulo }) }).first();
    if (!(await seccion.count())) { problemas.push(`[${tema}] no encontrada: ${titulo}`); continue; }
    /*
     * Se desplaza con el DOM y no con `scrollIntoViewIfNeeded()`.
     *
     * Aquel comprueba antes que el elemento esté «estable», es decir, que su caja no cambie durante
     * dos fotogramas seguidos. Y aquí hay piezas que se mueven solas para siempre —el péndulo de
     * Schopenhauer, el río de Heráclito, el abanico de votantes—, así que la espera depende de en qué
     * punto de su animación las pille: unas veces pasa y otras agota el tiempo. Esta prueba falló una
     * vez y pasó a la siguiente sin que nada hubiera cambiado, que es la peor forma de fallo posible.
     *
     * Una comprobación intermitente es peor que ninguna: enseña a volver a lanzarla hasta que salga
     * verde, y por ahí es por donde acaba colándose una regresión de verdad. Desplazar por el DOM no
     * exige estabilidad, que aquí además no significaba nada: lo que se va a medir después son
     * rótulos y cajas, no si la escena está quieta.
     */
    await seccion.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    /*
     * El montaje es diferido: hay que esperar a que esta pieza concreta exista. Una pieza que cae al
     * respaldo estático también cuenta como montada, y el propio dibujo también: exigir controles
     * visibles daba por no montadas dos piezas que funcionaban, porque se manipulan directamente y
     * no tienen botones. La evidencia de que una pieza está montada es que hay algo dibujado.
     */
    await seccion.locator('.vis-svg, .vis-canvas, .vis-controles, .vis-respaldo').first()
      .waitFor({ timeout: 20000 })
      .catch(() => problemas.push(`[${tema}] no se montó: ${titulo}`));
    await pagina.waitForTimeout(700);

    // Ejercitar: primero los elementos manipulables del SVG, luego los botones que no reinician.
    if (ejercitar) {
    const nodos = seccion.locator('.vis-interactivo');
    const habiaNodos = (await nodos.count()) > 0;
    for (let i = 0; i < await nodos.count(); i++) {
      await nodos.nth(i).click({ force: true }).catch(() => {});
      await pagina.waitForTimeout(160);
    }
    /*
     * Tiradores dentro del SVG: hay que ARRASTRARLOS, no pulsarlos.
     *
     * Pulsar un tirador lo deja donde estaba —el clic cae en su propio centro— así que las piezas
     * cuyo argumento está en mover algo no llegaban a nada. «El principio del daño» quiere que la
     * frontera recorra el eje, y con clics se quedaba clavada en el medio.
     */
    const tiradores = seccion.locator('[role="slider"]');
    for (let i = 0; i < await tiradores.count(); i++) {
      const t = tiradores.nth(i);
      const caja = await t.boundingBox().catch(() => null);
      const marco = await seccion.locator('.vis-svg').first().boundingBox().catch(() => null);
      if (!caja || !marco) continue;
      await pagina.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
      await pagina.mouse.down();
      for (const f of [0.12, 0.5, 0.88, 0.45]) {
        await pagina.mouse.move(marco.x + marco.width * f, caja.y + caja.height / 2, { steps: 8 });
        await pagina.waitForTimeout(160);
      }
      await pagina.mouse.up();
    }

    // Deslizadores: se recorren varios valores. Sin esto, las piezas cuyo hallazgo depende de una
    // posición concreta —la cuerda de Pitágoras— nunca llegaban a nada.
    const rangos = seccion.locator('.vis-controles input[type="range"]');
    for (let i = 0; i < await rangos.count(); i++) {
      for (const v of ['25', '33', '40', '43', '60', '75']) {
        await rangos.nth(i).fill(v).catch(() => {});
        await pagina.waitForTimeout(180);
      }
    }

    // Cada botón se pulsa varias veces: hay piezas cuyo efecto es acumulativo y con un solo clic
    // no llegan a mostrar nada, como el péndulo de Schopenhauer.
    const botones = seccion.locator('.vis-controles button');
    for (let i = 0; i < await botones.count(); i++) {
      const b = botones.nth(i);
      if (RESET.test((await b.textContent()) ?? '')) continue;
      for (let k = 0; k < 3; k++) {
        if (await b.isDisabled().catch(() => true)) break;
        await b.click({ force: true }).catch(() => {});
        await pagina.waitForTimeout(220);
      }
    }
    // Algunas mecánicas usan un botón que se repite («Retirar la siguiente capa»). Se pulsa el
    // ÚLTIMO y no el primero: en las mecánicas de selección el primero es un candidato, y volver
    // a pulsarlo deshacía lo que se acababa de comprobar.
    for (let i = 0; i < 6; i++) {
      const ultimo = botones.last();
      if (await ultimo.isDisabled().catch(() => true)) break;
      if (RESET.test((await ultimo.textContent()) ?? '')) break;
      await ultimo.click({ force: true }).catch(() => {});
      await pagina.waitForTimeout(200);
    }

    // Segunda pasada solo si en la primera no había nada que tocar: en «descomponer» las piezas
    // se activan tras pulsar el botón. Hacerla siempre estropeaba las mecánicas de alternancia
    // como «red», donde el segundo clic vuelve a conectar lo que el primero había cortado.
    if (!habiaNodos) {
      const nodos2 = seccion.locator('.vis-interactivo');
      for (let i = 0; i < await nodos2.count(); i++) {
        await nodos2.nth(i).click({ force: true }).catch(() => {});
        await pagina.waitForTimeout(160);
      }
    }

    }

    await pagina.waitForTimeout(300);
    if (ejercitar && !(await seccion.locator('.vis-resolucion').count())) sinResolver.push(`[${tema}] ${titulo}`);

    /*
     * Ningún texto puede salirse de su marco.
     *
     * SVG no recorta ni avisa: un `<text>` más largo que su caja simplemente se dibuja fuera. Y los
     * rótulos vienen del contenido, así que su largo cambia con cada idea y con cada idioma. Esto es
     * lo que convierte «se ve bien en español» en una propiedad comprobada.
     */
    const desbordes = await seccion.locator('.vis-svg').evaluateAll((svgs) => {
      const fuera = [];
      for (const s of svgs) {
        /*
         * Se compara en COORDENADAS DE PANTALLA, no con getBBox().
         *
         * `getBBox()` devuelve la caja en el sistema del propio elemento, sin aplicar las
         * transformaciones de sus grupos padre: un rótulo colocado con `translate` salía marcado como
         * fuera del marco estando dentro. `getBoundingClientRect()` ya viene con todo aplicado.
         */
        /*
         * Solo cuenta lo VISIBLE. Varias mecánicas dejan nodos con opacidad 0 esperando su turno
         * —los cromos aún no colocados, el veredicto antes de tiempo— y marcarlos como defecto es
         * medir lo que nadie ve. La opacidad se acumula por los grupos padre, no basta la del nodo.
         */
        const visible = (el) => {
          for (let n = el; n && n !== s.parentElement; n = n.parentElement) {
            if (parseFloat(getComputedStyle(n).opacity || '1') < 0.02) return false;
          }
          return true;
        };
        const marco = s.getBoundingClientRect();
        for (const t of s.querySelectorAll('text')) {
          const c = t.getBoundingClientRect();
          if (c.width === 0 || !visible(t)) continue;
          if (c.left < marco.left - 1 || c.top < marco.top - 1
            || c.right > marco.right + 1 || c.bottom > marco.bottom + 1) {
            fuera.push(`«${(t.textContent ?? '').slice(0, 28)}»`);
          }
        }
      }
      return fuera;
    });
    if (desbordes.length) problemas.push(`[${tema}] ${titulo}: texto fuera del marco ${desbordes.join(', ')}`);

    /*
     * Cuánto del marco ocupa el dibujo. SOLO en las piezas ejercitadas.
     *
     * Al dejar de contar los nodos invisibles quedó claro que esta medida no significa nada sobre
     * una pieza recién montada: varias empiezan enseñando solo una caja —«Las cuatro verdades»
     * muestra el conjunto y nada más hasta que lo separas— y eso es su diseño, no un defecto. La
     * ocupación se mide cuando la pieza está desplegada; el desborde de texto, en cambio, se mide
     * siempre, porque un rótulo que no cabe no cabe en ningún estado.
     *
     * Varias piezas ocupaban un tercio del hueco y se leían como un diagrama pequeño en medio de una
     * lámina grande. Revisarlo a ojo pieza por pieza no escala y se olvida; medirlo sí. El umbral es
     * bajo a propósito —el 55 %— porque no se trata de llenarlo todo, sino de detectar el caso en que
     * la pieza claramente no usa el sitio que se le ha dado.
     */
    const ocupacion = await seccion.locator('.vis-svg').evaluateAll((svgs) => {
      const s = svgs.find((x) => x.tagName.toLowerCase() === 'svg');
      if (!s) return null;
      const marco = s.getBoundingClientRect();
      if (!marco.width) return null;
      let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
      const visible = (el) => {
        for (let n = el; n && n !== s.parentElement; n = n.parentElement) {
          if (parseFloat(getComputedStyle(n).opacity || '1') < 0.02) return false;
        }
        return true;
      };
      for (const el of s.querySelectorAll('*')) {
        if (typeof el.getBoundingClientRect !== 'function') continue;
        const c = el.getBoundingClientRect();
        if ((!c.width && !c.height) || !visible(el)) continue;
        x0 = Math.min(x0, c.left); y0 = Math.min(y0, c.top);
        x1 = Math.max(x1, c.right); y1 = Math.max(y1, c.bottom);
      }
      if (!Number.isFinite(x0)) return null;
      const ancho = Math.min(x1, marco.right) - Math.max(x0, marco.left);
      const alto = Math.min(y1, marco.bottom) - Math.max(y0, marco.top);
      return Math.round((ancho / marco.width) * (alto / marco.height) * 100);
    });
    if (ejercitar && ocupacion !== null && ocupacion < 55) {
      problemas.push(`[${tema}] ${titulo}: el dibujo ocupa solo el ${ocupacion} % de su marco`);
    }

    if (ejercitar) {
      const archivo = titulo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
      await seccion.screenshot({ path: `${SALIDA}/${archivo}-${tema}.png` });
    }
  }
  console.log(`medidas ${todas.length} piezas en tema ${tema} (${MUESTRA.length} ejercitadas)`);
  await contexto.close();
}

await navegador.close();

if (sinResolver.length) {
  console.error('\nPiezas que no llegaron a su estado de resolucion:');
  sinResolver.forEach((p) => console.error(`  ${p}`));
}
if (problemas.length) {
  console.error('\nProblemas:');
  problemas.forEach((p) => console.error(`  ${p}`));
}
if (problemas.length || sinResolver.length) process.exit(1);
console.log(`\nLas ${MUESTRA.length} piezas de muestra responden y alcanzan su estado de resolucion.`);
