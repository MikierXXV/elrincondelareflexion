/**
 * Mecánica «tres regiones»: medir una duración fuera y no poder, y volver a medirla dentro.
 *
 * La pieza tiene dos tiempos y el primero tiene que fallar. Se ofrece una línea temporal externa y
 * se invita a señalar el instante presente; cada intento devuelve una anchura de cero, porque un
 * instante sin duración no se deja acotar. Solo después de fallar se abren las tres regiones —lo
 * retenido, lo atendido, lo esperado— y ahí la misma duración sí tiene medida.
 *
 * Que el primer tramo sea infructuoso es la mecánica, no un tropiezo de diseño: la idea sostiene que
 * la duración no está en el mundo, y una pieza donde señalar el presente funcionase la desmentiría.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotulo, rotuloMutable, svg, TRAZO,
} from '../lenguaje';
import type { Visualizacion } from '../lenguaje';

export interface RegionSpec {
  nombre: string;
  /** Qué mide esta región. Se muestra al llenarse. */
  descripcion: string;
}

export interface OpcionesTresRegiones {
  corrienteId: string;
  /** Lo que transcurre y hay que medir: una melodía, una sílaba, un recorrido. */
  sucesion: string;
  /** El botón del primer tramo, el que no puede funcionar. */
  intentar: string;
  /** Lo que se responde en cada intento fallido, en orden. Su número fija cuántos intentos hay. */
  fracasos: string[];
  /** Las tres regiones de la mente, en orden: lo retenido, lo atendido, lo esperado. */
  regiones: [RegionSpec, RegionSpec, RegionSpec];
  /** El botón del segundo tramo, el que sí mide. */
  medir: string;
  /** Rótulo de la medida obtenida dentro. */
  medida: string;
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

export function crearTresRegiones(contenedor: HTMLElement, op: OpcionesTresRegiones): Visualizacion {
  const paleta = paletaDe(op.corrienteId);
  let intentos = 0;
  let dentro = false;
  let avance = 0;
  let animando = 0;

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': op.etiqueta,
  }) as SVGSVGElement;

  // ---- Arriba: la línea temporal externa ----------------------------------------------------
  const yLinea = 62;
  const xIni = 60;
  const xFin = ANCHO - 60;

  raiz.append(svg('line', {
    x1: xIni, y1: yLinea, x2: xFin, y2: yLinea,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base,
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  }));
  rotulo(raiz, op.sucesion, { x: ANCHO / 2, y: 30, ancho: ANCHO - 120, color: paleta.neutro, maxLineas: 1 });

  // Las marcas de la sucesión: lo que va pasando por la línea de fuera.
  const marcas = Array.from({ length: 7 }, (_, i) => {
    const x = xIni + ((xFin - xIni) * (i + 0.5)) / 7;
    return svg('line', {
      x1: x, y1: yLinea - 9, x2: x, y2: yLinea + 9,
      stroke: paleta.neutro, 'stroke-width': TRAZO.fino, opacity: 0.5,
      'vector-effect': 'non-scaling-stroke',
    });
  });
  raiz.append(...marcas);

  /*
   * El corchete del «ahora». Se dibuja con una anchura que se va a cero: no es una animación
   * decorativa, es el resultado de la medida. Lo que el usuario ve es su propia acotación
   * colapsando, que dice más que cualquier rótulo que lo explique.
   */
  const corchete = svg('path', {
    fill: 'none', stroke: paleta.senal, 'stroke-width': TRAZO.enfasis,
    'vector-effect': 'non-scaling-stroke', opacity: 0,
  });
  raiz.append(corchete);
  const anchoCorchete = (w: number): string => {
    const c = (xIni + xFin) / 2;
    return `M${c - w} ${yLinea - 20}L${c - w} ${yLinea + 20}M${c + w} ${yLinea - 20}L${c + w} ${yLinea + 20}`;
  };

  const veredicto = rotuloMutable(raiz, {
    x: ANCHO / 2, y: yLinea + 44, ancho: ANCHO - 90, color: paleta.senal, interlineado: 14, maxLineas: 2,
  });

  // ---- Abajo: las tres regiones de la mente -------------------------------------------------
  const yReg = 150;
  const altoReg = 56;
  const huecoReg = 14;
  const anchoReg = (ANCHO - 120 - huecoReg * 2) / 3;

  const regiones = op.regiones.map((r, i) => {
    const x = 60 + i * (anchoReg + huecoReg);
    const g = svg('g', { opacity: 0 });
    const caja = svg('rect', {
      x, y: yReg, width: anchoReg, height: altoReg, rx: 2,
      fill: 'none', stroke: paleta.neutro, 'stroke-width': TRAZO.base,
      'vector-effect': 'non-scaling-stroke',
    });
    // El relleno se recorta con la propia caja para que nunca se salga de su región.
    const relleno = svg('rect', { x, y: yReg + altoReg, width: anchoReg, height: 0, fill: paleta.acento, opacity: 0.28 });
    g.append(relleno, caja);
    rotulo(g, r.nombre, { x: x + anchoReg / 2, y: yReg - 10, ancho: anchoReg + 8, color: paleta.neutro, maxLineas: 1 });
    raiz.append(g);
    return { g, relleno, spec: r };
  });

  // Dos líneas, no una: la frase de cierre es del contenido y en una sola se salía 49 px por cada lado.
  const lectura = rotuloMutable(raiz, {
    x: ANCHO / 2, y: ALTO - 18, ancho: ANCHO - 40, color: paleta.acento, interlineado: 13, maxLineas: 2,
  });

  // ---- Controles ----------------------------------------------------------------------------
  const controles = document.createElement('div');
  controles.className = 'vis-controles';

  const bIntentar = document.createElement('button');
  bIntentar.type = 'button';
  bIntentar.textContent = op.intentar;
  bIntentar.addEventListener('click', () => {
    if (dentro) return;
    const texto = op.fracasos[Math.min(intentos, op.fracasos.length - 1)] ?? '';
    intentos += 1;
    colapsar();
    veredicto.poner(texto);
    resolver(contenedor, texto);
    if (intentos >= op.fracasos.length) abrirRegiones();
  });
  controles.append(bIntentar);

  const bMedir = document.createElement('button');
  bMedir.type = 'button';
  bMedir.textContent = op.medir;
  bMedir.disabled = true;
  bMedir.addEventListener('click', () => { avance = 0; correr(); });
  controles.append(bMedir);

  marcarInteractivo(corchete, paleta);
  corchete.setAttribute('stroke-dasharray', '');

  contenedor.append(raiz, controles);
  alternativaTextual(contenedor, op.alternativaTexto);

  /** El corchete se abre y se cierra sobre sí mismo: la acotación que no acota nada. */
  function colapsar(): void {
    cancelAnimationFrame(animando);
    const t0 = performance.now();
    corchete.setAttribute('opacity', '1');
    const paso = (t: number): void => {
      const k = Math.min(1, (t - t0) / 700);
      corchete.setAttribute('d', anchoCorchete(46 * (1 - k) ** 2));
      if (k < 1) animando = requestAnimationFrame(paso);
      else corchete.setAttribute('opacity', '0.35');
    };
    animando = requestAnimationFrame(paso);
  }

  function abrirRegiones(): void {
    dentro = true;
    bIntentar.disabled = true;
    bMedir.disabled = false;
    regiones.forEach((r, i) => {
      r.g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: i * 120, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' });
    });
  }

  /*
   * La sucesión corre una vez y las tres regiones se reparten lo mismo que está pasando: lo que ya
   * pasó se acumula a la izquierda, lo que queda por pasar se vacía a la derecha, y la atención en
   * medio se mantiene estrecha. La suma de las tres es la duración, y es la única que existe.
   */
  function correr(): void {
    cancelAnimationFrame(animando);
    const t0 = performance.now();
    const paso = (t: number): void => {
      avance = Math.min(1, (t - t0) / 2600);
      const valores = [avance, avance < 1 ? 0.34 : 0, 1 - avance];
      regiones.forEach((r, i) => {
        const v = valores[i] ?? 0;
        const h = altoReg * v;
        r.relleno.setAttribute('y', String(yReg + altoReg - h));
        r.relleno.setAttribute('height', String(h));
      });
      const activa = avance >= 1 ? 0 : avance > 0.02 ? 1 : 2;
      lectura.poner(regiones[activa]?.spec.descripcion ?? '');
      if (avance < 1) animando = requestAnimationFrame(paso);
      else {
        lectura.poner(op.medida);
        resolver(contenedor, op.resolucion);
      }
    };
    animando = requestAnimationFrame(paso);
  }

  corchete.setAttribute('d', anchoCorchete(46));
  entrada(raiz);

  return {
    destruir: () => {
      cancelAnimationFrame(animando);
      contenedor.replaceChildren();
    },
  };
}
