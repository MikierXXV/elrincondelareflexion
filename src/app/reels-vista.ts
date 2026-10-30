/**
 * Las dos vistas de reels que no están en el arranque: el carrusel de la portada y la página con todos.
 * Se cargan con `import()` desde `main.ts` y `rutas.ts`, así que no pesan en el JS crítico.
 *
 * El carrusel viene del de mentalista (`src/ui/carrusel.ts`) con los nombres cambiados a `reel-*`
 * —aquí `.pista` y `.flecha` ya significan otra cosa— y el acento de la corriente en lugar del de la
 * familia.
 */

import { nombreCorriente, tituloIdea } from './contenido';
import { idioma } from './idioma';
import { abrirCapa } from './capa';
import { escapar } from './bloques';
import { T } from './textos';
import {
  corrienteDe, detalles, duracionLegible, fachada, pieDeReel, publica, reelsEnOrden, textoReels,
  type Reel,
} from './reels';

const TEXTOS = {
  es: {
    titulo: 'Reels',
    sub: 'Menos de un minuto cada uno. Empiezan en silencio.',
    todos: 'Ver todos los reels →',
    pista: 'Reels. Desliza o usa las flechas del teclado',
    anterior: 'Reel anterior',
    siguiente: 'Reel siguiente',
    diapositiva: (n: number, total: number) => `${n} de ${total}`,
    reproducir: 'Reproducir el reel',
    activarSonido: 'Activar sonido',
    silenciar: 'Silenciar',
    activarSonidoAria: 'Activar el sonido del reel',
    silenciarAria: 'Silenciar el reel',
    verIdea: 'Ver la idea →',
    pagina: 'Reels',
    intro: 'Una idea en menos de un minuto. Cada reel enlaza a su idea, donde está la explicación completa, y trae su descripción, la transcripción y las fuentes.',
    nota: 'Vídeos verticales con animación propia, voz sintética y subtítulos incrustados.',
  },
  en: {
    titulo: 'Reels',
    sub: 'Under a minute each, narrated in Spanish. They start muted.',
    todos: 'See all reels →',
    pista: 'Reels. Swipe or use the arrow keys',
    anterior: 'Previous reel',
    siguiente: 'Next reel',
    diapositiva: (n: number, total: number) => `${n} of ${total}`,
    reproducir: 'Play the reel',
    activarSonido: 'Turn sound on',
    silenciar: 'Mute',
    activarSonidoAria: 'Turn the reel sound on',
    silenciarAria: 'Mute the reel',
    verIdea: 'See the idea →',
    pagina: 'Reels',
    intro: 'One idea in under a minute. Each reel links to its idea, where the full explanation is, and comes with a description, a transcript and its sources.',
    nota: 'Vertical videos with their own animation, synthetic voice and burned-in subtitles. Narrated in Spanish.',
  },
} as const;

const textos = () => TEXTOS[idioma];

const ICONO = {
  sonido: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mudo: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/>',
  anterior: '<path d="m15 5-7 7 7 7"/>',
  siguiente: '<path d="m9 5 7 7-7 7"/>',
};

const svg = (trazo: string): string => `<svg viewBox="0 0 24 24" aria-hidden="true">${trazo}</svg>`;

// ---------------------------------------------------------------------------------------------
// Carrusel de la portada
// ---------------------------------------------------------------------------------------------

function diapositiva(reel: Reel, indice: number, total: number): string {
  const L = textos();
  const nombre = tituloIdea(reel.idea);
  return `<article class="reel-slide" data-corriente="${corrienteDe(reel)}" data-video="${escapar(publica(reel.video))}"
      role="group" aria-roledescription="${idioma === 'es' ? 'diapositiva' : 'slide'}"
      aria-label="${L.diapositiva(indice + 1, total)}: ${escapar(nombre)}">
      <div class="reel-marco" data-marco>
        <img src="${escapar(publica(reel.poster))}"
          srcset="${escapar(publica(reel.miniatura))} 360w, ${escapar(publica(reel.poster))} 720w"
          sizes="280px" width="720" height="1280" alt="" loading="lazy" decoding="async">
        <video muted playsinline preload="none" width="720" height="1280" aria-label="Reel: ${escapar(nombre)}"></video>
        <button type="button" class="reel-slide__play" data-play aria-label="${L.reproducir}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>
        </button>
        <span class="reel-slide__num">${duracionLegible(reel.duracion)}</span>
        <button type="button" class="reel-slide__snd" data-snd aria-pressed="false">
          <span data-snd-ic>${svg(ICONO.mudo)}</span><span data-snd-tx>${L.activarSonido}</span>
        </button>
        <div class="reel-slide__prog" aria-hidden="true"><i></i></div>
      </div>
      <div class="reel-info">
        <span class="reel-info__corriente">${escapar(nombreCorriente(corrienteDe(reel)))}</span>
        <h3><a href="#idea-${reel.idea}">${escapar(nombre)}</a></h3>
        ${idioma === 'es' ? `<p class="reel-info__gancho" lang="es">${escapar(reel.titulo)}</p>` : ''}
        <a class="reel-info__idea" href="#idea-${reel.idea}">${L.verIdea}</a>
      </div>
    </article>`;
}

