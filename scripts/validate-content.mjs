#!/usr/bin/env node
/**
 * Validación de la capa de contenido. Sin dependencias: se ejecuta con `node scripts/validate-content.mjs`
 * y está pensado para correr en CI antes del build.
 *
 * Comprueba, además del schema:
 *  - integridad referencial corriente <-> autor en ambos sentidos
 *  - unicidad de ids de autor y de visualización
 *  - presupuesto de escenas Three.js (regla de rendimiento, no de estilo)
 *  - paridad entre idiomas (mismos ids en es/ y en/)
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');
const IDIOMAS = ['es', 'en'];

/**
 * Durante la redacción, una idea mapeada pero aún sin ficha es un aviso, no un error: si no, cada
 * ejecución escupe decenas de errores idénticos y deja de servir para detectar los de verdad.
 * En CI y antes del build se pasa --completo, y entonces sí falla.
 */
const EXIGIR_COMPLETO = process.argv.includes('--completo');

/**
 * Tope de escenas 3D, hero aparte. Es una barrera de producción, no de descarga: el hero ya carga
 * Three.js, así que la biblioteca está pagada y una escena más apenas pesa. Lo que sí escala es
 * memoria de GPU, compilación de shaders y, sobre todo, tiempo de autoría. La restricción de
 * rendimiento que de verdad importa es "un solo contexto WebGL vivo a la vez", y esa es de runtime.
 *
 * La regla principal no es este número, sino `justificacion_3d`: una idea va en 3D solo si su
 * comprensión depende de profundidad, oclusión o punto de vista.
 */
const MAX_ESCENAS_3D = 6;

const LIMITES = {
  nivel_1_resumen: [60, 340],
  nivel_2_desarrollo: [400, 1400],
  nivel_3_experto: [700, 2200],
};

const CAMPOS_OBLIGATORIOS = [
  'id', 'nombre', 'corriente_id', 'periodo', 'region', 'preguntas_filosoficas', 'citas',
  'nivel_1_resumen', 'nivel_2_desarrollo', 'nivel_3_experto', 'fuentes',
];

const CAMPOS_IDEA = [
  'id', 'corriente_id', 'titulo', 'orden', 'autores', 'pregunta', 'cita',
  'resumen', 'desarrollo', 'ejemplo_real', 'visualizacion',
];

const ROLES = ['principal', 'contrapunto', 'convergente', 'desarrollo'];

const LIMITES_IDEA = {
  resumen: [60, 340],
  desarrollo: [400, 1400],
  ejemplo_real: [120, 700],
};

/** Regla de derechos de autor del proyecto: cita textual breve, nunca un párrafo traducido. */
const MAX_PALABRAS_CITA = 15;
const ATRIBUCIONES = ['directa', 'tradicional', 'dudosa'];

const contarPalabras = (texto) => texto.trim().split(/\s+/).filter(Boolean).length;

const TIPOS_VIS = ['svg-interactivo', 'canvas-fisica', 'three-js', 'css-animation'];

/** Deben coincidir con MECANICAS y PROPIAS de src/vis/registro.ts. */
const MECANICAS = [
  'capas', 'red', 'repeticion', 'recipientes', 'dos-figuras',
  'prueba', 'linea-temporal', 'eje', 'dos-capas', 'descomponer', 'contexto',
  'cadena', 'clasificar', 'margen',
  // Añadidas al revisar las 47 ideas con mecánica compartida contra su propia alternativa textual:
  // cada una cubre una promesa que ninguna de las anteriores podía cumplir sin desvirtuarla.
  'tres-regiones', 'dos-caminos', 'dos-recuentos', 'aferramiento',
];
const PIEZAS_PROPIAS = [
  'termino-medio', 'suspension-del-juicio', 'mundo-de-las-ideas',
  'flujo-y-permanencia', 'voluntad-y-pesimismo', 'wu-wei', 'el-numero-como-orden',
  'vista-desde-arriba', 'condiciones-a-priori', 'relatividad-de-las-perspectivas',
  'ser-es-ser-percibido', 'velo-de-la-ignorancia',
  'el-mal-como-privacion',
];
const COMPLEJIDADES = ['ligera', 'destacada'];

