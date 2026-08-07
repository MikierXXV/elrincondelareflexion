#!/usr/bin/env node
/**
 * Recorrido guiado del sitio completo, para revisarlo sin abrirlo a mano.
 * Captura las pantallas clave y comprueba que la navegación responde.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const BASE = process.env.URL_BASE ?? 'http://localhost:5173/';
const SALIDA = 'capturas/sitio';

await mkdir(SALIDA, { recursive: true });
const navegador = await chromium.launch();
const problemas = [];

async function abrir(tema, ancho, alto) {
  const contexto = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    deviceScaleFactor: 2,
    colorScheme: tema === 'oscuro' ? 'dark' : 'light',
  });
  const pagina = await contexto.newPage();
  pagina.on('console', (m) => { if (m.type() === 'error') problemas.push(`[${tema}] ${m.text()}`); });
  pagina.on('pageerror', (e) => problemas.push(`[${tema}] ${e.message}`));
  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.waitForSelector('body.listo', { timeout: 30000 });
  await pagina.waitForTimeout(900);
  return { contexto, pagina };
}

async function capturar(pagina, nombre, tema) {
  await pagina.screenshot({ path: `${SALIDA}/${nombre}-${tema}.png` });
}

/*
 * El titular cabe en el primer pliegue.
 *
 * Es la comprobación que faltaba: hasta ahora se verificaba que el hero ESTUVIERA, no que se VIERA.
 * Con --t-hero a 5.5rem el titular ocupaba solo él media pantalla y los botones de entrada caían
 * fuera, así que la portada no llegaba a decir de qué va el sitio. Se mide en tres tamaños reales.
 */
for (const [ancho, alto] of [[1366, 768], [1440, 900], [1920, 1080]]) {
  const contexto = await navegador.newContext({ viewport: { width: ancho, height: alto } });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.waitForSelector('body.listo', { timeout: 30000 });
  const fondo = await pagina.locator('.entradas').boundingBox();
  if (!fondo) problemas.push(`[${ancho}x${alto}] no se encontraron los botones del hero`);
  else if (fondo.y + fondo.height > alto) {
    problemas.push(`[${ancho}x${alto}] los botones del hero caen ${Math.round(fondo.y + fondo.height - alto)} px por debajo del pliegue`);
  }
  // Y ninguna «v» suelta: el glifo ⌄ se sustituyó por una forma CSS.
  const glifos = await pagina.evaluate(() => (document.body.innerText.match(/⌄/g) ?? []).length);
  if (glifos) problemas.push(`[${ancho}x${alto}] quedan ${glifos} caracteres ⌄ en el texto`);
  await contexto.close();
}

