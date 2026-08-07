/**
 * Ningún texto visible escrito dentro del código.
 *
 * POR QUÉ EXISTE ESTA COMPROBACIÓN. El mismo fallo se ha colado tres veces: seis botones en español
 * en cinco mecánicas, cuatro cadenas de micro-copia generadas con plantillas y ternarios, y veinte
 * etiquetas de accesibilidad. Cuatro de esas veinte las escribí yo mismo el mismo día en que estaba
 * arreglando las otras dieciséis. Eso no es un descuido que se corrija recordándolo: es una regla
 * que necesita quien la vigile, porque el sitio se desarrolla en español y un literal español no
 * llama la atención de nadie hasta que alguien abre la versión inglesa.
 *
 * QUÉ BUSCA. Literales con acentos o caracteres exclusivos del español dentro de `src/vis/`, allí
 * donde acaban en pantalla o en un lector de pantalla: `textContent`, `aria-label` y los rótulos.
 * Los comentarios se saltan —están escritos en español a propósito, son para quien lee el código— y
 * también las claves y los identificadores.
 *
 * Se ejecuta sin dependencias, como el resto de comprobaciones del proyecto.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DIRECTORIO = join(RAIZ, 'src', 'vis');

/** Caracteres que no aparecen en inglés y delatan una cadena redactada en español. */
const DELATORES = /[áéíóúñÁÉÍÓÚÑ¿¡«»]/;

/**
 * Palabras españolas frecuentes sin acento. Sin esto se escapan cadenas como «Poner en» o
 * «Siguiente paso», que fueron exactamente las que se colaron.
 */
const PALABRAS = /\b(el|la|los|las|un|una|de|del|que|con|sin|por|para|se|su|sus|y|o|al|en|es|no|más|como|desde|hasta|entre|sobre|cada|todo|toda|todos|todas|nada|algo|poner|retirar|quitar|volver|mostrar|cerrar|abrir|pulsar|seguir|siguiente|paso|pasos|vez|veces|ver|hacer|dejar|queda|quedan|mismo|misma|otro|otra|hay|son|esta|este|esto|sigue|falta|faltan)\b/i;

/**
 * Morfología española: participios, gerundios y sufijos que el inglés no tiene.
 *
 * Hace falta porque una lista de palabras es una carrera perdida. Se le escapó el rótulo
 * `` `${nombre}: aplicado` `` de `prueba.ts`, que llevaba desde la fase 3 saliendo en castellano en
 * la versión inglesa: no tiene acentos y «aplicado» no estaba en la lista. Enumerar cada palabra que
 * a alguien se le pueda ocurrir no funciona; reconocer la terminación sí, porque «-ado» y «-iendo»
 * delatan el idioma sin depender de que nadie se acordara de darlas de alta.
 *
 * El mínimo de dos letras antes del sufijo evita cazar etiquetas técnicas cortas.
 */
const MORFOLOGIA = /\b\w{2,}(ados?|adas?|idos?|idas?|ando|endo|ción|ciones|mente|ísimo)\b/i;

/**
 * Se miran TODOS los literales, no una lista de contextos.
 *
 * La primera versión enumeraba dónde podía acabar un texto en pantalla —`textContent`, `aria-label`,
 * `rotulo()`— y se le escapó un `Record<Estado, string>` en `descomponer` con «se cumple» / «no se
 * cumple» / «sin determinar», que llega a la pantalla por un camino que no estaba en la lista.
 * Enumerar caminos es perder: siempre queda uno. Lo que se puede acotar es el idioma.
 */
const LITERALES = /([`'"])((?:\\.|(?!\1).)*)\1/g;

/**
 * Quita lo que sí puede estar en español:
 *  - Comentarios, que son para quien lee el código.
 *  - Mensajes de `throw new Error(...)`: los ve el desarrollador en la consola, nunca el visitante.
 */
function sinComentarios(fuente) {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')
    .replace(/throw new Error\((?:[^()]|\([^()]*\))*\)/g, ' ');
}

async function ficheros(dir) {
  const salida = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...(await ficheros(ruta)));
    else if (entrada.name.endsWith('.ts')) salida.push(ruta);
  }
  return salida;
}

const problemas = [];

for (const ruta of await ficheros(DIRECTORIO)) {
  const fuente = sinComentarios(await readFile(ruta, 'utf8'));
  const lineas = fuente.split('\n');

  for (const coincidencia of fuente.matchAll(LITERALES)) {
    const texto = coincidencia[2] ?? '';
    // Una plantilla que solo interpola (`${op.x}`) no aporta texto propio y es legítima.
    const literal = texto.replace(/\$\{[^}]*\}/g, '').trim();
    if (literal.length < 3) continue;
    // Rutas de import y selectores no son prosa por mucho que contengan «de» o «la».
    if (/^[./#[\]\w-]+$/.test(literal)) continue;
    // Marcadores de sustitución: lo que los rodea es el texto, y ese sí está en la ficha.
    if (/^\{\w+\}$/.test(literal)) continue;
    if (!DELATORES.test(literal) && !PALABRAS.test(literal) && !MORFOLOGIA.test(literal)) continue;
    const linea = fuente.slice(0, coincidencia.index).split('\n').length;
    problemas.push(
      `${ruta.slice(RAIZ.length)}:${linea}  texto en el código: "${literal.slice(0, 60)}"`
      + `\n     ${(lineas[linea - 1] ?? '').trim().slice(0, 100)}`,
    );
  }
}

if (problemas.length) {
  console.error('Texto visible escrito dentro del código. Tiene que venir de la ficha:\n');
  for (const p of problemas) console.error(`  ${p}`);
  console.error(`\n${problemas.length} caso(s). El texto visible pertenece al contenido, no al código.`);
  process.exit(1);
}

console.log('Sin texto visible escrito en el código: todo viene de las fichas.');
