/**
 * Escena 3D. Idea: «La vista desde arriba» (Marco Aurelio, helenismo).
 *
 * justificacion_3d: el ejercicio consiste en alejarse de forma continua, y su efecto depende de que
 * el desplazamiento sea real y sin cortes. La preocupación conserva su tamaño físico mientras entran
 * en cuadro la habitación, la ciudad, el continente y los siglos. Un zoom plano por saltos rompería
 * justo lo que produce el cambio de escala.
 *
 * Detalle que hace de esto un argumento: **la preocupación no se encoge**. Mide lo mismo al final
 * que al principio; lo que cambia es todo lo demás. Si la achicáramos, la pieza estaría diciendo que
 * el problema era menor, y no es eso: es que estaba mirado demasiado de cerca.
 */

import { paletaDe, resolver, temaActual } from './lenguaje';
import { boton, crearEscena3D } from './escena3d';
import type { Visualizacion } from './lenguaje';

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosEscala {
  etiqueta: string;
  alejar: string;
  acercar: string;
  resolucionFinal: string;
  resolucionRespaldo: string;
  alternativaTexto: string;
  /** Distancia de cámara de cada escala y qué entra en cuadro a partir de ahí. */
  escalas: { z: number; nombre: string; nota: string }[];
}

export async function crearVistaDesdeArriba(
  contenedor: HTMLElement, t: TextosEscala,
): Promise<Visualizacion> {
  const ESCALAS = t.escalas;
  const r = await crearEscena3D({
    contenedor,
    etiqueta: t.etiqueta,
    alternativaTexto: t.alternativaTexto,
    resolucionRespaldo: t.resolucionRespaldo,
  });
  if ('respaldo' in r) return r.respaldo;

  const { THREE, escena, camara, controles, animar, visualizacion } = r.escena3d;
  const tema = temaActual();
  const paleta = paletaDe('helenismo', tema);
  escena.background = new THREE.Color(tema === 'claro' ? 0xf1efea : 0x0e0d10);

  escena.add(new THREE.AmbientLight(0xffffff, 0.9));
  const luz = new THREE.DirectionalLight(0xffffff, 0.6);
  luz.position.set(3, 6, 8);
  escena.add(luz);

  // La preocupación: una placa que nunca cambia de tamaño.
  const asunto = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.1, 0.2),
    new THREE.MeshLambertMaterial({ color: paleta.acento }),
  );
  escena.add(asunto);

  /**
   * Los estratos del entorno. Cada uno vive a su propia escala y solo se distingue cuando la cámara
   * está lo bastante lejos: así el cuadro nunca está vacío ni saturado.
   */
  const estratos = [
    { radio: 14, cantidad: 40, tam: 1.2 },
    { radio: 70, cantidad: 160, tam: 4 },
    { radio: 340, cantidad: 320, tam: 16 },
    { radio: 1500, cantidad: 500, tam: 70 },
  ].map(({ radio, cantidad, tam }) => {
    const geo = new THREE.BoxGeometry(tam, tam * 0.35, tam * 0.1);
    const mat = new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0xc9c2b4 : 0x3a3742 });
    const malla = new THREE.InstancedMesh(geo, mat, cantidad);
    const m = new THREE.Matrix4();
    for (let i = 0; i < cantidad; i++) {
      const ang = Math.random() * Math.PI * 2;
      const d = radio * (0.35 + Math.random() * 0.65);
      m.makeTranslation(Math.cos(ang) * d, (Math.random() - 0.5) * radio * 0.5, Math.sin(ang) * d - radio * 0.2);
      malla.setMatrixAt(i, m);
    }
    escena.add(malla);
    return malla;
  });

  let objetivoZ = ESCALAS[0]!.z;
  let indice = 0;
  const alcanzados = new Set<number>([0]);
  camara.position.set(0, 0, objetivoZ);

  const alejar = boton(controles, t.alejar, () => mover(1));
  const acercar = boton(controles, t.acercar, () => mover(-1));

  function mover(delta: number): void {
    indice = Math.max(0, Math.min(ESCALAS.length - 1, indice + delta));
    objetivoZ = ESCALAS[indice]!.z;
    alcanzados.add(indice);
    alejar.disabled = indice >= ESCALAS.length - 1;
    acercar.disabled = indice === 0;
    resolver(
      contenedor,
      alcanzados.size >= ESCALAS.length
        ? t.resolucionFinal
        : ESCALAS[indice]!.nota,
    );
  }

  animar(() => {
    // Interpolación logarítmica: sin ella, los saltos entre escalas se sienten como cortes.
    const z = camara.position.z;
    camara.position.z = Math.exp(Math.log(z) + (Math.log(objetivoZ) - Math.log(z)) * 0.06);
    camara.lookAt(0, 0, 0);
    // La placa se reescala con la distancia para conservar su tamaño APARENTE constante.
    const factor = camara.position.z / ESCALAS[0]!.z;
    asunto.scale.setScalar(factor);
    estratos.forEach((e, i) => {
      e.visible = camara.position.z > [8, 40, 200, 900][i]!;
    });
  });

  resolver(contenedor, ESCALAS[0]!.nota);
  acercar.disabled = true;
  return visualizacion;
}
