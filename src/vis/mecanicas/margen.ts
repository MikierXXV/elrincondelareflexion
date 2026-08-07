/**
 * Mecánica «margen»: una bifurcación sin señalizar, y un vértigo que **crece mientras no decides**.
 *
 * Cubre dos ideas que se parecen más de lo que sugiere su origen:
 *  - La angustia como vértigo de la libertad (Kierkegaard): nada empuja ni retiene, y esa ausencia
 *    de indicación es exactamente lo que produce el vértigo.
 *  - La voluntad de sentido (Frankl): los hechos son irreversibles y el margen entre lo que ocurre
 *    y lo que se responde sigue activo.
 *
 * POR QUÉ SE REHIZO. La versión anterior dibujaba cuatro rectángulos y contaba pulsaciones. Su
 * propia alternativa textual prometía «un indicador de angustia que crece con el tiempo de
 * indecisión en lugar de bajar», y no había ni indicador ni tiempo: el gráfico no hacía lo que su
 * texto decía que hacía. Ahora **el tiempo es la pieza**. Quien se queda mirando sin decidir ve
 * subir la aguja, y ese es todo el argumento de Kierkegaard: no hay amenaza, hay margen.
 *
 * Regla que la sostiene: **el efecto se mide sobre el agente, nunca sobre los hechos.** Elegir baja
 * el vértigo y no mueve la fila de hechos ni un píxel. Si elegir cambiara la situación, la pieza
 * estaría diciendo lo contrario de lo que explica el texto.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, movimientoReducido, paletaDe, resolver, rotulo,
  svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface BloqueadoSpec {
  nombre: string;
  porque: string;
}

export interface OpcionSpec {
  texto: string;
  /** Qué cambia en quien elige. Nunca en los hechos. */
  efecto: string;
}

