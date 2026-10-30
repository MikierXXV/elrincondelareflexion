/**
 * Los reels en el sitio: manifiesto, fachada con póster y reproductor en su sitio.
 *
 * Los vídeos los importa `scripts/importar-reels.mjs` (ver allí el reparto de ficheros). Este módulo
 * es el que entra en el bundle inicial porque la idea del recorrido lo necesita para pintar su reel,
 * así que se limita a lo ligero: datos, el marcado de la fachada y un manejador delegado. El carrusel
 * de la portada y la página de reels viven en `reels-vista.ts`, que se carga aparte.
 *
 * RENDIMIENTO. Una fachada es solo un póster WebP con un botón. El `<video>` no existe hasta que se
 * pulsa: una página con diez reels descarga imágenes de 5-20 kB, no diez vídeos, y como el arranque
 * lo provoca el propio usuario, puede sonar sin chocar con las políticas de autoplay.
 *
 * IDIOMA. Los reels están locutados en español. En la versión inglesa se rotulan con el título de la
 * idea (traducido) y el gancho del vídeo se deja en su idioma, marcado con `lang="es"`.
 */

import datos from '../datos/reels.json';
import { corrientes, tituloIdea } from './contenido';
import { idioma } from './idioma';
import { escapar } from './bloques';

export interface Reel {
  id: string;
  /** Idea a la que pertenece; el reel se muestra dentro de su ficha. */
  idea: string;
  /** El gancho del vídeo, en español. */
  titulo: string;
  duracion: number;
  video: string;
  poster: string;
  miniatura: string;
  detalle: string;
}

interface Detalle {
  descripcion: string;
  transcripcion: string[];
  fuentes: string;
}

export const reels: Reel[] = (datos as { reels: Reel[] }).reels;

const TEXTOS = {
  es: {
    bloque: 'En menos de un minuto',
    reproducir: (t: string, d: string) => `Reproducir el reel «${t}» (${d}, con sonido y subtítulos)`,
    detalles: 'Qué se ve y qué se dice',
    transcripcion: 'Transcripción',
    fuentes: 'Fuentes',
    cargando: 'Cargando…',
    fallo: 'No se ha podido cargar el detalle.',
    todos: 'Ver todos los reels →',
    leerIdea: 'Leer la idea →',
    solo_es: '',
  },
  en: {
    bloque: 'In under a minute',
    reproducir: (t: string, d: string) => `Play the reel “${t}” (${d}, with sound and burned-in subtitles; in Spanish)`,
    detalles: 'What you see and hear',
    transcripcion: 'Transcript (Spanish)',
    fuentes: 'Sources',
    cargando: 'Loading…',
    fallo: 'The details could not be loaded.',
    todos: 'See all reels →',
    leerIdea: 'Read the idea →',
    solo_es: 'Narrated in Spanish',
  },
} as const;

export const textoReels = () => TEXTOS[idioma];

/** Las rutas del manifiesto son relativas a `public/`; Vite sirve en `base`. */
export const publica = (ruta: string): string => `${import.meta.env.BASE_URL}${ruta}`;

export const reelDeIdea = (ideaId: string): Reel | undefined => reels.find((r) => r.idea === ideaId);

export const duracionLegible = (s: number): string => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** La corriente de la idea del reel, para el acento y para ordenarlos como el recorrido. */
export function corrienteDe(reel: Reel): string {
  return corrientes.find((c) => (c.ideas as string[]).includes(reel.idea))?.id ?? '';
}

/** Los reels en el orden del recorrido: por corriente cronológica y, dentro, el orden de la corriente. */
export function reelsEnOrden(): Reel[] {
  const posicion = (r: Reel): number => {
    const c = corrientes.findIndex((x) => (x.ideas as string[]).includes(r.idea));
    const i = corrientes[c]?.ideas.indexOf(r.idea as never) ?? 0;
    return (c < 0 ? 99 : c) * 100 + i;
  };
  return [...reels].sort((a, b) => posicion(a) - posicion(b));
}

const ICONO_PLAY = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';

/** Póster con botón de reproducir. `tamanos` es el `sizes` del póster según dónde se pinte. */
export function fachada(reel: Reel, tamanos: string): string {
  const T = textoReels();
  const nombre = tituloIdea(reel.idea);
  return `<button type="button" class="reel__fachada" data-reel-play="${escapar(reel.id)}"
      aria-label="${escapar(T.reproducir(nombre, duracionLegible(reel.duracion)))}">
      <img src="${escapar(publica(reel.poster))}"
        srcset="${escapar(publica(reel.miniatura))} 360w, ${escapar(publica(reel.poster))} 720w"
        sizes="${tamanos}" width="720" height="1280" alt="" loading="lazy" decoding="async">
      <span class="reel__play">${ICONO_PLAY}</span>
      <span class="reel__duracion">${duracionLegible(reel.duracion)}</span>
    </button>`;
}

