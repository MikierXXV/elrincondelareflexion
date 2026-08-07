/**
 * Mecánica «dos capas»: dos planos superpuestos donde el usuario puede intervenir, y la respuesta
 * es deliberadamente asimétrica. Tocar arriba apenas mueve nada; tocar abajo lo reorganiza todo.
 *
 * Esa asimetría no es un efecto: es la tesis de las tres ideas que cubre.
 *  - El materialismo histórico (Marx): cambiar las ideas apenas altera las condiciones; cambiar
 *    las condiciones reorganiza las ideas.
 *  - Lo inconsciente (Freud): revisar la explicación consciente no toca lo que la produjo.
 *  - La libertad como comprensión (Spinoza): la decisión sentida no se mueve; lo que cambia todo
 *    es desplegar la cadena de causas.
 *
 * Para Spinoza la asimetría sola se quedaba corta. Su ficha promete además que la cadena de causas
 * **se despliega hacia atrás, eslabón a eslabón**, y que al hacerlo **una emoción cambia de estado
 * sin que las causas desaparezcan**. Eso lo añade la capacidad opcional `cadena` (ver más abajo),
 * que las otras dos ideas no declaran y por tanto no ven cambiar su pieza ni un píxel.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Paleta, Visualizacion } from '../lenguaje';

export interface IntervencionSpec {
  nombre: string;
  efecto: string;
  /** Cuánto se propaga a la otra capa, de 0 a 1. */
  propagacion: number;
}

export interface CapaSpec {
  nombre: string;
  intervenciones: IntervencionSpec[];
}

/**
 * La cadena de causas que se despliega hacia atrás, y la emoción que cambia de estado al hacerlo.
 *
 * POR QUÉ NO BASTABA LA MECÁNICA TAL CUAL. Con dos bandas y botones, la pieza afirmaba «mirar abajo
 * reorganiza lo de arriba», que es cierto pero no es lo que Spinoza dice. Le faltaban las dos cosas
 * que la ficha promete: que la cadena tenga fondo —que se pueda retroceder un eslabón más, y otro— y
 * que comprenderla cambie el estado de la emoción.
 *
 * POR QUÉ LAS CAUSAS NO DESAPARECEN AL COMPRENDERLAS. Es la línea que separa esta idea de su
 * caricatura. Si al completar la cadena los eslabones se borraran, se atenuaran o encogieran, la
 * pieza estaría diciendo que entender nos libera de la determinación —el libre albedrío por la
 * puerta de atrás—, que es justo lo contrario de la tesis. Así que al comprender no se retira nada:
 * los eslabones se quedan todos a la vista, a plena opacidad y con el mismo trazo, y lo único que
 * cambia es la emoción del margen, que pasa de masa opaca que ocupa a contorno que se puede mirar.
 * La libertad que se gana es exactamente esa y ninguna otra.
 *
 * Los eslabones no son un campo nuevo: son `abajo.intervenciones`. Un eslabón necesita nombre, algo
 * que leer al aparecer y cuánto deshace la sensación de espontaneidad, que es letra por letra lo que
 * ya declara `IntervencionSpec`. Duplicar la lista habría dejado el mismo contenido escrito dos
 * veces en dos idiomas, con la garantía de que un día divergen.
 */
export interface CadenaCausalSpec {
  /** Rótulo del botón que retrocede un eslabón. */
  desplegar: string;
  /** Rótulo del mismo botón cuando ya no queda cadena por desplegar. */
  completo: string;
  /** Nombre de la emoción que cambia de estado. */
  emocion: string;
  /** Cómo se lee la emoción mientras la cadena sigue plegada. */
  padecida: string;
  /** Cómo se lee cuando la cadena está entera a la vista. */
  comprendida: string;
  /** Lo que se lee al terminar el despliegue: las causas siguen ahí. */
  avisoCausas: string;
}

