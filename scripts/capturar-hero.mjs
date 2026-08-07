#!/usr/bin/env node
/** Captura solo el hero, para iterar rápido sobre la figura sin recorrer el sitio entero. */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.URL_BASE ?? 'http://localhost:5173/';
await mkdir('capturas/sitio', { recursive: true });
const navegador = await chromium.launch();

for (const tema of ['claro', 'oscuro']) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2,
    colorScheme: tema === 'oscuro' ? 'dark' : 'light',
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.waitForSelector('#pensador canvas', { timeout: 20000 }).catch(() => {});
  await pagina.waitForTimeout(2000);
  await pagina.locator('#pensador').screenshot({ path: `capturas/sitio/0-pensador-${tema}.png` });
  console.log(`pensador ${tema}`);
  await contexto.close();
}
await navegador.close();
