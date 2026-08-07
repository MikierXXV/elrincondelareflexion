/**
 * Cadenas de interfaz.
 *
 * Se exponen como un **objeto tipado** (`T.recorrido.ver_ficha`) y no como claves en cadena
 * (`t('recorrido.ver_ficha')`). La diferencia importa: con el objeto, una clave mal escrita o una que
 * exista en español y falte en inglés es un error de compilación, mientras que con claves en cadena
 * aparecería en producción como el literal `recorrido.ver_ficha` en mitad de la página.
 *
 * El tipo lo fija el fichero castellano, que es el original; el inglés tiene que encajar en él.
 */

import { idioma } from './idioma';

export type Textos = typeof import('../../content/es/ui.json');

const FICHEROS = import.meta.glob<{ default: Textos }>('../../content/*/ui.json');

/**
 * Se inicializa antes de montar nada. No es opcional en la práctica, así que se declara no nulo y se
 * deja que reviente pronto y con claridad si alguien la usa antes de tiempo, en vez de sembrar
 * `undefined` por toda la interfaz.
 */
export let T: Textos = null as unknown as Textos;

export async function cargarTextos(): Promise<void> {
  const cargar = FICHEROS[`../../content/${idioma}/ui.json`];
  if (!cargar) throw new Error(`Sin cadenas de interfaz para el idioma "${idioma}"`);
  T = (await cargar()).default;
}

/**
 * Sustituye los huecos `{nombre}` de una plantilla.
 *
 * Los textos con variables se guardan como frase completa —`"{corriente} · idea {n} de {total}"`— y
 * no troceados en fragmentos que el código concatena. Concatenar obliga a que todos los idiomas
 * compartan el orden de las palabras, y en cuanto uno no lo hace la frase sale del revés.
 */
export function con(plantilla: string, valores: Record<string, string | number>): string {
  return plantilla.replace(/\{(\w+)\}/g, (original, clave: string) =>
    clave in valores ? String(valores[clave]) : original,
  );
}
