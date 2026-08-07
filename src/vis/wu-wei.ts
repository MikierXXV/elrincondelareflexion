/**
 * Pieza propia — canvas con física. Idea: «Wu wei: la eficacia de no forzar» (Laozi).
 *
 * Simulación de partículas de agua sobre un terreno con obstáculos. El usuario dispone de dos
 * acciones y la diferencia entre ellas es el argumento entero:
 *  - **Empujar**: inyecta fuerza. El agua se desborda, salpica fuera del cauce y se pierde.
 *  - **Retirar un obstáculo**: no toca el agua. Encuentra su curso sola y llega más lejos.
 *
 * Dos contadores enfrentados —acción empleada y distancia alcanzada— hacen visible que la relación
 * entre ambas es inversa, que es lo contraintuitivo de la idea.
 */

import { alternativaTextual, movimientoReducido, paletaDe, resolver, TRAZO } from './lenguaje';
import type { Visualizacion } from './lenguaje';

const ANCHO = 560;
const ALTO = 240;
const SUELO = 196;
const N = 220;

interface Gota { x: number; y: number; vx: number; vy: number; viva: boolean; }

interface Obstaculo { x: number; alto: number; retirado: boolean; }

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosAgua {
  etiqueta: string;
  empujar: string;
  dejar: string;
  retirar: string;
  resolucionLlego: string;
  resolucionEmpujar: string;
  resolucionDejar: string;
  resolucionRetirar: string;
  /** Lectura del pie del lienzo. Recibe {accion} y {alcance}. */
  lectura: string;
  alternativaTexto: string;
}

