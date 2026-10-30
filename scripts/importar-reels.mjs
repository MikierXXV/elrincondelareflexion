#!/usr/bin/env node
/**
 * Importa al sitio los reels de `videos-cortos` (reel/reels/rincon-<id>).
 *
 * Cada reel ya trae su versión web hecha por `reel/reels/rincon-kit/web.mjs`
 * (`rincon-<id>-web.mp4`, 720×1280, ≤ 5 MB, y los pósters `-web.webp` y `-web-mini.webp`). Aquí no se
 * transcodifica nada: se copian a `public/reels/`, se comprueba el tope de peso y se escribe:
 *   - `src/datos/reels.json`: manifiesto ligero (id, idea, título, duración, pósters). Va en el bundle
 *     y es lo único que necesitan la ficha de la idea y el carrusel para pintar la fachada.
 *   - `public/reels/<id>.json`: descripción, transcripción y fuentes. Se pide solo al desplegar el
 *     detalle de un reel, para no cargar ~6 kB de texto por reel en el arranque.
 *
 * Se puede reejecutar sin duplicar nada: un reel cuyo origen no ha cambiado (misma huella) no se copia
 * otra vez, y los que aún no tienen versión web se ignoran sin error. Necesita `ffprobe` en el PATH.
 *
 *   npm run importar-reels                 # importa lo nuevo o cambiado
 *   npm run importar-reels -- --forzar     # copia todo de nuevo
 *   REELS_ORIGEN=D:/otra/carpeta npm run importar-reels
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = process.env.REELS_ORIGEN ?? 'C:/Users/migue/videos-cortos/reel/reels';
const DESTINO = join(RAIZ, 'public', 'reels');
const MANIFIESTO = join(RAIZ, 'src', 'datos', 'reels.json');
const FORZAR = process.argv.includes('--forzar');

/** Tope por vídeo (DECISIONES.md §2). */
const TOPE_BYTES = 5 * 1024 * 1024;

/**
 * Reel → idea a la que pertenece. El orden es el del reparto (DECISIONES.md §1); la web los reordena
 * por corriente al pintarlos. Cada carpeta de origen se llama `rincon-<id>` y el id es el de la idea.
 */
const REELS = [
  'principio-del-dano',
  'condicionamiento-operante',
  'wu-wei',
  'limite-del-placer',
  'imperativo-categorico',
  'mala-fe',
  'significado-como-uso',
  'velo-de-la-ignorancia',
  'critica-de-la-causalidad',
  'saber-que-no-se-sabe',
];

function duracion(ruta) {
  const salida = execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', ruta,
  ]).toString();
  return Number.parseFloat(salida);
}

