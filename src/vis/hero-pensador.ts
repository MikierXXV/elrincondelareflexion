/**
 * Escena 3D del hero: El Pensador de Rodin, en bronce, con contraluz y polvo en suspensión.
 *
 * DERECHOS. La malla es un escaneo de terceros bajo **CC BY** —Rigsters, fotogrametría de 2017— y
 * eso obliga a dos cosas: atribuir en el sitio y declarar las modificaciones. Ambas están en
 * `assets/CREDITOS.md`, y el procedimiento exacto en `scripts/preparar-pensador.mjs`. La escultura
 * en sí es de dominio público: Rodin murió en 1917. Lo que se licencia es el escaneo, que es obra
 * distinta.
 *
 * DE DÓNDE VIENE EL ASPECTO. Del escaneo se conserva solo la geometría. Sus texturas eran
 * fotogrametría —el color y las sombras del bronce real bajo la luz de aquel día— y competían con
 * la iluminación de la escena en vez de sumarse a ella. El material y las luces son propios, y son
 * lo que hace que la pieza pertenezca a este sitio y no parezca pegada de otro.
 *
 * TRES DECISIONES QUE SOSTIENEN LA IMAGEN:
 *
 *  1. **El contraluz dibuja la silueta.** Una figura oscura sobre fondo oscuro solo se lee por el
 *     borde. La luz fría de detrás es la que la separa del fondo; la cálida de delante solo modela.
 *  2. **El metal necesita algo que reflejar.** Sin entorno, `metalness` alta se ve negra: un metal
 *     no tiene color propio, refleja el que hay. Se genera un entorno mínimo por código.
 *  3. **El bloom es un lujo, no un requisito.** Se apaga con movimiento reducido y en equipos
 *     modestos, y la escena sigue siendo la misma sin él.
 */

import { movimientoReducido, temaActual } from './lenguaje';
import { crearEscena3D } from './escena3d';
import { T } from '../app/textos';
import type { Visualizacion } from './lenguaje';

/** El fichero lo produce scripts/preparar-pensador.mjs. Vive en public/ y se sirve tal cual. */
const MALLA = `${import.meta.env.BASE_URL}pensador.glb`;

/**
 * Bronce con pátina. El primer intento salió dorado y pulido, que es un bronce de trofeo: los
 * vaciados de Rodin son marrón muy oscuro con verdín, y brillan solo en las aristas.
 *
 * En claro va más oscuro y más mate —la figura se lee por contraste contra un fondo casi blanco— y
 * en oscuro algo más claro y más especular, porque allí lo único que la separa del fondo es el
 * brillo del contraluz.
 */
const BRONCE = {
  claro: { color: 0x4a3c29, rugosidad: 0.52, metalico: 0.82, intensidadEntorno: 0.9 },
  oscuro: { color: 0x6b5334, rugosidad: 0.46, metalico: 0.88, intensidadEntorno: 0.78 },
} as const;

/**
 * Atmósfera: la misma en los dos temas, **invertida**.
 *
 * El primer intento la aplicó igual a ambos y en claro la figura salía velada: un halo aditivo sobre
 * un fondo casi blanco no puede añadir luz, solo puede borrar. Pero la conclusión no era que en
 * claro no tocase nada, sino que sobre fondo claro lo que separa una figura del fondo no es un
 * resplandor sino una penumbra. Así que en claro el halo se pinta oscuro y en modo multiplicar, y el
 * polvo pasa de motas de luz a motas de sombra: el efecto percibido es el mismo, la figura ocupa un
 * lugar en vez de estar recortada sobre un plano.
 *
 * EL BLOOM NO PUEDE IR EN CLARO, y no es una renuncia estética sino aritmética: el bloom hace
 * florecer lo que supera un umbral de brillo, y sobre una página casi blanca lo más brillante del
 * cuadro **es el propio fondo**. Al probarlo, florecía el fondo entero y salía un cuadrado blanco
 * tramado alrededor de la figura. En claro el relieve lo dan la penumbra y el polvo.
 */
