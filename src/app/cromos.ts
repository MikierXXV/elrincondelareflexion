/**
 * Galería de cromos y camino de corrientes (fase 2 §2.7 y §2.8).
 *
 * El umbral señala el cambio de unidad: el recorrido iba de ideas, los cromos van de personas.
 *
 * El camino de vuelta funciona aquí —y solo aquí— porque el usuario **ya ha terminado la
 * narración**: orientarse en ella no le rompe ningún hilo. Al señalar un cromo se ilumina su punto;
 * al pulsar un punto se filtra la rejilla, sin saltar al recorrido.
 *
 * La cita es el cuerpo de la tarjeta y el nombre va abajo, como firma: es lo que hace que una
 * rejilla de 47 invite a detenerse, porque se recorre leyendo frases y no fichas.
 */

import { bloques, corrientes, nombreCorriente, resumenAutores, type ResumenAutor } from './contenido';
import { emitir } from './estado';
import { T, con } from './textos';

let filtro: string | null = null;

function tarjeta(a: ResumenAutor): string {
  return `<li class="cromo" data-autor="${a.id}" data-corriente="${a.corriente_id}">
    <button type="button">
      <blockquote><p>${a.cita}</p></blockquote>
      <span class="nombre">${a.nombre}</span>
      <span class="corriente">${nombreCorriente(a.corriente_id)}</span>
      <span class="periodo">${a.periodo}</span>
    </button>
  </li>`;
}

/**
 * Los cromos se pintan desde el índice ligero. La ficha completa de un autor solo se descarga al
 * abrirla: antes, montar esta sección —que vive al final de la página— costaba las 47 fichas enteras
 * en el arranque.
 */
