/**
 * El recorrido: 16 paradas, cada una con su portada y sus 3-5 ideas (fase 2 §2.2 y §2.3).
 *
 * Separación de ejes: el scroll narra el arco histórico —16 portadas—, las ideas son el contenido
 * de cada parada, y el autor se asoma desde dentro de una idea sin sacar a nadie de ningún sitio.
 * Por eso la portada muestra **las dos salidas a la vez**: entrar en las ideas o saltar a la
 * siguiente corriente. Es lo que hace que 16 × 5 no resulte agobiante.
 *
 * CARGA POR CORRIENTE. Las portadas se pintan de inmediato con el índice ligero; las ideas de cada
 * corriente se piden al acercarse su portada. La primera versión montaba el recorrido entero de
 * golpe, y eso obligaba a descargar los 59 JSON de ideas en el arranque —unos 118 kB comprimidos,
 * más de la mitad del presupuesto de JS crítico— para mostrar una pantalla que solo enseña la
 * primera corriente. Quien salta corrientes ahora no descarga las ideas que no mira.
 */

import {
  corrientes, ideasDe, nombreAutor, nombreCorriente, periodoAutor, tituloIdea, type Idea,
} from './contenido';
import { emitir } from './estado';
import { T, con } from './textos';
import { crearVisualizacion } from '../vis/registro';
import { habilitarVisor } from './visor';
import type { Visualizacion } from '../vis/lenguaje';

const rolTexto = (rol: string): string =>
  T.recorrido.roles[rol as keyof typeof T.recorrido.roles] ?? rol;

/** Altura aproximada de una idea, para reservar el hueco antes de que llegue su contenido. */
const ALTO_IDEA_APROX = 1500;

function tiraDeAutores(idea: Idea): string {
  return `<div class="tira-autores">${idea.autores
    .map(
      (a) => `<div class="autor" data-autor="${a.id}">
        <span class="rol">${rolTexto(a.rol)}</span>
        <span class="nombre">${nombreAutor(a.id)}<span class="periodo">${periodoAutor(a.id)}</span></span>
        <span class="aporte">${a.aporte ?? ''}</span>
        <button type="button" class="ver-ficha" data-autor="${a.id}">${T.recorrido.ver_ficha}</button>
      </div>`,
    )
    .join('')}</div>`;
}

/**
 * La línea que dice qué hacer con la pieza.
 *
 * Existe porque el panel no lo decía en ninguna parte: dibujo, controles y textos, pero ni una
 * palabra sobre qué se espera de ti. El caso extremo era «Saber que no se sabe», con seis nodos que
 * se arrastran, ningún botón y ningún indicio.
 *
 * Dice el gesto y dónde mirar, nunca la conclusión: eso ya lo cuentan la resolución cuando te la has
 * ganado y la alternativa textual para quien no puede jugar.
 */
function invitacion(texto: string): HTMLElement {
  const p = document.createElement('p');
  p.className = 'vis-invitacion';
  p.textContent = texto;
  return p;
}

function seccionIdea(idea: Idea, indice: number, total: number, siguiente: string | null): string {
  return `
  <section class="parada idea" id="idea-${idea.id}" data-idea="${idea.id}" data-corriente="${idea.corriente_id}">
    <p class="situacion">${con(T.recorrido.situacion_idea, {
      corriente: nombreCorriente(idea.corriente_id), n: indice + 1, total,
    })}</p>
    <h3>${idea.titulo}</h3>
    <p class="pregunta">${idea.pregunta}</p>

    <blockquote class="cita">
      <p>${idea.cita.texto}</p>
      <cite>${idea.cita.obra}</cite>
      ${idea.cita.nota ? `<details class="atribucion"><summary>${T.recorrido.atribucion}</summary><p>${idea.cita.nota}</p></details>` : ''}
    </blockquote>

    <div class="superficie" data-vis="${idea.id}"></div>

    <p class="desarrollo">${idea.desarrollo}</p>

    <aside class="ejemplo">
      <h4>${T.recorrido.en_la_vida_real}</h4>
      <p>${idea.ejemplo_real}</p>
    </aside>

    ${idea.matiz_experto ? `<details class="matiz"><summary>${T.recorrido.lo_que_simplifica}</summary><p>${idea.matiz_experto}</p></details>` : ''}

    ${tiraDeAutores(idea)}

    <nav class="paso">${siguiente ? `<a href="#idea-${siguiente}">${T.recorrido.siguiente_idea}</a>` : ''}</nav>
  </section>`;
}

