/**
 * El Rincón de la Reflexión — arranque del sitio.
 *
 * Orden deliberado: el texto ya está en el HTML antes de que se cargue nada, el recorrido se monta
 * a continuación, y las visualizaciones se piden solas al acercarse. Quien tenga mala conexión lee
 * el contenido igual; lo que llega tarde es lo interactivo, no lo que hay que entender.
 *
 * EL MONTAJE ES REVERSIBLE. `montarSitio()` y `desmontarSitio()` existen porque el conmutador de
 * idioma cambia el árbol de contenido **sin recargar la página**: descarga el otro idioma, desmonta
 * y vuelve a montar conservando la posición de lectura. Los dos documentos HTML siguen existiendo
 * —el titular tiene que llegar ya traducido en el primer pintado— pero al pulsar el conmutador no se
 * navega, así que no hay pantalla en blanco por medio.
 */

/*
 * La hoja de estilos NO se importa aquí. Va como <link> en la plantilla, y es deliberado.
 *
 * Importada desde este módulo, Vite la inyecta en desarrollo con JavaScript: llega cuando el módulo
 * ha cargado, así que hay un fotograma con el documento sin estilar. En la compilación la extrae a
 * un <link> bloqueante y el problema desaparece, que es por lo que solo se veía en desarrollo y
 * costó atribuirlo. Declarada en el HTML, es bloqueante en los dos sitios y no hay fotograma suelto.
 */
import { corrientes, cargarIndice, iniciarContenido, nombreCorriente, tituloIdea } from './app/contenido';
import { cargarTextos, T, con } from './app/textos';
import {
  fijarIdioma, idioma, otroIdioma, recordarIdioma, redirigirAPreferencia, urlEnIdioma,
  type Idioma,
} from './app/idioma';
import { aplicarColoresDeCorriente } from './app/colores-corriente';
import { montarRecorrido } from './app/recorrido';
import { montarWidget } from './app/widget';
import { montarCromos } from './app/cromos';
import { iniciarRutas, reanclarEn } from './app/rutas';
import { posicionGuardada, seguirPosicion } from './app/posicion';
import { emitir } from './app/estado';
import { cerrarFicha } from './app/ficha-autor';

/*
 * LA RESTAURACIÓN DE SCROLL SE DECLARA EN LA CABECERA, no aquí. Ver el script en línea de
 * `plantilla/index.html`.
 *
 * Vivió en este fichero, y antes dentro de `iniciarRutas()`. Las dos veces por el mismo motivo —el
 * navegador restaura nada más cargar y hay que ganarle— y las dos veces sin llegar a tiempo: un
 * módulo se difiere, así que cuando esta línea se ejecutaba el navegador ya había decidido. Solo un
 * script en línea y sin diferir corre antes.
 */

const CLAVE_TEMA = 'rincon:tema';

/** La rellena `arrancar()`. Vive fuera porque `aplicarTema` se define antes de montar la escena. */
let rehacerPensador: () => void = () => {};

function aplicarTema(tema: 'claro' | 'oscuro'): void {
  document.documentElement.dataset.tema = tema;
  localStorage.setItem(CLAVE_TEMA, tema);
  document.querySelector<HTMLButtonElement>('#tema')!.setAttribute(
    'aria-label', tema === 'claro' ? T.barra.tema_a_oscuro : T.barra.tema_a_claro,
  );
  rehacerPensador();
  /*
   * Las piezas del recorrido llevan su paleta escrita en los atributos del SVG, resuelta al
   * construirse: cambiar los tokens de CSS no las repinta. Se avisa y cada zona rehace lo suyo.
   * Ver `alCambiarTema` en `recorrido.ts`.
   */
  window.dispatchEvent(new Event('tema-cambiado'));
}

/** Resuelve `hero.titular` contra el objeto de cadenas, igual que hace el generador de HTML. */
function buscar(ruta: string): string | undefined {
  return ruta.split('.').reduce<unknown>(
    (n, clave) => (n == null ? undefined : (n as Record<string, unknown>)[clave]),
    T,
  ) as string | undefined;
}

/**
 * Reescribe las cadenas que vienen en el documento generado.
 *
 * Se apoya en `data-t`, que lleva la misma clave que usó el generador. En el arranque no hace falta
 * —el HTML ya viene bien— pero al cambiar de idioma es lo que actualiza el titular, la entradilla,
 * los botones de entrada y el pie sin tocar el resto del árbol.
 */
function aplicarTextosEstaticos(): void {
  document.querySelectorAll<HTMLElement>('[data-t]').forEach((el) => {
    const valor = buscar(el.dataset.t!);
    if (valor !== undefined) el.textContent = valor;
  });
  document.title = T.documento.titulo;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute('content', T.documento.descripcion);
}

