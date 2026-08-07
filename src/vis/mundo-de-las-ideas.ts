/**
 * Prototipo de referencia 3 — Three.js.
 * Idea: "El mundo de las Ideas" (Platón, corriente clasica-griega).
 *
 * Pone a prueba: iluminación con carácter en ambos temas —no PBR fotorrealista por defecto—,
 * el fallback 2D, y sobre todo la disciplina de recursos: un único contexto WebGL vivo a la vez.
 *
 * justificacion_3d de la ficha: la relación entre la fuente de luz, el objeto que la intercepta y
 * la sombra proyectada es el contenido de la idea, no su ilustración. En 2D habría que dibujar de
 * antemano la sombra correcta; aquí se produce sola, y el usuario descubre al girar la cámara que
 * lo que tomaba por real era una proyección.
 */

import { alternativaTextual, movimientoReducido, paletaDe, resolver, temaActual } from './lenguaje';
import type { Visualizacion } from './lenguaje';
// Solo tipos: no arrastra la biblioteca al bundle, que se carga con import() dinámico más abajo.
import type { BufferGeometry } from 'three';

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosCaverna {
  etiqueta: string;
  moverLuz: string;
  girar: string;
  volver: string;
  resolucionLuz: string;
  resolucionGiro: string;
  resolucionEstatica: string;
  /** Aviso cuando no hay WebGL o se ha pedido reducir el movimiento. */
  avisoEstatico: string;
  alternativaTexto: string;
}

/** Detección de capacidad: si no hay WebGL utilizable, ni se intenta cargar la escena. */
export function soportaWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

function respaldoEstatico(contenedor: HTMLElement, t: TextosCaverna): Visualizacion {
  const aviso = document.createElement('div');
  aviso.className = 'vis-respaldo';
  // El aviso del respaldo lo lee el visitante como cualquier otro texto de la pieza.
  aviso.textContent = t.avisoEstatico;
  contenedor.append(aviso);
  alternativaTextual(contenedor, t.alternativaTexto);
  resolver(contenedor, t.resolucionEstatica);
  return { destruir: () => contenedor.replaceChildren() };
}

