/**
 * Mecánica «repetición»: un suceso se repite tantas veces como el usuario quiera, un contador de
 * expectativa sube con cada una, y en cualquier momento puede pedir ver la conexión. Al ampliar
 * al máximo, no hay ninguna: solo dos sucesos contiguos.
 *
 * Es la mecánica que sostiene la convergencia más llamativa del recorrido:
 *  - La causalidad como hábito (Hume, s. XVIII).
 *  - La crítica de la causalidad (Al-Ghazali, s. XI), que llega al mismo análisis sin contacto.
 * Y con otra lectura, el condicionamiento operante (Skinner), donde lo que se acumula no es una
 * creencia sino una conducta.
 *
 * Que las tres compartan mecánica hace visible, sin decirlo, que están mirando lo mismo.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Paleta, Visualizacion } from '../lenguaje';

export interface ProgramaSpec {
  nombre: string;
  /**
   * Cada cuántas acciones llega la recompensa. 1 es siempre; 4 es una de cada cuatro, puntual.
   * 0 significa impredecible: llega con la misma frecuencia media pero sin patrón que aprender.
   */
  cada: number;
  /** Lo que se lee cuando esta conducta es la única que sigue en pie tras la retirada. */
  nota: string;
}

export interface OpcionesRepeticion {
  corrienteId: string;
  /**
   * Qué se está mirando.
   *
   * `conexion` (por omisión) es el gesto original: dos sucesos contiguos y la búsqueda, infructuosa,
   * de un vínculo entre ellos. Sirve a Hume y a Al-Ghazali.
   *
   * `programas` sirve a una tesis distinta —que la recompensa impredecible produce la conducta más
   * difícil de apagar— y necesita tres agentes a la vez, porque la afirmación es comparativa. Con
   * uno solo no hay nada que comparar, y antes esta idea reutilizaba el par causa-efecto, donde no
   * había ni programas ni retirada: se limitaba a contar repeticiones.
   */
  modo?: 'conexion' | 'programas';
  /** Solo en `programas`: los tres regímenes, en el orden en que se muestran. */
  programas?: ProgramaSpec[];
  /** Solo en `programas`: botón que retira la recompensa a los tres a la vez. */
  retirar?: string;
  /** Solo en `programas`: rótulo del eje de conducta. */
  conducta?: string;
  /** Solo en `programas`: aviso de que ya se puede retirar la recompensa. */
  avisoRetirar?: string;
  /** Lo que el usuario provoca: «acercar el fuego al algodón». */
  accion: string;
  /** Lo que ocurre después, invariablemente. */
  consecuencia: string;
  /** Texto del botón que amplía el instante del contacto. */
  examinar: string;
  /** Lo que se encuentra al examinar: nada. */
  hallazgo: string;
  /** Rótulo del contador antes de la primera vez. */
  sinOcurrir: string;
  /** Contador con una sola ocurrencia. Recibe {veces} y {expectativa}. */
  recuentoUno: string;
  /** Contador a partir de dos. Recibe {veces} y {expectativa}. */
  recuentoVarios: string;
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

export function crearRepeticion(contenedor: HTMLElement, op: OpcionesRepeticion): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  // Los dos recorridos se separan aquí: comparten lenguaje gráfico, no estructura. Ver descomponer.ts.
  if (op.modo === 'programas') return crearProgramas(contenedor, op, paleta);

  let veces = 0;
  let ampliado = false;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  /*
   * Los dos sucesos, grandes y bien separados. Antes eran dos círculos de radio 20 a 180 px uno de
   * otro dentro de un hueco de 560: el dibujo ocupaba un tercio del marco, y el hueco entre ambos
   * —que es donde la pieza quiere que se mire, porque ahí no hay nada— apenas se notaba.
   */
  const yBase = 126;
  const X_CAUSA = 118;
  const X_EFECTO = 442;
  const causa = svg('circle', { cx: X_CAUSA, cy: yBase, r: 34, fill: 'none' });
  const efecto = svg('circle', { cx: X_EFECTO, cy: yBase, r: 34, fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'vector-effect': 'non-scaling-stroke' });
  marcarInteractivo(causa, paleta);
  causa.setAttribute('role', 'button');
  causa.setAttribute('aria-label', op.accion);

  // El espacio entre ambos: es lo que el usuario va a examinar y donde no hay nada.
  const hueco = svg('rect', { x: X_CAUSA + 46, y: yBase - 44, width: X_EFECTO - X_CAUSA - 92, height: 88, rx: 2, fill: 'none', stroke: paleta.neutro, 'stroke-dasharray': '3 5', opacity: 0.5, 'data-trazo': '' });

  const etCausa = svg('text', { x: X_CAUSA, y: yBase + 64, class: 'vis-etiqueta', 'text-anchor': 'middle', fill: paleta.neutro });
  etCausa.textContent = op.accion;
  const etEfecto = svg('text', { x: X_EFECTO, y: yBase + 64, class: 'vis-etiqueta', 'text-anchor': 'middle', fill: paleta.neutro });
  etEfecto.textContent = op.consecuencia;