const ATMOSFERA = {
  claro: {
    halo: { color: '92, 78, 58', centro: 0.16, medio: 0.05, aditiva: false },
    polvo: { color: 0x6b5f4c, opacidad: 0.32, aditiva: false },
    bloom: null,
  },
  oscuro: {
    halo: { color: '255, 228, 190', centro: 0.34, medio: 0.11, aditiva: true },
    polvo: { color: 0xdcd0b8, opacidad: 0.7, aditiva: true },
    bloom: { fuerza: 0.45, radio: 0.6, umbral: 0.86 },
  },
} as const;

type Atmosfera = (typeof ATMOSFERA)['claro' | 'oscuro'];

/**
 * El bloom cuesta un render target más y una cadena de desenfoques. En un equipo modesto eso se
 * nota justo al arrancar, que es el peor momento. Se mira lo que el navegador deja saber; ninguna
 * señal es fiable por sí sola, así que basta con que una diga que no.
 */
function admiteLujo(): boolean {
  if (movimientoReducido()) return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;
  return true;
}

/** Color de fondo de la página. El lienzo lo replica dentro para que no se vea su borde. */
function fondoDePagina(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--fondo').trim() || '#141317';
}

/**
 * Entorno de reflexión, generado en código.
 *
 * Un degradado equirectangular diminuto —32×16— basta: lo que un metal mate refleja no es detalle,
 * es un reparto de claros y oscuros. Se procesa con PMREM, que es lo que convierte una imagen plana
 * en los niveles de borrosidad que la rugosidad del material va a muestrear.
 */
function crearEntorno(
  THREE: typeof import('three'),
  render: import('three').WebGLRenderer,
  tema: 'claro' | 'oscuro',
): import('three').Texture {
  const ancho = 32;
  const alto = 16;
  const datos = new Uint8Array(ancho * alto * 4);
  const cielo = tema === 'claro' ? [255, 246, 232] : [150, 160, 190];
  const suelo = tema === 'claro' ? [70, 62, 52] : [16, 15, 20];

  for (let y = 0; y < alto; y++) {
    // Cuadrática y no lineal: concentra la luz arriba, como un cielo, en vez de repartirla plana.
    const t = (1 - y / (alto - 1)) ** 2;
    for (let x = 0; x < ancho; x++) {
      const i = (y * ancho + x) * 4;
      for (let c = 0; c < 3; c++) datos[i + c] = suelo[c]! + (cielo[c]! - suelo[c]!) * t;
      datos[i + 3] = 255;
    }
  }
  /*
    * Una zona clara concentrada: es la que produce el reflejo especular del metal. NO puede ser
    * blanco puro. Con 255 el especular saturaba y el bronce con pátina se convertía en oro pulido:
    * un metal se ve dorado o se ve oscuro según lo que le pongas enfrente, no según su color base.
    */
  for (let y = 1; y < 4; y++) {
    for (let x = 20; x < 27; x++) {
      const i = (y * ancho + x) * 4;
      datos[i] = 206; datos[i + 1] = 196; datos[i + 2] = 178;
    }
  }

  const textura = new THREE.DataTexture(datos, ancho, alto, THREE.RGBAFormat);
  textura.mapping = THREE.EquirectangularReflectionMapping;
  textura.needsUpdate = true;

  const pmrem = new THREE.PMREMGenerator(render);
  const entorno = pmrem.fromEquirectangular(textura).texture;
  pmrem.dispose();
  textura.dispose();
  return entorno;
}

