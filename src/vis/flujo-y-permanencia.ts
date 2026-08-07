/**
 * Pieza propia — canvas con física. Idea: «Flujo y permanencia» (Heráclito, presocráticos).
 *
 * Por qué simulación y no animación: la tesis es que la forma persiste MIENTRAS la materia se
 * renueva. Con fotogramas guionizados habría que dibujar esa persistencia; aquí se produce sola,
 * porque el cauce es una restricción del sistema y las partículas son transitorias. El usuario
 * marca unas cuantas y comprueba que ninguna sigue dentro, con el río intacto.
 */

import { alternativaTextual, movimientoReducido, paletaDe, resolver, TRAZO } from './lenguaje';
import type { Visualizacion } from './lenguaje';

const ANCHO = 560;
const ALTO = 240;
const N = 260;

interface Gota { x: number; y: number; v: number; marcada: boolean; }

/** Perfil del cauce: dos senos superpuestos. Es lo único que no cambia en toda la escena. */
const centro = (x: number) => 120 + Math.sin(x / 90) * 26 + Math.sin(x / 37) * 8;
const semiancho = (x: number) => 30 + Math.sin(x / 130) * 10;

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosRio {
  etiqueta: string;
  marcar: string;
  acelerar: string;
  ritmoNormal: string;
  resolucionMarcar: string;
  resolucionFinal: string;
  resolucionEstatica: string;
  /** Lectura del pie del lienzo. Recibe {renovada}. */
  lectura: string;
  alternativaTexto: string;
}

export function crearFlujoYPermanencia(contenedor: HTMLElement, t: TextosRio): Visualizacion {
  const paleta = paletaDe('presocraticos');
  const lienzo = document.createElement('canvas');
  lienzo.className = 'vis-canvas';
  lienzo.setAttribute('role', 'img');
  lienzo.setAttribute('aria-label', t.etiqueta);
  const ctx = lienzo.getContext('2d')!;

  const gotas: Gota[] = Array.from({ length: N }, () => nueva(Math.random() * ANCHO));
  let marcadas = 0;
  let dentro = 0;
  let animacion = 0;
  let rapido = false;
  let resuelto = false;

  function nueva(x = -6): Gota {
    const t = Math.random() * 2 - 1;
    return { x, y: centro(x) + t * semiancho(x), v: 0.9 + Math.random() * 0.9, marcada: false };
  }

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const bMarcar = document.createElement('button');
  bMarcar.type = 'button';
  bMarcar.textContent = t.marcar;
  const bRapido = document.createElement('button');
  bRapido.type = 'button';
  bRapido.textContent = t.acelerar;
  controles.append(bMarcar, bRapido);

  contenedor.append(lienzo, controles);
  alternativaTextual(contenedor, t.alternativaTexto);

  function redimensionar(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const caja = lienzo.getBoundingClientRect();
    if (!caja.width) return;
    lienzo.width = Math.round(caja.width * dpr);
    lienzo.height = Math.round((caja.width * ALTO / ANCHO) * dpr);
    const e = dpr * (caja.width / ANCHO);
    ctx.setTransform(e, 0, 0, e, 0, 0);
  }

  function paso(dt: number): void {
    dentro = 0;
    for (const g of gotas) {
      g.x += g.v * dt;
      // La gota se mantiene dentro del cauce: la forma es una restricción, no un dibujo.
      const c = centro(g.x);
      const s = semiancho(g.x);
      g.y += (c + (g.y - centro(g.x - g.v * dt)) - g.y) * 0.35;
      g.y = Math.max(c - s, Math.min(c + s, g.y));
      if (g.x > ANCHO + 6) {
        Object.assign(g, nueva());
      } else if (g.marcada) dentro++;
    }
  }

  function dibujar(): void {
    ctx.clearRect(0, 0, ANCHO, ALTO);

    // El cauce: trazo de énfasis, y es lo único que nunca se redibuja distinto.
    ctx.strokeStyle = paleta.neutro;
    ctx.lineWidth = TRAZO.base;
    ctx.lineCap = 'round';
    for (const signo of [-1, 1]) {
      ctx.beginPath();
      for (let x = 0; x <= ANCHO; x += 6) {
        const y = centro(x) + signo * semiancho(x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    for (const g of gotas) {
      ctx.fillStyle = g.marcada ? paleta.senal : paleta.acento;
      ctx.globalAlpha = g.marcada ? 1 : 0.5;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.marcada ? 2.6 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = paleta.senal;
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    if (marcadas > 0) {
      const renovada = Math.round((1 - dentro / marcadas) * 100);
      ctx.fillText(t.lectura.replace('{renovada}', String(renovada)), ANCHO / 2, 216);
    }
  }

  function bucle(): void {
    paso(rapido ? 5 : 1.4);
    dibujar();
    if (marcadas > 0 && dentro === 0 && !resuelto) {
      resuelto = true;
      resolver(contenedor, t.resolucionFinal);
    }
    animacion = requestAnimationFrame(bucle);
  }

  bMarcar.addEventListener('click', () => {
    gotas.forEach((g) => { g.marcada = true; });
    marcadas = gotas.length;
    dentro = marcadas;
    resuelto = false;
    resolver(contenedor, t.resolucionMarcar);
  });
  bRapido.addEventListener('click', () => {
    rapido = !rapido;
    bRapido.textContent = rapido ? t.ritmoNormal : t.acelerar;
    bRapido.setAttribute('aria-pressed', String(rapido));
  });
  window.addEventListener('resize', redimensionar);

  redimensionar();
  if (movimientoReducido()) {
    // Estado final estático: el cauce con agua nueva y el resultado ya enunciado.
    for (let i = 0; i < 400; i++) paso(4);
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
