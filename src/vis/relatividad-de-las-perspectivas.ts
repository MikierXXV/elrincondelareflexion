/**
 * Escena 3D. Idea: «La relatividad de las perspectivas» (Zhuangzi, filosofía china).
 *
 * justificacion_3d: la tesis es que la posición del observador determina lo que hay, y demostrarlo
 * exige ocupar realmente esas posiciones. La escala de un pájaro, de un pez o de un árbol no se
 * transmite con etiquetas: se transmite estando ahí. Una versión plana tendría que mostrar las
 * perspectivas una al lado de otra desde un punto de vista externo, que es precisamente el punto
 * neutral que Zhuangzi niega que exista.
 *
 * Por eso la interfaz **no ofrece una vista general**: solo se puede estar en un observador o en
 * otro. Al pedir cuál es la etiqueta verdadera, pregunta desde qué punto de vista y no admite
 * «ninguno».
 */

import { paletaDe, resolver, temaActual } from './lenguaje';
import { boton, crearEscena3D } from './escena3d';
import type { Visualizacion } from './lenguaje';

/**
 * Cámara de cada observador. Es estructura, no texto: la altura del pez es la misma en cualquier
 * idioma. El tercero —índice PEZ— tiene además un encuadre propio, y por eso se identifica por
 * posición y no por su nombre, que ahora viaja con el idioma.
 */
const CAMARAS = [
  { altura: 1.7, distancia: 9, fov: 48 },
  { altura: 14, distancia: 16, fov: 62 },
  { altura: 0.12, distancia: 1.4, fov: 78 },
  { altura: 5.5, distancia: 0.2, fov: 40 },
];
const PEZ = 2;

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosPerspectivas {
  etiqueta: string;
  ser: string;
  grande: string;
  lejos: string;
  util: string;
  cualEsLaVerdadera: string;
  respuestaVerdadera: string;
  resolucionFinal: string;
  resolucionRespaldo: string;
  alternativaTexto: string;
  /** Nombre, etiquetas y nota de cada observador, en el orden de CAMARAS. */
  observadores: {
    nombre: string;
    etiquetas: { grande: string; lejos: string; util: string };
    nota: string;
  }[];
}

export async function crearRelatividadDeLasPerspectivas(
  contenedor: HTMLElement, t: TextosPerspectivas,
): Promise<Visualizacion> {
  const OBSERVADORES = CAMARAS.map((c, i) => ({ ...c, ...t.observadores[i]! }));
  const r = await crearEscena3D({
    contenedor,
    etiqueta: t.etiqueta,
    alternativaTexto: t.alternativaTexto,
    resolucionRespaldo: t.resolucionRespaldo,
  });
  if ('respaldo' in r) return r.respaldo;

  const { THREE, escena, camara, controles, animar, visualizacion } = r.escena3d;
  const tema = temaActual();
  const paleta = paletaDe('filosofia-china', tema);
  escena.background = new THREE.Color(tema === 'claro' ? 0xf1efea : 0x0e0d10);

  escena.add(new THREE.AmbientLight(0xffffff, 0.7));
  const sol = new THREE.DirectionalLight(0xffffff, 0.7);
  sol.position.set(6, 12, 4);
  escena.add(sol);

  const suelo = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0xd8d2c6 : 0x24222a }),
  );
  suelo.rotation.x = -Math.PI / 2;
  escena.add(suelo);

  // El árbol: tronco y copa de bajo recuento de polígonos, geometría propia.
  const tronco = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.4, 5, 8),
    new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0x8a7a63 : 0x4a4038 }),
  );
  tronco.position.set(0, 2.5, 0);
  const copa = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.MeshLambertMaterial({ color: paleta.acento, flatShading: true }),
  );
  copa.position.set(0, 6, 0);
  escena.add(tronco, copa);

  // El charco: pequeño para una persona, un mundo para el pez.
  const charco = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 24),
    new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0x9fb4bd : 0x2c3a42 }),
  );
  charco.rotation.x = -Math.PI / 2;
  charco.position.set(3.4, 0.01, 2.2);
  escena.add(charco);

  // Juncos, que dan escala al pez y son invisibles para el pájaro.
  for (let i = 0; i < 9; i++) {
    const junco = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.5 + Math.random() * 0.4, 5),
      new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0x7d8a5a : 0x3c4430 }),
    );
    const a = Math.random() * Math.PI * 2;
    junco.position.set(3.4 + Math.cos(a) * 1.05, 0.3, 2.2 + Math.sin(a) * 1.05);
    escena.add(junco);
  }

  let actual = 0;
  const visitados = new Set<number>([0]);
  const objetivo = new THREE.Vector3();

  const botones = OBSERVADORES.map((o, i) =>
    boton(controles, `${t.ser} ${o.nombre}`, () => {
      actual = i;
      visitados.add(i);
      botones.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      resolver(
        contenedor,
        visitados.size >= OBSERVADORES.length
          ? t.resolucionFinal
          : `${o.nota}  ·  ${t.grande}: ${o.etiquetas.grande} · ${t.lejos}: ${o.etiquetas.lejos} · ${t.util}: ${o.etiquetas.util}`,
      );
    }),
  );

  // No hay botón de «vista general»: esa posición es la que la idea niega.
  boton(controles, t.cualEsLaVerdadera, () => {
    resolver(contenedor, t.respuestaVerdadera);
  });

  animar(() => {
    const o = OBSERVADORES[actual]!;
    const destino = actual === PEZ
      ? new THREE.Vector3(3.4, o.altura, 2.2 + o.distancia * 0.1)
      : new THREE.Vector3(0, o.altura, o.distancia);
    camara.position.lerp(destino, 0.05);
    camara.fov += (o.fov - camara.fov) * 0.05;
    camara.updateProjectionMatrix();
    /*
     * Se compara el ÍNDICE, no el nombre. Antes preguntaba `o.nombre === 'un pez'`, así que en la
     * versión inglesa la condición no se cumplía nunca y la cámara del pez miraba al centro de la
     * escena en vez de a ras de agua. El índice ya estaba disponible en `PEZ`.
     */
    objetivo.lerp(actual === PEZ ? new THREE.Vector3(3.4, 0.05, 2.2) : new THREE.Vector3(0, 3, 0), 0.05);
    camara.lookAt(objetivo);
  });

  /*
   * El estado se declara en TODOS los botones, no solo en el elegido.
   *
   * Marcando únicamente el primero, los otros tres no eran «no pulsados»: eran botones que no
   * declaraban estado, y un lector de pantalla los anuncia como acciones sueltas en vez de como las
   * opciones de un grupo del que ya hay una tomada. Se veía además a simple vista, porque la hoja de
   * estilo da forma de pastilla a lo que declara estado: al arrancar, una sola opción parecía de otra
   * familia que sus tres hermanas, y las demás solo se enderezaban tras el primer clic.
   */
  botones.forEach((b, i) => b.setAttribute('aria-pressed', String(i === 0)));
  resolver(contenedor, OBSERVADORES[0]!.nota);
  return visualizacion;
}
