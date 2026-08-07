/**
 * Acceso a la capa de contenido.
 *
 * Estrategia de carga de la fase 2 §6: en el bundle inicial entran las corrientes y un índice
 * ligero; las ideas se piden **agrupadas por corriente** —no una petición por idea, que con 59
 * sería peor— y las fichas de autor solo al abrirlas.
 *
 * IDIOMA. Los globs abarcan `content/*` y no `content/es`, de modo que cada idioma queda en sus
 * propios trozos y **solo se descarga el que se está leyendo**. Por eso las corrientes ya no son un
 * `import` estático: hay que elegir el árbol antes de tenerlas, y `iniciarContenido()` es ese punto.
 * La alternativa —importar los dos idiomas y quedarse con uno— metía las corrientes y el índice de
 * ambos en el bundle inicial, que es justo el presupuesto que costó trabajo bajar.
 */

import { idioma } from './idioma';

export interface Cita {
  texto: string;
  obra: string;
  atribucion: 'directa' | 'tradicional' | 'dudosa';
  nota?: string;
}

export interface AutorEnIdea {
  id: string;
  rol: 'principal' | 'contrapunto' | 'convergente' | 'desarrollo';
  aporte?: string;
}

export interface Idea {
  id: string;
  corriente_id: string;
  titulo: string;
  orden: number;
  autores: AutorEnIdea[];
  pregunta: string;
  cita: Cita & { autor_id: string };
  resumen: string;
  desarrollo: string;
  ejemplo_real: string;
  matiz_experto?: string;
  visualizacion: {
    id: string;
    tipo_visualizacion: string;
    mecanica?: string;
    parametros?: unknown;
    /** La línea imperativa que se pinta sobre el dibujo. Ver `invitacion()` en el recorrido. */
    invitacion: string;
    alternativa_textual: string;
  };
  ideas_relacionadas?: string[];
}

export interface Autor {
  id: string;
  nombre: string;
  corriente_id: string;
  periodo: string;
  region: string;
  preguntas_filosoficas: string[];
  dialogo_filosofico?: string;
  citas: Cita[];
  nivel_1_resumen: string;
  nivel_2_desarrollo: string;
  nivel_3_experto: string;
  debate_abierto?: string;
  fuentes: { titulo: string; url: string | null }[];
}

/** La forma la fija el castellano, que es el original; el inglés tiene que encajar en ella. */
type DocCorrientes = typeof import('../../content/es/corrientes.json');
export type Corriente = DocCorrientes['corrientes'][number];

/**
 * Corrientes y bloques quedan disponibles de forma síncrona **después** de `iniciarContenido()`.
 * Se declaran con `let` y enlace vivo en vez de envolverlos en una función porque los consumidores
 * los recorren en bucles de plantilla, y `corrientes()` en cada iteración solo añadiría ruido.
 */
export let corrientes: Corriente[] = [];
export let bloques: DocCorrientes['bloques'] = [];

const DOCS_CORRIENTES = import.meta.glob<{ default: DocCorrientes }>('../../content/*/corrientes.json');
const FICHAS_IDEA = import.meta.glob<{ default: Idea }>('../../content/*/ideas/*.json');
const FICHAS_AUTOR = import.meta.glob<{ default: Autor }>('../../content/*/autores/*.json');
const INDICES = import.meta.glob<{ default: Indice }>('../../content/*/indice.json');

const cacheIdeas = new Map<string, Idea>();
const cacheAutores = new Map<string, Autor>();

/**
 * Carga el árbol del idioma actual. **Es reejecutable**: al cambiar de idioma sin recargar hay que
 * vaciar las cachés, o se serviría contenido del idioma anterior a quien vuelva sobre sus pasos.
 */
export async function iniciarContenido(): Promise<void> {
  cacheIdeas.clear();
  cacheAutores.clear();
  indice = null;

  const cargar = DOCS_CORRIENTES[`../../content/${idioma}/corrientes.json`];
  if (!cargar) throw new Error(`Sin contenido para el idioma "${idioma}"`);
  const doc = (await cargar()).default;
  corrientes = [...doc.corrientes].sort((a, b) => a.orden_cronologico - b.orden_cronologico);
  bloques = doc.bloques;
}

