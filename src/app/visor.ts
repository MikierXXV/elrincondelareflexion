/**
 * Visor a pantalla completa para las visualizaciones en pantallas estrechas.
 *
 * POR QUÉ EXISTE. Las 59 piezas están compuestas sobre un `viewBox` de 560×240. En un móvil de 390
 * píxeles el panel deja unos 279 de ancho, así que todo se dibuja a la mitad: los rótulos de 12
 * unidades salen a 6,3 píxeles reales y los nodos manipulables a 9. Ninguna de las dos cosas se
 * puede leer ni tocar.
 *
 * Y NO SE ARREGLA AGRANDANDO LA LETRA. Se probó: subir el cuerpo a 24 destruye la composición, y no
 * por un mal ajuste. `rotulo()` parte cada texto contra un ancho medido en unidades del `viewBox`
 * dando por hecho ese cuerpo, y las posiciones están calculadas para esa densidad; al engordar la
 * letra los rótulos dejan de caber donde se les reservó sitio y se pisan entre ellos. Lo mismo con
 * las dianas: llevar un nodo de 9 a 24 píxeles reales exige pasar su radio de 9 a 24 unidades, y ahí
 * el nodo se come su propia etiqueta.
 *
 * Lo que no cabe en 279 píxeles cabe en 844, que es lo que mide el lado largo de ese mismo móvil. A
 * esa anchura la escala sube a 1,5: los rótulos salen a 18 píxeles y los nodos a 27. Se arreglan las
 * dos cosas a la vez y **sin tocar ni una de las 59 composiciones**, que es la única razón por la que
 * esta es la salida buena y no un parche.
 *
 * SE MUEVE LA SUPERFICIE ENTERA, no su contenido. La escena 3D mide su lienzo preguntándole el ancho
 * a su contenedor, que es precisamente la superficie; sacando solo los hijos, el contenedor se
 * quedaría vacío en su sitio y las escenas 3D se redimensionarían contra una caja que ya no es la
 * suya. Mover el elemento completo y dejar un hueco de la misma altura conserva las referencias, los
 * escuchadores y la maqueta de la página.
 */

import { T } from './textos';

let abierto: (() => void) | null = null;

export function hayVisor(): boolean {
  return abierto !== null;
}

export function cerrarVisor(): void {
  abierto?.();
}

function abrir(superficie: HTMLElement, disparador: HTMLElement): void {
  cerrarVisor();

  /*
   * El hueco conserva la altura exacta que ocupaba la superficie. Sin él, sacarla del flujo encoge la
   * página de golpe y al cerrar el lector aparece en otro punto del recorrido, que es justo lo que la
   * carga diferida de `recorrido.ts` se toma tantas molestias en evitar.
   */
  const hueco = document.createElement('div');
  hueco.style.height = `${superficie.offsetHeight}px`;
  superficie.before(hueco);

  const capa = document.createElement('div');
  capa.className = 'visor';
  capa.setAttribute('role', 'dialog');
  capa.setAttribute('aria-modal', 'true');
  capa.setAttribute('aria-label', T.vis.ampliada);

  const cerrar = document.createElement('button');
  cerrar.type = 'button';
  cerrar.className = 'visor-cerrar';
  cerrar.textContent = T.vis.cerrar_ampliada;

  const lienzo = document.createElement('div');
  lienzo.className = 'visor-lienzo';
  lienzo.append(superficie);

  capa.append(cerrar, lienzo);
  document.body.append(capa);
  document.body.classList.add('con-capa');

  /*
   * Las escenas 3D solo recalculan el tamaño de su lienzo cuando les llega un `resize`, y mover un
   * nodo por el DOM no dispara ninguno. Sin este aviso, la escena se quedaría dibujada al tamaño del
   * panel pequeño y estirada por CSS hasta ocupar el visor: borrosa justo donde se ha ampliado para
   * verla mejor.
   */
  window.dispatchEvent(new Event('resize'));

  const alTeclado = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') { e.preventDefault(); history.back(); return; }
    if (e.key !== 'Tab') return;
    // Solo hay un elemento de mando propio del visor; lo demás son los controles de la pieza.
    const focos = capa.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (!focos.length) return;
    const primero = focos[0]!;
    const ultimo = focos[focos.length - 1]!;
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  };

  /*
   * Cerrar es retroceder, igual que en la ficha de autor: en un móvil el gesto de volver es lo
   * primero que se intenta para salir de algo que ocupa la pantalla entera, y si en vez de cerrar el
   * visor abandonara la página se perdería el sitio del recorrido.
   *
   * Se usa `pushState` y `popstate`, no el hash: el enrutador escucha `hashchange`, así que una
   * entrada de historial sin cambio de hash no le llega y el visor no interfiere con las rutas de
   * idea ni de autor.
   */
  history.pushState({ visor: true }, '');

  const alVolver = (): void => { cerrarCapa(); };

  function cerrarCapa(): void {
    window.removeEventListener('popstate', alVolver);
    capa.removeEventListener('keydown', alTeclado);
    hueco.replaceWith(superficie);
    capa.remove();
    document.body.classList.remove('con-capa');
    window.dispatchEvent(new Event('resize'));
    abierto = null;
    disparador.focus();
  }

  window.addEventListener('popstate', alVolver);
  capa.addEventListener('keydown', alTeclado);
  cerrar.addEventListener('click', () => history.back());

  cerrar.focus();
  abierto = () => history.back();
}

/**
 * Cuelga de una superficie el botón que la amplía. Devuelve la función de limpieza.
 *
 * El botón se pinta siempre y lo esconde la hoja de estilo cuando la pantalla es lo bastante ancha:
 * decidirlo aquí con `matchMedia` obligaría a vigilar los cambios de tamaño y de orientación, y una
 * regla de CSS ya reacciona a los dos sin que nadie la avise.
 */
export function habilitarVisor(superficie: HTMLElement): () => void {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'ampliar';
  boton.textContent = T.vis.ampliar;
  boton.addEventListener('click', () => abrir(superficie, boton));
  superficie.append(boton);
  return () => { if (hayVisor() && superficie.closest('.visor')) cerrarVisor(); boton.remove(); };
}
