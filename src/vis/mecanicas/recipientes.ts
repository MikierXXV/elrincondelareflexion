/**
 * Mecánica «recipientes»: se reparte algo entre varios recipientes y se observan los agregados.
 *
 * Cubre tres ideas que discuten justamente entre sí, y esa es la gracia de que compartan gesto:
 *  - El límite del placer (Epicuro): unos deseos se sacian y otros no tienen fondo.
 *  - El cálculo de la felicidad (Bentham): lo que cuenta es la suma de todos.
 *  - El principio de diferencia (Rawls): lo que cuenta es el peor situado, no la suma.
 *
 * Las tres reparten lo mismo; lo único que cambia es qué indicador se mira. Poner los indicadores
 * a la vez deja ver que un reparto puede subir el total mientras hunde el suelo, que es
 * exactamente la objeción de Rawls al utilitarismo.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface RecipienteSpec {
  nombre: string;
  /** null = sin fondo: nunca sube de nivel por mucho que se le eche. */
  capacidad: number | null;
  /** Qué se aprende al llenarlo o al comprobar que no se llena. */
  nota: string;
}

export type Indicador = 'total' | 'media' | 'suelo' | 'inquietud';

export interface OpcionesRecipientes {
  corrienteId: string;
  unidad: string;
  recipientes: RecipienteSpec[];
  indicadores: Indicador[];
  /** Rótulo del botón que vacía los recipientes. */
  vaciar: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  /** Nombre accesible de cada recipiente. Recibe {nombre}. */
  etiquetaZona: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;

export function crearRecipientes(contenedor: HTMLElement, op: OpcionesRecipientes): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  const contenido = op.recipientes.map(() => 0);
  let vertidos = 0;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * Los vasos ocupan el marco. Antes medían 88 de ancho y 108 de alto dentro de un hueco de 560×240,
   * o sea poco más de la mitad del alto y con dos franjas vacías a los lados: se leían como un
   * diagrama pequeño en medio de una lámina grande, cuando son el contenido entero de la pieza.
   */
  const n = op.recipientes.length;
  const MARGEN = 34;
  const HUECO = 26;
  const anchoR = (ANCHO - MARGEN * 2 - HUECO * (n - 1)) / n;
  const separacion = HUECO;
  const alturaR = 132;
  const yBase = 196;

  const vasos = op.recipientes.map((r, i) => {
    const x = MARGEN + i * (anchoR + separacion);
    const g = svg('g');

    // Contorno: discontinuo por abajo si no tiene fondo. Es la única pista visual previa.
    const pared = svg('path', {
      d: `M ${x} ${yBase - alturaR} L ${x} ${yBase} L ${x + anchoR} ${yBase} L ${x + anchoR} ${yBase - alturaR}`,
      fill: 'none',
      stroke: paleta.neutro,
      'stroke-width': TRAZO.base,
      'stroke-linecap': 'round',
      'stroke-dasharray': r.capacidad === null ? '3 5' : '',
      'vector-effect': 'non-scaling-stroke',
      'data-trazo': '',
    });

    const nivel = svg('rect', { x: x + 2, y: yBase - 2, width: anchoR - 4, height: 0, fill: paleta.acento, opacity: 0.75 });

    const zona = svg('rect', { x, y: yBase - alturaR, width: anchoR, height: alturaR + 8, fill: 'transparent' });
    zona.setAttribute('role', 'button');
    zona.setAttribute('aria-label', op.etiquetaZona.replace('{nombre}', r.nombre));
    marcarInteractivo(zona, paleta);
    zona.setAttribute('stroke', 'none');

    g.append(pared, nivel, zona);
    rotulo(g, r.nombre, {
      x: x + anchoR / 2, y: yBase + 26, ancho: anchoR + HUECO - 6,
      color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });
    return { g, nivel, zona, i };
  });

  const lectura = svg('text', { x: ANCHO / 2, y: 34, class: 'vis-titulo-svg', 'text-anchor': 'middle', fill: paleta.senal });
  raiz.append(lectura, ...vasos.map((v) => v.g));

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const vaciar = document.createElement('button');
  vaciar.type = 'button';
  vaciar.textContent = op.vaciar;
  controles.append(vaciar);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function agregados(): Record<Indicador, number> {
    const finitos = op.recipientes.map((r, i) => (r.capacidad === null ? 0 : contenido[i]!));
    const total = finitos.reduce((a, b) => a + b, 0);
    return {
      total,
      media: Math.round((total / n) * 10) / 10,
      suelo: Math.min(...finitos),
      // Los deseos sin fondo son los que producen inquietud: cuanto más se les echa, más sube.
      inquietud: op.recipientes.reduce((a, r, i) => a + (r.capacidad === null ? contenido[i]! : 0), 0),
    };
  }

  function pintar(): void {
    const ag = agregados();
    lectura.textContent = op.indicadores
      .map((k) => `${k}: ${ag[k]}`)
      .join('   ·   ');

    vasos.forEach((v, i) => {
      const spec = op.recipientes[i]!;
      const cap = spec.capacidad;
      // Sin fondo: el nivel no sube nunca, por mucho que se vierta.
      const proporcion = cap === null ? 0 : Math.min(1, contenido[i]! / cap);
      const alto = proporcion * (alturaR - 6);
      v.nivel.setAttribute('height', String(alto));
      v.nivel.setAttribute('y', String(yBase - 2 - alto));
    });

    const llenos = op.recipientes.every((r, i) => r.capacidad === null || contenido[i]! >= r.capacidad);
    const insistido = op.recipientes.some((r, i) => r.capacidad === null && contenido[i]! >= 6);
    if (llenos || insistido) resolver(contenedor, op.resolucion);
    vaciar.disabled = vertidos === 0;
  }

  vasos.forEach((v) => {
    const verter = () => {
      contenido[v.i]!;
      contenido[v.i] = contenido[v.i]! + 1;
      vertidos++;
      const spec = op.recipientes[v.i]!;
      resolver(contenedor, spec.nota);
      pintar();
    };
    v.zona.addEventListener('click', verter);
    v.zona.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); verter(); }
    });
  });

  vaciar.addEventListener('click', () => {
    contenido.fill(0);
    vertidos = 0;
    contenedor.querySelector('.vis-resolucion')?.remove();
    pintar();
  });

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
