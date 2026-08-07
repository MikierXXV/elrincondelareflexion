/**
 * Mecánica «capas»: se retiran capas una a una hasta llegar a algo que no se deja retirar,
 * o hasta comprobar que no queda nada debajo.
 *
 * Sirve a varias ideas porque el gesto es el mismo aunque la conclusión sea opuesta:
 *  - La duda metódica (Descartes): al final queda un punto irreductible.
 *  - Atman y brahman (Upanishads): al final no queda nada que señalar.
 *  - La mente como página en blanco (Locke): nada aparece que no haya entrado antes.
 *
 * Que ideas contrarias compartan mecánica no es un atajo: es lo que permite que el usuario
 * reconozca la diferencia entre ellas, porque lo único que cambia es el resultado.
 *
 * Se dibujan apiladas y no concéntricas. La primera versión usaba anillos, y entre anillo y anillo
 * quedaban 15 px para una fuente de 12: las etiquetas se solapaban e ilegibles. Apiladas, cada capa
 * tiene su franja y su nombre cabe dentro.
 */

import { alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, svg, TRAZO } from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface CapaSpec {
  nombre: string;
  /** Por qué se puede retirar: aparece al hacerlo. */
  motivo: string;
}

export interface OpcionesCapas {
  corrienteId: string;
  capas: CapaSpec[];
  /** Qué queda al final. Si es null, la conclusión es que no queda nada. */
  nucleo: { nombre: string; alRetirar: string } | null;
  /** Rótulo del botón que vuelve al estado inicial. */
  reiniciar: string;
  /** Rótulo del botón cuando ya no queda ninguna capa. */
  nadaQueRetirar: string;
  /** Rótulo del botón de retirar. Recibe {nombre}. */
  retirarUna: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  /** Rótulo del fondo cuando no queda ningún núcleo debajo. */
  sinNucleo: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;
// 40 y no 96: con el margen antiguo el apilado ocupaba poco más de la mitad del hueco y se leía
// como una lista pequeña en medio de una lámina grande.
const MARGEN_X = 40;

export function crearCapas(contenedor: HTMLElement, op: OpcionesCapas): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  let retiradas = 0;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const total = op.capas.length + 1; // las capas más el fondo
  const hueco = 8;
  const alturaFranja = Math.min(46, (ALTO - 24 - hueco * total) / total);
  const anchoFranja = ANCHO - MARGEN_X * 2;
  const yInicio = (ALTO - (alturaFranja + hueco) * total) / 2;

  const franjas = op.capas.map((capa, i) => {
    const y = yInicio + i * (alturaFranja + hueco);
    const g = svg('g');
    const caja = svg('rect', {
      x: MARGEN_X, y, width: anchoFranja, height: alturaFranja, rx: 2,
      fill: 'none',
      stroke: paleta.neutro,
      'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke',
      'data-trazo': '',
    });
    const etiqueta = svg('text', {
      x: MARGEN_X + 12, y: y + alturaFranja / 2 + 4,
      class: 'vis-etiqueta', 'text-anchor': 'start', fill: paleta.neutro,
    });
    etiqueta.textContent = capa.nombre;
    g.append(caja, etiqueta);
    return { g, caja, etiqueta };
  });

  // El fondo: lo que queda cuando ya no hay nada que quitar.
  const yFondo = yInicio + op.capas.length * (alturaFranja + hueco);
  const fondo = svg('rect', {
    x: MARGEN_X, y: yFondo, width: anchoFranja, height: alturaFranja, rx: 2,
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
    'vector-effect': 'non-scaling-stroke', opacity: 0.25,
  });
  const textoFondo = svg('text', {
    x: ANCHO / 2, y: yFondo + alturaFranja / 2 + 4,
    class: 'vis-etiqueta', 'text-anchor': 'middle', fill: paleta.senal, opacity: 0.35,
  });
  textoFondo.textContent = op.nucleo ? op.nucleo.nombre : op.sinNucleo;

  raiz.append(fondo, textoFondo, ...franjas.map((f) => f.g));
  marcarInteractivo(franjas[0]!.caja, paleta);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const retirar = document.createElement('button');
  retirar.type = 'button';
  const reiniciar = document.createElement('button');
  reiniciar.type = 'button';
  reiniciar.textContent = op.reiniciar;
  controles.append(retirar, reiniciar);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    franjas.forEach((f, i) => {
      const fuera = i < retiradas;
      const activa = i === retiradas;
      f.g.setAttribute('opacity', fuera ? '0.14' : '1');
      f.caja.setAttribute('stroke-dasharray', fuera ? '2 6' : activa ? '4 3' : '');
      f.caja.setAttribute('stroke', activa ? paleta.acento : paleta.neutro);
      f.caja.setAttribute('stroke-width', String(activa ? TRAZO.enfasis : TRAZO.base));
    });

    const quedan = op.capas.length - retiradas;
    const completo = quedan === 0;
    fondo.setAttribute('opacity', completo ? '1' : '0.25');
    textoFondo.setAttribute('opacity', completo ? '1' : '0.35');

    retirar.disabled = completo;
    retirar.textContent = completo
      ? op.nadaQueRetirar
      : op.retirarUna.replace('{nombre}', op.capas[retiradas]!.nombre);

    if (completo) resolver(contenedor, op.resolucion);
    else if (retiradas > 0) resolver(contenedor, op.capas[retiradas - 1]!.motivo);
  }

  retirar.addEventListener('click', () => {
    if (retiradas < op.capas.length) retiradas++;
    pintar();
  });
  reiniciar.addEventListener('click', () => {
    retiradas = 0;
    contenedor.querySelector('.vis-resolucion')?.remove();
    pintar();
  });

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
