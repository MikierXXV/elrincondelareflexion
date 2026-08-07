#!/usr/bin/env node
/**
 * Comprueba por HTTP que las URLs de las fuentes existen.
 *
 *   node scripts/check-fuentes.mjs           # comprueba todos los idiomas
 *   node scripts/check-fuentes.mjs --json    # salida JSON (para CI)
 *
 * Reporta 4 estados por URL:
 *   OK        200 en la URL declarada
 *   REDIR     200 tras redirección (hay que actualizar la URL en la ficha)
 *   ROTA      404 u otro estado de error
 *   SIN RED   no se pudo comprobar (fallo de red, DNS, timeout)
 *
 * Las fuentes con url: null son bibliográficas y se ignoran a propósito.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');
const IDIOMAS = ['es', 'en'];

const CONCURRENCIA = 6;
const TIMEOUT_MS = 15000;
const salidaJson = process.argv.includes('--json');

async function recopilarURLs() {
  const entradas = [];
  for (const idioma of IDIOMAS) {
    const dir = join(CONTENT, idioma, 'autores');
    if (!existsSync(dir)) continue;
    for (const archivo of (await readdir(dir)).filter((f) => f.endsWith('.json'))) {
      const autor = JSON.parse(await readFile(join(dir, archivo), 'utf8'));
      for (const fuente of autor.fuentes ?? []) {
        if (!fuente.url) continue;
        entradas.push({ ficha: `${idioma}/${archivo}`, titulo: fuente.titulo, url: fuente.url });
      }
    }
  }
  return entradas;
}

async function pedir(url, metodo) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method: metodo,
      redirect: 'follow',
      signal: control.signal,
      headers: { 'User-Agent': 'elrincondelareflexion-link-check/1.0' },
    });
  } finally {
    clearTimeout(reloj);
  }
}

async function comprobar(entrada) {
  try {
    // HEAD primero; varios servidores académicos no lo soportan y responden 403/405.
    let res = await pedir(entrada.url, 'HEAD');
    if (res.status === 403 || res.status === 405 || res.status === 501) {
      res = await pedir(entrada.url, 'GET');
    }
    const finalUrl = res.url || entrada.url;
    const redirigida = finalUrl.replace(/\/$/, '') !== entrada.url.replace(/\/$/, '');
    if (!res.ok) return { ...entrada, estado: 'ROTA', codigo: res.status, finalUrl };
    return { ...entrada, estado: redirigida ? 'REDIR' : 'OK', codigo: res.status, finalUrl };
  } catch (e) {
    return { ...entrada, estado: 'SIN RED', codigo: null, detalle: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

async function enLotes(items, n, fn) {
  const resultados = [];
  for (let i = 0; i < items.length; i += n) {
    resultados.push(...(await Promise.all(items.slice(i, i + n).map(fn))));
  }
  return resultados;
}

const entradas = await recopilarURLs();
const unicas = [...new Map(entradas.map((e) => [e.url, e])).values()];

if (!salidaJson) {
  console.log(`Comprobando ${unicas.length} URLs únicas (${entradas.length} referencias en total)...\n`);
}

const resultados = await enLotes(unicas, CONCURRENCIA, comprobar);
const porEstado = (estado) => resultados.filter((r) => r.estado === estado);

if (salidaJson) {
  console.log(JSON.stringify(resultados, null, 2));
} else {
  for (const estado of ['ROTA', 'REDIR', 'SIN RED', 'OK']) {
    const grupo = porEstado(estado);
    if (!grupo.length) continue;
    console.log(`${estado} (${grupo.length})`);
    for (const r of grupo) {
      const extra = r.estado === 'REDIR' ? `  ->  ${r.finalUrl}`
        : r.estado === 'ROTA' ? `  [${r.codigo}]`
        : r.estado === 'SIN RED' ? `  (${r.detalle})` : '';
      console.log(`  ${r.url}${extra}`);
      if (r.estado !== 'OK') console.log(`      ${r.ficha} — ${r.titulo}`);
    }
    console.log('');
  }
  console.log(`Resumen: ${porEstado('OK').length} OK · ${porEstado('REDIR').length} redirigidas · ` +
    `${porEstado('ROTA').length} rotas · ${porEstado('SIN RED').length} sin comprobar.`);
}

// Solo las rotas hacen fallar el build; las redirecciones son un aviso accionable
// y "sin red" no debe romper CI en entornos sin salida a internet.
process.exit(porEstado('ROTA').length ? 1 : 0);
