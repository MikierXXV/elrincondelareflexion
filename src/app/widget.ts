/**
 * Widget de posicionamiento (fase 2 §4).
 *
 * Muestra los dos ejes —corriente e idea dentro de ella— porque con 16 paradas y hasta 5 ideas cada
 * una, saber solo la corriente deja perdido al usuario a mitad de parada.
 *
 * **El widget nunca escribe el estado.** Al pulsar pide un desplazamiento; el observador de scroll
 * lo detecta y actualiza. Así es imposible que el indicador diga una cosa y el scroll esté en otra,
 * incluso si el usuario interrumpe el salto a mitad.
 *
 * Los puntos de idea solo se despliegan en la corriente actual: mostrar los 59 a la vez lo
 * convertiría en un índice, y esto es una brújula.
 */

import { corrientes } from './contenido';
import { leer, suscribir } from './estado';
import { T, con } from './textos';

export function montarWidget(raiz: HTMLElement, autores: number): () => void {
  raiz.className = 'widget';
  raiz.setAttribute('aria-label', T.widget.etiqueta);

  raiz.innerHTML = `
    <div class="progreso"><span></span></div>
    <ol class="corrientes">
      ${corrientes
        .map((c, i) => {
          const separador = i > 0 && corrientes[i - 1]!.bloque_id !== c.bloque_id ? ' cambio-bloque' : '';
          return `<li class="corriente${separador}" data-corriente="${c.id}">
            <a href="#corriente-${c.id}"><span class="num">${String(c.orden_cronologico).padStart(2, '0')}</span><span class="nombre">${c.nombre}</span></a>
            <ol class="ideas">${c.ideas.map((id) => `<li data-idea="${id}"><a href="#idea-${id}"><span class="sr">${id}</span></a></li>`).join('')}</ol>
          </li>`;
        })
        .join('')}
    </ol>
    <button class="ir-cromos" type="button">${con(T.widget.ir_a_cromos, { autores })}</button>
  `;

  raiz.querySelector<HTMLButtonElement>('.ir-cromos')!.addEventListener('click', () => {
    location.hash = '#/cromos';
  });

  const barra = raiz.querySelector<HTMLElement>('.progreso span')!;

  const cancelar = suscribir((e) => {
    barra.style.transform = `scaleY(${e.progresoTotal})`;
    let pasada = true;
    raiz.querySelectorAll<HTMLElement>('.corriente').forEach((li) => {
      const id = li.dataset.corriente!;
      const activa = id === e.corrienteActiva;
      if (activa) pasada = false;
      li.classList.toggle('activa', activa);
      li.classList.toggle('visitada', pasada && !activa);
      li.querySelectorAll<HTMLElement>('.ideas li').forEach((p) => {
        p.classList.toggle('activa', p.dataset.idea === e.ideaActiva);
      });
    });
    // El widget solo tiene sentido dentro del recorrido. En el hero marcaría dieciséis corrientes
    // sin ninguna activa —no orienta, solo estorba a la figura— y en los cromos quien orienta es el
    // camino de corrientes, que está dentro de la propia sección.
    raiz.classList.toggle('fuera-del-recorrido', e.zona !== 'recorrido');
  });

  return () => { cancelar(); raiz.replaceChildren(); };
}

/** Etiqueta accesible de la posición, para lectores de pantalla. */
export function descripcionPosicion(): string {
  const e = leer();
  const c = corrientes.find((x) => x.id === e.corrienteActiva);
  if (!c) return T.widget.inicio;
  if (!e.ideaActiva) return c.nombre;
  return con(T.widget.posicion_idea, { corriente: c.nombre, idea: e.ideaActiva.replace(/-/g, ' ') });
}
