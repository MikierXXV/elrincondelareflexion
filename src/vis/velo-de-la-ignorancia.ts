/**
 * Escena 3D. Idea: «El velo de la ignorancia» (Rawls, ética y política contemporánea).
 *
 * justificacion_3d: el velo no es un filtro de información abstracto, es ocupar un lugar concreto en
 * una sociedad y no poder ver el resto. La escena necesita que el usuario esté situado dentro, con
 * oclusión real entre posiciones, y que al reasignarle un sitio al azar experimente el cambio de
 * punto de vista. En un esquema plano lo ve todo desde fuera, que es justamente la posición
 * privilegiada que el experimento suprime.
 *
 * Secuencia deliberada: reparto SABIENDO dónde estás → velo → reparto sin saberlo → asignación al
 * azar y recorrido desde ahí. La comparación entre los dos repartos es el contenido de la pieza, y
 * por eso el primero no se puede rehacer después de conocer el resultado.
 */

import { paletaDe, resolver, temaActual } from './lenguaje';
import { boton, crearEscena3D } from './escena3d';
import type { Visualizacion } from './lenguaje';

const N = 5;
type Fase = 'sabiendo' | 'velo' | 'asignado';

/**
 * Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts.
 *
 * Los tres textos con variables llevan sus huecos entre llaves y se rellenan aquí: troceados en
 * fragmentos que el código concatenara, el inglés y el castellano no podrían ordenar la frase de
 * distinta manera, y una de las dos versiones saldría del revés.
 */
export interface TextosVelo {
  etiqueta: string;
  darMas: string;
  repartirIgual: string;
  asegurarSuelo: string;
  bajarVelo: string;
  levantarVelo: string;
  total: string;
  media: string;
  peorSituado: string;
  noSabesDonde: string;
  estasEnPosicion: string;
  inicial: string;
  trasBajarVelo: string;
  resolucionAsegura: string;
  resolucionSuerte: string;
  resolucionRespaldo: string;
  alternativaTexto: string;
}

const con = (plantilla: string, valores: Record<string, string | number>): string =>
  plantilla.replace(/\{(\w+)\}/g, (o, k: string) => (k in valores ? String(valores[k]) : o));

