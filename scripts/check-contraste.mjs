#!/usr/bin/env node
/**
 * Valida el sistema de color contra WCAG 2.1 AA, en tema claro y oscuro.
 *
 *   node scripts/check-contraste.mjs             # informe y salida 1 si algo falla
 *   node scripts/check-contraste.mjs --sugerir   # además propone el color más cercano que sí pasa
 *
 * Existe porque "dark mode no es invertir colores": un acento que funciona sobre papel casi nunca
 * funciona sobre fondo oscuro. Por eso cada corriente declara dos valores, y aquí se comprueban.
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const sugerir = process.argv.includes('--sugerir');

const tokens = JSON.parse(await readFile(join(ROOT, 'design/tokens.json'), 'utf8'));
const corrientes = JSON.parse(await readFile(join(ROOT, 'content/es/corrientes.json'), 'utf8'));

// ---- color ----

const hexARgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const rgbAHex = (rgb) =>
  '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0').toUpperCase()).join('');

/** Luminancia relativa según la definición de WCAG. */
function luminancia(hex) {
  const [r, g, b] = hexARgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// ---- conversión para poder ajustar solo la luminosidad y conservar el tono ----

function rgbAHsl(hex) {
  const [r, g, b] = hexARgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslAHex(h, s, l) {
  if (s === 0) return rgbAHex([l * 255, l * 255, l * 255]);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const canal = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return rgbAHex([canal(h + 1 / 3) * 255, canal(h) * 255, canal(h - 1 / 3) * 255]);
}

/** Busca el color más cercano con el mismo tono que alcance el umbral, moviendo solo la luminosidad. */
function sugerirColor(hex, fondo, umbral) {
  const [h, s, l0] = rgbAHsl(hex);
  const aclarar = luminancia(fondo) < 0.5;
  for (let paso = 1; paso <= 100; paso++) {
    const l = aclarar ? Math.min(1, l0 + paso * 0.005) : Math.max(0, l0 - paso * 0.005);
    const cand = hslAHex(h, s, l);
    if (contraste(cand, fondo) >= umbral) return cand;
    if (l === 0 || l === 1) break;
  }
  return null;
}

// ---- comprobaciones ----

const UMBRAL_TEXTO = tokens.umbrales_contraste.texto_normal;
const UMBRAL_UI = tokens.umbrales_contraste.elemento_ui;

const fallos = [];
const filas = [];

function comprobar(etiqueta, color, fondo, umbral, tema) {
  const ratio = contraste(color, fondo);
  const pasa = ratio >= umbral;
  const fila = { etiqueta, tema, color, fondo, ratio, umbral, pasa, sugerencia: null };
  if (!pasa && sugerir) fila.sugerencia = sugerirColor(color, fondo, umbral);
  if (!pasa) fallos.push(fila);
  filas.push(fila);
  return fila;
}

// 1. Colores base de cada tema.
//    "separador" no se comprueba: WCAG 1.4.11 exige 3:1 al borde solo cuando es el único indicador
//    del componente. Una línea divisoria decorativa no lo es, y forzarla a 3:1 la volvería un tajo.
for (const [tema, t] of Object.entries(tokens.temas)) {
  if (tema.startsWith('$')) continue;
  comprobar('texto', t.texto, t.fondo, UMBRAL_TEXTO, tema);
  comprobar('texto_secundario', t.texto_secundario, t.fondo, UMBRAL_TEXTO, tema);
  comprobar('texto sobre elevado', t.texto, t.fondo_elevado, UMBRAL_TEXTO, tema);
  comprobar('texto sobre hundido', t.texto, t.fondo_hundido, UMBRAL_TEXTO, tema);
  comprobar('borde_interactivo', t.borde_interactivo, t.fondo, UMBRAL_UI, tema);
  comprobar('foco', t.foco, t.fondo, UMBRAL_UI, tema);
}

// 2. Los 16 acentos de corriente, en ambos temas.
let acentosSinDesdoblar = 0;
for (const c of corrientes.corrientes) {
  const acento = c.color_acento;
  if (typeof acento === 'string') {
    acentosSinDesdoblar++;
    comprobar(`acento ${c.id}`, acento, tokens.temas.claro.fondo, UMBRAL_TEXTO, 'claro');
    comprobar(`acento ${c.id}`, acento, tokens.temas.oscuro.fondo, UMBRAL_TEXTO, 'oscuro');
  } else {
    comprobar(`acento ${c.id}`, acento.claro, tokens.temas.claro.fondo, UMBRAL_TEXTO, 'claro');
    comprobar(`acento ${c.id}`, acento.oscuro, tokens.temas.oscuro.fondo, UMBRAL_TEXTO, 'oscuro');
  }
}

// 3. Los acentos deben distinguirse entre sí: si dos corrientes vecinas se confunden, el color
//    deja de orientar y solo decora.
const MIN_DISTANCIA_TONO = 12; // grados
const tonos = corrientes.corrientes.map((c) => {
  const hex = typeof c.color_acento === 'string' ? c.color_acento : c.color_acento.claro;
  return { id: c.id, tono: Math.round(rgbAHsl(hex)[0] * 360) };
});
const colisiones = [];
for (let i = 0; i < tonos.length; i++) {
  for (let j = i + 1; j < tonos.length; j++) {
    const d = Math.min(Math.abs(tonos[i].tono - tonos[j].tono), 360 - Math.abs(tonos[i].tono - tonos[j].tono));
    if (d < MIN_DISTANCIA_TONO) colisiones.push(`${tonos[i].id} y ${tonos[j].id} (${d}° de diferencia)`);
  }
}

// ---- informe ----

const marca = (f) => (f.pasa ? 'OK  ' : 'FALLA');
console.log('Contraste WCAG 2.1 AA\n');
for (const tema of ['claro', 'oscuro']) {
  console.log(`── tema ${tema} ──`);
  for (const f of filas.filter((x) => x.tema === tema)) {
    const linea = `  ${marca(f)} ${f.ratio.toFixed(2).padStart(5)}:1 (min ${f.umbral})  ${f.color}  ${f.etiqueta}`;
    console.log(f.sugerencia ? `${linea}\n         → prueba ${f.sugerencia} (${contraste(f.sugerencia, f.fondo).toFixed(2)}:1)` : linea);
  }
  console.log('');
}

if (acentosSinDesdoblar) {
  console.log(`AVISO  ${acentosSinDesdoblar} corrientes declaran un único color_acento. ` +
    `Cada una necesita { "claro", "oscuro" }: el mismo color no funciona sobre papel y sobre fondo oscuro.\n`);
}
if (colisiones.length) {
  console.log('AVISO  acentos demasiado próximos en tono:');
  colisiones.forEach((c) => console.log(`  ${c}`));
  console.log('');
}

console.log(`${filas.length - fallos.length}/${filas.length} comprobaciones superadas.`);
if (fallos.length) {
  console.error(`\n${fallos.length} fallo(s) de contraste.` + (sugerir ? '' : ' Ejecuta con --sugerir para ver alternativas.'));
  process.exit(1);
}
