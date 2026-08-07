/**
 * Mecánica «red»: un elemento se aísla de sus relaciones y se comprueba qué le queda.
 *
 * Sirve a ideas de tradiciones muy distintas que comparten exactamente esta estructura:
 *  - La vacuidad (Nāgārjuna): al aislarlo, pierde las propiedades que lo definían.
 *  - El animal político (Aristóteles): al cortar vínculos, se apagan capacidades concretas.
 *  - La alienación (Marx): cada condición corta un hilo distinto.
 *
 * En las tres, la tesis es que la identidad estaba en la red y no dentro del elemento. Que la
 * mecánica sea la misma es el argumento hecho interfaz.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, RADIO_TACTIL, resolver, rotulo,
  rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Paleta, Visualizacion } from '../lenguaje';

export interface VinculoSpec {
  /** Etiqueta del vínculo que se corta. */
  nombre: string;
  /** Qué se pierde al cortarlo. */
  perdida: string;
  /**
   * Solo con `perfeccion`: qué otros vínculos se van con este.
   *
   * Son ÍNDICES dentro de `vinculos` y no nombres. Emparejar por nombre —como hace `descomponer`
   * en su modo puerta— obliga a que dos cadenas traducidas coincidan letra a letra en cada idioma,
   * y una errata en la ficha inglesa dejaría la propagación muda sin que ningún validador se entere.
   * El índice es el mismo en los dos idiomas porque la paridad de las listas ya está exigida.
   */
  arrastra?: number[];
  /** Solo con `perfeccion`: lo que aporta al conjunto. Negativo en lo que la idea llama un mal. */
  valor?: number;
  /** Solo en `linea`: momentos que une el hilo. Índices dentro de `momentos`. */
  desde?: number;
  hasta?: number;
}

export interface OpcionesRed {
  corrienteId: string;
  centro: string;
  vinculos: VinculoSpec[];
  /**
   * Qué hace el usuario con la red.
   *
   * `cortar` (por omisión) es el gesto original: se aísla el centro y se comprueba qué le queda.
   *
   * `estirar` invierte la pregunta y sirve a una tesis distinta —que una definición se usa con
   * soltura sin poder delimitarla—: los nodos son casos, la red cubre todos menos uno, y al
   * estirarla para alcanzar el que falta suelta otro. El número de casos cubiertos no sube nunca,
   * y esa constancia, que se ve en el recuento, es el argumento entero. Antes esta idea usaba la
   * mecánica de poner a prueba, que se limitaba a descartar definiciones escritas de antemano: la
   * conclusión venía dada en vez de salir de manipular nada.
   *
   * `linea` cambia la geometría entera y por eso se bifurca al principio de la función: los nodos
   * dejan de ser radios de una rueda y pasan a ser momentos en orden, unidos por hilos que se
   * solapan. Una rueda no puede afirmar lo que esa idea afirma, porque en la rueda todo pasa por el
   * centro y cortar un radio nunca deja dos extremos comunicados por otro camino.
   */
  modo?: 'cortar' | 'estirar' | 'linea';
  /** Solo en `estirar`: recuento de cobertura. Recibe {cubiertos} y {total}. */
  recuento?: string;
  /** Solo en `linea`: los momentos de la línea, en orden. */
  momentos?: string[];
  /** Solo en `linea`: lo que se lee mientras los extremos siguen enlazados por algún camino. */
  unida?: string;
  /** Solo en `linea`: lo que se lee cuando la línea se ha partido en dos. */
  rota?: string;
  /**
   * Un flujo que sigue siendo el mismo sin conservar ninguna pieza.
   *
   * Desmontar demuestra que no hay núcleo, y ahí se paraba la pieza. Pero la idea a la que sirve
   * afirma dos cosas, y la segunda —que el yo puede ser el nombre de un proceso— no se sigue de la
   * primera: de «no hay núcleo» solo se sigue que no hay nada, si no se enseña además cómo algo
   * conserva identidad sin él. El flujo es esa segunda mitad, y llega DESPUÉS de desmontar porque
   * al revés no significa nada: un proceso que fluye antes de haber buscado el núcleo se lee como
   * una animación decorativa.
   *
   * No hay recuento de cuántos estados iniciales quedan. Se marcan con la señal y se los ve
   * marcharse: un «quedan {n}» obligaría a resolver el plural en dos idiomas dentro del código,
   * que es exactamente lo que la regla de idiomas prohíbe.
   */
  flujo?: {
    /** Los estados que van pasando. Se recorren en ciclo, así que nunca se agotan. */
    estados: string[];
    /** Rótulo del botón que hace correr el proceso. */
    avanzar: string;
    /** Rótulo del mismo botón mientras aún queda algo por desmontar. */
    bloqueado: string;
    /** Lo que se lee mientras aún queda algún estado del principio. */
    nota: string;
    /** Lo que se lee cuando no queda ninguno y el proceso sigue siendo el mismo. */
    conclusion: string;
  };
  /**
   * Retirar una pieza ARRASTRA otras y el conjunto empeora.
   *
   * Sin esto, cortar apaga el vínculo cortado y nada más, que es justo lo contrario de lo que la
   * idea de Leibniz afirma: que los elementos no son independientes y no se puede quitar un mal
   * concreto dejando el resto igual. La propagación no es un adorno de la escena, es la premisa;
   * la conclusión —que un mundo se elige entero— no se sostiene sin ella.
   *
   * El medidor no marca «bien contra mal» sino cuánto queda del conjunto respecto del mundo que
   * habría si el mal se hubiera podido retirar solo. Por eso arranca por debajo del tope: ese hueco
   * de arriba es el mundo mejor que parecía estar al alcance, y verlo intacto mientras la barra baja
   * es el argumento. Un medidor que empezara lleno diría que el mundo de partida ya era el mejor
   * posible, que es la caricatura de la tesis y no la tesis.
   */
  perfeccion?: {
    /** Rótulo del medidor del conjunto. */
    rotulo: string;
    /** Lo que se lee cuando lo retirado se llevó otras piezas por delante. */
    arrastre: string;
    /** Lo que se lee cuando lo retirado no arrastró nada y aun así el conjunto baja. */
    suelto: string;
  };
  /** Rótulo del botón que devuelve todos los vínculos. */
  restituir: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  /** Nombre accesible de cada nodo. Recibe {nombre}. */
  etiquetaNodo: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;

/** Solo el trazo recibe pulsaciones. Ver el arco de `linea`, que es donde importa y se explica. */
const SOLO_TRAZO = 'pointer-events:stroke';

export function crearRed(contenedor: HTMLElement, op: OpcionesRed): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  /*
   * La línea de vida se separa aquí y no se entrelaza más abajo. Comparte el lenguaje gráfico, la
   * paleta y el marco —que es lo que hace que se sienta la misma familia—, pero su geometría no es
   * la de una rueda y mezclarlas con condicionales dentro de `pintar()` habría dejado el camino de
   * `cortar`, del que dependen varias ideas ya publicadas, lleno de ramas que no le tocan. Es el
   * mismo reparto que hacen `descomponer` con su puerta y `repeticion` con sus programas.
   */
  if (op.modo === 'linea') return crearLinea(contenedor, op, paleta);