const errores = [];
const avisos = [];

const err = (donde, msg) => errores.push(`${donde}: ${msg}`);
const avisar = (donde, msg) => avisos.push(`${donde}: ${msg}`);

async function leerJSON(ruta) {
  return JSON.parse(await readFile(ruta, 'utf8'));
}

function validarAutor(autor, donde) {
  for (const campo of CAMPOS_OBLIGATORIOS) {
    if (autor[campo] === undefined) err(donde, `falta el campo obligatorio "${campo}"`);
  }

  for (const [campo, [min, max]] of Object.entries(LIMITES)) {
    const texto = autor[campo];
    if (typeof texto !== 'string') continue;
    if (texto.length < min) err(donde, `"${campo}" tiene ${texto.length} caracteres, mínimo ${min}`);
    if (texto.length > max) err(donde, `"${campo}" tiene ${texto.length} caracteres, máximo ${max}`);
  }

  if (!Array.isArray(autor.preguntas_filosoficas) || autor.preguntas_filosoficas.length === 0) {
    err(donde, 'preguntas_filosoficas debe tener al menos una entrada');
  }

  if (!Array.isArray(autor.citas) || autor.citas.length < 1 || autor.citas.length > 2) {
    err(donde, 'citas debe tener 1 o 2 entradas');
  } else {
    autor.citas.forEach((cita, i) => {
      if (typeof cita?.texto !== 'string' || typeof cita?.obra !== 'string') {
        err(donde, `cita ${i} debe tener "texto" y "obra"`);
        return;
      }
      const palabras = contarPalabras(cita.texto);
      if (palabras > MAX_PALABRAS_CITA) {
        err(donde, `cita ${i} tiene ${palabras} palabras, máximo ${MAX_PALABRAS_CITA} ` +
          `(regla de derechos de autor, no de estilo)`);
      }
      if (!ATRIBUCIONES.includes(cita.atribucion)) {
        err(donde, `cita ${i}: atribucion inválida ("${cita.atribucion}")`);
      }
      // Una cita que no es literal no puede presentarse sin decirlo.
      if (cita.atribucion !== 'directa' && !cita.nota) {
        err(donde, `cita ${i}: atribucion "${cita.atribucion}" exige una "nota" que lo explique`);
      }
    });
  }

  if (!Array.isArray(autor.fuentes) || autor.fuentes.length < 2) {
    err(donde, 'se exigen al menos 2 fuentes por ficha');
  } else {
    autor.fuentes.forEach((f, i) => {
      if (!f || typeof f.titulo !== 'string' || !('url' in f)) {
        err(donde, `fuente ${i} debe tener "titulo" y "url" (url puede ser null)`);
      }
    });
  }

  if (autor.visualizacion) {
    err(donde, 'la visualización ya no cuelga del autor sino de la idea (content/<lang>/ideas/)');
  }
}