export async function crearVeloDeLaIgnorancia(
  contenedor: HTMLElement, t: TextosVelo,
): Promise<Visualizacion> {
  const r = await crearEscena3D({
    contenedor,
    etiqueta: t.etiqueta,
    alternativaTexto: t.alternativaTexto,
    resolucionRespaldo: t.resolucionRespaldo,
  });
  if ('respaldo' in r) return r.respaldo;

  const { THREE, escena, camara, controles, animar, visualizacion } = r.escena3d;
  const tema = temaActual();
  const paleta = paletaDe('etica-politica-contemporanea', tema);
  escena.background = new THREE.Color(tema === 'claro' ? 0xf1efea : 0x0e0d10);

  escena.add(new THREE.AmbientLight(0xffffff, 0.8));
  const sol = new THREE.DirectionalLight(0xffffff, 0.55);
  sol.position.set(5, 10, 5);
  escena.add(sol);

  const suelo = new THREE.Mesh(
    new THREE.CircleGeometry(24, 36),
    new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0xd8d2c6 : 0x24222a }),
  );
  suelo.rotation.x = -Math.PI / 2;
  escena.add(suelo);

  /** Cada posición es una plataforma cuya altura es lo que le ha tocado. */
  const recursos = Array.from({ length: N }, () => 2);
  const plataformas = Array.from({ length: N }, (_, i) => {
    const ang = (i / N) * Math.PI * 2;
    const malla = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1, 2.4),
      new THREE.MeshLambertMaterial({ color: paleta.acento }),
    );
    malla.position.set(Math.cos(ang) * 7, 0.5, Math.sin(ang) * 7);
    escena.add(malla);
    return { malla, ang };
  });

  // El velo: una cúpula que envuelve al observador y oculta el resto de posiciones.
  const velo = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 24, 16),
    new THREE.MeshBasicMaterial({
      color: tema === 'claro' ? 0xf1efea : 0x14131a,
      transparent: true, opacity: 0.97, side: THREE.BackSide, depthWrite: false,
    }),
  );
  velo.visible = false;
  escena.add(velo);

  let fase: Fase = 'sabiendo';
  let miPosicion = 0;
  let repartoSabiendo: number[] | null = null;
  const objetivo = new THREE.Vector3();

  const lectura = document.createElement('div');
  lectura.className = 'vis-panel-percepcion';
  contenedor.insertBefore(lectura, controles);

  const bDar = boton(controles, t.darMas, () => {
    if (fase === 'velo') return;
    recursos[miPosicion] = Math.min(8, recursos[miPosicion]! + 1);
    actualizarLectura();
  });
  const bRepartir = boton(controles, t.repartirIgual, () => {
    recursos.fill(4);
    actualizarLectura();
  });
  const bSuelo = boton(controles, t.asegurarSuelo, () => {
    const min = Math.min(...recursos);
    for (let i = 0; i < N; i++) if (recursos[i] === min) recursos[i] = min + 1;
    actualizarLectura();
  });
  const bVelo = boton(controles, t.bajarVelo, () => {
    if (fase !== 'sabiendo') return;
    repartoSabiendo = [...recursos];
    recursos.fill(2);
    fase = 'velo';
    velo.visible = true;
    bDar.disabled = true;
    bVelo.disabled = true;
    bAsignar.disabled = false;
    resolver(contenedor, t.trasBajarVelo);
    actualizarLectura();
  });
  const bAsignar = boton(controles, t.levantarVelo, () => {
    if (fase !== 'velo') return;
    miPosicion = Math.floor(Math.random() * N);
    fase = 'asignado';
    velo.visible = false;
    bAsignar.disabled = true;
    const conVelo = [...recursos];
    const antes = repartoSabiendo ?? conVelo;
    const meToca = conVelo[miPosicion]!;
    const meHabriaTocado = antes[miPosicion]!;
    resolver(
      contenedor,
      meToca >= meHabriaTocado
        ? con(t.resolucionAsegura, { posicion: miPosicion + 1, aCiegas: meToca, sabiendo: meHabriaTocado })
        : con(t.resolucionSuerte, { posicion: miPosicion + 1, aCiegas: meToca, sabiendo: meHabriaTocado }),
    );
    actualizarLectura();
  });
  bAsignar.disabled = true;

  function actualizarLectura(): void {
    const total = recursos.reduce((a, b) => a + b, 0);
    const suelo = Math.min(...recursos);
    plataformas.forEach((p, i) => {
      const h = recursos[i]!;
      p.malla.scale.y = h;
      p.malla.position.y = h / 2;
      // Todas del mismo color. Marcar la propia en color de señal la volvía casi negra y parecía un
      // agujero en el suelo, y además nunca sirve: estás encima, así que no la ves. Cuál te toca lo
      // dice el panel de texto, que es donde se lee sin ambigüedad.
      (p.malla.material as import('three').MeshLambertMaterial).color.set(paleta.acento);
    });
    lectura.innerHTML =
      `<span class="si">${t.total} ${total}</span>` +
      `<span class="si">${t.media} ${(total / N).toFixed(1)}</span>` +
      `<span class="${suelo <= 2 ? 'no' : 'si'}">${t.peorSituado} ${suelo}</span>` +
      `<span class="${fase === 'velo' ? 'no' : 'si'}">${fase === 'velo' ? t.noSabesDonde : con(t.estasEnPosicion, { posicion: miPosicion + 1 })}</span>`;
  }

  animar(() => {
    /*
     * La cámara ocupa SU posición y mira hacia el centro, de modo que las otras cuatro quedan
     * enfrente al otro lado del anillo. Nunca hay vista cenital ni exterior: se ve la sociedad
     * desde un sitio concreto, que es la condición del experimento.
     *
     * La primera versión la ponía a radio 5,2 —dentro del anillo— y miraba a un punto vacío en el
     * aire: solo se veía suelo y dos plataformas cortadas. Desde radio 11,5 y algo elevada, entran
     * las cinco y se comparan sus alturas de un vistazo, que es lo único que hay que comparar.
     */
    const p = plataformas[miPosicion]!;
    const altura = recursos[miPosicion]! + 3.4;
    const destino = new THREE.Vector3(Math.cos(p.ang) * 11.5, altura, Math.sin(p.ang) * 11.5);
    camara.position.lerp(destino, 0.06);
    velo.position.copy(camara.position);
    objetivo.lerp(new THREE.Vector3(0, 1.6, 0), 0.06);
    camara.lookAt(objetivo);
  });

  actualizarLectura();
  resolver(contenedor, t.inicial);
  void bRepartir; void bSuelo;
  return visualizacion;
}
