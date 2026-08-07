/**
 * Galería de visualizaciones implementadas.
 *
 * Banco de pruebas de producción: monta todas las piezas ya construidas, con su idea y su corriente,
 * para revisarlas juntas. Es donde se detecta si una mecánica nueva se sale del sistema, y donde se
 * comprueba que el mismo gesto sirve a ideas de tradiciones distintas.
 */

import './estilos/prototipos.css';
import corrientesDoc from '../content/es/corrientes.json';
import { crearVisualizacion, IDS_PROPIAS, type FichaVisualizacion } from './vis/registro';
import type { Visualizacion } from './vis/lenguaje';
// La galería es el banco de pruebas del sitio: si aquí no se ofrece el visor, la comprobación de
// legibilidad en móvil estaría midiendo una pieza que en el sitio real sí tiene salida.
import { habilitarVisor } from './app/visor';
import { cargarTextos } from './app/textos';

interface FichaIdea {
  id: string;
  titulo: string;
  corriente_id: string;
  pregunta: string;
  visualizacion: FichaVisualizacion & { mecanica?: string; tipo_visualizacion: string; invitacion: string };
  autores: { id: string; rol: string }[];
}

// Vite resuelve esto en build: cada ficha entra como módulo aparte y solo se pide la que hace falta.
const FICHAS = import.meta.glob<{ default: FichaIdea }>('../content/es/ideas/*.json');

const CLAVE_TEMA = 'rincon:tema';
const vivas: Visualizacion[] = [];

const nombreCorriente = (id: string) =>
  corrientesDoc.corrientes.find((c) => c.id === id)?.nombre ?? id;

const ordenCorriente = (id: string) =>
  corrientesDoc.corrientes.find((c) => c.id === id)?.orden_cronologico ?? 99;

async function cargarIdeas(): Promise<FichaIdea[]> {
  const ideas = await Promise.all(Object.values(FICHAS).map(async (cargar) => (await cargar()).default));
  return ideas.sort((a, b) => ordenCorriente(a.corriente_id) - ordenCorriente(b.corriente_id));
}

function seccion(idea: FichaIdea): { nodo: HTMLElement; hueco: HTMLElement } {
  const nodo = document.createElement('section');
  nodo.className = 'pieza';

  const h2 = document.createElement('h2');
  h2.textContent = idea.titulo;

  const meta = document.createElement('p');
  meta.className = 'meta';
  const tecnica = idea.visualizacion.mecanica
    ? `mecánica «${idea.visualizacion.mecanica}»`
    : 'pieza propia';
  meta.textContent = `${tecnica} · ${nombreCorriente(idea.corriente_id)}`;

  const pregunta = document.createElement('p');
  pregunta.className = 'pregunta';
  pregunta.textContent = idea.pregunta;

  const hueco = document.createElement('div');
  hueco.className = 'superficie';

  nodo.append(h2, meta, pregunta, hueco);
  return { nodo, hueco };
}

/**
 * Montaje diferido con IntersectionObserver.
 *
 * La primera versión montaba las 59 de golpe, y con eso la galería tenía **seis contextos WebGL
 * vivos a la vez**: exactamente lo que la regla de rendimiento del proyecto prohíbe. En el recorrido
 * real cada idea es su propia pantalla, así que el problema era del banco de pruebas, pero un banco
 * que se salta la norma que debe verificar no sirve. Ahora cada pieza se crea al entrar en pantalla
 * y las escenas 3D se destruyen al salir.
 */
async function montar(): Promise<void> {
  while (vivas.length) vivas.pop()!.destruir();

  const contenedor = document.querySelector<HTMLElement>('#galeria')!;
  contenedor.replaceChildren();

  const ideas = await cargarIdeas();
  const implementadas = ideas.filter((i) => i.visualizacion.mecanica || esPropia(i.id));

  document.querySelector<HTMLElement>('#recuento')!.textContent =
    `${implementadas.length} de ${ideas.length} visualizaciones implementadas`;

  const montadas = new Map<HTMLElement, Visualizacion>();
  const es3D = (idea: FichaIdea) => idea.visualizacion.tipo_visualizacion === 'three-js';
  const porHueco = new Map<HTMLElement, FichaIdea>();

  for (const idea of implementadas) {
    const { nodo, hueco } = seccion(idea);
    contenedor.append(nodo);
    porHueco.set(hueco, idea);
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        const hueco = e.target as HTMLElement;
        const idea = porHueco.get(hueco);
        if (!idea) continue;

        if (e.isIntersecting && !montadas.has(hueco)) {
          // El banco enseña la pieza como la ve el lector, invitación incluida. Ver `recorrido.ts`.
          const linea = document.createElement('p');
          linea.className = 'vis-invitacion';
          linea.textContent = idea.visualizacion.invitacion;
          hueco.prepend(linea);
          void crearVisualizacion(idea.id, idea.visualizacion, hueco)
            .then((v) => {
              montadas.set(hueco, v); vivas.push(v); hueco.style.minHeight = '';
              habilitarVisor(hueco);
            })
            .catch((err: Error) => {
              const fallo = document.createElement('p');
              fallo.className = 'vis-respaldo';
              fallo.textContent = `No se pudo montar: ${err.message}`;
              hueco.append(fallo);
            });
        } else if (!e.isIntersecting && es3D(idea)) {
          // Solo las 3D se desmontan al salir: liberar el contexto WebGL es lo que importa.
          const v = montadas.get(hueco);
          if (v) {
            // Reservar el hueco antes de vaciarlo. Sin esto la sección colapsa, todo lo que hay
            // debajo salta hacia arriba y el scroll se vuelve inutilizable justo al recorrer.
            hueco.style.minHeight = `${hueco.offsetHeight}px`;
            v.destruir();
            montadas.delete(hueco);
          }
        }
      }
    },
    { rootMargin: '200px 0px' },
  );

  for (const hueco of porHueco.keys()) observador.observe(hueco);
}

const esPropia = (id: string): boolean => IDS_PROPIAS.includes(id);

function aplicarTema(tema: 'claro' | 'oscuro'): void {
  document.documentElement.dataset.tema = tema;
  localStorage.setItem(CLAVE_TEMA, tema);
}

const guardado = localStorage.getItem(CLAVE_TEMA);
if (guardado === 'claro' || guardado === 'oscuro') aplicarTema(guardado);

/*
 * Las cadenas de interfaz se cargan ANTES de montar. La galería no las necesitaba mientras solo
 * pintaba piezas, pero el visor rotula su botón desde la ficha de idioma como todo lo visible del
 * sitio, y sin esto `T` es nulo y el botón nunca llega a colgarse: el banco de pruebas dejaría de
 * parecerse al sitio justo en lo que se quiere comprobar.
 */
await cargarTextos();

document.querySelector<HTMLButtonElement>('#alternar-tema')!.addEventListener('click', () => {
  const actual = document.documentElement.dataset.tema
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
  aplicarTema(actual === 'claro' ? 'oscuro' : 'claro');
  void montar();
});

void montar();
