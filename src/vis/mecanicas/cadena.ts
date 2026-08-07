/**
 * Mecánica «cadena»: una secuencia cuyos elementos son insignificantes por separado y cuyo conjunto
 * solo aparece al cambiar de escala. Se recorre paso a paso, y después se mira entera.
 *
 * Reúne tres ideas que no suelen ponerse juntas y que comparten exactamente esa estructura:
 *  - La banalidad del mal (Arendt): sellar, transportar, archivar. Cada tarea es trivial y el
 *    resultado global queda fuera de cuadro por diseño.
 *  - Ren y li (Confucio): cada gesto de cortesía no significa nada; repetidos, modelan el carácter.
 *  - El tiempo existe en el alma (Agustín): cada nota carece de duración; la melodía solo existe
 *    sostenida a la vez en memoria, atención y expectativa.
 *
 * El orden importa: **primero se recorre, después se ve el conjunto.** Enseñar el conjunto de
 * entrada destruiría el hallazgo, que consiste precisamente en no haberlo visto mientras se hacía.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface PasoSpec {
  nombre: string;
  /** Cómo se ve el paso cuando se mira solo. */
  aislado: string;
}

export interface OpcionesCadena {
  corrienteId: string;
  pasos: PasoSpec[];
  /** Texto del botón que cambia de escala. */
  verConjunto: string;
  /** Qué aparece al mirarlo entero. */
  conjunto: string;
  /** Rótulo del botón que avanza un eslabón. */
  siguiente: string;
  /** Rótulo mientras faltan pasos por recorrer. Recibe {n}. */
  verConjuntoBloqueado: string;
  /**
   * Un medidor que ACUMULA con la práctica y REVIERTE al dejarla.
   *
   * La cadena, tal cual, enseña que el conjunto solo se ve al cambiar de escala. A `ren-y-li` le
   * hace falta además lo que la cadena no dice: que lo que se gana repitiendo gestos no se queda
   * ganado. Sin la caída, la pieza afirmaría que basta con practicar una temporada, que es lo
   * contrario de la idea; y con una caída provocada por un botón, afirmaría que hace falta un acto
   * de abandono. Lo que revierte la acumulación es simplemente que pase el tiempo sin practicar.
   */
  caracter?: {
    rotulo: string;
    /** Lo que se lee al llegar arriba. */
    avisoAlto: string;
    /** Lo que se lee cuando ha caído tras haber estado arriba. */
    avisoCaido: string;
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

export function crearCadena(contenedor: HTMLElement, op: OpcionesCadena): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  let paso = 0;
  let ampliado = false;
  const recorridos = new Set<number>([0]);

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  const n = op.pasos.length;
  /*
   * Eslabones grandes y repartidos por todo el ancho. Con el tope de 96 y el margen de 40, la cadena
   * ocupaba una banda estrecha en mitad del hueco: se veía como un pie de página de sí misma.
   */
  const y = 116;
  const MARGEN = 30;
  const HUECO = 12;
  // Con medidor, la cadena cede la franja derecha. Sin él, el reparto es el de siempre.
  const RESERVADO = op.caracter ? 76 : 0;
  const anchoEslabon = (ANCHO - MARGEN * 2 - RESERVADO - HUECO * (n - 1)) / n;
  const separacion = HUECO;

  const eslabones = op.pasos.map((p, i) => {
    const x = MARGEN + i * (anchoEslabon + separacion);
    const g = svg('g');
    const caja = svg('rect', {
      x, y: y - 54, width: anchoEslabon, height: 104, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    });
    g.append(caja);
    rotulo(g, p.nombre, {
      x: x + anchoEslabon / 2, y: y + 4, ancho: anchoEslabon - 12,
      color: paleta.neutro, interlineado: 12, maxLineas: 3,
    });
    return { g, caja, i };
  });

  // El conjunto: solo aparece al cambiar de escala, y por eso empieza invisible.
  const envolvente = svg('rect', {
    x: MARGEN - 16, y: y - 74, width: ANCHO - (MARGEN - 16) * 2 - RESERVADO, height: 144, rx: 4,
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
    'vector-effect': 'non-scaling-stroke', opacity: 0,
  });
  /*
   * Los textos centrados se centran sobre LA CADENA, no sobre el marco, y solo son tan anchos como
   * ella. Con medidor eso son 76 píxeles menos y 38 más a la izquierda.
   *
   * La franja derecha ya estaba cedida para el medidor, pero solo la habían cedido los eslabones: el
   * detalle del paso seguía midiendo 500 y arrancando en el centro del marco, así que se metía debajo
   * del rótulo del medidor. En «Ren y li» «das los buenos días a alguien con quien no te apetece
   * hablar» se comía la esquina de «carácter», que es el marcador que la pieza pide vigilar mientras
   * se practica.
   */
  const centroCadena = (ANCHO - RESERVADO) / 2;

  const textoConjunto = rotuloMutable(raiz, {
    x: centroCadena, y: y + 88, ancho: ANCHO - 80 - RESERVADO, color: paleta.senal, interlineado: 13, maxLineas: 2,
  });

  /*
   * El detalle del paso en curso. Cambia con cada eslabón y son frases del contenido: «Das los
   * buenos días a alguien con quien no te apetece hablar» no cabe en una línea de 560.
   */
  const detalle = rotuloMutable(raiz, {
    x: centroCadena, y: 26, ancho: ANCHO - 60 - RESERVADO, color: paleta.neutro, interlineado: 13, maxLineas: 2,
  });

  raiz.append(envolvente, ...eslabones.map((e) => e.g));
  marcarInteractivo(eslabones[0]!.caja, paleta);
  eslabones[0]!.caja.setAttribute('stroke-dasharray', '');

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const siguiente = document.createElement('button');
  siguiente.type = 'button';
  siguiente.textContent = op.siguiente;
  const conjunto = document.createElement('button');
  conjunto.type = 'button';
  conjunto.textContent = op.verConjunto;
  controles.append(siguiente, conjunto);

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  function pintar(): void {
    eslabones.forEach((e) => {
      const actual = e.i === paso;
      const visto = recorridos.has(e.i);
      // Mientras se recorre, solo se ve el eslabón actual: el resto queda fuera de atención.
      const visible = ampliado || actual || visto;
      e.g.setAttribute('opacity', ampliado ? '1' : visible ? (actual ? '1' : '0.28') : '0.08');
      e.caja.setAttribute('stroke', actual && !ampliado ? paleta.acento : paleta.neutro);
      e.caja.setAttribute('stroke-width', String(actual && !ampliado ? TRAZO.enfasis : TRAZO.base));
    });

    detalle.poner(ampliado ? '' : op.pasos[paso]!.aislado);
    envolvente.setAttribute('opacity', ampliado ? '1' : '0');
    // El texto del conjunto solo existe cuando se ve el conjunto: aparece y desaparece con él.
    textoConjunto.poner(ampliado ? op.conjunto : '');

    /*
     * Con medidor de carácter el gesto se puede repetir sin fin, dando la vuelta a la cadena. Sin
     * esto el botón se apagaba en el último paso y el medidor no pasaba de 0,6: la pieza pedía
     * práctica repetida y a la vez impedía repetir. Sin medidor se conserva el tope de siempre.
     */
    siguiente.disabled = ampliado || (!op.caracter && paso >= n - 1);
    conjunto.disabled = recorridos.size < n;
    conjunto.textContent = recorridos.size < n
      ? op.verConjuntoBloqueado.replace('{n}', String(n))
      : op.verConjunto;

    if (ampliado) resolver(contenedor, op.resolucion);
    else resolver(contenedor, op.pasos[paso]!.aislado);
  }

  /*
   * El medidor de carácter, solo si la ficha lo pide.
   *
   * Sube un escalón con cada gesto y baja SOLO por el paso del tiempo, sin que nadie lo pida. Que la
   * caída no tenga botón es la mitad de la afirmación: la disposición no se pierde por un acto de
   * abandono sino por dejar de hacer. Y practicar de nuevo la recupera, así que el usuario puede
   * comprobar el ciclo entero sin que la pieza se lo cuente.
   */
  let bucle = 0;
  if (op.caracter) {
    const MED = { x: ANCHO - 46, y: y - 60, ancho: 24, alto: 148 };
    let nivel = 0;
    let ultimoGesto = 0;
    let llegoArriba = false;

    raiz.append(svg('rect', {
      x: MED.x, y: MED.y, width: MED.ancho, height: MED.alto, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
    }));
    const relleno = svg('rect', { x: MED.x, y: MED.y + MED.alto, width: MED.ancho, height: 0, fill: paleta.acento, opacity: 0.85 });
    raiz.append(relleno);
    rotulo(raiz, op.caracter.rotulo, {
      x: ANCHO - 12, y: MED.y - 14, ancho: 150, color: paleta.neutro,
      ancla: 'end', interlineado: 12, maxLineas: 2,
    });
    const aviso = rotuloMutable(raiz, {
      x: ANCHO - 12, y: MED.y + MED.alto + 20, ancho: 190, color: paleta.senal,
      ancla: 'end', interlineado: 12, maxLineas: 2,
    });

    const marco = (t: number): void => {
      // Nada durante el primer segundo y medio tras un gesto: practicar seguido tiene que sumar.
      const inactivo = t - ultimoGesto > 1500;
      if (inactivo) nivel = Math.max(0, nivel - 0.0022);
      if (nivel > 0.92) llegoArriba = true;
      const h = MED.alto * nivel;
      relleno.setAttribute('y', String(MED.y + MED.alto - h));
      relleno.setAttribute('height', String(h));
      relleno.setAttribute('fill', nivel > 0.92 ? paleta.senal : paleta.acento);
      if (nivel > 0.92) aviso.poner(op.caracter!.avisoAlto);
      else if (llegoArriba && nivel < 0.3) aviso.poner(op.caracter!.avisoCaido);
      bucle = requestAnimationFrame(marco);
    };
    bucle = requestAnimationFrame(marco);

    siguiente.addEventListener('click', () => {
      ultimoGesto = performance.now();
      nivel = Math.min(1, nivel + 0.2);
    });
  }

  siguiente.addEventListener('click', () => {
    paso = op.caracter ? (paso + 1) % n : Math.min(n - 1, paso + 1);
    recorridos.add(paso);
    pintar();
  });
  conjunto.addEventListener('click', () => { ampliado = !ampliado; pintar(); });

  pintar();
  entrada(raiz);

  return {
    destruir: () => {
      cancelAnimationFrame(bucle);
      contenedor.replaceChildren();
    },
  };
}