  const contador = svg('text', { x: ANCHO / 2, y: 40, class: 'vis-titulo-svg', 'text-anchor': 'middle', fill: paleta.senal });
  /*
   * El texto del hueco se parte para caber DENTRO del hueco, que es de lo que trata la pieza: si se
   * sale por los lados deja de leerse como «esto es lo que hay ahí» y pasa a ser un rótulo suelto.
   */
  let enHueco: SVGTextElement | null = null;
  function ponerEnHueco(texto: string): void {
    // Se rehace en vez de reescribir `textContent`: el rótulo está partido en varias líneas, y
    // asignar texto directamente las borraría y devolvería una sola línea que se sale de la caja.
    enHueco?.remove();
    enHueco = texto
      ? rotulo(raiz, texto, {
        x: (X_CAUSA + X_EFECTO) / 2, y: yBase + 4, ancho: X_EFECTO - X_CAUSA - 108,
        color: paleta.senal, interlineado: 14, maxLineas: 3,
      })
      : null;
  }

  raiz.append(contador, hueco, causa, efecto, etCausa, etEfecto);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const bRepetir = document.createElement('button');
  bRepetir.type = 'button';
  bRepetir.textContent = op.accion;
  const bExaminar = document.createElement('button');
  bExaminar.type = 'button';
  bExaminar.textContent = op.examinar;
  controles.append(bRepetir, bExaminar);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    /*
     * El plural va en el contenido y no aquí: en español depende de «vez/veces» y en inglés de
     * «time/times», y una regla escrita en el código solo puede acertar en uno de los dos.
     */
     contador.textContent = veces === 0
      ? op.sinOcurrir
      : (veces === 1 ? op.recuentoUno : op.recuentoVarios)
        .replace('{veces}', String(veces))
        .replace('{expectativa}', String(Math.min(99, veces * 9)));
    causa.setAttribute('fill', veces > 0 ? paleta.acento : 'none');
    efecto.setAttribute('fill', veces > 0 ? paleta.acento : 'none');
    efecto.setAttribute('opacity', veces > 0 ? '1' : '0.35');

    hueco.setAttribute('stroke-width', String(ampliado ? TRAZO.enfasis : TRAZO.base));
    hueco.setAttribute('opacity', ampliado ? '1' : '0.5');
    ponerEnHueco(ampliado ? op.hallazgo : '');
    bExaminar.setAttribute('aria-pressed', String(ampliado));
    bExaminar.disabled = veces === 0;
  }

  function repetir(): void {
    veces++;
    ampliado = false;
    pintar();
    if (veces >= 6) resolver(contenedor, op.resolucion);
  }

  bRepetir.addEventListener('click', repetir);
  causa.addEventListener('click', repetir);
  causa.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); repetir(); }
  });
  bExaminar.addEventListener('click', () => {
    ampliado = !ampliado;
    pintar();
    if (ampliado) resolver(contenedor, op.hallazgo);
  });

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}

/**
 * Modo «programas»: tres regímenes de recompensa sobre la misma acción, y después la retirada.
 *
 * DE DÓNDE SALE LA RESISTENCIA, Y POR QUÉ NO ESTÁ PUESTA A MANO. Al retirar la recompensa, cada
 * conducta baja en proporción a lo mucho que su ausencia CONTRADICE lo aprendido. Con recompensa
 * constante, una sola vez sin premio es una anomalía flagrante y la conducta se desploma. Con una de
 * cada cuatro, un hueco es lo normal y apenas informa. Con recompensa impredecible, el hueco no se
 * distingue de una espera cualquiera, así que informa todavía menos.
 *
 * La caída es, por tanto, la probabilidad de premio que el programa había establecido multiplicada
 * por cuánto de detectable era esa probabilidad. No hay ninguna constante elegida para que gane el
 * impredecible: gana porque, en su caso, la ausencia de premio no es evidencia de nada.
 *
 * La pauta impredecible es una lista fija y no un generador aleatorio. La pieza tiene que dar lo
 * mismo cada vez que se abre, y una comprobación no puede afirmar nada sobre algo que cambia en
 * cada ejecución.
 */