export function crearWuWei(contenedor: HTMLElement, t: TextosAgua): Visualizacion {
  const paleta = paletaDe('filosofia-china');
  const lienzo = document.createElement('canvas');
  lienzo.className = 'vis-canvas';
  lienzo.setAttribute('role', 'img');
  lienzo.setAttribute('aria-label', t.etiqueta);
  const ctx = lienzo.getContext('2d')!;

  const obstaculos: Obstaculo[] = [
    { x: 190, alto: 46, retirado: false },
    { x: 300, alto: 62, retirado: false },
    { x: 410, alto: 38, retirado: false },
  ];
  let gotas: Gota[] = [];
  let accion = 0;
  let alcance = 0;
  let animacion = 0;
  let resuelto = false;

  /**
   * El agua ya está ahí antes de que nadie toque nada: un remanso quieto contra el primer obstáculo.
   *
   * Sin esto la pieza arrancaba siendo un terreno vacío con tres palos, mientras su propio texto
   * prometía «agua simulada sobre un terreno». No había nada que mirar y, peor, nada que sugiriera de
   * qué iba el asunto: la escena no se entendía hasta después de pulsar, que es tarde.
   *
   * Es además lo que la idea afirma. El agua no hay que traerla; ya está, y está detenida. Lo único
   * que se discute es qué la hace avanzar —empujarla o quitarle lo que la frena— y esa pregunta solo
   * existe si hay agua parada delante desde el principio.
   */
  function remansar(): void {
    /*
     * Ocupa TODO el tramo hasta el primer obstáculo, y no un montoncito en la esquina.
     *
     * Apiladas en los primeros setenta píxeles, las gotas se posaban en una raya de un píxel contra
     * el borde izquierdo y no se leían como agua: parecían una ralladura del lienzo. Repartidas hasta
     * el pie del primer obstáculo forman una lámina reconocible y, de paso, cuentan la situación de
     * partida sin una palabra: el agua está detenida ahí porque hay algo que la para.
     */
    const hastaElPrimerObstaculo = obstaculos[0]!.x - 16;
    for (let i = 0; i < N / 2; i++) {
      gotas.push({
        x: 18 + Math.random() * (hastaElPrimerObstaculo - 18),
        y: SUELO - Math.random() * 10,
        vx: 0,
        vy: 0,
        viva: true,
      });
    }
  }

  function soltar(fuerza: number): void {
    accion += fuerza > 1 ? 3 : 1;
    for (let i = 0; i < N; i++) {
      gotas.push({
        x: 26 + Math.random() * 10,
        y: SUELO - 10 - Math.random() * 16,
        vx: 0.5 + fuerza * (0.6 + Math.random() * 0.7),
        vy: -fuerza * Math.random() * 1.6,
        viva: true,
      });
    }
  }

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const bEmpujar = document.createElement('button');
  bEmpujar.type = 'button';
  bEmpujar.textContent = t.empujar;
  const bDejar = document.createElement('button');
  bDejar.type = 'button';
  bDejar.textContent = t.dejar;
  const bRetirar = document.createElement('button');
  bRetirar.type = 'button';
  bRetirar.textContent = t.retirar;
  controles.append(bEmpujar, bDejar, bRetirar);

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

  function paso(): void {
    for (const g of gotas) {
      if (!g.viva) continue;
      g.vy += 0.28;              // gravedad
      g.vx *= 0.995;             // rozamiento
      g.x += g.vx;
      g.y += g.vy;

      if (g.y > SUELO) { g.y = SUELO; g.vy *= -0.24; g.vx *= 0.9; }

      for (const o of obstaculos) {
        if (o.retirado) continue;
        if (g.x > o.x - 7 && g.x < o.x + 7 && g.y > SUELO - o.alto) {
          // Choca: pierde casi toda la velocidad y sale despedida hacia arriba.
          g.x = g.vx > 0 ? o.x - 7 : o.x + 7;
          g.vx *= -0.28;
          g.vy -= Math.abs(g.vx) * 0.8;
        }
      }
      // Salpicar fuera del cuadro es perder agua: es el coste de forzar.
      if (g.y < 0 || g.x > ANCHO + 10) g.viva = false;
      /*
       * El alcance solo cuenta a partir de la primera acción. El remanso de partida ocupa los
       * primeros ochenta píxeles, y sin esta condición el pie del lienzo abriría anunciando un
       * «alcance 16 %» que nadie ha conseguido: el marcador mide lo que logra tu intervención.
       */
      if (g.viva && accion > 0) alcance = Math.max(alcance, Math.round(g.x));
    }
    gotas = gotas.filter((g) => g.viva);
  }

  function dibujar(): void {
    ctx.clearRect(0, 0, ANCHO, ALTO);
    ctx.lineCap = 'round';

    ctx.strokeStyle = paleta.neutro;
    ctx.lineWidth = TRAZO.base;
    ctx.beginPath();
    ctx.moveTo(10, SUELO);
    ctx.lineTo(ANCHO - 10, SUELO);
    ctx.stroke();

    for (const o of obstaculos) {
      ctx.globalAlpha = o.retirado ? 0.14 : 1;
      ctx.setLineDash(o.retirado ? [2, 5] : []);
      ctx.beginPath();
      ctx.moveTo(o.x, SUELO);
      ctx.lineTo(o.x, SUELO - o.alto);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = paleta.acento;
    ctx.globalAlpha = 0.65;
    for (const g of gotas) {
      ctx.beginPath();
      ctx.arc(g.x, g.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = paleta.senal;
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      t.lectura.replace('{accion}', String(accion))
        .replace('{alcance}', String(Math.round((alcance / ANCHO) * 100))),
      ANCHO / 2, 224,
    );
  }

  function bucle(): void {
    paso();
    dibujar();
    const librados = obstaculos.filter((o) => o.retirado).length;
    if (librados >= 2 && alcance > ANCHO * 0.85 && !resuelto) {
      resuelto = true;
      resolver(contenedor, t.resolucionLlego);
    }
    animacion = requestAnimationFrame(bucle);
  }

  bEmpujar.addEventListener('click', () => {
    soltar(2.6);
    resolver(contenedor, t.resolucionEmpujar);
  });
  bDejar.addEventListener('click', () => soltar(0.8));
  bRetirar.addEventListener('click', () => {
    const o = obstaculos.find((x) => !x.retirado);
    if (!o) return;
    o.retirado = true;
    resolver(contenedor, t.resolucionDejar);
    soltar(0.8);
    bRetirar.disabled = obstaculos.every((x) => x.retirado);
  });
  window.addEventListener('resize', redimensionar);

  redimensionar();
  remansar();
  if (movimientoReducido()) {
    obstaculos.forEach((o) => { o.retirado = true; });
    soltar(0.8);
    for (let i = 0; i < 400; i++) paso();
    dibujar();
    resolver(contenedor, t.resolucionRetirar);
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
