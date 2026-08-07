/**
 * Escena 3D. Idea: «Las condiciones a priori» (Kant, ilustración e idealismo).
 *
 * justificacion_3d: la idea es que se mira A TRAVÉS de algo, y eso exige que exista un «a través»
 * real: capas interpuestas entre el observador y la escena, con profundidad efectiva. En plano,
 * retirar una capa parece quitar un filtro de color.
 *
 * Lo decisivo: al retirar una capa **la escena no se muestra más pura, deja de ser representable**.
 * Sin espacio los objetos no tienen dónde estar; sin tiempo el movimiento no se compone; sin
 * causalidad nada responde a nada. Si al retirarlas apareciera un mundo más nítido, la pieza estaría
 * diciendo lo contrario de Kant: que las categorías estorban en vez de hacer posible la experiencia.
 */

import { paletaDe, resolver, temaActual } from './lenguaje';
import { boton, crearEscena3D } from './escena3d';
import type { Visualizacion } from './lenguaje';

/*
 * Las tres capas se identifican por posición y no por un id en castellano: el nombre visible viaja
 * con el idioma, la identidad no. `espacio` es la capa 0 en cualquier idioma.
 */
type Capa = 0 | 1 | 2;
const Z_CAPAS = [1.4, 2.2, 3.0];
const [ESPACIO, TIEMPO, CAUSALIDAD] = [0, 1, 2] as const;

/** Rótulos, desde la ficha de la idea. Ver la nota sobre `textos` en registro.ts. */
export interface TextosCapasKant {
  etiqueta: string;
  retirar: string;
  reponer: string;
  inicial: string;
  resolucionFinal: string;
  resolucionRespaldo: string;
  alternativaTexto: string;
  /** Nombre visible y consecuencia de retirar cada capa, en el orden espacio, tiempo, causalidad. */
  capas: { nombre: string; nota: string }[];
}

export async function crearCondicionesAPriori(
  contenedor: HTMLElement, t: TextosCapasKant,
): Promise<Visualizacion> {
  const CAPAS = Z_CAPAS.map((z, i) => ({ id: i as Capa, z, nombre: t.capas[i]!.nombre, nota: t.capas[i]!.nota }));
  const r = await crearEscena3D({
    contenedor,
    etiqueta: t.etiqueta,
    alternativaTexto: t.alternativaTexto,
    resolucionRespaldo: t.resolucionRespaldo,
  });
  if ('respaldo' in r) return r.respaldo;

  const { THREE, escena, camara, controles, animar, visualizacion } = r.escena3d;
  const tema = temaActual();
  const paleta = paletaDe('ilustracion-idealismo', tema);
  escena.background = new THREE.Color(tema === 'claro' ? 0xf1efea : 0x0e0d10);

  escena.add(new THREE.AmbientLight(0xffffff, 0.55));
  const luz = new THREE.DirectionalLight(0xffffff, 0.75);
  luz.position.set(2, 5, 6);
  escena.add(luz);

  camara.position.set(0, 0.9, 5.6);
  camara.lookAt(0, 0.1, -1);

  // El suelo da el «dónde»: al retirar el espacio, desaparece.
  const suelo = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14, 14, 14),
    new THREE.MeshBasicMaterial({ color: tema === 'claro' ? 0xd8d2c6 : 0x2a2833, wireframe: true }),
  );
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = -1;
  escena.add(suelo);

  // Los cuerpos: uno rueda hacia el otro, y el segundo responde. Ahí está la causalidad.
  const material = new THREE.MeshLambertMaterial({ color: paleta.acento });
  const movil = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), material);
  const quieto = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), material.clone());
  escena.add(movil, quieto);

  // Las capas interpuestas: existen en el espacio entre la cámara y la escena.
  const capas = CAPAS.map((c) => {
    const malla = new THREE.Mesh(
      new THREE.PlaneGeometry(5.4, 2.6),
      new THREE.MeshBasicMaterial({
        color: paleta.senal,
        transparent: true,
        opacity: tema === 'claro' ? 0.07 : 0.10,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    malla.position.set(0, 0.55, c.z);
    escena.add(malla);
    return { ...c, malla };
  });

  const activas = new Set<Capa>(CAPAS.map((c) => c.id));
  const retiradas = new Set<Capa>();

  const botones = CAPAS.map((c) =>
    boton(controles, `${t.retirar} «${c.nombre}»`, () => {
      if (activas.has(c.id)) { activas.delete(c.id); retiradas.add(c.id); }
      else activas.add(c.id);
      pintar();
      resolver(
        contenedor,
        retiradas.size >= CAPAS.length
          ? t.resolucionFinal
          : c.nota,
      );
    }),
  );

  function pintar(): void {
    capas.forEach((c) => { c.malla.visible = activas.has(c.id); });
    suelo.visible = activas.has(ESPACIO);
    botones.forEach((b, i) => {
      const { id, nombre } = CAPAS[i]!;
      b.textContent = `${activas.has(id) ? t.retirar : t.reponer} «${nombre}»`;
      b.setAttribute('aria-pressed', String(!activas.has(id)));
    });
  }

  let x = -2.2;
  let v = 1.1;
  let choque = false;

  animar((t) => {
    const conEspacio = activas.has(ESPACIO);
    const conTiempo = activas.has(TIEMPO);
    const conCausalidad = activas.has(CAUSALIDAD);

    // Sin tiempo, los instantes no se enlazan: la posición deja de derivar de la anterior.
    if (conTiempo) {
      x += v * 0.016;
      if (x > 0.85 && !choque) { choque = true; if (conCausalidad) v = 0; }
      if (x > 4) { x = -2.2; v = 1.1; choque = false; }
    } else {
      x = -2.2 + ((Math.sin(t * 37) + 1) / 2) * 6;   // saltos incoherentes, sin continuidad
    }

    // Sin causalidad, el segundo cuerpo no responde: se atraviesan.
    const desplazado = conCausalidad && choque ? Math.min(2.6, (x - 0.85) * 1.4) : 0;

    if (conEspacio) {
      movil.position.set(x, -0.55, 0);
      quieto.position.set(1.1 + desplazado, -0.55, 0);
    } else {
      // Sin espacio no hay «dónde»: la posición deja de ser asignable y no se estabiliza.
      movil.position.set(Math.sin(t * 53) * 2.4, Math.cos(t * 41) * 1.1, Math.sin(t * 29) * 1.4);
      quieto.position.set(Math.cos(t * 47) * 2.4, Math.sin(t * 31) * 1.1, Math.cos(t * 37) * 1.4);
    }

    const opacidad = conEspacio && conTiempo ? 1 : 0.35;
    (movil.material as import('three').MeshLambertMaterial).opacity = opacidad;
    (movil.material as import('three').MeshLambertMaterial).transparent = opacidad < 1;
    (quieto.material as import('three').MeshLambertMaterial).opacity = opacidad;
    (quieto.material as import('three').MeshLambertMaterial).transparent = opacidad < 1;
  });

  pintar();
  resolver(contenedor, t.inicial);
  return visualizacion;
}
