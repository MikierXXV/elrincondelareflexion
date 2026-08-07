/**
 * Ficha de autor (fase 2 §2.5).
 *
 * Es el mismo componente tanto si se abre desde una idea como desde un cromo, y **siempre devuelve
 * al sitio del que salió**. La mecánica de la capa —foco atrapado, `Esc`, clic en el fondo y cierre
 * por retroceso— vive en `capa.ts`, compartida con los créditos: aquí solo queda el contenido.
 */

import { autor, ideasDe, nombreCorriente } from './contenido';
import { abrirCapa, cerrarCapa } from './capa';
import { emitir } from './estado';
import { T, con } from './textos';

function marcaAtribucion(nota: string | undefined): string {
  if (!nota) return '';
  return `<details class="atribucion"><summary>${T.recorrido.atribucion}</summary><p>${nota}</p></details>`;
}

export function cerrarFicha(): void {
  cerrarCapa();
}

export async function abrirFicha(
  autorId: string,
  contexto: { volverA: string; ideaActual?: string; disparador?: HTMLElement },
): Promise<void> {
  const a = await autor(autorId);
  const cita = a.citas[0]!;
  // Los títulos reales, no los identificadores: «Saber Que No Se Sabe» delataba la costura.
  const suyas = await ideasDe(a.corriente_id);

  const contenido = `
      <h2>${a.nombre}</h2>
      <p class="meta">${a.periodo} · ${a.region} · ${nombreCorriente(a.corriente_id)}</p>

      <blockquote class="cita">
        <p>${cita.texto}</p>
        <cite>${cita.obra}</cite>
        ${marcaAtribucion(cita.nota)}
      </blockquote>

      <p class="nivel2">${a.nivel_2_desarrollo}</p>

      <section class="preguntas">
        <h3>${T.ficha.preguntas_de_fondo}</h3>
        <ul>${a.preguntas_filosoficas.map((p) => `<li>${p}</li>`).join('')}</ul>
      </section>

      ${suyas.length ? `<section class="sus-ideas"><h3>${T.ficha.ideas_de_su_corriente}</h3>
        <p>${suyas.map((i) => (i.id === contexto.ideaActual ? `<strong>${con(T.ficha.estas_aqui, { titulo: i.titulo })}</strong>` : i.titulo)).join(' · ')}</p></section>` : ''}

      <details class="experto">
        <summary>${T.ficha.modo_experto}</summary>
        <p>${a.nivel_3_experto}</p>
        ${a.debate_abierto ? `<div class="disputa"><h4>${T.ficha.en_disputa}</h4><p>${a.debate_abierto}</p></div>` : ''}
        <h4>${T.ficha.fuentes}</h4>
        <ul class="fuentes">${a.fuentes
          .map((f) => (f.url ? `<li><a href="${f.url}" target="_blank" rel="noopener">${f.titulo} ↗</a></li>` : `<li>${f.titulo}</li>`))
          .join('')}</ul>
      </details>
  `;

  abrirCapa({
    etiqueta: a.nombre,
    contenido,
    volverA: contexto.volverA,
    cerrarEtiqueta: T.ficha.cerrar,
    disparador: contexto.disparador,
    alCerrar: () => emitir({ autorAbierto: null }),
  });
  emitir({ autorAbierto: autorId });
}
