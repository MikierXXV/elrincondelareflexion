#!/usr/bin/env node
/**
 * Prepara la malla del hero a partir del escaneo original.
 *
 * POR QUÉ ES UN SCRIPT Y NO UNA SERIE DE COMANDOS SUELTOS. La licencia CC BY obliga a declarar las
 * modificaciones hechas sobre el original, y una lista de comandos escrita en un README se
 * desincroniza del fichero real en cuanto alguien repite el proceso con otros parámetros. Aquí el
 * procedimiento *es* la documentación: lo que dice este fichero es exactamente lo que se hizo.
 *
 * Entrada:  assets/the_thinker_by_auguste_rodin.glb  (Rigsters, CC BY — ver assets/CREDITOS.md)
 * Salida:   public/pensador.glb
 *
 * Las tres operaciones, y por qué:
 *
 *  1. FUERA LAS TEXTURAS. Son fotogrametría: color y sombras del bronce real capturados con su luz
 *     de aquel día. El hero ilumina la figura con luz propia, así que esas texturas no solo sobran
 *     —pelearían con ella—. Es también el 90 % del peso del fichero.
 *  2. DIEZMAR. 51k triángulos no son un problema para renderizar, pero sí para descargar. Se baja a
 *     25k con métrica de error, que preserva la silueta: en una figura vista a 420 px lo único que
 *     de verdad importa es el contorno.
 *  3. CUANTIZAR Y COMPRIMIR con meshopt: posiciones y normales pasan de float32 a enteros, y el
 *     resultado se comprime. El decodificador son ~25 kB frente a los más de 100 kB de Draco.
 *
 * Uso: node scripts/preparar-pensador.mjs
 */

import { NodeIO } from '@gltf-transform/core';
import { siluetaDesde } from './silueta.mjs';
import { EXTMeshoptCompression, KHRMaterialsUnlit } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, quantize, reorder } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { stat, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = join(ROOT, 'assets', 'the_thinker_by_auguste_rodin.glb');
const DESTINO = join(ROOT, 'public', 'pensador.glb');

/** Objetivo de triángulos. Ver la nota 2 de arriba. */
const RATIO = 0.5;
/** Error máximo admitido al simplificar, relativo al tamaño de la malla. */
const ERROR = 0.002;

const kB = (n) => `${(n / 1024).toFixed(0)} kB`;

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

/*
 * El codificador va como DEPENDENCIA del I/O, no basta con crear la extensión: gltf-transform
 * separa «este documento usa meshopt» de «con qué implementación se codifica», y sin la segunda
 * parte el escritor revienta al llegar a los búferes.
 */
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMaterialsUnlit])
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const documento = await io.read(ORIGEN);
const raiz = documento.getRoot();

const antes = (await stat(ORIGEN)).size;
const trisAntes = raiz.listMeshes()
  .flatMap((m) => m.listPrimitives())
  .reduce((n, p) => n + (p.getIndices()?.getCount() ?? 0) / 3, 0);

/*
 * La silueta para el estado de carga.
 *
 * Se extrae de la MISMA malla y desde la MISMA dirección que usa la cámara del hero, así que el
 * contorno que se dibuja mientras carga coincide con la figura que aparece después. Dibujado a
 * mano no coincidiría, y el cambio se vería como un salto.
 */
const DIRECCION_CAMARA = [0.5, 0.16, 1]; // debe coincidir con src/vis/hero-pensador.ts

const triangulos = [];
for (const malla of raiz.listMeshes()) {
  for (const primitiva of malla.listPrimitives()) {
    const pos = primitiva.getAttribute('POSITION');
    const idx = primitiva.getIndices();
    if (!pos || !idx) continue;
    for (let i = 0; i < idx.getCount(); i += 3) {
      triangulos.push([0, 1, 2].map((k) => pos.getElement(idx.getScalar(i + k), [])));
    }
  }
}

/*
 * La malla viene con la rotación que le puso Sketchfab en el nodo raíz, y las posiciones del
 * accessor están sin transformar: proyectar directamente da la figura tumbada. Se aplica la matriz
 * de mundo del nodo que la contiene.
 */
