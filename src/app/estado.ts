/**
 * Fuente de verdad única del recorrido (fase 2 §4).
 *
 * La regla que evita el fallo clásico del scrollytelling —que el indicador diga una cosa y el
 * scroll esté en otra— es de dirección: **solo el observador de scroll escribe el estado.** El
 * widget lee y, al pulsar, pide un desplazamiento; el estado se actualiza siempre por la misma vía.
 *
 * Se usa IntersectionObserver y no ScrollTrigger de GSAP, que era lo previsto en la fase 2: cumple
 * el mismo contrato de emisor único, es nativo y no añade peso al bundle crítico. Si más adelante
 * hiciera falta animación ligada al progreso —y no solo saber qué sección está activa— habría que
 * revisarlo.
 */

export interface Estado {
  corrienteActiva: string | null;
  ideaActiva: string | null;
  progresoTotal: number;
  autorAbierto: string | null;
  zona: 'hero' | 'recorrido' | 'umbral' | 'cromos';
}

type Escucha = (e: Readonly<Estado>) => void;

const estado: Estado = {
  corrienteActiva: null,
  ideaActiva: null,
  progresoTotal: 0,
  autorAbierto: null,
  zona: 'hero',
};

const escuchas = new Set<Escucha>();

export function leer(): Readonly<Estado> {
  return estado;
}

export function suscribir(fn: Escucha): () => void {
  escuchas.add(fn);
  fn(estado);
  return () => escuchas.delete(fn);
}

/** Solo debe llamarlo el emisor de scroll y el enrutador. Nunca la interfaz. */
export function emitir(cambio: Partial<Estado>): void {
  let hayCambio = false;
  for (const [k, v] of Object.entries(cambio) as [keyof Estado, never][]) {
    if (estado[k] !== v) { estado[k] = v; hayCambio = true; }
  }
  if (hayCambio) for (const fn of escuchas) fn(estado);
}
