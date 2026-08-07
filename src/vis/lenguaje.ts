/**
 * Lenguaje gráfico común de las visualizaciones.
 *
 * Implementa las reglas de docs/FASE-3-DISENO.md §3. Toda visualización —SVG, física o 3D— pasa por
 * aquí, y ese es el motivo por el que 59 piezas distintas se sienten del mismo sistema. Si una
 * visualización necesita saltarse una de estas funciones, la regla está mal o la pieza está mal;
 * no se resuelve con una excepción local.
 */

import corrientesDoc from '../../content/es/corrientes.json';
/*
 * El rótulo del pliegue es texto visible, y el texto visible viene de la ficha de idioma como todo
 * lo demás. Obliga a que cualquier banco de pruebas que monte piezas cargue antes las cadenas, que
 * es justo lo que hace que el banco se parezca al sitio.
 */
import { T } from '../app/textos';

export const TRAZO = { fino: 1, base: 1.5, enfasis: 3 } as const;

/**
 * Radio mínimo de un nodo que se toca, en unidades del `viewBox`.
 *
 * Sale de una cuenta y no del gusto: dentro del visor a pantalla completa la escala se queda entre
 * 1,1 y 1,35 —depende de cuánto alto se lleven los controles de cada pieza— y el mínimo táctil de la
 * WCAG son 24 píxeles. Con radio 9 los nodos se quedaban entre 20 y 23,8: cerca, pero por debajo en
 * las seis piezas de red y en el rastreo temporal. Con 11 pasan de 24 incluso en el caso peor.
 *
 * Quien necesite un nodo más grande puede, pero por debajo de esto no: deja de poder tocarse.
 */
export const RADIO_TACTIL = 11;

/** §3.1 Regla de tres colores: nunca más roles que estos. */
export interface Paleta {
  neutro: string;
  acento: string;
  senal: string;
}

export type Tema = 'claro' | 'oscuro';

