/**
 * Registro de visualizaciones: dado el id de una idea, entrega su pieza.
 *
 * Dos formas de resolverse, y la primera debe ser la mayoritaria:
 *
 *  1. **Mecánica parametrizada.** La ficha declara `visualizacion.mecanica` y `parametros`, y aquí
 *     solo se despacha. El parecido de familia queda garantizado por construcción en vez de por
 *     disciplina, y añadir una idea no toca código.
 *  2. **Pieza propia.** Solo cuando la idea no encaja en ninguna mecánica. Son las excepciones
 *     justificadas, no el caso general.
 *
 * Todo se carga con import() dinámico: el recorrido no descarga la visualización de una idea hasta
 * que el usuario entra en ella.
 */

import type { Visualizacion } from './lenguaje';

/** Firma común: cada mecánica recibe su contenedor y los parámetros que declara la ficha. */
type Fabrica = (contenedor: HTMLElement, parametros: unknown) => Visualizacion | Promise<Visualizacion>;

const MECANICAS: Record<string, () => Promise<Fabrica>> = {
  capas: async () => {
    const m = await import('./mecanicas/capas');
    return (c, p) => m.crearCapas(c, p as Parameters<typeof m.crearCapas>[1]);
  },
  red: async () => {
    const m = await import('./mecanicas/red');
    return (c, p) => m.crearRed(c, p as Parameters<typeof m.crearRed>[1]);
  },
  repeticion: async () => {
    const m = await import('./mecanicas/repeticion');
    return (c, p) => m.crearRepeticion(c, p as Parameters<typeof m.crearRepeticion>[1]);
  },
  recipientes: async () => {
    const m = await import('./mecanicas/recipientes');
    return (c, p) => m.crearRecipientes(c, p as Parameters<typeof m.crearRecipientes>[1]);
  },
  'dos-figuras': async () => {
    const m = await import('./mecanicas/dos-figuras');
    return (c, p) => m.crearDosFiguras(c, p as Parameters<typeof m.crearDosFiguras>[1]);
  },
  prueba: async () => {
    const m = await import('./mecanicas/prueba');
    return (c, p) => m.crearPrueba(c, p as Parameters<typeof m.crearPrueba>[1]);
  },
  'linea-temporal': async () => {
    const m = await import('./mecanicas/linea-temporal');
    return (c, p) => m.crearLineaTemporal(c, p as Parameters<typeof m.crearLineaTemporal>[1]);
  },
  eje: async () => {
    const m = await import('./mecanicas/eje');
    return (c, p) => m.crearEje(c, p as Parameters<typeof m.crearEje>[1]);
  },
  'dos-capas': async () => {
    const m = await import('./mecanicas/dos-capas');
    return (c, p) => m.crearDosCapas(c, p as Parameters<typeof m.crearDosCapas>[1]);
  },
  descomponer: async () => {
    const m = await import('./mecanicas/descomponer');
    return (c, p) => m.crearDescomponer(c, p as Parameters<typeof m.crearDescomponer>[1]);
  },
  contexto: async () => {
    const m = await import('./mecanicas/contexto');
    return (c, p) => m.crearContexto(c, p as Parameters<typeof m.crearContexto>[1]);
  },
  cadena: async () => {
    const m = await import('./mecanicas/cadena');
    return (c, p) => m.crearCadena(c, p as Parameters<typeof m.crearCadena>[1]);
  },
  clasificar: async () => {
    const m = await import('./mecanicas/clasificar');
    return (c, p) => m.crearClasificar(c, p as Parameters<typeof m.crearClasificar>[1]);
  },
  margen: async () => {
    const m = await import('./mecanicas/margen');
    return (c, p) => m.crearMargen(c, p as Parameters<typeof m.crearMargen>[1]);
  },
  'tres-regiones': async () => {
    const m = await import('./mecanicas/tres-regiones');
    return (c, p) => m.crearTresRegiones(c, p as Parameters<typeof m.crearTresRegiones>[1]);
  },
  'dos-caminos': async () => {
    const m = await import('./mecanicas/dos-caminos');
    return (c, p) => m.crearDosCaminos(c, p as Parameters<typeof m.crearDosCaminos>[1]);
  },
  'dos-recuentos': async () => {
    const m = await import('./mecanicas/dos-recuentos');
    return (c, p) => m.crearDosRecuentos(c, p as Parameters<typeof m.crearDosRecuentos>[1]);
  },
  aferramiento: async () => {
    const m = await import('./mecanicas/aferramiento');
    return (c, p) => m.crearAferramiento(c, p as Parameters<typeof m.crearAferramiento>[1]);
  },
};

/**
 * Piezas con implementación propia, indexadas por id de idea.
 *
 * Reciben sus rótulos igual que las mecánicas reciben sus parámetros: desde la ficha. Antes los
 * llevaban escritos dentro, y al traducir el sitio quedaron doce piezas hablando en español dentro
 * de la versión inglesa. El texto visible pertenece al contenido, no al código.
 */
type FabricaPropia = (c: HTMLElement, textos: unknown) => Visualizacion | Promise<Visualizacion>;

