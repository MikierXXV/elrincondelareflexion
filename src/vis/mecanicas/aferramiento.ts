/**
 * Mecánica «aferramiento»: algo agradable que se transforma pase lo que pase, y un medidor de
 * tensión que solo responde a la fuerza con que se intenta retenerlo.
 *
 * LA CONDICIÓN QUE HACE QUE ESTO SIGNIFIQUE ALGO. La transformación avanza al mismo ritmo se agarre
 * o no. Si retener frenara aunque fuese un poco el cambio, la pieza estaría afirmando que aferrarse
 * sirve un poco, que es lo contrario de la idea. Y si retener no hiciera absolutamente nada, no
 * habría nada que descubrir. Lo que cambia —lo único— es la tensión, y la tensión es de quien
 * agarra, no de la situación.
 *
 * Se suelta y la tensión baja sola, sin que la escena se detenga ni retroceda: eso es lo que hay
 * que poder comprobar, y por eso el medidor tiene que estar a la vista mientras se agarra.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, movimientoReducido, paletaDe, resolver,
  rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface FaseSpec {
  /** Lo que la situación es en este tramo. Cambia sola. */
  nombre: string;
}

export interface OpcionesAferramiento {
  corrienteId: string;
  /** Lo que se ofrece y va a transformarse. */
  situacion: string;
  /** Los estados por los que pasa, en orden. Vuelve a empezar: el ciclo no se detiene. */
  fases: FaseSpec[];
  /** Rótulo del medidor. */
  tension: string;
  /** Instrucción del gesto: mantener pulsado. */
  retener: string;
  /** Lo que se lee al agarrar con fuerza durante un rato. */
  avisoTension: string;
  /** Lo que se lee al soltar tras haber tensado. */
  avisoSoltar: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;
const PUNTOS = 34;

export function crearAferramiento(contenedor: HTMLElement, op: OpcionesAferramiento): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  const reducido = movimientoReducido();
  let tension = 0;
  let agarrando = false;
  let fase = 0;
  let tensoAlguna = false;
  let soltoTrasTensar = false;
  let bucle = 0;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.situacion,
  }) as SVGSVGElement;

  rotulo(raiz, op.situacion, { x: ANCHO / 2, y: 26, ancho: ANCHO - 90, color: paleta.neutro, interlineado: 13, maxLineas: 2 });

  // ---- La situación: una nube de puntos que se reordena sola --------------------------------
  const cx = 210;
  const cy = 132;
  const g = svg('g');
  const puntos = Array.from({ length: PUNTOS }, (_, i) => {
    const p = svg('circle', { cx, cy, r: 3.4, fill: paleta.acento, opacity: 0.75 });
    g.append(p);
    return { el: p, semilla: (i * 97) % 61 };
  });
  raiz.append(g);

  /*
   * El aro de agarre. Aparece al retener y se aprieta con la tensión, pero no toca la nube: es la
   * mano, no la cosa. Que se vea apretando sobre algo que sigue moviéndose por dentro es la imagen
   * entera de la pieza.
   */
  const aro = svg('circle', {
    cx, cy, r: 74, fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
    'vector-effect': 'non-scaling-stroke', opacity: 0,
  });
  raiz.append(aro);

  // Zona de gesto: transparente y del tamaño de la nube, para que agarrar sea fácil con el dedo.
  const asa = svg('circle', { cx, cy, r: 84, fill: 'transparent', style: 'cursor:grab' });
  raiz.append(asa);
  marcarInteractivo(asa, paleta, 'arrastre');
  asa.setAttribute('stroke-dasharray', '');
  asa.setAttribute('stroke', 'none');
  asa.setAttribute('aria-label', op.retener);

  const nombreFase = rotuloMutable(raiz, {
    x: cx, y: 210, ancho: 300, color: paleta.neutro, interlineado: 13, maxLineas: 2,
  });

  // ---- El medidor de tensión ---------------------------------------------------------------
  const xMed = 452;
  const yMed = 64;
  const altoMed = 132;
  const anchoMed = 26;
  raiz.append(svg('rect', {
    x: xMed, y: yMed, width: anchoMed, height: altoMed, rx: 2,
    fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  }));
  const relleno = svg('rect', { x: xMed, y: yMed + altoMed, width: anchoMed, height: 0, fill: paleta.senal, opacity: 0.85 });
  raiz.append(relleno);
  rotulo(raiz, op.tension, { x: xMed + anchoMed / 2, y: yMed - 14, ancho: 130, color: paleta.neutro, interlineado: 12, maxLineas: 2 });

  /*
   * El aviso va al pie y a todo el ancho, no bajo el medidor. Colgado del medidor disponía de 150 de
   * ancho para una frase de ochenta caracteres: el ayudante la reducía al mínimo permitido y aun así
   * se salía 8 px por la derecha. El texto es contenido y no se recorta para que quepa; lo que se
   * cambia es la caja.
   */
  const aviso = rotuloMutable(raiz, {
    x: ANCHO / 2, y: ALTO - 16, ancho: ANCHO - 40, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });

  // ---- El gesto ----------------------------------------------------------------------------
  // Declarado aquí y asignado más abajo: `agarrar` y `soltar` lo necesitan, y el botón necesita a
  // las dos funciones. Con `let` la dependencia circular se resuelve sin duplicar nada.
  let bRetener: HTMLButtonElement | null = null;
  function agarrar(): void {
    agarrando = true;
    asa.setAttribute('style', 'cursor:grabbing');
    bRetener?.setAttribute('aria-pressed', 'true');
  }
  function soltar(): void {
    agarrando = false;
    asa.setAttribute('style', 'cursor:grab');
    bRetener?.setAttribute('aria-pressed', 'false');
    if (tensoAlguna) soltoTrasTensar = true;
  }
  asa.addEventListener('pointerdown', (e) => { (e as PointerEvent).preventDefault(); agarrar(); });
  window.addEventListener('pointerup', soltar);
  asa.addEventListener('pointercancel', soltar);
  // Con teclado el gesto de «mantener» no existe, así que la barra alterna entre agarrar y soltar.
  asa.addEventListener('keydown', (e) => {
    const k = e as KeyboardEvent;
    if (k.key !== ' ' && k.key !== 'Enter') return;
    k.preventDefault();
    if (agarrando) soltar(); else agarrar();
  });

  /*
   * El gesto es mantener pulsado sobre la figura, y eso hay que decirlo en algún sitio visible: la
   * marca de «esto se manipula» dice que se puede tocar, no que haya que sostener. Este botón hace
   * exactamente lo mismo alternando, así que además es la vía de teclado y la de quien no puede
   * mantener una pulsación. La pieza se montaba sin ningún control y no había nada que leer.
   */
  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  bRetener = document.createElement('button');
  bRetener.type = 'button';
  bRetener.textContent = op.retener;
  bRetener.setAttribute('aria-pressed', 'false');
  bRetener.addEventListener('click', () => {
    if (agarrando) soltar(); else agarrar();
    bRetener.setAttribute('aria-pressed', String(agarrando));
  });
  controles.append(bRetener);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  /*
   * El reloj de la pieza. La fase avanza con el tiempo transcurrido y NO consulta `agarrando`: es la
   * garantía, en una sola línea, de que retener no frena nada.
   */
  const t0 = performance.now();
  function marco(t: number): void {
    const transcurrido = (t - t0) / 1000;
    const nueva = Math.floor(transcurrido / 3.2) % op.fases.length;
    if (nueva !== fase) fase = nueva;
    nombreFase.poner(op.fases[fase]?.nombre ?? '');

    tension = Math.min(1, Math.max(0, tension + (agarrando ? 0.010 : -0.016)));
    if (tension > 0.85) tensoAlguna = true;
    const h = altoMed * tension;
    relleno.setAttribute('y', String(yMed + altoMed - h));
    relleno.setAttribute('height', String(h));

    aro.setAttribute('opacity', String(tension * 0.9));
    aro.setAttribute('r', String(74 - tension * 12));

    if (tension > 0.85) aviso.poner(op.avisoTension);
    else if (soltoTrasTensar && tension < 0.05) aviso.poner(op.avisoSoltar);

    // La nube se reordena sola, con el mismo reloj y sin mirar el agarre.
    puntos.forEach((p, i) => {
      const a = (i / PUNTOS) * Math.PI * 2 + transcurrido * 0.22;
      const r = 30 + 26 * Math.sin(transcurrido * 0.6 + p.semilla * 0.11);
      p.el.setAttribute('cx', String(cx + Math.cos(a) * r));
      p.el.setAttribute('cy', String(cy + Math.sin(a) * r * 0.78));
    });

    if (tensoAlguna && soltoTrasTensar && tension < 0.05) resolver(contenedor, op.resolucion);
    bucle = requestAnimationFrame(marco);
  }

  if (reducido) {
    // Sin movimiento: la nube se queda quieta y el medidor sigue respondiendo al gesto, que es lo
    // que hay que poder comprobar. La alternativa textual cubre el resto.
    nombreFase.poner(op.fases[0]?.nombre ?? '');
  } else {
    bucle = requestAnimationFrame(marco);
  }

  entrada(raiz);

  return {
    destruir: () => {
      cancelAnimationFrame(bucle);
      window.removeEventListener('pointerup', soltar);
      contenedor.replaceChildren();
    },
  };
}