/** El conmutador: dos opciones a la vista, la actual marcada, la otra un enlace real. */
function pintarConmutador(): void {
  const enlace = document.querySelector<HTMLAnchorElement>('#idioma')!;
  document.querySelector<HTMLElement>('.idiomas .actual')!.textContent = idioma.toUpperCase();
  enlace.textContent = otroIdioma.toUpperCase();
  enlace.hreflang = otroIdioma;
  enlace.setAttribute('aria-label', T.barra.idioma);
  // Se conserva el href aunque se intercepte el clic: sin JavaScript sigue siendo navegación válida,
  // y con JavaScript permite abrir el otro idioma en otra pestaña.
  enlace.href = urlEnIdioma(otroIdioma);
}

let desmontarSitio: () => void = () => {};

async function montarSitio(): Promise<void> {
  const nIdeas = corrientes.reduce((a, c) => a + c.ideas.length, 0);
  const nAutores = new Set(corrientes.flatMap((c) => c.autores)).size;

  // Cifras desde el contenido, no escritas a mano: si mañana hay 17 corrientes, se ve solo.
  document.querySelector<HTMLElement>('#cifras')!.textContent = con(T.hero.cifras, {
    ideas: nIdeas, corrientes: corrientes.length, autores: nAutores,
  });

  const soltarWidget = montarWidget(document.querySelector<HTMLElement>('#widget')!, nAutores);
  // El índice va antes que el recorrido: la tira de autor necesita los nombres, y montarla con
  // identificadores para corregirlos después produciría un parpadeo feo. Son 10 kB.
  await cargarIndice();
  const soltarRecorrido = await montarRecorrido(document.querySelector<HTMLElement>('#recorrido')!);
  const soltarCromos = montarCromos(document.querySelector<HTMLElement>('#final')!);

  desmontarSitio = () => {
    soltarCromos();
    soltarRecorrido();
    soltarWidget();
  };
}

/**
 * Cambia de idioma sin recargar.
 *
 * La posición de lectura se conserva por el hash, que no cambia. Hay que reanclar después de montar
 * porque el recorrido vuelve a reservar alturas aproximadas y el destino se desplaza mientras cargan
 * las ideas de las corrientes atravesadas; se reutiliza el mecanismo del enrutador en vez de
 * escribir otro.
 */
async function cambiarDeIdioma(destino: Idioma): Promise<void> {
  if (destino === idioma) return;
  document.body.classList.remove('listo');
  cerrarFicha();
  desmontarSitio();

  fijarIdioma(destino);
  recordarIdioma(destino);
  await Promise.all([cargarTextos(), iniciarContenido()]);

  aplicarTextosEstaticos();
  pintarConmutador();
  await montarSitio();
  document.body.classList.add('listo');

  /*
   * La dirección tiene que reflejar lo que se está leyendo, o compartir el enlace daría el otro
   * idioma. `replaceState` y no `pushState`: el retroceso debe salir del sitio como siempre, no
   * deshacer un cambio de idioma que el usuario ya está viendo aplicado.
   */
  history.replaceState(null, '', urlEnIdioma(destino));
  await reanclarEn(location.hash);
}

/**
 * Pone en el hero una tercera entrada: volver donde se quedó la sesión anterior.
 *
 * Va dentro de `.entradas`, con las otras dos, y no flotando en una esquina: es una salida del hero
 * como «recorrer las ideas» o «ver los cromos», y pertenece a esa fila. Aparece solo cuando hay algo
 * que ofrecer, así que quien llega por primera vez no ve nada raro.
 */