const PROPIAS: Record<string, () => Promise<FabricaPropia>> = {
  'termino-medio': async () => {
    const m = await import('./termino-medio');
    return (c, t) => m.crearTerminoMedio(c, t as Parameters<typeof m.crearTerminoMedio>[1]);
  },
  'suspension-del-juicio': async () => {
    const m = await import('./suspension-del-juicio');
    return (c, t) => m.crearSuspensionDelJuicio(c, t as Parameters<typeof m.crearSuspensionDelJuicio>[1]);
  },
  'mundo-de-las-ideas': async () => {
    const m = await import('./mundo-de-las-ideas');
    return (c, t) => m.crearMundoDeLasIdeas(c, t as Parameters<typeof m.crearMundoDeLasIdeas>[1]);
  },
  // Simulaciones de física: cada una necesita su propio integrador, así que no hay mecánica común.
  'flujo-y-permanencia': async () => {
    const m = await import('./flujo-y-permanencia');
    return (c, t) => m.crearFlujoYPermanencia(c, t as Parameters<typeof m.crearFlujoYPermanencia>[1]);
  },
  'voluntad-y-pesimismo': async () => {
    const m = await import('./voluntad-y-pesimismo');
    return (c, t) => m.crearVoluntadYPesimismo(c, t as Parameters<typeof m.crearVoluntadYPesimismo>[1]);
  },
  'wu-wei': async () => {
    const m = await import('./wu-wei');
    return (c, t) => m.crearWuWei(c, t as Parameters<typeof m.crearWuWei>[1]);
  },
  // Fenómeno de luz: la demostración está en que las dos mitades se vean iguales, y eso no se
  // parametriza sobre ninguna mecánica. Ver la cabecera del módulo.
  'el-mal-como-privacion': async () => {
    const m = await import('./el-mal-como-privacion');
    return (c, t) => m.crearElMalComoPrivacion(c, t as Parameters<typeof m.crearElMalComoPrivacion>[1]);
  },
  'el-numero-como-orden': async () => {
    const m = await import('./el-numero-como-orden');
    return (c, t) => m.crearElNumeroComoOrden(c, t as Parameters<typeof m.crearElNumeroComoOrden>[1]);
  },
  // Escenas 3D: piezas de autor por definición. Comparten andamiaje en escena3d.ts.
  'vista-desde-arriba': async () => {
    const m = await import('./vista-desde-arriba');
    return (c, t) => m.crearVistaDesdeArriba(c, t as Parameters<typeof m.crearVistaDesdeArriba>[1]);
  },
  'condiciones-a-priori': async () => {
    const m = await import('./condiciones-a-priori');
    return (c, t) => m.crearCondicionesAPriori(c, t as Parameters<typeof m.crearCondicionesAPriori>[1]);
  },
  'relatividad-de-las-perspectivas': async () => {
    const m = await import('./relatividad-de-las-perspectivas');
    return (c, t) => m.crearRelatividadDeLasPerspectivas(c, t as Parameters<typeof m.crearRelatividadDeLasPerspectivas>[1]);
  },
  'ser-es-ser-percibido': async () => {
    const m = await import('./ser-es-ser-percibido');
    return (c, t) => m.crearSerEsSerPercibido(c, t as Parameters<typeof m.crearSerEsSerPercibido>[1]);
  },
  'velo-de-la-ignorancia': async () => {
    const m = await import('./velo-de-la-ignorancia');
    return (c, t) => m.crearVeloDeLaIgnorancia(c, t as Parameters<typeof m.crearVeloDeLaIgnorancia>[1]);
  },
};

export interface FichaVisualizacion {
  id: string;
  mecanica?: string;
  parametros?: unknown;
  /** Rótulos de una pieza propia. Las mecánicas los llevan dentro de `parametros`. */
  textos?: unknown;
}

export function tieneVisualizacion(ideaId: string, vis: FichaVisualizacion | undefined): boolean {
  return Boolean(PROPIAS[ideaId] ?? (vis?.mecanica && MECANICAS[vis.mecanica]));
}

/**
 * Instancia la visualización de una idea. La pieza propia tiene prioridad: si una idea acaba
 * necesitando tratamiento particular, basta con añadirla a PROPIAS sin tocar su ficha.
 */
export async function crearVisualizacion(
  ideaId: string,
  vis: FichaVisualizacion | undefined,
  contenedor: HTMLElement,
): Promise<Visualizacion> {
  const propia = PROPIAS[ideaId];
  if (propia) {
    const fabrica = await propia();
    return fabrica(contenedor, vis?.textos);
  }

  if (!vis?.mecanica) throw new Error(`La idea "${ideaId}" no declara mecánica ni tiene pieza propia`);
  const cargar = MECANICAS[vis.mecanica];
  if (!cargar) throw new Error(`Mecánica desconocida en "${ideaId}": ${vis.mecanica}`);

  const fabrica = await cargar();
  return fabrica(contenedor, vis.parametros);
}

export const MECANICAS_DISPONIBLES = Object.keys(MECANICAS);

/** Ids con implementación propia. Se exporta para no duplicar la lista en la galería. */
export const IDS_PROPIAS = Object.keys(PROPIAS);
