/**
 * Mecánica «línea temporal»: se arrastra algo hacia atrás en el tiempo y se ve cómo cambia —o cómo
 * cambia de signo— aquello que hoy damos por evidente.
 *
 * Cubre tres ideas que comparten el mismo movimiento:
 *  - La genealogía de la moral (Nietzsche): un valor actual que antes despreciaba lo que hoy elogia.
 *  - La ideología (Marx): varias afirmaciones de sentido común sometidas a la vez al mismo rastreo,
 *    de las que unas resisten y otras se descomponen enseñando a quién le convenían.
 *  - El tiempo existe en el alma (Agustín): el «ahora» que no se deja señalar en una línea externa.
 *
 * En las tres, el hallazgo se produce al desplazarse: nada se afirma, se recorre.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, RADIO_TACTIL, resolver, rotulo,
  rotuloMutable, svg, TRAZO,
  arrastreHorizontal,
} from '../lenguaje';
import type { Paleta, Visualizacion } from '../lenguaje';

export interface HitoSpec {
  /** Etiqueta del momento: «hoy», «s. XIX», «Grecia arcaica»… */
  momento: string;
  /** Qué significaba entonces aquello que se arrastra. */
  significado: string;
  /** Signo con el que se valoraba: cambia el color del marcador. */
  signo: 'positivo' | 'negativo' | 'neutro';
  /** Qué se aprende al llegar aquí. */
  nota: string;
}

/** Un alto del rastreo, compartido por todas las afirmaciones que se examinan a la vez. */
export interface MomentoSpec {
  /** Etiqueta del momento: «hoy», «s. XX», «s. XIX»… */
  momento: string;
  /** Qué se aprende al llegar aquí, mirando las afirmaciones en conjunto. */
  nota: string;
}

export interface AfirmacionSpec {
  /** El enunciado tal como circula hoy: sin autor, sin fecha y sin que nadie lo discuta. */
  texto: string;
  /**
   * Qué encuentra el rastreo en cada momento MIENTRAS la afirmación sigue en pie. Basta con tantas
   * entradas como momentos aguante: a partir de `rompeEn` lo que se ve es el interés, no el rastro.
   */
  rastro: string[];
  /**
   * Momento en el que se descompone. **Si falta, la afirmación resiste el rastreo entero**, y eso
   * no es un caso residual: ver la nota de `crearRastreo` sobre por qué algunas tienen que aguantar.
   */
  rompeEn?: number;
  /** A quién servía. Es lo que queda a la vista cuando el enunciado se parte. */
  interes?: string;
}

export interface OpcionesComunes {
  corrienteId: string;
  /** Rótulo del botón que retrocede en el tiempo. */
  atras: string;
  /** Rótulo del botón que vuelve al presente. */
  adelante: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  /** Nombre accesible del marcador que se arrastra. */
  etiquetaMarcador: string;
  resolucion: string;
  alternativaTexto: string;
}

/** Un solo sujeto arrastrado hacia atrás. Es el gesto original de la mecánica. */
export interface OpcionesArrastre extends OpcionesComunes {
  modo?: 'arrastre';
  /** Lo que se arrastra: «humildad», «quien no prospera es que no se esfuerza»… */
  sujeto: string;
  hitos: HitoSpec[];
}

/** Varias afirmaciones sometidas al mismo rastreo a la vez, con desenlaces distintos. */
export interface OpcionesRastreo extends OpcionesComunes {
  modo: 'rastreo';
  momentos: MomentoSpec[];
  afirmaciones: AfirmacionSpec[];
  /** Cómo se lee una afirmación que sigue entera. Recibe {afirmacion}. */
  enPie: string;
  /** Cómo se lee una que se ha partido. Recibe {afirmacion} y {interes}. */
  descompuesta: string;
}

/*
 * Unión discriminada en vez de un solo objeto con todo opcional: así el recorrido de arrastre sigue
 * exigiendo `sujeto` e `hitos` —no se puede publicar una genealogía a medias— y el de rastreo exige
 * los suyos. Con campos opcionales para ambos, el compilador aceptaría una ficha sin ninguno de los
 * dos juegos y el fallo aparecería en pantalla, que es donde no queremos enterarnos.
 */
export type OpcionesLineaTemporal = OpcionesArrastre | OpcionesRastreo;

const ANCHO = 560;
const ALTO = 240;
const MARGEN = 64;

