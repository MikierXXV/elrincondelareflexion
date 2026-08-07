/**
 * Andamiaje común de las escenas Three.js.
 *
 * Existe porque las seis escenas repiten exactamente lo mismo y equivocarse en cualquiera de estas
 * piezas es caro: detección de capacidad, respaldo estático, redimensionado con la proporción única
 * del hueco, y sobre todo **liberación real del contexto WebGL**. Sin ese último paso, abrir varias
 * ideas en 3D seguidas agota la memoria de GPU en un móvil de gama baja.
 *
 * La regla de rendimiento del proyecto —un solo contexto vivo a la vez— se cumple aquí y no en cada
 * escena, para que no dependa de que nadie se olvide.
 */

import { alternativaTextual, movimientoReducido, resolver } from './lenguaje';
import { T } from '../app/textos';
import type { Visualizacion } from './lenguaje';

/** Misma proporción que las piezas 2D: el marco común es lo que crea la familia. */
export const PROPORCION = 7 / 3;

export function soportaWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

export interface OpcionesEscena {
  contenedor: HTMLElement;
  /** Etiqueta accesible del lienzo. */
  etiqueta: string;
  alternativaTexto: string;
  /** Texto de resolución del respaldo estático, cuando no hay 3D disponible. */
  resolucionRespaldo: string;
  /**
   * Lienzo con canal alfa, para que se vea el fondo de la página a través de él.
   *
   * Lo necesita el hero. Pintar un fondo del color de la página dentro de la escena parecía
   * equivalente y no lo es: el mapeo de tonos se aplica también a ese color, así que salía más
   * oscuro que la página y el lienzo se delataba como un rectángulo. Con alfa no hay dos colores
   * que puedan discrepar, porque solo hay uno.
   */
  transparente?: boolean;
}

export interface Escena3D {
  THREE: typeof import('three');
  escena: import('three').Scene;
  camara: import('three').PerspectiveCamera;
  render: import('three').WebGLRenderer;
  controles: HTMLElement;
  /**
   * Arranca el bucle. `paso` recibe el tiempo transcurrido en segundos.
   *
   * `dibujar` permite sustituir el pintado directo. Lo necesita el hero, que compone con bloom y por
   * tanto no renderiza a pantalla sino a través de un EffectComposer. Las seis escenas del recorrido
   * lo omiten y siguen pintando directo, que es lo correcto para ellas.
   */
  animar(paso: (t: number) => void, dibujar?: () => void): void;
  visualizacion: Visualizacion;
}

function respaldo(op: OpcionesEscena): Visualizacion {
  const aviso = document.createElement('div');
  aviso.className = 'vis-respaldo';
  aviso.innerHTML = T.vis.respaldo_3d;
  op.contenedor.append(aviso);
  alternativaTextual(op.contenedor, op.alternativaTexto);
  resolver(op.contenedor, op.resolucionRespaldo);
  return { destruir: () => op.contenedor.replaceChildren() };
}

/**
 * Prepara escena, cámara, renderer y controles. Devuelve null si hay que caer al respaldo, en cuyo
 * caso ya lo ha montado: quien llama solo tiene que devolver `visualizacionRespaldo`.
 */
export async function crearEscena3D(
  op: OpcionesEscena,
): Promise<{ escena3d: Escena3D } | { respaldo: Visualizacion }> {
  if (!soportaWebGL() || movimientoReducido()) return { respaldo: respaldo(op) };

  const THREE = await import('three');

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(48, PROPORCION, 0.1, 4000);

  const render = new THREE.WebGLRenderer({
    antialias: true, powerPreference: 'low-power', alpha: op.transparente === true,
  });
  render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if (op.transparente) render.setClearColor(0x000000, 0);
  render.domElement.className = 'vis-canvas';
  render.domElement.setAttribute('role', 'img');
  render.domElement.setAttribute('aria-label', op.etiqueta);
  op.contenedor.append(render.domElement);

  const controles = document.createElement('div');
  controles.className = 'vis-controles';
  op.contenedor.append(controles);
  alternativaTextual(op.contenedor, op.alternativaTexto);

  let animacion = 0;
  const inicio = performance.now();

  function redimensionar(): void {
    const ancho = op.contenedor.clientWidth;
    if (!ancho) return;
    const alto = Math.round(ancho / PROPORCION);
    render.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }
  window.addEventListener('resize', redimensionar);
  redimensionar();

  const escena3d: Escena3D = {
    THREE, escena, camara, render, controles,
    animar(paso, dibujar) {
      const pintar = dibujar ?? (() => render.render(escena, camara));
      const bucle = () => {
        paso((performance.now() - inicio) / 1000);
        pintar();
        animacion = requestAnimationFrame(bucle);
      };
      bucle();
    },
    visualizacion: {
      destruir(): void {
        cancelAnimationFrame(animacion);
        window.removeEventListener('resize', redimensionar);
        // Liberar de verdad: geometrías, materiales y el propio contexto.
        escena.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach((m) => m.dispose());
          }
        });
        render.dispose();
        render.forceContextLoss();
        op.contenedor.replaceChildren();
      },
    },
  };

  return { escena3d };
}

/** Botón con el estilo del sistema, para no repetirlo en cada escena. */
export function boton(controles: HTMLElement, texto: string, alPulsar: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.addEventListener('click', alPulsar);
  controles.append(b);
  return b;
}
