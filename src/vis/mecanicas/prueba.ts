/**
 * Mecánica «prueba»: se propone algo y se somete a una prueba que lo confronta con sus propias
 * consecuencias. Unas propuestas sobreviven y otras se destruyen solas.
 *
 * Cubre cuatro ideas cuyo gesto es idéntico aunque la prueba se llame de formas distintas:
 *  - El imperativo categórico (Kant): universalizar la máxima y ver si se autodestruye.
 *  - La imposibilidad del cambio (Parménides): lanzar un intento contra la cadena deductiva.
 *  - Del ser al deber (Hume): comprobar si el argumento llega a la conclusión sin una pieza extra.
 *  - El eterno retorno (Nietzsche): aceptar el tramo entero, sin poder editarlo.
 *
 * Lo importante es que **la propuesta no se juzga desde fuera**: se rompe por su propio contenido,
 * y por eso la interfaz nunca dice «correcto» ni «incorrecto», solo muestra qué pasa al aplicarla.
 *
 * TRES CAPACIDADES OPCIONALES, PORQUE TRES FICHAS PROMETÍAN MÁS DE LO QUE EL ANILLO PODÍA DAR.
 * El anillo de copias anónimas dice una sola cosa: «esto mismo, repetido». Sirve a Kant y a nadie
 * más. Las otras tres ideas prometían una estructura interna —dependencias, pasos, un hueco— y sin
 * ella la pieza solo podía enunciarla por escrito en el veredicto. Cada capacidad se declara en la
 * ficha y quien no la declara conserva el anillo intacto.
 */

import {
  alternativaTextual, ATENUADO, entrada, marcarInteractivo, movimientoReducido, paletaDe, resolver,
  rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Paleta, Visualizacion } from '../lenguaje';

export interface MomentoSpec {
  texto: string;
  /** Índices de los momentos sin los cuales este no habría ocurrido. */
  dependeDe?: number[];
}

export interface CandidatoSpec {
  texto: string;
  /** Si resiste la prueba o se destruye al aplicarla. */
  sobrevive: boolean;
  /** Qué ocurre exactamente al aplicarla. */
  veredicto: string;
  /** Capacidad «secuencia»: en qué momentos enlazados se descompone este tramo. */
  momentos?: MomentoSpec[];
  /** Capacidad «pasos»: índice del paso de la cadena en el que este intento se detiene. */
  bloqueaEn?: number;
  /** Modo «argumento»: lo que el argumento describe. */
  premisa?: string;
  /** Modo «argumento»: lo que pretende concluir. */
  conclusion?: string;
  /** Modo «argumento»: la premisa normativa que haría falta para llegar de una a otra. */
  puente?: string;
  /** Modo «argumento»: si el argumento la declara en vez de darla por supuesta. */
  puenteDeclarado?: boolean;
  /** Modo «argumento»: lo que se lee una vez el hueco está cerrado. */
  veredictoCerrado?: string;
}

