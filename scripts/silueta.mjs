/**
 * Extrae la silueta 2D de una malla, vista desde una dirección concreta.
 *
 * PARA QUÉ. El hueco del hero no puede estar en blanco mientras llega la malla, y un indicador
 * genérico no dice nada. Lo que se dibuja mientras carga es **el contorno de la misma figura**, y
 * eso solo es honesto si sale de la geometría real en vez de estar dibujado a ojo.
 *
 * Sirve además como respaldo permanente: si no hay WebGL, o si el usuario ha pedido reducir el
 * movimiento, la silueta se queda. Por eso tiene que ser reconocible por sí sola.
 *
 * MÉTODO. Proyectar, rasterizar y trazar el borde:
 *
 *  1. Se proyectan los triángulos al plano de la cámara.
 *  2. Se rellenan en una rejilla booleana. Rasterizar y no calcular la envolvente analítica: la
 *     envolvente convexa perdería el hueco entre el brazo y el muslo, que es justo el rasgo que
 *     hace reconocible esta figura.
 *  3. Se recorre el borde con marching squares, que devuelve un contorno por región **y por
 *     agujero**, y se simplifica con Douglas-Peucker.
 */

/** Producto vectorial y normalización, sin traer una biblioteca para tres operaciones. */
const cruz = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (v) => {
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * Rasteriza los triángulos proyectados en una rejilla.
 *
 * Con relleno por barrido de líneas, no por punto interior: un triángulo más pequeño que una celda
 * dejaría agujeros si solo se comprueba el centro de cada celda, y en la mano y los dedos hay
 * muchos triángulos de ese tamaño.
 */
function rasterizar(triangulos, n) {
  const rejilla = new Uint8Array(n * n);
  for (const [a, b, c] of triangulos) {
    const minY = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1])));
    const maxY = Math.min(n - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
    for (let y = minY; y <= maxY; y++) {
      const cy = y + 0.5;
      const cortes = [];
      for (const [p, q] of [[a, b], [b, c], [c, a]]) {
        if ((p[1] <= cy && q[1] > cy) || (q[1] <= cy && p[1] > cy)) {
          cortes.push(p[0] + ((cy - p[1]) / (q[1] - p[1])) * (q[0] - p[0]));
        }
      }
      cortes.sort((u, v) => u - v);
      for (let i = 0; i + 1 < cortes.length; i += 2) {
        const x0 = Math.max(0, Math.floor(cortes[i]));
        const x1 = Math.min(n - 1, Math.ceil(cortes[i + 1]));
        for (let x = x0; x <= x1; x++) rejilla[y * n + x] = 1;
      }
    }
  }
  return rejilla;
}

/**
 * Contornos cerrados, por trazado de aristas de frontera.
 *
 * Se probó antes con marching squares y la tabla de configuraciones salió mal: es fácil de escribir
 * y difícil de verificar, porque un signo equivocado no da error, da cero contornos. Esto es más
 * simple y se puede razonar entero: una arista pertenece al borde si separa una celda llena de una
 * vacía. Orientando todas en el mismo sentido —horario alrededor de lo lleno—, encadenarlas produce
 * los bucles, y los agujeros salen solos con la orientación contraria, sin tratarlos aparte.
 *
 * Que importe el agujero no es un detalle: en esta figura es el hueco entre el brazo y el muslo, que
 * es justo lo que la hace reconocible de un vistazo.
 */
function contornos(rejilla, n) {
  const lleno = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? 0 : rejilla[y * n + x]);
  /** Vértice de salida -> vértices de llegada. Es lista porque en un toque en diagonal hay dos. */
  const siguiente = new Map();
  const anadir = (a, b) => {
    const k = `${a[0]},${a[1]}`;
    const lista = siguiente.get(k);
    if (lista) lista.push(b); else siguiente.set(k, [b]);
  };

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!lleno(x, y)) continue;
      // Sentido horario en pantalla, con la Y creciendo hacia abajo.
      if (!lleno(x, y - 1)) anadir([x, y], [x + 1, y]);
      if (!lleno(x + 1, y)) anadir([x + 1, y], [x + 1, y + 1]);
      if (!lleno(x, y + 1)) anadir([x + 1, y + 1], [x, y + 1]);
      if (!lleno(x - 1, y)) anadir([x, y + 1], [x, y]);
    }
  }

  const salida = [];
  for (const [inicio] of siguiente) {
    while (siguiente.get(inicio)?.length) {
      const contorno = [];
      let actual = inicio;
      for (let i = 0; i < n * n * 4; i++) {
        const lista = siguiente.get(actual);
        if (!lista?.length) break;
        const destino = lista.pop();
        contorno.push(destino);
        actual = `${destino[0]},${destino[1]}`;
        if (actual === inicio) break;
      }
      if (contorno.length > 12) salida.push(contorno);
    }
  }
  return salida;
}