/** Halo de contraluz: degradado radial en un lienzo, pegado detrás de la figura. */
function crearHalo(THREE: typeof import('three'), op: Atmosfera['halo']): import('three').Sprite {
  const lado = 256;
  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = lado;
  const ctx = lienzo.getContext('2d')!;
  const g = ctx.createRadialGradient(lado / 2, lado / 2, 0, lado / 2, lado / 2, lado / 2);
  /*
   * La caída importa más que la intensidad. Con un degradado lento el halo llegaba vivo al borde del
   * cuadro y se leía como una pared iluminada, con su contorno visible. Cayendo pronto y a cero
   * mucho antes del borde, se lee como el aire alrededor de la figura, que es lo que se buscaba.
   */
  const parada = (a: number) => `rgba(${op.color}, ${a})`;
  g.addColorStop(0, parada(op.centro));
  g.addColorStop(0.22, parada(op.medio));
  g.addColorStop(0.55, parada(op.medio * 0.18));
  g.addColorStop(1, parada(0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, lado, lado);

  const textura = new THREE.CanvasTexture(lienzo);
  return new THREE.Sprite(new THREE.SpriteMaterial({
    map: textura,
    /*
     * Para la penumbra, mezcla normal con un color oscuro y poca opacidad: es lo que hace cualquier
     * sombra suave. Se probó `MultiplyBlending` y fue peor de lo esperado —multiplica también donde
     * la textura es transparente, así que aparecían flecos de color y un recuadro visible—.
     */
    blending: op.aditiva ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: false,
    transparent: true,
  }));
}

/** Motas en suspensión. Dan profundidad y escala sin competir con la figura. */
function crearPolvo(
  THREE: typeof import('three'), radio: number, op: Atmosfera['polvo'],
): import('three').Points {
  const n = 220;
  const posiciones = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    // Distribución en esfera hueca: dentro de la figura no se vería y sería trabajo tirado.
    const r = radio * (1.1 + Math.random() * 1.6);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    posiciones[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    posiciones[i * 3 + 1] = r * Math.cos(phi) * 0.8;
    posiciones[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
  return new THREE.Points(geometria, new THREE.PointsMaterial({
    color: op.color,
    size: radio * 0.012,
    transparent: true,
    opacity: op.opacidad,
    // Sobre fondo claro las motas son sombra y no luz: aditivas serían sencillamente invisibles.
    blending: op.aditiva ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }));
}

export async function crearHeroPensador(contenedor: HTMLElement): Promise<Visualizacion | null> {
  if (movimientoReducido()) return null;

  const r = await crearEscena3D({
    contenedor,
    etiqueta: T.hero.escena,
    alternativaTexto: '',
    resolucionRespaldo: '',
  });
  if ('respaldo' in r) { contenedor.replaceChildren(); return null; }

  const { THREE, escena, camara, render, animar, visualizacion } = r.escena3d;

  /*
   * El andamiaje común añade una fila de controles y un párrafo de alternativa textual. El hero no
   * tiene ni una cosa ni la otra, y aunque vacíos seguían ocupando alto: el hueco dejaba de ser
   * cuadrado y la figura se descuadraba respecto al lienzo. Se retiran explícitamente.
   */
  r.escena3d.controles.remove();
  contenedor.querySelector('.vis-alternativa')?.remove();

  const tema = temaActual();
  const bronce = BRONCE[tema];

  /*
   * FONDO DEL COLOR DE LA PÁGINA, Y SIN MAPEO DE TONOS. Las dos cosas van juntas.
   *
   * El compositor de bloom escribe alfa opaco, así que pedir un lienzo transparente no sirve de nada
   * en cuanto se compone: el rectángulo aparece igual. La otra vía —pintar dentro el color de la
   * página— fallaba porque el mapeo ACES se aplica TAMBIÉN al fondo y lo devolvía más oscuro.
   *
   * Quitando el mapeo, el viaje sRGB → lineal → sRGB devuelve el mismo color, así que el fondo del
   * lienzo y el de la página son el mismo y no hay borde que ver. Lo que se pierde es la caída
   * filmica de los brillos, y se compensa bajando las luces para que no recorten.
   */
  escena.background = new THREE.Color(fondoDePagina());
  render.toneMapping = THREE.NoToneMapping;

  const entorno = crearEntorno(THREE, render, tema);
  escena.environment = entorno;

  // ---- la malla ----
  const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/libs/meshopt_decoder.module.js'),
  ]);

  const cargador = new GLTFLoader();
  cargador.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await cargador.loadAsync(MALLA);

  const figura = gltf.scene;
  const material = new THREE.MeshStandardMaterial({
    color: bronce.color,
    metalness: bronce.metalico,
    roughness: bronce.rugosidad,
    envMapIntensity: bronce.intensidadEntorno,
  });
  figura.traverse((o) => {
    if ((o as import('three').Mesh).isMesh) {
      const malla = o as import('three').Mesh;
      // El material del fichero se descarta entero: llevaba las texturas de fotogrametría, que ya
      // no existen, y sus parámetros estaban pensados para otra iluminación.
      const viejo = malla.material;
      (Array.isArray(viejo) ? viejo : [viejo]).forEach((m) => m.dispose());
      malla.material = material;
      malla.castShadow = malla.receiveShadow = false;
    }
  });

  // Se cuelga de un pivote y se desplaza la figura dentro de él, para que el eje de giro pase por su
  // centro de masas. Girando el grupo directamente, la silueta se paseaba por el cuadro.
  const pivote = new THREE.Group();
  pivote.add(figura);
  escena.add(pivote);

  figura.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(figura);
  const centro = caja.getCenter(new THREE.Vector3());
  const tam = caja.getSize(new THREE.Vector3());
  figura.position.sub(centro);

  // ---- atmósfera ----
  const radio = Math.max(tam.x, tam.y, tam.z) * 0.5;

  const atmosfera = ATMOSFERA[tema];

  const halo = crearHalo(THREE, atmosfera.halo);
  halo.scale.setScalar(radio * 2.8);
  escena.add(halo);

  // El polvo sí va en los dos temas, pero en claro apenas se insinúa: sobre fondo claro unas motas
  // brillantes serían suciedad, no atmósfera.
  const polvo = crearPolvo(THREE, radio, atmosfera.polvo);
  escena.add(polvo);

  // ---- luz ----
  // La clave modela y la contra separa del fondo. Sin la segunda, un bronce oscuro sobre un fondo
  // oscuro es una mancha: el borde iluminado es lo único que lo convierte en una figura.
  // Intensidades más bajas que con ACES: sin mapeo de tonos no hay caída suave y todo lo que pase
  // de 1 recorta a blanco plano, que en un bronce se ve como plástico.
  const clave = new THREE.DirectionalLight(0xffe8c8, tema === 'claro' ? 1.5 : 1.15);
  clave.position.set(-2.4, 2.2, 3.2);
  const contra = new THREE.DirectionalLight(0xcfe0ff, tema === 'claro' ? 1.1 : 2.1);
  contra.position.set(2.6, 1.4, -3.0);
  const relleno = new THREE.AmbientLight(0xffffff, tema === 'claro' ? 0.42 : 0.18);
  escena.add(clave, contra, relleno);

  // ---- encuadre ----
  // La figura solo gira en Y, así que lo que puede salirse por los lados es la diagonal en planta;
  // en vertical basta la altura. La esfera envolvente completa cuenta la altura dos veces y dejaba
  // la figura diminuta en medio del cuadro.
  camara.fov = 34;
  camara.aspect = 1;
  const radioEnPlanta = Math.hypot(tam.x, tam.z) * 0.5;
  const encuadre = Math.max(tam.y * 0.5, radioEnPlanta);
  /*
   * 1.5 de margen y no 1.28, y el hueco se ensancha en la misma proporción para que la figura se vea
   * igual de grande. El motivo es la viñeta: el compositor de bloom escribe alfa opaco, así que en
   * tema oscuro el lienzo NO puede ser transparente y su borde se delataba como un rectángulo. Con
   * la figura ocupando menos del cuadro, la máscara tiene un anillo vacío donde desvanecerse sin
   * llegar a tocarla.
   */
  const distancia = (encuadre / Math.sin((camara.fov * Math.PI) / 360)) * 1.5;
  camara.position.set(0.5, 0.16, 1).normalize().multiplyScalar(distancia);
  camara.lookAt(0, 0, 0);
  camara.updateProjectionMatrix();

  /*
   * El halo se coloca DESPUÉS de la cámara y sobre su eje de visión, no en coordenadas de escena.
   * Puesto a mano quedaba desplazado a un lado de la figura, porque la cámara mira en diagonal: un
   * punto «detrás» en el eje Z no está detrás desde donde se mira. Prolongando el rayo cámara-origen
   * más allá del centro, el resplandor cae siempre justo tras la figura, se mire desde donde se mire.
   */
  halo.position.copy(camara.position).normalize().multiplyScalar(-radio * 1.5);
  halo.position.y += radio * 0.3;

  // ---- composición con bloom ----
  // El bloom acompaña al halo: sin fondo oscuro no tiene nada que hacer salvo velar la imagen.
  // `atmosfera.bloom` es null en claro; ver la nota de ATMOSFERA sobre por qué no puede aplicarse.
  const conBloom = atmosfera.bloom !== null && admiteLujo();
  let compositor: import('three/examples/jsm/postprocessing/EffectComposer.js').EffectComposer | null = null;

  if (conBloom) {
    const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('three/examples/jsm/postprocessing/OutputPass.js'),
    ]);
    compositor = new EffectComposer(render);
    compositor.addPass(new RenderPass(escena, camara));
    // Umbral alto a propósito: solo sangran los brillos del contraluz sobre el bronce. Con el umbral
    // bajo, la escena entera se vela y la figura pierde justo el borde que la define.
    const { fuerza, radio: radioBloom, umbral } = atmosfera.bloom!;
    compositor.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), fuerza, radioBloom, umbral));
    // OutputPass es el que aplica el mapeo de tonos y el espacio de color al final de la cadena.
    // Sin él, componer con bloom devuelve una imagen lavada respecto al render directo.
    compositor.addPass(new OutputPass());
  }

  /*
   * ---- giro ligado al scroll ----
   *
   * La rotación es **función pura de la posición de scroll**, no de un temporizador ni del puntero.
   * Eso es lo que hace que volver arriba devuelva la figura exactamente a su pose inicial, y que al
   * recargar aparezca siempre igual. Con una oscilación por tiempo o con paralaje de ratón la figura
   * quedaba en una pose distinta cada vez, y una escultura no puede estar cada día de otro modo.
   *
   * El bucle interpola hacia el objetivo en vez de saltar a él: el giro acompaña al scroll con algo
   * de inercia, que es lo que lo hace suave.
   */
  const GIRO_MAXIMO = 0.5; // rad, unos 29 grados a lo largo del hero
  const progresoDeScroll = (): number => {
    const alto = document.querySelector<HTMLElement>('#hero')?.offsetHeight ?? window.innerHeight;
    return Math.min(1, Math.max(0, window.scrollY / alto));
  };

  function medir(): void {
    const lado = contenedor.clientWidth;
    if (!lado) return;
    render.setSize(lado, lado, false);
    compositor?.setSize(lado, lado);
    camara.aspect = 1;
    camara.updateProjectionMatrix();
  }
  window.addEventListener('resize', medir);
  medir();

  // La pose inicial se fija antes del primer fotograma: si se dejara que la interpolación llegara
  // sola, al recargar a media página se vería la figura girando desde cero hasta su sitio.
  pivote.rotation.y = progresoDeScroll() * GIRO_MAXIMO;

  /*
   * El polvo también se mueve con el scroll, no con el reloj.
   *
   * Tenerlo a la deriva daba vida a la escena, pero rompía la promesa: al volver arriba la figura sí
   * recuperaba su pose y la imagen no, porque las motas estaban en otro sitio. Con todo atado a la
   * misma variable, la escena entera es una función de dónde estás, y volver significa volver.
   *
   * Gira al revés que la figura y bastante menos: acompañándola parecería pegada a ella, y lo que
   * tiene que parecer es que la figura está dentro de algo.
   */
  animar(
    () => {
      const p = progresoDeScroll();
      const objetivo = p * GIRO_MAXIMO;
      const resto = objetivo - pivote.rotation.y;
      /*
       * Se posa en el objetivo en vez de acercarse indefinidamente. Una interpolación como esta es
       * asintótica: nunca llega. Y «volver a la pose inicial» tiene que ser exacto, no aproximado,
       * o la figura queda cada vez a una milésima distinta de donde estaba.
       */
      pivote.rotation.y = Math.abs(resto) < 0.0004 ? objetivo : pivote.rotation.y + resto * 0.08;
      polvo.rotation.y = -p * 0.42;
      polvo.rotation.x = Math.sin(p * Math.PI) * 0.06;
    },
    compositor ? () => compositor!.render() : undefined,
  );

  contenedor.dataset.listo = 'si';

  const original = visualizacion.destruir;
  return {
    destruir(): void {
      window.removeEventListener('resize', medir);
      compositor?.dispose();
      entorno.dispose();
      halo.material.map?.dispose();
      halo.material.dispose();
      polvo.geometry.dispose();
      (polvo.material as import('three').Material).dispose();
      delete contenedor.dataset.listo;
      original();
    },
  };
}
