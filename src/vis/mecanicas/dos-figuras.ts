/**
 * Mecánica «dos figuras»: dos siluetas que deberían coincidir se separan al imponer condiciones, y
 * **sostener esa distancia cuesta**, lo cual se ve en el tirante que las une.
 *
 * Cubre seis ideas que dicen lo mismo desde escuelas enfrentadas:
 *  - Aceptación y cambio (Rogers): lo que experimentas frente a lo que crees que debes mostrar.
 *  - La sombra (Jung): la imagen que das frente a lo que has apartado.
 *  - La mala fe (Sartre): quien eres frente al papel tras el que te escondes.
 *  - El problema mente-cuerpo (Descartes): dos descripciones que no se dejan enlazar.
 *  - Contrato y voluntad general (Rousseau), y la dialéctica del reconocimiento (Hegel).
 *
 * El detalle que hace de esto un argumento y no un adorno: **el usuario nunca empuja las figuras
 * para juntarlas**. Solo puede quitar condiciones. Convergen por su cuenta, que es exactamente la
 * tesis de Rogers y la de Jung.
 *
 * POR QUÉ SE REHIZO. Eran dos círculos y un porcentaje escrito. Su alternativa textual prometía «un
 * coste de energía visible», y un número no es visible en el sentido que importa aquí: se lee, no se
 * siente. Ahora el coste ES el tirante —se tensa, se afina y tiembla—, y el porcentaje sobra.
 *
 * TRES IDEAS PEDÍAN MÁS QUE UNA DISTANCIA. Sus fichas prometían un mecanismo concreto que separar dos
 * siluetas no llega a afirmar, y la pieza se quedaba a medias de su propia alternativa textual:
 *
 *  - La sombra pide que lo descartado SE ACUMULE y APAREZCA SOBRE OTROS. Eso necesita otros: una
 *    distancia entre dos no puede decir nada de un tercero. Modo `proyeccion`.
 *  - La mala fe pide un molde que RECORTE LO QUE LA FIGURA PUEDE HACER. Lo recortado tiene que
 *    verse desaparecer, así que hace falta dibujar antes lo que había. Modo `molde`.
 *  - El problema mente-cuerpo pide una flecha que EL USUARIO INTENTE trazar y que no llegue. Eso sí
 *    cabe entre las dos siluetas —el hueco que abren es exactamente donde iría la flecha—, así que
 *    aquí no hay modo nuevo sino una capa opcional sobre `distancia`. Ver `flecha`.
 *
 * Las tres capacidades son opcionales y ninguna toca el recorrido de quien no las declara: las otras
 * tres ideas de esta mecánica se montan hoy con el mismo dibujo, píxel por píxel.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, movimientoReducido, paletaDe, resolver, rotulo,
  rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Paleta, Visualizacion } from '../lenguaje';

export interface CondicionSpec {
  /** Lo que se impone: «solo si eres fuerte». */
  nombre: string;
  /** Qué produce esa exigencia. */
  efecto: string;
  /** Cuánto separa, de 0 a 1. */
  peso: number;
}

export interface CondicionMedidorSpec {
  nombre: string;
  /** Cuánto mueve el medidor de cada figura, de −1 a 1. Pueden moverse en sentidos opuestos. */
  deltaA: number;
  deltaB: number;
  efecto: string;
}

/** Un tercero sobre el que aparece proyectado lo que la figura ha apartado de sí. */
export interface OtroSpec {
  /** Cómo se le nombra. Está ahí desde el principio, antes de que nadie proyecte nada. */
  nombre: string;
  /**
   * Lo que más molesta de él. **No se muestra hasta que el rasgo correspondiente está apartado**:
   * el personaje no cambia, lo que cambia es lo que se ve en él. Ese orden ES la tesis.
   */
  molesta: string;
}