for (const tema of ['claro', 'oscuro']) {
  const { contexto, pagina } = await abrir(tema, 1440, 900);

  await capturar(pagina, '1-hero', tema);

  /*
   * El widget no cambia de ancho al recorrer las corrientes. El nombre de la activa solo se muestra
   * en ella, y sin ancho fijo la caja se reajustaba en cada cambio: el widget «respiraba» durante
   * todo el recorrido.
   */
  const anchos = new Set();
  for (const c of ['presocraticos', 'clasica-griega', 'filosofia-islamica', 'psicologia-siglo-xx']) {
    await pagina.evaluate((id) => { location.hash = `#corriente-${id}`; }, c);
    await pagina.waitForTimeout(900);
    const caja = await pagina.locator('#widget').boundingBox();
    if (caja) anchos.add(Math.round(caja.width));
  }
  if (anchos.size > 1) problemas.push(`[${tema}] el widget cambia de ancho: ${[...anchos].join(', ')} px`);

  // Portada de una corriente
  await pagina.evaluate(() => { location.hash = '#corriente-clasica-griega'; });
  await pagina.waitForTimeout(1400);
  await capturar(pagina, '2-portada', tema);

  // Una idea, con su visualización montada
  await pagina.evaluate(() => { location.hash = '#idea-mundo-de-las-ideas'; });
  await pagina.waitForTimeout(3200);
  await capturar(pagina, '3-idea', tema);

  // Ficha de autor superpuesta desde la idea
  await pagina.evaluate(() => { location.hash = '#/idea/mundo-de-las-ideas/autor/platon'; });
  await pagina.waitForTimeout(1600);
  if (!(await pagina.locator('.capa-autor').count())) problemas.push(`[${tema}] la ficha de autor no se abrió`);
  await capturar(pagina, '4-ficha-autor', tema);

  // Modo experto dentro de la ficha
  await pagina.locator('.experto summary').click().catch(() => {});
  await pagina.waitForTimeout(600);
  await capturar(pagina, '5-modo-experto', tema);

  // Cerrar con el gesto de retroceso: debe devolver a la idea, no salir del sitio
  await pagina.goBack();
  await pagina.waitForTimeout(1200);
  if (await pagina.locator('.capa-autor').count()) problemas.push(`[${tema}] la ficha no se cerró al retroceder`);

  // Cromos con el camino
  await pagina.evaluate(() => { location.hash = '#/cromos'; });
  await pagina.waitForTimeout(2600);
  // No basta con que la sección exista: el salto tiene que aterrizar en ella. Al cruzar el recorrido
  // se cargan las ideas de las corrientes atravesadas, y sin reanclar el destino se escapa.
  const dondeCayo = await pagina.evaluate(() => {
    const hueco = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    return document.querySelector('#cromos').getBoundingClientRect().top - hueco;
  });
  if (Math.abs(dondeCayo) > 8) problemas.push(`[${tema}] el salto a los cromos cayó a ${Math.round(dondeCayo)} px del destino`);
  await capturar(pagina, '6-cromos', tema);

  /*
   * El filtro dice SIEMPRE qué se está viendo.
   *
   * Reportado por el usuario y reproducido: al filtrar, la pista seguía diciendo «señala un cromo»,
   * así que se podía pasar de 47 cromos a 2 sin una palabra en pantalla que dijera de qué corriente
   * eran. Y filtrando por bloque no se marcaba ni un hito del camino, que es precisamente el mapa de
   * corrientes. Se comprueban los dos: que el camino marque y que la pista nombre.
   */
  {
    const pista = () => pagina.locator('.pista').textContent();
    const marcados = () => pagina.locator('.hito.filtrando').count();
    const inicial = (await pista()).trim();

    await pagina.locator('.filtros button').nth(1).click();
    await pagina.waitForTimeout(400);
    if (!(await marcados())) problemas.push(`[${tema}] filtrar por bloque no marca ninguna corriente en el camino`);
    if ((await pista()).trim() === inicial) problemas.push(`[${tema}] filtrar por bloque no dice qué se está viendo`);

    await pagina.locator('.hito').nth(1).click();
    await pagina.waitForTimeout(400);
    // Apartarse: la pista no puede depender de que el puntero siga encima de algo.
    await pagina.locator('.cromos h2').hover();
    await pagina.waitForTimeout(400);
    if ((await marcados()) !== 1) problemas.push(`[${tema}] filtrar por corriente marca ${await marcados()} hitos en vez de uno`);
    if ((await pista()).trim() === inicial) problemas.push(`[${tema}] al apartar el puntero se pierde el nombre de la corriente filtrada`);

    // Y quitar el filtro devuelve las 47.
    await pagina.locator('.filtros button').first().click();
    await pagina.waitForTimeout(400);
    const visibles = await pagina.locator('.cromo:not([hidden])').count();
    if (visibles !== 47) problemas.push(`[${tema}] quitar el filtro deja ${visibles} cromos en vez de 47`);
  }

  // Señalar un cromo debe iluminar su punto en el camino
  await pagina.locator('.cromo').nth(20).hover().catch(() => {});
  await pagina.waitForTimeout(500);
  if (!(await pagina.locator('.hito.resaltado').count())) problemas.push(`[${tema}] el camino no responde al señalar un cromo`);
  await capturar(pagina, '7-camino', tema);

  console.log(`capturado el recorrido en tema ${tema}`);
  await contexto.close();
}

