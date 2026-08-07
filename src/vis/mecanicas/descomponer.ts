/**
 * Mecánica «descomponer»: algo que parece una unidad se separa en las piezas que realmente
 * afirma, y cada una se evalúa por separado. La conclusión sale de las piezas, no del conjunto.
 *
 * Cubre tres ideas cuyo movimiento es idéntico:
 *  - Hablar de lo que no existe (Russell): la frase se parte en tres condiciones y basta con que
 *    falle la primera para que sea falsa, sin necesidad de ningún objeto fantasma.
 *  - Esencia y existencia (Avicena): la definición se completa entera y una pieza —la existencia—
 *    se queda sin determinar, por muchos rasgos que se añadan.
 *  - Las cuatro verdades (Buda): el diagnóstico se separa en dolencia, causa, cesación y vía, y
 *    solo con las cuatro se sostiene.
 *
 * Una pieza puede quedar «indeterminada», y ese estado es tan informativo como los otros dos: es
 * justamente lo que Avicena quiere hacer ver.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable,
  svg, TRAZO,
} from '../lenguaje';
import type { Paleta, Visualizacion } from '../lenguaje';

export type EstadoPieza = 'verdadero' | 'falso' | 'indeterminado';

export interface PiezaSpec {
  nombre: string;
  estado: EstadoPieza;
  nota: string;
}

export interface CandidatoSpec {
  nombre: string;
  /** Lo que tiene que haber entrado antes. Vacío significa que entra por los sentidos. */
  requiere: string[];
  /** Lo que se lee al admitirlo. */
  admitido: string;
  /** Lo que se lee cuando la puerta lo rechaza. */
  rechazado: string;
}

export interface OpcionesDescomponer {
  corrienteId: string;
  /**
   * Qué se hace con lo que hay.
   *
   * `separar` (por omisión) es el gesto original: una unidad aparente se parte en lo que afirma y
   * cada pieza se evalúa suelta.
   *
   * `puerta` invierte la dirección y sirve a una tesis distinta —que nada hay en la mente que no
   * haya pasado antes por la experiencia—: en vez de partir lo que ya está dentro, se ofrece algo
   * desde fuera y la puerta lo descompone para comprobar si todos sus elementos entraron ya. Si
   * falta uno, no pasa. Antes esta idea usaba capas apiladas que se retiraban una a una, que
   * enseña un orden pero no una condición de entrada: se podía retirar la capa de abajo primero.
   */
  modo?: 'separar' | 'puerta';
  /** Lo que aparenta ser una unidad. En `puerta`, la invitación mientras no hay nada examinándose. */
  conjunto: string;
  /** Texto del botón que la separa. Sin uso en `puerta`. */
  accion: string;
  piezas: PiezaSpec[];
  /** Solo en `puerta`: lo que se ofrece a la entrada, en el orden en que conviene probarlo. */
  candidatos?: CandidatoSpec[];
  /** Solo en `puerta`: rótulo de lo que ya está dentro. Recibe {lista}. */
  dentro?: string;
  /** Solo en `puerta`: qué se lee cuando todavía no ha entrado nada. */
  dentroVacio?: string;
  /** Solo en `puerta`: rótulo de la pieza de quien no necesita nada previo. */
  porLosSentidos?: string;
  /** Qué se concluye del conjunto de piezas. */
  veredicto: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  /** Cómo se lee cada estado. Tres claves: verdadero, falso, indeterminado. */
  veredictos: Record<EstadoPieza, string>;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;

export function crearDescomponer(contenedor: HTMLElement, op: OpcionesDescomponer): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  /*
   * Los dos modos se separan aquí y no se entrelazan más abajo. Comparten el lenguaje gráfico, la
   * paleta y el marco —que es lo que hace que se sientan la misma familia—, pero el recorrido del
   * usuario es distinto y mezclarlos con condicionales dentro de `pintar()` habría dejado el camino
   * de `separar`, del que dependen tres ideas ya publicadas, lleno de ramas que no le tocan.
   */
  if (op.modo === 'puerta') return crearPuerta(contenedor, op, paleta);

  let separado = false;
  const revisadas = new Set<number>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const cajaX = 60;
  const cajaAncho = ANCHO - cajaX * 2;

