#!/usr/bin/env node
/**
 * Captura la galeria completa de visualizaciones implementadas, en ambos temas.
 * Sirve para revisar de una sola pasada que ninguna pieza se sale del sistema.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:5173/galeria.html';
const SALIDA = 'capturas';

await mkdir(SALIDA, { recursive: true });

const navegador = await chromium.launch();
const problemas = [];

for (const tema of ['claro', 'oscuro']) {
  const contexto = await navegador.newContext({
    viewport: { width: 1280, height: 1400 },
    deviceScaleFactor: 2,
    colorScheme: tema === 'oscuro' ? 'dark' : 'light',
  });
  const pagina = await contexto.newPage();
  pagina.on('console', (m) => { if (m.type() === 'error') problemas.push(`[${tema}] consola: ${m.text()}`); });
  pagina.on('pageerror', (e) => problemas.push(`[${tema}] excepcion: ${e.message}`));

  await pagina.goto(URL_BASE, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(2600);
  await pagina.screenshot({ path: `${SALIDA}/galeria-${tema}.png`, fullPage: true });
  console.log(`capturado: galeria-${tema}`);
  await contexto.close();
}

await navegador.close();

if (problemas.length) {
  console.error('\nProblemas detectados:');
  problemas.forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}
console.log('\nSin errores de consola ni excepciones.');