/**
 * Arrastre del marcador por la línea, saltando de hito en hito.
 *
 * EXISTE PORQUE EL MARCADOR YA PROMETÍA SER UN TIRADOR. Lleva `role="slider"`, `aria-valuenow` y el
 * cursor de agarre, y sin embargo solo se movía con dos botones y con las flechas del teclado: quien
 * intentaba lo que la propia pieza estaba anunciando no conseguía nada. Y en una línea de tiempo
 * arrastrar no es un atajo, es el gesto que corresponde —recorrer el tiempo con el dedo—, así que
 * darle arrastre no solo cumple lo prometido, además es la forma natural de usarla.
 *
 * Salta al hito más próximo en vez de deslizarse: los momentos son discretos y entre dos no hay
 * nada que enseñar. Se escucha en toda la raíz, como en «eje», para no obligar a acertar en un
 * círculo pequeño, sobre todo con el dedo.
 */
function arrastrarPorHitos(
  raiz: SVGSVGElement,
  n: number,
  aX: (i: number) => number,
  ir: (indice: number) => void,
): () => void {
  let arrastrando = false;

  const indiceDesde = (ev: PointerEvent): number => {
    const caja = raiz.getBoundingClientRect();
    if (!caja.width) return 0;
    const x = ((ev.clientX - caja.left) / caja.width) * ANCHO;
    let mejor = 0;
    for (let i = 1; i < n; i += 1) {
      if (Math.abs(aX(i) - x) < Math.abs(aX(mejor) - x)) mejor = i;
    }
    return mejor;
  };

  const alBajar = (ev: PointerEvent) => { arrastrando = true; ev.preventDefault(); ir(indiceDesde(ev)); };
  const alMover = (ev: PointerEvent) => { if (arrastrando) ir(indiceDesde(ev)); };
  const alSoltar = () => { arrastrando = false; };

  raiz.addEventListener('pointerdown', alBajar);
  window.addEventListener('pointermove', alMover);
  window.addEventListener('pointerup', alSoltar);
  window.addEventListener('pointercancel', alSoltar);
  arrastreHorizontal(raiz);

  return () => {
    window.removeEventListener('pointermove', alMover);
    window.removeEventListener('pointerup', alSoltar);
    window.removeEventListener('pointercancel', alSoltar);
  };
}

export function crearLineaTemporal(contenedor: HTMLElement, op: OpcionesLineaTemporal): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  /*
   * Los dos recorridos se separan aquí y no se entrelazan más abajo, como en `descomponer` y en
   * `repeticion`. La geometría es incompatible: el arrastre gasta el marco entero en un solo sujeto
   * a doble cuerpo, y el rastreo necesita tres filas simultáneas. Meterlo con condicionales dentro
   * de `pintar()` habría llenado de ramas ajenas el camino de la genealogía, que ya está publicado.
   *
   * El arrastre también sale a su propia función, aunque sea el gesto original: el afinamiento de
   * tipos de la unión no atraviesa los cierres —`pintar()` volvería a ver el tipo ancho—, y pasar la
   * variante ya concreta por parámetro es lo que mantiene `sujeto` e `hitos` obligatorios.
   */
  return op.modo === 'rastreo'
    ? crearRastreo(contenedor, op, paleta)
    : crearArrastre(contenedor, op, paleta);
}

