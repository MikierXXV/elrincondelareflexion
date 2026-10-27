/**
 * Ficha de autor (fase 2 §2.5).
 *
 * Es el mismo componente tanto si se abre desde una idea como desde un cromo, y **siempre devuelve
 * al sitio del que salió**. La mecánica de la capa —foco atrapado, `Esc`, clic en el fondo y cierre
 * por retroceso— vive en `capa.ts`, compartida con los créditos: aquí solo queda el contenido.
 */

import { autor, ideasDe, nombreCorriente } from './contenido';
import { abrirCapa, cerrarCapa } from './capa';
import { comoParrafos, enUnaFrase, ico, md, repartir, seccion } from './bloques';
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
  // Los títulos reales, no los identificadores: «Saber Que No Se Sabe» delataba la costura.
  const suyas = await ideasDe(a.corriente_id);
  const B = T.bloques;
  const { prosa, analogia, analogiaPrimero } = repartir(a.nivel_2_desarrollo, a.analogia, B.piensalo_asi);
  const bloqueAnalogia = analogia ? seccion('ficha-analogia', 'idea', B.piensalo_asi, analogia, 3) : '';
  const experto = comoParrafos(a.nivel_3_experto).map((p) => `<p>${md(p)}</p>`).join('');

  /*
   * En bloques (DECISIONES.md), con el mismo módulo que la idea. El envoltorio lleva `data-corriente`
   * para que la capa —que vive fuera del recorrido— reciba el acento de la corriente del autor.
   * Las dos citas y el resumen del cromo ya estaban en la ficha; antes solo se pintaba la primera
   * cita y el resumen no aparecía.
   */
  const contenido = `
    <div class="ficha-bloques" data-corriente="${a.corriente_id}">
      <div class="cab-ficha">
        <h2>${a.nombre}</h2>
        <p class="meta">${a.periodo} · ${a.region} · ${nombreCorriente(a.corriente_id)}</p>
        ${enUnaFrase(B.en_una_frase, a.nivel_1_resumen)}
      </div>

      ${a.citas.map((c) => `<blockquote class="cita">
        <p>${c.texto}</p>
        <cite>${c.obra}</cite>
        ${marcaAtribucion(c.nota)}
      </blockquote>`).join('')}

      ${analogiaPrimero ? bloqueAnalogia : ''}

      ${seccion('ficha-pensamiento', 'lista', B.su_pensamiento, `<div class="prosa">${prosa}</div>`, 3)}

      ${analogiaPrimero ? '' : bloqueAnalogia}

      ${seccion('ficha-preguntas', 'pregunta', T.ficha.preguntas_de_fondo,
        `<ul class="preguntas">${a.preguntas_filosoficas.map((p) => `<li>${md(p)}</li>`).join('')}</ul>`, 3)}

      ${a.dialogo_filosofico ? seccion('ficha-dialogo', 'puente', B.dialogo_filosofico, `<div class="prosa"><p>${md(a.dialogo_filosofico)}</p></div>`, 3) : ''}

      ${suyas.length ? seccion('ficha-ideas', 'ruta', T.ficha.ideas_de_su_corriente,
        `<p class="sus-ideas">${suyas.map((i) => (i.id === contexto.ideaActual ? `<strong>${con(T.ficha.estas_aqui, { titulo: i.titulo })}</strong>` : i.titulo)).join(' · ')}</p>`, 3) : ''}

      <details class="experto">
        <summary>${T.ficha.modo_experto}${ico('chev')}</summary>
        <div class="prosa">${experto}</div>
        ${a.debate_abierto ? `<div class="disputa"><h4>${T.ficha.en_disputa}</h4><p>${a.debate_abierto}</p></div>` : ''}
        <h4>${T.ficha.fuentes}</h4>
        <ul class="fuentes">${a.fuentes
          .map((f) => (f.url ? `<li><a href="${f.url}" target="_blank" rel="noopener">${f.titulo} ↗</a></li>` : `<li>${f.titulo}</li>`))
          .join('')}</ul>
      </details>
    </div>
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
