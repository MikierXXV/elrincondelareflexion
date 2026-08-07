/**
 * Mecánica «contexto»: un mismo elemento se lleva a escenas distintas y cambia de sentido sin que
 * el elemento se altere. Lo que cambia está fuera de él.
 *
 * Cubre:
 *  - El significado es el uso (Wittgenstein): la misma palabra en una obra, una cocina, un aula.
 *  - Dos niveles de lectura (Averroes): el mismo pasaje en registro retórico, dialéctico y
 *    demostrativo, y qué cede cuando choca con una demostración.
 *
 * El detalle que la hace argumento: **el signo del centro nunca se modifica**. Si se pudiera
 * editar, la pieza estaría diciendo que el sentido está dentro, que es justo lo contrario.
 *
 * Sobre las dos capacidades opcionales de más abajo —`rasgo` y `conflicto`—: las dos AÑADEN una
 * banda a la derecha y dejan intacto el recorrido de escenas, así que van como capacidades y no
 * como modos. Se descartó bifurcar al entrar, al estilo de `descomponer` con su modo `puerta`,
 * porque allí el usuario hace algo distinto —ofrece desde fuera en vez de partir lo que ya está— y
 * aquí sigue haciendo exactamente lo mismo: llevar el mismo signo de escena en escena. Bifurcar
 * habría obligado a duplicar ese recorrido en dos sitios para no ganar nada.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable,
  svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface EscenaSpec {
  nombre: string;
  /** Qué significa el elemento en esta escena. */
  sentido: string;
  nota: string;
}

export interface RasgoSpec {
  /** Lo que el usuario propone como rasgo común. */
  nombre: string;
  /** Índice del caso que carece de él. Uno solo: la propuesta cae por un ejemplo, no por un empate. */
  refutadoPor: number;
  /** Por qué ese caso la desmiente. */
  refutacion: string;
}

export interface DescarteSpec {
  nombre: string;
  /** Verdadero si lo que se pretende tirar es la demostración; falso, si el pasaje. */
  descartaLaPrueba: boolean;
  /** Por qué no se concede. */
  negativa: string;
}

export interface OpcionesContexto {
  corrienteId: string;
  /** El elemento que no cambia: una palabra, un pasaje. */
  elemento: string;
  escenas: EscenaSpec[];
  /**
   * Búsqueda de un rasgo común que SIEMPRE queda desmentida.
   *
   * La escena sola enseña que el sentido cambia con el uso, y eso es la mitad de lo que Wittgenstein
   * sostiene. La otra mitad es que muchos conceptos no tienen definición, y esa no se puede afirmar
   * con una escena: hay que dejar que el usuario proponga el rasgo y que un caso concreto se lo
   * tumbe. Se descartó darle una lista de rasgos ya tachados, porque entonces la pieza afirma el
   * resultado en vez de someterlo a prueba, que es justo la diferencia entre leerlo y verlo caer.
   *
   * Lo que queda al final no es una definición sino las uniones acumuladas: cada rasgo enlaza a los
   * casos que sí lo comparten, ninguno los enlaza a todos, y todos acaban habiendo quedado fuera de
   * alguna propuesta —por eso los casos ya refutadores conservan el trazo roto—.
   */
  rasgo?: {
    /** Encabeza la banda y nombra el grupo de botones. */
    rotulo: string;
    /** Los usos entre los que se busca el rasgo. La banda está dimensionada para cuatro. */
    casos: string[];
    rasgos: RasgoSpec[];
    /** Lo que se lee mientras queden rasgos por proponer. */
    invitacion: string;
    /** Lo que queda dicho cuando ya se han propuesto todos. */
    sinNucleo: string;
  };
  /**
   * Un choque explícito con algo demostrado, del que solo se sale cambiando de registro.
   *
   * Averroes no dice que un texto admita varias lecturas —eso lo dice ya la escena—, sino qué hacer
   * cuando una de ellas contradice una prueba. Sin el choque no hay regla que demostrar. Y sin las
   * dos salidas falsas ofrecidas y negadas, cambiar de registro parecería la única opción
   * disponible en vez de la única defendible: se ofrecen precisamente para que se estrellen.
   */
  conflicto?: {
    /** Encabeza la banda de la prueba y nombra el grupo de botones. */
    rotulo: string;
    /** La proposición demostrada, parafraseada. */
    proposicion: string;
    /** Rótulo del botón que la trae a la escena. */
    introducir: string;
    /** Índice del registro en el que el choque deja de haberlo. */
    resuelveEn: number;
    /** Lo que se lee mientras el choque está en pie. */
    choque: string;
    /** Lo que se lee al deshacerlo cambiando de registro. */
    resuelto: string;
    /** Las salidas que la pieza ofrece y niega. */
    descartes: DescarteSpec[];
  };
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

export function crearContexto(contenedor: HTMLElement, op: OpcionesContexto): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  // Se fijan aquí para que TypeScript los estreche una vez y no haya que repetir el `!` en cada cierre.
  const rg = op.rasgo;
  const conf = op.conflicto;
  let actual = 0;
  const vistas = new Set<number>([0]);

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * Espacio cedido a la banda de la derecha, y SOLO si la ficha pide una de las dos capacidades.
   * Sin ninguna, RESERVADO vale 0 y todas las medidas de abajo se reducen a las de siempre: una idea
   * de `contexto` que no declare nada se dibuja píxel a píxel como antes.
   */
  const RESERVADO = rg ? 204 : conf ? 184 : 0;
  const marcoAncho = ANCHO - 52 - RESERVADO;
  const cx = 26 + marcoAncho / 2;
  // La caja del signo no crece con el hueco, pero sí se encoge si el hueco no le llega.
  const cajaAncho = Math.min(264, marcoAncho - 40);