/** El carrusel entero, o cadena vacía si todavía no hay reels importados. */
export function renderCarrusel(): string {
  const lista = reelsEnOrden();
  if (!lista.length) return '';
  const L = textos();
  return `<section class="reel-carrusel" aria-roledescription="${idioma === 'es' ? 'carrusel' : 'carousel'}" aria-labelledby="reel-carrusel-t" data-carrusel>
      <div class="reel-carrusel__cab">
        <div>
          <h2 id="reel-carrusel-t">${L.titulo}</h2>
          <p class="reel-carrusel__sub">${L.sub}</p>
        </div>
        <a class="reel-carrusel__todos" href="#/reels">${L.todos}</a>
      </div>
      <div class="reel-car">
        <button type="button" class="reel-flecha reel-flecha--p" data-ant aria-label="${L.anterior}">${svg(ICONO.anterior)}</button>
        <button type="button" class="reel-flecha reel-flecha--n" data-sig aria-label="${L.siguiente}">${svg(ICONO.siguiente)}</button>
        <div class="reel-pista" data-pista tabindex="0" aria-label="${L.pista}">
          ${lista.map((r, i) => diapositiva(r, i, lista.length)).join('')}
        </div>
      </div>
      <p class="reel-carrusel__cuenta" aria-live="polite" data-cuenta></p>
    </section>`;
}

let limpiar: (() => void) | undefined;

/** Libera vídeos y escuchas; al remontar el sitio un vídeo suelto seguiría sonando. */
export function desmontarCarrusel(): void {
  limpiar?.();
  limpiar = undefined;
}

/**
 * Un solo vídeo con `src` a la vez: el de la diapositiva activa. En pantalla táctil nada se descarga
 * ni arranca hasta el primer toque, y el deslizado es el nativo (`scroll-snap`), sin manejadores
 * táctiles que lo estorben.
 */
