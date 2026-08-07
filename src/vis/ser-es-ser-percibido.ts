/**
 * Escena 3D. Idea: «Ser es ser percibido» (Berkeley, empirismo).
 *
 * justificacion_3d: lo que la idea pone en juego es el campo visual de un observador situado en un
 * lugar concreto, con oclusiones reales y objetos que salen de cuadro al girar la cabeza. En un
 * recorte plano el usuario sigue viendo la escena completa desde fuera, que es exactamente la
 * posición que Berkeley niega que exista.
 *
 * El acierto no es apagar lo no percibido —eso sería afirmar que desaparece, que no es su tesis—
 * sino **volverlo indescriptible**: el panel de descripción solo admite términos perceptivos, y de
 * lo que está fuera del campo visual no queda ninguno que aplicar. Con el observador permanente
 * activado, la escena recupera continuidad sin que el usuario tenga que mirarla.
 */

import { paletaDe, resolver, temaActual } from './lenguaje';
import { boton, crearEscena3D } from './escena3d';
import type { Visualizacion } from './lenguaje';

/**
 * Los objetos se distinguen por FORMA y no por color: la regla de tres roles del sistema no admite
 * un color por objeto, y aquí además sería contraproducente, porque el color es uno de los términos
 * perceptivos cuya desaparición es el argumento de la pieza. La forma y el ángulo son estructura;
 * el nombre viaja con el idioma y viene de la ficha.
 */
const GEOMETRIA: { angulo: number; forma: 'caja' | 'cilindro' | 'esfera' | 'cono' }[] = [
  { angulo: 0.0, forma: 'cono' },
  { angulo: 1.7, forma: 'caja' },
  { angulo: 3.1, forma: 'esfera' },
  { angulo: 4.6, forma: 'cilindro' },
];

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosClaro {
  etiqueta: string;
  girarIzquierda: string;
  girarDerecha: string;
  anadirObservador: string;
  retirarObservador: string;
  conObservador: string;
  sinObservador: string;
  loPercibes: string;
  alguienLoPercibe: string;
  sinTerminos: string;
  inicial: string;
  fueraDelCampo: string;
  fueraDelCampoUna: string;
  resolucionRespaldo: string;
  alternativaTexto: string;
  /** Nombres visibles de los cuatro objetos, en el orden de GEOMETRIA. */
  objetos: string[];
}

export async function crearSerEsSerPercibido(
  contenedor: HTMLElement, t: TextosClaro,
): Promise<Visualizacion> {
  const OBJETOS = GEOMETRIA.map((g, i) => ({ ...g, nombre: t.objetos[i]! }));
  const r = await crearEscena3D({
    contenedor,
    etiqueta: t.etiqueta,
    alternativaTexto: t.alternativaTexto,
    resolucionRespaldo: t.resolucionRespaldo,
  });
  if ('respaldo' in r) return r.respaldo;

  const { THREE, escena, camara, controles, animar, visualizacion } = r.escena3d;
  const tema = temaActual();
  const paleta = paletaDe('empirismo', tema);
  escena.background = new THREE.Color(tema === 'claro' ? 0xf1efea : 0x0e0d10);

  escena.add(new THREE.AmbientLight(0xffffff, 0.75));
  const sol = new THREE.DirectionalLight(0xffffff, 0.6);
  sol.position.set(4, 9, 3);
  escena.add(sol);

  const suelo = new THREE.Mesh(
    new THREE.CircleGeometry(30, 40),
    new THREE.MeshLambertMaterial({ color: tema === 'claro' ? 0xd8d2c6 : 0x24222a }),
  );
  suelo.rotation.x = -Math.PI / 2;
  escena.add(suelo);

  camara.position.set(0, 1.6, 0);

  const geometria = (forma: (typeof OBJETOS)[number]['forma']) => {
    switch (forma) {
      case 'cono': return new THREE.ConeGeometry(0.9, 2.6, 7);
      case 'caja': return new THREE.BoxGeometry(1.5, 1.8, 1.5);
      case 'esfera': return new THREE.SphereGeometry(0.85, 16, 12);
      case 'cilindro': return new THREE.CylinderGeometry(0.7, 0.7, 1.2, 12);
    }
  };

  const cuerpos = OBJETOS.map((o) => {
    const malla = new THREE.Mesh(
      geometria(o.forma),
      new THREE.MeshLambertMaterial({ color: paleta.acento }),
    );
    malla.position.set(Math.cos(o.angulo) * 8, 1.2, Math.sin(o.angulo) * 8);
    escena.add(malla);
    return { ...o, malla };
  });

  // Panel de descripción: es donde se juega la idea, y por eso vive en el DOM y no en la escena.
  const panel = document.createElement('div');
  panel.className = 'vis-panel-percepcion';
  contenedor.insertBefore(panel, controles);

  let giro = 0;
  let objetivoGiro = 0;
  let observadorPermanente = false;
  const frustum = new THREE.Frustum();
  const matriz = new THREE.Matrix4();
  let haGirado = false;

  boton(controles, t.girarIzquierda, () => { objetivoGiro -= Math.PI / 2; haGirado = true; });
  boton(controles, t.girarDerecha, () => { objetivoGiro += Math.PI / 2; haGirado = true; });
  const bObs = boton(controles, t.anadirObservador, () => {
    observadorPermanente = !observadorPermanente;
    bObs.textContent = observadorPermanente ? t.retirarObservador : t.anadirObservador;
    bObs.setAttribute('aria-pressed', String(observadorPermanente));
    resolver(
      contenedor,
      observadorPermanente
        ? t.conObservador
        : t.sinObservador,
    );
  });

  animar(() => {
    giro += (objetivoGiro - giro) * 0.07;
    camara.rotation.y = giro;

    matriz.multiplyMatrices(camara.projectionMatrix, camara.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matriz);

    const filas = cuerpos.map((c) => {
      const visible = frustum.containsPoint(c.malla.position);
      const describible = visible || observadorPermanente;
      return { nombre: c.nombre, visible, describible };
    });

    panel.innerHTML = filas
      .map((f) => {
        const estado = f.visible
          ? t.loPercibes
          : f.describible
            ? t.alguienLoPercibe
            : t.sinTerminos;
        return `<span class="${f.describible ? 'si' : 'no'}">${f.nombre} — ${estado}</span>`;
      })
      .join('');

    const sinDescribir = filas.filter((f) => !f.describible).length;
    if (haGirado && sinDescribir > 0 && !observadorPermanente) {
      resolver(
        contenedor,
        (sinDescribir === 1 ? t.fueraDelCampoUna : t.fueraDelCampo).replace('{n}', String(sinDescribir)),
      );
    }
  });

  resolver(contenedor, t.inicial);
  return visualizacion;
}