function ofrecerVuelta(ancla: string): void {
  const entradas = document.querySelector<HTMLElement>('#hero .entradas');
  if (!entradas) return;

  const id = ancla.replace(/^#/, '');
  // El ancla puede ser una idea, una corriente, el umbral o los cromos. Las dos últimas no tienen
  // nombre propio que mostrar, así que comparten un rótulo que dice a dónde van.
  let etiqueta: string;
  if (id.startsWith('idea-')) etiqueta = con(T.hero.seguir, { donde: tituloIdea(id.slice(5)) });
  else if (id.startsWith('corriente-')) etiqueta = con(T.hero.seguir, { donde: nombreCorriente(id.slice(10)) });
  else etiqueta = T.hero.seguir_cromos;

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'seguir';
  boton.textContent = etiqueta;
  /*
   * Se reancla en vez de dejar que el navegador salte al ancla: al arrancar solo están pintadas las
   * dieciséis portadas y la idea todavía no existe, así que un salto normal no encontraría nada.
   * `reanclarEn` fuerza la carga de su corriente y espera a que el sitio deje de moverse.
   */
  boton.addEventListener('click', () => { boton.remove(); void reanclarEn(ancla); });
  entradas.append(boton);
}

async function arrancar(): Promise<void> {
  // Antes que nada: si el usuario eligió otro idioma en una visita anterior, se va allí sin montar
  // nada. Montar y luego navegar solo produciría un parpadeo de trabajo tirado.
  if (redirigirAPreferencia()) return;

  await Promise.all([cargarTextos(), iniciarContenido()]);

  /*
   * En cuanto hay corrientes cargadas y antes de montar nada: las reglas tienen que estar puestas
   * cuando aparezca la primera portada, o el color entraría después del primer pintado y se vería
   * cambiar. Va aquí y no dentro de `aplicarTema` porque la cascada ya resuelve el tema sola.
   */
  aplicarColoresDeCorriente();

  const guardado = localStorage.getItem(CLAVE_TEMA);
  if (guardado === 'claro' || guardado === 'oscuro') aplicarTema(guardado);

  document.querySelector<HTMLButtonElement>('#tema')!.addEventListener('click', () => {
    const actual = document.documentElement.dataset.tema
      ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
    aplicarTema(actual === 'claro' ? 'oscuro' : 'claro');
  });

  const conmutador = document.querySelector<HTMLAnchorElement>('#idioma')!;
  conmutador.addEventListener('click', (e) => {
    // Con modificador o botón central, que haga lo suyo: abrir en otra pestaña es un uso legítimo
    // del enlace, e interceptarlo sería quitarle al usuario algo que ya tenía.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    void cambiarDeIdioma(otroIdioma);
  });
  pintarConmutador();
  window.addEventListener('hashchange', () => { conmutador.href = urlEnIdioma(otroIdioma); });

  // El hero manda mientras está en pantalla, para que el widget no marque una corriente antes de tiempo.
  new IntersectionObserver(
    (entradas) => { for (const e of entradas) if (e.isIntersecting) emitir({ zona: 'hero', corrienteActiva: null, ideaActiva: null, progresoTotal: 0 }); },
    { rootMargin: '-50% 0px -50% 0px' },
  ).observe(document.querySelector('#hero')!);

  /*
   * El Pensador: se monta al entrar en pantalla y **se destruye al salir**. No es una optimización
   * menor: si la escena del hero siguiera viva al llegar a una idea en 3D habría dos contextos WebGL
   * a la vez, que es justo lo que la regla de rendimiento del proyecto prohíbe.
   */
  const hueco = document.querySelector<HTMLElement>('#pensador')!;
  let pensador: import('./vis/lenguaje').Visualizacion | null = null;
  let montandoPensador = false;
  let visible = false;

  function montarPensador(): void {
    if (!visible || pensador || montandoPensador) return;
    montandoPensador = true;
    void import('./vis/hero-pensador')
      .then((m) => m.crearHeroPensador(hueco))
      .then((v) => { pensador = v; })
      .finally(() => { montandoPensador = false; });
  }
  function desmontarPensador(): void {
    pensador?.destruir();
    pensador = null;
  }

  /*
   * Al cambiar de tema hay que REHACER la escena, no solo repintar.
   *
   * Los materiales, el entorno de reflexión y el halo se calculan al construirla, así que un cambio
   * de tema dejaba la figura con el bronce y el contraluz del tema anterior: en claro salía un disco
   * oscuro sobre la página blanca. El resto del sitio cambia con CSS; esto no puede.
   */
  rehacerPensador = () => { desmontarPensador(); montarPensador(); };

  new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        visible = e.isIntersecting;
        if (visible) montarPensador();
        else desmontarPensador();
      }
    },
    { rootMargin: '100px 0px' },
  ).observe(hueco);

  await montarSitio();

  /*
   * Se LEE la posición antes de empezar a seguirla.
   *
   * `suscribir` dispara con el estado actual nada más registrarse, y ese estado arranca en la zona
   * del hero: seguir primero borraba la posición guardada un instante antes de ir a buscarla.
   */
  const vuelta = posicionGuardada();
  seguirPosicion();
  iniciarRutas();

  /*
   * La vuelta se OFRECE, no se ejecuta.
   *
   * Antes se reanclaba solo: recargabas y aparecías en mitad de una idea sin haber pedido nada, sin
   * explicación y sin forma de deshacerlo. Lo que la funcionalidad aporta —no perder el sitio en un
   * recorrido de veinticinco siglos— se conserva entero; lo que estorbaba era que decidiera por ti.
   *
   * El botón dice A DÓNDE lleva, y eso es la mitad del arreglo: «Seguir en «Flujo y permanencia»» se
   * acepta o se ignora con la información delante, mientras que un salto silencioso solo se sufre.
   *
   * Sigue mandando la dirección: un enlace compartido a una idea concreta pesa más que lo que este
   * navegador recuerde de la visita anterior.
   */
  if (vuelta && !location.hash) ofrecerVuelta(vuelta);

  document.body.classList.add('listo');
}

void arrancar();
