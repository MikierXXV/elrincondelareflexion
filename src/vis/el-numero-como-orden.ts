/**
 * Pieza propia — canvas con física. Idea: «El número como orden del mundo» (Pitágoras).
 *
 * El usuario desliza un puente sobre una cuerda. La simulación resuelve las dos ondas estacionarias
 * resultantes, cuyas frecuencias son inversamente proporcionales a la longitud de cada segmento.
 * En proporciones simples —1:2, 2:3, 3:4— los dos patrones se realinean periódicamente y el dibujo
 * se estabiliza; fuera de ellas, las fases se separan y aparece un batido visible.
 *
 * El sonido es opcional y va detrás de un botón: la ficha sostiene que el orden numérico se percibe
 * por el oído, y con audio eso se comprueba en un segundo. Pero nadie debería recibir un tono sin
 * haberlo pedido.
 */

import { alternativaTextual, movimientoReducido, paletaDe, resolver, TRAZO } from './lenguaje';
import type { Visualizacion } from './lenguaje';

const ANCHO = 560;
const ALTO = 240;
const X0 = 56;
const X1 = ANCHO - 56;
const Y = 120;

/** Proporciones consonantes y su nombre, con la tolerancia dentro de la que se consideran logradas. */
const RAZONES = [1 / 2, 2 / 3, 3 / 4, 1 / 3];
const TOLERANCIA = 0.012;

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosCuerda {
  etiqueta: string;
  etiquetaPuente: string;
  escuchar: string;
  sinProporcion: string;
  consonancias: string[];
  estabilizada: string;
  resolucionFinal: string;
  resolucionEstatica: string;
  alternativaTexto: string;
}