export async function crearMundoDeLasIdeas(
  contenedor: HTMLElement, t: TextosCaverna,
): Promise<Visualizacion> {
  if (!soportaWebGL() || movimientoReducido()) return respaldoEstatico(contenedor, t);

  // Carga diferida: Three.js solo se descarga si de verdad se va a instanciar una escena.
  const THREE = await import('three');
  const tema = temaActual();
  const paleta = paletaDe('clasica-griega', tema);

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(tema === 'claro' ? 0xf1efea : 0x0e0d10);

  /*
   * Disposición: la cámara ocupa el sitio del prisionero, encadenado de cara al muro. La hoguera y
   * los objetos quedan A SU ESPALDA, fuera de cuadro. Es la única colocación que hace funcionar la
   * idea: si la cámara ve los objetos desde el principio, el usuario nunca llega a tomar las
   * sombras por la realidad y no hay nada que descubrir al girarse.
   *
   *   muro (z -2.4)  <-  CÁMARA (z +0.5)  ·  objetos (z +1.8)  ·  hoguera (z +4.6)
   *
   * Y la hoguera va POR DEBAJO de los objetos, no encima. Con la luz arriba, las sombras caen al
   * suelo y el muro se queda liso: la primera versión no proyectaba nada. Con la luz baja, las
   * sombras suben al muro y además se agrandan, que es lo que las vuelve imponentes.
   *
   * La distancia hoguera-objetos fija cuánto se agrandan: el factor es la razón entre
   * (hoguera->muro) y (hoguera->objetos). Con la hoguera cerca salía 3,3x y las siluetas llenaban
   * el cuadro como manchas irreconocibles. Con este reparto el factor es 2,5x: siguen siendo más
   * grandes que los objetos —eso es parte de la idea— pero se reconocen.
   *
   * Los objetos también tuvieron que alejarse de la cámara. Hay dos vistas que satisfacer con una
   * sola disposición: mirando al muro, las sombras deben caber enteras; girado, los tres objetos
   * deben verse completos y separados. A 1,3 m llenaban la pantalla al girarse; a 2,1 m entran con
   * margen, y como la hoguera se aleja en la misma proporción, el factor de magnificación no varía.
   * La cámara no se mueve en ningún momento: el prisionero está encadenado, no puede retroceder.
   */
  const Z_MURO = -2.4;
  const Z_OBJETOS = 2.6;
  const Z_HOGUERA = 6.0;
  const Y_OBJETOS = 0.6;
  // La altura de la hoguera decide dónde caen las sombras en vertical: con -0.05 subían tanto que
  // se salían del muro por arriba. Con 0.2 quedan centradas en el campo de visión.
  const Y_HOGUERA = 0.2;

  // Misma proporción de hueco que las piezas 2D (--vis-proporcion, 7/3). El campo de visión
  // vertical no cambia, así que las sombras siguen cabiendo; lo que gana es anchura.
  const PROPORCION = 7 / 3;

  const camara = new THREE.PerspectiveCamera(48, PROPORCION, 0.1, 100);
  camara.position.set(0, 0.55, 0.5);

  const render = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  render.shadowMap.enabled = true;
  render.shadowMap.type = THREE.PCFSoftShadowMap;
  render.domElement.className = 'vis-canvas';
  render.domElement.setAttribute('role', 'img');
  render.domElement.setAttribute('aria-label', t.etiqueta);
  contenedor.append(render.domElement);

  // Materiales mate y sin reflejos: carácter propio, no PBR fotorrealista de catálogo (fase 3).
  // En tema oscuro el muro NO se oscurece hasta el fondo: si lo hiciera, la sombra dejaría de
  // leerse y la pieza perdería justo aquello que tiene que demostrar.
  const muro = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 3.4),
    new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0xe8e2d8 : 0x3a3742 }),
  );
  muro.position.set(0, 0.75, Z_MURO);
  muro.receiveShadow = true;
  escena.add(muro);

  const suelo = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0xd8d2c6 : 0x2a2833 }),
  );
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = -1.2;
  suelo.receiveShadow = true;
  escena.add(suelo);

  // Los objetos reales, a espaldas del observador. Geometría propia y de bajo recuento de polígonos.
  const objetos = new THREE.Group();
  const formas: BufferGeometry[] = [
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.ConeGeometry(0.32, 0.7, 6),
    new THREE.TorusGeometry(0.28, 0.1, 8, 16),
  ];
  formas.forEach((g, i) => {
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: paleta.acento }));
    m.position.set((i - 1) * 0.55, Y_OBJETOS, Z_OBJETOS);
    m.castShadow = true;
    objetos.add(m);
  });
  escena.add(objetos);

  // La hoguera es la excepción de color declarada en la fase 3: aquí la luz no decora, es el
  // fenómeno. Tono poco saturado a propósito: con un naranja fuerte el muro salía marrón sucio y
  // la escena se parecía a cualquier render de catálogo, que es lo que el sistema quiere evitar.
  // Intensidad alta porque la caída es cuadrática y la hoguera está a 8,4 m del muro.
  const hoguera = new THREE.PointLight(0xffd9b0, 140, 32, 2);
  hoguera.position.set(0, Y_HOGUERA, Z_HOGUERA);
  hoguera.castShadow = true;
  // 2048 y no 1024: al magnificarse 2,5 veces, el borde de la sombra se dentaba de forma visible.
  hoguera.shadow.mapSize.set(2048, 2048);
  hoguera.shadow.camera.near = 0.4;
  hoguera.shadow.camera.far = 20;
  hoguera.shadow.bias = -0.002;
  escena.add(hoguera);
  escena.add(new THREE.AmbientLight(0xffffff, tema === 'claro' ? 0.30 : 0.16));

  // Solo se ve al girarse: está detrás de la cámara mientras se mira al muro.
  const marcaLuz = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0xffd9b0 }),
  );
  escena.add(marcaLuz);

  const MIRA_MURO = new THREE.Vector3(0, 0.85, Z_MURO);
  const MIRA_DETRAS = new THREE.Vector3(0, 0.35, Z_HOGUERA);
  const mira = MIRA_MURO.clone();
  let destino = MIRA_MURO;
  let luzX = 0;
  let animacion = 0;
  let haMirado = false;

  function redimensionar(): void {
    const ancho = contenedor.clientWidth;
    const alto = Math.round(ancho / PROPORCION);
    render.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }

  function bucle(): void {
    // La cámara no orbita: gira sobre sí misma, como quien está encadenado y solo puede volver
    // la cabeza. Orbitar daría una vista exterior de la caverna, que es la posición que la idea
    // niega que exista.
    mira.lerp(destino, 0.07);
    camara.lookAt(mira);

    hoguera.position.x = luzX;
    marcaLuz.position.copy(hoguera.position);

    render.render(escena, camara);
    animacion = requestAnimationFrame(bucle);
  }

  const controles = document.createElement('div');
  controles.className = 'vis-controles';

  const luz = document.createElement('input');
  luz.type = 'range';
  luz.min = '-140'; luz.max = '140'; luz.value = '0';
  luz.setAttribute('aria-label', t.moverLuz);
  luz.addEventListener('input', () => {
    luzX = Number(luz.value) / 100;
    if (!haMirado) resolver(contenedor, t.resolucionLuz);
  });

  const girar = document.createElement('button');
  girar.type = 'button';
  girar.textContent = t.girar;
  girar.addEventListener('click', () => {
    haMirado = !haMirado;
    destino = haMirado ? MIRA_DETRAS : MIRA_MURO;
    girar.textContent = haMirado ? t.volver : t.girar;
    if (haMirado) {
      resolver(contenedor, t.resolucionGiro);
    }
  });

  controles.append(luz, girar);
  contenedor.append(controles);
  alternativaTextual(contenedor, t.alternativaTexto);

  window.addEventListener('resize', redimensionar);
  redimensionar();
  bucle();

  return {
    destruir(): void {
      cancelAnimationFrame(animacion);
      window.removeEventListener('resize', redimensionar);
      // Liberar de verdad: geometrías, materiales y el propio contexto. Sin esto, abrir varias
      // ideas 3D seguidas agota la memoria de GPU en dispositivos de gama baja.
      escena.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
      render.dispose();
      render.forceContextLoss();
      contenedor.replaceChildren();
    },
  };
}