  const cortados = new Set<number>();
  const estirando = op.modo === 'estirar';
  // En `estirar` la red arranca cubriéndolo todo menos el último: siempre falta exactamente uno.
  if (estirando) cortados.add(op.vinculos.length - 1);

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * La red se reparte en ELIPSE, no en círculo.
   *
   * El marco es 7:3 y con un círculo de radio 88 la red ocupaba menos de un tercio del ancho, con
   * dos franjas vacías a los lados y las etiquetas superiores saliéndose por arriba. Una elipse que
   * sigue la proporción del hueco usa el sitio que hay y deja aire donde hace falta: encima y debajo,
   * que es donde caen los rótulos.
   *
   * Las dos capacidades opcionales piden sitio y se lo quitan a la elipse, cada una por su lado: el
   * medidor del conjunto ocupa la franja derecha y el flujo la banda de abajo. Los valores están
   * escritos como constantes y no derivados de lo reservado a propósito, para que sin capacidad
   * declarada salgan EXACTAMENTE los de siempre y las ideas que no las usan no se muevan un píxel.
   */
  const RESERVADO_DERECHA = op.perfeccion ? 76 : 0;
  const cx = (ANCHO - RESERVADO_DERECHA) / 2;
  const cy = op.flujo ? 92 : 116;
  const RADIO_X = op.perfeccion ? 140 : 182;
  /*
   * Estirando hay un recuento clavado en la banda de abajo, y esa banda deja de ser de la elipse.
   *
   * Sin ceder el sitio, el rótulo del nodo inferior caía justo encima del recuento: en «Saber que no
   * se sabe» «ayudar a los amigos y dañar a los enemigos» tapaba casi la mitad de «casos cubiertos»,
   * que es precisamente el marcador que la pieza pide mirar mientras se estira la definición. Es el
   * mismo trato que ya reciben las otras dos capacidades: la que pide sitio se lo quita a la elipse.
   */
  const RADIO_Y = op.flujo ? 44 : (estirando ? 52 : 62);
  const n = op.vinculos.length;