function crearArrastre(contenedor: HTMLElement, op: OpcionesArrastre, paleta: Paleta): Visualizacion {
  let indice = 0;
  const visitados = new Set<number>([0]);

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * El eje baja y el sujeto sube. La versión anterior lo apretaba todo en la banda central y dejaba
   * la mitad inferior del marco vacía: el valor —que es de lo que trata la pieza— quedaba pequeño y
   * arriba, casi como un pie de foto de su propia línea de tiempo.
   */
  const n = op.hitos.length;
  const y = 176;
  const aX = (i: number) => MARGEN + (i / (n - 1)) * (ANCHO - MARGEN * 2);

  const eje = svg('line', {
    x1: MARGEN, y1: y, x2: ANCHO - MARGEN, y2: y,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });

  const marcas = op.hitos.map((h, i) => {
    const g = svg('g');
    const tick = svg('line', { x1: aX(i), y1: y - 6, x2: aX(i), y2: y + 6, stroke: paleta.neutro, 'stroke-width': TRAZO.fino, 'vector-effect': 'non-scaling-stroke' });
    g.append(tick);
    rotulo(g, h.momento, {
      x: aX(i), y: y + 28, ancho: (ANCHO - MARGEN * 2) / n - 6,
      color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });
    return g;
  });

  /*
   * El valor, en grande. Es el sujeto de la pieza: lo que se arrastra hacia atrás y acaba invirtiendo
   * su signo. Con el cuerpo de una etiqueta cualquiera no se leía como el protagonista.
   */
  /*
   * El sujeto va grande, pero no siempre es una palabra: en «La ideología» es una afirmación entera
   * —«quien no prospera es que no se ha esforzado»— y a doble cuerpo se salía del cuadro. Se parte,
   * y si aun así no cabe en dos líneas el propio ayudante baja el cuerpo.
   */
  const sujeto = rotulo(raiz, op.sujeto, {
    x: ANCHO / 2, y: 56, ancho: ANCHO - 60, color: paleta.senal,
    clase: 'vis-titulo-svg', interlineado: 30, maxLineas: 2,
  });
  sujeto.setAttribute('style', op.sujeto.length > 22 ? 'font-size:135%' : 'font-size:200%');
  /*
   * Lo que el valor significaba en ese momento. Es la frase larga de la pieza y la que cambia al
   * arrastrar: en «La ideología» se salía del cuadro en cuanto se llegaba al siglo XIX.
   */
  const significado = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 104, ancho: ANCHO - 70, color: paleta.neutro, interlineado: 14, maxLineas: 2,
  });

  const marcador = svg('circle', { cx: aX(0), cy: y, r: 12, fill: 'none' });
  marcador.setAttribute('role', 'slider');
  marcador.setAttribute('aria-label', op.etiquetaMarcador);
  marcador.setAttribute('aria-valuemin', '0');
  marcador.setAttribute('aria-valuemax', String(n - 1));
  marcarInteractivo(marcador, paleta, 'arrastre');

  raiz.append(eje, ...marcas, marcador);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const atras = document.createElement('button');
  atras.type = 'button';
  atras.textContent = op.atras;
  const adelante = document.createElement('button');
  adelante.type = 'button';
  adelante.textContent = op.adelante;
  controles.append(atras, adelante);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  const COLOR_SIGNO: Record<HitoSpec['signo'], () => string> = {
    positivo: () => paleta.acento,
    negativo: () => paleta.senal,
    neutro: () => paleta.neutro,
  };

  function pintar(): void {
    const h = op.hitos[indice]!;
    marcador.setAttribute('cx', String(aX(indice)));
    marcador.setAttribute('fill', COLOR_SIGNO[h.signo]());
    marcador.setAttribute('aria-valuenow', String(indice));
    marcador.setAttribute('aria-valuetext', `${h.momento}: ${h.significado}`);
    significado.poner(h.significado);
    // El sujeto cambia de trato según cómo se valorara en ese momento.
    sujeto.setAttribute('fill', COLOR_SIGNO[h.signo]());
    sujeto.setAttribute('text-decoration', h.signo === 'negativo' ? 'line-through' : 'none');

    atras.disabled = indice >= n - 1;
    adelante.disabled = indice === 0;

    if (visitados.size >= n) resolver(contenedor, op.resolucion);
    else resolver(contenedor, h.nota);
  }

  function ir(destino: number): void {
    const nuevo = Math.max(0, Math.min(n - 1, destino));
    if (nuevo === indice) return;
    indice = nuevo;
    visitados.add(indice);
    pintar();
  }

  function mover(delta: number): void {
    ir(indice + delta);
  }

  atras.addEventListener('click', () => mover(1));
  adelante.addEventListener('click', () => mover(-1));
  marcador.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === 'ArrowRight') { e.preventDefault(); mover(1); }
    else if (k === 'ArrowLeft') { e.preventDefault(); mover(-1); }
  });

  const soltarArrastre = arrastrarPorHitos(raiz, n, aX, ir);

  pintar();
  entrada(raiz);

  return {
    destruir(): void {
      soltarArrastre();
      contenedor.replaceChildren();
    },
  };
}

/*
 * Geometría del rastreo. Tres filas y un eje compacto arriba: el eje es común porque el rastreo es
 * UNO, aplicado a la vez a todas las afirmaciones. Con un eje por fila cada afirmación tendría su
 * propia historia y se perdería lo único que hace concluyente la comparación: que a las tres se les
 * hizo exactamente la misma pregunta y aun así no acabaron igual.
 *
 * El reparto en dos columnas —enunciado fijo a la izquierda, hallazgo cambiante a la derecha— es lo
 * que permite tres frases enteras del contenido dentro de 240 de alto. Apilar hallazgo bajo enunciado
 * pedía 46 px por fila y solo cabían dos afirmaciones, que es una menos de las necesarias para que
 * «unas resisten y otras no» sea algo más que un empate.
 */
