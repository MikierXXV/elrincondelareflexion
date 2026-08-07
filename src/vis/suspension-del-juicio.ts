/**
 * Prototipo de referencia 2 — canvas con física.
 * Idea: "La suspensión del juicio" (Pirrón, corriente helenismo).
 *
 * Pone a prueba: que una simulación se sienta del mismo sistema que un SVG, con el mismo trazo,
 * la misma paleta de tres roles y el mismo estado de resolución.
 *
 * Por qué física y no animación guionizada: la tesis es que el equilibrio SE PRODUCE, no que se
 * dibuje. Cada argumento arrastra su contrapeso y la balanza vuelve sola; el temblor de la aguja
 * solo se amortigua cuando el usuario deja de intentar inclinarla. Una animación con fotogramas
 * fijos afirmaría eso; la simulación lo demuestra.
 */

import { alternativaTextual, movimientoReducido, paletaDe, resolver, TRAZO } from './lenguaje';
import type { Visualizacion } from './lenguaje';

interface Peso { lado: -1 | 1; masa: number; edad: number }

// Hueco común a las 59 piezas: --vis-proporcion, 7/3. No lo elige cada visualización.
const ANCHO = 560;
const ALTO = 240;
const PIVOTE = { x: ANCHO / 2, y: 140 };
const BRAZO = 190;

/**
 * Péndulo de torsión con amortiguamiento: theta'' = -k·theta - c·theta' + torque.
 *
 * El amortiguamiento se subió de 1.35 a 2.6 tras la revisión visual: con 1.35 la relación de
 * amortiguamiento era 0.30 y la balanza tardaba casi cinco segundos en bajar del umbral de calma.
 * La pieza afirma que "se detiene sola cuando dejas de empujar", y si tarda tanto el usuario no
 * llega a verlo. Ahora la relación es 0.57 y se asienta en algo menos de dos segundos: oscila lo
 * suficiente para que se lea la inercia, y reposa lo bastante pronto para que se lea la conclusión.
 */
const RIGIDEZ = 5.2;
const AMORTIGUAMIENTO = 2.6;
const CALMA = 0.02; // umbral de reposo

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosBalanza {
  etiqueta: string;
  aFavor: string;
  enContra: string;
  resolucion: string;
  resolucionEstatica: string;
  alternativaTexto: string;
}