  const angulo = (i: number): number => (-Math.PI / 2) + (i * 2 * Math.PI) / n;
  const puntoEn = (i: number, k: number) => ({
    x: cx + Math.cos(angulo(i)) * RADIO_X * k,
    y: cy + Math.sin(angulo(i)) * RADIO_Y * k,
  });

  /*
   * Los arrastres se dibujan ANTES que nada para que queden por debajo de los radios y del centro.
   * Nacen invisibles: enseñar de antemano qué depende de qué convertiría la pieza en un mapa que se
   * estudia, y lo que la idea afirma es que las consecuencias NO estaban previstas. Solo se ven
   * cuando ya se han producido, que es también como se descubren fuera de la pantalla.
   */
  const capaArrastres = op.perfeccion ? svg('g') : null;
  if (capaArrastres) raiz.append(capaArrastres);
  const arrastres = capaArrastres
    ? op.vinculos.flatMap((v, i) => (v.arrastra ?? []).map((j) => {
      const a = puntoEn(i, 1);
      const b = puntoEn(j, 1);
      /*
       * La cuerda va CURVADA hacia fuera y no en línea recta. Recta cruzaría el centro y taparía su
       * rótulo, que es el mismo motivo por el que los radios arrancan en el borde y no en el punto
       * medio. El punto de control se coloca en la bisectriz de los dos nodos y a la distancia que
       * deja la cima de la curva a 0,9 del radio: fuera del centro y por dentro de las etiquetas,
       * valga la pareja de nodos que valga.
       */
      const dif = Math.atan2(Math.sin(angulo(j) - angulo(i)), Math.cos(angulo(j) - angulo(i)));
      const medio = angulo(i) + dif / 2;
      const k = 1.8 - Math.cos(dif / 2);
      const linea = svg('path', {
        d: `M ${a.x} ${a.y} Q ${cx + Math.cos(medio) * RADIO_X * k} ${cy + Math.sin(medio) * RADIO_Y * k} ${b.x} ${b.y}`,
        fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.base,
        'stroke-dasharray': '3 4', 'vector-effect': 'non-scaling-stroke', opacity: 0,
      });
      capaArrastres.append(linea);
      return { linea, i, j };
    }))
    : [];

  const nodos = op.vinculos.map((v, i) => {
    const ang = angulo(i);
    const x = cx + Math.cos(ang) * RADIO_X;
    const y = cy + Math.sin(ang) * RADIO_Y;

    /*
     * El vínculo arranca en el BORDE del centro, no en su punto medio: saliendo del centro, las
     * cinco líneas cruzaban el rótulo de la cosa y lo dejaban ilegible justo en la pieza que trata
     * de qué queda de ella. Se usa el radio máximo, que es donde llega el círculo cuando está entero.
     */
    const linea = svg('line', {
      x1: cx + Math.cos(ang) * 36, y1: cy + Math.sin(ang) * 36, x2: x, y2: y,
      stroke: paleta.acento,
      'stroke-width': TRAZO.base,
      'stroke-linecap': 'round',
      'vector-effect': 'non-scaling-stroke',
      'data-trazo': '',
    });
    const punto = svg('circle', { cx: x, cy: y, r: RADIO_TACTIL, fill: 'none' });
    punto.setAttribute('role', 'button');
    punto.setAttribute('aria-label', op.etiquetaNodo.replace('{nombre}', v.nombre));
    marcarInteractivo(punto, paleta);

    /*
     * El rótulo se aparta del nodo SIGUIENDO EL RADIO, así que en los nodos laterales sale hacia
     * fuera y en los de arriba y abajo sale en vertical. Colocarlo siempre encima o debajo lo metía
     * dentro de la red en cuanto el nodo estaba en un lado.
     */
    const fuera = 1.16;
    const etiqueta = rotulo(raiz, v.nombre, {
      x: cx + Math.cos(ang) * RADIO_X * fuera,
      y: cy + Math.sin(ang) * RADIO_Y * fuera + (Math.sin(ang) >= 0 ? 26 : -20),
      ancho: 150, color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });

    return { linea, punto, etiqueta, i };
  });

  const centro = svg('circle', { cx, cy, r: 34, fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis, 'vector-effect': 'non-scaling-stroke' });
  raiz.append(...nodos.flatMap((nd) => [nd.linea, nd.punto]), centro);
  /*
   * El rótulo del centro cabe DENTRO de su círculo, y por eso su ancho sale del radio.
   *
   * Con 116 —más del doble del diámetro— el texto se salía de su propia forma y llegaba hasta donde
   * arrancan los radios, que es a 36. Con cuatro vínculos hay dos exactamente horizontales, así que
   * en «La alienación», «La identidad personal», «El animal político» y «Razón suficiente» la línea
   * entraba por un lado del rótulo y salía por el otro, tachándolo. No era un problema de esas cuatro
   * fichas: era que el rótulo tenía permiso para ocupar un sitio que no es suyo.
   *
   * 60 deja holgura por dentro del círculo (diámetro 68) y no llega a 36 ni en una sola línea.
   */
  const textoCentro = rotulo(raiz, op.centro, {
    x: cx, y: cy + 4, ancho: 60, color: paleta.senal, interlineado: 12, maxLineas: 2,
  });

