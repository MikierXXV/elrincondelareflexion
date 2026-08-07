/**
 * Prototipo de referencia 1 — SVG interactivo.
 * Idea: "El término medio" (Aristóteles, corriente clasica-griega).
 *
 * Pone a prueba: manipulación directa sobre un eje y estado de resolución.
 * La tesis que debe quedar clara al usarlo es que el punto virtuoso NO está fijo en el centro:
 * se desplaza con la situación, y por eso no puede aprenderse como una regla.
 */

import {
  alternativaTextual, entrada, marcarInteractivo, paletaDe, resolver, rotuloMutable, svg, TRAZO,
  arrastreHorizontal,
} from './lenguaje';
import type { Visualizacion } from './lenguaje';

interface Situacion {
  nombre: string;
  /** Posición del medio virtuoso en el eje, de 0 (defecto) a 1 (exceso). */
  medio: number;
  extremoBajo: string;
  extremoAlto: string;
  acierto: string;
}

/** Rótulos y situaciones, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosMedio {
  etiqueta: string;
  etiquetaMarcador: string;
  resolucionFinal: string;
  alternativaTexto: string;
  situaciones: Situacion[];
}

// Hueco común a las 59 piezas: --vis-proporcion, 7/3. No lo elige cada visualización.
const ANCHO = 560;
const ALTO = 240;
/*
 * El eje baja y se ensancha. Con el eje en el centro y márgenes de 64, la pieza ocupaba la mitad
 * del hueco y las dos franjas de arriba y abajo quedaban vacías: se leía como un diagrama pequeño
 * dentro de una lámina grande, cuando es el contenido entero.
 */
const EJE_Y = 152;
const MARGEN = 40;