export function montarCromos(raiz: HTMLElement): () => void {
  const autores = resumenAutores();

  raiz.innerHTML = `
    <section class="umbral" id="umbral">
      <p>${T.umbral.cierre}</p>
      <p class="cambio">${T.umbral.cambio}</p>
    </section>

    <section class="cromos" id="cromos">
      <h2>${con(T.cromos.titulo, { autores: autores.length })}</h2>

      <nav class="camino" aria-label="${T.cromos.camino}">
        <ol>
          ${corrientes
            .map((c, i) => {
              const salto = i > 0 && corrientes[i - 1]!.bloque_id !== c.bloque_id ? ' salto' : '';
              return `<li class="hito${salto}" data-corriente="${c.id}">
                <button type="button" aria-label="${c.nombre}"><span>${String(c.orden_cronologico).padStart(2, '0')}</span></button>
              </li>`;
            })
            .join('')}
        </ol>
        <p class="pista" aria-live="polite">${T.cromos.pista_inicial}</p>
      </nav>

      <div class="filtros">
        <button type="button" data-bloque="" class="activo">${T.cromos.todos}</button>
        ${bloques.map((b) => `<button type="button" data-bloque="${b.id}">${b.nombre}</button>`).join('')}
      </div>

      <ul class="rejilla">${autores.map(tarjeta).join('')}</ul>
    </section>
  `;

  const pista = raiz.querySelector<HTMLElement>('.pista')!;
  const hitos = [...raiz.querySelectorAll<HTMLElement>('.hito')];
  const cromos = [...raiz.querySelectorAll<HTMLElement>('.cromo')];

  /** Descripción de una corriente: nombre, cuántos autores y cuántas ideas. */
  function textoCorriente(corrienteId: string): string {
    const c = corrientes.find((x) => x.id === corrienteId)!;
    const cuantos = autores.filter((a) => a.corriente_id === corrienteId).length;
    return con(T.cromos.pista_corriente, {
      corriente: c.nombre, autores: cuantos, ideas: c.ideas.length,
    });
  }

  /**
   * Qué dice la pista cuando el ratón no está sobre ningún cromo.
   *
   * Antes decía siempre «señala un cromo», también con un filtro puesto. Así que se podía filtrar
   * por una corriente, ver dos cromos de cuarenta y siete, y no tener en pantalla ni una palabra
   * que dijera cuál. El filtro es un estado, y un estado sin rótulo obliga a recordarlo.
   */
  function pistaEnReposo(): string {
    if (!filtro) return T.cromos.pista_inicial;
    const corriente = corrientes.find((c) => c.id === filtro);
    if (corriente) return textoCorriente(corriente.id);
    const bloque = bloques.find((b) => b.id === filtro);
    if (!bloque) return T.cromos.pista_inicial;
    const suyas = corrientes.filter((c) => c.bloque_id === bloque.id);
    /*
     * Se dice CUÁNTAS corrientes, no cuáles. Enumerarlas daba una línea de doce nombres encadenados
     * que no se lee y que además empuja la rejilla hacia abajo. Cuáles son ya lo dice el camino, que
     * las tiene marcadas justo encima: repetirlo en texto es decir dos veces lo mismo y peor.
     */
    return con(T.cromos.pista_bloque, {
      bloque: bloque.nombre,
      corrientes: suyas.length,
      autores: autores.filter((a) => suyas.some((c) => c.id === a.corriente_id)).length,
    });
  }

  function resaltar(corrienteId: string | null): void {
    hitos.forEach((h) => h.classList.toggle('resaltado', h.dataset.corriente === corrienteId));
    pista.textContent = corrienteId ? textoCorriente(corrienteId) : pistaEnReposo();
  }

  function aplicarFiltro(): void {
    cromos.forEach((c) => {
      const corriente = c.dataset.corriente!;
      const bloque = corrientes.find((x) => x.id === corriente)?.bloque_id;
      const visible = !filtro || filtro === bloque || filtro === corriente;
      c.hidden = !visible;
    });
    /*
     * El camino marca lo que el filtro deja ver, sea una corriente o un bloque entero. Filtrando por
     * bloque no se marcaba ningún hito: se pasaba de 47 cromos a 32 sin que el camino —que es
     * justamente el mapa de corrientes— indicara cuáles. Marcarlos convierte el filtro por bloque en
     * lo que pretendía ser: «estas cuatro corrientes, de las dieciséis».
     */
    hitos.forEach((h) => {
      const id = h.dataset.corriente!;
      const suBloque = corrientes.find((c) => c.id === id)?.bloque_id;
      h.classList.toggle('filtrando', Boolean(filtro) && (filtro === id || filtro === suBloque));
    });
    /*
     * Al cambiar el filtro se apaga el resaltado, y se apaga LLAMANDO A `resaltar`.
     *
     * El resaltado dice «esta es la corriente del cromo que estás señalando», y al filtrar ese cromo
     * puede desaparecer de la rejilla: quedaba un hito encendido apuntando a una corriente cuya carta
     * ya no está en pantalla. Se veía como un 01 en color mientras el filtro activo era el 05.
     *
     * Aquí antes se reiniciaba solo el texto de la pista, a mano. Esa era la raíz: el rótulo y el
     * hito son dos caras de lo mismo y se estaban actualizando por separado, así que era cuestión de
     * tiempo que dijeran cosas distintas. `resaltar(null)` apaga los dos de una vez, y mientras sea
     * la única puerta para cambiarlos no pueden volver a desincronizarse.
     */
    resaltar(null);
  }

  raiz.addEventListener('pointerover', (e) => {
    const cromo = (e.target as HTMLElement).closest<HTMLElement>('.cromo');
    if (cromo) resaltar(cromo.dataset.corriente!);
  });
  raiz.addEventListener('focusin', (e) => {
    const cromo = (e.target as HTMLElement).closest<HTMLElement>('.cromo');
    if (cromo) resaltar(cromo.dataset.corriente!);
  });
  raiz.addEventListener('pointerleave', () => resaltar(null));

  raiz.addEventListener('click', (e) => {
    const objetivo = e.target as HTMLElement;

    const hito = objetivo.closest<HTMLElement>('.hito');
    if (hito) {
      // Filtra la rejilla. NO salta al recorrido: eso mezclaría los dos modos de explorar.
      filtro = filtro === hito.dataset.corriente ? null : hito.dataset.corriente!;
      // Al filtrar por una corriente, el botón de bloque activo deja de describir lo que se ve; y si
      // se ha quitado el filtro, «Todos» vuelve a ser lo cierto.
      raiz.querySelectorAll<HTMLElement>('.filtros button').forEach(
        (b2) => b2.classList.toggle('activo', !filtro && !b2.dataset.bloque),
      );
      aplicarFiltro();
      return;
    }

    const boton = objetivo.closest<HTMLElement>('.filtros button');
    if (boton) {
      filtro = boton.dataset.bloque || null;
      raiz.querySelectorAll<HTMLElement>('.filtros button').forEach((b2) => b2.classList.toggle('activo', b2 === boton));
      aplicarFiltro();
      return;
    }

    const cromo = objetivo.closest<HTMLElement>('.cromo');
    if (cromo) location.hash = `#/cromos/${cromo.dataset.autor}`;
  });

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) if (e.isIntersecting) emitir({ zona: 'cromos', ideaActiva: null });
    },
    { rootMargin: '-40% 0px -40% 0px' },
  );
  observador.observe(raiz.querySelector('#cromos')!);

  return () => { observador.disconnect(); raiz.replaceChildren(); };
}
