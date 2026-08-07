/**
 * Pieza propia — «El mal como privación» (Agustín, corriente escolástica).
 *
 * POR QUÉ NO ES UNA MECÁNICA COMPARTIDA. La afirmación es sobre un fenómeno óptico: que oscurecer
 * añadiendo algo y oscurecer quitando luz dan un resultado idéntico, y que solo uno de los dos se
 * puede describir. Eso no se puede parametrizar sobre una mecánica de clasificar o de poner a
 * prueba, porque el argumento no está en el texto sino en que las dos escenas se vean iguales. La
 * pieza anterior pedía «di de qué está hecho el mal» y descartaba respuestas escritas: afirmaba la
 * conclusión en vez de dejar comprobarla.
 *
 * LA IGUALDAD ES ARITMÉTICA, Y COSTÓ QUE LO FUERA. El primer montaje superponía negro sobre la
 * escena y bajaba la luz en la otra mitad, dando por hecho que era lo mismo. No lo es: el velo
 * negro oscurece también la superficie de alrededor y llega al negro puro, mientras que bajar la
 * luz deja la superficie intacta. Las dos mitades habrían divergido a ojos vista, que es justo lo
 * único que esta pieza no se puede permitir.
 *
 * Se cierra si el velo tiene el color de la superficie sin iluminar, y entonces la igualdad es
 * exacta. Con base opaca B, luz de color S y opacidad a:
 *
 *   añadir sustancia   ->  [B(1−a) + S·a]·(1−k) + B·k  =  B·[1 − a(1−k)] + S·a(1−k)
 *   retirar luz        ->  B·[1 − a(1−k)] + S·a(1−k)
 *
 * Son la misma expresión, no dos aproximaciones parecidas: medidas con un cuentagotas dan el mismo
 * valor para cualquier k. La demostración depende de eso, así que hay una comprobación que lo mide.
 *
 * Lo que las separa aparece solo al examinar: la mitad de la sustancia no tiene nada que enumerar
 * —no hay componentes que mostrar— y la de la luz sí, porque lo que falta es medible.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from './lenguaje';
import type { Visualizacion } from './lenguaje';

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosPrivacion {
  etiqueta: string;
  /** Título de la mitad que se oscurece añadiendo algo. */
  sustancia: string;
  /** Título de la mitad que se oscurece retirando luz. */
  privacion: string;
  /** Instrucción del control que oscurece las dos a la vez. */
  oscurecer: string;
  /** Botón que pide la composición de cada mitad. */
  examinar: string;
  /** Lo que se obtiene al examinar la sustancia: nada que enumerar. */
  sinComponentes: string;
  /** Lo que se obtiene al examinar la privación. Recibe el porcentaje que falta. */
  faltaLuz: string;
  /** Confirmación de que las dos mitades tienen la misma luminosidad. */
  identicas: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;
/** Opacidad de la luz con la escena entera iluminada. Es la `a` de la deducción de la cabecera. */
const LUZ = 0.95;