  /** Distancia entre dos nodos a lo largo de la rueda, contando por el lado más corto. */
  const distanciaEnRueda = (a: number, b: number): number => {
    const n = op.vinculos.length;
    const d = Math.abs(a - b) % n;
    return Math.min(d, n - d);
  };

  // Estirando, el recuento es lo que hay que mirar: se mantiene clavado por mucho que se estire.
  const recuento = estirando
    ? rotuloMutable(raiz, { x: cx, y: ALTO - 10, ancho: 300, color: paleta.senal, interlineado: 12, maxLineas: 1 })
    : null;

  /*
   * El medidor del conjunto, solo si la ficha lo pide. Ocupa la franja que la elipse ha cedido.
   *
   * El nivel es lo que queda sumado sobre el máximo alcanzable, y el máximo alcanzable es el mundo
   * sin el mal: por eso la marca de partida no está arriba del todo. Los pesos vienen de la ficha
   * porque son una afirmación sobre el mundo del que habla la idea, no una constante de dibujo.
   */
  const MED = { x: ANCHO - 40, y: 46, ancho: 24, alto: 150 };
  const maximoAlcanzable = op.vinculos.reduce((s, v) => s + Math.max(0, v.valor ?? 0), 0) || 1;
  const nivelInicial = op.vinculos.reduce((s, v) => s + (v.valor ?? 0), 0) / maximoAlcanzable;
  let rellenoConjunto: SVGElement | null = null;
  let avisoConjunto: ReturnType<typeof rotuloMutable> | null = null;
  if (op.perfeccion) {
    raiz.append(svg('rect', {
      x: MED.x, y: MED.y, width: MED.ancho, height: MED.alto, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    }));
    rellenoConjunto = svg('rect', { x: MED.x, y: MED.y + MED.alto, width: MED.ancho, height: 0, fill: paleta.acento, opacity: 0.85 });
    raiz.append(rellenoConjunto);
    /*
     * La marca de dónde partía el mundo. Va sin rótulo propio: en la franja no cabe un tercer texto
     * sin pisar las etiquetas de los nodos de abajo, y lo que tiene que leerse no es la marca sino
     * que la barra se queda por debajo de ella pase lo que pase. La lectura de al lado lo dice.
     */
    raiz.append(svg('line', {
      x1: MED.x - 6, y1: MED.y + MED.alto * (1 - nivelInicial),
      x2: MED.x + MED.ancho + 6, y2: MED.y + MED.alto * (1 - nivelInicial),
      stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-dasharray': '3 3',
      'vector-effect': 'non-scaling-stroke',
    }));
    /*
     * Los rótulos del medidor se anclan al BORDE DERECHO y crecen hacia dentro, como en el resto de
     * medidores del sistema: centrados sobre una barra de 24 px no cabe ni una palabra larga.
     */
    rotulo(raiz, op.perfeccion.rotulo, {
      x: ANCHO - 12, y: MED.y - 16, ancho: 150, color: paleta.neutro,
      ancla: 'end', interlineado: 12, maxLineas: 2,
    });
    /*
     * La lectura va estrecha a propósito. Con 180 de ancho llegaba hasta x=368 y se metía por debajo
     * de la etiqueta del nodo inferior derecho, que baja hasta y=210: dos textos a cuatro píxeles uno
     * de otro se leen como uno solo. A 128 no alcanza esa columna, y como el ayudante parte y reduce,
     * la frase corta de la ficha sigue cabiendo en dos líneas.
     */
    avisoConjunto = rotuloMutable(raiz, {
      x: ANCHO - 12, y: MED.y + MED.alto + 26, ancho: 128, color: paleta.senal,
      ancla: 'end', interlineado: 12, maxLineas: 2,
    });
  }