function portada(c: (typeof corrientes)[number], siguienteCorriente: string | null): string {
  const paralela = 'cronologia_paralela_a' in c && Array.isArray(c.cronologia_paralela_a)
    ? `<p class="paralela">${con(T.recorrido.contemporanea_de, {
        corrientes: (c.cronologia_paralela_a as string[]).map(nombreCorriente).join(', '),
      })}</p>`
    : '';
  return `
  <section class="parada portada" id="corriente-${c.id}" data-corriente="${c.id}">
    <p class="situacion">${String(c.orden_cronologico).padStart(2, '0')} · ${c.periodo} · ${c.region}</p>
    <h2>${c.nombre}</h2>
    ${paralela}
    <p class="guia">${c.pregunta_guia}</p>
    <p class="contexto">${c.contexto}</p>
    <ol class="indice-ideas">
      ${c.ideas.map((id) => `<li><a href="#idea-${id}">${tituloIdea(id)}</a></li>`).join('')}
    </ol>
    <nav class="salidas">
      <a class="entrar chevron" href="#idea-${c.ideas[0]}">${T.recorrido.entrar_en_las_ideas}</a>
      ${siguienteCorriente
        ? `<a class="saltar" href="#corriente-${siguienteCorriente}">${con(T.recorrido.saltar_a, { corriente: nombreCorriente(siguienteCorriente) })}</a>`
        : `<a class="saltar" href="#umbral">${T.recorrido.ir_a_cromos}</a>`}
    </nav>
  </section>
  <div class="ideas-de" data-ideas-de="${c.id}" style="min-height:${c.ideas.length * ALTO_IDEA_APROX}px"></div>`;
}