export interface OpcionesDosCapas {
  corrienteId: string;
  /** La capa de arriba: ideas, explicaciones, decisiones conscientes. */
  arriba: CapaSpec;
  /** La capa de abajo: condiciones materiales, causas, lo que no se ve. */
  abajo: CapaSpec;
  /** Capacidad opcional: la capa de abajo deja de ser un plano y pasa a ser una cadena que retrocede. */
  cadena?: CadenaCausalSpec;
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

export function crearDosCapas(contenedor: HTMLElement, op: OpcionesDosCapas): Visualizacion {
  const paleta = paletaDe(op.corrienteId);

  /*
   * Bifurcación temprana, como en `descomponer` con su modo «puerta».
   *
   * Se intentó primero encajar la cadena dentro de las dos bandas actuales reservando sitio con
   * condicionales, al estilo del medidor de `cadena`. No salió: la banda de abajo mide 78 de alto y
   * los eslabones necesitan filas con texto legible —frases enteras de la ficha, no piezas mudas—,
   * así que había que mover el alto de las dos bandas, sus dos «y», el reparto de las piezas y el
   * ancho útil. Eso son seis números gateados atravesando el camino del que ya dependen dos ideas
   * publicadas. Separado aquí, el materialismo histórico y lo inconsciente no pueden romperse.
   * Comparten paleta, marco, entrada y resolución, que es lo que hace que sigan siendo la misma
   * familia; lo que no comparten es una geometría que a una de las tres no le sirve.
   */
  if (op.cadena) return crearDespliegue(contenedor, op, op.cadena, paleta);

  let alteracionArriba = 0;
  let alteracionAbajo = 0;
  const probadas = new Set<string>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * Las dos bandas ocupan el hueco. Con x=90 y 58 de alto quedaban dos tiras estrechas en el centro
   * y casi la mitad del marco en blanco, cuando la pieza entera consiste en comparar esas dos bandas.
   */
  const x = 36;
  const ancho = ANCHO - x * 2;
  const alto = 78;
  const yArriba = 34;
  const yAbajo = 138;

  function banda(y: number, nombre: string, color: string) {
    const g = svg('g');
    const caja = svg('rect', {
      x, y, width: ancho, height: alto, rx: 2,
      fill: 'none', stroke: color, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    const et = svg('text', { x: x + 14, y: y + 24, class: 'vis-etiqueta', 'text-anchor': 'start', fill: color });
    et.textContent = nombre;
    // Las piezas internas son lo que se reorganiza: es donde se ve la propagación.
    const piezas = Array.from({ length: 7 }, (_, i) =>
      svg('rect', { x: x + 18 + i * ((ancho - 44) / 7), y: y + 38, width: (ancho - 44) / 7 - 10, height: 26, rx: 1, fill: color, opacity: 0.5 }),
    );
    g.append(caja, et, ...piezas);
    return { g, piezas, caja };
  }

  const arriba = banda(yArriba, op.arriba.nombre, paleta.senal);
  const abajo = banda(yAbajo, op.abajo.nombre, paleta.acento);
  marcarInteractivo(abajo.caja, paleta);
  abajo.caja.setAttribute('stroke-dasharray', '');

  raiz.append(abajo.g, arriba.g);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const total = op.arriba.intervenciones.length + op.abajo.intervenciones.length;

  function boton(spec: IntervencionSpec, esArriba: boolean): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = spec.nombre;
    b.addEventListener('click', () => {
      probadas.add(spec.nombre);
      // Intervenir en una capa altera esa capa por completo, y la otra solo según su propagación.
      if (esArriba) { alteracionArriba = 1; alteracionAbajo = spec.propagacion; }
      else { alteracionAbajo = 1; alteracionArriba = spec.propagacion; }
      resolver(contenedor, probadas.size >= total ? op.resolucion : spec.efecto);
      pintar();
    });
    controles.append(b);
    return b;
  }

  op.arriba.intervenciones.forEach((s) => boton(s, true));
  op.abajo.intervenciones.forEach((s) => boton(s, false));

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    const aplicar = (piezas: SVGElement[], alteracion: number) => {
      piezas.forEach((p, i) => {
        // El desorden es proporcional a cuánto ha llegado el cambio hasta esta capa.
        const desvio = alteracion * (((i * 37) % 13) - 6) * 1.6;
        p.setAttribute('transform', `translate(0 ${desvio.toFixed(1)})`);
        p.setAttribute('opacity', String(0.5 + alteracion * 0.4));
      });
    };
    aplicar(arriba.piezas, alteracionArriba);
    aplicar(abajo.piezas, alteracionAbajo);
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}

/**
 * Modo «despliegue»: la capa de abajo no es un plano que se agita, es una cadena que retrocede.
 *
 * Arriba sigue estando la decisión tal como se siente, con sus intervenciones inútiles: insistir en
 * que fue libre remueve la superficie y no llega a ninguna causa. Abajo, en vez de piezas mudas, hay
 * una pila de eslabones plegados que se abren de uno en uno, del más inmediato al más remoto. Y a la
 * derecha, ocupando la franja que las bandas ceden, la emoción.
 *
 * EL ORDEN DE LOS ESLABONES ES DE ARRIBA HACIA ABAJO, no de derecha a izquierda. Se probó la fila
 * horizontal desplegándose hacia la izquierda —«hacia atrás» leído como retroceso en la línea del
 * tiempo—, y tenía dos problemas: cuatro cajas en 380 de ancho dejan 80 por eslabón, donde una frase
 * de la ficha en versales no cabe ni partida en cuatro líneas, y además el texto crecía hacia el
 * lado contrario al que crece la lectura. Apiladas, cada eslabón tiene una línea entera de 348 y el
 * retroceso se lee como lo que es: bajar por debajo de lo anterior, cavar.
 */
function crearDespliegue(
  contenedor: HTMLElement,
  op: OpcionesDosCapas,
  cadena: CadenaCausalSpec,
  paleta: Paleta,
): Visualizacion {
  const eslabones = op.abajo.intervenciones;
  const n = eslabones.length;
  let desplegados = 0;
  let alteracionArriba = 0;
  let alteracionAbajo = 0;
  const probadas = new Set<string>();
  const total = op.arriba.intervenciones.length + n;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const X = 36;
  // Franja derecha para la emoción, igual que el medidor de `cadena` y el de `clasificar`.
  const RESERVADO = 92;
  const ANCHO_BANDA = ANCHO - X * 2 - RESERVADO;
  const INTERIOR = X + 14;
  const ANCHO_INTERIOR = ANCHO_BANDA - 28;

  /*
   * La capa de arriba es baja a propósito: es lo que se siente, y lo que se siente es una superficie.
   * Todo el alto sobrante se lo lleva la cadena, que es donde ocurre la pieza.
   */
  const superiorY = 22;
  const superiorAlto = 48;
  const gSuperior = svg('g');
  const cajaSuperior = svg('rect', {
    x: X, y: superiorY, width: ANCHO_BANDA, height: superiorAlto, rx: 2,
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });
  gSuperior.append(cajaSuperior);
  rotulo(gSuperior, op.arriba.nombre, {
    x: INTERIOR, y: superiorY + 18, ancho: ANCHO_INTERIOR,
    color: paleta.senal, ancla: 'start', interlineado: 12, maxLineas: 1,
  });
  const anchoPieza = ANCHO_INTERIOR / 7;
  const piezas = Array.from({ length: 7 }, (_, i) =>
    svg('rect', {
      x: INTERIOR + i * anchoPieza, y: superiorY + 26, width: anchoPieza - 10, height: 16, rx: 1,
      fill: paleta.senal, opacity: 0.5,
    }),
  );
  gSuperior.append(...piezas);

  const inferiorY = 76;
  const inferiorAlto = 152;
  const gInferior = svg('g');
  const cajaInferior = svg('rect', {
    x: X, y: inferiorY, width: ANCHO_BANDA, height: inferiorAlto, rx: 2,
    fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });
  gInferior.append(cajaInferior);
  rotulo(gInferior, op.abajo.nombre, {
    x: INTERIOR, y: inferiorY + 18, ancho: ANCHO_INTERIOR,
    color: paleta.acento, ancla: 'start', interlineado: 12, maxLineas: 1,
  });

  /*
   * Las filas se reparten el alto disponible en vez de medir un fijo: con dos eslabones la banda no
   * queda medio vacía y con seis no se salen por abajo. El contenido decide cuántos hay.
   */
  const filaPrimera = inferiorY + 30;
  const filaUltima = inferiorY + inferiorAlto - 8;
  const HUECO = 6;
  const filaAlto = n ? (filaUltima - filaPrimera - HUECO * (n - 1)) / n : 0;

  const filas = eslabones.map((_, i) => {
    const y = filaPrimera + i * (filaAlto + HUECO);
    const g = svg('g');
    const caja = svg('rect', {
      x: INTERIOR, y, width: ANCHO_INTERIOR, height: filaAlto, rx: 2,
      fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke',
    });
    g.append(caja);
    // El nombre del eslabón no existe hasta que se despliega: se pone y se quita, así que va mutable.
    const et = rotuloMutable(g, {
      x: INTERIOR + 10, y: y + filaAlto / 2 + 4, ancho: ANCHO_INTERIOR - 20,
      color: paleta.acento, ancla: 'start', interlineado: 12, maxLineas: 1,
    });
    gInferior.append(g);
    return { g, caja, et, centro: y + filaAlto / 2 };
  });

  /*
   * La espina que baja desde la decisión hasta el último eslabón abierto. Sin ella los eslabones
   * serían una lista; con ella se ve que cuelgan de la decisión y unos de otros, que es lo que
   * convierte una enumeración de causas en una cadena.
   */
  const espina = svg('line', {
    x1: X + 7, y1: superiorY + superiorAlto, x2: X + 7, y2: superiorY + superiorAlto,
    stroke: paleta.acento, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', opacity: 0,
  });

  raiz.append(gInferior, gSuperior, espina);

  /*
   * La emoción. Ocupa toda la altura de la franja porque no es un indicador de la escena: es el
   * tercer personaje. Empieza como bloque relleno —una masa que ocupa y desde la que se mira— y
   * termina como contorno vacío, algo que se puede mirar. Ni encoge ni se va: cambia de estado.
   */
  const emocionX = X + ANCHO_BANDA + 16;
  const emocionAncho = ANCHO - 24 - emocionX;
  rotulo(raiz, cadena.emocion, {
    x: ANCHO - 24, y: 36, ancho: 96, color: paleta.neutro,
    ancla: 'end', interlineado: 12, maxLineas: 2,
  });
  const cajaEmocion = svg('rect', {
    x: emocionX, y: 52, width: emocionAncho, height: 176, rx: 2,
    fill: paleta.senal, 'fill-opacity': 0.22, stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });
  raiz.append(cajaEmocion);
  const estadoEmocion = rotuloMutable(raiz, {
    x: emocionX + emocionAncho / 2, y: 140, ancho: emocionAncho - 12,
    color: paleta.senal, interlineado: 13, maxLineas: 3,
  });

  /*
   * La banda de abajo es el sitio donde se despliega, así que es ella la que lleva la marca de
   * manipulable y responde al clic y al teclado. El botón hace lo mismo: quien no vea la afordancia
   * en el dibujo la tiene escrita debajo.
   */
  marcarInteractivo(cajaInferior, paleta);
  cajaInferior.setAttribute('stroke-dasharray', '');
  cajaInferior.setAttribute('role', 'button');

  const controles = document.createElement('div');
  controles.className = 'vis-controles';

  op.arriba.intervenciones.forEach((spec) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = spec.nombre;
    b.addEventListener('click', () => {
      probadas.add(spec.nombre);
      /*
       * Intervenir arriba remueve arriba y llega abajo solo según su propagación, que en esta idea
       * es casi cero. El temblor imperceptible de los eslabones no es un descuido: es la afirmación.
       * Insistir en que fue libre agita mucho la superficie y no mueve ninguna causa de sitio.
       */
      alteracionArriba = 1;
      alteracionAbajo = spec.propagacion;
      anunciar(spec.efecto);
      pintar();
    });
    controles.append(b);
  });

  const desplegar = document.createElement('button');
  desplegar.type = 'button';
  controles.append(desplegar);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function anunciar(texto: string): void {
    resolver(contenedor, probadas.size >= total ? op.resolucion : texto);
  }

  function desplegarUno(): void {
    if (desplegados >= n) return;
    const eslabon = eslabones[desplegados]!;
    desplegados += 1;
    probadas.add(eslabon.nombre);
    /*
     * Sacar una causa a la vista deshace la sensación de espontaneidad de arriba, y por eso sube
     * `alteracionArriba`. Lo que NO hace es tocar la capa de abajo: una causa no se altera por ser
     * vista, ya estaba entera antes de que nadie la mirara. Por eso `alteracionAbajo` no se toca
     * aquí, y por eso se toma el máximo y no el último valor: comprender no se deshace.
     */
    alteracionArriba = Math.max(alteracionArriba, eslabon.propagacion);
    anunciar(desplegados >= n ? cadena.avisoCausas : eslabon.efecto);
    pintar();
  }

  desplegar.addEventListener('click', desplegarUno);
  cajaInferior.addEventListener('click', desplegarUno);
  cajaInferior.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
      e.preventDefault();
      desplegarUno();
    }
  });

  function pintar(): void {
    const proporcion = n ? desplegados / n : 0;
    const comprendida = n > 0 && desplegados >= n;

    piezas.forEach((p, i) => {
      const desvio = alteracionArriba * (((i * 37) % 13) - 6) * 1.6;
      p.setAttribute('transform', `translate(0 ${desvio.toFixed(1)})`);
      p.setAttribute('opacity', String(0.5 + alteracionArriba * 0.4));
    });

    filas.forEach((f, i) => {
      const abierto = i < desplegados;
      const desvio = alteracionAbajo * (((i * 37) % 13) - 6) * 1.6;
      f.g.setAttribute('transform', `translate(0 ${desvio.toFixed(1)})`);
      /*
       * Un eslabón abierto se queda abierto y a plena vista PARA SIEMPRE. Aquí no hay ninguna rama
       * que lo atenúe al completar la cadena, y no la hay a propósito: si al comprender los
       * eslabones palidecieran, la pieza estaría diciendo que entender disuelve las causas. Lo
       * plegado se dibuja con el trazo roto de «esto todavía no está», no de «esto ya no está».
       */
      f.g.setAttribute('opacity', abierto ? '1' : '0.14');
      f.caja.setAttribute('stroke-dasharray', abierto ? '' : '4 4');
      f.et.poner(abierto ? eslabones[i]!.nombre : '');
    });

    espina.setAttribute('opacity', desplegados ? '1' : '0');
    espina.setAttribute('y2', String(
      desplegados ? filas[desplegados - 1]!.centro : superiorY + superiorAlto,
    ));

    /*
     * La emoción se va vaciando mientras la cadena se abre —deja de ser opaca antes de dejar de
     * ser padecida—, y el cambio de estado ocurre solo cuando está entera a la vista. El tamaño no
     * cambia nunca: comprender no la hace más pequeña, la hace transparente.
     */
    cajaEmocion.setAttribute('fill-opacity', (0.22 * (1 - proporcion)).toFixed(2));
    cajaEmocion.setAttribute('stroke', comprendida ? paleta.acento : paleta.senal);
    cajaEmocion.setAttribute('stroke-width', String(comprendida ? TRAZO.base : TRAZO.enfasis));
    estadoEmocion.color(comprendida ? paleta.acento : paleta.senal);
    estadoEmocion.poner(comprendida ? cadena.comprendida : cadena.padecida);

    const agotada = desplegados >= n;
    desplegar.disabled = agotada;
    desplegar.textContent = agotada ? cadena.completo : cadena.desplegar;
    cajaInferior.setAttribute('aria-label', agotada ? cadena.completo : cadena.desplegar);
    cajaInferior.setAttribute('aria-disabled', String(agotada));
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
