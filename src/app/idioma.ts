/**
 * Selección de idioma (fase 2 §7).
 *
 * **Basado en ficheros, no en traducción en tiempo de ejecución**: no hay un diccionario que se
 * superponga al castellano, sino dos árboles de contenido paralelos —`content/es/` y `content/en/`—
 * y un fichero de cadenas de interfaz por idioma. La consecuencia práctica es que el inglés no es
 * una capa sobre el español: una idea puede redactarse con otro ejemplo si el original no viaja bien,
 * y el validador comprueba que ambos árboles tengan los mismos identificadores.
 *
 * EL IDIOMA ESTÁ EN LA RUTA, no en una consulta ni en localStorage: `/` es español y `/en/` inglés,
 * y cada uno tiene **su propio HTML** con el titular ya escrito. Esto no es purismo de URLs. Todo el
 * sitio se apoya en que el texto está en el documento antes de que cargue nada; si el inglés lo
 * pusiera JavaScript, quien lo leyera vería el titular en español durante los primeros cientos de
 * milisegundos —y bajo CPU lenta, casi un segundo—, que es exactamente el fallo que la carga
 * diferida de las visualizaciones existe para evitar. Dos documentos lo resuelven de raíz, y de paso
 * dan a cada idioma una dirección que se puede compartir e indexar.
 *
 * La preferencia se recuerda para que la próxima visita a la raíz redirija sola, pero **solo cuando
 * el usuario la ha elegido pulsando el conmutador**: adivinar por el navegador y redirigir sin más
 * secuestra los enlaces compartidos.
 */

export const IDIOMAS = ['es', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];

const CLAVE = 'rincon:idioma';

/** Raíz desde la que se sirve el sitio: '/' en local, '/<repo>/' en GitHub Pages. */
const BASE = import.meta.env.BASE_URL;

function esIdioma(v: string | null): v is Idioma {
  return v !== null && (IDIOMAS as readonly string[]).includes(v);
}

/**
 * El idioma se lee del documento, no se deduce. Cada HTML generado trae su `lang` puesto, así que
 * marcado y contenido no pueden discrepar: si algún día se añade un tercer idioma, esto ya funciona.
 */
function detectar(): Idioma {
  const declarado = document.documentElement.lang;
  return esIdioma(declarado) ? declarado : 'es';
}

/*
 * ESTADO MUTABLE, no constante. El idioma se detecta del documento al arrancar, pero el conmutador
 * lo cambia **sin recargar**: se descarga el otro árbol de contenido y se remonta el sitio en el
 * sitio. Con `const` habría que navegar, y navegar es lo que producía el parpadeo.
 *
 * Se expone con `let` y enlace vivo, igual que `corrientes` en contenido.ts, para que quien lo lea
 * dentro de una plantilla no tenga que llamar a una función en cada iteración.
 */
export let idioma: Idioma = detectar();
export let otroIdioma: Idioma = idioma === 'es' ? 'en' : 'es';

export function fijarIdioma(destino: Idioma): void {
  idioma = destino;
  otroIdioma = destino === 'es' ? 'en' : 'es';
  // El documento tiene que declarar lo que muestra: de ahí lo lee `detectar()`, y también los
  // lectores de pantalla para elegir la voz.
  document.documentElement.lang = destino;
}

/** La misma página en el otro idioma, conservando el hash: quien esté leyendo una idea sigue en ella. */
export function urlEnIdioma(destino: Idioma): string {
  const raiz = destino === 'es' ? BASE : `${BASE}en/`;
  return `${raiz}${location.hash}`;
}

/** Recuerda la elección. La navegación la decide quien llama: hoy se hace sin recargar. */
export function recordarIdioma(destino: Idioma): void {
  localStorage.setItem(CLAVE, destino);
}

/**
 * Lleva a quien vuelve al idioma que eligió la vez anterior.
 *
 * Solo actúa en la raíz y solo con una preferencia **explícita**, nunca con el idioma del navegador:
 * redirigir por lo que anuncia el navegador rompe los enlaces compartidos —alguien envía una idea en
 * español y el destinatario aterriza en otra parte— y deja sin salida a quien quiere leer el
 * original. Devuelve `true` si va a haber navegación, para que el arranque no siga montando nada.
 */
export function redirigirAPreferencia(): boolean {
  if (idioma !== 'es') return false;
  const guardado = localStorage.getItem(CLAVE);
  if (!esIdioma(guardado) || guardado === 'es') return false;
  location.replace(urlEnIdioma(guardado));
  return true;
}