export interface OpcionesMargen {
  corrienteId: string;
  situacion: string;
  bloqueados: BloqueadoSpec[];
  /** Cómo se llama el único espacio que sigue activo. */
  margen: string;
  opciones: OpcionSpec[];
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;

/** Cuánto tarda el vértigo en llenarse del todo si nadie decide, en segundos. */
const SUBIDA = 14;

export function crearMargen(contenedor: HTMLElement, op: OpcionesMargen): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  const elegidas = new Set<number>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.situacion,
  }) as SVGSVGElement;

  rotulo(raiz, op.situacion, {
    x: ANCHO / 2, y: 26, ancho: ANCHO - 60, color: paleta.senal,
    clase: 'vis-titulo-svg', interlineado: 20, maxLineas: 1,
  });

  /*
   * Los apoyos que no están, a la izquierda: cada uno con su tachadura. Se ven, y esa es la idea
   * —no falta información, es que no existe quien decida por ti—.
   *
   * Ocupan una columna ancha y con paso holgado porque son frases, no palabras: con la columna
   * estrecha de la primera versión se partían en dos líneas y se pisaban entre ellas.
   */
  const APOYOS = { x: 24, ancho: 208, primero: 74, paso: 40 };
  op.bloqueados.forEach((b, i) => {
    const y = APOYOS.primero + i * APOYOS.paso;
    const g = svg('g', { opacity: 0.5 });
    rotulo(g, b.nombre, {
      x: APOYOS.x, y, ancho: APOYOS.ancho, color: paleta.neutro,
      ancla: 'start', interlineado: 13, maxLineas: 2,
    });
    /*
     * `data-tachadura` no pinta nada: avisa de que ESTE trazo cruza su rótulo a propósito.
     *
     * `check-piezas.mjs` busca líneas que pasen por encima de un texto porque eso casi siempre lo
     * deja ilegible, y aquí es justo lo contrario: la tachadura es el contenido —el apoyo se nombra
     * y se anula en el mismo gesto—. Sin la marca, la comprobación pediría arreglar la única parte
     * de la escena que ya dice lo que tiene que decir.
     */
    g.append(svg('line', {
      x1: APOYOS.x - 4, y1: y, x2: APOYOS.x + APOYOS.ancho, y2: y,
      stroke: paleta.neutro, 'stroke-width': TRAZO.fino, 'vector-effect': 'non-scaling-stroke',
      'data-tachadura': '',
    }));
    raiz.append(g);
  });

  /*
   * La bifurcación. Los caminos salen del mismo punto y **ninguno lleva marca**: ni color, ni
   * grosor, ni flecha. Esa ausencia es el contenido de la pieza, así que no puede haber ni un
   * detalle gráfico que insinúe cuál es el bueno.
   */
  const ORIGEN = { x: 296, y: 116 };
  const FIN_X = ANCHO - 26;
  const caminos = op.opciones.map((_, i) => {
    const reparto = op.opciones.length === 1 ? 0 : i / (op.opciones.length - 1) - 0.5;
    const finY = ORIGEN.y + reparto * 108;
    const linea = svg('path', {
      d: `M${ORIGEN.x} ${ORIGEN.y} C${ORIGEN.x + 80} ${ORIGEN.y}, ${FIN_X - 80} ${finY}, ${FIN_X} ${finY}`,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'stroke-dasharray': '5 6', 'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    raiz.append(linea);
    return { linea };
  });

  // La figura: un trazo, no un dibujo. Lo que importa es que está en el punto donde el camino se
  // parte, no cómo es.
  const figura = svg('g');
  figura.append(
    svg('circle', { cx: ORIGEN.x, cy: ORIGEN.y - 26, r: 9, fill: paleta.senal }),
    svg('path', {
      d: `M${ORIGEN.x} ${ORIGEN.y - 16} L${ORIGEN.x} ${ORIGEN.y + 8}`
        + ` M${ORIGEN.x - 13} ${ORIGEN.y + 24} L${ORIGEN.x} ${ORIGEN.y + 8} L${ORIGEN.x + 13} ${ORIGEN.y + 24}`
        + ` M${ORIGEN.x - 14} ${ORIGEN.y - 8} L${ORIGEN.x + 14} ${ORIGEN.y - 8}`,
      fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
      'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke',
    }),
  );
  raiz.append(figura);

  /*
   * El vértigo, en horizontal y abajo. Sube solo, y es lo único de la escena que se mueve sin que
   * nadie lo toque.
   *
   * Horizontal y no vertical por una razón práctica: en vertical, contra el borde derecho, su
   * etiqueta —que es una frase— no tenía ancho donde caber y se salía del cuadro. Aquí la etiqueta
   * va a su izquierda con sitio de sobra.
   */
  const MEDIDOR = { izq: 232, der: ANCHO - 26, y: 208 };
  const largo = MEDIDOR.der - MEDIDOR.izq;
  rotulo(raiz, op.margen, {
    x: 24, y: MEDIDOR.y + 4, ancho: 196, color: paleta.acento,
    ancla: 'start', interlineado: 13, maxLineas: 2,
  });
  raiz.append(svg('line', {
    x1: MEDIDOR.izq, y1: MEDIDOR.y, x2: MEDIDOR.der, y2: MEDIDOR.y,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke', opacity: 0.4,
  }));
  const aguja = svg('line', {
    x1: MEDIDOR.izq, y1: MEDIDOR.y, x2: MEDIDOR.izq, y2: MEDIDOR.y,
    stroke: paleta.acento, 'stroke-width': TRAZO.enfasis, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke',
  });
  raiz.append(aguja);

  contenedor.append(raiz);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  op.bloqueados.forEach((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = b.nombre;
    btn.disabled = true;
    btn.title = b.porque;
    // Visibles y deshabilitados a propósito: que se vea que no hay palanca ahí.
    controles.append(btn);
  });
  const botones = op.opciones.map((o, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = o.texto;
    btn.addEventListener('click', () => {
      elegidas.add(i);
      // Elegir baja el vértigo, y nada más. Los caminos siguen sin señalizar y los apoyos siguen
      // tachados: lo único que ha cambiado está en quien elige.
      vertigo = 0;
      caminos.forEach((c, k) => c.linea.setAttribute('opacity', k === i ? '1' : '0.35'));
      resolver(contenedor, elegidas.size >= op.opciones.length ? op.resolucion : o.efecto);
    });
    controles.append(btn);
    return btn;
  });
  contenedor.append(controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  marcarInteractivo(figura, paleta);
  figura.removeAttribute('stroke-dasharray');

  let vertigo = 0;
  let animacion = 0;
  let ultimo = performance.now();

  function pintar(): void {
    aguja.setAttribute('x2', String(MEDIDOR.izq + vertigo * largo));
    // La figura tiembla un poco cuando el vértigo aprieta. Es el único adorno, y va aquí porque el
    // temblor está en quien mira, no en la escena.
    const temblor = vertigo ** 2 * 1.6;
    figura.setAttribute(
      'transform',
      `translate(${(Math.random() - 0.5) * temblor} ${(Math.random() - 0.5) * temblor})`,
    );
  }

  function bucle(): void {
    const ahora = performance.now();
    const dt = Math.min(0.1, (ahora - ultimo) / 1000);
    ultimo = ahora;
    vertigo = Math.min(1, vertigo + dt / SUBIDA);
    pintar();
    animacion = requestAnimationFrame(bucle);
  }

  if (movimientoReducido()) {
    // Estado final estático: el vértigo alto y los caminos sin señalizar, que es lo que la pieza
    // afirma. No se pierde contenido por apagar el movimiento.
    vertigo = 0.8;
    pintar();
    resolver(contenedor, op.resolucion);
  } else {
    bucle();
    entrada(raiz);
  }

  void botones;

  return {
    destruir(): void {
      cancelAnimationFrame(animacion);
      contenedor.replaceChildren();
    },
  };
}
