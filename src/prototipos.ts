/**
 * Banco de pruebas de los tres prototipos de referencia (fase 3 §6).
 *
 * Su función no es enseñar filosofía sino responder a una pregunta de diseño: ¿se sienten de la
 * misma familia una pieza SVG, una simulación física y una escena 3D? Por eso se muestran juntas y
 * con el conmutador de tema a mano: si el lenguaje gráfico funciona, se nota aquí.
 */

import './estilos/prototipos.css';
import { crearTerminoMedio } from './vis/termino-medio';
import { crearSuspensionDelJuicio } from './vis/suspension-del-juicio';
import { crearMundoDeLasIdeas } from './vis/mundo-de-las-ideas';
import type { Visualizacion } from './vis/lenguaje';
// Las piezas rotulan desde la ficha de idioma; sin esto el banco monta con `T` a nulo. Ver galeria.ts.
import { cargarTextos } from './app/textos';

const CLAVE_TEMA = 'rincon:tema';

function aplicarTema(tema: 'claro' | 'oscuro'): void {
  document.documentElement.dataset.tema = tema;
  localStorage.setItem(CLAVE_TEMA, tema);
}

function temaGuardado(): 'claro' | 'oscuro' | null {
  const v = localStorage.getItem(CLAVE_TEMA);
  return v === 'claro' || v === 'oscuro' ? v : null;
}

const vivas: Visualizacion[] = [];

async function montar(): Promise<void> {
  // Se destruyen antes de volver a montar: es la misma disciplina que exige el panel de idea, donde
  // nunca puede haber más de una visualización viva a la vez.
  while (vivas.length) vivas.pop()!.destruir();

  const a = document.querySelector<HTMLElement>('#vis-svg')!;
  const b = document.querySelector<HTMLElement>('#vis-fisica')!;
  const c = document.querySelector<HTMLElement>('#vis-3d')!;

  // El banco de pruebas lee los rótulos de la misma ficha que el sitio: si aquí se vieran otros,
  // dejaría de estar probando lo que se publica.
  const ideas = import.meta.glob<{ default: { visualizacion: { textos: unknown } } }>(
    '../content/es/ideas/*.json', { eager: true },
  );
  const textos = (id: string) => ideas[`../content/es/ideas/${id}.json`]!.default.visualizacion.textos;

  vivas.push(crearTerminoMedio(a, textos('termino-medio') as Parameters<typeof crearTerminoMedio>[1]));
  vivas.push(crearSuspensionDelJuicio(b, textos('suspension-del-juicio') as Parameters<typeof crearSuspensionDelJuicio>[1]));
  vivas.push(await crearMundoDeLasIdeas(c, textos('mundo-de-las-ideas') as Parameters<typeof crearMundoDeLasIdeas>[1]));
}

const guardado = temaGuardado();
if (guardado) aplicarTema(guardado);

document.querySelector<HTMLButtonElement>('#alternar-tema')!.addEventListener('click', () => {
  const actual = document.documentElement.dataset.tema
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
  aplicarTema(actual === 'claro' ? 'oscuro' : 'claro');
  // Las visualizaciones leen la paleta al construirse, así que un cambio de tema las rehace.
  void montar();
});

await cargarTextos();
void montar();