/*
 * La figura gira con el scroll y VUELVE EXACTAMENTE a su pose al subir.
 *
 * Se compara el lienzo entero, así que solo pasa si toda la escena —figura y polvo— es función de la
 * posición y no del reloj. Costó tres intentos: primero el polvo iba a la deriva y la imagen nunca
 * se repetía; después la interpolación, que es asintótica, dejaba la figura cada vez a una milésima
 * distinta; y por último la propia prueba fallaba a deviceScaleFactor 2, porque comparar byte a byte
 * un lienzo WebGL no es una igualdad fiable —las dos imágenes eran idénticas a la vista y diferían
 * en 145 bytes de rasterizado—. Por eso va en su propio contexto sin escalado.
 */
{
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: 'networkidle' });
  await pagina.waitForSelector('#pensador[data-listo]', { timeout: 30000 });
  await pagina.waitForTimeout(1800);

  const pose = async () => createHash('md5')
    .update(await pagina.locator('#pensador canvas').screenshot()).digest('hex');

  /*
   * Se espera a que la pose SE ESTABILICE, no un número fijo de milisegundos.
   *
   * Con una espera fija de 4 s la comprobación fallaba una de cada dos veces: la interpolación
   * termina en un ajuste al valor exacto, y nada garantiza que se haya dibujado un fotograma con ese
   * valor antes de la captura. Dos hashes iguales seguidos sí lo garantizan, y además la
   * comprobación deja de depender de lo rápido que sea la máquina, que es lo que la haría
   * intermitente en integración continua.
   */
  const poseEstable = async (plazo = 8000) => {
    const limite = Date.now() + plazo;
    let anterior = await pose();
    while (Date.now() < limite) {
      await pagina.waitForTimeout(250);
      const actual = await pose();
      if (actual === anterior) return actual;
      anterior = actual;
    }
    return anterior;
  };

  const arriba = await poseEstable();
  await pagina.evaluate(() => window.scrollTo(0, 420));
  if (await poseEstable() === arriba) problemas.push('[figura] no gira al avanzar');
  await pagina.evaluate(() => window.scrollTo(0, 0));
  if (await poseEstable() !== arriba) problemas.push('[figura] no vuelve a su pose inicial al subir');

  /*
   * Al recargar desde el hero se sigue en el hero. Se llega ahí desplazándose y volviendo, que es lo
   * que hace un usuario: si la posición guardada no se borrase al subir, la memoria de la visita
   * anterior lo devolvería al recorrido que acababa de abandonar.
   */
  await pagina.evaluate(() => window.scrollTo(0, 6000));
  await pagina.waitForTimeout(900);
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.waitForTimeout(900);
  await pagina.reload({ waitUntil: 'networkidle' });
  await pagina.waitForSelector('body.listo', { timeout: 30000 });
  await pagina.waitForTimeout(1500);
  const tras = await pagina.evaluate(() => window.scrollY);
  if (tras > 4) problemas.push(`[recarga] desde el hero no se quedó en la figura (scrollY=${tras})`);

  /*
   * Las tipografías del diseño se cargan de verdad y se usan.
   *
   * Existe porque durante todo el proyecto NO fue así: design/tokens.css declaraba «Newsreader» e
   * «Inter» y no había ningún @font-face en ninguna parte, así que solo aparecían en la máquina de
   * quien las tuviera instaladas. Nadie lo notó porque el sitio se veía razonable con las de
   * respaldo, y la página de créditos llegó a acreditar dos tipografías que no se servían.
   *
   * No basta con que `document.fonts` las liste: `check()` responde que sí incluso para familias
   * ausentes. Lo que no se puede falsear es la métrica, así que se compara la anchura del mismo
   * texto contra la familia genérica de la que caería si faltara.
   */
  const tipo = await pagina.evaluate(async () => {
    await document.fonts.ready;
    const ancho = (familia) => {
      const cv = document.createElement('canvas').getContext('2d');
      cv.font = `40px ${familia}`;
      return Math.round(cv.measureText('Veinticinco siglos WHIL').width);
    };
    return {
      newsreader: ancho('Newsreader'), serif: ancho('serif'),
      inter: ancho('Inter'), sans: ancho('sans-serif'),
      titular: getComputedStyle(document.querySelector('#hero h1')).fontFamily,
    };
  });
  if (tipo.newsreader === tipo.serif) problemas.push('[tipografía] Newsreader no se ha cargado: mide igual que el serif genérico');
  if (tipo.inter === tipo.sans) problemas.push('[tipografía] Inter no se ha cargado: mide igual que el sans genérico');
  if (!tipo.titular.includes('Newsreader')) problemas.push(`[tipografía] el titular no usa Newsreader: ${tipo.titular}`);

  /*
   * Ningún fotograma con el aspecto equivocado al recargar.
   *
   * Esta comprobación existe porque el fallo se coló dos veces seguidas. Grabado por el usuario: al
   * pulsar F5 aparecía un fotograma completo de HTML desnudo —fondo blanco en una sesión en tema
   * oscuro y la silueta del pensador en negro sólido a pantalla completa—, y las dos veces se me
   * escapó porque medía cuándo el sitio estaba *listo*, no qué se veía *mientras tanto*.
   *
   * Se muestrea sin esperar a nada y se exige lo que el usuario ve: el fondo del tema guardado desde
   * el primer instante, y la silueta tenue en vez de opaca. La fuente no entra: el servidor de
   * desarrollo inyecta el CSS por JavaScript y siempre tendrá un fotograma con la tipografía de
   * respaldo, cosa que en producción no ocurre y que además no es lo que molestaba.
   */
  await pagina.evaluate(() => localStorage.setItem('rincon:tema', 'oscuro'));
  const recarga = pagina.reload({ waitUntil: 'commit' });
  const inicio = Date.now();
  const malos = [];
  while (Date.now() - inicio < 1200) {
    const m = await pagina.evaluate(() => {
      const masa = document.querySelector('#pensador .silueta .masa');
      if (!document.querySelector('#hero h1')) return null;
      return {
        fondo: getComputedStyle(document.documentElement).backgroundColor,
        masa: masa ? Number(getComputedStyle(masa).opacity) : 0,
      };
    }).catch(() => null);
    if (m && (m.fondo !== 'rgb(20, 19, 23)' || m.masa > 0.2)) {
      malos.push(`${Date.now() - inicio}ms fondo=${m.fondo} silueta=${m.masa}`);
    }
    await pagina.waitForTimeout(12);
  }
  await recarga.catch(() => {});
  if (malos.length) problemas.push(`[recarga] ${malos.length} fotogramas sin estilar: ${malos[0]}`);

  /*
   * Y al recargar habiendo empezado el recorrido, la vuelta se OFRECE en el hero.
   *
   * Esta comprobación exigía lo contrario —que la recarga te devolviera sola a donde estabas— porque
   * eso es lo que el sitio hacía. Se cambió a propósito: recordar la posición es útil, pero moverte
   * sin avisar no lo es. Ahora la recarga deja en el hero y aparece una tercera entrada que dice a
   * dónde lleva, y decides tú. Ver `ofrecerVuelta()` en `main.ts`.
   *
   * Se comprueban las TRES cosas, porque cualquiera de ellas por separado se puede cumplir estando
   * roto: que la recarga no te mueva, que la oferta exista y nombre el sitio, y que al pulsarla
   * lleve de verdad. Quedarse en el hero es fácil si la memoria se ha perdido; lo que demuestra que
   * la funcionalidad sigue viva es el viaje completo.
   *
   * El hash se borra antes de recargar: así se mide la MEMORIA de la posición y no el enrutado, que
   * ya se comprueba por separado.
   */
  await pagina.evaluate(() => { location.hash = '#corriente-clasica-griega'; });
  await pagina.waitForTimeout(3000);
  await pagina.evaluate(() => history.replaceState(null, '', location.pathname));
  await pagina.waitForTimeout(1000);
  await pagina.reload({ waitUntil: 'networkidle' });
  await pagina.waitForSelector('body.listo', { timeout: 30000 });
  await pagina.waitForTimeout(2000);

  const trasVolver = await pagina.evaluate(() => window.scrollY);
  if (trasVolver > 4) {
    problemas.push(`[recarga] no se quedó en el hero: te movió sin pedirlo (scrollY=${trasVolver})`);
  }
  const oferta = await pagina.evaluate(() => {
    const b = document.querySelector('#hero .entradas .seguir');
    return b ? b.textContent.trim() : null;
  });
  if (!oferta) problemas.push('[recarga] no se ofrece volver a donde se estaba leyendo');
  else if (!/griega/i.test(oferta)) problemas.push(`[recarga] la oferta no nombra el sitio guardado: "${oferta}"`);

  if (oferta) await pagina.click('#hero .entradas .seguir');
  await pagina.waitForTimeout(8000);
  const desvioVuelta = await pagina.evaluate(() => {
    const hueco = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const el = document.querySelector('#corriente-clasica-griega');
    return el ? el.getBoundingClientRect().top - hueco : NaN;
  });
  if (!(Math.abs(desvioVuelta) < 8)) {
    problemas.push(`[recarga] la oferta no llevó a la corriente que se estaba leyendo (desvío ${Math.round(desvioVuelta)} px)`);
  }

  console.log('comprobado el giro de la figura y la vuelta al recargar');
  await contexto.close();
}

