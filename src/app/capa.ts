/**
 * La capa superpuesta del sitio, y sus reglas.
 *
 * Existe una sola clase de capa y la usan tanto la ficha de autor como los créditos. Se extrajo aquí
 * al añadir la segunda: la trampa de foco, el cierre con `Esc`, el clic en el fondo y el cierre por
 * retroceso del historial son cuatro cosas fáciles de escribir mal, y tenerlas duplicadas garantiza
 * que una de las dos copias se quede atrás.
 *
 * Reglas que se cumplen aquí y no en cada sitio que la abre:
 *  - **Una sola capa a la vez.** Abrir una cierra la anterior; desde dentro no se abre nada más.
 *  - **Cerrar es `history.back()`**, para que el gesto de retroceso del móvil haga lo esperable.
 *  - El foco queda atrapado dentro mientras está abierta y vuelve al disparador al cerrarse.
 */

let capa: HTMLElement | null = null;
let devolverFocoA: HTMLElement | null = null;
let alCerrar: (() => void) | null = null;

export function cerrarCapa(): void {
  if (!capa) return;
  capa.remove();
  capa = null;
  document.body.classList.remove('con-capa');
  alCerrar?.();
  alCerrar = null;
  devolverFocoA?.focus();
  devolverFocoA = null;
}

export interface OpcionesCapa {
  /** Etiqueta accesible del diálogo. */
  etiqueta: string;
  /** Marcado interior, sin el `<article>` contenedor. */
  contenido: string;
  /** Texto del botón de vuelta, que dice a dónde se vuelve. */
  volverA: string;
  cerrarEtiqueta: string;
  /** Elemento al que devolver el foco. */
  disparador?: HTMLElement;
  /** Se ejecuta al cerrar, para que quien la abrió deshaga su propio estado. */
  alCerrar?: () => void;
}

export function abrirCapa(op: OpcionesCapa): HTMLElement {
  cerrarCapa();
  devolverFocoA = op.disparador ?? null;
  alCerrar = op.alCerrar ?? null;

  capa = document.createElement('div');
  capa.className = 'capa-autor';
  capa.setAttribute('role', 'dialog');
  capa.setAttribute('aria-modal', 'true');
  capa.setAttribute('aria-label', op.etiqueta);
  capa.innerHTML = `
    <article class="ficha">
      <header>
        <button class="volver" type="button">← ${op.volverA}</button>
        <button class="cerrar" type="button" aria-label="${op.cerrarEtiqueta}">✕</button>
      </header>
      ${op.contenido}
    </article>
  `;

  document.body.append(capa);
  document.body.classList.add('con-capa');

  const cerrar = () => history.back();
  capa.querySelector<HTMLButtonElement>('.volver')!.addEventListener('click', cerrar);
  capa.querySelector<HTMLButtonElement>('.cerrar')!.addEventListener('click', cerrar);
  capa.addEventListener('click', (e) => { if (e.target === capa) cerrar(); });

  // Atrapar el foco: sin esto se puede tabular por detrás de la capa, que es una trampa clásica.
  capa.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key !== 'Tab' || !capa) return;
    const focos = capa.querySelectorAll<HTMLElement>('a[href], button, summary, [tabindex]:not([tabindex="-1"])');
    if (!focos.length) return;
    const primero = focos[0]!;
    const ultimo = focos[focos.length - 1]!;
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  capa.querySelector<HTMLButtonElement>('.cerrar')!.focus();
  return capa;
}

export function hayCapa(): boolean {
  return capa !== null;
}