export function temaActual(): Tema {
  const explicito = document.documentElement.dataset.tema;
  if (explicito === 'claro' || explicito === 'oscuro') return explicito;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

export function movimientoReducido(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * El acento sale de corrientes.json, que declara uno por tema. La señal semántica es única por
 * pieza y se deriva del acento rotándolo, no se elige a mano: así ninguna visualización introduce
 * un color ajeno al sistema.
 */
export function paletaDe(corrienteId: string, tema: Tema = temaActual()): Paleta {
  const corriente = corrientesDoc.corrientes.find((c) => c.id === corrienteId);
  if (!corriente) throw new Error(`Corriente desconocida: ${corrienteId}`);
  const acento = corriente.color_acento[tema];
  return {
    neutro: tema === 'claro' ? '#5C5850' : '#A8A39A',
    acento,
    senal: tema === 'claro' ? '#1A1917' : '#EDEBE6',
  };
}

/**
 * Cómo se manipula la pieza. No es un detalle de estilo: decide el cursor, y el cursor es la única
 * instrucción que la mayoría de la gente llega a leer.
 */
export type ModoInteraccion = 'clic' | 'arrastre';

/**
 * Marca inequívoca de "esto se puede manipular". Idéntica en las 59 piezas (§3.4).
 *
 * EL MODO ES OBLIGATORIO DECLARARLO, y por omisión es el clic porque es lo que hacen 32 de las 35
 * piezas. Antes no existía y la hoja de estilo ponía `cursor: grab` a todo lo marcado, así que casi
 * todo el sitio invitaba a arrastrar cosas que solo respondían al clic. No es que faltara afordancia:
 * es que la que había mentía, y una promesa incumplida enseña a desconfiar del resto de la escena.
 */
export function marcarInteractivo(
  el: SVGElement | HTMLElement,
  paleta: Paleta,
  modo: ModoInteraccion = 'clic',
): void {
  el.classList.add('vis-interactivo');
  el.classList.add(modo === 'arrastre' ? 'vis-arrastrable' : 'vis-pulsable');
  el.setAttribute('tabindex', '0');
  if (el instanceof SVGElement) {
    el.setAttribute('stroke-dasharray', '4 3');
    el.setAttribute('stroke', paleta.acento);
    el.setAttribute('stroke-width', String(TRAZO.base));
  }
}

/**
 * Deja que el dedo arrastre en horizontal sin secuestrar el desplazamiento de la página.
 *
 * Sin esto, `touch-action` vale `auto` y el navegador se queda cualquier gesto táctil para hacer
 * scroll: en un móvil los tiradores no se movían, y como el manejador de `pointermove` deja de
 * recibir eventos a mitad de gesto, la pieza se quedaba además creyendo que seguía arrastrando.
 *
 * `pan-y` y no `none` a propósito, y va en la raíz del SVG y no solo en el tirador: estas piezas
 * escuchan la pulsación en todo el lienzo —se puede mover la frontera pulsando en cualquier punto
 * del eje— así que con `none` el gráfico se convertiría en un agujero de varios centímetros donde la
 * página no se puede desplazar. Con `pan-y` el gesto vertical sigue siendo de la página y el
 * horizontal es de la pieza, que es exactamente el reparto que corresponde a un eje horizontal.
 */
export function arrastreHorizontal(raiz: SVGSVGElement): void {
  raiz.style.touchAction = 'pan-y';
}

/**
 * §3.3 Entrada idéntica en todas: el trazo se dibuja solo, después aparecen escalonados los
 * elementos manipulables, y un único pulso de afordancia sobre el primero. Uno, y no se repite.
 */
export function entrada(raiz: SVGSVGElement | HTMLElement): void {
  const reducido = movimientoReducido();
  const trazos = raiz.querySelectorAll<SVGGeometryElement>('[data-trazo]');

  for (const trazo of trazos) {
    const largo = typeof trazo.getTotalLength === 'function' ? trazo.getTotalLength() : 0;
    if (!largo || reducido) continue;
    trazo.style.strokeDasharray = `${largo}`;
    trazo.style.strokeDashoffset = `${largo}`;
    trazo.animate(
      [{ strokeDashoffset: largo }, { strokeDashoffset: 0 }],
      { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' },
    );
  }

  const manipulables = raiz.querySelectorAll<SVGElement | HTMLElement>('.vis-interactivo');
  manipulables.forEach((el, i) => {
    if (reducido) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: 400, delay: 900 + i * 60, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
    );
  });

  /*
   * La afordancia RESPIRA hasta que alguien toca algo, en vez de dar un único aviso y callarse.
   *
   * Antes era un pulso a los 1400 ms y se acabó. El problema es cuándo ocurre: la pieza se monta al
   * asomar por el borde inferior de la pantalla —el observador tiene 300 px de margen— así que el
   * aviso se gasta mientras el lector sigue bajando y todavía está leyendo la cita. Cuando llega a
   * mirarla, la escena lleva rato quieta y no queda nada que diga que responde.
   *
   * Solo opacidad, y a propósito. Una animación que mueva o escale cambia la caja del elemento, y
   * eso deja el dibujo permanentemente «inestable»: las capturas de las pruebas esperan a que se
   * quede quieto y se quedarían esperando. La opacidad no toca la geometría.
   *
   * Se para al primer gesto, sea cual sea y caiga donde caiga —el lienzo o los botones, que viven
   * fuera del SVG—: quien ya ha entendido que esto se toca no necesita que se lo sigan diciendo.
   */
  const primero = manipulables[0];
  if (primero && !reducido) {
    const latido = primero.animate(
      [{ opacity: 1 }, { opacity: 0.45 }, { opacity: 1 }],
      { duration: 2400, delay: 1200, iterations: Infinity, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    );
    const zona = raiz.parentElement ?? raiz;
    const callar = (): void => latido.cancel();
    zona.addEventListener('pointerdown', callar, { once: true });
    zona.addEventListener('keydown', callar, { once: true });
  }
}

/**
 * §3.5 Estado de resolución. Igual en las 59: la escena se asienta y aparece una línea de texto.
 * Sin puntuación, sin felicitación, sin sonido. La recompensa es haber entendido.
 */
export function resolver(contenedor: HTMLElement, texto: string): void {
  let aviso = contenedor.querySelector<HTMLElement>('.vis-resolucion');
  if (!aviso) {
    aviso = document.createElement('p');
    aviso.className = 'vis-resolucion';
    aviso.setAttribute('role', 'status');
    /*
     * La resolución va DELANTE de la alternativa textual, no detrás.
     *
     * Colgándola al final quedaba debajo de un párrafo que ya había contado la conclusión —«demuestra
     * que la identidad puede residir en su patrón»— antes de que nadie tocara nada. El orden era el
     * inverso del que hace falta: primero el destripe, después el premio por haberlo averiguado solo.
     */
    const alternativa = contenedor.querySelector('.vis-alternativa');
    if (alternativa) alternativa.before(aviso);
    else contenedor.append(aviso);
  }
  if (aviso.textContent === texto) return;
  aviso.textContent = texto;
  if (!movimientoReducido()) {
    aviso.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
  }
  /*
   * La pieza anuncia que ha respondido; quien decide qué hacer con eso es la página.
   *
   * Se avisa con un evento y no tocando la sección de la idea desde aquí: esta capa es el lenguaje
   * gráfico y no sabe —ni debe saber— que existe un recorrido con una salida a la idea siguiente. La
   * galería y el banco de prototipos montan las mismas piezas sin nada de eso alrededor.
   *
   * Salta también con las resoluciones intermedias, que es lo que se quiere: el usuario ya ha
   * manipulado algo y ha obtenido respuesta, y ese es el momento de enseñarle que hay más.
   */
  contenedor.dispatchEvent(new CustomEvent('pieza-resuelta', { bubbles: true }));
}

export function svg(tag: string, attrs: Record<string, string | number> = {}): SVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

/**
 * Lienzo de medición. Vive fuera de la vista y solo sirve para preguntar cuánto mide un texto.
 *
 * Hace falta porque `getComputedTextLength()` devuelve 0 en un nodo que no está en el documento, y
 * las piezas construyen su SVG entero antes de insertarlo. Medir aquí funciona en cualquier orden.
 */
let regla: SVGTextElement | null = null;
function medirTexto(texto: string, clase: string): number {
  if (!regla) {
    const lienzo = svg('svg', {
      width: 0, height: 0,
      style: 'position:absolute;visibility:hidden;pointer-events:none',
      'aria-hidden': 'true',
    }) as SVGSVGElement;
    regla = svg('text') as SVGTextElement;
    lienzo.append(regla);
    document.body.append(lienzo);
  }
  regla.setAttribute('class', clase);
  regla.textContent = texto;
  return regla.getComputedTextLength();
}

export interface OpcionesRotulo {
  x: number;
  y: number;
  /** Ancho disponible en unidades del viewBox. El texto se parte para caber dentro. */
  ancho: number;
  color: string;
  clase?: string;
  ancla?: 'start' | 'middle' | 'end';
  /** Separación entre líneas, en unidades del viewBox. */
  interlineado?: number;
  /** Si al partir salen más líneas de las permitidas, se reduce el cuerpo hasta que quepan. */
  maxLineas?: number;
}

/**
 * Rótulo que **cabe en el espacio que se le da**.
 *
 * SVG no parte texto: un `<text>` más largo que su caja simplemente se sale, sin aviso y sin recorte.
 * Y aquí los rótulos vienen del contenido, así que su largo cambia con cada idea y con cada idioma
 * —el inglés suele ser más largo—. La mecánica «margen» llegó a producción con etiquetas de 190 px
 * dentro de cajas de 152.
 *
 * Se parte en líneas, y si aun así no caben en las permitidas se reduce el cuerpo. Reducir es el
 * último recurso: una línea más se lee, media palabra fuera de la caja no.
 */
export function rotulo(padre: SVGElement, texto: string, op: OpcionesRotulo): SVGTextElement {
  const clase = op.clase ?? 'vis-etiqueta';
  const interlineado = op.interlineado ?? 13;
  const maxLineas = op.maxLineas ?? 2;

  const partir = (escala: number): string[] => {
    const lineas: string[] = [];
    let actual = '';
    for (const palabra of texto.split(/\s+/)) {
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (actual && medirTexto(prueba, clase) * escala > op.ancho) {
        lineas.push(actual);
        actual = palabra;
      } else {
        actual = prueba;
      }
    }
    if (actual) lineas.push(actual);
    return lineas;
  };

  let escala = 1;
  let lineas = partir(escala);
  // Hasta un 25 % más pequeño; por debajo de eso el rótulo deja de leerse y el problema es otro.
  while (lineas.length > maxLineas && escala > 0.75) {
    escala -= 0.05;
    lineas = partir(escala);
  }

  const el = svg('text', {
    x: op.x, y: op.y, fill: op.color, class: clase,
    'text-anchor': op.ancla ?? 'middle',
  }) as SVGTextElement;
  if (escala < 1) el.setAttribute('style', `font-size:${(escala * 100).toFixed(0)}%`);

  // El bloque se centra verticalmente sobre `y`: así el rótulo no se descuelga de su forma al
  // pasar de una línea a dos, que es lo que ocurría al añadirlas hacia abajo sin más.
  const desplazamiento = -((lineas.length - 1) * interlineado) / 2;
  lineas.forEach((linea, i) => {
    const t = svg('tspan', { x: op.x, y: op.y + desplazamiento + i * interlineado });
    t.textContent = linea;
    el.append(t);
  });
  padre.append(el);
  return el;
}

/**
 * Rótulo que cambia de texto durante la vida de la pieza.
 *
 * Existe porque `rotulo()` devuelve un `<text>` con varias líneas dentro, y asignarle `textContent`
 * —que es lo natural y lo que hacía todo el código— las borra y deja una sola línea que se sale de
 * su caja. Aquí se rehace, que es la única forma de mantener el ajuste.
 *
 * Se guarda el texto anterior y no se rehace si no ha cambiado: varias mecánicas repintan en cada
 * fotograma y reconstruir un nodo sesenta veces por segundo para nada es tirar trabajo.
 */
export interface RotuloMutable {
  poner(texto: string): void;
  /** Cambia el color sin rehacer el nodo: el color no afecta a cómo se parte el texto. */
  color(valor: string): void;
}

export function rotuloMutable(padre: SVGElement, op: OpcionesRotulo): RotuloMutable {
  let actual: SVGTextElement | null = null;
  let anterior: string | null = null;
  let color = op.color;
  return {
    poner(texto: string): void {
      if (texto === anterior) return;
      anterior = texto;
      actual?.remove();
      actual = texto ? rotulo(padre, texto, { ...op, color }) : null;
    },
    color(valor: string): void {
      color = valor;
      actual?.setAttribute('fill', valor);
    },
  };
}

/** Contrato que cumplen las tres técnicas por igual, para que el panel de idea no sepa cuál usa. */
export interface Visualizacion {
  /** Libera recursos. Crítico en 3D: nunca más de un contexto WebGL vivo a la vez. */
  destruir(): void;
}

/**
 * Toda visualización necesita su alternativa textual visible para quien no puede o no quiere
 * interactuar. Es el campo `alternativa_textual` de la ficha, que el validador ya exige.
 */
export function alternativaTextual(contenedor: HTMLElement, texto: string): void {
  /*
   * PLEGADA, no escondida. La diferencia importa en las dos direcciones.
   *
   * Este párrafo existe para quien no puede o no quiere manipular la pieza, así que borrarlo o
   * taparlo con CSS no es una opción: dentro de un `<details>` sigue en el árbol de accesibilidad y
   * a un clic de distancia. Lo que se acaba es que cuente el final de la película a quien iba a
   * jugar, que era lo que hacía estando siempre abierto y encima antes de la resolución.
   */
  const caja = document.createElement('details');
  caja.className = 'vis-alternativa';
  const resumen = document.createElement('summary');
  resumen.textContent = T.vis.alternativa_resumen;
  const p = document.createElement('p');
  p.textContent = texto;
  caja.append(resumen, p);
  contenedor.append(caja);
}
