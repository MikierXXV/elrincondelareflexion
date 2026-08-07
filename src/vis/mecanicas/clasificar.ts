/**
 * Mecánica «clasificar»: repartir elementos entre dos regiones, donde las colocaciones equivocadas
 * no se aceptan y explican por qué.
 *
 * Cubre tres ideas que trazan una frontera y discuten dónde cae cada cosa:
 *  - La dicotomía del control (Epicteto): lo que depende de ti y lo que no.
 *  - Los límites del lenguaje (Wittgenstein): lo que puede decirse y lo que solo se muestra.
 *  - Razón y fe (Tomás de Aquino): lo que la razón alcanza sola y lo que exige revelación.
 *
 * Lo que la vuelve argumento y no examen: **la región equivocada rechaza el elemento**. No se
 * corrige después con un mensaje de error, se resiste en el momento, que es la experiencia que las
 * tres ideas describen.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface ElementoSpec {
  nombre: string;
  /** Índice de la región a la que pertenece: 0 o 1. */
  region: 0 | 1;
  /** Por qué pertenece ahí. */
  motivo: string;
}

export interface OpcionesClasificar {
  corrienteId: string;
  regiones: [string, string];
  elementos: ElementoSpec[];
  /**
   * Una de las dos regiones RECHAZA lo que no le pertenece, en vez de admitirlo y marcarlo mal.
   *
   * Sin esto, clasificar es siempre aceptar: se coloca cada cosa y después se dice si acertaste. Dos
   * ideas necesitan lo contrario, que el sitio se resista. En la dicotomía del control, el desgaste
   * **procede** de empujar hacia dentro lo que no cabe, así que el empujón tiene que costar algo que
   * se vea. Y en los límites del lenguaje, una frase rebota sin ser falsa: el rechazo no es un error
   * del usuario sino una propiedad del límite.
   */
  rechazo?: {
    /** Cuál de las dos regiones se resiste. */
    region: 0 | 1;
    /** Rótulo del medidor que sube con cada intento de forzar. Si falta, no hay medidor. */
    medidor?: string;
    /** Lo que se lee cuando el medidor llega arriba. */
    avisoMedidor?: string;
  };
  /** Rótulo del botón de cada región. Recibe {region}. */
  ponerEn: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  /** Recuento de lo que falta por repartir. Recibe {n}. */
  restantesTexto: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;

export function crearClasificar(contenedor: HTMLElement, op: OpcionesClasificar): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  let seleccionado: number | null = null;
  const colocados = new Map<number, 0 | 1>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * Con medidor, las dos regiones ceden la franja derecha. Sin él conservan el reparto de siempre:
   * las ideas que no usan la capacidad no ven cambiar su pieza ni un píxel.
   */
  const reservado = op.rechazo?.medidor ? 68 : 0;
  const anchoZona = (ANCHO - reservado) / 2 - 44;
  const zonas = ([0, 1] as const).map((r) => {
    const x = 30 + r * (anchoZona + 28);
    const caja = svg('rect', {
      x, y: 40, width: anchoZona, height: 108, rx: 4,
      fill: 'none', stroke: r === 0 ? paleta.acento : paleta.neutro,
      'stroke-width': TRAZO.base, 'stroke-dasharray': '6 4',
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    const et = svg('g');
    rotulo(et, op.regiones[r]!, {
      x: x + anchoZona / 2, y: 28, ancho: anchoZona - 12,
      color: r === 0 ? paleta.acento : paleta.neutro, interlineado: 12, maxLineas: 2,
    });
    // La región es también el destino: se puede pulsar directamente además de usar los botones.
    caja.setAttribute('role', 'button');
    caja.setAttribute('aria-label', op.ponerEn.replace('{region}', op.regiones[r]!));
    marcarInteractivo(caja, paleta);
    caja.setAttribute('stroke-dasharray', '6 4');
    return { caja, et, x, r };
  });

  /*
   * Las etiquetas de los colocados, apiladas dentro de su región.
   *
   * Cada una vive en su propio grupo y se recoloca moviendo el grupo, no el texto: el rótulo puede
   * ocupar dos líneas y hay que desplazarlas juntas. Con un `<text>` suelto y sin partir, elementos
   * como «Que el mundo tuvo un comienzo» se salían de la bandeja y del cuadro.
   */
  const colocadas = op.elementos.map((e) => {
    // Nacen ya dentro del cuadro aunque estén invisibles: aparcados en el origen quedaban a la
    // izquierda del marco, y un nodo fuera de sitio acaba viéndose el día que alguien lo muestra.
    const g = svg('g', { opacity: 0, transform: `translate(${ANCHO / 2} 62)` });
    rotulo(g, e.nombre, {
      x: 0, y: 0, ancho: anchoZona - 16, color: paleta.acento, interlineado: 12, maxLineas: 2,
    });
    return g;
  });

  /*
   * Se muestra UN elemento cada vez, en el centro y a tamaño legible.
   * La primera versión los repartía todos en una bandeja horizontal: con cinco fichas de 148 px no
   * cabían en los 560 del hueco, se salían del cuadro y se solapaban entre sí. Además, de uno en
   * uno el gesto es mejor: obliga a decidir sobre cada cosa por separado, que es el ejercicio.
   */
  const actual = svg('rect', { x: ANCHO / 2 - 170, y: 168, width: 340, height: 34, rx: 2, fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis, 'vector-effect': 'non-scaling-stroke' });
  /*
      * El elemento que toca clasificar. Es una frase entera del contenido —«Que el mundo tuvo un
      * comienzo»— y con un `<text>` en bruto se salía del cuadro por los dos lados.
      */
  const textoActual = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 188, ancho: 320, color: paleta.senal, interlineado: 14, maxLineas: 2,
  });
  const restantes = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 224, ancho: ANCHO - 80, color: paleta.neutro, interlineado: 12, maxLineas: 1,
  });

  // Los rótulos mutables se insertan solos al ponerles texto; aquí solo va lo fijo.
  raiz.append(...zonas.flatMap((z) => [z.caja, z.et]), ...colocadas, actual);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = ([0, 1] as const).map((r) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = op.ponerEn.replace('{region}', op.regiones[r]!);
    b.addEventListener('click', () => colocar(r));
    controles.append(b);
    return b;
  });

  /*
   * El medidor de desgaste. Ocupa la franja derecha, que estaba vacía: medido antes de esto, el
   * dibujo de esta pieza usaba el 49 % de su marco, por debajo del mínimo que el propio guion exige.
   * No se añade para rellenar —eso sería decoración— sino porque la idea afirma que forzar cuesta, y
   * un coste que no se ve no está afirmado.
   */
  let desgaste = 0;
  const MED = { x: ANCHO - 34, y: 40, ancho: 22, alto: 162 };
  let rellenoDesgaste: SVGElement | null = null;
  let avisoDesgaste: ReturnType<typeof rotuloMutable> | null = null;
  if (op.rechazo?.medidor) {
    raiz.append(svg('rect', {
      x: MED.x, y: MED.y, width: MED.ancho, height: MED.alto, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    }));
    rellenoDesgaste = svg('rect', { x: MED.x, y: MED.y + MED.alto, width: MED.ancho, height: 0, fill: paleta.senal, opacity: 0.85 });
    raiz.append(rellenoDesgaste);
    /*
     * Los rótulos del medidor se anclan al BORDE DERECHO y crecen hacia dentro. Centrados sobre la
     * barra solo tenían 23 px a cada lado antes de salirse del marco, y «Desgaste» ya no cabía: el
     * ayudante lo parte y lo reduce, pero no puede inventar sitio donde no lo hay.
     */
    rotulo(raiz, op.rechazo.medidor, {
      x: ANCHO - 12, y: MED.y - 16, ancho: 150, color: paleta.neutro,
      ancla: 'end', interlineado: 12, maxLineas: 2,
    });
    avisoDesgaste = rotuloMutable(raiz, {
      x: ANCHO - 12, y: MED.y + MED.alto + 22, ancho: 180, color: paleta.senal,
      ancla: 'end', interlineado: 12, maxLineas: 2,
    });
  }

  function pintarDesgaste(): void {
    if (!rellenoDesgaste) return;
    const h = MED.alto * desgaste;
    rellenoDesgaste.setAttribute('y', String(MED.y + MED.alto - h));
    rellenoDesgaste.setAttribute('height', String(h));
    if (desgaste >= 0.99) avisoDesgaste?.poner(op.rechazo?.avisoMedidor ?? '');
  }

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function siguientePendiente(): number | null {
    for (let i = 0; i < op.elementos.length; i++) if (!colocados.has(i)) return i;
    return null;
  }

  function pintar(): void {
    colocadas.forEach((t, i) => {
      const destino = colocados.get(i);
      if (destino === undefined) { t.setAttribute('opacity', '0'); return; }
      const dentro = op.elementos.map((_, k) => k).filter((k) => colocados.get(k) === destino);
      t.setAttribute('opacity', '1');
      t.setAttribute('transform',
        `translate(${zonas[destino]!.x + anchoZona / 2} ${62 + dentro.indexOf(i) * 26})`);
      t.querySelectorAll('text').forEach((n) => n.setAttribute('fill', destino === 0 ? paleta.acento : paleta.neutro));
    });

    const pendiente = seleccionado;
    const hay = pendiente !== null;
    actual.setAttribute('opacity', hay ? '1' : '0');
    textoActual.poner(hay ? op.elementos[pendiente]!.nombre : '');
    restantes.poner(hay ? op.restantesTexto.replace('{n}', String(op.elementos.length - colocados.size)) : '');
    botones.forEach((b) => { b.disabled = !hay; });

    if (colocados.size >= op.elementos.length) resolver(contenedor, op.resolucion);
  }

  function colocar(region: 0 | 1): void {
    if (seleccionado === null) return;
    const spec = op.elementos[seleccionado]!;
    if (spec.region !== region) {
      // La región equivocada no lo acepta: se resiste en el momento, no después con un aviso.
      actual.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }],
        { duration: 260, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
      /*
       * Forzar la región que se resiste tiene un coste, y el coste es la tesis. Que el medidor suba
       * SOLO al empujar contra la región marcada, y no con cualquier error de reparto, es lo que
       * distingue «te has equivocado» de «esto se te va en algo que no depende de ti».
       */
      if (op.rechazo && region === op.rechazo.region) {
        desgaste = Math.min(1, desgaste + 0.2);
        pintarDesgaste();
      }
      resolver(contenedor, spec.motivo);
      return;
    }
    colocados.set(seleccionado, region);
    resolver(contenedor, spec.motivo);
    seleccionado = siguientePendiente();
    pintar();
  }

  zonas.forEach((z) => {
    z.caja.addEventListener('click', () => colocar(z.r));
    z.caja.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); colocar(z.r); }
    });
  });

  seleccionado = siguientePendiente();
  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