async function cargarIdea(id: string): Promise<Idea> {
  const cacheada = cacheIdeas.get(id);
  if (cacheada) return cacheada;
  const cargar = FICHAS_IDEA[`../../content/${idioma}/ideas/${id}.json`];
  if (!cargar) throw new Error(`Idea desconocida: ${id}`);
  const idea = (await cargar()).default;
  cacheIdeas.set(id, idea);
  return idea;
}

/** Las ideas de una corriente, en su orden. Se piden juntas: una petición por parada, no 59. */
export async function ideasDe(corrienteId: string): Promise<Idea[]> {
  const c = corrientes.find((x) => x.id === corrienteId);
  if (!c) throw new Error(`Corriente desconocida: ${corrienteId}`);
  const ideas = await Promise.all(c.ideas.map(cargarIdea));
  return ideas.sort((a, b) => a.orden - b.orden);
}

export async function autor(id: string): Promise<Autor> {
  const cacheado = cacheAutores.get(id);
  if (cacheado) return cacheado;
  const cargar = FICHAS_AUTOR[`../../content/${idioma}/autores/${id}.json`];
  if (!cargar) throw new Error(`Autor desconocido: ${id}`);
  const a = (await cargar()).default;
  cacheAutores.set(id, a);
  return a;
}

/** Todas las fichas de autor del idioma activo. */
export async function todosLosAutores(): Promise<Autor[]> {
  const prefijo = `../../content/${idioma}/autores/`;
  const lista = await Promise.all(
    Object.entries(FICHAS_AUTOR)
      .filter(([ruta]) => ruta.startsWith(prefijo))
      .map(async ([, c]) => (await c()).default),
  );
  for (const a of lista) cacheAutores.set(a.id, a);
  const orden = new Map(corrientes.map((c, i) => [c.id, i]));
  return lista.sort((a, b) => (orden.get(a.corriente_id) ?? 99) - (orden.get(b.corriente_id) ?? 99));
}

/**
 * Índice ligero, generado en build por scripts/generar-indices.mjs.
 *
 * Antes la tira de autor obligaba a cargar las 47 fichas completas —con sus tres niveles— solo para
 * leer el nombre y el periodo. El índice pesa 10 kB y sustituye a unos doscientos.
 */
type Indice = typeof import('../../content/es/indice.json');

let indice: Indice | null = null;

export async function cargarIndice(): Promise<void> {
  if (indice) return;
  const cargar = INDICES[`../../content/${idioma}/indice.json`];
  if (!cargar) throw new Error(`Sin índice para el idioma "${idioma}"`);
  indice = (await cargar()).default;
}

export const nombreAutor = (id: string): string =>
  indice?.autores[id as keyof Indice['autores']]?.nombre ?? id.replace(/-/g, ' ');
export const periodoAutor = (id: string): string =>
  indice?.autores[id as keyof Indice['autores']]?.periodo ?? '';
export const tituloIdea = (id: string): string =>
  indice?.ideas[id as keyof Indice['ideas']]?.titulo ?? id.replace(/-/g, ' ');

export interface ResumenAutor {
  id: string;
  nombre: string;
  periodo: string;
  corriente_id: string;
  cita: string;
}

/** Los 47 cromos, desde el índice: sin descargar una sola ficha completa. */
export function resumenAutores(): ResumenAutor[] {
  if (!indice) return [];
  const orden = new Map(corrientes.map((c, i) => [c.id, i]));
  return Object.entries(indice.autores)
    .map(([id, a]) => ({ id, ...a }))
    .sort((a, b) => (orden.get(a.corriente_id) ?? 99) - (orden.get(b.corriente_id) ?? 99));
}

export const corrientePorId = (id: string): Corriente | undefined =>
  corrientes.find((c) => c.id === id);

export const nombreCorriente = (id: string): string => corrientePorId(id)?.nombre ?? id;
