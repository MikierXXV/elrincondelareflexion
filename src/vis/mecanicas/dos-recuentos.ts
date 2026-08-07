/**
 * Mecánica «dos recuentos»: la misma votación contada de dos maneras a la vez.
 *
 * Cada votante es una flecha. Un recuento las suma tal cual; el otro se queda solo con lo que les es
 * común, porque las desviaciones particulares, repartidas al azar, se cancelan entre sí. Mientras
 * nadie las organiza, los dos recuentos dan lo mismo y se ven superpuestos. En cuanto aparece una
 * facción las desviaciones dejan de cancelarse, la suma se ladea y los dos recuentos se separan.
 *
 * POR QUÉ NO SIRVE UN MEDIDOR CON UN PORCENTAJE. La afirmación de Rousseau es sobre cancelación, y
 * la cancelación es una operación entre direcciones. Con flechas se ve por qué el resultado cambia;
 * con una cifra habría que creérselo. La divergencia no se anuncia con un rótulo: se ve como ángulo.
 */

import {
  alternativaTextual, entrada, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface ManiobraSpec {
  nombre: string;
  /** Cuántos votantes quedan alineados en la misma desviación. */
  votantes: number;
  /** Hacia dónde tira la facción, en radianes respecto de la vertical. */
  sesgo: number;
  efecto: string;
}

export interface OpcionesDosRecuentos {
  corrienteId: string;
  /** Los dos recuentos. El primero es el que se ladea al organizarse las facciones. */
  recuentos: [string, string];
  /** El asunto que se vota, para encabezar la pieza. */
  votacion: string;
  maniobras: ManiobraSpec[];
  /** Botón que devuelve la votación a votantes sin organizar. */
  disolver: string;
  /** Rótulo de la separación entre los dos recuentos. Recibe los grados ya formateados. */
  separacion: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;
const VOTANTES = 15;

export function crearDosRecuentos(contenedor: HTMLElement, op: OpcionesDosRecuentos): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  const probadas = new Set<string>();

  /*
   * Las desviaciones individuales. Se reparten de forma fija y simétrica, no al azar: tienen que
   * sumar cero para que sin facciones los dos recuentos coincidan exactamente. Con valores
   * aleatorios quedaba una diferencia residual y la pieza parecía estropeada desde el principio.
   */
  const base = Array.from({ length: VOTANTES }, (_, i) => ((i - (VOTANTES - 1) / 2) / VOTANTES) * 1.5);
  let desviaciones = [...base];

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  rotulo(raiz, op.votacion, { x: ANCHO / 2, y: 24, ancho: ANCHO - 80, color: paleta.neutro, interlineado: 13, maxLineas: 2 });

  // ---- Los votantes ------------------------------------------------------------------------
  const yVot = 92;
  const largoVot = 26;
  const flechas = Array.from({ length: VOTANTES }, (_, i) => {
    const x = 56 + (i * (ANCHO - 112)) / (VOTANTES - 1);
    const f = svg('line', {
      x1: x, y1: yVot + largoVot / 2, x2: x, y2: yVot - largoVot / 2,
      stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
      'vector-effect': 'non-scaling-stroke',
    });
    raiz.append(f);
    return { el: f, x };
  });

  // ---- Los dos recuentos -------------------------------------------------------------------
  const ox = ANCHO / 2;
  const oy = ALTO - 34;
  const largoRes = 78;

  function resultante(color: string, grosor: number): SVGElement {
    const l = svg('line', {
      x1: ox, y1: oy, x2: ox, y2: oy - largoRes,
      stroke: color, 'stroke-width': grosor, 'stroke-linecap': 'round',
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    raiz.append(l);
    return l;
  }

  // La general se dibuja primero y más gruesa: cuando coinciden, la de todos queda encima y se ve
  // que son la misma dirección, no que una haya desaparecido.
  const flechaGeneral = resultante(paleta.acento, TRAZO.enfasis + 1);
  const flechaTodos = resultante(paleta.senal, TRAZO.enfasis);

  rotulo(raiz, op.recuentos[1], { x: ox - 96, y: oy - 12, ancho: 150, color: paleta.acento, ancla: 'middle', interlineado: 12, maxLineas: 2 });
  rotulo(raiz, op.recuentos[0], { x: ox + 96, y: oy - 12, ancho: 150, color: paleta.senal, ancla: 'middle', interlineado: 12, maxLineas: 2 });

  const lectura = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 132, ancho: ANCHO - 70, color: paleta.neutro, interlineado: 13, maxLineas: 2,
  });
  /*
   * La separación va en su propio rótulo y junto a las flechas, no en la línea del efecto. Al
   * principio compartían sitio y cada maniobra escribía su texto para que `pintar()` lo sobrescribiera
   * inmediatamente con los grados: el efecto no llegaba a leerse nunca.
   */
  /*
   * Va DEBAJO de la base del abanico, no encima de su punta.
   *
   * En `oy - largoRes - 16` caía en la única banda que no estaba libre: justo donde llegan las
   * flechas de los votantes cuando se inclinan. Al aparecer facciones, media docena de trazos le
   * pasaban por encima y el número —que es lo que la pieza pide leer— quedaba tachado precisamente
   * cuando empezaba a ser distinto de cero.
   *
   * Bajo la base no hay nada: los rótulos de los dos recuentos van a los lados y a la altura de las
   * puntas, y desde `oy` hasta el borde inferior del marco no se dibuja nada más.
   */
  const separacion = rotuloMutable(raiz, {
    x: ANCHO / 2, y: oy + 20, ancho: 220, color: paleta.neutro, interlineado: 12, maxLineas: 1,
  });

  /*
   * La flecha de la voluntad de todos NO se marca como manipulable, porque no se manipula.
   *
   * Lo estaba, y no tenía ni un solo manejador: la mecánica entera se mueve con sus cuatro botones.
   * De la marca solo sobrevivían los efectos secundarios —un `tabindex` que creaba una parada de
   * teclado donde no hay nada que hacer, y el cursor de manipular sobre algo inerte— porque el trazo
   * discontinuo se anulaba en la línea siguiente. Se usaba como énfasis, y para eso ya tiene su
   * propio grosor y el color de señal, que es lo que la distingue de la otra flecha.
   */

  // ---- Controles ---------------------------------------------------------------------------
  const controles = document.createElement('div');
  controles.className = 'vis-controles';

  for (const m of op.maniobras) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = m.nombre;
    b.addEventListener('click', () => {
      // La facción sustituye la desviación propia de sus votantes por una común.
      desviaciones = base.map((d, i) => (i < m.votantes ? m.sesgo : d));
      probadas.add(m.nombre);
      lectura.poner(m.efecto);
      pintar();
      resolver(contenedor, probadas.size >= op.maniobras.length ? op.resolucion : m.efecto);
    });
    controles.append(b);
  }

  const bDisolver = document.createElement('button');
  bDisolver.type = 'button';
  bDisolver.textContent = op.disolver;
  bDisolver.addEventListener('click', () => {
    desviaciones = [...base];
    lectura.poner('');
    pintar();
  });
  controles.append(bDisolver);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    flechas.forEach((f, i) => {
      const a = desviaciones[i] ?? 0;
      f.el.setAttribute('x2', String(f.x + Math.sin(a) * largoVot));
      f.el.setAttribute('y2', String(yVot - Math.cos(a) * largoVot));
      // Los alineados se marcan: es lo que distingue una facción de un reparto cualquiera.
      const alineado = Math.abs(a - (desviaciones[0] ?? 0)) < 0.001 && desviaciones[0] !== base[0];
      f.el.setAttribute('stroke', alineado ? paleta.senal : paleta.neutro);
      f.el.setAttribute('opacity', alineado ? '1' : '0.6');
    });

    // La voluntad de todos: la suma vectorial, sin más.
    const sx = desviaciones.reduce((s, a) => s + Math.sin(a), 0) / VOTANTES;
    const sy = desviaciones.reduce((s, a) => s + Math.cos(a), 0) / VOTANTES;
    const anguloTodos = Math.atan2(sx, sy);
    flechaTodos.setAttribute('x2', String(ox + Math.sin(anguloTodos) * largoRes));
    flechaTodos.setAttribute('y2', String(oy - Math.cos(anguloTodos) * largoRes));
    // La voluntad general: lo común, que es la vertical. No se mueve nunca, y esa es la tesis.
    flechaGeneral.setAttribute('x2', String(ox));
    flechaGeneral.setAttribute('y2', String(oy - largoRes));

    const grados = Math.round((Math.abs(anguloTodos) * 180) / Math.PI);
    separacion.color(grados > 2 ? paleta.senal : paleta.neutro);
    separacion.poner(op.separacion.replace('{grados}', String(grados)));
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