function crearProgramas(contenedor: HTMLElement, op: OpcionesRepeticion, paleta: Paleta): Visualizacion {
  const programas = op.programas ?? [];
  let acciones = 0;
  let retirado = false;
  let resuelto = false;

  /** Huecos de la pauta impredecible, en acciones. Su media ronda la de «una de cada cuatro». */
  const IMPREDECIBLE = [1, 6, 2, 9, 3, 4, 7, 2, 5, 3, 8, 1, 4, 6, 2, 7];

  const estado = programas.map(() => ({ conducta: 0, desde: 0, indice: 0 }));

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const n = Math.max(1, programas.length);
  const margen = 84;
  const separacion = 26;
  const anchoP = (ANCHO - margen - 40 - separacion * (n - 1)) / n;
  const yBase = 184;
  const altoMax = 112;

  const columnas = programas.map((p, i) => {
    const x = margen + i * (anchoP + separacion);
    raiz.append(svg('line', {
      x1: x, y1: yBase, x2: x + anchoP, y2: yBase,
      stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    }));
    const barra = svg('rect', {
      x: x + anchoP * 0.2, y: yBase, width: anchoP * 0.6, height: 0, rx: 1,
      fill: paleta.acento, opacity: 0.8,
    });
    raiz.append(barra);
    rotulo(raiz, p.nombre, {
      x: x + anchoP / 2, y: yBase + 22, ancho: anchoP + 18,
      color: paleta.neutro, interlineado: 12, maxLineas: 2,
    });
    // El premio: un destello encima de la barra el instante en que llega la recompensa.
    const premio = svg('circle', { cx: x + anchoP / 2, cy: yBase - altoMax - 12, r: 5, fill: paleta.senal, opacity: 0 });
    raiz.append(premio);
    return { barra, premio };
  });

  rotulo(raiz, op.conducta ?? '', {
    x: 40, y: yBase - altoMax / 2, ancho: 76, color: paleta.neutro, interlineado: 12, maxLineas: 4,
  });

  const lectura = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 28, ancho: ANCHO - 80, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const bActuar = document.createElement('button');
  bActuar.type = 'button';
  bActuar.textContent = op.accion;
  bActuar.addEventListener('click', actuar);
  const bRetirar = document.createElement('button');
  bRetirar.type = 'button';
  bRetirar.textContent = op.retirar ?? '';
  bRetirar.disabled = true;
  bRetirar.addEventListener('click', () => {
    retirado = true;
    bRetirar.disabled = true;
    lectura.poner('');
    pintar();
  });
  controles.append(bActuar, bRetirar);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  /** Si a este programa le toca premiar en esta acción. */
  function toca(p: ProgramaSpec, e: { desde: number; indice: number }): boolean {
    if (retirado) return false;
    if (p.cada > 0) return e.desde + 1 >= p.cada;
    const espera = IMPREDECIBLE[e.indice % IMPREDECIBLE.length] ?? 4;
    if (e.desde + 1 >= espera) {
      e.indice += 1;
      return true;
    }
    return false;
  }

  function actuar(): void {
    acciones += 1;
    programas.forEach((p, i) => {
      const e = estado[i];
      if (!e) return;
      const premia = toca(p, e);
      if (premia) {
        e.desde = 0;
        e.conducta = Math.min(1, e.conducta + 0.16);
      } else {
        e.desde += 1;
        if (retirado) {
          /*
           * La caída es PROPORCIONAL a lo que queda, no una resta fija. Con una resta, las tres
           * conductas llegaban a cero y la ventana en la que solo una seguía en pie duraba dos
           * pulsaciones: era fácil pasársela sin verla, que es justo lo que hay que ver. Decayendo
           * en proporción, la resistente se acerca a cero sin llegar y la comparación se sostiene.
           */
          const probabilidad = p.cada > 0 ? 1 / p.cada : 1 / 4;
          const detectable = p.cada > 0 ? 1 : 0.45;
          e.conducta *= 1 - 0.34 * probabilidad * detectable;
        }
      }
      columnas[i]?.premio.setAttribute('opacity', premia ? '1' : '0');
    });
    /*
     * Ocho acciones bastan para que las tres conductas se afiancen y se vean distintas —medido:
     * 112, 54 y 54 px de barra—, y desde ahí la conclusión llega en seis pulsaciones más. Con el
     * umbral en doce eran diecinueve pulsaciones hasta el final, que es más paciencia de la que se
     * le puede pedir a nadie para una idea del recorrido.
     */
    if (!retirado && acciones >= 8) {
      bRetirar.disabled = false;
      lectura.poner(op.avisoRetirar ?? '');
    }
    pintar();
  }

  function pintar(): void {
    programas.forEach((_, i) => {
      const e = estado[i];
      const c = columnas[i];
      if (!e || !c) return;
      const h = altoMax * e.conducta;
      c.barra.setAttribute('y', String(yBase - h));
      c.barra.setAttribute('height', String(h));
      // La que resiste se marca con la señal: es la que hay que mirar cuando las otras caen.
      c.barra.setAttribute('fill', retirado && e.conducta > 0.3 ? paleta.senal : paleta.acento);
    });

    if (!retirado) return;
    const vivas = estado.filter((e) => e.conducta > 0.3);
    /*
     * Se resuelve cuando queda una sola en pie, y NO se retira después. La conclusión sigue siendo
     * cierta aunque se siga pulsando y la última acabe también bajando: lo que se demostró es el
     * orden en que se apagaron, no el valor de este instante.
     */
    if (!resuelto && vivas.length === 1 && vivas[0]) {
      resuelto = true;
      const i = estado.indexOf(vivas[0]);
      lectura.poner(programas[i]?.nota ?? '');
      resolver(contenedor, op.resolucion);
    }
  }

  pintar();
  entrada(raiz);

  return { destruir: () => contenedor.replaceChildren() };
}
