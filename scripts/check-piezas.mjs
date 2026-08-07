#!/usr/bin/env node
/**
 * Legibilidad y manipulabilidad de las 59 piezas. Hermano de `capturar-detalle.mjs`, no sustituto.
 *
 * Aquel comprueba que las mecánicas RESPONDEN —que se pulsan, que llegan a su resolución— y que
 * ningún rótulo se sale del marco. Este comprueba tres cosas que aquel no puede ver y que son las
 * que estaban rompiendo piezas en silencio:
 *
 *  1. **Rótulos que se pisan entre sí.** Caber dentro del marco no basta: dos etiquetas pueden estar
 *     las dos dentro y encima la una de la otra. Es lo que pasa en «El significado es el uso», donde
 *     la instrucción cae sobre dos de los cuatro casos.
 *  2. **Rótulos cruzados por un trazo.** En este lenguaje gráfico el texto no lleva fondo ni halo,
 *     así que una línea que lo atraviesa lo deja ilegible. Es lo que pasa en las cuatro piezas de
 *     «red» con cuatro vínculos: los dos enlaces horizontales tachan el rótulo del centro.
 *  3. **Que la pieza se pueda leer y tocar en un móvil.** El `viewBox` es fijo y el lienzo se encoge
 *     con el ancho, así que a 390 px todo se multiplica por 0,5: los rótulos de 12 px se quedan en 6
 *     y los nodos manipulables en 9. Ninguna de las dos cosas se ve revisando en un portátil, que es
 *     exactamente por lo que llevaban ahí desde el principio.
 *
 * POR QUÉ UN SOLO TEMA. La geometría no depende del tema: los mismos rótulos en las mismas
 * posiciones, solo cambia el color. Medir los dos duplicaría el tiempo para obtener la misma
 * respuesta. El contraste y el desborde en oscuro ya los cubre `capturar-detalle.mjs`.
 *
 *   npm run dev        (en otra terminal)
 *   npm run revisar:piezas
 */

import { chromium } from 'playwright';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173/galeria.html';

/**
 * Umbrales. Son mínimos de legibilidad, no aspiraciones:
 *  - 11 px es donde un rótulo en versalitas con espaciado deja de leerse de un vistazo.
 *  - 24 px es el mínimo de diana táctil de la WCAG 2.2 AA. Los 44 recomendados son el objetivo,
 *    pero fallar por debajo de 44 marcaría en rojo piezas que ya son usables, y una comprobación
 *    que siempre falla se acaba ignorando.
 */
const MIN_CUERPO_PX = Number(process.env.MIN_CUERPO ?? 11);
const MIN_DIANA_PX = Number(process.env.MIN_DIANA ?? 24);

/**
 * Cuánto se tolera de solape antes de llamarlo defecto, como fracción del rótulo más pequeño.
 *
 * No es cero porque las cajas de `getBoundingClientRect()` de un `<text>` incluyen el interlineado y
 * el espaciado entre letras, y dos rótulos que se rozan por un píxel se leen perfectamente.
 *
 * El 3 % está calibrado, no elegido: al 12 % se escapaban los dos solapes de «El significado es el
 * uso», donde la instrucción cae sobre dos de los cuatro casos y se ve a simple vista con solo un
 * 6 % de área compartida. Un rótulo en versalitas es casi todo aire, así que el porcentaje de caja
 * pisada infravalora lo tapado que queda el texto. Bajando a 3 % entran esos dos y no aparece ningún
 * falso positivo en las 59. Queda regulable porque el suelo de ruido depende de cómo renderice las
 * fuentes cada máquina.
 */
const TOLERANCIA_SOLAPE = Number(process.env.TOLERANCIA_SOLAPE ?? 0.03);

/** Se encoge la caja del rótulo antes de buscar trazos que la crucen, por el mismo motivo. */
const MARGEN_TRAZO = Number(process.env.MARGEN_TRAZO ?? 3);

/**
 * Los hallazgos se agrupan por CLASE, no por pieza.
 *
 * La primera versión escupía una línea por pieza y por defecto: 45 avisos idénticos de «rótulo de
 * 6,3 px» —que son un solo hecho, el `viewBox` fijo— enterraban los 7 defectos de maquetado, que son
 * 7 arreglos distintos. Agrupado, el informe se lee como lo que hay que hacer y no como una lista de
 * síntomas.
 */
