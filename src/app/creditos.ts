/**
 * Página de créditos: procedencia del contenido y licencias de lo que no es propio.
 *
 * POR QUÉ ESTÁ APARTE Y NO EN EL PIE. El pie de un sitio de lectura tiene que desaparecer: cuatro
 * líneas de atribuciones al final de cada recorrido compiten con lo último que se acaba de leer, que
 * es justo lo que peor momento tiene para competir. Aquí cabe entero y sin prisa.
 *
 * LA ATRIBUCIÓN SIGUE CUMPLIDA. CC BY exige atribuir «de una manera razonable según el medio»; una
 * página de créditos enlazada desde todas las páginas es la forma habitual en la web y es la que
 * usan los propios repositorios de los que salió la malla.
 *
 * Es una capa y no un documento aparte porque el sitio tiene un HTML por idioma y no conviene un
 * tercero: la capa vive dentro del que ya está abierto, y `#/creditos` la hace enlazable igual.
 */

import { abrirCapa } from './capa';
import { T } from './textos';

export function abrirCreditos(disparador?: HTMLElement): void {
  const c = T.creditos;
  const contenido = `
      <h2>${c.titulo}</h2>
      <p class="nivel2">${c.intro}</p>
      ${c.secciones
        .map((s) => `<section class="credito">
          <h3>${s.titulo}</h3>
          <p>${s.cuerpo}</p>
          ${s.enlace ? `<p class="fuentes"><a href="${s.enlace.url}" target="_blank" rel="noopener">${s.enlace.texto} ↗</a></p>` : ''}
        </section>`)
        .join('')}
  `;

  abrirCapa({
    etiqueta: c.titulo,
    contenido,
    volverA: c.volver,
    cerrarEtiqueta: T.ficha.cerrar,
    disparador,
  });
}
