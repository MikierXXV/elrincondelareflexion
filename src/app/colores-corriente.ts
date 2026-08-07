/**
 * Pone el color de cada corriente a disposición de la hoja de estilo.
 *
 * POR QUÉ EXISTE. Las dieciséis corrientes declaran su `color_acento` en `corrientes.json` desde el
 * principio, con un valor por tema y con el contraste ya verificado por `check-contraste.mjs`. Hasta
 * ahora solo lo consumía `paletaDe()`, es decir, únicamente el interior de las visualizaciones: el
 * recorrido entero —dieciséis portadas, cuarenta y siete cromos, el camino de corrientes y la
 * brújula lateral— era gris idéntico. Dieciséis paradas indistinguibles entre sí, con dieciséis
 * colores ya definidos, verificados y sin usar.
 *
 * CÓMO. Se emite una regla por corriente que define `--acento-corriente` sobre cualquier elemento
 * con su `data-corriente`. Eso alcanza de una vez a las cuatro familias, porque las cuatro ya
 * marcaban el atributo por sus propios motivos, y deja que la hoja de estilo decida dónde se usa.
 *
 * SE EMITE COMO CSS Y NO COMO ESTILO EN LÍNEA, y ahí está lo importante: en línea habría que
 * reescribir cada nodo al cambiar de tema —y hay más de cien— mientras que en la cascada el cambio
 * es gratis. Se repite el mismo patrón de tres pasos que usan `tokens.css` y el icono del
 * conmutador: valor claro, preferencia del sistema, y el atributo explícito por encima de todo. Es
 * la única forma de acertar también cuando el usuario todavía no ha elegido tema.
 */

import { corrientes } from './contenido';

const ID = 'colores-de-corriente';

export function aplicarColoresDeCorriente(): void {
  if (document.getElementById(ID)) return;

  const reglas = corrientes.flatMap((c) => {
    const claro = c.color_acento.claro;
    const oscuro = c.color_acento.oscuro;
    const sel = `[data-corriente="${c.id}"]`;
    return [
      `${sel}{--acento-corriente:${claro}}`,
      `@media (prefers-color-scheme:dark){:root:not([data-tema="claro"]) ${sel}{--acento-corriente:${oscuro}}}`,
      `:root[data-tema="oscuro"] ${sel}{--acento-corriente:${oscuro}}`,
    ];
  });

  const hoja = document.createElement('style');
  hoja.id = ID;
  hoja.textContent = reglas.join('\n');
  document.head.append(hoja);
}
