/**
 * Mecánica «eje»: una frontera que se arrastra y **reclasifica de golpe todos los casos**.
 *
 * Cubre:
 *  - El principio del daño (Mill): dónde poner la línea entre conducta privada y daño a terceros.
 *  - Placeres superiores (Mill): dónde poner la línea entre lo que apetece y lo que deja algo.
 *
 * POR QUÉ SE REHIZO. La versión anterior era una raya con un punto que se arrastraba hasta acertar
 * una zona correcta. Su propia alternativa textual prometía «una frontera que arrastra consigo todas
 * las conductas comparables al desplazarse», y no arrastraba nada: no había conductas, solo el
 * punto. El gráfico no hacía lo que su texto decía.
 *
 * LO QUE HACE AHORA. Los casos están repartidos por el eje. Al mover la frontera, **todos** cambian
 * de lado a la vez, y ahí está el argumento: no se puede prohibir a la carta. Quien quiera prohibir
 * un caso concreto se lleva por delante todos los que estén de ese lado, y esa consecuencia se ve
 * antes de que nadie la explique.
 *
 * No hay «posición correcta» y por eso se quitó la zona de acierto: la pieza no premia dar con un
 * número, muestra lo que cuesta cada posición. Es lo contrario de un examen.
 */

import {
  alternativaTextual, arrastreHorizontal, entrada, marcarInteractivo, paletaDe, resolver, rotulo,
  svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface CasoSpec {
  texto: string;
  /** Dónde cae en el eje, de 0 a 1. Es la posición del caso, no la de la frontera. */
  posicion: number;
}

export interface EscenarioSpec {
  nombre: string;
  extremoBajo: string;
  extremoAlto: string;
  /** Los casos comparables. Son lo que la frontera arrastra consigo. */
  casos: CasoSpec[];
  /** Qué se aprende al mover la frontera en este escenario. */
  acierto: string;
}

export interface OpcionesEje {
  corrienteId: string;
  escenarios: EscenarioSpec[];
  /** Cómo se llama lo que queda a la izquierda y lo que queda a la derecha. */
  ladoBajo: string;
  ladoAlto: string;
  /**
   * Nombre accesible de la escena. Sale del título de la idea, así que la pieza se
   * llama en cada idioma como lo que representa.
   */
  etiqueta: string;
  /** Nombre accesible del tirador de la frontera. */
  etiquetaTirador: string;
  resolucion: string;
  alternativaTexto: string;
}

const ANCHO = 560;
const ALTO = 240;
const EJE_Y = 138;
const MARGEN = 56;

export function crearEje(contenedor: HTMLElement, op: OpcionesEje): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  let iEsc = 0;
  let frontera = 0.5;
  const movidos = new Set<number>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const aX = (t: number) => MARGEN + t * (ANCHO - MARGEN * 2);
  const desdeX = (x: number) => Math.min(1, Math.max(0, (x - MARGEN) / (ANCHO - MARGEN * 2)));

  const titulo = svg('text', {
    x: ANCHO / 2, y: 28, class: 'vis-titulo-svg', 'text-anchor': 'middle', fill: paleta.senal,
  });
  raiz.append(titulo);

  // Las dos mitades del eje. Se tiñen enteras porque lo que la frontera divide no son puntos: son
  // dos regímenes, y todo lo que cae dentro de uno recibe el mismo trato.
  const zonaBaja = svg('rect', { y: EJE_Y - 3, height: 6, fill: paleta.neutro, opacity: 0.28 });
  const zonaAlta = svg('rect', { y: EJE_Y - 3, height: 6, fill: paleta.acento, opacity: 0.3 });
  raiz.append(zonaBaja, zonaAlta);
  raiz.append(svg('line', {
    x1: MARGEN, y1: EJE_Y, x2: ANCHO - MARGEN, y2: EJE_Y,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  }));

  /*
   * Los extremos del eje van en la fila de abajo, no junto a la línea.
   *
   * Pegados al eje se pisaban con los rótulos de los casos, que también caen ahí: los casos se
   * reparten por todo el eje, así que cualquier sitio próximo a la línea está ocupado a veces.
   */
  const etBaja = rotulo(raiz, '', { x: MARGEN - 8, y: 210, ancho: 150, color: paleta.neutro, ancla: 'start' });
  const etAlta = rotulo(raiz, '', { x: ANCHO - MARGEN + 8, y: 210, ancho: 150, color: paleta.neutro, ancla: 'end' });

  /*
   * La frontera. Es lo único que se manipula, y se marca con el trazo de énfasis para que no haya
   * duda de dónde está la palanca.
   */
  /*
   * Los dos extremos se paran ANTES de los rótulos, y por eso no son simétricos.
   *
   * Arriba ya lo estaban; abajo no, y ahí seguía tachando. Los rótulos de abajo se asientan en
   * `EJE_Y + 48`, pero admiten tres líneas y el bloque se centra sobre ese punto, así que el que se
   * parte en tres empieza a dibujarse en `EJE_Y + 27` —veinte píxeles más arriba de donde parece que
   * está— y la frontera, que bajaba hasta +34, le entraba por encima. Le pasaba a «no ponerse el
   * cinturón», que además es el caso que la escena coloca más cerca del centro del eje.
   *
   * La asimetría no se ve: los casos alternan arriba y abajo, así que nunca hay dos extremos de la
   * frontera comparándose contra el mismo rótulo.
   */
  const linea = svg('line', {
    y1: EJE_Y - 44, y2: EJE_Y + 24,
    stroke: paleta.acento, 'stroke-width': TRAZO.enfasis, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke',
  });
  const tirador = svg('circle', { cy: EJE_Y, r: 11, fill: paleta.acento });
  tirador.setAttribute('role', 'slider');
  tirador.setAttribute('aria-label', op.etiquetaTirador);
  tirador.setAttribute('aria-valuemin', '0');
  tirador.setAttribute('aria-valuemax', '100');
  raiz.append(linea, tirador);
  marcarInteractivo(tirador, paleta, 'arrastre');
  /*
   * La marca compartida es un contorno discontinuo, y sobre un disco macizo se lee como un borde
   * roto, no como una invitación. Antes se anulaba y punto —`stroke-dasharray: ''`— y con ella se
   * iba la única señal de dónde estaba la palanca: el tirador quedaba siendo un círculo del color de
   * acento, igual que los puntos de caso, solo que un poco más grande.
   *
   * Aquí la marca es un anillo continuo en el color de señal. Dice lo mismo que el trazo discontinuo
   * —esto se coge— con la forma que le corresponde a una pieza maciza, y ningún punto de caso lleva
   * anillo, así que la palanca vuelve a distinguirse de lo que solo se mira.
   */
  tirador.setAttribute('stroke-dasharray', '');
  tirador.setAttribute('stroke', paleta.senal);
  tirador.setAttribute('stroke-width', String(TRAZO.base));

  /** El recuento: cuántos casos caen a cada lado. Es la consecuencia, dicha en números. */
  const recuento = svg('text', {
    x: ANCHO / 2, y: ALTO - 8, class: 'vis-etiqueta', 'text-anchor': 'middle', fill: paleta.senal,
  });
  raiz.append(recuento);

  /** Un grupo por caso: el punto sobre el eje y su rótulo, alternando arriba y abajo. */
  const capaCasos = svg('g');
  raiz.append(capaCasos);

  contenedor.append(raiz);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const botones = op.escenarios.map((e, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = e.nombre;
    b.addEventListener('click', () => { iEsc = i; frontera = 0.5; construirCasos(); pintar(); });
    controles.append(b);
    return b;
  });
  contenedor.append(controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  let puntos: { punto: SVGElement; etiqueta: SVGTextElement; posicion: number }[] = [];

  function construirCasos(): void {
    capaCasos.replaceChildren();
    const e = op.escenarios[iEsc]!;
    titulo.textContent = e.nombre;
    etBaja.textContent = e.extremoBajo;
    etAlta.textContent = e.extremoAlto;

    /*
     * Los rótulos se alternan arriba y abajo del eje. Todos del mismo lado se pisarían en cuanto dos
     * casos quedaran cerca, y quedan cerca a menudo: los casos comparables lo son precisamente
     * porque están próximos.
     */
    /*
     * Cada rótulo mide el hueco que tiene, en vez de llevar todos el mismo ancho fijo.
     *
     * Alternar arriba y abajo no basta: tres casos seguidos del mismo lado quedan a 116 px y las
     * etiquetas medían hasta 132, así que se solapaban. Aquí cada una recibe como ancho la distancia
     * al vecino más próximo de SU lado, de modo que en la zona apretada el texto se parte en más
     * líneas y en la despejada se lee de un tirón.
     */
    const porLado = [0, 1].map((lado) =>
      e.casos.map((c, i) => ({ x: aX(c.posicion), i })).filter((_, i) => i % 2 === lado));
    const anchoDe = new Map<number, number>();
    for (const lista of porLado) {
      lista.forEach((n, k) => {
        const izq = k > 0 ? n.x - lista[k - 1]!.x : Infinity;
        const der = k < lista.length - 1 ? lista[k + 1]!.x - n.x : Infinity;
        anchoDe.set(n.i, Math.max(72, Math.min(140, Math.min(izq, der) - 8)));
      });
    }

    puntos = e.casos.map((c, i) => {
      const x = aX(c.posicion);
      const arriba = i % 2 === 0;
      const g = svg('g');
      const punto = svg('circle', { cx: x, cy: EJE_Y, r: 6 });
      const guia = svg('line', {
        x1: x, y1: arriba ? EJE_Y - 8 : EJE_Y + 8, x2: x, y2: arriba ? EJE_Y - 52 : EJE_Y + 30,
        stroke: paleta.neutro, 'stroke-width': TRAZO.fino, opacity: 0.5,
        'vector-effect': 'non-scaling-stroke',
      });
      g.append(guia, punto);
      capaCasos.append(g);
      const etiqueta = rotulo(capaCasos, c.texto, {
        x, y: arriba ? EJE_Y - 66 : EJE_Y + 48,
        ancho: anchoDe.get(i) ?? 132, color: paleta.senal, interlineado: 12, maxLineas: 3,
      });
      return { punto, etiqueta, posicion: c.posicion };
    });
  }

  function pintar(): void {
    const x = aX(frontera);
    linea.setAttribute('x1', String(x));
    linea.setAttribute('x2', String(x));
    tirador.setAttribute('cx', String(x));
    tirador.setAttribute('aria-valuenow', String(Math.round(frontera * 100)));

    zonaBaja.setAttribute('x', String(MARGEN));
    zonaBaja.setAttribute('width', String(Math.max(0, x - MARGEN)));
    zonaAlta.setAttribute('x', String(x));
    zonaAlta.setAttribute('width', String(Math.max(0, ANCHO - MARGEN - x)));

    // Aquí ocurre lo que la pieza afirma: se reclasifican TODOS, no el que se estaba mirando.
    let bajos = 0;
    for (const p of puntos) {
      const dentro = p.posicion <= frontera;
      if (dentro) bajos += 1;
      p.punto.setAttribute('fill', dentro ? paleta.neutro : paleta.acento);
      p.etiqueta.setAttribute('opacity', dentro ? '0.55' : '1');
    }
    recuento.textContent = `${op.ladoBajo}: ${bajos}   ·   ${op.ladoAlto}: ${puntos.length - bajos}`;

    botones.forEach((b, i) => b.setAttribute('aria-pressed', String(i === iEsc)));
  }

  /**
   * La resolución llega al haber **movido la frontera en los dos sentidos**, no al acertar una
   * posición. No hay posición correcta: lo que la pieza enseña es que cualquiera arrastra consigo
   * todo lo que tenga a un lado.
   */
  function comprobar(): void {
    if (frontera < 0.32) movidos.add(-1);
    if (frontera > 0.68) movidos.add(1);
    if (movidos.has(-1) && movidos.has(1)) resolver(contenedor, op.resolucion);
    else if (movidos.size) resolver(contenedor, op.escenarios[iEsc]!.acierto);
  }

  function desdeEvento(ev: PointerEvent): void {
    const caja = raiz.getBoundingClientRect();
    frontera = desdeX(((ev.clientX - caja.left) / caja.width) * ANCHO);
    pintar();
    comprobar();
  }

  let arrastrando = false;
  const alBajar = (ev: PointerEvent) => { arrastrando = true; ev.preventDefault(); desdeEvento(ev); };
  const alMover = (ev: PointerEvent) => { if (arrastrando) desdeEvento(ev); };
  const alSoltar = () => { arrastrando = false; };
  const alTeclado = (ev: KeyboardEvent) => {
    const paso = ev.shiftKey ? 0.1 : 0.02;
    if (ev.key === 'ArrowLeft') frontera = Math.max(0, frontera - paso);
    else if (ev.key === 'ArrowRight') frontera = Math.min(1, frontera + paso);
    else return;
    ev.preventDefault();
    pintar();
    comprobar();
  };

  raiz.addEventListener('pointerdown', alBajar);
  window.addEventListener('pointermove', alMover);
  window.addEventListener('pointerup', alSoltar);
  /*
   * `pointercancel` importa tanto como `pointerup`, y solo se nota con el dedo.
   *
   * Cuando el navegador decide que un gesto es suyo —porque el dedo se ha ido en vertical y la
   * página empieza a desplazarse— no manda `pointerup`: manda `pointercancel` y deja de informar. Sin
   * atenderlo, `arrastrando` se quedaba en `true` para siempre y a partir de ahí cualquier roce sobre
   * el gráfico movía la frontera sin que nadie la hubiera agarrado.
   */
  window.addEventListener('pointercancel', alSoltar);
  tirador.addEventListener('keydown', alTeclado);
  arrastreHorizontal(raiz);

  construirCasos();
  pintar();
  entrada(raiz);

  return {
    destruir(): void {
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerup', alSoltar);
      window.removeEventListener('pointercancel', alSoltar);
      contenedor.replaceChildren();
    },
  };
}