  /*
   * La banda del flujo, solo si la ficha lo pide. Cuatro ranuras y no una lista entera: lo que hay
   * que ver es que el contenido de cada sitio cambia, no cuántos estados han pasado. Con la lista
   * completa a la vista el ojo cuenta elementos, y contar es justo lo que la idea niega que importe.
   */
  const FLUJO_RANURAS = 4;
  const estados = op.flujo?.estados ?? [];
  let pasosFlujo = 0;
  let fluyendo = false;
  const banda = svg('g', { opacity: 0 });
  const ranurasFlujo = op.flujo
    ? Array.from({ length: FLUJO_RANURAS }, (_, i) => {
      const ancho = (ANCHO - 60 - 30) / FLUJO_RANURAS;
      const x = 30 + i * (ancho + 10);
      const caja = svg('rect', {
        x, y: 196, width: ancho, height: 32, rx: 2,
        fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.base,
        'vector-effect': 'non-scaling-stroke',
      });
      banda.append(caja);
      const texto = rotuloMutable(banda, {
        x: x + ancho / 2, y: 214, ancho: ancho - 10, color: paleta.acento, interlineado: 11, maxLineas: 2,
      });
      return { caja, texto };
    })
    : [];
  if (op.flujo) {
    /*
     * El nombre preside la banda y es EL MISMO que estaba en el centro deshecho. Ese traslado es la
     * afirmación entera de la pieza: lo que nombraba una cosa pasa a nombrar un proceso sin cambiar
     * de palabra. Un rótulo nuevo aquí habría contado dos historias en vez de una.
     */
    rotulo(banda, op.centro, {
      x: ANCHO / 2, y: 184, ancho: 260, color: paleta.senal, interlineado: 12, maxLineas: 1,
    });
    raiz.append(banda);
  }

  const restituir = document.createElement('button');
  restituir.type = 'button';
  restituir.textContent = op.restituir;
  let avanzar: HTMLButtonElement | null = null;
  if (op.flujo) {
    avanzar = document.createElement('button');
    avanzar.type = 'button';
  }
  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  // Hacer correr el proceso va antes que deshacer: restituir es la marcha atrás, no el gesto.
  if (avanzar) controles.append(avanzar);
  controles.append(restituir);
  if (estirando) restituir.hidden = true;