  /*
   * El conjunto y su rótulo van juntos en un grupo. Antes se apilaban sueltos en la raíz y, al pasar
   * el rótulo por el ayudante —que lo inserta él mismo—, el orden de pintado dejaba de coincidir con
   * el orden en que se declaran. Agrupados, mueven y se atenúan a la vez sin tocar dos nodos.
   */
  const grupoConjunto = svg('g');
  const conjunto = svg('rect', { x: cajaX, y: 42, width: cajaAncho, height: 52, rx: 2, fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.enfasis, 'vector-effect': 'non-scaling-stroke', 'data-trazo': '' });
  grupoConjunto.append(conjunto);
  rotulo(grupoConjunto, op.conjunto, {
    x: ANCHO / 2, y: 72, ancho: cajaAncho - 24, color: paleta.senal, interlineado: 14, maxLineas: 2,
  });
  raiz.append(grupoConjunto);

  const n = op.piezas.length;
  const anchoP = (cajaAncho - (n - 1) * 10) / n;
  const piezas = op.piezas.map((p, i) => {
    const px = cajaX + i * (anchoP + 10);
    const g = svg('g', { opacity: 0 });
    const caja = svg('rect', { x: px, y: 118, width: anchoP, height: 52, rx: 2, fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'vector-effect': 'non-scaling-stroke' });
    // Cada pieza mide lo que le toca del reparto: con cuatro piezas caben tres palabras por caja,
    // y sin partir el texto los nombres se pisaban entre columnas contiguas.
    const et = rotulo(g, p.nombre, {
      x: px + anchoP / 2, y: 148, ancho: anchoP - 10,
      color: paleta.neutro, interlineado: 12, maxLineas: 3,
    });
    g.insertBefore(caja, et);
    // La marca cambia de texto al revisar la pieza, así que va por el rótulo mutable.
    const marca = rotuloMutable(g, {
      x: px + anchoP / 2, y: 192, ancho: anchoP - 6,
      color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });
    return { g, caja, marca, i };
  });

  const veredicto = rotulo(raiz, op.veredicto, {
    x: ANCHO / 2, y: 216, ancho: ANCHO - 60, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });
  veredicto.setAttribute('opacity', '0');

  raiz.append(...piezas.map((p) => p.g));

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const separar = document.createElement('button');
  separar.type = 'button';
  separar.textContent = op.accion;
  controles.append(separar);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  // Los tres veredictos vienen de la ficha: son texto que se lee en pantalla, no identificadores.
  const SIMBOLO: Record<EstadoPieza, string> = op.veredictos;

  function pintar(): void {
    grupoConjunto.setAttribute('opacity', separado ? '0.3' : '1');
    separar.disabled = separado;

    piezas.forEach((p) => {
      const spec = op.piezas[p.i]!;
      p.g.setAttribute('opacity', separado ? '1' : '0');
      if (separado && !p.caja.classList.contains('vis-interactivo')) {
        marcarInteractivo(p.caja, paleta);
        p.caja.setAttribute('stroke-dasharray', '');
      }
      const color = spec.estado === 'falso' ? paleta.senal
        : spec.estado === 'indeterminado' ? paleta.neutro
        : paleta.acento;
      p.caja.setAttribute('stroke', color);
      p.caja.setAttribute('stroke-width', String(spec.estado === 'falso' ? TRAZO.enfasis : TRAZO.base));
      p.caja.setAttribute('stroke-dasharray', spec.estado === 'indeterminado' ? '4 4' : '');
      p.marca.color(color);
      p.marca.poner(revisadas.has(p.i) ? SIMBOLO[spec.estado] : '?');
    });

    veredicto.setAttribute('opacity', revisadas.size >= n ? '1' : '0');
    if (revisadas.size >= n) resolver(contenedor, op.resolucion);
  }

  piezas.forEach((p) => {
    // La marca de «esto se puede tocar» NO se pone aquí: las piezas no existen para el usuario
    // hasta que el conjunto se separa, y anunciarlas antes es prometer una interacción que no
    // funciona. Se activan en pintar(). Detectado en la prueba funcional.
    p.caja.setAttribute('role', 'button');
    const revisar = () => {
      if (!separado) return;
      revisadas.add(p.i);
      resolver(contenedor, op.piezas[p.i]!.nota);
      pintar();
    };
    p.caja.addEventListener('click', revisar);
    p.caja.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); revisar(); }
    });
  });

  separar.addEventListener('click', () => { separado = true; pintar(); });

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}

/**
 * Modo «puerta»: nada entra si no se descompone en algo que ya entró.
 *
 * El usuario ofrece candidatos desde fuera. La puerta descompone cada uno en lo que exige y comprueba
 * pieza a pieza si ya está dentro. Si falta una, no pasa —y el rechazo dice cuál falta, que es lo que
 * convierte el «no» en información en vez de en un muro.
 *
 * QUE EL ORDEN IMPORTE ES LA TESIS. Una idea compleja ofrecida la primera se rechaza, y la misma
 * idea ofrecida después de que hayan entrado sus elementos se admite. No hay ninguna que entre
 * entera por su cuenta: las únicas que no exigen nada previo son las que vienen de los sentidos, y
 * ese asimetría es exactamente lo que la idea afirma.
 */