const nodo = raiz.listNodes().find((n) => n.getMesh());
if (nodo) {
  const m = nodo.getWorldMatrix();
  for (const tri of triangulos) {
    for (const p of tri) {
      const [x, y, z] = p;
      p[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
      p[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
      p[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    }
  }
}

const trazos = siluetaDesde(triangulos, DIRECCION_CAMARA);
/*
 * QUÉ ES ESTA SILUETA Y QUÉ NO ES.
 *
 * Se probaron seis direcciones de proyección y ninguna produce un contorno reconocible: al contrario
 * que una figura en carrera, El Pensador es una masa compacta y lo que lo hace identificable es el
 * modelado, no el perfil. Así que la silueta NO se usa como retrato, que era la idea inicial y no
 * funcionaba.
 *
 * Se usa para lo que sí sirve: sostener el hueco con la forma y la proporción correctas mientras
 * llega la malla, y dar algo que dibujar. El contorno se traza solo —la misma entrada que usan las
 * 59 visualizaciones— y la masa queda detrás, muy tenue. Cuando la escena está lista, se funde.
 *
 * `evenodd` convierte los contornos interiores en huecos de verdad en vez de en manchas superpuestas.
 *
 * LA OPACIDAD VA EN EL MARCADO, no solo en la hoja de estilos. Es un atributo de presentación, así
 * que el CSS lo sigue ganando cuando llega y el diseño no cambia; lo que cambia es qué se ve si no
 * llega. Grabado en el servidor de desarrollo: un fotograma con el HTML desnudo mostraba esta masa
 * en negro sólido y a pantalla completa, porque `currentColor` sin CSS es negro y la opacidad de
 * 0.1 vivía únicamente en la hoja. Declarada aquí, el peor caso posible es un contorno tenue.
 */
const d = trazos.map((t) => `<path d="${t}"/>`).join('');
const svg = `<svg class="silueta" viewBox="0 0 100 100" aria-hidden="true">`
  + `<g class="masa" fill="currentColor" fill-rule="evenodd" opacity="0.1">${d}</g>`
  + `<g class="linea" fill="none" stroke="currentColor" stroke-width="0.4" stroke-linejoin="round">${d}</g>`
  + `</svg>`;
await writeFile(join(ROOT, 'plantilla', 'silueta-pensador.html'), `${svg}\n`, 'utf8');


/*
 * 1. Fuera el material y todo lo que solo existía para él.
 *
 * Se desengancha la textura de cada ranura y se descartan los atributos que solo servían para
 * mapearla. Sin normal map, las tangentes no describen nada; sin textura, las UV tampoco. `prune`
 * después se lleva las imágenes y los muestreadores que quedan sin dueño.
 */
for (const material of raiz.listMaterials()) {
  material.setBaseColorTexture(null);
  material.setNormalTexture(null);
  material.setMetallicRoughnessTexture(null);
  material.setEmissiveTexture(null);
  material.setOcclusionTexture(null);
}
for (const malla of raiz.listMeshes()) {
  for (const primitiva of malla.listPrimitives()) {
    for (const atributo of ['TEXCOORD_0', 'TEXCOORD_1', 'TANGENT', 'COLOR_0']) {
      primitiva.setAttribute(atributo, null);
    }
  }
}

/*
 * 2. Soldar antes de simplificar.
 *
 * No es opcional: el escaneo llega con vértices duplicados en cada costura, y el simplificador trata
 * una costura como un borde de la malla que no puede colapsar. Sin soldar primero, la reducción se
 * queda muy corta y además deja grietas.
 */
await documento.transform(
  weld({ tolerance: 0.0001 }),
  simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: ERROR }),
  dedup(),
  prune({ keepAttributes: false, keepLeaves: false }),
  // Reordenar por localidad de caché antes de comprimir: mejora el render y también la compresión.
  reorder({ encoder: MeshoptEncoder }),
  quantize({ quantizePosition: 14, quantizeNormal: 10 }),
);

documento.createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

await mkdir(dirname(DESTINO), { recursive: true });
await io.write(DESTINO, documento);

const despues = (await stat(DESTINO)).size;
const trisDespues = raiz.listMeshes()
  .flatMap((m) => m.listPrimitives())
  .reduce((n, p) => n + (p.getIndices()?.getCount() ?? 0) / 3, 0);

console.log(`triángulos  ${trisAntes.toLocaleString()} → ${trisDespues.toLocaleString()}`);
console.log(`fichero     ${kB(antes)} → ${kB(despues)}`);
console.log(`texturas    ${raiz.listTextures().length} (deben ser 0: la figura lleva bronce propio)`);
console.log(`silueta     ${trazos.length} contornos, ${kB(svg.length)} de marcado`);
