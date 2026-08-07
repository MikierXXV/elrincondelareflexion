/**
 * Pieza propia — canvas con física. Idea: «La voluntad y el pesimismo» (Schopenhauer).
 *
 * Comparte integrador con la balanza de Pirrón y dice lo contrario, que es justo lo interesante:
 * allí cada empujón encuentra su contrapeso y el sistema se aquieta solo; aquí cada satisfacción
 * inyecta energía y lo aleja más del centro. La misma ecuación, dos tesis opuestas.
 *
 * Regla: **el usuario no puede detener el péndulo empujándolo.** Solo dejando de tocarlo. Si un
 * empujón pudiera frenarlo, la pieza estaría diciendo que satisfacer deseos apacigua.
 */

import { alternativaTextual, movimientoReducido, paletaDe, resolver, TRAZO } from './lenguaje';
import type { Visualizacion } from './lenguaje';

const ANCHO = 560;
const ALTO = 240;
const PIVOTE = { x: ANCHO / 2, y: 52 };
const LARGO = 118;

const RIGIDEZ = 3.4;
/** Amortiguamiento bajo a propósito: sin intervención tarda en pararse, y ese tedio es la tesis. */
const AMORTIGUAMIENTO = 0.55;

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosPendulo {
  etiqueta: string;
  satisfacer: string;
  contemplar: string;
  volverAQuerer: string;
  estadoContemplando: string;
  estadoDeseos: string;
  resolucionEmpujar: string;
  resolucionContemplar: string;
  resolucionEstatica: string;
  /**
   * Los dos extremos del arco. Vienen de la ficha los DOS, y no solo el segundo.
   *
   * «Dolor» estaba escrito dentro del código, en español, así que la versión inglesa rotulaba su
   * péndulo en castellano. Es exactamente lo que la cabecera de `registro.ts` cuenta que ya pasó una
   * vez con doce piezas: el texto visible pertenece al contenido. Y `hastio` estaba declarado aquí
   * pero no existía en ninguna de las dos fichas, de modo que el extremo derecho llevaba escrito
   * «undefined» en pantalla, en los dos idiomas y desde el primer día.
   */
  dolor: string;
  hastio: string;
  alternativaTexto: string;
}

export function crearVoluntadYPesimismo(contenedor: HTMLElement, t: TextosPendulo): Visualizacion {
  const paleta = paletaDe('ilustracion-idealismo');
  const lienzo = document.createElement('canvas');
  lienzo.className = 'vis-canvas';
  lienzo.setAttribute('role', 'img');
  lienzo.setAttribute('aria-label', t.etiqueta);
  const ctx = lienzo.getContext('2d')!;

  let theta = 0.5;
  let omega = 0;
  let contemplando = false;
  let empujones = 0;
  let animacion = 0;
  let avisado = false;

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  const bSatisfacer = document.createElement('button');
  bSatisfacer.type = 'button';
  bSatisfacer.textContent = t.satisfacer;
  const bContemplar = document.createElement('button');
  bContemplar.type = 'button';
  bContemplar.textContent = t.contemplar;
  controles.append(bSatisfacer, bContemplar);

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
    // En contemplación el amortiguamiento se multiplica: es la única vía de reposo del sistema.
    const c = contemplando ? AMORTIGUAMIENTO * 6 : AMORTIGUAMIENTO;
    const alfa = -RIGIDEZ * Math.sin(theta) - c * omega;
    omega += alfa * dt;
    theta += omega * dt;
    theta = Math.max(-1.25, Math.min(1.25, theta));
  }

  function dibujar(): void {
    ctx.clearRect(0, 0, ANCHO, ALTO);
    ctx.lineCap = 'round';

    const x = PIVOTE.x + Math.sin(theta) * LARGO;
    const y = PIVOTE.y + Math.cos(theta) * LARGO;

    // Los dos extremos: neutros, porque no son lo que el usuario manipula.
    ctx.fillStyle = paleta.neutro;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(t.dolor.toUpperCase(), 42, PIVOTE.y + LARGO + 26);
    ctx.textAlign = 'right';
    ctx.fillText(t.hastio.toUpperCase(), ANCHO - 42, PIVOTE.y + LARGO + 26);

    ctx.strokeStyle = paleta.neutro;
    ctx.lineWidth = TRAZO.fino;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(PIVOTE.x, PIVOTE.y);
    ctx.lineTo(PIVOTE.x, PIVOTE.y + LARGO + 8);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = TRAZO.enfasis;
    ctx.beginPath();
    ctx.moveTo(PIVOTE.x, PIVOTE.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = paleta.acento;
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = paleta.senal;
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    const amplitud = Math.round(Math.abs(theta) / 1.25 * 100);
    ctx.fillText(
      contemplando ? t.estadoContemplando : `${t.estadoDeseos}: ${empujones}   ·   ${amplitud} %`,
      ANCHO / 2, ALTO - 14,
    );
  }

  function bucle(): void {
    paso(1 / 60);
    dibujar();
    // Tres satisfacciones bastan para que la tendencia sea evidente: exigir más solo alarga el
    // camino hasta una conclusión que ya se ve.
    if (empujones >= 3 && !avisado) {
      avisado = true;
      resolver(contenedor, t.resolucionEmpujar);
    }
    if (contemplando && Math.abs(omega) < 0.03 && Math.abs(theta) < 0.06) {
      resolver(contenedor, t.resolucionContemplar);
    }
    animacion = requestAnimationFrame(bucle);
  }

  bSatisfacer.addEventListener('click', () => {
    contemplando = false;
    bContemplar.setAttribute('aria-pressed', 'false');
    empujones++;
    // Empujar SIEMPRE añade energía, vaya en la dirección que vaya: no hay forma de frenarlo así.
    omega += (omega >= 0 ? 1 : -1) * 1.5;
  });
  bContemplar.addEventListener('click', () => {
    contemplando = !contemplando;
    bContemplar.setAttribute('aria-pressed', String(contemplando));
    bContemplar.textContent = contemplando ? t.volverAQuerer : t.contemplar;
  });
  window.addEventListener('resize', redimensionar);

  redimensionar();
  if (movimientoReducido()) {
    theta = 0.9; omega = 0;
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