function crearPuerta(contenedor: HTMLElement, op: OpcionesDescomponer, paleta: Paleta): Visualizacion {
  const candidatos = op.candidatos ?? [];
  const dentro = new Set<string>();
  let examinando: CandidatoSpec | null = null;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const cajaX = 60;
  const cajaAncho = ANCHO - cajaX * 2;

  // La puerta: el candidato en examen ocupa el mismo sitio que el conjunto del otro modo.
  const marco = svg('rect', {
    x: cajaX, y: 38, width: cajaAncho, height: 50, rx: 2,
    fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.enfasis,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });
  raiz.append(marco);
  const enPuerta = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 66, ancho: cajaAncho - 24, color: paleta.senal, interlineado: 14, maxLineas: 2,
  });

  /*
   * Las casillas de los elementos exigidos. Son cuatro fijas y no una por candidato: si aparecieran
   * y desaparecieran con cada uno, la fila entera bailaría en cada pulsación y costaría ver que lo
   * que cambia es cuáles están cubiertas, que es lo único que hay que mirar.
   */
  const RANURAS = 4;
  const anchoR = (cajaAncho - (RANURAS - 1) * 10) / RANURAS;
  const ranuras = Array.from({ length: RANURAS }, (_, i) => {
    const x = cajaX + i * (anchoR + 10);
    const g = svg('g', { opacity: 0 });
    const caja = svg('rect', {
      x, y: 112, width: anchoR, height: 46, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke',
    });
    g.append(caja);
    const et = rotuloMutable(g, {
      x: x + anchoR / 2, y: 136, ancho: anchoR - 8, color: paleta.neutro, interlineado: 12, maxLineas: 3,
    });
    raiz.append(g);
    return { g, caja, et };
  });

  const veredicto = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 180, ancho: ANCHO - 60, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });
  // Lo que ya está dentro, siempre a la vista: sin esto, «falta X» no se puede contrastar con nada.
  const inventario = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 220, ancho: ANCHO - 50, color: paleta.neutro, interlineado: 12, maxLineas: 2,
  });

  marcarInteractivo(marco, paleta);
  marco.setAttribute('stroke-dasharray', '');

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = candidatos.map((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.nombre;
    b.addEventListener('click', () => ofrecer(c));
    controles.append(b);
    return { b, c };
  });

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function ofrecer(c: CandidatoSpec): void {
    examinando = c;
    const falta = c.requiere.filter((r) => !dentro.has(r));
    if (!falta.length) dentro.add(c.nombre);
    veredicto.color(falta.length ? paleta.senal : paleta.acento);
    veredicto.poner(falta.length ? c.rechazado : c.admitido);
    pintar();
    resolver(contenedor, dentro.size >= candidatos.length ? op.resolucion : (falta.length ? c.rechazado : c.admitido));
  }

  function pintar(): void {
    enPuerta.poner(examinando ? examinando.nombre : op.conjunto);

    // Sin nada previo que exigir, se muestra una sola casilla: la vía de los sentidos.
    const exigidos = !examinando ? []
      : examinando.requiere.length ? examinando.requiere
      : [op.porLosSentidos ?? ''];
    const abierta = Boolean(examinando && !examinando.requiere.length);

    ranuras.forEach((r, i) => {
      const nombre = exigidos[i];
      r.g.setAttribute('opacity', nombre ? '1' : '0');
      if (!nombre) { r.et.poner(''); return; }
      const cubierto = abierta || dentro.has(nombre);
      const color = cubierto ? paleta.acento : paleta.senal;
      r.caja.setAttribute('stroke', color);
      r.caja.setAttribute('stroke-width', String(cubierto ? TRAZO.base : TRAZO.enfasis));
      // Lo que falta se dibuja con el trazo roto de «esto no está», igual que en el resto del sistema.
      r.caja.setAttribute('stroke-dasharray', cubierto ? '' : '4 4');
      r.et.color(color);
      r.et.poner(nombre);
    });

    for (const { b, c } of botones) b.setAttribute('aria-pressed', String(dentro.has(c.nombre)));
    inventario.poner(dentro.size
      ? (op.dentro ?? '{lista}').replace('{lista}', [...dentro].join(' · '))
      : (op.dentroVacio ?? ''));
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
