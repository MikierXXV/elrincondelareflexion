/**
 * Las piezas del texto en bloques, compartidas por la idea (recorrido.ts) y por la ficha de autor
 * (ficha-autor.ts). Ver DECISIONES.md.
 *
 * Viene de software-engineer (src/app/bloques.ts): mismo `md()`, mismos iconos de analogía y la misma
 * cabecera de bloque con icono. Lo que cambia es de dónde sale el texto: aquí NO se escribe texto
 * nuevo. Los campos largos de la ficha (`desarrollo`, `nivel_2_desarrollo`, `nivel_3_experto`) pasan
 * de una cadena a una lista de párrafos con las mismas palabras, y la analogía es uno de esos párrafos,
 * señalado por su índice —como `analogia_indice` en mentalista—. `scripts/comprobar-texto-bloques.mjs`
 * comprueba que, unidos, los párrafos dan exactamente el texto de main.
 *
 * El acento es el de la corriente (`--acento-corriente`), que ya pone colores-corriente.ts sobre
 * cualquier elemento con `data-corriente`.
 */

import type { Analogia } from './contenido';

export const escapar = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Markdown en línea. El código va primero y se aparta: dentro de `…` un asterisco es un asterisco. */
export function md(texto: string): string {
  return texto
    .split(/(`[^`]+`)/)
    .map((trozo) => trozo.length > 2 && trozo.startsWith('`') && trozo.endsWith('`')
      ? `<code>${escapar(trozo.slice(1, -1))}</code>`
      : escapar(trozo).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>'))
    .join('');
}

/** Trazos (24×24) de la analogía, copiados de software-engineer. validate-content.mjs lee las claves de
 *  aquí: una por línea, con dos espacios y solo letras a–z. El catálogo está en docs/iconos.md. */
export const ICONOS_ANALOGIA = {
  canal: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9.5 5 2.5-5 2.5z"/>',
  platos: '<rect x="5" y="6" width="14" height="3" rx="1.5"/><rect x="4" y="11" width="16" height="3" rx="1.5"/><rect x="6" y="16" width="12" height="3" rx="1.5"/>',
  fila: '<circle cx="8" cy="8" r="2.5"/><circle cx="16.5" cy="8" r="2.5"/><path d="M3.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5M13 14.2c.9-.2 1.7-.3 2.5-.3 2.5 0 4.5 2 4.5 5"/>',
  nevera: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 11h12M9 6.5v2M9 14v3"/>',
  idea: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  tienda: '<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.67 2.67 0 0 0 5.33 0 2.67 2.67 0 0 0 5.34 0 2.67 2.67 0 0 0 5.33 0"/><path d="M5.5 12.5V20h13v-7.5M10 20v-4.5h4V20"/>',
  libro: '<path d="M12 6.5C10.5 5 8 4.2 4 4.2V18c4 0 6.5.8 8 2.3 1.5-1.5 4-2.3 8-2.3V4.2c-4 0-6.5.8-8 2.3z"/><path d="M12 6.5v13.8"/>',
  examen: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h3M9 16.5l1.8 1.8 3.7-3.8"/>',
  llave: '<circle cx="8" cy="16" r="4"/><path d="m11 13 9-9M16 8l3 3M13.5 10.5l2 2"/>',
  candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2"/>',
  semaforo: '<rect x="8" y="2.5" width="8" height="19" rx="3"/><path d="M12 7h.01M12 12h.01M12 17h.01"/>',
  sobre: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/>',
  fabrica: '<path d="M3 20V11l6 3.5V11l6 3.5V5h4v15z"/><path d="M7 17.5h1M12 17.5h1M17 9h.01"/>',
  receta: '<path d="M4 11h16v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><path d="M2.5 11h19M9 7.5c0-1.5 1-1.5 1-3.5M14 7.5c0-1.5 1-1.5 1-3.5"/>',
  mapa: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  caja: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>',
  arbol: '<circle cx="12" cy="4.5" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="12" r="2"/><circle cx="4" cy="19.5" r="1.7"/><circle cx="10" cy="19.5" r="1.7"/><circle cx="14" cy="19.5" r="1.7"/><circle cx="20" cy="19.5" r="1.7"/><path d="m10.6 6.1-2.2 4.3M13.4 6.1l2.2 4.3M6.2 13.9l-1.4 4M7.8 13.9l1.4 4M16.2 13.9l-1.4 4M17.8 13.9l1.4 4"/>',
  red: '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="5.5" r="2"/><circle cx="19" cy="5.5" r="2"/><circle cx="5" cy="18.5" r="2"/><circle cx="19" cy="18.5" r="2"/><path d="m6.6 7 3.7 3.6M17.4 7l-3.7 3.6M6.6 17l3.7-3.6M17.4 17l-3.7-3.6"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  balanza: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="m5 7-2.5 7a2.5 2 0 0 0 5 0zM19 7l-2.5 7a2.5 2 0 0 0 5 0z"/>',
  puente: '<path d="M2 14h20M4 14v6M12 14v6M20 14v6"/><path d="M4 14c3-8 13-8 16 0"/>',
  capas: '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
  engranaje: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  escudo: '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  robot: '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V5M12 3.5h.01M9 13h.01M15 13h.01M9.5 16.5h5M2.5 12.5v3M21.5 12.5v3"/>',
  persona: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>',
  mensaje: '<path d="M4 5h16v11H11l-4 3.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  datos: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  ramas: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7v10M18 11c0 4-6 3-12 6"/>',
  bucle: '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3"/><path d="M18.5 3v4h-4M5.5 21v-4h4"/>',
  camion: '<path d="M2 6h12v10H2zM14 10h4l4 3v3h-8"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  nube: '<path d="M7 19a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 10.5 4.2 4.2 0 0 1 17.5 19z"/>',
  rayo: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  trueque: '<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/>',
  sombrero: '<path d="M6 15c0-6 2.2-9 6-9s6 3 6 9"/><path d="M2.5 15h19M6 15v2.5h12V15"/>',
};

/** Trazos de los títulos de bloque (los de mentalista y software-engineer). */
const TRAZOS = {
  lista: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  vis: '<path d="M3 20h18M6 20V11M12 20V5M18 20v-7"/>',
  escena: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9.5 5 2.5-5 2.5z"/>',
  pregunta: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
  cita: '<path d="M5 17c0-4 1-7 4-9M13 17c0-4 1-7 4-9"/><path d="M5 17h4v-4H5zM13 17h4v-4h-4z"/>',
  matiz: '<path d="M12 4 3 19.5h18z"/><path d="M12 10v4M12 17v.5"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  ruta: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  ...ICONOS_ANALOGIA,
} as const;
export type Trazo = keyof typeof TRAZOS;

export const ico = (n: Trazo, clase = 'ico'): string =>
  `<svg class="${clase}" viewBox="0 0 24 24" aria-hidden="true">${TRAZOS[n]}</svg>`;

/**
 * Bloque con cabecera: icono tintado con el acento de la corriente + título. `nivel` sigue a la
 * jerarquía de quien lo usa: la idea ya tiene su título en h3; la ficha de autor, en h2.
 */
export function seccion(id: string, icono: Trazo, titulo: string, cuerpo: string, nivel: 3 | 4 = 4): string {
  return `<section class="bloque" aria-labelledby="${id}-h">`
    + `<h${nivel} class="bloque-t" id="${id}-h"><span class="ico-t">${ico(icono)}</span>${escapar(titulo)}</h${nivel}>${cuerpo}</section>`;
}

/** Un campo largo como lista de párrafos. Mientras dure la migración también puede ser una cadena. */
export const comoParrafos = (texto: string | string[]): string[] => (Array.isArray(texto) ? texto : [texto]);

/** «En una frase»: la entradilla de la cabecera. */
export function enUnaFrase(rotulo: string, texto: string): string {
  return `<div class="en-una-frase"><small>${escapar(rotulo)}</small><p>${md(texto)}</p></div>`;
}

/**
 * Reparte un campo largo: los párrafos de la prosa por un lado y, si la ficha señala uno como
 * analogía, ese párrafo aparte. Nada se reescribe; solo se cambia de sitio.
 */
export function repartir(texto: string | string[], analogia?: Analogia): { prosa: string; analogia: string } {
  const parrafos = comoParrafos(texto);
  const i = analogia && Array.isArray(texto) ? analogia.parrafo : -1;
  const prosa = parrafos.filter((_, k) => k !== i).map((p) => `<p>${md(p)}</p>`).join('');
  if (i < 0 || !parrafos[i]) return { prosa, analogia: '' };
  const icono = (analogia!.icono in ICONOS_ANALOGIA ? analogia!.icono : 'idea') as Trazo;
  return {
    prosa,
    analogia: `<div class="anal"><div class="anal-ico">${ico(icono)}</div><p>${md(parrafos[i])}</p></div>`,
  };
}