export function activarCarrusel(raiz: HTMLElement): void {
  desmontarCarrusel();
  const seccion = raiz.querySelector<HTMLElement>('[data-carrusel]');
  const pista = seccion?.querySelector<HTMLElement>('[data-pista]');
  if (!seccion || !pista) return;

  const L = textos();
  const abort = new AbortController();
  const { signal } = abort;
  const slides = Array.from(pista.children) as HTMLElement[];
  const cuenta = seccion.querySelector<HTMLElement>('[data-cuenta]')!;
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activa = -1;
  let sonido = false;
  let pausadoPorUsuario = false;
  let visible = false;
  let esperaToque = window.matchMedia('(pointer: coarse)').matches;

  const videoDe = (i: number) => slides[i]?.querySelector<HTMLVideoElement>('video');

  function pintarSonido(i: number): void {
    const s = slides[i];
    const v = videoDe(i);
    if (!s || !v) return;
    const suena = !v.muted;
    const b = s.querySelector<HTMLElement>('[data-snd]')!;
    b.setAttribute('aria-pressed', String(suena));
    b.setAttribute('aria-label', suena ? L.silenciarAria : L.activarSonidoAria);
    b.querySelector('[data-snd-tx]')!.textContent = suena ? L.silenciar : L.activarSonido;
    b.querySelector('[data-snd-ic]')!.innerHTML = svg(suena ? ICONO.sonido : ICONO.mudo);
  }

  /** Sin autoplay (política del navegador o movimiento reducido) se ve el póster con ▶. */
  const marcarParado = (i: number, parado: boolean): void => {
    slides[i]?.classList.toggle('parado', parado);
  };

  function reproducir(i: number): void {
    const v = videoDe(i);
    if (!v) return;
    if (!v.getAttribute('src')) v.src = slides[i]!.dataset.video!;
    v.muted = !sonido;
    const p = v.play();
    marcarParado(i, false);
    if (p) {
      p.then(() => pintarSonido(i)).catch(() => {
        if (!v.muted) {
          // Sin gesto previo el navegador no deja sonar: se reintenta en silencio.
          v.muted = true;
          v.play().then(() => pintarSonido(i)).catch(() => marcarParado(i, true));
        } else {
          marcarParado(i, true);
        }
        pintarSonido(i);
      });
    }
  }

  function soltar(k: number): void {
    const v = videoDe(k);
    if (!v?.getAttribute('src')) return;
    v.pause();
    v.removeAttribute('src');
    v.load();
    slides[k]!.classList.remove('parado');
    slides[k]!.querySelector<HTMLElement>('.reel-slide__prog i')!.style.width = '0';
  }

  function activar(i: number): void {
    if (i === activa) return;
    activa = i;
    pausadoPorUsuario = false;
    slides.forEach((s, k) => {
      const v = videoDe(k);
      const on = k === i;
      s.classList.toggle('on', on);
      if (!v) return;
      if (on) {
        if (v.getAttribute('src')) v.currentTime = 0;
        if (esperaToque || reducido.matches || document.hidden || !visible) {
          marcarParado(k, true);
          v.muted = !sonido;
        } else {
          reproducir(k);
        }
        pintarSonido(k);
      } else {
        soltar(k);
      }
    });
    cuenta.textContent = L.diapositiva(i + 1, slides.length);
  }

  function irA(i: number): void {
    const idx = (i + slides.length) % slides.length;
    const s = slides[idx]!;
    pista!.scrollTo({
      left: s.offsetLeft + s.offsetWidth / 2 - pista!.clientWidth / 2,
      behavior: reducido.matches ? 'auto' : 'smooth',
    });
  }

  function masCentrada(): number {
    const medio = pista!.scrollLeft + pista!.clientWidth / 2;
    let mejor = 0;
    let dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - medio);
      if (d < dist) { dist = d; mejor = i; }
    });
    return mejor;
  }

  // Solo se escucha el scroll (pasivo): ningún preventDefault, el gesto táctil es el nativo.
  let temporizador: number | undefined;
  pista.addEventListener('scroll', () => {
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => activar(masCentrada()), 90);
  }, { passive: true, signal });

  slides.forEach((s, i) => {
    const v = videoDe(i)!;
    const barra = s.querySelector<HTMLElement>('.reel-slide__prog i')!;
    v.addEventListener('timeupdate', () => {
      if (v.duration) barra.style.width = `${(v.currentTime / v.duration) * 100}%`;
    }, { signal });
    v.addEventListener('ended', () => {
      if (i === activa && !reducido.matches) irA(i + 1);
    }, { signal });

    s.querySelector('[data-snd]')!.addEventListener('click', (e) => {
      e.stopPropagation();
      sonido = v.muted;
      v.muted = !sonido;
      pintarSonido(i);
    }, { signal });

    s.querySelector('[data-marco]')!.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('[data-snd]')) return;
      if (i !== activa) { irA(i); return; }
      if (v.paused) {
        pausadoPorUsuario = false;
        esperaToque = false;
        reproducir(i);
      } else {
        pausadoPorUsuario = true;
        v.pause();
        marcarParado(i, true);
      }
    }, { signal });
  });

  seccion.querySelector('[data-ant]')!.addEventListener('click', () => irA(activa - 1), { signal });
  seccion.querySelector('[data-sig]')!.addEventListener('click', () => irA(activa + 1), { signal });

  seccion.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); irA(activa - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); irA(activa + 1); }
  }, { signal });

  function reanudar(): void {
    const v = videoDe(activa);
    if (v && v.paused && !esperaToque && !pausadoPorUsuario && !reducido.matches && visible && !document.hidden) {
      reproducir(activa);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videoDe(activa)?.pause();
    else reanudar();
  }, { signal });

  // Fuera de pantalla el reel se calla y se para; al entrar, el primero se prepara (sin descargar
  // vídeo hasta que se pida, si es táctil).
  const observador = new IntersectionObserver(([e]) => {
    if (!e) return;
    visible = e.isIntersecting;
    if (activa < 0) { if (visible) activar(0); return; }
    if (!visible) videoDe(activa)?.pause();
    else reanudar();
  }, { threshold: 0.25 });
  observador.observe(seccion);

  limpiar = () => {
    abort.abort();
    observador.disconnect();
    window.clearTimeout(temporizador);
    slides.forEach((_, k) => soltar(k));
  };
}

// ---------------------------------------------------------------------------------------------
// Página con todos los reels (#/reels): una capa, como los créditos
// ---------------------------------------------------------------------------------------------

function tarjeta(reel: Reel): string {
  const nombre = tituloIdea(reel.idea);
  return `<li class="reel-tarjeta" data-corriente="${corrienteDe(reel)}">
      <p class="reel-tarjeta__corriente">${escapar(nombreCorriente(corrienteDe(reel)))}</p>
      <div class="reel__pantalla">${fachada(reel, '(min-width: 640px) 11rem, 40vw')}</div>
      <div class="reel__pie">
        <h3 class="reel-tarjeta__titulo">${escapar(nombre)}</h3>
        ${pieDeReel(reel)}
        <a class="reel-tarjeta__idea" href="#idea-${reel.idea}">${textoReels().leerIdea}</a>
        ${detalles(reel)}
      </div>
    </li>`;
}

export function abrirPaginaReels(disparador?: HTMLElement): void {
  const L = textos();
  abrirCapa({
    etiqueta: L.pagina,
    contenido: `
      <h2>${L.pagina}</h2>
      <p class="nivel2">${L.intro}</p>
      <p class="meta reel-nota">${L.nota}</p>
      <ul class="reel-rejilla">${reelsEnOrden().map(tarjeta).join('')}</ul>`,
    volverA: T.creditos.volver,
    cerrarEtiqueta: T.ficha.cerrar,
    disparador,
  });
}
