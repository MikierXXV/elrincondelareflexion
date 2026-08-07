/**
 * Mecánica «dos caminos»: dos vías paralelas por las que se empuja la misma proposición, y una de
 * ellas se detiene donde se acaban las premisas observables.
 *
 * La tesis que sostiene —que razón y fe comparten un tramo y después no— solo se ve si las dos vías
 * están a la vez y arrancan iguales. Clasificar cada proposición en una de las dos columnas, que es
 * lo que hacía antes esta idea, dice lo contrario: sugiere dos territorios separados desde el
 * principio y esconde justamente el tramo común, que es la mitad de la afirmación.
 *
 * Por eso lo que se manipula no es la etiqueta de cada proposición sino su avance: se empuja, y el
 * recorrido es quien decide dónde para.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface ProposicionSpec {
  nombre: string;
  /** Hasta dónde llega por la razón, de 0 a 1. Con 1 recorre el camino entero. */
  alcanceRazon: number;
  /** Lo que se lee cuando esta proposición termina su recorrido. */
  nota: string;
}

export interface OpcionesDosCaminos {
  corrienteId: string;
  /** Los dos caminos. El primero es el que puede detenerse. */
  caminos: [string, string];
  /** Rótulo de la línea donde se agotan las premisas observables. */
  limite: string;
  proposiciones: ProposicionSpec[];
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

export function crearDosCaminos(contenedor: HTMLElement, op: OpcionesDosCaminos): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  const recorridas = new Set<string>();
  let animando = 0;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const xIni = 96;
  const xFin = ANCHO - 40;
  const largo = xFin - xIni;
  const yRazon = 96;
  const yFe = 168;
  // Donde se agotan las premisas observables. Es el mismo punto para todas: lo que cambia es cuánto
  // camino tiene cada proposición antes de llegar ahí.
  const xLimite = xIni + largo * 0.62;

  function carril(y: number, nombre: string, color: string): void {
    raiz.append(svg('line', {
      x1: xIni, y1: y, x2: xFin, y2: y,
      stroke: color, 'stroke-width': TRAZO.base, opacity: 0.55,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    }));
    rotulo(raiz, nombre, { x: xIni - 8, y, ancho: 84, color, ancla: 'end', interlineado: 12, maxLineas: 2 });
  }

  carril(yRazon, op.caminos[0], paleta.senal);
  carril(yFe, op.caminos[1], paleta.acento);

  // La barrera: no cierra el paso por sí misma, marca dónde deja de haber suelo para la razón.
  raiz.append(svg('line', {
    x1: xLimite, y1: yRazon - 26, x2: xLimite, y2: yRazon + 26,
    stroke: paleta.senal, 'stroke-width': TRAZO.base, 'stroke-dasharray': '3 4',
    'vector-effect': 'non-scaling-stroke',
  }));
  rotulo(raiz, op.limite, { x: xLimite, y: yRazon - 36, ancho: 190, color: paleta.senal, interlineado: 12, maxLineas: 2 });

  const nota = rotuloMutable(raiz, {
    x: ANCHO / 2, y: ALTO - 14, ancho: ANCHO - 70, color: paleta.neutro, interlineado: 13, maxLineas: 2,
  });

  // Las dos fichas que viajan: la misma proposición recorriendo los dos caminos a la vez.
  function ficha(color: string): SVGElement {
    return svg('circle', { cx: xIni, cy: 0, r: 7, fill: color, opacity: 0 });
  }
  const fichaRazon = ficha(paleta.senal);
  const fichaFe = ficha(paleta.acento);
  fichaRazon.setAttribute('cy', String(yRazon));
  fichaFe.setAttribute('cy', String(yFe));
  raiz.append(fichaRazon, fichaFe);
  marcarInteractivo(fichaFe, paleta);
  fichaFe.setAttribute('stroke-dasharray', '');

  const controles = document.createElement('div');
  controles.className = 'vis-controles';

  for (const p of op.proposiciones) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = p.nombre;
    b.addEventListener('click', () => empujar(p));
    controles.append(b);
  }

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  /*
   * Las dos fichas salen juntas y a la misma velocidad. La de la razón se para donde su alcance se
   * agota; la otra sigue. La coincidencia del primer tramo es lo que hay que ver, así que no se
   * adorna con velocidades distintas ni con desfases.
   */
  function empujar(p: ProposicionSpec): void {
    cancelAnimationFrame(animando);
    const t0 = performance.now();
    const topeRazon = Math.min(p.alcanceRazon, 1);
    fichaRazon.setAttribute('opacity', '1');
    fichaFe.setAttribute('opacity', '1');
    nota.poner('');

    const paso = (t: number): void => {
      const k = Math.min(1, (t - t0) / 1800);
      const kRazon = Math.min(k, topeRazon);
      fichaRazon.setAttribute('cx', String(xIni + largo * kRazon));
      fichaFe.setAttribute('cx', String(xIni + largo * k));
      // Al detenerse, la ficha de la razón se apaga en vez de quedarse dura: se ha quedado sin suelo.
      fichaRazon.setAttribute('opacity', k > topeRazon ? '0.3' : '1');
      if (k < 1) animando = requestAnimationFrame(paso);
      else {
        nota.poner(p.nota);
        recorridas.add(p.nombre);
        resolver(contenedor, recorridas.size >= op.proposiciones.length ? op.resolucion : p.nota);
      }
    };
    animando = requestAnimationFrame(paso);
  }

  entrada(raiz);

  return {
    destruir: () => {
      cancelAnimationFrame(animando);
      contenedor.replaceChildren();
    },
  };
}