/** La visualización es la misma pieza, pero ahora vive en la idea. */
// eslint-disable-next-line complexity
function validarVisualizacion(v, idea, donde) {
  if (!v || typeof v !== 'object') {
    err(donde, 'falta el objeto "visualizacion"');
    return;
  }
  if (v.idea_id !== idea.id) err(donde, `visualizacion.idea_id ("${v.idea_id}") no coincide con el id de la idea`);
  if (!TIPOS_VIS.includes(v.tipo_visualizacion)) err(donde, `tipo_visualizacion inválido: "${v.tipo_visualizacion}"`);
  if (!COMPLEJIDADES.includes(v.complejidad)) err(donde, `complejidad inválida: "${v.complejidad}"`);
  if (!Array.isArray(v.nivel_asociado) || v.nivel_asociado.length === 0) {
    err(donde, 'visualizacion.nivel_asociado debe ser un array no vacío');
  }
  if (typeof v.descripcion_interaccion !== 'string' || v.descripcion_interaccion.length < 80) {
    err(donde, 'descripcion_interaccion debe explicar qué hace el usuario y qué comprende (mín. 80 caracteres)');
  }
  /*
   * La invitación tiene TOPE, y el tope es lo que de verdad la protege.
   *
   * Es la única línea del panel que se lee antes de tocar nada, así que su trabajo es decir el gesto
   * y dónde mirar, en un vistazo. Sin máximo, la frase crece hasta explicarlo todo y acaba siendo una
   * segunda `descripcion_interaccion` —que es descriptiva, larga y escrita para el equipo— con lo que
   * el panel volvería a contar el final antes de que nadie juegue. Las 59 actuales caben en 27–57.
   */
  if (typeof v.invitacion !== 'string' || v.invitacion.length < 15 || v.invitacion.length > 70) {
    err(donde, 'falta "invitacion": una línea imperativa de 15 a 70 caracteres que diga el gesto y dónde mirar, nunca la conclusión');
  }
  // Requisito de accesibilidad: no puede quedarse para el final del proyecto.
  if (typeof v.alternativa_textual !== 'string' || v.alternativa_textual.length < 60) {
    err(donde, 'falta "alternativa_textual": qué demuestra la interacción para quien no puede usarla');
  }
  // La mecánica es la vía preferente; las piezas propias son la excepción y están listadas aquí
  // para que el validador pueda avisar cuando crecen más de la cuenta.
  if (v.mecanica) {
    if (!MECANICAS.includes(v.mecanica)) {
      err(donde, `mecánica desconocida: "${v.mecanica}" (disponibles: ${MECANICAS.join(', ')})`);
    }
    const p = v.parametros;
    if (!p || typeof p !== 'object') {
      err(donde, `la mecánica "${v.mecanica}" exige un objeto "parametros"`);
    } else {
      if (p.corrienteId !== idea.corriente_id) {
        err(donde, `parametros.corrienteId ("${p.corrienteId}") no coincide con la corriente de la idea`);
      }
      if (typeof p.resolucion !== 'string' || p.resolucion.length < 20) {
        err(donde, 'parametros.resolucion debe decir qué se ha entendido al terminar');
      }
      if (typeof p.alternativaTexto !== 'string' || p.alternativaTexto.length < 60) {
        err(donde, 'parametros.alternativaTexto es obligatorio y debe explicar qué demuestra la interacción');
      }
    }
  } else if (!PIEZAS_PROPIAS.includes(idea.id)) {
    avisar(donde, 'sin mecánica ni pieza propia: la visualización está especificada pero no implementada');
  }

  if (v.tipo_visualizacion === 'three-js') {
    if (v.complejidad !== 'destacada') {
      err(donde, 'una visualización three-js debe marcarse como "destacada"');
    }
    // El 3D se justifica por adecuación, no por cuota: hay que decir por qué no vale 2D.
    if (typeof v.justificacion_3d !== 'string' || v.justificacion_3d.length < 60) {
      err(donde, 'three-js exige "justificacion_3d": por qué la idea no se entiende igual en 2D');
    }
  } else if (v.justificacion_3d) {
    err(donde, `"justificacion_3d" solo tiene sentido en three-js (aquí es ${v.tipo_visualizacion})`);
  }
}

function validarIdea(idea, donde) {
  for (const campo of CAMPOS_IDEA) {
    if (idea[campo] === undefined) err(donde, `falta el campo obligatorio "${campo}"`);
  }

  for (const [campo, [min, max]] of Object.entries(LIMITES_IDEA)) {
    const texto = idea[campo];
    if (typeof texto !== 'string') continue;
    if (texto.length < min) err(donde, `"${campo}" tiene ${texto.length} caracteres, mínimo ${min}`);
    if (texto.length > max) err(donde, `"${campo}" tiene ${texto.length} caracteres, máximo ${max}`);
  }

  if (!Array.isArray(idea.autores) || idea.autores.length === 0) {
    err(donde, 'una idea necesita al menos un autor');
  } else {
    const principales = idea.autores.filter((a) => a.rol === 'principal').length;
    if (principales !== 1) {
      err(donde, `debe haber exactamente un autor con rol "principal" (hay ${principales})`);
    }
    idea.autores.forEach((a, i) => {
      if (!ROLES.includes(a?.rol)) err(donde, `autor ${i}: rol inválido ("${a?.rol}")`);
    });
  }

  const cita = idea.cita;
  if (!cita || typeof cita.texto !== 'string') {
    err(donde, 'falta la cita de la idea');
  } else {
    const palabras = contarPalabras(cita.texto);
    if (palabras > MAX_PALABRAS_CITA) {
      err(donde, `la cita tiene ${palabras} palabras, máximo ${MAX_PALABRAS_CITA} ` +
        `(regla de derechos de autor, no de estilo)`);
    }
    if (!ATRIBUCIONES.includes(cita.atribucion)) err(donde, `atribucion inválida ("${cita.atribucion}")`);
    if (cita.atribucion !== 'directa' && !cita.nota) {
      err(donde, `atribucion "${cita.atribucion}" exige una "nota" que lo explique`);
    }
  }

  validarVisualizacion(idea.visualizacion, idea, donde);
}

