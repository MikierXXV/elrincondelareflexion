#!/usr/bin/env node
/**
 * Trae, subconjunta y fija las dos tipografías del sitio.
 *
 *   node scripts/preparar-tipografias.mjs
 *
 * POR QUÉ EXISTE ESTE GUION Y NO UNA LISTA DE ÓRDENES EN UN README. Los ficheros de
 * `src/estilos/fuentes/` están recortados: no son las tipografías completas. Cualquiera que las mire
 * dentro de un año tiene que poder saber exactamente qué se les quitó y volver a producirlas, y una
 * lista de órdenes en un documento se desincroniza con lo que de verdad se ejecutó. Es el mismo
 * motivo por el que la malla del pensador tiene su `preparar-pensador.mjs`.
 *
 * QUÉ HACE, Y POR QUÉ CADA PASO.
 *
 *  1. Pide a Google Fonts el CSS de las dos familias con un agente moderno, para que devuelva woff2.
 *  2. Se queda SOLO con los subconjuntos `latin` y `latin-ext`. Se comprobó qué caracteres usa el
 *     contenido de los dos idiomas: no hay griego ni cirílico, y los 9 que caen fuera de latin son
 *     guiones, comillas tipográficas, un subíndice y dos flechas.
 *  3. Subconjunta al repertorio real MÁS UN MARGEN: latin-1 y latin extendido-A completos. El margen
 *     no es por si acaso; si mañana alguien añade una palabra con un carácter que falte, esa letra
 *     sola caería a la fuente de respaldo en mitad de la palabra, y eso se ve.
 *  4. Fija el eje de tamaño óptico y recorta el de peso a 400–600. El sitio usa exactamente los tres
 *     pesos de `design/tokens.css` y ningún tamaño óptico distinto del natural de cada familia.
 *     Mantener ejes que nadie mueve es pagar sus datos de variación para nada.
 *
 * MEDIDO: 414,9 kB tal como los sirve Google → 82,1 kB. Un visitante corriente descarga solo el par
 * `latin`, 58 kB, y con `font-display: swap` no bloquean el primer pintado.
 *
 * DEPENDENCIA. Necesita `fonttools` y `brotli` de Python, que no son dependencias del proyecto
 * porque esto se ejecuta una vez y el resultado se versiona:
 *
 *   python -m pip install "fonttools[woff]" brotli
 *
 * Licencia: Newsreader e Inter, ambas bajo SIL Open Font License 1.1. Declarado en los créditos.
 */

import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DESTINO = join(RAIZ, 'src', 'estilos', 'fuentes');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PETICION = 'https://fonts.googleapis.com/css2'
  + '?family=Newsreader:opsz,wght@6..72,400..700'
  + '&family=Inter:opsz,wght@14..32,400..700&display=swap';

/** Tamaño óptico al que se fija cada familia, según dónde se usa en el sitio. */
const OPSZ = { newsreader: 32, inter: 18 };  // titulares · texto corrido
const SUBCONJUNTOS = new Set(['latin', 'latin-ext']);

console.log('1/4  pidiendo el CSS a Google Fonts…');
const css = await fetch(PETICION, { headers: { 'User-Agent': UA } }).then((r) => r.text());

const bloques = [...css.matchAll(/\/\* ([\w-]+) \*\/\s*(@font-face \{[^}]*\})/g)]
  .map(([, sub, bloque]) => ({
    sub,
    familia: /font-family: '([^']+)'/.exec(bloque)?.[1] ?? '',
    url: /url\(([^)]+)\)/.exec(bloque)?.[1] ?? '',
    rango: /unicode-range: ([^;]+);/.exec(bloque)?.[1] ?? '',
  }))
  .filter((b) => SUBCONJUNTOS.has(b.sub));

if (bloques.length !== 4) throw new Error(`se esperaban 4 bloques latin/latin-ext y llegaron ${bloques.length}`);

await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });

console.log('2/4  descargando…');
const crudos = [];
for (const b of bloques) {
  const nombre = `${b.familia.toLowerCase()}-${b.sub}`;
  const ruta = join(DESTINO, `${nombre}.crudo.woff2`);
  await writeFile(ruta, Buffer.from(await fetch(b.url).then((r) => r.arrayBuffer())));
  crudos.push({ ...b, nombre, ruta });
}

/*
 * El repertorio se calcula aquí y se le pasa a fonttools por fichero, no por línea de órdenes: en
 * Windows, trescientos caracteres acentuados en un argumento acaban mutilados por la página de
 * códigos de la consola, y el subconjunto saldría sin las tildes sin que nadie se diera cuenta.
 */
