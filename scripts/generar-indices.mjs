#!/usr/bin/env node
/**
 * Genera los índices ligeros que necesita el arranque del sitio.
 *
 * Sin esto, la tira de autor del recorrido obligaba a cargar las **47 fichas completas** —con sus
 * tres niveles de profundidad— solo para leer el nombre y el periodo de cada una. El índice pesa
 * unos pocos kilobytes y sustituye a unos doscientos.
 *
 * Se ejecuta antes del build y también antes de `dev`, para que ambos entornos vean lo mismo.
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IDIOMAS = ['es', 'en'];
const { existsSync } = await import('node:fs');

for (const idioma of IDIOMAS) {
  const base = join(ROOT, 'content', idioma);
  // Un idioma con cadenas de interfaz pero todavía sin fichas no tiene índice que generar.
  if (!existsSync(join(base, 'autores'))) continue;

  /*
   * Se incluye la primera cita porque es el CUERPO del cromo. Sin ella, pintar la galería obligaba
   * a descargar las 47 fichas completas —con sus tres niveles de profundidad— en el arranque, para
   * una sección que está al final de la página y que casi nadie ve al llegar. Con la cita aquí, las
   * fichas solo se piden al abrir una.
   */
  const dirAutores = join(base, 'autores');
  const autores = {};
  for (const f of (await readdir(dirAutores)).filter((x) => x.endsWith('.json'))) {
    const a = JSON.parse(await readFile(join(dirAutores, f), 'utf8'));
    autores[a.id] = {
      nombre: a.nombre,
      periodo: a.periodo,
      corriente_id: a.corriente_id,
      cita: a.citas[0].texto,
    };
  }

  const dirIdeas = join(base, 'ideas');
  const ideas = {};
  if (existsSync(dirIdeas)) {
    for (const f of (await readdir(dirIdeas)).filter((x) => x.endsWith('.json'))) {
      const i = JSON.parse(await readFile(join(dirIdeas, f), 'utf8'));
      ideas[i.id] = { titulo: i.titulo, corriente_id: i.corriente_id, orden: i.orden };
    }
  }

  const salida = join(base, 'indice.json');
  const contenido = {
    $comment: 'GENERADO por scripts/generar-indices.mjs. No editar a mano.',
    autores,
    ideas,
  };
  await writeFile(salida, JSON.stringify(contenido, null, 2) + '\n', 'utf8');
  const kb = (Buffer.byteLength(JSON.stringify(contenido)) / 1024).toFixed(1);
  console.log(`${idioma}/indice.json: ${Object.keys(autores).length} autores, ${Object.keys(ideas).length} ideas (${kb} kB)`);
}