/**
 * Rutas de todas las claves de un objeto de rótulos, incluidas las que van dentro de listas.
 * Se compara el conjunto de rutas y no el objeto entero: los valores tienen que ser distintos —para
 * eso son traducciones—, pero la forma no.
 */
function clavesDe(valor, prefijo = '') {
  if (Array.isArray(valor)) {
    return valor.flatMap((v, i) => clavesDe(v, `${prefijo}[${i}]`));
  }
  if (valor && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([k, v]) => clavesDe(v, prefijo ? `${prefijo}.${k}` : k));
  }
  return [prefijo];
}

async function validarIdioma(idioma) {
  const dir = join(CONTENT, idioma);
  if (!existsSync(dir)) {
    if (idioma !== 'es') avisar(idioma, 'idioma todavía no traducido (pendiente para la fase de i18n)');
    return null;
  }

  const corrientesDoc = await leerJSON(join(dir, 'corrientes.json'));
  const archivos = (await readdir(join(dir, 'autores'))).filter((f) => f.endsWith('.json'));

  const autores = new Map();
  for (const archivo of archivos) {
    const autor = await leerJSON(join(dir, 'autores', archivo));
    const donde = `${idioma}/autores/${archivo}`;
    if (`${autor.id}.json` !== archivo) err(donde, `el id "${autor.id}" no coincide con el nombre del archivo`);
    if (autores.has(autor.id)) err(donde, `id de autor duplicado: "${autor.id}"`);
    validarAutor(autor, donde);
    autores.set(autor.id, autor);
  }

  // Integridad referencial en ambos sentidos.
  const declarados = new Set();
  const idsCorriente = new Set();
  for (const c of corrientesDoc.corrientes) {
    if (idsCorriente.has(c.id)) err(`${idioma}/corrientes.json`, `corriente duplicada: "${c.id}"`);
    idsCorriente.add(c.id);
    for (const autorId of c.autores) {
      declarados.add(autorId);
      if (!autores.has(autorId)) {
        err(`${idioma}/corrientes.json`, `la corriente "${c.id}" declara al autor "${autorId}", que no tiene ficha`);
      }
    }
  }
  for (const [id, autor] of autores) {
    if (!declarados.has(id)) err(`${idioma}/autores/${id}.json`, 'el autor no está listado en ninguna corriente');
    if (!idsCorriente.has(autor.corriente_id)) {
      err(`${idioma}/autores/${id}.json`, `corriente_id inexistente: "${autor.corriente_id}"`);
    }
  }

  // ---- Ideas: la unidad del recorrido ----
  const dirIdeas = join(dir, 'ideas');
  const ideas = new Map();
  if (existsSync(dirIdeas)) {
    for (const archivo of (await readdir(dirIdeas)).filter((f) => f.endsWith('.json'))) {
      const idea = await leerJSON(join(dirIdeas, archivo));
      const donde = `${idioma}/ideas/${archivo}`;
      if (`${idea.id}.json` !== archivo) err(donde, `el id "${idea.id}" no coincide con el nombre del archivo`);
      if (ideas.has(idea.id)) err(donde, `id de idea duplicado: "${idea.id}"`);
      validarIdea(idea, donde);
      // Toda referencia a un autor desde una idea tiene que existir.
      for (const a of idea.autores ?? []) {
        if (!autores.has(a.id)) err(donde, `referencia a un autor sin ficha: "${a.id}"`);
      }
      if (idea.cita?.autor_id && !autores.has(idea.cita.autor_id)) {
        err(donde, `la cita atribuye a "${idea.cita.autor_id}", que no tiene ficha`);
      }
      ideas.set(idea.id, idea);
    }
  }

  // Integridad corriente ↔ idea, en ambos sentidos, y orden sin huecos ni repeticiones.
  const ideasDeclaradas = new Set();
  const sinRedactar = [];
  for (const c of corrientesDoc.corrientes) {
    const listadas = c.ideas ?? [];
    if (listadas.length < 3 || listadas.length > 5) {
      err(`${idioma}/corrientes.json`, `la corriente "${c.id}" declara ${listadas.length} ideas; el cupo es 3-5`);
    }
    const ordenes = [];
    for (const ideaId of listadas) {
      ideasDeclaradas.add(ideaId);
      const idea = ideas.get(ideaId);
      if (!idea) {
        sinRedactar.push(ideaId);
        if (EXIGIR_COMPLETO) {
          err(`${idioma}/corrientes.json`, `la corriente "${c.id}" declara la idea "${ideaId}", que no tiene ficha`);
        }
        continue;
      }
      if (idea.corriente_id !== c.id) {
        err(`${idioma}/ideas/${ideaId}.json`, `corriente_id "${idea.corriente_id}" no coincide con la corriente que la lista ("${c.id}")`);
      }
      ordenes.push(idea.orden);
    }
    const esperado = ordenes.map((_, i) => i + 1).join(',');
    if (ordenes.length && [...ordenes].sort((a, b) => a - b).join(',') !== esperado) {
      err(`${idioma}/corrientes.json`, `la corriente "${c.id}" tiene el campo "orden" de sus ideas con huecos o repetido`);
    }
  }
  for (const [id, idea] of ideas) {
    if (!ideasDeclaradas.has(id)) err(`${idioma}/ideas/${id}.json`, 'la idea no está listada en ninguna corriente');
    if (!idsCorriente.has(idea.corriente_id)) {
      err(`${idioma}/ideas/${id}.json`, `corriente_id inexistente: "${idea.corriente_id}"`);
    }
  }

  if (sinRedactar.length) {
    const muestra = sinRedactar.slice(0, 4).join(', ');
    avisar(idioma, `${sinRedactar.length} de ${ideasDeclaradas.size} ideas mapeadas sin ficha todavía ` +
      `(${muestra}${sinRedactar.length > 4 ? '…' : ''}). Usa --completo para exigirlas.`);
  }

  // Los enlaces transversales entre ideas se escriben a mano: hay que comprobarlos.
  for (const [id, idea] of ideas) {
    for (const rel of idea.ideas_relacionadas ?? []) {
      if (rel === id) {
        err(`${idioma}/ideas/${id}.json`, 'una idea no puede relacionarse consigo misma');
      } else if (!ideas.has(rel) && !EXIGIR_COMPLETO && ideasDeclaradas.has(rel)) {
        // Aún sin redactar: no es un error mientras el contenido esté en curso.
      } else if (!ideas.has(rel)) {
        err(`${idioma}/ideas/${id}.json`, `ideas_relacionadas apunta a "${rel}", que no existe`);
      }
    }
  }

  // Unicidad de ids de visualización, ahora en el ámbito de las ideas.
  const vistos = new Set();
  for (const [id, idea] of ideas) {
    const vid = idea.visualizacion?.id;
    if (!vid) continue;
    if (vistos.has(vid)) err(`${idioma}/ideas/${id}.json`, `id de visualización duplicado: "${vid}"`);
    vistos.add(vid);
  }

  // Presupuesto de rendimiento.
  const escenas3d = [...ideas.values()].filter((i) => i.visualizacion?.tipo_visualizacion === 'three-js');
  if (escenas3d.length > MAX_ESCENAS_3D) {
    err(idioma, `${escenas3d.length} escenas three-js declaradas; el presupuesto son ${MAX_ESCENAS_3D}. ` +
      `Reasignar alguna a svg-interactivo: ${escenas3d.map((i) => i.id).join(', ')}`);
  }

  const citas = [...autores.values()].flatMap((a) => a.citas ?? []);
  const noLiterales = citas.filter((c) => c.atribucion !== 'directa').length;
  const fisica = [...ideas.values()].filter((i) => i.visualizacion?.tipo_visualizacion === 'canvas-fisica').length;
  const implementadas = [...ideas.values()].filter(
    (i) => i.visualizacion?.mecanica || PIEZAS_PROPIAS.includes(i.id),
  ).length;
  const porMecanica = [...ideas.values()].filter((i) => i.visualizacion?.mecanica).length;

  /*
   * Rótulos de las piezas propias. Una pieza propia sin `textos` es texto escrito en el código, y
   * eso es exactamente lo que dejó doce visualizaciones hablando en castellano dentro de la versión
   * inglesa. Aquí se exige que estén, y más abajo que las claves coincidan entre idiomas.
   */
  const rotulos = {};
  for (const [id, idea] of ideas) {
    if (!PIEZAS_PROPIAS.includes(id)) continue;
    const t = idea.visualizacion?.textos;
    if (!t) {
      err(`${idioma}/ideas/${id}.json`, 'pieza propia sin "visualizacion.textos": sus rótulos estarían en el código');
      continue;
    }
    rotulos[id] = clavesDe(t).sort();
  }

  return {
    autores: [...autores.keys()].sort(),
    corrientes: [...idsCorriente].sort(),
    rotulos,
    ideasRedactadas: ideas.size,
    ideasMapeadas: ideasDeclaradas.size,
    escenas3d: escenas3d.length,
    fisica,
    implementadas,
    porMecanica,
    citas: citas.length,
    citasNoLiterales: noLiterales,
  };
}