  // Estirando no hay ningún botón que ofrecer, y un `.vis-controles` vacío deja una franja muerta
  // bajo la pieza además de hacerla parecer no montada.
  contenedor.append(raiz);
  if (!estirando) contenedor.append(controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  /**
   * Todo lo que se va con `i`: él y lo que arrastra, en cadena. Sin `arrastra` declarado devuelve
   * solo `i`, así que el modo de siempre pasa por aquí sin enterarse.
   */
  function arrastreDe(i: number): number[] {
    const vistos = new Set<number>([i]);
    const pila = [i];
    while (pila.length) {
      const actual = pila.pop()!;
      for (const j of op.vinculos[actual]?.arrastra ?? []) {
        if (!vistos.has(j)) { vistos.add(j); pila.push(j); }
      }
    }
    return [...vistos];
  }

  function pintarConjunto(): void {
    if (!rellenoConjunto) return;
    const suma = op.vinculos.reduce((s, v, i) => s + (cortados.has(i) ? 0 : (v.valor ?? 0)), 0);
    const nivel = Math.max(0, Math.min(1, suma / maximoAlcanzable));
    const h = MED.alto * nivel;
    rellenoConjunto.setAttribute('y', String(MED.y + MED.alto - h));
    rellenoConjunto.setAttribute('height', String(h));
    // Por debajo de donde partía, el conjunto ha empeorado: se marca con la señal y no con el acento.
    rellenoConjunto.setAttribute('fill', nivel < nivelInicial ? paleta.senal : paleta.acento);
    for (const a of arrastres) {
      a.linea.setAttribute('opacity', cortados.has(a.i) && cortados.has(a.j) ? '0.9' : '0');
    }
  }

  function pintarFlujo(): void {
    if (!op.flujo || !avanzar) return;
    const desmontado = cortados.size === nodos.length;
    /*
     * El flujo es lo que queda DESPUÉS de desmontar. Si se restituye una pieza, el proceso vuelve a
     * tener debajo un ensamblaje entero y afirmar entonces que nada permanece sería afirmar algo que
     * la escena ya no muestra. Mismo motivo por el que se retira la resolución al restituir.
     */
    if (!desmontado && fluyendo) { fluyendo = false; pasosFlujo = 0; }
    banda.setAttribute('opacity', fluyendo ? '1' : '0');
    avanzar.disabled = !desmontado;
    avanzar.textContent = desmontado ? op.flujo.avanzar : op.flujo.bloqueado;
    if (!fluyendo) return;
    ranurasFlujo.forEach((r, i) => {
      const indice = pasosFlujo + i;
      // Los estados del principio van marcados con la señal: verlos irse es el argumento, y no hace
      // falta contarlos en ninguna parte para saber cuándo no queda ninguno.
      const inicial = indice < FLUJO_RANURAS;
      const color = inicial ? paleta.senal : paleta.acento;
      r.caja.setAttribute('stroke', color);
      r.caja.setAttribute('stroke-width', String(inicial ? TRAZO.enfasis : TRAZO.base));
      r.texto.color(color);
      r.texto.poner(estados[indice % estados.length] ?? '');
    });
  }

  function pintar(): void {
    for (const nd of nodos) {
      const roto = cortados.has(nd.i);
      nd.linea.setAttribute('opacity', roto ? '0.12' : '1');
      nd.linea.setAttribute('stroke-dasharray', roto ? '2 6' : '');
      nd.punto.setAttribute('opacity', roto ? '0.25' : '1');
      nd.etiqueta.setAttribute('opacity', roto ? '0.25' : '1');
    }
    const vivas = nodos.length - cortados.size;
    const proporcion = vivas / nodos.length;

    if (estirando) {
      /*
       * Estirando, el centro NO se encoge: la definición sigue entera, y ese es el punto. Lo que se
       * mueve es hasta dónde llega. Encogerlo aquí diría que la definición se debilita, cuando lo
       * que la pieza afirma es que se usa igual de bien sin poder cerrarla.
       */
      centro.setAttribute('r', '34');
      centro.setAttribute('opacity', '1');
      textoCentro.setAttribute('opacity', '1');
      recuento?.poner((op.recuento ?? '')
        .replace('{cubiertos}', String(vivas))
        .replace('{total}', String(nodos.length)));
      restituir.disabled = true;
      return;
    }

    // Al perder relaciones, el centro deja de sostenerse: se encoge y se difumina.
    centro.setAttribute('r', String(12 + 22 * proporcion));
    centro.setAttribute('opacity', String(0.15 + 0.85 * proporcion));
    textoCentro.setAttribute('opacity', String(proporcion));
    restituir.disabled = cortados.size === 0;

    pintarConjunto();
    pintarFlujo();

    if (cortados.size === nodos.length) resolver(contenedor, op.resolucion);
    /*
     * El flujo habla el último: mientras corre, lo que hay que leer es lo que le pasa al proceso, no
     * la conclusión del desmontaje, que ya está dicha y sigue estando a la vista en la escena.
     */
    if (op.flujo && fluyendo) {
      resolver(contenedor, pasosFlujo < FLUJO_RANURAS ? op.flujo.nota : op.flujo.conclusion);
    }
  }

  nodos.forEach((nd) => {
    const alternar = () => {
      if (estirando) {
        /*
         * Estirar para alcanzar el caso que falta suelta otro. El que se suelta es el más lejano en
         * la rueda, no uno al azar: con un azar el usuario no puede comprobar que la pérdida es
         * consecuencia del gesto, y la pieza se lee como si a veces funcionara.
         */
        if (!cortados.has(nd.i)) return;
        cortados.delete(nd.i);
        const lejano = nodos
          .filter((o) => !cortados.has(o.i) && o.i !== nd.i)
          .sort((a, b) => distanciaEnRueda(b.i, nd.i) - distanciaEnRueda(a.i, nd.i))[0];
        if (lejano) cortados.add(lejano.i);
        resolver(contenedor, op.vinculos[nd.i]!.perdida);
        pintar();
        return;
      }
      const paquete = arrastreDe(nd.i);
      if (cortados.has(nd.i)) {
        /*
         * Se devuelve el paquete entero y no solo la pieza pulsada. Que lo arrastrado volviera pieza
         * a pieza contradiría lo que se acaba de enseñar al retirarlo: si el mundo viene en bloques,
         * viene en bloques también al ponerlo. Sin `arrastra` el paquete es una sola pieza y esto es
         * exactamente el comportamiento de siempre.
         */
        for (const j of paquete) cortados.delete(j);
        // La conclusión solo vale mientras el elemento sigue aislado: si se restituye un vínculo,
        // dejar el texto en pantalla sería afirmar algo que la escena ya no muestra.
        contenedor.querySelector('.vis-resolucion')?.remove();
      } else {
        for (const j of paquete) cortados.add(j);
        if (op.perfeccion) {
          avisoConjunto?.poner(paquete.length > 1 ? op.perfeccion.arrastre : op.perfeccion.suelto);
        }
        resolver(contenedor, op.vinculos[nd.i]!.perdida);
      }
      pintar();
    };
    nd.punto.addEventListener('click', alternar);
    nd.punto.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        alternar();
      }
    });
  });

  avanzar?.addEventListener('click', () => {
    // La primera pulsación pone el proceso en marcha; las siguientes lo hacen correr. Arrancar ya
    // avanzado escondería el estado de partida, que es contra el que se compara todo lo demás.
    if (!fluyendo) fluyendo = true;
    else pasosFlujo += 1;
    pintar();
    banda.animate(
      [{ transform: 'translateX(14px)', opacity: 0.4 }, { transform: 'none', opacity: 1 }],
      { duration: 260, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
  });

  restituir.addEventListener('click', () => {
    cortados.clear();
    contenedor.querySelector('.vis-resolucion')?.remove();
    avisoConjunto?.poner('');
    pintar();
  });

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}

/**
 * Modo «linea»: una línea de vida cuyos tramos se sostienen por hilos que se solapan.
 *
 * QUÉ NO PODÍA HACER LA RUEDA. En la rueda todo pasa por el centro: cada radio es la única vía de su
 * nodo y cortarlo lo deja fuera sin remedio. La idea a la que sirve este modo afirma lo contrario,
 * que un enlace roto puede quedar cubierto por otro que lo solapa, y eso exige que haya más de un
 * camino entre dos puntos. Aquí los momentos van en orden, los hilos cortos unen vecinos y los
 * largos saltan por encima, así que cortar un tramo no separa nada mientras algún hilo lo cruce.
 *
 * NO HAY NINGÚN HILO ENTRE EL PRIMER MOMENTO Y EL ÚLTIMO, y esa ausencia no es un descuido del
 * contenido: es la mitad de la tesis. Los extremos no se reconocen entre sí y siguen siendo la misma
 * persona por pura cadena de solapes. Si se añadiera ese hilo, la pieza demostraría otra cosa.
 */
function crearLinea(contenedor: HTMLElement, op: OpcionesRed, paleta: Paleta): Visualizacion {
  const momentos = op.momentos ?? [];
  const hilos = op.vinculos;
  const cortados = new Set<number>();
  // Lo demostrado no se desdemuestra: se recuerda haber visto las dos mitades del argumento.
  let vistoSolape = false;
  let vistoRota = false;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * La línea baja del centro del marco: los hilos largos suben mucho y necesitan todo el aire de
   * arriba, mientras que abajo solo caen los rótulos de los momentos y la lectura del estado.
   */
  const Y = 156;
  const X0 = 58;
  const X1 = ANCHO - 58;
  const paso = momentos.length > 1 ? (X1 - X0) / (momentos.length - 1) : 0;
  const xDe = (i: number): number => X0 + i * paso;

  raiz.append(svg('line', {
    x1: X0 - 18, y1: Y, x2: X1 + 18, y2: Y,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  }));

  /*
   * El nombre de la línea entera. Se atenúa cuando la línea se parte, que es la única forma de decir
   * sin palabras que el nombre ha dejado de cubrirla: un texto que avisara de ello sería repetir en
   * prosa lo que la escena ya enseña, y además duplicaría contenido en las dos fichas.
   */
  const nombre = rotulo(raiz, op.centro, {
    x: ANCHO / 2, y: 28, ancho: 340, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });

  const puntos = momentos.map((m, i) => {
    const extremo = i === 0 || i === momentos.length - 1;
    const circulo = svg('circle', {
      cx: xDe(i), cy: Y, r: 8, fill: 'none',
      stroke: extremo ? paleta.senal : paleta.neutro,
      'stroke-width': extremo ? TRAZO.enfasis : TRAZO.base,
      'vector-effect': 'non-scaling-stroke',
    });
    raiz.append(circulo);
    // El rótulo mide lo que da el reparto entre momentos: son fechas de una vida en dos idiomas y
    // sin partir se pisan entre vecinos en cuanto uno lleva más de dos palabras.
    const etiqueta = rotulo(raiz, m, {
      x: xDe(i), y: 182, ancho: Math.max(70, paso - 10),
      color: extremo ? paleta.senal : paleta.neutro, interlineado: 12, maxLineas: 2,
    });
    return { circulo, etiqueta, i };
  });

  const arcos = hilos.map((h, i) => {
    const a = h.desde ?? 0;
    const b = h.hasta ?? 0;
    /*
     * Cuanto más largo es el hilo, más alto sube el arco. Con todos a la misma altura, un hilo que
     * salta dos momentos se confunde con uno vecino y desaparece justo la propiedad que hay que
     * ver, que es el solape. La altura hace de leyenda sin gastar ni una palabra.
     */
    const altura = 40 * Math.max(1, Math.abs(b - a));
    const trazado = `M ${xDe(a)} ${Y} Q ${(xDe(a) + xDe(b)) / 2} ${Y - altura * 2} ${xDe(b)} ${Y}`;
    /*
     * Un hilo se pulsa por SU TRAZO, no por el área que encierra.
     *
     * El lenguaje común marca lo manipulable con `pointer-events: all`, que en una forma sin relleno
     * hace clicable también su interior. Aquí los arcos están anidados —los largos encierran a los
     * cortos, que es la forma que tiene el solape—, así que con esa regla el hilo de arriba se comía
     * todas las pulsaciones de los de debajo. Se acota al trazo, y para que el blanco no sea de un
     * píxel y medio va detrás una copia ancha e invisible del mismo trazado.
     */
    const golpe = svg('path', {
      d: trazado, fill: 'none', stroke: 'transparent', 'stroke-width': 14,
      style: SOLO_TRAZO, 'aria-hidden': 'true',
    });
    const arco = svg('path', {
      d: trazado, fill: 'none', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke',
      style: SOLO_TRAZO, 'data-trazo': '',
    });
    arco.setAttribute('role', 'button');
    arco.setAttribute('aria-label', op.etiquetaNodo.replace('{nombre}', h.nombre));
    marcarInteractivo(arco, paleta);
    // La marca de manipulable deja el trazo discontinuo, y aquí el trazo discontinuo ya significa
    // «cortado». Se devuelve a continuo, como en el resto de mecánicas que marcan formas grandes.
    arco.setAttribute('stroke-dasharray', '');
    arco.setAttribute('stroke-width', String(TRAZO.base));
    return { arco, golpe, i, a, b };
  });
  // Primero todos los blancos anchos y después todos los trazos: así el hilo que se ve queda siempre
  // por encima y una pulsación sobre él acierta con ese, no con el vecino que le pasa cerca.
  raiz.append(...arcos.map((a) => a.golpe), ...arcos.map((a) => a.arco));

  const estado = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 218, ancho: ANCHO - 60, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });

  const restituir = document.createElement('button');
  restituir.type = 'button';
  restituir.textContent = op.restituir;
  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  controles.append(restituir);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  /** Momentos a los que todavía se llega desde el primero por hilos sin cortar. */
  function alcanzados(): Set<number> {
    const dentro = new Set<number>([0]);
    let cambio = true;
    while (cambio) {
      cambio = false;
      hilos.forEach((h, i) => {
        if (cortados.has(i)) return;
        const a = h.desde ?? 0;
        const b = h.hasta ?? 0;
        if (dentro.has(a) !== dentro.has(b)) { dentro.add(a); dentro.add(b); cambio = true; }
      });
    }
    return dentro;
  }

  function pintar(): void {
    const dentro = alcanzados();
    const entera = dentro.has(momentos.length - 1);

    for (const arco of arcos) {
      const roto = cortados.has(arco.i);
      arco.arco.setAttribute('opacity', roto ? '0.12' : '1');
      arco.arco.setAttribute('stroke-dasharray', roto ? '2 6' : '');
      arco.arco.setAttribute('stroke', roto ? paleta.neutro : paleta.acento);
    }
    for (const p of puntos) {
      // Lo que ha quedado al otro lado del corte sigue existiendo: no se borra, se despega. Borrarlo
      // diría que ese tramo de vida desaparece, y lo que ocurre es que deja de ser el mismo alguien.
      p.circulo.setAttribute('opacity', dentro.has(p.i) ? '1' : '0.3');
      p.etiqueta.setAttribute('opacity', dentro.has(p.i) ? '1' : '0.3');
    }
    nombre.setAttribute('opacity', entera ? '1' : '0.3');
    estado.poner(entera ? (op.unida ?? '') : (op.rota ?? ''));

    /*
     * La conclusión pide haber visto LAS DOS MITADES: un tramo contiguo roto que la línea aguanta
     * porque otro hilo lo solapa, y después un tramo sin nadie que lo cubra, que sí la parte. Con
     * solo la primera, la pieza parecería decir que la identidad no se rompe nunca; con solo la
     * segunda, que cualquier corte la rompe. El argumento es la diferencia entre ambos casos.
     */
    const contiguoRoto = arcos.some((a) => cortados.has(a.i) && Math.abs(a.b - a.a) === 1);
    if (contiguoRoto && entera) vistoSolape = true;
    if (!entera) vistoRota = true;
    // Se exige que quede algo cortado: tras restituir, la escena está entera y no puede sostener
    // ninguna conclusión sobre roturas, aunque ya se hayan visto.
    if (vistoSolape && vistoRota && cortados.size > 0) resolver(contenedor, op.resolucion);

    restituir.disabled = cortados.size === 0;
  }

  arcos.forEach((arco) => {
    const alternar = () => {
      if (cortados.has(arco.i)) {
        cortados.delete(arco.i);
        contenedor.querySelector('.vis-resolucion')?.remove();
      } else {
        cortados.add(arco.i);
        resolver(contenedor, hilos[arco.i]!.perdida);
      }
      pintar();
    };
    arco.arco.addEventListener('click', alternar);
    arco.golpe.addEventListener('click', alternar);
    arco.arco.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        alternar();
      }
    });
  });

  restituir.addEventListener('click', () => {
    cortados.clear();
    contenedor.querySelector('.vis-resolucion')?.remove();
    pintar();
  });

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