/*
 * Inglés. No se recorre entero: lo que hay que comprobar aquí no es el diseño —es el mismo— sino
 * que el árbol de contenido en inglés carga, que el titular viene ya en el HTML y no lo pone
 * JavaScript, y que el conmutador conserva la posición de lectura.
 */
{
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const pagina = await contexto.newPage();
  pagina.on('pageerror', (e) => problemas.push(`[en] ${e.message}`));

  // Sin JavaScript: el titular tiene que estar en el documento servido.
  const respuesta = await pagina.request.get(`${BASE}en/`);
  const crudo = await respuesta.text();
  if (!crudo.includes('Twenty-five centuries')) problemas.push('[en] el titular no viene en el HTML servido');
  if (!/<html lang="en"/.test(crudo)) problemas.push('[en] el documento no declara lang="en"');

  await pagina.goto(`${BASE}en/`, { waitUntil: 'networkidle' });
  await pagina.waitForSelector('body.listo', { timeout: 30000 });
  await pagina.waitForTimeout(1200);
  await capturar(pagina, '10-hero', 'en');

  await pagina.evaluate(() => { location.hash = '#idea-mundo-de-las-ideas'; });
  await pagina.waitForTimeout(3200);
  const titulo = await pagina.locator('#idea-mundo-de-las-ideas h3').textContent().catch(() => null);
  if (titulo !== 'The world of Forms') problemas.push(`[en] la idea no cargó en inglés (título: ${titulo})`);
  await capturar(pagina, '11-idea', 'en');

  /*
   * El conmutador cambia de idioma SIN RECARGAR. Se marca el documento actual: si hubiera
   * navegación, la marca se perdería. Es la comprobación que distingue «funciona» de «funciona como
   * se diseñó», porque una recarga también acabaría mostrando el texto correcto.
   */
  const destino = await pagina.locator('#idioma').getAttribute('href');
  if (!destino?.endsWith('#idea-mundo-de-las-ideas')) problemas.push(`[en] el conmutador pierde la posición: ${destino}`);
  await pagina.evaluate(() => { window.__sinRecargar = true; });
  await pagina.locator('#idioma').click();
  await pagina.waitForSelector('body.listo', { timeout: 30000 });
  await pagina.waitForTimeout(7000);

  // La idea que se estaba leyendo tiene que quedar donde se dejó, no medio tapada por la barra.
  const desvio = await pagina.evaluate(() => {
    const hueco = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const el = document.querySelector('#idea-mundo-de-las-ideas');
    return el ? el.getBoundingClientRect().top - hueco : NaN;
  });
  if (!(Math.abs(desvio) < 8)) problemas.push(`[en] tras cambiar de idioma la idea quedó a ${Math.round(desvio)} px de su sitio`);

  if (!(await pagina.evaluate(() => window.__sinRecargar === true))) {
    problemas.push('[en] cambiar de idioma recargó la página en vez de remontar en el sitio');
  }
  const enEspanol = await pagina.locator('#idea-mundo-de-las-ideas h3').textContent().catch(() => null);
  if (enEspanol !== 'El mundo de las Ideas') problemas.push(`[en] cambiar de idioma no devolvió a la misma idea (título: ${enEspanol})`);
  const lang = await pagina.evaluate(() => document.documentElement.lang);
  if (lang !== 'es') problemas.push(`[en] el documento no actualizó su idioma declarado: lang="${lang}"`);
  const ruta = await pagina.evaluate(() => location.pathname + location.hash);
  if (ruta.includes('/en/')) problemas.push(`[en] la dirección sigue apuntando al inglés: ${ruta}`);
  if (!ruta.endsWith('#idea-mundo-de-las-ideas')) problemas.push(`[en] la dirección perdió la idea: ${ruta}`);
  const titularEs = await pagina.locator('#hero h1').textContent();
  if (!titularEs?.startsWith('Veinticinco')) problemas.push(`[en] el titular no se tradujo: ${titularEs}`);

  await capturar(pagina, '12-tras-conmutar', 'es');

  console.log('capturado el sitio en inglés');
  await contexto.close();
}

// Móvil
const { contexto, pagina } = await abrir('claro', 390, 844);
await capturar(pagina, '8-movil-hero', 'claro');
await pagina.evaluate(() => { location.hash = '#idea-termino-medio'; });
await pagina.waitForTimeout(2600);
await capturar(pagina, '9-movil-idea', 'claro');
await contexto.close();

await navegador.close();

if (problemas.length) {
  console.error('\nProblemas:');
  problemas.forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}
console.log('\nEl sitio responde: recorrido, ficha superpuesta, retroceso y cromos.');