/** Douglas-Peucker: quita los puntos que no cambian la forma más de `epsilon`. */
function simplificar(puntos, epsilon) {
  if (puntos.length < 3) return puntos;
  const [a] = puntos;
  const b = puntos[puntos.length - 1];
  let peor = 0;
  let indice = 0;
  const largo = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  for (let i = 1; i < puntos.length - 1; i++) {
    const p = puntos[i];
    const d = Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / largo;
    if (d > peor) { peor = d; indice = i; }
  }
  if (peor <= epsilon) return [a, b];
  return [
    ...simplificar(puntos.slice(0, indice + 1), epsilon).slice(0, -1),
    ...simplificar(puntos.slice(indice), epsilon),
  ];
}

/**
 * @param triangulos Vértices en espacio de mundo, agrupados de tres en tres.
 * @param direccion  Dirección desde la que se mira (posición de cámara respecto al centro).
 * @param opciones   `n` resolución de rejilla, `epsilon` tolerancia de simplificación.
 * @returns Lista de cadenas `d` para `<path>`, en un viewBox de 0 a 100.
 */
export function siluetaDesde(triangulos, direccion, { n = 200, epsilon = 1.1, margen = 0.07 } = {}) {
  // Base de la cámara: adelante hacia el centro, derecha y arriba perpendiculares.
  const adelante = norm([-direccion[0], -direccion[1], -direccion[2]]);
  const derecha = norm(cruz(adelante, [0, 1, 0]));
  const arriba = cruz(derecha, adelante);

  // Proyección ortográfica, no en perspectiva: para una silueta que va a servir de contorno plano,
  // la perspectiva solo añadiría una deformación que después habría que compensar en el encuadre.
  const planos = triangulos.map((tri) => tri.map((p) => [punto(p, derecha), punto(p, arriba)]));

  let minU = Infinity; let maxU = -Infinity; let minV = Infinity; let maxV = -Infinity;
  for (const tri of planos) {
    for (const [u, v] of tri) {
      if (u < minU) minU = u; if (u > maxU) maxU = u;
      if (v < minV) minV = v; if (v > maxV) maxV = v;
    }
  }
  /*
   * Un lado común para las dos dimensiones: si se escalara cada eje por su propio rango, la figura
   * saldría estirada respecto a la escena 3D y las dos versiones no encajarían.
   *
   * Y un margen, porque sin él la coronilla queda exactamente en la fila 0 y el trazo, que se dibuja
   * centrado sobre la línea, se corta por la mitad contra el borde del viewBox: parecía que a la
   * figura le faltaba la cabeza.
   */
  const lado = Math.max(maxU - minU, maxV - minV) / (1 - margen * 2);
  const desU = (maxU + minU) / 2 - lado / 2;
  const desV = (maxV + minV) / 2 - lado / 2;

  const enRejilla = planos.map((tri) => tri.map(([u, v]) => [
    ((u - desU) / lado) * (n - 1),
    // Se invierte V: en la rejilla y en SVG el eje crece hacia abajo.
    (1 - (v - desV) / lado) * (n - 1),
  ]));

  const rejilla = rasterizar(enRejilla, n);

  /** Área firmada, por la fórmula del cordón de zapato. Sirve para descartar por tamaño real. */
  const area = (c) => {
    let a = 0;
    for (let i = 0; i < c.length; i++) {
      const p = c[i];
      const q = c[(i + 1) % c.length];
      a += p[0] * q[1] - q[0] * p[1];
    }
    return Math.abs(a) / 2;
  };

  /*
   * La tolerancia se escala con el tamaño de cada contorno, y el descarte va por ÁREA y no por
   * número de puntos. Con una tolerancia fija y un filtro por puntos, los contornos interiores
   * —pequeños por definición— se simplificaban hasta quedarse por debajo del umbral y desaparecían:
   * la figura perdía el hueco del brazo, que es lo que la hacía reconocible.
   */
  return contornos(rejilla, n)
    .filter((c) => area(c) > (n * 0.022) ** 2)
    .map((c) => {
      const xs = c.map((p) => p[0]);
      const ys = c.map((p) => p[1]);
      const tamano = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      return simplificar(c, Math.max(0.6, Math.min(epsilon, tamano * 0.02)));
    })

    .map((c) => {
      const a = c.map(([x, y]) => `${((x / n) * 100).toFixed(2)} ${((y / n) * 100).toFixed(2)}`);
      return `M${a.join('L')}Z`;
    });
}