const Y_ETIQUETA = 16;
const Y_EJE = 34;
const FILA_0 = 84;
const ALTO_FILA = 62;
/** Distancia del enunciado a su base. La base es lo que se parte cuando la afirmación se descompone. */
const CAIDA_BASE = 22;
const COL_ENUNCIADO = { centro: 142, ancho: 236 };
const COL_HALLAZGO = { centro: 410, ancho: 268 };
const BASE_X0 = COL_ENUNCIADO.centro - COL_ENUNCIADO.ancho / 2;
const BASE_X1 = COL_ENUNCIADO.centro + COL_ENUNCIADO.ancho / 2;

/**
 * Modo «rastreo»: varias afirmaciones sometidas al mismo rastreo histórico, con desenlaces distintos.
 *
 * POR QUÉ ALGUNAS TIENEN QUE RESISTIR. La tesis no es que todo lo que creemos sea interesado; es que
 * hay una prueba —buscarle el origen— que unas afirmaciones pasan y otras no. Si aquí se deshicieran
 * las tres, la pieza estaría afirmando que cualquier cosa se descompone si se rastrea lo bastante, o
 * sea que el rastreo no distingue nada y la sospecha vale para todo por igual. Eso es justamente la
 * objeción que la ficha recoge en `matiz_experto`: un concepto que se confirma pase lo que pase deja
 * de poder contrastarse. La que aguanta es la que convierte esto en una prueba en vez de en una
 * acusación, y por eso `rompeEn` es opcional y no obligatorio con un valor centinela.
 *
 * Y se descomponen en momentos DISTINTOS, no todas al final: si cayeran a la vez, el usuario leería
 * que lo que las tumba es haber llegado al fondo de la línea, no haber llegado a su origen.
 */
