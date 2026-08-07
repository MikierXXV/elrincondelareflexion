/**
 * Enrutado por hash (fase 2 §5).
 *
 * Hash y no History API porque GitHub Pages sirve estáticos sin reescritura de rutas.
 *
 * La ruta del autor **cuelga del contexto del que salió** —`#/idea/<idea>/autor/<autor>` frente a
 * `#/cromos/<autor>`— y eso no es cosmético: es lo que hace que cerrar la ficha devuelva siempre al
 * sitio correcto, incluso si el usuario ha llegado por un enlace compartido. Un solo nivel de
 * anidamiento, nunca dos.
 */

import { abrirFicha, cerrarFicha } from './ficha-autor';
import { abrirCreditos } from './creditos';
import { nombreCorriente } from './contenido';
import { asegurarIdea } from './recorrido';
import { T } from './textos';

/**
 * El desplazamiento suave solo se usa en saltos cortos. La página completa mide decenas de miles de
 * píxeles, y animar un salto del hero a los cromos tardaba tanto que el enlace parecía roto: el
 * usuario ve pasar sesenta secciones y no entiende qué está ocurriendo. A partir de tres pantallas
 * de distancia se va directo.
 *
 * Un salto largo atraviesa corrientes que aún no han cargado sus ideas. Al aterrizar, esas
 * corrientes entran en pantalla, cambian su altura reservada por la real, y el destino se desplaza
 * por debajo: un enlace a los cromos acababa dejando al usuario en mitad de Avicena. Así que después
 * del salto instantáneo se vuelve a anclar mientras el documento siga moviéndose, y se para en
 * cuanto se estabiliza —o al agotar el plazo, para no perseguir un destino eternamente.
 */
function reanclar(el: Element, plazo = 1500, estables = 3): void {
  const limite = performance.now() + plazo;
  // El destino no es el borde superior de la ventana sino el que deja libre la barra fija. Se lee de
  // la hoja de estilos en vez de repetir el número aquí, para que no puedan discrepar.
  const hueco = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  let quietos = 0;
  const paso = (): void => {
    const desvio = el.getBoundingClientRect().top - hueco;
    if (Math.abs(desvio) < 2) quietos += 1;
    // 'instant' y no el valor por defecto: la hoja de estilos declara `scroll-behavior: smooth`, y
    // sin decirlo explícitamente cada corrección lanzaba una animación que cancelaba la anterior, de
    // modo que el reanclaje no avanzaba nunca.
    else { quietos = 0; window.scrollBy({ top: desvio, behavior: 'instant' }); }
    if (quietos < estables && performance.now() < limite) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

function irA(selector: string): void {
  const el = document.querySelector(selector);
  if (!el) return;
  const distancia = Math.abs(el.getBoundingClientRect().top);
  // El desplazamiento suave solo en saltos cortos; ver la nota de arriba.
  if (distancia < window.innerHeight * 3) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
  reanclar(el);
}

/**
 * Vuelve a colocar la vista sobre un ancla tras remontar el sitio. Lo usa el cambio de idioma.
 *
 * **Hay que forzar la carga de la idea antes de buscarla.** Al remontar, el recorrido solo pinta las
 * dieciséis portadas; las ideas llegan por proximidad. La primera versión buscaba el ancla de
 * inmediato, no la encontraba y se rendía en silencio, así que la idea acababa 172 px por detrás de
 * la barra —siempre los mismos, porque no era una carrera sino que el reanclaje no llegaba a correr.
 */
export async function reanclarEn(hash: string): Promise<void> {
  const id = hash.replace(/^#/, '');
  if (!id || id.startsWith('/')) return;
  if (id.startsWith('idea-')) await asegurarIdea(id.slice(5));
  const el = document.querySelector(`#${CSS.escape(id)}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
  /*
   * Plazo largo y muchos más fotogramas de calma que en un salto normal.
   *
   * Remontar el sitio entero tarda más que desplazarse por un documento ya construido, pero el
   * problema de fondo no era el plazo sino el criterio de parada: la carga llega a rachas, y con
   * solo tres fotogramas quietos el reanclaje daba por buena una pausa entre dos rachas. Después las
   * corrientes de más arriba sustituían su altura reservada por la real, encogían, y la idea subía
   * 172 px por detrás de la barra. Medio segundo de quietud sí distingue una pausa del final.
   */
  reanclar(el, 6000, 30);
}

async function resolver(): Promise<void> {
  const hash = location.hash.replace(/^#/, '');

  // Anclas simples del recorrido: #corriente-x, #idea-y, #umbral
  if (hash && !hash.startsWith('/')) {
    cerrarFicha();
    // Un enlace directo a una idea puede llegar antes de que su corriente se haya cargado por
    // proximidad, así que hay que forzarla o el ancla no existiría todavía.
    if (hash.startsWith('idea-')) await asegurarIdea(hash.slice(5));
    irA(`#${CSS.escape(hash)}`);
    return;
  }

  const partes = hash.split('/').filter(Boolean);

  if (partes[0] === 'idea' && partes[2] === 'autor' && partes[3]) {
    const ideaId = partes[1]!;
    await asegurarIdea(ideaId);
    irA(`#idea-${CSS.escape(ideaId)}`);
    await abrirFicha(partes[3], {
      volverA: T.ficha.volver_a_idea,
      ideaActual: ideaId,
      disparador: document.querySelector<HTMLElement>(`#idea-${CSS.escape(ideaId)} .ver-ficha`) ?? undefined,
    });
    return;
  }

  if (partes[0] === 'cromos' && partes[1]) {
    irA('#cromos');
    await abrirFicha(partes[1], { volverA: T.ficha.volver_a_cromos });
    return;
  }

  if (partes[0] === 'cromos') {
    cerrarFicha();
    irA('#cromos');
    return;
  }

  if (partes[0] === 'creditos') {
    abrirCreditos(document.querySelector<HTMLElement>('footer a') ?? undefined);
    return;
  }

  if (partes[0] === 'corriente' && partes[1]) {
    cerrarFicha();
    irA(`#corriente-${CSS.escape(partes[1])}`);
    document.title = `${nombreCorriente(partes[1])} — El Rincón de la Reflexión`;
    return;
  }

  cerrarFicha();
}

/**
 * ¿La dirección apunta a algún sitio concreto del recorrido o de los cromos?
 *
 * Decide si al recargar hay que respetar dónde estaba el usuario o devolverlo a la portada.
 */
function hashConDestino(): boolean {
  const hash = location.hash.replace(/^#/, '');
  if (!hash) return false;
  return /^(corriente-|idea-|umbral)/.test(hash) || hash.startsWith('/');
}

export function iniciarRutas(): void {
  /*
   * Sin destino en la dirección se empieza arriba, en la figura.
   *
   * La restauración automática del navegador ya está desactivada en main.ts —tiene que hacerse antes
   * de cualquier espera, o el navegador decide primero—. Aquí solo queda asegurar el punto de
   * partida; si el usuario venía leyendo, `arrancar()` lo devuelve después a donde estaba.
   */
  if (!hashConDestino()) window.scrollTo(0, 0);

  window.addEventListener('hashchange', () => void resolver());
  // La resolución inicial se difiere: el recorrido tiene que estar montado para poder desplazarse.
  requestAnimationFrame(() => void resolver());
}