export function crearTerminoMedio(contenedor: HTMLElement, t: TextosMedio): Visualizacion {
  const SITUACIONES = t.situaciones;
  const paleta = paletaDe('clasica-griega');
  let iSituacion = 0;
  let posicion = 0.5;
  const aciertos = new Set<number>();

  const raiz = svg('svg', {
    viewBox: `0 0 ${ANCHO} ${ALTO}`,
    class: 'vis-svg',
    role: 'group',
    'aria-label': t.etiqueta,
  }) as SVGSVGElement;

  const eje = svg('line', {
    x1: MARGEN, y1: EJE_Y, x2: ANCHO - MARGEN, y2: EJE_Y,
    stroke: paleta.neutro, 'stroke-width': TRAZO.base, 'stroke-linecap': 'round',
    'vector-effect': 'non-scaling-stroke', 'data-trazo': '',
  });

  // La zona de acierto se estrecha con la práctica: el juicio se afina, no se memoriza.
  const zona = svg('rect', { y: EJE_Y - 26, height: 52, rx: 2, fill: paleta.acento, opacity: 0.22 });

  const etiquetaBaja = rotuloMutable(raiz, {
    x: MARGEN - 6, y: EJE_Y + 44, ancho: 170, color: paleta.neutro, ancla: 'start', interlineado: 12,
  });
  const etiquetaAlta = rotuloMutable(raiz, {
    x: ANCHO - MARGEN + 6, y: EJE_Y + 44, ancho: 170, color: paleta.neutro, ancla: 'end', interlineado: 12,
  });
  const titulo = rotuloMutable(raiz, {
    x: ANCHO / 2, y: 44, ancho: ANCHO - 60, color: paleta.senal,
    clase: 'vis-titulo-svg', interlineado: 22, maxLineas: 2,
  });

  const marcador = svg('circle', { cy: EJE_Y, r: 17, fill: 'none' });
  marcador.setAttribute('role', 'slider');
  marcador.setAttribute('aria-label', t.etiquetaMarcador);
  marcador.setAttribute('aria-valuemin', '0');
  marcador.setAttribute('aria-valuemax', '100');
  marcarInteractivo(marcador, paleta, 'arrastre');

  // Los rótulos mutables se insertan solos al ponerles texto; aquí solo va lo fijo.
  raiz.append(zona, eje, marcador);

  const selector = document.createElement('div');
  selector.className = 'vis-controles';
  const botones = SITUACIONES.map((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = s.nombre;
    b.addEventListener('click', () => cambiarSituacion(i));
    selector.append(b);
    return b;
  });

  contenedor.append(raiz, selector);
  alternativaTextual(contenedor, t.alternativaTexto);

  const aX = (t: number) => MARGEN + t * (ANCHO - MARGEN * 2);
  const desdeX = (x: number) => Math.min(1, Math.max(0, (x - MARGEN) / (ANCHO - MARGEN * 2)));

  function anchoZona(): number {
    // Empieza ancha y se estrecha conforme el usuario acierta en más situaciones.
    return 0.20 - aciertos.size * 0.045;
  }

  function pintar(): void {
    const s = SITUACIONES[iSituacion]!;
    const semi = anchoZona() / 2;
    titulo.poner(s.nombre);
    etiquetaBaja.poner(s.extremoBajo);
    etiquetaAlta.poner(s.extremoAlto);
    zona.setAttribute('x', String(aX(Math.max(0, s.medio - semi))));
    zona.setAttribute('width', String(aX(Math.min(1, s.medio + semi)) - aX(Math.max(0, s.medio - semi))));
    marcador.setAttribute('cx', String(aX(posicion)));
    marcador.setAttribute('aria-valuenow', String(Math.round(posicion * 100)));

    const dentro = Math.abs(posicion - s.medio) <= semi;
    marcador.setAttribute('fill', dentro ? paleta.acento : 'none');
    marcador.setAttribute('stroke-width', String(dentro ? TRAZO.enfasis : TRAZO.base));

    if (dentro) {
      aciertos.add(iSituacion);
      resolver(contenedor, aciertos.size >= SITUACIONES.length
        ? t.resolucionFinal
        : s.acierto);
    }
    botones.forEach((b, i) => b.setAttribute('aria-pressed', String(i === iSituacion)));
  }

  function cambiarSituacion(i: number): void {
    iSituacion = i;
    pintar();
  }

  function desdeEvento(e: PointerEvent): void {
    const caja = raiz.getBoundingClientRect();
    posicion = desdeX(((e.clientX - caja.left) / caja.width) * ANCHO);
    pintar();
  }

  let arrastrando = false;
  // El arrastre se escucha en window, no en el marcador: con captura de puntero sobre un nodo SVG
  // el seguimiento se pierde en cuanto el cursor sale del círculo, y arrastrar deja de funcionar
  // justo cuando el usuario va deprisa. Detectado en la revisión visual con Playwright.
  const alBajar = (e: PointerEvent) => { arrastrando = true; e.preventDefault(); desdeEvento(e); };
  const alMover = (e: PointerEvent) => { if (arrastrando) desdeEvento(e); };
  const alSoltar = () => { arrastrando = false; };
  const alTeclado = (e: KeyboardEvent) => {
    const paso = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowLeft') posicion = Math.max(0, posicion - paso);
    else if (e.key === 'ArrowRight') posicion = Math.min(1, posicion + paso);
    else return;
    e.preventDefault();
    pintar();
  };

  marcador.addEventListener('pointerdown', alBajar);
  window.addEventListener('pointermove', alMover);
  window.addEventListener('pointerup', alSoltar);
  // Ver el arco de `pointercancel` en la mecanica «eje»: sin el, un gesto que el navegador se lleva
  // deja el marcador agarrado para siempre.
  window.addEventListener('pointercancel', alSoltar);
  arrastreHorizontal(raiz);
  marcador.addEventListener('keydown', alTeclado);
  // Pulsar directamente sobre el eje también mueve el marcador: obligar a acertar en un círculo de
  // 13 px es una barrera innecesaria, sobre todo con el dedo.
  raiz.addEventListener('pointerdown', (e) => { if (e.target !== marcador) { arrastrando = true; desdeEvento(e); } });

  pintar();
  entrada(raiz);

  return {
    destruir(): void {
      marcador.removeEventListener('pointerdown', alBajar);
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerup', alSoltar);
      window.removeEventListener('pointercancel', alSoltar);
      marcador.removeEventListener('keydown', alTeclado);
      contenedor.replaceChildren();
    },
  };
}