export interface OpcionesPrueba {
  corrienteId: string;
  /**
   * Qué forma tiene la escena.
   *
   * `anillo` (por omisión) es la de siempre: una propuesta en el centro y las instancias que la
   * prueba genera alrededor.
   *
   * `argumento` es una geometría incompatible con esa, no una variante suya: la ley de Hume no
   * necesita instancias sino una pila vertical —premisa, hueco, conclusión— donde el hueco sea un
   * sitio físico que se puede mirar y rellenar. Se descartó meterla en el anillo abriendo un sector
   * vacío: un sector no es un eslabón que falta, y lo que hay que ver es que la conclusión se queda
   * colgando. Se bifurca aquí arriba, como en `descomponer`, para no dejar el camino del anillo
   * —del que depende una idea ya publicada— lleno de ramas que no le tocan.
   */
  modo?: 'anillo' | 'argumento';
  /** Qué se propone: «una regla que vas a seguir», «una definición de justicia»… */
  peticion: string;
  /** Nombre de la prueba, tal como aparece en el botón. */
  nombrePrueba: string;
  /** Cómo se llaman las instancias que genera la prueba: «todo el mundo», «casos»… */
  nombreInstancias?: string;
  /** Rótulo del botón una vez aplicada la prueba. Sin él se compone a partir de las instancias. */
  aplicadaTexto: string;
  candidatos: CandidatoSpec[];
  /**
   * La propuesta se abre en momentos ENLAZADOS, y retirar uno se lleva los que dependían de él.
   *
   * El eterno retorno no es «repetir»: es que no se puede editar lo que se repite. Con el anillo, la
   * pieza afirmaba eso solo en el texto del veredicto, y un enunciado no es una demostración. Aquí
   * el usuario intenta quedarse con lo bueno, ve caer detrás lo que lo sostenía, y descubre que la
   * prueba no admite el tramo a medias. Se descartó marcar los momentos retirados y dejar aplicar la
   * prueba igualmente: eso convierte la imposibilidad en una advertencia que se puede ignorar.
   */
  secuencia?: {
    /** Nombre accesible de cada momento. Recibe {momento}. */
    retirar: string;
    /** Lo que se lee cuando el retirado arrastra a otros. Recibe {momento} y {arrastrados}. */
    arrastre: string;
    /** Lo que se lee cuando no arrastra a nadie. Recibe {momento}. */
    suelto: string;
    /** Botón que devuelve el tramo entero. */
    restaurar: string;
    /** Rótulo del botón de la prueba mientras al tramo le falta algo. */
    bloqueado: string;
    /** Lo que se concluye de haber editado el tramo. */
    editado: string;
    /** Lo que se concluye al devolverlo entero. */
    entero: string;
  };
  /**
   * La cadena deductiva, con el paso EXACTO en el que cada intento se detiene.
   *
   * La ficha de Parménides promete que cada intento muestre qué paso lo impide, y ocho copias
   * anónimas no pueden señalar nada. Aquí la cadena está siempre a la vista —es lo que la idea
   * afirma que tiene más autoridad que los ojos— y el intento la recorre hasta chocar. Se descartó
   * mostrar solo el paso que bloquea: sin los anteriores no se ve que sea una cadena, que es
   * precisamente lo que hace incómoda la conclusión.
   */
  pasos?: {
    lista: string[];
    /** Lo que se lee bajo el paso que detiene el intento. */
    marca: string;
  };
  /** Rótulos del modo `argumento`. */
  argumento?: {
    /** Botón que añade la premisa normativa que falta. */
    anadir: string;
    /** Lo que se lee dentro del hueco mientras nadie lo ha cerrado. */
    hueco: string;
    /** Marca de la banda descriptiva. */
    descriptivo: string;
    /** Marca de la banda normativa. */
    normativo: string;
  };
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;

/** Franja inferior donde viven las piezas nombradas de `secuencia` y `pasos`. */
const FILA = { y: 120, alto: 56, margen: 30, hueco: 12 };

function repartir(n: number): { x: number; ancho: number }[] {
  const ancho = (ANCHO - FILA.margen * 2 - FILA.hueco * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => ({ x: FILA.margen + i * (ancho + FILA.hueco), ancho }));
}

export function crearPrueba(contenedor: HTMLElement, op: OpcionesPrueba): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  if (op.modo === 'argumento') return crearArgumento(contenedor, op, paleta);