const hallazgos = new Map();
function anotar(clase, pieza, detalle) {
  if (!hallazgos.has(clase)) hallazgos.set(clase, []);
  hallazgos.get(clase).push({ pieza, detalle });
}
const problemas = [];

/**
 * Todo lo que se mide dentro de la página va aquí, en una sola función.
 *
 * Se pasa como texto a `evaluate` y por eso no puede usar nada del módulo: es otro proceso. A cambio
 * mide sobre el DOM real y ya renderizado, que es la única forma de saber qué ancho ocupa de verdad
 * un rótulo después de partirse en líneas y de reducirse de cuerpo.
 *
 * EL PRIMER PARÁMETRO ES LA PIEZA, no la configuración: `locator.evaluate` entrega siempre el
 * elemento delante de lo que uno le pase. Escrita con un solo parámetro, la función recibía el nodo
 * donde esperaba los umbrales, todas las comparaciones se hacían contra `undefined` —y en JavaScript
 * eso es `false`, no un error— así que el script daba verde sobre defectos verificados a ojo. Una
 * comprobación que no puede fallar es peor que ninguna, porque además da confianza.
 */
function medirEnLaPagina(pieza, cfg) {
  const { MIN_CUERPO_PX, MIN_DIANA_PX, TOLERANCIA_SOLAPE, MARGEN_TRAZO, movil } = cfg;

  /*
   * Solo cuenta lo VISIBLE, y la opacidad se acumula por los grupos padre.
   *
   * Varias mecánicas dejan nodos esperando su turno con opacidad 0 —el veredicto antes de tiempo,
   * los cromos aún sin colocar— y medirlos es medir lo que nadie ve. Mismo criterio que en
   * `capturar-detalle.mjs`, a propósito: dos scripts que discrepan sobre qué es visible acaban
   * dando dos respuestas distintas sobre la misma pieza.
   */
  const visible = (el, tope) => {
    for (let n = el; n && n !== tope; n = n.parentElement) {
      if (parseFloat(getComputedStyle(n).opacity || '1') < 0.02) return false;
      if (getComputedStyle(n).display === 'none') return false;
    }
    return true;
  };

  const seCruzan = (a, b) => {
    const ancho = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const alto = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (ancho <= 0 || alto <= 0) return 0;
    const menor = Math.min(a.width * a.height, b.width * b.height);
    return menor > 0 ? (ancho * alto) / menor : 0;
  };

  /*
   * Un segmento contra un rectángulo.
   *
   * Se usa la geometría real del `<line>` —sus dos extremos transformados a pantalla— y no su caja
   * envolvente. La caja de una línea diagonal es un rectángulo enorme que toca medio dibujo, así que
   * comparar cajas marcaría como defecto casi todos los rótulos de casi todas las piezas. Con el
   * segmento de verdad, lo que salta es lo que de verdad pasa por encima del texto.
   */
  const cruzaElSegmento = (p1, p2, r) => {
    const dentro = (p) => p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
    if (dentro(p1) || dentro(p2)) return true;
    const lado = (ax, ay, bx, by) => {
      const d1 = (p2.x - p1.x) * (ay - p1.y) - (p2.y - p1.y) * (ax - p1.x);
      const d2 = (p2.x - p1.x) * (by - p1.y) - (p2.y - p1.y) * (bx - p1.x);
      const d3 = (bx - ax) * (p1.y - ay) - (by - ay) * (p1.x - ax);
      const d4 = (bx - ax) * (p2.y - ay) - (by - ay) * (p2.x - ax);
      return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
    };
    return lado(r.left, r.top, r.right, r.top)
      || lado(r.right, r.top, r.right, r.bottom)
      || lado(r.right, r.bottom, r.left, r.bottom)
      || lado(r.left, r.bottom, r.left, r.top);
  };

  const resultado = { solapes: [], cruces: [], cuerpoMin: null, dianas: [], tactoSuelto: [], huecos: [] };

  /*
   * Un campo que la ficha no trae acaba pintado en pantalla como «undefined», y ahí se queda.
   *
   * «La voluntad y el pesimismo» rotuló durante meses uno de los dos extremos de su péndulo con la
   * palabra «undefined», en los dos idiomas, porque el tipo declaraba `hastio` y ninguna de las dos
   * fichas lo tenía: el `as` de `registro.ts` desactiva la comprobación de tipos justo en la frontera
   * entre el contenido y el código. Ni el validador de contenido ni el compilador pueden verlo, y
   * geométricamente no hay nada que objetar: la palabra cabe perfectamente en su sitio.
   *
   * Se mira tanto en SVG como en `canvas` no —de ahí que también se recorra el DOM de controles—,
   * porque el defecto sale del contenido y puede aparecer en cualquier técnica.
   */
  const HUECOS = /\b(undefined|null|NaN|\[object Object\])\b/;
  for (const el of pieza.querySelectorAll('text, .vis-controles button, .vis-resolucion, .vis-alternativa')) {
    const t = el.textContent ?? '';
    if (HUECOS.test(t)) resultado.huecos.push(t.slice(0, 40));
  }
  // Solo los de ESTA pieza: sobre `document` cada una heredaría los defectos de las otras 58.
  const svgs = [...pieza.querySelectorAll('.vis-svg')].filter((s) => s.tagName.toLowerCase() === 'svg');

  for (const s of svgs) {
    /*
     * La escala sale de la matriz de pantalla, no de dividir anchuras.
     *
     * `getBoundingClientRect()` devuelve la caja YA TRANSFORMADA, así que en el visor —que gira su
     * contenido un cuarto de vuelta— el ancho de pantalla es en realidad el alto de la pieza, y
     * dividirlo por el ancho del `viewBox` daba 0,57 donde la escala real era 1,46. La matriz
     * describe la transformación completa y vale igual con giro y sin él.
     */
    const m = s.getScreenCTM();
    if (!m) continue;
    const escala = Math.sqrt(m.a * m.a + m.b * m.b);
    if (!escala) continue;

    const textos = [...s.querySelectorAll('text')]
      .filter((t) => visible(t, s.parentElement))
      .map((t) => ({ el: t, caja: t.getBoundingClientRect() }))
      .filter((t) => t.caja.width > 0 && t.caja.height > 0);

    // 1. rótulo contra rótulo
    for (let i = 0; i < textos.length; i++) {
      for (let j = i + 1; j < textos.length; j++) {
        const fraccion = seCruzan(textos[i].caja, textos[j].caja);
        if (fraccion > TOLERANCIA_SOLAPE) {
          resultado.solapes.push({
            a: (textos[i].el.textContent ?? '').slice(0, 24),
            b: (textos[j].el.textContent ?? '').slice(0, 24),
            pct: Math.round(fraccion * 100),
          });
        }
      }
    }

    // 2. rótulo contra trazo
    const lineas = [...s.querySelectorAll('line')].filter((l) => {
      if (!visible(l, s.parentElement)) return false;
      /*
       * Una tachadura cruza su rótulo porque ese es su trabajo: en «margen» los apoyos que no
       * existen se nombran y se anulan en el mismo gesto. La pieza lo declara con `data-tachadura`
       * y aquí se respeta. Es la única excepción prevista, y tiene que estar escrita en el código
       * de la pieza: una lista de excepciones viviendo en el comprobador se queda desfasada sola.
       */
      if (l.hasAttribute('data-tachadura')) return false;
      // Un vínculo ya cortado se dibuja casi transparente: no tacha nada y no cuenta.
      return parseFloat(l.getAttribute('opacity') ?? '1') >= 0.35;
    });
    for (const l of lineas) {
      const m = l.getScreenCTM();
      if (!m) continue;
      const punto = (x, y) => new DOMPoint(x, y).matrixTransform(m);
      const p1 = punto(parseFloat(l.getAttribute('x1')), parseFloat(l.getAttribute('y1')));
      const p2 = punto(parseFloat(l.getAttribute('x2')), parseFloat(l.getAttribute('y2')));
      if (!Number.isFinite(p1.x) || !Number.isFinite(p2.x)) continue;
      for (const t of textos) {
        const r = {
          left: t.caja.left + MARGEN_TRAZO, right: t.caja.right - MARGEN_TRAZO,
          top: t.caja.top + MARGEN_TRAZO, bottom: t.caja.bottom - MARGEN_TRAZO,
        };
        if (r.right <= r.left || r.bottom <= r.top) continue;
        if (cruzaElSegmento(p1, p2, r)) {
          resultado.cruces.push({ texto: (t.el.textContent ?? '').slice(0, 24) });
        }
      }
    }

    if (!movil) continue;

    // 3a. cuerpo efectivo del rótulo más pequeño
    for (const t of textos) {
      const cuerpo = parseFloat(getComputedStyle(t.el).fontSize) * escala;
      if (resultado.cuerpoMin === null || cuerpo < resultado.cuerpoMin) resultado.cuerpoMin = cuerpo;
    }

    // 3b. diana de lo manipulable, y si el navegador se queda el gesto
    for (const el of s.querySelectorAll('.vis-interactivo, [role="slider"], [role="button"]')) {
      if (!visible(el, s.parentElement)) continue;
      const c = el.getBoundingClientRect();
      if (!c.width && !c.height) continue;
      if (c.width < MIN_DIANA_PX || c.height < MIN_DIANA_PX) {
        resultado.dianas.push(`${Math.round(c.width)}x${Math.round(c.height)}`);
      }
      /*
       * `touch-action: auto` significa que el navegador se queda el gesto y hace scroll: en un móvil
       * la pieza no se puede arrastrar.
       *
       * SE MIRA EN LA RAÍZ DEL SVG, no en el tirador, y eso costó una vuelta entera. La propiedad no
       * se aplica a las formas hijas de un SVG —solo a la raíz— así que un `touch-action: none` sobre
       * el círculo se queda en `auto` por mucho que la hoja de estilo lo declare, y el comprobador
       * seguía dando el mismo aviso sobre una pieza ya arreglada. Medir donde la propiedad no surte
       * efecto es no medir nada.
       *
       * Se revisa todo lo que declare `role="slider"` aunque no tenga manejador de arrastre: el rol
       * promete un tirador, y las dos salidas válidas son darle arrastre o dejar de llamarlo así.
       */
      if (el.getAttribute('role') === 'slider') {
        const raizSvg = el.ownerSVGElement ?? s;
        if (getComputedStyle(raizSvg).touchAction === 'auto') {
          resultado.tactoSuelto.push(el.getAttribute('aria-label') ?? 'tirador');
        }
      }
    }
  }

  if (resultado.cuerpoMin !== null) resultado.cuerpoMin = Math.round(resultado.cuerpoMin * 10) / 10;
  resultado.cuerpoInsuficiente = resultado.cuerpoMin !== null && resultado.cuerpoMin < MIN_CUERPO_PX;
  return resultado;
}