function crearRastreo(contenedor: HTMLElement, op: OpcionesRastreo, paleta: Paleta): Visualizacion {
  let indice = 0;
  const visitados = new Set<number>([0]);
  const n = Math.max(1, op.momentos.length);

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const aX = (i: number): number => (n === 1 ? ANCHO / 2 : MARGEN + (i / (n - 1)) * (ANCHO - MARGEN * 2));

  raiz.append(svg('line', {
    x1: MARGEN, y1: Y_EJE, x2: ANCHO - MARGEN, y2: Y_EJE,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  }));

  op.momentos.forEach((m, i) => {
    raiz.append(svg('line', {
      x1: aX(i), y1: Y_EJE - 5, x2: aX(i), y2: Y_EJE + 5,
      stroke: paleta.neutro, 'stroke-width': TRAZO.fino, 'vector-effect': 'non-scaling-stroke',
    }));
    rotulo(raiz, m.momento, {
      x: aX(i), y: Y_ETIQUETA, ancho: (ANCHO - MARGEN * 2) / n - 6,
      color: paleta.neutro, interlineado: 11, maxLineas: 1,
    });
  });

  const marcador = svg('circle', { cx: aX(0), cy: Y_EJE, r: RADIO_TACTIL, fill: paleta.acento });
  marcador.setAttribute('role', 'slider');
  marcador.setAttribute('aria-label', op.etiquetaMarcador);
  marcador.setAttribute('aria-valuemin', '0');
  marcador.setAttribute('aria-valuemax', String(n - 1));
  marcarInteractivo(marcador, paleta, 'arrastre');
  raiz.append(marcador);

  /*
   * Cada afirmación es una fila con su propio grupo accesible: el lector de pantalla tiene que poder
   * recorrer las tres y oír cuál sigue en pie, porque la comparación ES la pieza. Con un solo texto
   * alternativo global, quien no ve la pantalla se quedaría sin lo único que hay que comparar.
   */
  const filas = op.afirmaciones.map((a, i) => {
    const y = FILA_0 + i * ALTO_FILA;
    const yBase = y + CAIDA_BASE;
    const g = svg('g', { role: 'group' });

    const enunciado = rotulo(g, a.texto, {
      x: COL_ENUNCIADO.centro, y, ancho: COL_ENUNCIADO.ancho,
      color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });

    // Dos mitades contiguas: mientras la afirmación aguanta se leen como una sola línea, y al
    // descomponerse se separan. Una línea con hueco animado no existe en SVG sin trucos peores.
    const mitad = (x1: number, x2: number): SVGElement => svg('line', {
      x1, y1: yBase, x2, y2: yBase,
      stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    const izquierda = mitad(BASE_X0, COL_ENUNCIADO.centro);
    const derecha = mitad(COL_ENUNCIADO.centro, BASE_X1);
    g.append(izquierda, derecha);

    const hallazgo = rotuloMutable(g, {
      x: COL_HALLAZGO.centro, y, ancho: COL_HALLAZGO.ancho,
      color: paleta.neutro, interlineado: 12, maxLineas: 3,
    });

    raiz.append(g);
    return { a, g, enunciado, izquierda, derecha, hallazgo, yBase };
  });

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const atras = document.createElement('button');
  atras.type = 'button';
  atras.textContent = op.atras;
  const adelante = document.createElement('button');
  adelante.type = 'button';
  adelante.textContent = op.adelante;
  controles.append(atras, adelante);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    const m = op.momentos[indice]!;
    marcador.setAttribute('cx', String(aX(indice)));
    marcador.setAttribute('aria-valuenow', String(indice));
    marcador.setAttribute('aria-valuetext', `${m.momento}: ${m.nota}`);

    for (const f of filas) {
      const rota = f.a.rompeEn !== undefined && indice >= f.a.rompeEn;
      /*
       * En «hoy» las tres van en neutro y son indistinguibles: esa es la premisa de la idea, que
       * un arreglo contingente se presenta con el mismo aire de evidencia que cualquier otra cosa.
       * La diferencia de trato solo aparece al empezar a tirar, que es cuando hay algo que ver.
       */
      const color = rota ? paleta.senal : indice > 0 ? paleta.acento : paleta.neutro;
      f.enunciado.setAttribute('fill', color);
      f.enunciado.setAttribute('text-decoration', rota ? 'line-through' : 'none');
      f.enunciado.setAttribute('opacity', rota ? '0.62' : '1');

      // La base de la que resiste se refuerza; la de la que cae se parte, se abre y se descuelga.
      const grosor = rota ? TRAZO.fino : indice > 0 ? TRAZO.enfasis : TRAZO.base;
      f.izquierda.setAttribute('stroke', color);
      f.derecha.setAttribute('stroke', color);
      f.izquierda.setAttribute('stroke-width', String(grosor));
      f.derecha.setAttribute('stroke-width', String(grosor));
      f.izquierda.setAttribute('transform', rota ? `translate(-5 0) rotate(-3 ${BASE_X0} ${f.yBase})` : '');
      f.derecha.setAttribute('transform', rota ? `translate(5 0) rotate(3 ${BASE_X1} ${f.yBase})` : '');

      /*
       * Lo que ocupa la columna derecha cambia de naturaleza al romperse: mientras la afirmación
       * aguanta se lee qué encuentra el rastreo en ese momento; cuando se parte, lo que queda a la
       * vista es el interés, y se queda ahí aunque se siga tirando. Descubrir a quién servía no es
       * un fotograma del recorrido, es el resultado.
       */
      f.hallazgo.color(color);
      f.hallazgo.poner(rota
        ? f.a.interes ?? ''
        : f.a.rastro[indice] ?? f.a.rastro[f.a.rastro.length - 1] ?? '');

      f.g.setAttribute('aria-label', rota
        ? op.descompuesta.replace('{afirmacion}', f.a.texto).replace('{interes}', f.a.interes ?? '')
        : op.enPie.replace('{afirmacion}', f.a.texto));
    }

    atras.disabled = indice >= n - 1;
    adelante.disabled = indice === 0;

    if (visitados.size >= n) resolver(contenedor, op.resolucion);
    else resolver(contenedor, m.nota);
  }

  function ir(destino: number): void {
    const nuevo = Math.max(0, Math.min(n - 1, destino));
    if (nuevo === indice) return;
    indice = nuevo;
    visitados.add(indice);
    pintar();
  }

  function mover(delta: number): void {
    ir(indice + delta);
  }

  atras.addEventListener('click', () => mover(1));
  adelante.addEventListener('click', () => mover(-1));
  marcador.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === 'ArrowRight') { e.preventDefault(); mover(1); }
    else if (k === 'ArrowLeft') { e.preventDefault(); mover(-1); }
  });

  const soltarArrastre = arrastrarPorHitos(raiz, n, aX, ir);

  pintar();
  entrada(raiz);

  return {
    destruir(): void {
      soltarArrastre();
      contenedor.replaceChildren();
    },
  };
}