export function crearElMalComoPrivacion(contenedor: HTMLElement, t: TextosPrivacion): Visualizacion {
  const paleta = paletaDe('escolastica');
  /*
   * La escena resuelve sus colores contra el tema OSCURO siempre, y no por capricho: el escenario es
   * una superficie oscura en los dos temas, y los tres roles de color se definen respecto del fondo
   * sobre el que caen. Con la paleta del tema claro, `senal` es el color del texto —casi negro— y la
   * luz de la escena salía a #1A1917 sobre una superficie #17161C: medido, la escena entera se movía
   * de rgb(26,25,23) a rgb(23,22,28) al oscurecerla del todo. No había nada que ver.
   *
   * Los rótulos y el marco siguen usando la paleta de la página, porque están fuera del escenario y
   * caen sobre el fondo del documento.
   */
  const luzPaleta = paletaDe('escolastica', 'oscuro');
  let k = 0;
  let examinado = false;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': t.etiqueta,
  }) as SVGSVGElement;

  // Cada mitad necesita su propio degradado: son dos escenas independientes, no una espejada.
  const defs = svg('defs');
  function degradado(id: string): SVGElement {
    const rg = svg('radialGradient', { id });
    const a = svg('stop', { offset: '0%', 'stop-color': luzPaleta.senal, 'stop-opacity': String(LUZ) });
    const b = svg('stop', { offset: '100%', 'stop-color': luzPaleta.senal, 'stop-opacity': '0' });
    rg.append(a, b);
    defs.append(rg);
    return a;
  }
  const paradaIzq = degradado('luz-sustancia');
  const paradaDer = degradado('luz-privacion');
  raiz.append(defs);

  const anchoMitad = 236;
  const yMitad = 46;
  const altoMitad = 130;
  const xIzq = 36;
  const xDer = ANCHO - 36 - anchoMitad;

  /*
   * La superficie sin iluminar. Es oscura en los dos temas a propósito: no es cromo de la interfaz
   * sino una escena, y el asunto de la escena es cuánta luz llega. En tema claro un escenario claro
   * dejaría «oscurecer» sin nada que hacer.
   */
  const SUPERFICIE = '#17161C';

  function mitad(x: number, titulo: string, gradiente: string) {
    const marco = svg('rect', {
      x, y: yMitad, width: anchoMitad, height: altoMitad, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    const base = svg('rect', { x, y: yMitad, width: anchoMitad, height: altoMitad, fill: SUPERFICIE });
    const luz = svg('ellipse', {
      cx: x + anchoMitad / 2, cy: yMitad + altoMitad / 2, rx: anchoMitad / 2.3, ry: altoMitad / 2.2,
      fill: `url(#${gradiente})`,
    });
    // El velo es del color de la superficie, no negro: es la condición de la que depende que las dos
    // mitades den el mismo valor. Ver la deducción en la cabecera.
    const velo = svg('rect', { x, y: yMitad, width: anchoMitad, height: altoMitad, fill: SUPERFICIE, opacity: 0 });
    raiz.append(base, luz, velo, marco);
    rotulo(raiz, titulo, { x: x + anchoMitad / 2, y: yMitad - 14, ancho: anchoMitad, color: paleta.neutro, interlineado: 12, maxLineas: 2 });
    return { velo, marco };
  }

  const izq = mitad(xIzq, t.sustancia, 'luz-sustancia');
  // La mitad derecha no necesita que se la retenga: oscurece bajando su propia luz, sin velo.
  mitad(xDer, t.privacion, 'luz-privacion');

  /*
   * Las dos lecturas se reparten el pie entero y admiten cuatro líneas. Con el ancho de su mitad y
   * tres líneas, la de la sustancia se salía 16 px por la izquierda: es la más larga de las dos
   * porque tiene que enumerar todo lo que NO hay, y eso no se puede acortar sin perder el argumento.
   */
  const anchoPie = anchoMitad + 24;
  const lecturaIzq = rotuloMutable(raiz, {
    x: xIzq + anchoMitad / 2, y: yMitad + altoMitad + 26, ancho: anchoPie, color: paleta.acento, interlineado: 12, maxLineas: 4,
  });
  const lecturaDer = rotuloMutable(raiz, {
    x: xDer + anchoMitad / 2, y: yMitad + altoMitad + 26, ancho: anchoPie, color: paleta.acento, interlineado: 12, maxLineas: 4,
  });

  marcarInteractivo(izq.marco, paleta);
  izq.marco.setAttribute('stroke-dasharray', '');

  // ---- Controles ---------------------------------------------------------------------------
  const controles = document.createElement('div');
  controles.className = 'vis-controles';

  const campo = document.createElement('label');
  campo.className = 'vis-campo';
  const texto = document.createElement('span');
  texto.textContent = t.oscurecer;
  const mando = document.createElement('input');
  mando.type = 'range';
  mando.min = '0';
  mando.max = '100';
  mando.value = '0';
  mando.setAttribute('aria-label', t.oscurecer);
  mando.addEventListener('input', () => { k = Number(mando.value) / 100; pintar(); });
  campo.append(texto, mando);
  controles.append(campo);

  const bExaminar = document.createElement('button');
  bExaminar.type = 'button';
  bExaminar.textContent = t.examinar;
  bExaminar.addEventListener('click', () => {
    examinado = true;
    pintar();
    resolver(contenedor, t.resolucion);
  });
  controles.append(bExaminar);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, t.alternativaTexto);

  function pintar(): void {
    /*
     * Las dos operaciones. Cada mitad usa solo la suya: la izquierda no toca su luz y la derecha no
     * tiene velo. Que coincidan es consecuencia de la aritmética, no de moverlas a la vez.
     */
    izq.velo.setAttribute('opacity', k.toFixed(4));
    paradaIzq.setAttribute('stop-opacity', String(LUZ));
    paradaDer.setAttribute('stop-opacity', (LUZ * (1 - k)).toFixed(4));

    if (!examinado) {
      const mismo = k > 0.02 ? t.identicas : '';
      lecturaIzq.poner(mismo);
      lecturaDer.poner('');
      return;
    }
    lecturaIzq.poner(t.sinComponentes);
    lecturaDer.poner(t.faltaLuz.replace('{porcentaje}', String(Math.round(k * 100))));
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