/** Descripción, transcripción y fuentes. Se piden al desplegarlo, no en el arranque. */
export function detalles(reel: Reel): string {
  const T = textoReels();
  return `<details class="reel__detalles" data-reel-detalle="${escapar(reel.id)}">
      <summary>${T.detalles}</summary>
      <div class="reel__detalle-cuerpo" aria-live="polite"></div>
    </details>`;
}

/** Gancho del vídeo (siempre en español) y, en inglés, una nota de idioma. */
export function pieDeReel(reel: Reel): string {
  const T = textoReels();
  return `<p class="reel__gancho" lang="es">${escapar(reel.titulo)}</p>`
    + (T.solo_es ? `<p class="reel__idioma">${T.solo_es} · ${duracionLegible(reel.duracion)}</p>` : '');
}

/**
 * El reel de una idea, en un bloque propio y a la vista: fachada a un lado y, al otro, el gancho y los
 * detalles. En pantalla estrecha se apilan.
 */
export function bloqueReel(ideaId: string): string {
  const reel = reelDeIdea(ideaId);
  if (!reel) return '';
  const T = textoReels();
  return `<section class="bloque bloque--reel" aria-labelledby="${ideaId}-reel-h" data-reel="${escapar(reel.id)}">
      <h4 class="bloque-t" id="${ideaId}-reel-h"><span class="ico-t"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="m10.5 9.5 4 2.5-4 2.5z"/></svg></span>${T.bloque}</h4>
      <div class="reel-ficha">
        <div class="reel__pantalla">${fachada(reel, '(min-width: 640px) 14rem, 60vw')}</div>
        <div class="reel__pie">
          ${pieDeReel(reel)}
          ${detalles(reel)}
        </div>
      </div>
    </section>`;
}

function crearVideo(reel: Reel): HTMLVideoElement {
  const video = document.createElement('video');
  video.className = 'reel__video';
  video.controls = true;
  video.playsInline = true;
  video.preload = 'none';
  video.poster = publica(reel.poster);
  video.src = publica(reel.video);
  video.width = 720;
  video.height = 1280;
  video.setAttribute('aria-label', `Reel: ${tituloIdea(reel.idea)}`);
  return video;
}

async function rellenarDetalle(el: HTMLDetailsElement): Promise<void> {
  const id = el.dataset.reelDetalle!;
  const reel = reels.find((r) => r.id === id);
  const cuerpo = el.querySelector<HTMLElement>('.reel__detalle-cuerpo');
  if (!reel || !cuerpo || cuerpo.childElementCount) return;
  const T = textoReels();
  cuerpo.textContent = T.cargando;
  try {
    const d = (await (await fetch(publica(reel.detalle))).json()) as Detalle;
    const frases = d.transcripcion.map((f) => `<li>${escapar(f)}</li>`).join('');
    cuerpo.innerHTML = `<p lang="es">${escapar(d.descripcion)}</p>
      <p class="reel__rotulo">${T.transcripcion}</p>
      <ol class="reel__transcripcion" lang="es">${frases}</ol>
      ${d.fuentes ? `<p class="reel__fuentes"><span class="reel__rotulo">${T.fuentes}</span> ${escapar(d.fuentes)}</p>` : ''}`;
  } catch {
    cuerpo.textContent = T.fallo;
  }
}

let activado = false;

/**
 * Un único manejador delegado para todos los reels de cualquier vista (idea, página, carrusel no: el
 * carrusel lleva el suyo). Se llama una vez al arrancar; la delegación hace que valga también para lo
 * que se monte después, como las ideas de cada corriente al acercarse.
 */
export function activarReels(): void {
  if (activado) return;
  activado = true;

  document.addEventListener('click', (evento) => {
    const boton = (evento.target as Element | null)?.closest<HTMLButtonElement>('[data-reel-play]');
    if (!boton) return;
    const reel = reels.find((r) => r.id === boton.dataset.reelPlay);
    if (!reel) return;
    const video = crearVideo(reel);
    // Antes de reemplazar: una vez fuera del documento el botón ya no tiene a quién subir.
    boton.closest('.reel-tarjeta')?.classList.add('reel-tarjeta--activa');
    boton.replaceWith(video);
    video.focus();
    void video.play().catch(() => undefined);
  });

  // `toggle` no burbujea: se escucha en captura.
  document.addEventListener('toggle', (evento) => {
    const el = evento.target;
    if (el instanceof HTMLDetailsElement && el.open && el.dataset.reelDetalle) void rellenarDetalle(el);
  }, true);

  // Solo suena un reel a la vez. `play` tampoco burbujea.
  document.addEventListener('play', (evento) => {
    document.querySelectorAll<HTMLVideoElement>('video.reel__video').forEach((otro) => {
      if (otro !== evento.target) otro.pause();
    });
  }, true);
}