export function crearSuspensionDelJuicio(contenedor: HTMLElement, t: TextosBalanza): Visualizacion {
  const paleta = paletaDe('helenismo');
  const lienzo = document.createElement('canvas');
  lienzo.className = 'vis-canvas';
  lienzo.setAttribute('role', 'img');
  lienzo.setAttribute('aria-label', t.etiqueta);
  const ctx = lienzo.getContext('2d')!;

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const bIzq = document.createElement('button');
  bIzq.type = 'button';
  bIzq.textContent = t.aFavor;
  const bDer = document.createElement('button');
  bDer.type = 'button';
  bDer.textContent = t.enContra;
  controles.append(bIzq, bDer);

  contenedor.append(lienzo, controles);
  alternativaTextual(contenedor, t.alternativaTexto);

  let theta = 0;
  let omega = 0;
  const pesos: Peso[] = [];
  let ultimoEmpujon = performance.now();
  let animacion = 0;
  let resuelto = false;

  function redimensionar(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const caja = lienzo.getBoundingClientRect();
    lienzo.width = Math.round(caja.width * dpr);
    lienzo.height = Math.round((caja.width * ALTO / ANCHO) * dpr);
    ctx.setTransform(dpr * (caja.width / ANCHO), 0, 0, dpr * (caja.width / ANCHO), 0, 0);
  }

  function anadir(lado: -1 | 1): void {
    // El contrapeso es la tesis: para todo argumento hay otro de fuerza comparable.
    pesos.push({ lado, masa: 1, edad: 0 });
    pesos.push({ lado: (lado * -1) as -1 | 1, masa: 1, edad: -0.35 });
    omega += lado * 1.6;
    ultimoEmpujon = performance.now();
    resuelto = false;
  }

  function paso(dt: number): void {
    let torque = 0;
    for (const p of pesos) {
      p.edad = Math.min(1, p.edad + dt * 2.2);
      if (p.edad > 0) torque += p.lado * p.masa * p.edad * 0.9;
    }
    const alfa = -RIGIDEZ * theta - AMORTIGUAMIENTO * omega + torque;
    omega += alfa * dt;
    theta += omega * dt;
    theta = Math.max(-0.42, Math.min(0.42, theta));
  }

  function dibujar(): void {
    ctx.clearRect(0, 0, ANCHO, ALTO);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Soporte — neutro, lo que no está en juego.
    ctx.strokeStyle = paleta.neutro;
    ctx.lineWidth = TRAZO.base;
    ctx.beginPath();
    ctx.moveTo(PIVOTE.x, PIVOTE.y);
    ctx.lineTo(PIVOTE.x - 34, ALTO - 40);
    ctx.moveTo(PIVOTE.x, PIVOTE.y);
    ctx.lineTo(PIVOTE.x + 34, ALTO - 40);
    ctx.moveTo(PIVOTE.x - 54, ALTO - 40);
    ctx.lineTo(PIVOTE.x + 54, ALTO - 40);
    ctx.stroke();

    // Referencia de la horizontal, para que el equilibrio sea comprobable y no una impresión.
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(PIVOTE.x - BRAZO, PIVOTE.y);
    ctx.lineTo(PIVOTE.x + BRAZO, PIVOTE.y);
    ctx.stroke();
    ctx.restore();

    // Brazo — acento, es lo que responde al usuario.
    const dx = Math.cos(theta) * BRAZO;
    const dy = Math.sin(theta) * BRAZO;
    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = TRAZO.enfasis;
    ctx.beginPath();
    ctx.moveTo(PIVOTE.x - dx, PIVOTE.y - dy);
    ctx.lineTo(PIVOTE.x + dx, PIVOTE.y + dy);
    ctx.stroke();

    for (const lado of [-1, 1] as const) {
      const n = pesos.filter((p) => p.lado === lado && p.edad > 0).length;
      const px = PIVOTE.x + lado * dx;
      const py = PIVOTE.y + lado * dy;
      ctx.fillStyle = paleta.acento;
      for (let i = 0; i < n; i++) {
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(px, py + 16 + i * 11, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Aguja — señal semántica: informa del estado, no se manipula.
    const quieta = Math.abs(omega) < CALMA && Math.abs(theta) < CALMA;
    ctx.strokeStyle = paleta.senal;
    ctx.lineWidth = TRAZO.base;
    ctx.globalAlpha = quieta ? 1 : 0.55;
    ctx.beginPath();
    ctx.moveTo(PIVOTE.x, PIVOTE.y);
    ctx.lineTo(PIVOTE.x + Math.sin(theta) * 40, PIVOTE.y - Math.cos(theta) * 40);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function bucle(): void {
    paso(1 / 60);
    dibujar();

    const quieta = Math.abs(omega) < CALMA && Math.abs(theta) < CALMA;
    const sinTocar = performance.now() - ultimoEmpujon > 2600;
    if (quieta && sinTocar && pesos.length > 0 && !resuelto) {
      resuelto = true;
      resolver(contenedor, t.resolucion);
    }
    animacion = requestAnimationFrame(bucle);
  }

  bIzq.addEventListener('click', () => anadir(-1));
  bDer.addEventListener('click', () => anadir(1));
  window.addEventListener('resize', redimensionar);

  redimensionar();
  if (movimientoReducido()) {
    // Estado final estático: la balanza equilibrada con sus pesos, sin oscilación.
    theta = 0; omega = 0;
    pesos.push({ lado: -1, masa: 1, edad: 1 }, { lado: 1, masa: 1, edad: 1 });
    dibujar();
    resolver(contenedor, t.resolucionEstatica);
  } else {
    bucle();
  }

  return {
    destruir(): void {
      cancelAnimationFrame(animacion);
      window.removeEventListener('resize', redimensionar);
      contenedor.replaceChildren();
    },
  };
}