  // El marco del contexto: es lo único que cambia.
  const marco = svg('rect', {
    x: 26, y: 26, width: marcoAncho, height: ALTO - 52, rx: 4,
    fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
    'stroke-dasharray': '6 4', 'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });
  const nombreEscena = rotuloMutable(raiz, {
    x: cx, y: 60, ancho: marcoAncho - 68, color: paleta.neutro, interlineado: 13, maxLineas: 1,
  });

  // El elemento: inmutable, y por eso se dibuja siempre igual y no admite interacción.
  const caja = svg('rect', { x: cx - cajaAncho / 2, y: 88, width: cajaAncho, height: 62, rx: 2, fill: 'none', stroke: paleta.acento, 'stroke-width': TRAZO.enfasis, 'vector-effect': 'non-scaling-stroke' });
  // El signo del centro es lo único que NO cambia nunca, así que no necesita ser mutable.
  const texto = svg('text', { x: cx, y: 128, class: 'vis-titulo-svg', 'text-anchor': 'middle', fill: paleta.acento, style: 'font-size:150%' });
  texto.textContent = op.elemento;

  /*
   * El sentido que toma el signo en cada escena. Es la frase más larga de la pieza y la que cambia
   * al pulsar: con un `<text>` en bruto se salía del cuadro por los dos lados en cuanto la escena
   * traía una explicación de más de cuatro palabras, que es casi siempre.
   */
  const sentido = rotuloMutable(raiz, {
    x: cx, y: 186, ancho: marcoAncho - 44, color: paleta.senal, interlineado: 15, maxLineas: 3,
  });

  // Los rótulos mutables se insertan ellos mismos al ponerles texto; aquí solo va lo fijo.
  raiz.append(marco, caja, texto);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = op.escenas.map((e, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = e.nombre;
    b.addEventListener('click', () => {
      actual = i;
      vistas.add(i);
      pintar();
      resolver(contenedor, completo() ? op.resolucion : leerEscena(e));
    });
    controles.append(b);
    return b;
  });

  // Grupos de botones que aportan las capacidades. Vacío si no hay ninguna declarada.
  const gruposExtra: HTMLElement[] = [];

  /* ------------------------------------------------------------------ búsqueda del rasgo común */

  const rasgos = rg?.rasgos ?? [];
  let rasgoActual: number | null = null;
  const rasgosProbados = new Set<number>();
  /** Casos que ya han dejado fuera alguna propuesta. Al final están todos, y eso es el argumento. */
  const refutadores = new Set<number>();
  let pintarRasgo: () => void = () => {};

  if (rg) {
    const IZQ = ANCHO - RESERVADO + 4;
    const DER = ANCHO - 12;
    const bcx = (IZQ + DER) / 2;

    rotulo(raiz, rg.rotulo, {
      x: bcx, y: 46, ancho: DER - IZQ, color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });

    /*
     * Rejilla de dos columnas, dimensionada para CUATRO casos.
     *
     * No se generaliza a más porque en 188 px de banda un quinto rótulo obliga a bajar el cuerpo por
     * debajo de lo legible, y sobre todo porque el argumento no mejora con más contraejemplos: basta
     * con que cada propuesta caiga por uno. La lista canónica de Wittgenstein son cuatro.
     */
    const cxCol = [IZQ + 44, DER - 44];
    const filas = Math.ceil(rg.casos.length / 2);
    const pos = rg.casos.map((_, i) => ({
      x: cxCol[i % 2] ?? bcx,
      y: filas <= 1 ? 130 : 104 + Math.floor(i / 2) * (52 / (filas - 1)),
    }));

    /*
     * Las uniones van en su propio grupo y se insertan ANTES que los nodos: dibujadas después
     * cruzaban por encima de los círculos y parecía que los tachaban.
     */
    const gRed = svg('g');
    raiz.append(gRed);
    const aristas: { linea: SVGElement; a: number; b: number }[] = [];
    for (let a = 0; a < pos.length; a++) {
      for (let b = a + 1; b < pos.length; b++) {
        const linea = svg('line', {
          x1: pos[a]!.x, y1: pos[a]!.y, x2: pos[b]!.x, y2: pos[b]!.y,
          stroke: paleta.neutro, 'stroke-width': TRAZO.fino,
          'vector-effect': 'non-scaling-stroke', opacity: 0,
        });
        gRed.append(linea);
        aristas.push({ linea, a, b });
      }
    }

    const circulos = pos.map((p) => {
      const c = svg('circle', {
        cx: p.x, cy: p.y, r: 6, fill: 'none', stroke: paleta.neutro,
        'stroke-width': TRAZO.base, 'vector-effect': 'non-scaling-stroke',
      });
      raiz.append(c);
      return c;
    });

    /*
     * El rótulo de cada caso va fuera del círculo: dentro no cabe «Juegos olímpicos» ni encogiéndolo,
     * y con el círculo alrededor el texto quedaba pegado al trazo. Arriba en la fila de arriba y
     * abajo en la de abajo, para que nunca caiga sobre una unión.
     */
    const etiquetas = rg.casos.map((nombre, i) => rotulo(raiz, nombre, {
      x: pos[i]!.x, y: pos[i]!.y + (Math.floor(i / 2) === 0 ? -20 : 22), ancho: 88,
      color: paleta.neutro, interlineado: 11, maxLineas: 2,
    }));

    /*
     * Se asienta diez píxeles más abajo de lo que parece necesario, y es por las TRES líneas.
     *
     * El bloque se centra sobre su `y`, así que cuando la instrucción se parte en tres empieza a
     * dibujarse once píxeles por encima de ese punto. En `204` eso la metía justo donde terminan los
     * rótulos de la fila de abajo, y en «El significado es el uso» «propón un rasgo común a los
     * cuatro» caía sobre «corro de niños» y «juegos olímpicos»: los dos casos que hay que mirar para
     * responder a lo que la propia instrucción pide.
     *
     * Con 214 el bloque de tres líneas termina en 228 y el marco llega a 240, así que sigue dentro.
     */
    const estadoRasgo = rotuloMutable(raiz, {
      x: bcx, y: 214, ancho: DER - IZQ - 4, color: paleta.senal, interlineado: 11, maxLineas: 3,
    });

    const grupo = document.createElement('div');
    grupo.className = 'vis-controles';
    grupo.setAttribute('role', 'group');
    grupo.setAttribute('aria-label', rg.rotulo);
    const botonesRasgo = rasgos.map((r, j) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = r.nombre;
      b.addEventListener('click', () => {
        rasgoActual = j;
        rasgosProbados.add(j);
        refutadores.add(r.refutadoPor);
        pintar();
        resolver(contenedor, completo() ? op.resolucion : r.refutacion);
      });
      grupo.append(b);
      return b;
    });
    gruposExtra.push(grupo);

    pintarRasgo = (): void => {
      const fuera = rasgoActual === null ? -1 : rasgos[rasgoActual]!.refutadoPor;

      for (const { linea, a, b } of aristas) {
        // Une a los que comparten la propuesta en curso; el caso que la desmiente se queda suelto.
        const enCurso = fuera >= 0 && a !== fuera && b !== fuera;
        // Y sigue unida si algún rasgo ya propuesto la había unido: eso es lo que teje la red.
        const tejida = [...rasgosProbados].some((j) => {
          const r = rasgos[j]!.refutadoPor;
          return a !== r && b !== r;
        });
        linea.setAttribute('opacity', enCurso ? '1' : tejida ? '0.45' : '0');
        linea.setAttribute('stroke', enCurso ? paleta.acento : paleta.neutro);
        linea.setAttribute('stroke-width', String(enCurso ? TRAZO.enfasis : TRAZO.fino));
      }

      circulos.forEach((c, i) => {
        const excluido = i === fuera;
        c.setAttribute('stroke', excluido ? paleta.senal : paleta.neutro);
        c.setAttribute('stroke-width', String(excluido ? TRAZO.enfasis : TRAZO.base));
        // El trazo roto se queda puesto: al final lo llevan los cuatro, y eso es lo que hay que ver.
        c.setAttribute('stroke-dasharray', refutadores.has(i) ? '3 3' : '');
        etiquetas[i]!.setAttribute('fill', excluido ? paleta.senal : paleta.neutro);
      });

      for (const [j, b] of botonesRasgo.entries()) b.setAttribute('aria-pressed', String(rasgosProbados.has(j)));
      estadoRasgo.poner(rasgosProbados.size >= rasgos.length ? rg.sinNucleo : rg.invitacion);
    };
  }

  /* ------------------------------------------------------- choque con una proposición demostrada */

  let pruebaDentro = false;
  let resueltoYa = false;
  let pintarConflicto: () => void = () => {};

  if (conf) {
    const IZQ = ANCHO - RESERVADO + 6;
    const DER = ANCHO - 12;
    const bcx = (IZQ + DER) / 2;

    rotulo(raiz, conf.rotulo, {
      x: bcx, y: 58, ancho: DER - IZQ, color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });

    /*
     * La prueba ocupa la misma franja de altura que el pasaje: se miran de frente, y lo que pasa
     * entre las dos ocupa el hueco. Puesta debajo, el choque quedaba en diagonal y se leía como un
     * paso de un sitio a otro en vez de como dos cosas que no encajan.
     */
    const cajaPrueba = svg('rect', {
      x: IZQ, y: 84, width: DER - IZQ, height: 72, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'stroke-dasharray': '4 4', 'vector-effect': 'non-scaling-stroke',
    });
    raiz.append(cajaPrueba);
    const textoPrueba = rotuloMutable(raiz, {
      x: bcx, y: 120, ancho: DER - IZQ - 16, color: paleta.acento, interlineado: 12, maxLineas: 4,
    });

    const X1 = cx + cajaAncho / 2 + 6;
    const X2 = IZQ - 6;
    const YM = 119;
    // Quebrado mientras chocan; recto cuando concuerdan. Es la misma distancia recorrida de dos maneras.
    const choque = svg('polyline', {
      points: `${X1},${YM} ${X1 + 11},${YM - 11} ${X1 + 22},${YM + 11} ${X1 + 33},${YM - 11} ${X2},${YM}`,
      fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
      'vector-effect': 'non-scaling-stroke', opacity: 0,
    });
    const acuerdo = svg('line', {
      x1: X1, y1: YM, x2: X2, y2: YM,
      stroke: paleta.acento, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', opacity: 0,
    });
    raiz.append(choque, acuerdo);

    const grupo = document.createElement('div');
    grupo.className = 'vis-controles';
    grupo.setAttribute('role', 'group');
    grupo.setAttribute('aria-label', conf.rotulo);

    const introducir = document.createElement('button');
    introducir.type = 'button';
    introducir.textContent = conf.introducir;
    introducir.addEventListener('click', () => {
      pruebaDentro = true;
      pintar();
      resolver(contenedor, completo() ? op.resolucion : leerEscena(op.escenas[actual]!));
    });
    grupo.append(introducir);

    const botonesDescarte = conf.descartes.map((d) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = d.nombre;
      b.addEventListener('click', () => {
        /*
         * Ninguna de las dos se concede. Lo que se pretende tirar se sacude y sigue donde estaba:
         * si el botón llegara a vaciar la caja, la pieza estaría enseñando que descartar es una
         * salida posible aunque el texto de al lado dijera lo contrario. Lo que se ve manda.
         */
        const objetivo = d.descartaLaPrueba ? cajaPrueba : caja;
        objetivo.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }],
          { duration: 260, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
        );
        resolver(contenedor, d.negativa);
      });
      grupo.append(b);
      return b;
    });
    gruposExtra.push(grupo);

    pintarConflicto = (): void => {
      /*
       * El choque no depende de un registro concreto marcado como culpable, sino de NO estar en el
       * que lo resuelve: mientras el pasaje se lea por debajo del nivel demostrativo, la
       * contradicción sigue en pie. Así el usuario la ve aparecer y desaparecer moviéndose.
       */
      const enChoque = pruebaDentro && actual !== conf.resuelveEn;
      const enAcuerdo = pruebaDentro && actual === conf.resuelveEn;
      if (enAcuerdo) resueltoYa = true;

      textoPrueba.poner(pruebaDentro ? conf.proposicion : '');
      cajaPrueba.setAttribute('stroke', !pruebaDentro ? paleta.neutro : enChoque ? paleta.senal : paleta.acento);
      cajaPrueba.setAttribute('stroke-width', String(enChoque ? TRAZO.enfasis : TRAZO.base));
      // Trazo roto mientras la prueba no está: el hueco anuncia lo que va a ocuparlo.
      cajaPrueba.setAttribute('stroke-dasharray', pruebaDentro ? '' : '4 4');
      choque.setAttribute('opacity', enChoque ? '1' : '0');
      acuerdo.setAttribute('opacity', enAcuerdo ? '1' : '0');

      introducir.disabled = pruebaDentro;
      introducir.setAttribute('aria-pressed', String(pruebaDentro));
      // Descartar solo se ofrece cuando hay algo que descartar: sin choque, la oferta no dice nada.
      for (const b of botonesDescarte) b.disabled = !enChoque;
    };
  }

  contenedor.append(raiz, controles, ...gruposExtra);
  alternativaTextual(contenedor, op.alternativaTexto);
  // El marco es lo manipulable; el elemento del centro, deliberadamente no.
  marcarInteractivo(marco, paleta);
  marco.setAttribute('stroke-dasharray', '6 4');
  marco.removeAttribute('tabindex');

  /**
   * Todo lo que la ficha promete, hecho. Sin capacidades declaradas se reduce a la condición de
   * siempre —haber visitado todas las escenas—, así que las ideas que no las usan resuelven igual.
   */
  function completo(): boolean {
    return vistas.size >= op.escenas.length
      && (!rg || rasgosProbados.size >= rasgos.length)
      && (!conf || resueltoYa);
  }

  /** Con la prueba dentro, lo que hay que leer es el estado del choque y no la nota del registro. */
  function leerEscena(e: EscenaSpec): string {
    if (!conf || !pruebaDentro) return e.nota;
    return actual === conf.resuelveEn ? conf.resuelto : conf.choque;
  }

  function pintar(): void {
    const e = op.escenas[actual]!;
    nombreEscena.poner(e.nombre);
    sentido.poner(e.sentido);
    botones.forEach((b, i) => b.setAttribute('aria-pressed', String(i === actual)));
    pintarRasgo();
    pintarConflicto();
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
