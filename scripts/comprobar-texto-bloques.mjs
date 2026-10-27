#!/usr/bin/env node
/**
 * Comprueba que pasar una ficha a bloques no cambia su texto (DECISIONES.md, «El texto»).
 *
 *   node scripts/comprobar-texto-bloques.mjs          # contra main
 *   node scripts/comprobar-texto-bloques.mjs <ref>    # contra otra rama o commit
 *
 * Para cada idea y cada autor, en es y en en, compara la ficha de la rama actual con la de <ref>:
 *  - los campos que pasan a párrafos, unidos con un espacio, tienen que dar EXACTAMENTE la cadena de antes;
 *  - el resto de la ficha tiene que ser idéntico, salvo `analogia`, que es el único campo nuevo.
 *
 * Es el equivalente de comprobar-texto-fichas.mjs de mentalista, pero sobre el JSON y no sobre la
 * página: no levanta servidor ni navegador, así que se puede correr con la RAM justa. Lo que se pinta
 * se comprueba aparte, en la QA (DECISIONES.md, «Lista de comprobación»).
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const REF = process.argv[2] ?? 'main';
const PARTIDOS = { ideas: ['desarrollo'], autores: ['nivel_2_desarrollo', 'nivel_3_experto'] };
const NUEVOS = ['analogia'];

const antes = (ruta) => {
  try {
    return JSON.parse(execFileSync('git', ['show', `${REF}:${ruta}`], { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    return null;
  }
};

let fallos = 0;
let enBloques = 0;
let total = 0;
for (const idioma of ['es', 'en']) {
  for (const [tipo, campos] of Object.entries(PARTIDOS)) {
    for (const archivo of readdirSync(join(RAIZ, 'content', idioma, tipo)).filter((f) => f.endsWith('.json'))) {
      const ruta = `content/${idioma}/${tipo}/${archivo}`;
      const ahora = JSON.parse(readFileSync(join(RAIZ, ruta), 'utf8'));
      const viejo = antes(ruta);
      total++;
      if (!viejo) { console.log(`nueva ${ruta}: no existe en ${REF}, no hay con qué comparar`); continue; }
      const problemas = [];
      let partida = false;
      for (const c of campos) {
        const v = ahora[c];
        if (Array.isArray(v)) partida = true;
        const unido = Array.isArray(v) ? v.join(' ') : v;
        if (unido !== viejo[c]) problemas.push(`${c} no reproduce el texto de ${REF}`);
      }
      const resto = (d) => Object.fromEntries(Object.entries(d).filter(([k]) => !campos.includes(k) && !NUEVOS.includes(k)));
      if (!isDeepStrictEqual(resto(ahora), resto(viejo))) {
        const tocados = Object.keys({ ...resto(ahora), ...resto(viejo) }).filter((k) => !isDeepStrictEqual(ahora[k], viejo[k]));
        problemas.push(`cambian otros campos: ${tocados.join(', ')}`);
      }
      if (partida) enBloques++;
      if (problemas.length) { fallos++; console.log(`FALLO ${ruta}: ${problemas.join('; ')}`); }
    }
  }
}
console.log(`${total} fichas revisadas contra ${REF}: ${enBloques} en bloques, ${fallos} con el texto cambiado.`);
process.exit(fallos ? 1 : 0);