export function crearElNumeroComoOrden(contenedor: HTMLElement, txt: TextosCuerda): Visualizacion {
  const CONSONANCIAS = RAZONES.map((r, i) => ({ r, nombre: txt.consonancias[i]! }));
  const paleta = paletaDe('presocraticos');
  const lienzo = document.createElement('canvas');
  lienzo.className = 'vis-canvas';
  lienzo.setAttribute('role', 'img');
  lienzo.setAttribute('aria-label', txt.etiqueta);
  const ctx = lienzo.getContext('2d')!;

  let t = 0;
  let posicion = 0.42;
  let animacion = 0;
  let audio: AudioContext | null = null;
  let osciladores: OscillatorNode[] = [];
  const halladas = new Set<string>();

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const rango = document.createElement('input');
  rango.type = 'range';
  rango.min = '12'; rango.max = '88'; rango.value = '42';
  rango.setAttribute('aria-label', txt.etiquetaPuente);
  const bAudio = document.createElement('button');
  bAudio.type = 'button';
  bAudio.textContent = txt.escuchar;
  controles.append(rango, bAudio);

  contenedor.append(lienzo, controles);
  alternativaTextual(contenedor, txt.alternativaTexto);

  function redimensionar(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const caja = lienzo.getBoundingClientRect();
    if (!caja.width) return;
    lienzo.width = Math.round(caja.width * dpr);
    lienzo.height = Math.round((caja.width * ALTO / ANCHO) * dpr);
    const e = dpr * (caja.width / ANCHO);
    ctx.setTransform(e, 0, 0, e, 0, 0);
  }

  /** Razón entre las frecuencias de los dos segmentos: f ∝ 1/L. */
  function razon(): number {
    const a = posicion;
    const b = 1 - posicion;
    return Math.min(a, b) / Math.max(a, b);
  }

  function consonancia(): { nombre: string; exacta: boolean } {
    const r = razon();
    for (const c of CONSONANCIAS) {
      if (Math.abs(r - c.r) < TOLERANCIA) return { nombre: c.nombre, exacta: true };
    }
    return { nombre: txt.sinProporcion, exacta: false };
  }

  function dibujar(): void {
    ctx.clearRect(0, 0, ANCHO, ALTO);
    ctx.lineCap = 'round';

    const xp = X0 + posicion * (X1 - X0);
    const c = consonancia();
    // Fuera de proporción, las dos ondas se desfasan y el dibujo bate; dentro, se mantienen juntas.
    const desfase = c.exacta ? 0 : (razon() % 0.08) * 90;

    const dibujarSegmento = (xa: number, xb: number, modos: number, fase: number) => {
      const largo = xb - xa;
      ctx.beginPath();
      for (let x = xa; x <= xb; x += 2) {
        const u = (x - xa) / largo;
        const amp = 26 * Math.sin(Math.PI * modos * u) * Math.cos(t * (modos / (largo / 200)) + fase);
        if (x === xa) ctx.moveTo(x, Y + amp); else ctx.lineTo(x, Y + amp);
      }
      ctx.stroke();
    };

    ctx.strokeStyle = c.exacta ? paleta.acento : paleta.neutro;
    ctx.lineWidth = c.exacta ? TRAZO.enfasis : TRAZO.base;
    dibujarSegmento(X0, xp, 1, 0);
    dibujarSegmento(xp, X1, 1, desfase);

    // El puente: lo único que el usuario mueve.
    ctx.strokeStyle = paleta.senal;
    ctx.lineWidth = TRAZO.enfasis;
    ctx.beginPath();
    ctx.moveTo(xp, Y - 34);
    ctx.lineTo(xp, Y + 34);
    ctx.stroke();

    ctx.fillStyle = paleta.neutro;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(posicion * 100)} : ${Math.round((1 - posicion) * 100)}`, ANCHO / 2, 42);

    ctx.fillStyle = c.exacta ? paleta.acento : paleta.neutro;
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(c.nombre, ANCHO / 2, 214);
  }

  function bucle(): void {
    t += 0.06;
    dibujar();
    animacion = requestAnimationFrame(bucle);
  }

  function sonar(): void {
    if (!audio) audio = new AudioContext();
    osciladores.forEach((o) => o.stop());
    osciladores = [];
    const base = 220;
    const ganancia = audio.createGain();
    ganancia.gain.value = 0.06;
    ganancia.connect(audio.destination);
    for (const l of [posicion, 1 - posicion]) {
      const osc = audio.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = base / l;   // f proporcional a 1/L
      osc.connect(ganancia);
      osc.start();
      osc.stop(audio.currentTime + 1.6);
      osciladores.push(osc);
    }
  }

  /**
   * Imán hacia las proporciones exactas. Sin esto hay que acertar una ventana de ~1 % a pulso, que
   * es prácticamente imposible con el dedo y convierte el hallazgo en cuestión de suerte. La idea
   * sostiene que esas posiciones son especiales; el control debe hacerlas encontrables, no
   * esconderlas. El imán no las regala: hay que llegar cerca.
   */
  function imantar(p: number): number {
    for (const c of CONSONANCIAS) {
      // Posición del puente que produce esa razón de frecuencias.
      for (const cand of [c.r / (1 + c.r), 1 / (1 + c.r)]) {
        if (Math.abs(p - cand) < 0.022) return cand;
      }
    }
    return p;
  }

  rango.addEventListener('input', () => {
    posicion = imantar(Number(rango.value) / 100);
    const c = consonancia();
    if (c.exacta) {
      halladas.add(c.nombre);
      resolver(contenedor, halladas.size >= 3
        ? txt.resolucionFinal
        : `${c.nombre}: ${txt.estabilizada}`);
    }
  });
  bAudio.addEventListener('click', sonar);
  window.addEventListener('resize', redimensionar);

  redimensionar();
  if (movimientoReducido()) {
    posicion = 0.5;
    dibujar();
    resolver(contenedor, txt.resolucionEstatica);
  } else {
    bucle();
  }

  return {
    destruir(): void {
      cancelAnimationFrame(animacion);
      window.removeEventListener('resize', redimensionar);
      osciladores.forEach((o) => { try { o.stop(); } catch { /* ya detenido */ } });
      void audio?.close();
      contenedor.replaceChildren();
    },
  };
}
