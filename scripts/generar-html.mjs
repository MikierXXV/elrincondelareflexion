#!/usr/bin/env node
/**
 * Genera un HTML por idioma a partir de `plantilla/index.html` y las cadenas de `content/*∕ui.json`.
 *
 * POR QUÉ EXISTE. El sitio se apoya en que el titular y la entradilla están en el documento antes de
 * que cargue nada. Traducirlos con JavaScript rompería esa promesa justo para el idioma no
 * predeterminado. Y mantener dos HTML a mano garantiza que se desincronicen en cuanto alguien
 * cambie una frase en uno solo: la plantilla es la que evita esa deriva.
 *
 * Se ejecuta antes de `vite dev` y de `vite build`, y los ficheros que produce no se editan a mano.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IDIOMAS = ['es', 'en'];
const PREDETERMINADO = 'es';

/** Dónde vive cada idioma dentro del sitio. El predeterminado ocupa la raíz. */
const rutaDe = (idioma) => (idioma === PREDETERMINADO ? '' : `${idioma}/`);

/** Resuelve `documento.titulo` contra el objeto de cadenas. */
function buscar(objeto, ruta) {
  return ruta.split('.').reduce((n, clave) => (n == null ? undefined : n[clave]), objeto);
}

function escaparAtributo(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

const plantilla = await readFile(join(ROOT, 'plantilla', 'index.html'), 'utf8');
const SITIO = process.env.URL_SITIO ?? '';

/*
 * La silueta del hero la genera scripts/preparar-pensador.mjs a partir de la malla. Se inserta aquí
 * y no se importa en tiempo de ejecución porque tiene que estar en el documento desde el primer
 * pintado: es lo que sostiene el hueco mientras llega el 3D. Si falta, se sigue sin ella —el sitio
 * funciona igual— pero se avisa, porque es un fallo de procedimiento y no del contenido.
 */
let silueta = '';
try {
  silueta = (await readFile(join(ROOT, 'plantilla', 'silueta-pensador.html'), 'utf8')).trim();
} catch {
  console.warn('AVISO  sin silueta-pensador.html; ejecuta node scripts/preparar-pensador.mjs');
}

/*
 * Estilo crítico en línea: los cuatro colores del fondo y del texto, nada más.
 *
 * POR QUÉ. Una hoja externa es bloqueante y en producción llega a tiempo —medido: 0 fotogramas sin
 * estilar al recargar—, pero eso deja el primer pintado a merced de una petición de red. En el
 * servidor de desarrollo, que inyecta el CSS por JavaScript, el fallo ya es visible: un fotograma
 * completo de HTML desnudo, fondo blanco y la silueta como una mancha negra a pantalla completa.
 * Con estas reglas en el documento el primer pintado es correcto aunque la hoja no haya llegado.
 *
 * Los valores NO se escriben a mano: se leen de design/tokens.css. Un color repetido en dos sitios
 * es un color que acabará desajustándose, y este en concreto solo se ve durante 80 ms, que es
 * justo cuando nadie va a mirarlo para comprobar si sigue coincidiendo.
 */
const tokens = await readFile(join(ROOT, 'design', 'tokens.css'), 'utf8');
function colorDe(nombre, desde) {
  const bloque = tokens.slice(tokens.indexOf(desde));
  const m = bloque.match(new RegExp(`--${nombre}:\\s*([^;]+);`));
  if (!m) throw new Error(`tokens.css no define --${nombre} tras "${desde}"`);
  return m[1].trim();
}
// El primer `:root` es el tema claro; el bloque `[data-tema='oscuro']` es el oscuro explícito.
const CLARO = { fondo: colorDe('fondo', ':root'), texto: colorDe('texto', ':root') };
const OSCURO = { fondo: colorDe('fondo', ':root[data-tema="oscuro"]'), texto: colorDe('texto', ':root[data-tema="oscuro"]') };
const critico = `<style>
    html { background: ${CLARO.fondo}; color: ${CLARO.texto}; }
    @media (prefers-color-scheme: dark) { html:not([data-tema='claro']) { background: ${OSCURO.fondo}; color: ${OSCURO.texto}; } }
    html[data-tema='oscuro'] { background: ${OSCURO.fondo}; color: ${OSCURO.texto}; }
    html[data-tema='claro'] { background: ${CLARO.fondo}; color: ${CLARO.texto}; }
    body { margin: 0; }
  </style>`;

for (const idioma of IDIOMAS) {
  const ui = JSON.parse(await readFile(join(ROOT, 'content', idioma, 'ui.json'), 'utf8'));
  const otro = IDIOMAS.find((i) => i !== idioma);

  /*
   * Rutas relativas al documento, no absolutas: el sitio se sirve en la raíz durante el desarrollo y
   * bajo /<repo>/ en GitHub Pages, y una ruta absoluta solo puede acertar en uno de los dos casos.
   * Desde `/` se sube con './'; desde `/en/`, con '../'.
   */
  const arriba = idioma === PREDETERMINADO ? './' : '../';

  /*
   * Las alternativas hreflang solo se emiten con URL absoluta, y por dos razones. La primera es que
   * un hreflang relativo aporta poco a los buscadores. La segunda la descubrió el build: Vite trata
   * `href` de un `<link>` como una referencia a un recurso e intenta leerla, así que un `href="./en/"`
   * —que es un directorio— rompía la compilación con EISDIR. Una URL absoluta la deja pasar.
   */
  const alternativas = SITIO
    ? IDIOMAS.map((i) => `<link rel="alternate" hreflang="${i}" href="${SITIO}/${rutaDe(i)}">`)
      .concat(`<link rel="alternate" hreflang="x-default" href="${SITIO}/">`)
      .join('\n  ')
    : '';

  const valores = {
    lang: idioma,
    otro,
    // Los códigos del control segmentado. Salen del propio idioma y no de ui.json porque «ES» y «EN»
    // son los mismos en los dos idiomas: traducirlos sería inventar una diferencia que no existe.
    lang_corto: idioma.toUpperCase(),
    otro_corto: otro.toUpperCase(),
    entrada: `${arriba}src/main.ts`,
    estilos: `${arriba}src/estilos/sitio.css`,
    'enlace.otro': `${arriba}${rutaDe(otro)}`,
  };

  const html = plantilla.replace(/\{\{([\w.]+)\}\}/g, (original, clave) => {
    // Marcado ya formado: escaparlo lo convertiría en texto visible.
    if (clave === 'alternativas') return alternativas;
    if (clave === 'silueta') return silueta;
    if (clave === 'critico') return critico;
    const valor = valores[clave] ?? buscar(ui, clave);
    if (valor === undefined) throw new Error(`${idioma}: la plantilla pide "${clave}" y no existe en ui.json`);
    return escaparAtributo(valor);
  });

  const destino = join(ROOT, rutaDe(idioma), 'index.html');
  await mkdir(dirname(destino), { recursive: true });
  await writeFile(destino, html, 'utf8');
  console.log(`generado ${rutaDe(idioma)}index.html (${idioma})`);
}