export interface OpcionesDosFiguras {
  corrienteId: string;
  /**
   * Qué se mira entre las dos figuras.
   *
   * `distancia` (por omisión) es el gesto original: imponer condiciones separa a las dos figuras y
   * sostener esa separación cuesta, lo que se ve como una atadura que se tensa.
   *
   * `medidores` sirve a una tesis que la distancia no puede expresar: que someter al otro no aleja
   * a los dos por igual sino que hace DIVERGIR dos magnitudes, estancando la de quien somete
   * mientras la del sometido crece por otra vía. Una sola distancia es simétrica por construcción y
   * no puede afirmar una asimetría; hacen falta dos medidas independientes.
   *
   * `proyeccion` hace falta porque la distancia solo habla de dos, y la proyección habla siempre de
   * un tercero: lo apartado no se queda entre tú y tu fachada, reaparece encima de otra persona. Se
   * descartó reservar una franja dentro de `distancia` para meter ahí a los demás; con las dos
   * siluetas separándose 108 px quedaban 138 px para tres personajes con dos rótulos cada uno, y
   * eso no es reservar espacio, es apretarlo hasta que no se lee.
   *
   * `molde` hace falta porque un molde que limita movimientos exige que los movimientos ESTÉN
   * DIBUJADOS antes de recortarlos. Una distancia entre dos siluetas no tiene nada que recortar.
   */
  modo?: 'distancia' | 'medidores' | 'proyeccion' | 'molde';
  /** Solo en `medidores`: qué mide cada uno. */
  medidores?: [string, string];
  /** Solo en `medidores`: las condiciones, con su efecto sobre cada medidor. */
  condicionesMedidor?: CondicionMedidorSpec[];
  /** Solo en `medidores`: lo que se lee cuando el del sometido supera al del dominador. */
  reversion?: string;
  /**
   * Solo en `proyeccion`. Cada condición aparta un rasgo, y cada rasgo apartado va a parar a UN
   * personaje: `otros[i]` es el destino de `condiciones[i]`. El emparejamiento por índice y no por
   * una clave explícita es deliberado: obliga a la ficha a responder por cada rasgo que aparta, que
   * es justamente lo que la idea afirma que nadie hace.
   */
  proyeccion?: {
    otros: OtroSpec[];
    /** Nombre accesible del cúmulo. Es también el gesto: pulsarlo reintegra lo último apartado. */
    reintegrar: string;
  };
  /** Solo en `molde`: los rótulos de lo que el molde recorta y de lo que se pierde al recortarlo. */
  molde?: {
    /** Rótulo del medidor que baja con cada excusa. Baja EN EL MISMO INSTANTE que las opciones. */
    responsabilidad: string;
    /** Rótulo del botón —y del propio dibujo— que quita todos los moldes de una vez. */
    retirar: string;
    /** Cómo se llama el abanico de movimientos que el molde va cerrando. */
    movimientos: string;
  };
  /**
   * Capa opcional sobre `distancia`: una flecha causal que el usuario INTENTA trazar y que no llega.
   *
   * No es un modo aparte porque la geometría ya estaba: el hueco que abren las dos siluetas al
   * separarse es exactamente el trayecto que la flecha tendría que recorrer, y va vacío. Sacarlo a
   * un modo propio habría duplicado el dibujo entero para no cambiarlo.
   */
  flecha?: {
    /** Rótulo del botón que intenta trazarla. */
    intentar: string;
    /** Lo que se lee cuando se ha quedado a medio camino. */
    sinVocabulario: string;
    /** Rótulo del botón que superpone las dos descripciones. */
    superponer: string;
    /** Lo que se lee al intentar trazarla cuando ya no quedan dos cosas separadas. */
    sinDosCosas: string;
  };
  figuraA: string;
  figuraB: string;
  condiciones: CondicionSpec[];
  /** Nombre del coste de sostener la distancia: «energía», «tensión»… */
  coste: string;
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
const CY = 104;
const SEPARACION_MAX = 108;

/*
 * Hasta dónde llega la flecha antes de quedarse sin vocabulario, y cuánto tarda en no llegar.
 *
 * 0,55 y no 0,9: parándose casi al final se lee «casi lo consigue», que invita a intentarlo mejor.
 * Poco más de la mitad se lee como lo que es, un trayecto que no tiene segunda mitad.
 */
const LIMITE_FLECHA = 0.55;
const AVANCE_FLECHA = 720;
const SOSTEN_FLECHA = 900;
const DESVANECE_FLECHA = 500;

/**
 * Silueta de pie, de trazo. Dos formas iguales: lo que las distingue es el color y la distancia.
 *
 * `relleno` la convierte en una mancha maciza sin cambiar ni un punto del contorno. Existe para que
 * la sombra de `proyeccion` sea LA MISMA FIGURA y no otra: si el cúmulo tuviera forma propia se leería
 * como un personaje más, y la tesis es que eso apartado es uno mismo. Sin `relleno` el resultado es
 * idéntico al de siempre, que es lo que necesitan las ideas que no declaran la capacidad.
 */
function silueta(cx: number, color: string, grosor: number, relleno?: string): SVGElement {
  const g = svg('g');
  /*
   * Cabeza, cuello y tronco cerrado por abajo. En la primera versión la cabeza flotaba sobre un arco
   * abierto y no se leía una figura, se leían un círculo y una arcada. El cuello y el cierre son lo
   * que convierten dos trazos en alguien.
   */
  const macizo = relleno ?? 'none';
  g.append(
    svg('circle', { cx, cy: CY - 46, r: 15, fill: macizo, stroke: color, 'stroke-width': grosor, 'vector-effect': 'non-scaling-stroke' }),
    svg('line', {
      x1: cx, y1: CY - 31, x2: cx, y2: CY - 2,
      stroke: color, 'stroke-width': grosor, 'vector-effect': 'non-scaling-stroke',
    }),
    svg('path', {
      d: `M${cx - 26} ${CY + 56} C${cx - 26} ${CY - 20}, ${cx + 26} ${CY - 20}, ${cx + 26} ${CY + 56} Z`,
      fill: macizo, stroke: color, 'stroke-width': grosor,
      'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    }),
  );
  return g;
}

/**
 * Coloca una silueta a escala en un punto cualquiera del lienzo.
 *
 * `silueta()` nace anclada a CY, que es lo que necesita el modo original. Los otros dos modos la
 * quieren pequeña y repartida, y reescribirla con parámetros de posición habría obligado a tocar el
 * recorrido que ya está en producción. Se compone con transformaciones y el dibujo no se entera.
 * El −2,5 es el centro real de su recuadro (de CY−61 a CY+56), no CY: centrando por CY las figuras
 * pequeñas quedaban descolgadas hacia abajo respecto de su propio rótulo.
 */
function siluetaEn(x: number, y: number, escala: number, color: string, relleno?: string): SVGElement {
  const g = svg('g');
  g.append(silueta(0, color, TRAZO.base, relleno));
  g.setAttribute('transform', `translate(${x} ${y}) scale(${escala}) translate(0 ${-(CY - 2.5)})`);
  return g;
}

export function crearDosFiguras(contenedor: HTMLElement, op: OpcionesDosFiguras): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  // Los recorridos se separan aquí: comparten lenguaje gráfico, no estructura. Ver descomponer.ts.
  if (op.modo === 'medidores') return crearMedidores(contenedor, op, paleta);
  if (op.modo === 'proyeccion') return crearProyeccion(contenedor, op, paleta);
  if (op.modo === 'molde') return crearMolde(contenedor, op, paleta);

  const activas = new Set<number>();
  /** Instante en que empezó el intento de trazar la flecha; −1 mientras no hay ninguno en curso. */
  let intento = -1;
  let avisadoDelIntento = false;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const cx = ANCHO / 2;

  /*
   * El tirante va DEBAJO de las figuras en el orden de pintado, para que ellas queden encima y se
   * lea que el tirante las une en vez de atravesarlas.
   */
  const tirante = svg('path', {
    fill: 'none', stroke: paleta.acento, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke',
  });
  raiz.append(tirante);

  const figA = silueta(cx, paleta.senal, TRAZO.base);
  const figB = silueta(cx, paleta.acento, TRAZO.enfasis);
  raiz.append(figA, figB);

  /*
   * La flecha que no se deja trazar. Va por encima de las figuras y a la altura del cuello, que es
   * la única banda del hueco donde no hay más tinta que los dos cuellos: a la altura de las cabezas
   * el trayecto útil se queda en 78 px y a la del tronco en 56, mientras que aquí son los 108
   * enteros de la separación. Con 43 px de recorrido no se percibe que algo se ha quedado a medias.
   *
   * No lleva `data-trazo`: no forma parte de la entrada de la pieza, aparece cuando se intenta.
   */
  const flechaCuerpo = op.flecha
    ? svg('path', {
      fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis, 'stroke-linecap': 'round',
      'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', opacity: 0,
    })
    : null;
  const flechaCabo = op.flecha
    ? svg('path', {
      fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
      'stroke-dasharray': '2 5', 'vector-effect': 'non-scaling-stroke', opacity: 0,
    })
    : null;
  if (flechaCuerpo && flechaCabo) raiz.append(flechaCuerpo, flechaCabo);

  const etA = rotulo(raiz, op.figuraA, { x: cx, y: CY + 80, ancho: 180, color: paleta.senal, interlineado: 12 });
  const etB = rotulo(raiz, op.figuraB, { x: cx, y: CY - 76, ancho: 180, color: paleta.acento, interlineado: 12 });

  /*
   * El coste, como barra y no como número. Sigue habiendo una cifra en el rótulo porque conviene
   * poder decir cuánto, pero lo que se percibe es la barra creciendo y el tirante tensándose.
   */
  /*
   * La barra del coste, con su rótulo a la izquierda y no encima.
   *
   * Encima chocaba con el nombre de la figura de abajo justo al máximo de separación, que es cuando
   * más importa leerlos: los rótulos de las figuras se mueven con ellas y acababan en el mismo sitio.
   */
  const BARRA = { izq: 208, der: ANCHO - 26, y: ALTO - 22 };
  raiz.append(svg('line', {
    x1: BARRA.izq, y1: BARRA.y, x2: BARRA.der, y2: BARRA.y,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke', opacity: 0.35,
  }));
  const barra = svg('line', {
    x1: BARRA.izq, y1: BARRA.y, x2: BARRA.izq, y2: BARRA.y,
    stroke: paleta.acento, 'stroke-width': TRAZO.enfasis, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke',
  });
  raiz.append(barra);
  /*
   * El rótulo del coste dice CÓMO SE LLAMA, no cuánto vale. El cuánto está en la barra y en el
   * tirante, que es el punto entero de la pieza: si el coste se pudiera leer en una cifra, no habría
   * hecho falta dibujarlo. Va partido para caber, porque el nombre viene del contenido.
   */
  const etCoste = rotulo(raiz, op.coste, {
    x: 24, y: BARRA.y, ancho: BARRA.izq - 48, color: paleta.senal,
    ancla: 'start', interlineado: 12, maxLineas: 2,
  });

  contenedor.append(raiz);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = op.condiciones.map((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.nombre;
    b.addEventListener('click', () => {
      if (activas.has(i)) activas.delete(i);
      else { activas.add(i); resolver(contenedor, c.efecto); }
      botones.forEach((x, k) => x.setAttribute('aria-pressed', String(activas.has(k))));
      if (activas.size === 0) resolver(contenedor, op.resolucion);
    });
    controles.append(b);
    return b;
  });

  /*
   * Los dos gestos de la flecha, solo si la ficha los pide.
   *
   * Son DOS y no uno a propósito. Con un único botón que trazara y, al fallar, superpusiera las
   * descripciones, la pieza contaría que el fracaso conduce a Spinoza, y eso es falso: superponer no
   * es la conclusión de haberlo intentado, es renunciar a la pregunta. Separados, el usuario puede
   * intentarlo tantas veces como quiera sin que nada le empuje, y superponer es una decisión suya.
   */
  if (op.flecha) {
    const trazar = document.createElement('button');
    trazar.type = 'button';
    trazar.textContent = op.flecha.intentar;
    trazar.addEventListener('click', () => {
      if (mostrada < 0.05) {
        /*
         * Superpuestas, la flecha no falla: sobra. Se dice y no se dibuja nada, porque dibujar algo
         * aquí sugeriría que queda un trayecto pendiente, y la afirmación es que ya no hay trayecto.
         */
        intento = -1;
        resolver(contenedor, op.flecha!.sinDosCosas);
        pintar(performance.now());
        return;
      }
      // Sin bucle que la avance, la flecha nace ya en su fracaso: el hallazgo no depende del gesto.
      intento = movimientoReducido() ? performance.now() - AVANCE_FLECHA : performance.now();
      avisadoDelIntento = false;
      if (movimientoReducido()) pintar(performance.now());
    });

    const superponer = document.createElement('button');
    superponer.type = 'button';
    superponer.textContent = op.flecha.superponer;
    superponer.addEventListener('click', () => {
      activas.clear();
      botones.forEach((x, k) => x.setAttribute('aria-pressed', String(activas.has(k))));
      intento = -1;
      if (movimientoReducido()) mostrada = 0;
      pintar(performance.now());
      resolver(contenedor, op.resolucion);
    });

    controles.append(trazar, superponer);
  }

  contenedor.append(controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  marcarInteractivo(figB, paleta);
  figB.removeAttribute('stroke-dasharray');

  /** Separación mostrada. Persigue a la exigida, así que las figuras se acercan y se alejan solas. */
  let mostrada = 0;
  let animacion = 0;

  function exigida(): number {
    return Math.min(1, [...activas].reduce((a, i) => a + op.condiciones[i]!.peso, 0));
  }

  /**
   * El tirante, dibujado como un muelle.
   *
   * **La tensión se lee en la forma, no en un número**: al separarse, las ondas se estiran y se
   * aplanan, que es lo que hace cualquier muelle al que se le tira. Un tramo recto y grueso no
   * diría nada; uno que se aplana dice que está al límite.
   */
  function dibujarTirante(d: number, tension: number, t: number): void {
    const x1 = cx - d / 2;
    const x2 = cx + d / 2;
    if (d < 3) { tirante.setAttribute('d', ''); return; }

    const ondas = 6;
    const amplitud = 15 * (1 - tension * 0.82);
    const tremor = movimientoReducido() ? 0 : tension ** 2 * 2.4;
    const puntos: string[] = [`M${x1} ${CY + 10}`];
    for (let i = 1; i <= ondas; i++) {
      const p = i / ondas;
      const x = x1 + (x2 - x1) * p;
      const signo = i % 2 === 0 ? 1 : -1;
      const y = CY + 10 + signo * amplitud + Math.sin(t / 40 + i) * tremor;
      puntos.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    tirante.setAttribute('d', puntos.join(' '));
    // Se afina al tensarse: un cable estirado da menos de sí, y eso se ve antes de leer nada.
    tirante.setAttribute('stroke-width', String(TRAZO.enfasis * (1 - tension * 0.5)));
    tirante.setAttribute('opacity', String(0.4 + tension * 0.6));
  }

  /**
   * La flecha causal, dibujada como un intento y no como un enlace.
   *
   * **Se queda sin vocabulario a mitad de camino, y eso se ve en el trazo**: avanza frenando, se
   * planta con la punta apuntando al vacío y lo que seguiría es un deshilache de puntos que se
   * apagan. La punta SÍ se dibuja, y ese fue el punto más discutido: sin punta no se lee una flecha,
   * se lee una raya, y hacía falta que fuera inconfundiblemente una flecha para que se notara que
   * no llega. Una flecha con punta parada en mitad del hueco dice lo que hay que decir.
   *
   * Se descartó poner un muro donde se detiene. Un muro afirma que algo la bloquea, y la objeción de
   * Isabel de Bohemia no es que haya un obstáculo: es que no queda con qué seguir describiendo.
   */
  function dibujarFlecha(d: number, t: number): void {
    if (!flechaCuerpo || !flechaCabo) return;
    if (intento < 0 || d < 8) {
      // Si el hueco se cierra con un intento en curso, el intento no queda pendiente: se cae con él.
      intento = -1;
      flechaCuerpo.setAttribute('opacity', '0');
      flechaCabo.setAttribute('opacity', '0');
      return;
    }
    const transcurrido = t - intento;
    const avance = Math.min(1, transcurrido / AVANCE_FLECHA);
    // Frena al acercarse: el vocabulario no se acaba de golpe, se va acabando.
    const suave = 1 - (1 - avance) ** 3;
    const y = CY - 16;
    const x1 = cx - d / 2;
    const punta = x1 + d * LIMITE_FLECHA * suave;
    flechaCuerpo.setAttribute(
      'd',
      `M${x1.toFixed(1)} ${y} L${punta.toFixed(1)} ${y}`
      + ` M${(punta - 8).toFixed(1)} ${y - 5} L${punta.toFixed(1)} ${y} L${(punta - 8).toFixed(1)} ${y + 5}`,
    );
    const cabo = Math.min(22, d * 0.22) * suave;
    flechaCabo.setAttribute('d', `M${(punta + 4).toFixed(1)} ${y} L${(punta + 4 + cabo).toFixed(1)} ${y}`);

    const sobra = Math.max(0, transcurrido - AVANCE_FLECHA - SOSTEN_FLECHA);
    const presencia = Math.max(0, 1 - sobra / DESVANECE_FLECHA);
    flechaCuerpo.setAttribute('opacity', String(presencia));
    flechaCabo.setAttribute('opacity', String(presencia * 0.45));
    // El intento no deja rastro: la pieza vuelve a estar como estaba y se puede repetir sin límite.
    if (presencia <= 0) intento = -1;

    if (avance >= 1 && !avisadoDelIntento) {
      avisadoDelIntento = true;
      resolver(contenedor, op.flecha!.sinVocabulario);
    }
  }

  function pintar(t: number): void {
    const d = mostrada * SEPARACION_MAX;
    figA.setAttribute('transform', `translate(${-d / 2} 0)`);
    figB.setAttribute('transform', `translate(${d / 2} 0)`);
    etA.setAttribute('transform', `translate(${-d / 2} 0)`);
    etB.setAttribute('transform', `translate(${d / 2} 0)`);
    dibujarTirante(d, mostrada, t);
    dibujarFlecha(d, t);

    barra.setAttribute('x2', String(BARRA.izq + mostrada * (BARRA.der - BARRA.izq)));
    etCoste.setAttribute('opacity', String(0.35 + mostrada * 0.65));
  }

  function bucle(): void {
    const objetivo = exigida();
    const resto = objetivo - mostrada;
    // Se posa en el objetivo: la interpolación es asintótica y «convergen solas» tiene que acabar
    // en coincidir del todo, no en quedarse a un pelo.
    mostrada = Math.abs(resto) < 0.002 ? objetivo : mostrada + resto * 0.07;
    pintar(performance.now());
    animacion = requestAnimationFrame(bucle);
  }

  if (movimientoReducido()) {
    mostrada = 0.6;
    pintar(0);
    resolver(contenedor, op.resolucion);
  } else {
    bucle();
    entrada(raiz);
  }

  return {
    destruir(): void {
      cancelAnimationFrame(animacion);
      contenedor.replaceChildren();
    },
  };
}

/**
 * Modo «medidores»: dos magnitudes que dependían la una de la otra y que al someter divergen.
 *
 * POR QUÉ NO VALE LA DISTANCIA. El modo original mide una separación, y una separación es simétrica:
 * si A se aleja de B, B se aleja de A exactamente lo mismo. La tesis de esta idea es justo lo
 * contrario —que el sometimiento afecta a los dos de manera distinta y opuesta—, y eso solo se puede
 * afirmar con dos medidas independientes que el usuario vea moverse en sentidos contrarios.
 *
 * LA REVERSIÓN LA PRODUCE EL USUARIO. No hay ningún momento guionizado en el que la pieza anuncie
 * que quien somete ha perdido: se llega ahí aplicando las condiciones una a una, y el cruce de las
 * dos barras ocurre cuando ocurre. Que el dominador se estanque no está escrito como texto sino
 * como el hecho de que su medidor no sube por mucho que se imponga.
 */
function crearMedidores(contenedor: HTMLElement, op: OpcionesDosFiguras, paleta: Paleta): Visualizacion {
  const condiciones = op.condicionesMedidor ?? [];
  const aplicadas = new Set<number>();
  // Parten iguales: el reconocimiento era mutuo antes de que nadie impusiera nada.
  let valorA = 0.5;
  let valorB = 0.5;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const yBase = 190;
  const altoMax = 120;
  const anchoBarra = 76;
  const xA = 168;
  const xB = ANCHO - 168 - anchoBarra;

  function columna(x: number, figura: string, medidor: string, color: string) {
    raiz.append(svg('line', {
      x1: x - 10, y1: yBase, x2: x + anchoBarra + 10, y2: yBase,
      stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    }));
    const barra = svg('rect', { x, y: yBase, width: anchoBarra, height: 0, rx: 1, fill: color, opacity: 0.8 });
    raiz.append(barra);
    rotulo(raiz, figura, {
      x: x + anchoBarra / 2, y: yBase + 22, ancho: anchoBarra + 90,
      color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });
    if (medidor) {
      rotulo(raiz, medidor, {
        x: x + anchoBarra / 2, y: 34, ancho: anchoBarra + 90,
        color, interlineado: 12, maxLineas: 2,
      });
    }
    return barra;
  }

  /*
   * Si los dos medidores miden LO MISMO, su nombre se dice una vez y en medio.
   *
   * En «La dialéctica del reconocimiento» ambos son «lo que su identidad recibe», y escrito sobre
   * cada columna salía la misma frase dos veces, una al lado de la otra. Leído así parece un fallo
   * de copiar y pegar, y además estropea justo lo que la pieza afirma: que la magnitud es una sola y
   * lo que diverge son los dos valores. Un único rótulo centrado lo dice bien —una vara de medir,
   * dos lecturas— y de paso libera las esquinas superiores.
   *
   * Cuando cada medidor mide una cosa distinta se mantiene el rótulo por columna, teñido del color
   * de la suya, que es lo que hace falta para no confundirlos.
   */
  const [medA, medB] = [op.medidores?.[0] ?? '', op.medidores?.[1] ?? ''];
  const magnitudCompartida = Boolean(medA) && medA === medB;

  const barraA = columna(xA, op.figuraA, magnitudCompartida ? '' : medA, paleta.senal);
  const barraB = columna(xB, op.figuraB, magnitudCompartida ? '' : medB, paleta.acento);
  if (magnitudCompartida) {
    rotulo(raiz, medA, {
      x: ANCHO / 2, y: 34, ancho: ANCHO - 220, color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });
  }
  marcarInteractivo(barraA, paleta);
  barraA.setAttribute('stroke-dasharray', '');

  const lectura = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 74, ancho: ANCHO - 380, color: paleta.neutro, interlineado: 13, maxLineas: 5,
  });

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = condiciones.map((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.nombre;
    b.addEventListener('click', () => {
      if (aplicadas.has(i)) return;
      aplicadas.add(i);
      valorA = Math.min(1, Math.max(0, valorA + c.deltaA));
      valorB = Math.min(1, Math.max(0, valorB + c.deltaB));
      lectura.poner(c.efecto);
      pintar();
      // La reversión manda sobre el efecto: es la conclusión, y solo aparece si de hecho ocurre.
      if (valorB > valorA) {
        lectura.poner(op.reversion ?? c.efecto);
        resolver(contenedor, op.resolucion);
      } else {
        resolver(contenedor, c.efecto);
      }
    });
    controles.append(b);
    return b;
  });

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    const poner = (barra: SVGElement, v: number): void => {
      const h = altoMax * v;
      barra.setAttribute('y', String(yBase - h));
      barra.setAttribute('height', String(h));
    };
    poner(barraA, valorA);
    poner(barraB, valorB);
    botones.forEach((b, i) => { b.disabled = aplicadas.has(i); });
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}

/** Tramo de una curva cuadrática, recortado en `hasta`. Sirve para verla trazarse sola. */
function curva(p0: [number, number], p1: [number, number], p2: [number, number], hasta: number): string {
  const pasos = 14;
  const puntos: string[] = [];
  for (let k = 0; k <= pasos; k++) {
    const t = (k / pasos) * hasta;
    const u = 1 - t;
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
    const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    puntos.push(`${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return puntos.join(' ');
}

/**
 * Modo «proyección»: lo que una figura descarta de sí no desaparece, se acumula, y lo acumulado
 * acaba viéndose ENCIMA DE OTRA GENTE.
 *
 * POR QUÉ NO VALE LA DISTANCIA. El modo original mide lo que hay entre dos. La proyección es una
 * afirmación sobre un tercero: que lo que más te molesta de alguien es tuyo. Con dos figuras se
 * puede mostrar que apartas algo; que ese algo reaparece en otro sitio exige que el otro sitio esté
 * en el cuadro.
 *
 * EL ORDEN ES EL ARGUMENTO. Los demás están ahí desde el principio y están limpios: tienen nombre y
 * nada más. El reproche —«lo poco que se contiene»— no viene con el personaje, aparece cuando tú
 * apartas el rasgo, viaja desde tu cúmulo hasta él por un hilo que se dibuja delante del usuario, y
 * se va cuando lo reintegras. Si el reproche estuviera escrito desde el primer fotograma, la pieza
 * diría que esa gente es efectivamente insoportable, que es lo contrario de lo que sostiene Jung.
 *
 * SE DESCARTÓ que el cúmulo se despegara y se fuera andando hasta el otro. Una sombra que camina es
 * un segundo personaje, y lo apartado no es otro: es uno mismo. Por eso crece pegada a los pies de
 * la figura y solo se estira hacia fuera, sin llegar a soltarse nunca.
 */
function crearProyeccion(contenedor: HTMLElement, op: OpcionesDosFiguras, paleta: Paleta): Visualizacion {
  const otros = op.proyeccion?.otros ?? [];
  const activas = new Set<number>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const XFIG = 100;
  const XOTROS = 300;
  const XTEXTO = 330;
  const ARRIBA = 40;
  const BANDA = 174;
  const paso = BANDA / Math.max(1, otros.length);
  const filaY = (i: number): number => ARRIBA + paso * (i + 0.5);
  // La escala sale del hueco disponible, no de un número elegido: con cuatro personajes se estrechan
  // solos en vez de pisarse. La silueta mide 117 de alto y se le dejan 8 de aire.
  const escala = Math.min(0.42, (paso - 8) / 117);

  /*
   * Los hilos van los primeros y por tanto debajo de todo: lo proyectado pasa POR DETRÁS de la
   * gente, no por delante. Dibujado encima parecía una anotación sobre el personaje, cuando lo que
   * afirma es que el personaje se ve a través de eso.
   */
  const hilos = otros.map(() => svg('path', {
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke', opacity: 0,
  }));
  raiz.append(...hilos);

  const sombraG = svg('g');
  const sombraFig = silueta(XFIG, paleta.senal, TRAZO.base, paleta.senal);
  sombraG.append(sombraFig);
  raiz.append(sombraG, silueta(XFIG, paleta.acento, TRAZO.enfasis));

  const proyecciones = otros.map((_, i) => {
    // Desplazada un punto respecto del personaje: una mancha que coincidiera con él sería su color.
    const p = siluetaEn(XOTROS + 7, filaY(i) + 3, escala, paleta.senal, paleta.senal);
    p.setAttribute('opacity', '0');
    return p;
  });
  raiz.append(...proyecciones);
  otros.forEach((_, i) => raiz.append(siluetaEn(XOTROS, filaY(i), escala, paleta.neutro)));

  rotulo(raiz, op.figuraB, { x: XFIG, y: 20, ancho: 200, color: paleta.acento, interlineado: 12 });
  rotulo(raiz, op.figuraA, { x: XFIG, y: 210, ancho: 200, color: paleta.senal, interlineado: 12 });
  /*
   * El nombre del coste encabeza la columna de los demás en lugar de rotular una barra: aquí el
   * coste no es una magnitud que suba, son tres personas a las que les ha caído algo tuyo encima.
   */
  rotulo(raiz, op.coste, {
    x: ANCHO - 16, y: 20, ancho: 250, color: paleta.neutro, ancla: 'end', interlineado: 12,
  });

  const reproches = otros.map((o, i) => {
    rotulo(raiz, o.nombre, {
      x: XTEXTO, y: filaY(i) - 12, ancho: 214, color: paleta.neutro,
      ancla: 'start', interlineado: 12, maxLineas: 1,
    });
    return rotuloMutable(raiz, {
      x: XTEXTO, y: filaY(i) + 12, ancho: 214, color: paleta.senal,
      ancla: 'start', interlineado: 12, maxLineas: 2,
    });
  });

  contenedor.append(raiz);

  /** Cuánto se ha acumulado, mostrado. Persigue a lo apartado, así que el cúmulo crece y mengua solo. */
  let cumulo = 0;
  /** Cuánto ha recorrido cada hilo, de 0 a 1. Uno por personaje. */
  const recorrido = otros.map(() => 0);
  let animacion = 0;

  function apartado(): number {
    return Math.min(1, [...activas].reduce((a, i) => a + (op.condiciones[i]?.peso ?? 0), 0));
  }

  function pintar(): void {
    // Crece poco —un 6 %— y se estira mucho: un cúmulo que se hinchara taparía a la figura, y lo
    // apartado no sustituye a nadie, se le acumula al lado.
    const s = 1 + cumulo * 0.06;
    const dx = cumulo * 34;
    sombraG.setAttribute(
      'transform',
      `translate(${dx.toFixed(1)} 0) translate(${XFIG} ${CY + 56})`
      + ` scale(${s.toFixed(3)}) translate(${-XFIG} ${-(CY + 56)})`,
    );
    // Nunca llega a cero: lo apartado sigue estando aunque no se le haya dado nada todavía.
    sombraG.setAttribute('opacity', (0.12 + cumulo * 0.68).toFixed(3));

    recorrido.forEach((r, i) => {
      const origen: [number, number] = [XFIG + dx + 26, CY + 20];
      const destino: [number, number] = [XOTROS - 16, filaY(i)];
      const tirar: [number, number] = [(origen[0] + destino[0]) / 2, CY - 12];
      hilos[i]!.setAttribute('d', r > 0.01 ? curva(origen, tirar, destino, r) : '');
      hilos[i]!.setAttribute('opacity', (r * 0.5).toFixed(3));
      // El reproche solo aparece cuando lo proyectado ha llegado: primero viaja, después se ve.
      const llegada = Math.max(0, (r - 0.5) / 0.5);
      proyecciones[i]!.setAttribute('opacity', (llegada * 0.75).toFixed(3));
      reproches[i]!.poner(llegada > 0.1 ? otros[i]!.molesta : '');
    });
  }

  function bucle(): void {
    const objetivo = apartado();
    const resto = objetivo - cumulo;
    cumulo = Math.abs(resto) < 0.002 ? objetivo : cumulo + resto * 0.07;
    recorrido.forEach((r, i) => {
      const meta = activas.has(i) ? 1 : 0;
      const falta = meta - r;
      recorrido[i] = Math.abs(falta) < 0.004 ? meta : r + falta * 0.08;
    });
    pintar();
    animacion = requestAnimationFrame(bucle);
  }

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = op.condiciones.map((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.nombre;
    b.addEventListener('click', () => {
      if (activas.has(i)) activas.delete(i);
      else { activas.add(i); resolver(contenedor, c.efecto); }
      botones.forEach((x, k) => x.setAttribute('aria-pressed', String(activas.has(k))));
      if (activas.size === 0) resolver(contenedor, op.resolucion);
      if (movimientoReducido()) { cumulo = apartado(); sincronizarSinMovimiento(); }
    });
    controles.append(b);
    return b;
  });
  contenedor.append(controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function sincronizarSinMovimiento(): void {
    recorrido.forEach((_, i) => { recorrido[i] = activas.has(i) ? 1 : 0; });
    pintar();
  }

  /*
   * El propio cúmulo reintegra. Marcarlo como manipulable y no darle nada que hacer sería una
   * afordancia falsa; y reintegrar tirando de lo apartado es el gesto que la idea describe, más que
   * volver a pulsar el botón de la excusa.
   */
  function reintegrarUltimo(): void {
    const ultimo = [...activas].pop();
    if (ultimo === undefined) return;
    activas.delete(ultimo);
    botones.forEach((x, k) => x.setAttribute('aria-pressed', String(activas.has(k))));
    if (activas.size === 0) resolver(contenedor, op.resolucion);
    if (movimientoReducido()) { cumulo = apartado(); sincronizarSinMovimiento(); }
  }

  marcarInteractivo(sombraFig, paleta);
  sombraFig.removeAttribute('stroke-dasharray');
  sombraFig.setAttribute('role', 'button');
  sombraFig.setAttribute('aria-label', op.proyeccion?.reintegrar ?? op.figuraA);
  sombraFig.addEventListener('click', reintegrarUltimo);
  sombraFig.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === 'Enter' || k === ' ') { e.preventDefault(); reintegrarUltimo(); }
  });

  if (movimientoReducido()) {
    cumulo = 0.6;
    sincronizarSinMovimiento();
    resolver(contenedor, op.resolucion);
  } else {
    bucle();
    entrada(raiz);
  }

  return {
    destruir(): void {
      cancelAnimationFrame(animacion);
      contenedor.replaceChildren();
    },
  };
}

/**
 * Modo «molde»: cada excusa cierra un tramo del contorno y, al cerrarlo, apaga los movimientos que
 * pasaban por ahí. Lo que se pierde se pierde a la vista.
 *
 * POR QUÉ NO VALE LA DISTANCIA. Un molde que limita movimientos necesita que los movimientos estén
 * dibujados ANTES: no se puede ver desaparecer lo que nunca se vio. Dos siluetas separándose no
 * tienen nada que recortar, así que la promesa de la ficha —«recorta visiblemente lo que la figura
 * puede hacer»— no era representable en el modo original por mucho parámetro que se le añadiera.
 *
 * LAS DOS PÉRDIDAS OCURREN EN EL MISMO FOTOGRAMA. Los rayos se apagan y el medidor baja a la vez,
 * desde el mismo valor y en la misma llamada a pintar. Ese es el punto entero de la idea: la mala fe
 * no cambia opciones por tranquilidad, se lleva las dos cosas juntas, y retirarla devuelve las dos
 * juntas. Con un medidor animado aparte, o con una espera entre ambos, la pieza estaría afirmando
 * que se puede negociar una por la otra.
 *
 * SE DESCARTÓ cerrar el molde con paredes rectas. Un rectángulo tiene esquinas, y las esquinas
 * sugieren que en la diagonal aún se escapa algo; el contorno cerrado no deja esa lectura.
 */
function crearMolde(contenedor: HTMLElement, op: OpcionesDosFiguras, paleta: Paleta): Visualizacion {
  const excusas = op.condiciones;
  const aplicadas = new Set<number>();
  const sectores = Math.max(1, excusas.length);
  const RAYOS_POR_SECTOR = 4;
  const nRayos = sectores * RAYOS_POR_SECTOR;

  const CX = 150;
  const CYM = 102;
  const RX = 46;
  const RY = 56;
  const FUERA = 1.32;
  const ARRANQUE = -Math.PI / 2;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const punto = (ang: number, f: number): [number, number] => [
    CX + RX * f * Math.cos(ang),
    CYM + RY * f * Math.sin(ang),
  ];

  // El contorno completo, tenue: es el límite que el molde va a ocupar, y verlo antes es lo que
  // permite después notar cuánto se ha cerrado.
  raiz.append(svg('ellipse', {
    cx: CX, cy: CYM, rx: RX, ry: RY, fill: 'none', stroke: paleta.neutro,
    'stroke-width': TRAZO.fino, 'stroke-dasharray': '3 6',
    'vector-effect': 'non-scaling-stroke', opacity: 0.35,
  }));

  const rayos = Array.from({ length: nRayos }, (_, i) => {
    const ang = ARRANQUE + ((i + 0.5) * 2 * Math.PI) / nRayos;
    const [x1, y1] = punto(ang, 1);
    const [x2, y2] = punto(ang, FUERA);
    const l = svg('line', {
      x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1),
      stroke: paleta.acento, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    raiz.append(l);
    return l;
  });

  const arcos = excusas.map(() => {
    const p = svg('path', {
      fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis, 'stroke-linecap': 'round',
      'vector-effect': 'non-scaling-stroke',
    });
    raiz.append(p);
    return p;
  });

  const figura = siluetaEn(CX, CYM, 0.82, paleta.acento);
  raiz.append(figura);

  rotulo(raiz, op.figuraB, { x: CX, y: 14, ancho: 260, color: paleta.senal, interlineado: 12 });
  rotulo(raiz, op.figuraA, { x: CX, y: 196, ancho: 260, color: paleta.acento, interlineado: 12, maxLineas: 1 });
  rotulo(raiz, op.molde?.movimientos ?? '', { x: CX, y: 216, ancho: 260, color: paleta.neutro, interlineado: 12, maxLineas: 1 });

  /*
   * El medidor, anclado al borde derecho y con su rótulo creciendo hacia dentro. Centrado sobre la
   * barra no caben treinta caracteres: el ayudante los parte y los reduce, pero no inventa sitio.
   */
  const MED = { x: 512, y: 46, ancho: 26, alto: 144 };
  raiz.append(svg('rect', {
    x: MED.x, y: MED.y, width: MED.ancho, height: MED.alto, rx: 2,
    fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  }));
  const relleno = svg('rect', { x: MED.x, y: MED.y, width: MED.ancho, height: MED.alto, fill: paleta.acento, opacity: 0.85 });
  raiz.append(relleno);
  rotulo(raiz, op.molde?.responsabilidad ?? '', {
    x: ANCHO - 12, y: 30, ancho: 230, color: paleta.neutro, ancla: 'end', interlineado: 12,
  });

  const lectura = rotuloMutable(raiz, {
    x: 292, y: 112, ancho: 204, color: paleta.neutro, ancla: 'start', interlineado: 14, maxLineas: 5,
  });

  contenedor.append(raiz);

  /** Cuánto se ha cerrado cada tramo, mostrado. Uno por excusa. */
  const cerrado = excusas.map(() => 0);
  let animacion = 0;

  function pintar(): void {
    let perdida = 0;
    cerrado.forEach((c, s) => {
      perdida += (excusas[s]?.peso ?? 0) * c;
      const desde = ARRANQUE + (s * 2 * Math.PI) / sectores;
      const hasta = desde + ((2 * Math.PI) / sectores) * c;
      const tramos = 20;
      const puntos: string[] = [];
      for (let k = 0; k <= tramos; k++) {
        const [x, y] = punto(desde + ((hasta - desde) * k) / tramos, 1);
        puntos.push(`${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      arcos[s]!.setAttribute('d', c > 0.005 ? puntos.join(' ') : '');
    });

    // Los rayos y el medidor leen del MISMO estado en la MISMA pasada: no hay forma de que uno vaya
    // por delante del otro, que es lo que la idea niega que ocurra.
    rayos.forEach((r, i) => {
      const suyo = cerrado[Math.floor(i / RAYOS_POR_SECTOR)] ?? 0;
      r.setAttribute('opacity', Math.max(0, 1 - suyo * 1.15).toFixed(3));
    });

    const queda = Math.max(0, 1 - perdida);
    relleno.setAttribute('y', String(MED.y + MED.alto * (1 - queda)));
    relleno.setAttribute('height', String(MED.alto * queda));
  }

  function bucle(): void {
    cerrado.forEach((c, i) => {
      const meta = aplicadas.has(i) ? 1 : 0;
      const falta = meta - c;
      cerrado[i] = Math.abs(falta) < 0.004 ? meta : c + falta * 0.09;
    });
    pintar();
    animacion = requestAnimationFrame(bucle);
  }

  function sincronizarSinMovimiento(): void {
    cerrado.forEach((_, i) => { cerrado[i] = aplicadas.has(i) ? 1 : 0; });
    pintar();
  }

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = excusas.map((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.nombre;
    b.addEventListener('click', () => {
      if (aplicadas.has(i)) aplicadas.delete(i);
      else { aplicadas.add(i); lectura.poner(c.efecto); resolver(contenedor, c.efecto); }
      botones.forEach((x, k) => x.setAttribute('aria-pressed', String(aplicadas.has(k))));
      if (aplicadas.size === 0) { lectura.poner(''); resolver(contenedor, op.resolucion); }
      if (movimientoReducido()) sincronizarSinMovimiento();
    });
    controles.append(b);
    return b;
  });

  function retirarTodo(): void {
    if (aplicadas.size === 0) return;
    aplicadas.clear();
    botones.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    lectura.poner('');
    resolver(contenedor, op.resolucion);
    if (movimientoReducido()) sincronizarSinMovimiento();
  }

  const retirar = document.createElement('button');
  retirar.type = 'button';
  retirar.textContent = op.molde?.retirar ?? '';
  retirar.addEventListener('click', retirarTodo);
  controles.append(retirar);

  contenedor.append(controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  /*
   * La figura misma se quita el molde. Lo manipulable es quien está dentro, que es de quien la idea
   * dice que podría salir cuando quisiera y prefiere contarse que no.
   *
   * Se marca el HIJO y no el grupo colocado. El pulso de afordancia de `entrada()` anima la
   * propiedad CSS `transform`, que durante la animación se impone al atributo `transform` del SVG:
   * marcando el grupo exterior, la figura perdía su colocación entera y saltaba a la esquina
   * mientras duraba el pulso. El hijo no lleva colocación propia, así que no hay nada que pisar.
   */
  const asa = (figura.firstElementChild ?? figura) as SVGElement;
  marcarInteractivo(asa, paleta);
  asa.removeAttribute('stroke-dasharray');
  asa.setAttribute('role', 'button');
  asa.setAttribute('aria-label', op.molde?.retirar ?? op.figuraA);
  asa.addEventListener('click', retirarTodo);
  asa.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === 'Enter' || k === ' ') { e.preventDefault(); retirarTodo(); }
  });

  if (movimientoReducido()) {
    sincronizarSinMovimiento();
    resolver(contenedor, op.resolucion);
  } else {
    bucle();
    entrada(raiz);
  }

  return {
    destruir(): void {
      cancelAnimationFrame(animacion);
      contenedor.replaceChildren();
    },
  };
}