const resultados = {};
for (const idioma of IDIOMAS) {
  resultados[idioma] = await validarIdioma(idioma);
}

// Paridad entre idiomas.
const base = resultados.es;
for (const idioma of IDIOMAS.slice(1)) {
  const otro = resultados[idioma];
  if (!base || !otro) continue;
  const faltan = base.autores.filter((id) => !otro.autores.includes(id));
  const sobran = otro.autores.filter((id) => !base.autores.includes(id));
  if (faltan.length) err(idioma, `fichas sin traducir: ${faltan.join(', ')}`);
  if (sobran.length) err(idioma, `fichas que no existen en es: ${sobran.join(', ')}`);

  // Las claves de rótulos son un contrato con el código: si al traducir se pierde una, la pieza se
  // monta con `undefined` en un botón y no lo nota nadie hasta verlo en pantalla.
  for (const [id, claves] of Object.entries(base.rotulos)) {
    const otras = otro.rotulos[id];
    if (!otras) continue;
    const sinTraducir = claves.filter((k) => !otras.includes(k));
    const inventadas = otras.filter((k) => !claves.includes(k));
    if (sinTraducir.length) err(`${idioma}/ideas/${id}.json`, `rótulos sin traducir: ${sinTraducir.join(', ')}`);
    if (inventadas.length) err(`${idioma}/ideas/${id}.json`, `rótulos que no existen en es: ${inventadas.join(', ')}`);
  }
}

if (base) {
  console.log(`Contenido es: ${base.corrientes.length} corrientes, ` +
    `${base.ideasRedactadas}/${base.ideasMapeadas} ideas redactadas, ${base.autores.length} autores, ` +
    `${base.escenas3d}/${MAX_ESCENAS_3D} escenas 3D, ${base.fisica} de física, ` +
    `${base.citas} citas (${base.citasNoLiterales} con atribución no literal, marcadas en la interfaz).`);
  console.log(`Visualizaciones implementadas: ${base.implementadas}/${base.ideasRedactadas} ` +
    `(${base.porMecanica} por mecánica reutilizable, ${base.implementadas - base.porMecanica} con pieza propia).`);
}
for (const aviso of avisos) console.log(`AVISO  ${aviso}`);
for (const e of errores) console.error(`ERROR  ${e}`);

if (errores.length) {
  console.error(`\n${errores.length} error(es) de contenido.`);
  process.exit(1);
}
console.log('Contenido válido.');