  let elegido = 0;
  let aplicada = false;
  const probados = new Set<number>();
  /** Momentos retirados del tramo en curso. Se vacía al cambiar de candidato. */
  const retirados = new Set<number>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.peticion,
  }) as SVGSVGElement;

  const cx = ANCHO / 2;
  const conSecuencia = Boolean(op.secuencia);
  const conPasos = Boolean(op.pasos?.lista.length);

  /*
   * Tres disposiciones verticales, elegidas de una vez.
   *
   * Sin franja inferior, el anillo de copias se abre para ocupar el marco: encogido, la
   * universalización se leía como una viñeta pequeña en vez de como un mundo entero aplicando la
   * misma regla. Con franja, la propuesta sube y le cede sitio; la secuencia sube más porque además
   * necesita la banda de los arcos de dependencia entre la propuesta y sus momentos.
   */
  const DISP = conSecuencia
    ? { peticion: 18, cy: 52, alto: 44 }
    : conPasos
      ? { peticion: 26, cy: 76, alto: 60 }
      : { peticion: 32, cy: 126, alto: 60 };
  const cy = DISP.cy;

  // La petición es texto de la ficha: en inglés se alarga y un `<text>` en bruto se saldría del marco.
  rotulo(raiz, op.peticion, {
    x: cx, y: DISP.peticion, ancho: ANCHO - 40, color: paleta.neutro, maxLineas: 1,
  });

  // La propuesta, en el centro.
  const caja = svg('rect', { x: cx - 186, y: cy - DISP.alto / 2, width: 372, height: DISP.alto, rx: 2, fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.enfasis, 'vector-effect': 'non-scaling-stroke', 'data-trazo': '' });

  // Las instancias que genera la prueba: réplicas alrededor. Solo cuando no hay franja inferior:
  // un anillo y una fila de piezas nombradas ocupan el mismo hueco y dicen cosas distintas.
  const instancias = conSecuencia || conPasos ? [] : Array.from({ length: 8 }, (_, i) => {
    const ang = (-Math.PI / 2) + (i * 2 * Math.PI) / 8;
    return svg('rect', {
      // El anillo se abre hasta los bordes: es «todo el mundo aplicando la regla», y encogido en el
      // centro decía más bien «unos cuantos alrededor».
      x: cx + Math.cos(ang) * 214 - 32, y: cy + Math.sin(ang) * 98 - 11,
      width: 64, height: 22, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.fino,
      'vector-effect': 'non-scaling-stroke', opacity: 0,
    });
  });

  // La grieta: aparece solo cuando la propuesta se destruye a sí misma. Se mide desde la caja para
  // que siga cruzándola cuando la disposición la encoge.
  const mitad = DISP.alto / 2;
  const grieta = svg('path', {
    d: `M ${cx - 60} ${cy - mitad + 6} l 18 ${mitad - 6} l -14 ${mitad - 6}`,
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
    'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', opacity: 0,
  });

  // Capa propia para el texto de la propuesta: el rótulo mutable se inserta él mismo al ponerle
  // texto, y sin un sitio reservado acabaría pintándose por encima de la grieta.
  const capaTexto = svg('g');
  raiz.append(...instancias, caja, capaTexto, grieta);
  /*
   * El ancho es exactamente el de la caja, y no algo más estrecho con margen, a propósito: así el
   * rótulo se parte justo cuando el `<text>` en bruto de antes se habría salido, y ni un carácter
   * antes. La idea que no declara ninguna capacidad conserva sus tres propuestas en una sola línea.
   */
  const texto = rotuloMutable(capaTexto, {
    x: cx, y: cy + 5, ancho: 372, color: paleta.senal, interlineado: 14, maxLineas: 2,
  });

  // ---- Capacidad «pasos»: la cadena deductiva, igual para todos los intentos ----
  const listaPasos = op.pasos?.lista ?? [];
  const repartoPasos = repartir(Math.max(1, listaPasos.length));
  const cajasPaso = listaPasos.map((paso, i) => {
    const { x, ancho } = repartoPasos[i]!;
    const g = svg('g');
    const cajaPaso = svg('rect', {
      x, y: FILA.y, width: ancho, height: FILA.alto, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    g.append(cajaPaso);
    const et = rotulo(g, paso, {
      x: x + ancho / 2, y: FILA.y + FILA.alto / 2, ancho: ancho - 12,
      color: paleta.neutro, interlineado: 12, maxLineas: 3,
    });
    raiz.append(g);
    // Una marca por paso, y no una sola que se mueva: `rotuloMutable` fija su x al construirse, y
    // el paso que bloquea cambia con cada intento.
    const marca = rotuloMutable(raiz, {
      x: x + ancho / 2, y: 190, ancho: 136, color: paleta.senal, interlineado: 12, maxLineas: 2,
    });
    if (i > 0) {
      raiz.append(svg('line', {
        x1: x - FILA.hueco, y1: FILA.y + FILA.alto / 2, x2: x, y2: FILA.y + FILA.alto / 2,
        stroke: paleta.neutro, 'stroke-width': TRAZO.fino, 'vector-effect': 'non-scaling-stroke',
      }));
    }
    return { g, caja: cajaPaso, et, marca };
  });

  // ---- Capacidad «secuencia»: los momentos del tramo elegido ----
  const capaArcos = svg('g');
  const capaMomentos = svg('g');
  raiz.append(capaArcos, capaMomentos);
  const mensajeSecuencia = op.secuencia
    ? rotuloMutable(raiz, { x: cx, y: 200, ancho: ANCHO - 60, color: paleta.senal, interlineado: 12, maxLineas: 3 })
    : null;

  let momentos: { g: SVGElement; caja: SVGElement; et: SVGTextElement; i: number }[] = [];
  let arcos: { arco: SVGElement; de: number; a: number }[] = [];
  let filaDe = -1;

  function montarSecuencia(): void {
    const sec = op.secuencia;
    if (!sec || filaDe === elegido) return;
    filaDe = elegido;
    capaMomentos.replaceChildren();
    capaArcos.replaceChildren();
    const lista = op.candidatos[elegido]!.momentos ?? [];
    const reparto = repartir(Math.max(1, lista.length));

    momentos = lista.map((m, i) => {
      const { x, ancho } = reparto[i]!;
      const g = svg('g');
      const cajaM = svg('rect', {
        x, y: FILA.y, width: ancho, height: FILA.alto, rx: 2,
        fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.base,
        'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
      });
      g.append(cajaM);
      const et = rotulo(g, m.texto, {
        x: x + ancho / 2, y: FILA.y + FILA.alto / 2, ancho: ancho - 12,
        color: paleta.senal, interlineado: 12, maxLineas: 4,
      });
      capaMomentos.append(g);
      marcarInteractivo(cajaM, paleta);
      // El trazo roto es aquí el estado «retirado», así que el momento presente se dibuja entero.
      cajaM.setAttribute('stroke-dasharray', '');
      cajaM.setAttribute('role', 'button');
      cajaM.setAttribute('aria-label', sec.retirar.replace('{momento}', m.texto));
      const quitar = (): void => retirar(i);
      cajaM.addEventListener('click', quitar);
      cajaM.addEventListener('keydown', (e) => {
        const k = (e as KeyboardEvent).key;
        if (k === 'Enter' || k === ' ') { e.preventDefault(); quitar(); }
      });
      return { g, caja: cajaM, et, i };
    });

    /*
     * Los arcos de dependencia se levantan por encima de la fila, y cuanto más lejos está el momento
     * del que se depende, más alto sube el arco. Dibujados todos a la misma altura se solapaban y no
     * se distinguía qué salía de dónde, que es justo lo único que hay que leer aquí.
     */
    arcos = [];
    lista.forEach((m, i) => {
      for (const j of m.dependeDe ?? []) {
        const a = reparto[j];
        const b = reparto[i];
        if (!a || !b) continue;
        const x1 = a.x + a.ancho / 2;
        const x2 = b.x + b.ancho / 2;
        const salto = Math.max(1, Math.abs(i - j));
        const arco = svg('path', {
          d: `M ${x1} ${FILA.y} Q ${(x1 + x2) / 2} ${FILA.y - 22 * salto} ${x2} ${FILA.y}`,
          fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.fino,
          'vector-effect': 'non-scaling-stroke',
        });
        capaArcos.append(arco);
        arcos.push({ arco, de: j, a: i });
      }
    });
  }

  /**
   * Retirar un momento se lleva por delante todo lo que colgaba de él, en cadena.
   * El cierre transitivo es la tesis: quitar la pieza incómoda no deja el resto en pie.
   */
  function retirar(i: number): void {
    const sec = op.secuencia;
    if (!sec || retirados.has(i)) return;
    const lista = op.candidatos[elegido]!.momentos ?? [];
    const fuera = new Set<number>([i]);
    const caidos: number[] = [];
    const pila = [i];
    while (pila.length) {
      const actual = pila.pop()!;
      lista.forEach((m, k) => {
        if (fuera.has(k) || !(m.dependeDe ?? []).includes(actual)) return;
        fuera.add(k);
        caidos.push(k);
        pila.push(k);
      });
    }
    for (const k of fuera) retirados.add(k);
    // La prueba ya no vale: se aplicó a un tramo que ya no es este.
    aplicada = false;
    mensajeSecuencia?.poner(caidos.length
      ? sec.arrastre
        .replace('{momento}', lista[i]!.texto)
        .replace('{arrastrados}', caidos.map((k) => lista[k]!.texto).join(' · '))
      : sec.suelto.replace('{momento}', lista[i]!.texto));
    resolver(contenedor, sec.editado);
    pintar();
  }

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const selectores = op.candidatos.map((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.texto;
    b.addEventListener('click', () => {
      elegido = i;
      aplicada = false;
      retirados.clear();
      mensajeSecuencia?.poner('');
      // El veredicto pertenecía a la propuesta anterior: dejarlo en pantalla al cambiar de
      // candidato mostraría una conclusión que no corresponde a lo que se está viendo.
      contenedor.querySelector('.vis-resolucion')?.remove();
      pintar();
    });
    controles.append(b);
    return b;
  });
  const aplicar = document.createElement('button');
  aplicar.type = 'button';
  aplicar.textContent = op.nombrePrueba;
  aplicar.addEventListener('click', () => {
    aplicada = true;
    probados.add(elegido);
    pintar();
    resolver(contenedor, op.candidatos[elegido]!.veredicto);
    if (probados.size >= op.candidatos.length) resolver(contenedor, op.resolucion);
  });
  controles.append(aplicar);

  const restaurar = op.secuencia ? document.createElement('button') : null;
  if (restaurar && op.secuencia) {
    const sec = op.secuencia;
    restaurar.type = 'button';
    restaurar.textContent = sec.restaurar;
    restaurar.addEventListener('click', () => {
      retirados.clear();
      mensajeSecuencia?.poner('');
      resolver(contenedor, sec.entero);
      pintar();
    });
    controles.append(restaurar);
  }

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    const c = op.candidatos[elegido]!;
    montarSecuencia();
    texto.poner(c.texto);
    selectores.forEach((b, i) => b.setAttribute('aria-pressed', String(i === elegido)));

    const editado = retirados.size > 0;
    aplicar.disabled = aplicada || editado;
    aplicar.textContent = editado && op.secuencia
      ? op.secuencia.bloqueado
      : aplicada
        ? op.aplicadaTexto
        : op.nombrePrueba;
    if (restaurar) restaurar.disabled = !editado;

    // Un tramo del que se ha quitado algo ya está roto, aunque nadie haya aplicado la prueba.
    const roto = (aplicada && !c.sobrevive) || editado;
    instancias.forEach((el, i) => {
      el.setAttribute('opacity', aplicada ? '1' : '0');
      el.setAttribute('stroke-dasharray', roto ? '2 4' : '');
      el.setAttribute('stroke', roto ? paleta.neutro : paleta.acento);
      el.style.transitionDelay = `${i * 40}ms`;
    });
    caja.setAttribute('stroke', roto ? paleta.neutro : paleta.acento);
    caja.setAttribute('stroke-dasharray', roto ? '4 4' : '');
    caja.setAttribute('opacity', roto ? String(ATENUADO) : '1');
    /*
     * El rótulo del tramo roto NO se apaga: se apaga su caja. Ver `ATENUADO`; atenuar texto lo deja
     * por debajo del contraste legible y el estado ya lo dicen el color y el trazo discontinuo.
     */
    grieta.setAttribute('opacity', roto ? '1' : '0');

    // El intento recorre la cadena y se para donde le toca; lo que hay más allá queda sin visitar.
    const tope = aplicada ? (c.bloqueaEn ?? -1) : -1;
    cajasPaso.forEach((p, i) => {
      const bloquea = tope >= 0 && i === tope;
      const sinVisitar = tope >= 0 && i > tope;
      const color = bloquea ? paleta.senal : sinVisitar || tope < 0 ? paleta.neutro : paleta.acento;
      p.caja.setAttribute('opacity', sinVisitar ? String(ATENUADO) : '1');
      p.caja.setAttribute('stroke', color);
      p.caja.setAttribute('stroke-width', String(bloquea ? TRAZO.enfasis : TRAZO.base));
      p.caja.setAttribute('stroke-dasharray', sinVisitar ? '4 4' : '');
      p.et.setAttribute('fill', color);
      p.marca.poner(bloquea ? (op.pasos?.marca ?? '') : '');
    });

    momentos.forEach((m) => {
      const fuera = retirados.has(m.i);
      m.caja.setAttribute('opacity', fuera ? String(ATENUADO) : '1');
      m.caja.setAttribute('stroke', fuera ? paleta.neutro : paleta.acento);
      m.caja.setAttribute('stroke-dasharray', fuera ? '4 4' : '');
      m.caja.setAttribute('aria-disabled', String(fuera));
      m.et.setAttribute('fill', fuera ? paleta.neutro : paleta.senal);
    });
    arcos.forEach((a) => {
      const cortado = retirados.has(a.de) || retirados.has(a.a);
      a.arco.setAttribute('opacity', cortado ? String(ATENUADO) : '0.8');
      a.arco.setAttribute('stroke-dasharray', cortado ? '3 3' : '');
    });
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}

/**
 * Modo «argumento»: la conclusión se separa de las premisas y deja un hueco que hay que rellenar.
 *
 * El argumento se ofrece de una pieza, como se oye por la calle, y parece continuo. Comprobar el
 * paso lo abre: la conclusión baja y entre ella y la premisa queda un sitio vacío. Ese vacío es toda
 * la idea de Hume —del ser no se sigue el deber— y aquí no es una frase sino un agujero que se ve.
 * Solo se cierra metiendo dentro una premisa que ya diga «debe», y entonces la conclusión sí se
 * apoya en algo. Cuando el argumento la trae declarada, el hueco aparece ya ocupado: la diferencia
 * entre los dos casos es lo único que hay que mirar.
 */
function crearArgumento(contenedor: HTMLElement, op: OpcionesPrueba, paleta: Paleta): Visualizacion {
  const arg = op.argumento;
  let elegido = 0;
  let comprobado = false;
  let cerrado = false;
  const probados = new Set<number>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.peticion,
  }) as SVGSVGElement;

  const cx = ANCHO / 2;
  const X = 70;
  const W = 420;
  const Y_PREMISA = 36;
  const H_CAJA = 36;
  const Y_HUECO = 86;
  const H_HUECO = 40;
  /** Lo que baja la conclusión al abrirse el hueco: exactamente lo que el hueco mide más su unión. */
  const CAIDA = 54;

  rotulo(raiz, op.peticion, {
    x: cx, y: 20, ancho: ANCHO - 40, color: paleta.neutro, maxLineas: 1,
  });

  const premisa = svg('rect', {
    x: X, y: Y_PREMISA, width: W, height: H_CAJA, rx: 2,
    fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });
  raiz.append(premisa);
  const capaPremisa = svg('g');
  raiz.append(capaPremisa);
  const textoPremisa = rotuloMutable(capaPremisa, {
    x: cx, y: Y_PREMISA + 20, ancho: W - 24, color: paleta.acento, interlineado: 13, maxLineas: 2,
  });
  if (arg) {
    // La marca de la cópula: nombrar «es» y «debe» es lo que convierte dos cajas en un salto.
    rotulo(raiz, arg.descriptivo, {
      x: X - 12, y: Y_PREMISA + 20, ancho: 56, color: paleta.acento, ancla: 'end', maxLineas: 1,
    });
  }

  const union1 = svg('line', {
    x1: cx, y1: Y_PREMISA + H_CAJA, x2: cx, y2: Y_HUECO,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'vector-effect': 'non-scaling-stroke',
  });
  raiz.append(union1);

  const capaHueco = svg('g', { opacity: 0 });
  const hueco = svg('rect', {
    x: X, y: Y_HUECO, width: W, height: H_HUECO, rx: 2,
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
    'stroke-dasharray': '4 4', 'vector-effect': 'non-scaling-stroke',
  });
  capaHueco.append(hueco);
  raiz.append(capaHueco);
  const textoHueco = rotuloMutable(capaHueco, {
    x: cx, y: Y_HUECO + 22, ancho: W - 24, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });

  const union2 = svg('line', {
    x1: cx, y1: Y_HUECO + H_HUECO, x2: cx, y2: Y_HUECO + CAIDA,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'vector-effect': 'non-scaling-stroke',
    opacity: 0,
  });
  raiz.append(union2);

  /*
   * La conclusión vive en su propio grupo porque se desplaza entera. Se mueve con `style.transform`
   * y no con el atributo `transform`: una animación CSS sobre el mismo elemento sustituye al
   * atributo en vez de componerse con él, y la caja aparecía 54 unidades más arriba de la cuenta.
   */
  const grupoConclusion = svg('g');
  const cajaConclusion = svg('rect', {
    x: X, y: Y_HUECO, width: W, height: H_CAJA, rx: 2,
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });
  grupoConclusion.append(cajaConclusion);
  raiz.append(grupoConclusion);
  const textoConclusion = rotuloMutable(grupoConclusion, {
    x: cx, y: Y_HUECO + 20, ancho: W - 24, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });
  if (arg) {
    rotulo(grupoConclusion, arg.normativo, {
      x: X - 12, y: Y_HUECO + 20, ancho: 56, color: paleta.senal, ancla: 'end', maxLineas: 1,
    });
  }

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const selectores = op.candidatos.map((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.texto;
    b.addEventListener('click', () => {
      elegido = i;
      comprobado = false;
      cerrado = false;
      contenedor.querySelector('.vis-resolucion')?.remove();
      pintar();
    });
    controles.append(b);
    return b;
  });

  const comprobar = document.createElement('button');
  comprobar.type = 'button';
  comprobar.textContent = op.nombrePrueba;
  comprobar.addEventListener('click', () => {
    const c = op.candidatos[elegido]!;
    comprobado = true;
    // Un argumento que declara su premisa normativa no abre ningún hueco: ya la tenía puesta.
    cerrado = Boolean(c.puenteDeclarado);
    probados.add(elegido);
    pintar();
    if (!movimientoReducido()) {
      grupoConclusion.animate(
        [{ transform: 'translateY(0)' }, { transform: `translateY(${CAIDA}px)` }],
        { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      );
    }
    resolver(contenedor, c.veredicto);
    if (probados.size >= op.candidatos.length) resolver(contenedor, op.resolucion);
  });
  controles.append(comprobar);

  const anadir = document.createElement('button');
  anadir.type = 'button';
  anadir.textContent = arg?.anadir ?? op.nombrePrueba;
  const cerrarHueco = (): void => {
    if (!comprobado || cerrado) return;
    cerrado = true;
    pintar();
    const c = op.candidatos[elegido]!;
    resolver(contenedor, c.veredictoCerrado ?? c.veredicto);
  };
  anadir.addEventListener('click', cerrarHueco);
  controles.append(anadir);

  // El hueco es también el destino: se puede rellenar pulsándolo, además de con el botón.
  hueco.setAttribute('role', 'button');
  if (arg) hueco.setAttribute('aria-label', arg.anadir);
  hueco.addEventListener('click', cerrarHueco);
  hueco.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === 'Enter' || k === ' ') { e.preventDefault(); cerrarHueco(); }
  });

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    const c = op.candidatos[elegido]!;
    selectores.forEach((b, i) => b.setAttribute('aria-pressed', String(i === elegido)));
    textoPremisa.poner(c.premisa ?? c.texto);
    textoConclusion.poner(c.conclusion ?? '');

    grupoConclusion.style.transform = comprobado ? `translateY(${CAIDA}px)` : 'none';
    capaHueco.setAttribute('opacity', comprobado ? '1' : '0');
    // Además de invisible, ausente: un rectángulo con `role` de botón y opacidad 0 sigue anunciándose
    // en el lector de pantalla, y todavía no hay ningún hueco que rellenar.
    capaHueco.setAttribute('visibility', comprobado ? 'visible' : 'hidden');
    textoHueco.poner(cerrado ? (c.puente ?? '') : (arg?.hueco ?? ''));
    hueco.setAttribute('stroke-dasharray', cerrado ? '' : '4 4');
    hueco.setAttribute('stroke-width', String(cerrado ? TRAZO.base : TRAZO.enfasis));
    hueco.setAttribute('stroke', cerrado ? paleta.acento : paleta.senal);
    textoHueco.color(cerrado ? paleta.acento : paleta.senal);

    union2.setAttribute('opacity', comprobado ? '1' : '0');
    union2.setAttribute('stroke-dasharray', cerrado ? '' : '4 4');
    union2.setAttribute('stroke', cerrado ? paleta.senal : paleta.neutro);

    // Una conclusión que no se apoya en nada se dibuja con el trazo roto de «esto no está sostenido».
    cajaConclusion.setAttribute('stroke', comprobado && !cerrado ? paleta.neutro : paleta.senal);
    cajaConclusion.setAttribute('stroke-dasharray', comprobado && !cerrado ? '4 4' : '');
    cajaConclusion.setAttribute('stroke-width', String(cerrado ? TRAZO.enfasis : TRAZO.base));

    /*
     * La marca de «esto se puede tocar» solo mientras el hueco está abierto: anunciarla antes es
     * prometer una interacción que no existe, y dejar tabulable un rectángulo invisible es peor.
     */
    if (comprobado && !cerrado) {
      if (!hueco.classList.contains('vis-interactivo')) marcarInteractivo(hueco, paleta);
      hueco.setAttribute('stroke', paleta.senal);
      hueco.setAttribute('stroke-dasharray', '4 4');
      hueco.setAttribute('stroke-width', String(TRAZO.enfasis));
    } else {
      hueco.classList.remove('vis-interactivo');
      hueco.removeAttribute('tabindex');
    }

    comprobar.disabled = comprobado;
    anadir.disabled = !comprobado || cerrado;
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