export async function montarRecorrido(raiz: HTMLElement): Promise<() => void> {
  raiz.innerHTML = corrientes
    .map((c, i) => portada(c, corrientes[i + 1]?.id ?? null))
    .join('');

  const ideasCargadas = new Map<string, Idea>();
  const montadas = new Map<HTMLElement, Visualizacion>();
  /** Limpieza del botón de ampliar, en paralelo a `montadas`: las 3D se montan y desmontan solas. */
  const quitarVisores = new Map<HTMLElement, () => void>();

  // ---- emisor único de estado ----
  const observadorEstado = new IntersectionObserver(
    (entradas) => {
      const visible = entradas
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const el = visible.target as HTMLElement;
      const paradas = [...raiz.querySelectorAll<HTMLElement>('.parada')];
      emitir({
        zona: 'recorrido',
        corrienteActiva: el.dataset.corriente ?? null,
        ideaActiva: el.dataset.idea ?? null,
        progresoTotal: paradas.indexOf(el) / Math.max(1, paradas.length - 1),
      });
    },
    { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.25, 0.5, 1] },
  );

  /*
   * Montar una pieza en su hueco. Se usa desde el observador y desde el cambio de tema.
   *
   * La invitación se pinta ANTES de la pieza, y desde aquí y no desde dentro de cada mecánica: las
   * mecánicas solo reciben sus `parametros` o sus `textos`, así que para que la pintaran ellas habría
   * que tocar las treinta y cinco. Como todas hacen `append` sobre el contenedor, el orden sale solo.
   *
   * El botón de ampliar se cuelga DESPUÉS de montar: si la pieza cae al respaldo estático no hay nada
   * que ampliar, y ofrecerlo sería prometer una salida que no lleva a ninguna parte.
   */
  function montarPieza(hueco: HTMLElement, idea: Idea): void {
    hueco.prepend(invitacion(idea.visualizacion.invitacion));
    void crearVisualizacion(idea.id, idea.visualizacion, hueco)
      .then((v) => {
        montadas.set(hueco, v);
        hueco.style.minHeight = '';
        quitarVisores.set(hueco, habilitarVisor(hueco));
      })
      .catch(() => { hueco.innerHTML = `<p class="vis-respaldo">${T.recorrido.vis_fallida}</p>`; });
  }

  /*
   * AL CAMBIAR DE TEMA HAY QUE REHACER LAS PIEZAS. No es un refinamiento: es corregir un fallo.
   *
   * Cada pieza resuelve su paleta con `paletaDe()` en el momento de construirse y la escribe en los
   * atributos del SVG. Cambiar de tema solo cambia los tokens de CSS, así que las piezas ya montadas
   * se quedaban con los colores del tema anterior: rótulos en el gris del tema claro sobre el panel
   * oscuro, medido en 2,74:1, y los que usaban el color de señal en 1,1:1, o sea invisibles.
   *
   * Se desmontan y se vuelven a montar, que es lo único que las repinta. Solo las que están en pantalla
   * o cerca: las demás ni siquiera existen todavía y nacerán con el tema nuevo.
   */
  const alCambiarTema = (): void => {
    for (const [hueco, vis] of [...montadas]) {
      const idea = ideasCargadas.get(hueco.dataset.vis!);
      if (!idea) continue;
      quitarVisores.get(hueco)?.();
      quitarVisores.delete(hueco);
      // Se reserva el alto antes de vaciar: sin esto la página encoge y el lector pierde el sitio.
      hueco.style.minHeight = `${hueco.offsetHeight}px`;
      vis.destruir();
      montadas.delete(hueco);
      hueco.replaceChildren();
      montarPieza(hueco, idea);
    }
  };
  window.addEventListener('tema-cambiado', alCambiarTema);

  // ---- montaje diferido de visualizaciones ----
  const observadorVis = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        const hueco = e.target as HTMLElement;
        const idea = ideasCargadas.get(hueco.dataset.vis!);
        if (!idea) continue;
        const es3D = idea.visualizacion.tipo_visualizacion === 'three-js';
        if (e.isIntersecting && !montadas.has(hueco)) {
          montarPieza(hueco, idea);
        } else if (!e.isIntersecting && es3D) {
          const v = montadas.get(hueco);
          if (v) {
            hueco.style.minHeight = `${hueco.offsetHeight}px`;
            v.destruir();
            montadas.delete(hueco);
            quitarVisores.get(hueco)?.();
            quitarVisores.delete(hueco);
          }
        }
      }
    },
    { rootMargin: '300px 0px' },
  );

  // ---- carga de las ideas de una corriente al acercarse su portada ----
  const observadorIdeas = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        const caja = e.target as HTMLElement;
        const corrienteId = caja.dataset.ideasDe!;
        if (caja.dataset.cargado) continue;
        caja.dataset.cargado = 'si';
        observadorIdeas.unobserve(caja);

        void ideasDe(corrienteId).then((ideas) => {
          ideas.forEach((i) => ideasCargadas.set(i.id, i));
          caja.innerHTML = ideas
            .map((idea, k) => seccionIdea(idea, k, ideas.length, ideas[k + 1]?.id ?? null))
            .join('');
          // El hueco reservado deja de hacer falta en cuanto hay contenido real.
          caja.style.minHeight = '';
          caja.querySelectorAll<HTMLElement>('.parada').forEach((p) => observadorEstado.observe(p));
          caja.querySelectorAll<HTMLElement>('[data-vis]').forEach((h) => observadorVis.observe(h));
        });
      }
    },
    // Margen amplio: las ideas tienen que estar puestas antes de que el usuario llegue a ellas.
    { rootMargin: '1200px 0px' },
  );

  raiz.querySelectorAll<HTMLElement>('.parada').forEach((p) => observadorEstado.observe(p));
  raiz.querySelectorAll<HTMLElement>('[data-ideas-de]').forEach((c) => observadorIdeas.observe(c));

  /*
   * Cuando una pieza da su respuesta, la salida a la idea siguiente deja de ser un enlace gris al
   * final del texto.
   *
   * Es el momento en que alguien acaba de entender algo por su cuenta, y es exactamente cuando hay
   * que enseñarle que hay más: si el «ah, ya lo veo» y el «sigue por aquí» no se tocan, no hay
   * arrastre entre ideas y cada una se lee como una parada suelta.
   *
   * La pieza solo anuncia; quien marca la sección es el recorrido, que es el único que sabe que
   * existe una idea siguiente. Se escucha en la raíz porque el aviso burbujea.
   */
  raiz.addEventListener('pieza-resuelta', (e) => {
    (e.target as HTMLElement).closest('.idea')?.classList.add('resuelta');
  });

  raiz.addEventListener('click', (e) => {
    const boton = (e.target as HTMLElement).closest<HTMLButtonElement>('.ver-ficha');
    if (!boton) return;
    const ideaId = boton.closest<HTMLElement>('.idea')?.dataset.idea;
    location.hash = `#/idea/${ideaId}/autor/${boton.dataset.autor}`;
  });

  return () => {
    window.removeEventListener('tema-cambiado', alCambiarTema);
    observadorEstado.disconnect();
    observadorVis.disconnect();
    observadorIdeas.disconnect();
    montadas.forEach((v) => v.destruir());
    montadas.clear();
    quitarVisores.forEach((quitar) => quitar());
    quitarVisores.clear();
  };
}

/**
 * Fuerza la carga de la corriente que contiene una idea. Lo necesita el enrutador: un enlace directo
 * a una idea concreta llega antes de que su corriente se haya cargado por proximidad.
 */
export async function asegurarIdea(ideaId: string): Promise<void> {
  const c = corrientes.find((x) => (x.ideas as string[]).includes(ideaId));
  if (!c) return;
  const caja = document.querySelector<HTMLElement>(`[data-ideas-de="${c.id}"]`);
  if (!caja || caja.dataset.cargado) return;
  caja.scrollIntoView({ block: 'start', behavior: 'auto' });
  // El observador la cargará por proximidad; se espera a que aparezca la sección.
  await new Promise<void>((resolver) => {
    const revisar = () => {
      if (document.getElementById(`idea-${ideaId}`)) resolver();
      else requestAnimationFrame(revisar);
    };
    revisar();
  });
}