/** Recorre la galería entera esperando pieza a pieza, porque el montaje es diferido. */
async function recorrer(navegador, { ancho, alto, movil, etiqueta }) {
  const contexto = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    colorScheme: 'light',
    hasTouch: movil,
    isMobile: movil,
  });
  const pagina = await contexto.newPage();
  pagina.on('pageerror', (e) => problemas.push(`[${etiqueta}] error de pagina: ${e.message}`));

  await pagina.goto(URL_BASE, { waitUntil: 'networkidle' });
  await pagina.waitForSelector('.pieza', { timeout: 30000 });
  await pagina.waitForTimeout(600);

  const titulos = await pagina.locator('.pieza h2').allTextContents();
  if (titulos.length < 50) problemas.push(`[${etiqueta}] la galeria solo lista ${titulos.length} piezas`);

  const cfg = { MIN_CUERPO_PX, MIN_DIANA_PX, TOLERANCIA_SOLAPE, MARGEN_TRAZO, movil };

  for (const titulo of titulos) {
    const seccion = pagina.locator('.pieza', { has: pagina.locator('h2', { hasText: titulo }) }).first();
    // Se desplaza con el DOM: `scrollIntoViewIfNeeded()` espera a que la caja esté «estable» y varias
    // piezas se mueven solas para siempre, así que la espera salía bien o mal según el fotograma. Ver
    // el arco largo en `capturar-detalle.mjs`.
    await seccion.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    /*
     * Una pieza que cae al respaldo estático también cuenta como montada. Exigir un SVG dejaría el
     * script colgado veinte segundos en cada escena 3D, que no tiene ninguno.
     */
    await seccion.locator('.vis-svg, .vis-canvas, .vis-controles, .vis-respaldo').first()
      .waitFor({ timeout: 20000 })
      .catch(() => problemas.push(`[${etiqueta}] no se monto: ${titulo}`));
    await pagina.waitForTimeout(500);

    const r = await seccion.evaluate(medirEnLaPagina, cfg);

    /*
     * Los defectos de maquetado se anotan UNA sola vez, en la pasada de escritorio.
     *
     * La geometría es la misma a los dos anchos —el `viewBox` escala entera— así que anotarlos otra
     * vez en móvil duplicaría cada línea sin añadir un solo dato. En móvil solo se anota lo que solo
     * existe en móvil: el cuerpo, la diana y el gesto.
     */
    if (!movil) {
      for (const h of [...new Set(r.huecos)]) {
        anotar('Campo de contenido que falta, escrito en pantalla', titulo, `«${h}»`);
      }
      // Un mismo par de rótulos se cuenta una vez aunque la pieza tenga varios SVG.
      const vistos = new Set();
      for (const s of r.solapes) {
        const clave = [s.a, s.b].sort().join('|');
        if (vistos.has(clave)) continue;
        vistos.add(clave);
        anotar('Rotulos que se pisan', titulo, `«${s.a}» y «${s.b}» (${s.pct} %)`);
      }
      for (const c of [...new Set(r.cruces.map((x) => x.texto))]) {
        anotar('Rotulos cruzados por un trazo', titulo, `«${c}»`);
      }
      continue;
    }

    for (const t of [...new Set(r.tactoSuelto)]) {
      anotar('Arrastre que el movil se queda', titulo, `tirador «${t}»`);
    }

    /*
     * EN MÓVIL SE MIDE EL VISOR, NO EL PANEL. Aquí cambió lo que hay que exigir.
     *
     * Dentro de la página la pieza se dibuja a media escala y no hay número que la salve: la
     * composición es de 560×240 y el panel da 279 de ancho. Lo que el sitio promete ahora es otra
     * cosa —que desde ahí se llegue a una vista donde SÍ se lee y se toca— así que se comprueban las
     * dos mitades de esa promesa: que el botón exista, y que al otro lado se cumplan los mínimos.
     *
     * Medir el panel y darlo por defecto, como se hacía antes, marcaría en rojo 48 piezas que ya
     * tienen salida y dejaría sin vigilar la vista que de verdad se usa para leerlas.
     */
    const ampliar = seccion.locator('.ampliar');
    if (!(await ampliar.count())) {
      anotar('Sin salida a pantalla completa', titulo, 'no ofrece el visor');
      continue;
    }
    await ampliar.click();
    await pagina.waitForTimeout(500);

    const visor = pagina.locator('.visor .superficie');
    if (!(await visor.count())) {
      anotar('Sin salida a pantalla completa', titulo, 'el visor no llego a abrirse');
      continue;
    }
    const rv = await visor.evaluate(medirEnLaPagina, cfg);
    if (rv.cuerpoInsuficiente) {
      anotar('Ilegible incluso a pantalla completa', titulo, `${rv.cuerpoMin} px`);
    }
    if (rv.dianas.length) {
      anotar('Dianas pequenas a pantalla completa', titulo,
        `${rv.dianas.length} (la peor ${[...new Set(rv.dianas)][0]})`);
    }

    await pagina.keyboard.press('Escape');
    await pagina.waitForTimeout(350);
  }

  console.log(`revisadas ${titulos.length} piezas a ${ancho} px (${etiqueta})`);
  await contexto.close();
}