/** Quita emojis, marcas de markdown y espacios sobrantes. */
function limpiar(texto) {
  return texto
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{20E3}]/gu, '')
    .replace(/\*\*?|`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Primer párrafo que sigue a un rótulo en negrita de post.md. */
function apartado(post, rotulo) {
  const lineas = post.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => l.startsWith('**') && l.toLowerCase().includes(rotulo));
  if (inicio < 0) return '';
  const parrafo = [];
  for (const linea of lineas.slice(inicio + 1)) {
    if (!linea.trim()) {
      if (parrafo.length) break;
      continue;
    }
    if (linea.startsWith('**')) break;
    parrafo.push(linea);
  }
  return limpiar(parrafo.join(' '));
}

function leerPost(carpeta) {
  const ruta = join(carpeta, 'post.md');
  if (!existsSync(ruta)) return { titulo: '', descripcion: '', fuentes: '' };
  const post = readFileSync(ruta, 'utf8');
  const fuentes = post.split(/\r?\n/).find((l) => l.startsWith('Fuentes:'));
  return {
    titulo: apartado(post, 'título'),
    descripcion: apartado(post, 'alt text'),
    fuentes: fuentes ? limpiar(fuentes.replace(/^Fuentes:\s*/, '')) : '',
  };
}

/** Lo que dice la voz, frase a frase; sirve de transcripción. */
function leerTranscripcion(carpeta) {
  const ruta = join(carpeta, 'guion.json');
  if (!existsSync(ruta)) return { titulo: '', frases: [] };
  const guion = JSON.parse(readFileSync(ruta, 'utf8'));
  return {
    titulo: limpiar(guion.titulo ?? ''),
    frases: (guion.frases ?? []).map((f) => limpiar(f.texto ?? '')).filter(Boolean),
  };
}

/** Huella del contenido: el tamaño y la fecha no sirven si se copia el origen a otra máquina. */
function huellaDe(rutas) {
  const h = createHash('sha1');
  for (const r of rutas) h.update(readFileSync(r));
  return h.digest('hex').slice(0, 16);
}

const anterior = existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, 'utf8')) : { reels: [] };
const previos = new Map(anterior.reels.map((r) => [r.id, r]));
mkdirSync(DESTINO, { recursive: true });
mkdirSync(dirname(MANIFIESTO), { recursive: true });

const reels = [];
const resumen = { nuevos: [], actualizados: [], iguales: [], pendientes: [], excedidos: [] };

for (const id of REELS) {
  const carpeta = join(ORIGEN, `rincon-${id}`);
  const salida = join(carpeta, 'salida');
  const origen = {
    video: join(salida, `rincon-${id}-web.mp4`),
    poster: join(salida, `rincon-${id}-web.webp`),
    miniatura: join(salida, `rincon-${id}-web-mini.webp`),
  };
  if (!Object.values(origen).every(existsSync)) {
    resumen.pendientes.push(id);
    continue;
  }
  if (statSync(origen.video).size > TOPE_BYTES) {
    resumen.excedidos.push(id);
    continue;
  }

  const destino = {
    video: join(DESTINO, `${id}.mp4`),
    poster: join(DESTINO, `${id}.webp`),
    miniatura: join(DESTINO, `${id}-mini.webp`),
    detalle: join(DESTINO, `${id}.json`),
  };
  const huella = huellaDe(Object.values(origen));
  const previo = previos.get(id);
  const intactos = Object.values(destino).every(existsSync);
  const cambiado = FORZAR || !previo || previo.huella !== huella || !intactos;

  const post = leerPost(carpeta);
  const voz = leerTranscripcion(carpeta);
  const segundos = duracion(origen.video);

  if (cambiado) {
    for (const clave of ['video', 'poster', 'miniatura']) copyFileSync(origen[clave], destino[clave]);
    (previo ? resumen.actualizados : resumen.nuevos).push(id);
  } else {
    resumen.iguales.push(id);
  }

  // El detalle se reescribe siempre: es texto, cuesta nada y así sigue a post.md y guion.json.
  writeFileSync(
    destino.detalle,
    `${JSON.stringify({ descripcion: post.descripcion, transcripcion: voz.frases, fuentes: post.fuentes }, null, 2)}\n`,
  );

  reels.push({
    id,
    idea: id,
    titulo: post.titulo || voz.titulo,
    duracion: Math.round(segundos),
    video: `reels/${id}.mp4`,
    poster: `reels/${id}.webp`,
    miniatura: `reels/${id}-mini.webp`,
    detalle: `reels/${id}.json`,
    bytes: statSync(destino.video).size,
    huella,
  });
}

writeFileSync(
  MANIFIESTO,
  `${JSON.stringify({ nota: 'Generado por scripts/importar-reels.mjs; no se edita a mano.', reels }, null, 2)}\n`,
);

console.log(
  `✓ ${reels.length} reels en src/datos/reels.json` +
    ` · nuevos: ${resumen.nuevos.length}` +
    ` · actualizados: ${resumen.actualizados.length}` +
    ` · sin cambios: ${resumen.iguales.length}` +
    (resumen.pendientes.length ? `\n  Sin versión web aún (${resumen.pendientes.length}): ${resumen.pendientes.join(', ')}` : '') +
    (resumen.excedidos.length ? `\n  ✗ Pasan de 5 MB (${resumen.excedidos.length}): ${resumen.excedidos.join(', ')}` : ''),
);
if (resumen.excedidos.length) process.exitCode = 1;