console.log('3/4  calculando el repertorio…');
const usados = new Set();
for (const idioma of ['es', 'en']) {
  const base = join(RAIZ, 'content', idioma);
  const pila = [base];
  while (pila.length) {
    const dir = pila.pop();
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) pila.push(p);
      else if (e.name.endsWith('.json')) for (const c of await readFile(p, 'utf8')) usados.add(c);
    }
  }
}
for (const c of await readFile(join(RAIZ, 'plantilla', 'index.html'), 'utf8')) usados.add(c);

const repertorio = new Set(usados);
const rango = (a, b) => { for (let c = a; c <= b; c++) repertorio.add(String.fromCodePoint(c)); };
rango(0x20, 0x7e);    // ASCII imprimible
rango(0xa0, 0xff);    // latin-1
rango(0x100, 0x17f);  // latin extendido-A
for (const c of '‐‑‒–—‘’‚“”„†‡•…‰‹›⁄€™←↑→↓−×₂⁴') repertorio.add(c);
for (const c of '\n\r\t') repertorio.delete(c);

const texto = [...repertorio].sort().join('');
const ficheroTexto = join(DESTINO, 'repertorio.txt');
await writeFile(ficheroTexto, texto, 'utf8');
console.log(`     ${repertorio.size} caracteres (${usados.size} los usa el contenido hoy)`);

console.log('4/4  subconjuntando y fijando ejes…');
const guionPy = join(DESTINO, 'subconjuntar.py');
await writeFile(guionPy, `# -*- coding: utf-8 -*-
import io, sys, os
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

entrada, salida, ruta_texto, opsz = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
texto = io.open(ruta_texto, encoding='utf-8').read()
tmp = salida + '.tmp'
subset.main([entrada, '--text-file=' + ruta_texto, '--output-file=' + tmp, '--flavor=woff2',
             '--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk',
             '--desubroutinize', '--no-hinting', '--drop-tables+=DSIG'])
f = TTFont(tmp)
f = instancer.instantiateVariableFont(f, {'opsz': opsz, 'wght': (400, 400, 600)}, updateFontNames=False)
f.flavor = 'woff2'
f.save(salida)
os.remove(tmp)
`, 'utf8');

const caras = [];
for (const c of crudos) {
  const familia = c.familia.toLowerCase();
  const salida = join(DESTINO, `${c.nombre}.woff2`);
  execFileSync('python', [guionPy, c.ruta, salida, ficheroTexto, String(OPSZ[familia])], { stdio: 'inherit' });
  await rm(c.ruta);
  caras.push({ familia: c.familia, archivo: `${c.nombre}.woff2`, rango: c.rango });
}
await rm(guionPy);
await rm(ficheroTexto);

const cabecera = `/*
 * Tipografías del sitio, servidas desde el propio dominio.
 *
 * POR QUÉ ESTABAN SIN CARGAR HASTA AHORA. design/tokens.css declaraba «Newsreader» e «Inter» desde el
 * primer día, pero no había ni un @font-face ni un enlace en ningún sitio: las familias solo salían
 * si el visitante las tenía instaladas, y no lo están en un equipo corriente. Medido: las dos
 * resolvían a la métrica del serif y el sans genéricos. Todo el mundo veía las de respaldo.
 *
 * POR QUÉ AUTOALOJADAS. Un <link> a fonts.googleapis.com mete dos conexiones a terceros en la ruta
 * crítica y comparte la IP del visitante sin que haya nada que ganar: el sitio es estático y se
 * sirve entero desde el mismo origen.
 *
 * POR QUÉ EN src/estilos Y NO EN public. En public habría que referenciarlas en absoluto, y Vite no
 * reescribe esas rutas al cambiar la base. En GitHub Pages el sitio cuelga de /<repo>/ y darían 404
 * justo en producción, que es el único sitio donde importa.
 *
 * font-display: swap es deliberado: el texto se lee desde el primer pintado con la fuente de
 * respaldo y cambia al llegar la definitiva. Con «block» el texto se esconde hasta que llega, y en
 * un sitio de lectura eso es peor que un cambio de tipo.
 *
 * Newsreader e Inter, ambas bajo SIL Open Font License 1.1.
 *
 * GENERADO POR scripts/preparar-tipografias.mjs. No editar a mano.
 */
`;
const cuerpo = caras.map((c) => `@font-face {
  font-family: '${c.familia}';
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url('./fuentes/${c.archivo}') format('woff2');
  unicode-range: ${c.rango};
}`).join('\n\n');
await writeFile(join(RAIZ, 'src', 'estilos', 'fuentes.css'), `${cabecera}\n${cuerpo}\n`, 'utf8');

console.log('\nlisto. src/estilos/fuentes.css regenerado.');