const navegador = await chromium.launch();
await recorrer(navegador, { ancho: 1280, alto: 1000, movil: false, etiqueta: 'escritorio' });
await recorrer(navegador, { ancho: 390, alto: 844, movil: true, etiqueta: 'movil' });
await navegador.close();

/**
 * Un defecto sistémico —el mismo en casi todas— es UN arreglo, no cincuenta. Se dice así: el titular
 * lleva la cuenta de piezas y el detalle solo se despliega cuando son pocas y hay que ir a mirarlas
 * una a una. Por encima de doce, la lista completa no ayuda a decidir nada.
 */
const LIMITE_DETALLE = 12;

let total = 0;
for (const [clase, lista] of hallazgos) {
  total += lista.length;
  console.error(`\n${clase} — ${lista.length} ${lista.length === 1 ? 'pieza' : 'piezas'}`);
  if (lista.length > LIMITE_DETALLE) {
    console.error(`  sistemico: afecta a ${lista.length} de 59. Se arregla en el lenguaje comun, no pieza a pieza.`);
    console.error(`  p. ej. ${lista.slice(0, 3).map((h) => `${h.pieza} (${h.detalle})`).join('; ')}`);
    continue;
  }
  for (const h of lista) console.error(`  ${h.pieza}: ${h.detalle}`);
}
for (const p of problemas) console.error(`\n${p}`);

if (total || problemas.length) {
  console.error(`\n${total + problemas.length} hallazgos en ${hallazgos.size} clases.`);
  process.exit(1);
}
console.log('\nNingun rotulo se pisa ni queda cruzado, y las 59 piezas se leen y se tocan en movil.');
