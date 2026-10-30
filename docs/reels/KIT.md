# rincon-kit 3D: kit de escenas de los reels del rincón

Esta es la especificación del kit **3D** (v2). El humano eligió el 3D el 28-10-2026 tras comparar los dos clips del
piloto (`videos-cortos/reel/reels/rincon-kit/comparativa/`). Lo construye **F2f**, partiendo de
`comparativa/3d/fuente/escena.js` (el piloto 3D, que ya funciona) y del kit 2D v1. **F4** solo monta el piloto
con voz. El kit vive en `videos-cortos/reel/reels/rincon-kit/`. Las reglas de color, letra, voz y QA están en
`DECISIONES.md`. Cada reel dice en su ficha (`fichas/<id>.md`) qué piezas usa, con qué parámetros y en qué
palabra.

## 1. Qué es y por qué así

Es un **núcleo 3D común** (renderer, cámara, luz, peana, motas, fondo, DOM anclado al 3D y `__cajas`), un
**catálogo de modelos** Three.js parametrizables y **10 piezas** con la misma API declarativa que el kit 2D. Por
eso los bloques `montar()` de las fichas cambian poco: el `icono` de `objeto` pasa a ser un `modelo`, y
`figuras` y `contraste` ganan disposiciones 3D.

- **Mismo contrato y mismas anclas que el 2D.** `montar()` define `window.preparar(plan)`, `window.pintar(t)`,
  `window.__cajas(t)` y `window.escenaLista`. Todo depende solo de `t`, y las anclas, ventanas, relevos e ids
  se comportan igual que en el 2D, como mide `comparativa/COMPARA.md`: 0 solapes y 0 huecos en ambos.
- **El texto no se pinta en 3D.** Rótulos, citas, burbujas, nombres, hitos y cierre son DOM: el código y el CSS
  del kit 2D (§4), colocados en un punto del mundo y proyectados con la cámara del fotograma. El 3D lleva los
  objetos, las figuras, las peanas y las losas, que no tienen texto. Así el texto queda nítido y su contraste se
  puede comprobar con `kit.css`.
- **Un modelo por cosa que se repite, y el resto con el reserva `icono`.** Los modelos propios son los que
  hacen una idea legible o salen en la portada. Todo lo demás es el icono del sitio convertido en tubo 3D
  (`modelo: 'icono'`, §5.15). Los modelos que usa un solo reel están justificados en §5.

## 2. Ficheros

```
reel/reels/rincon-kit/
  kit.js              exporta montar() y las 10 piezas (misma lista de imports que el 2D)
  nucleo/
    escena3d.js       renderer, cámara, luces, entorno, mundo()/aPx(), golpes, motas, render
    dom.js            ponDom(): DOM anclado a un punto 3D (proyección, escala y fundido)
    cajas.js          cajaDe(objeto3D) desde los vértices, cajaEt(dom), une(), visto()
    tiempo.js         anclas (crearResolutor del 2D), presencia/ventana, easings (util.js del 2D)
    materiales.js     MAT.* (§3.4) a partir del acento de la corriente
  modelos/*.js        peana, losa, moneda, peon, casco, puente, movil, libro, engranaje, herramienta,
                      vaso, tarta, llama, piedra, icono (§5)
  piezas/*.js         rotulo, autor, cita, linea, contraste, objeto, medidor, burbuja, figuras, cierre
  iconos.js           igual que en el 2D (lo usa el modelo `icono`)
  corrientes.json, kit.css, fuentes/   iguales que en el 2D; kit.css añade el «estilo 3D» de §4
  VERSION             «v2» (sube con cada cambio)
  plantilla/, copiar.mjs, web.mjs, vacios.mjs, hoja.mjs, comprobar-fichas.mjs   (§7)
```

`kit.css` se sigue inyectando desde `kit.js`, como en el 2D (el servidor manda los `.css` como
`application/octet-stream`). El importmap de `escena.html` es el del 2D, con `three/addons/` incluido, porque el
núcleo usa `RoomEnvironment` y `RoundedBoxGeometry`. Lo demás de §2 del 2D vale igual: el kit llega a cada
reel con `copiar.mjs`, que escribe `<meta name="rincon-kit" content="vN">` en `escena.html` (la trampa de caché
de `claveVis`), y `kit/` no se edita a mano.

## 3. Plantilla común (núcleo)

Los valores salen del piloto 3D (`comparativa/3d/fuente/escena.js`). Al pasarlos al núcleo se mantienen salvo
que se diga otra cosa.

### 3.1 Renderer y lienzo

- `WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })`, 1080×1920, `pixelRatio` 1,
  fondo transparente (`setClearColor(0, 0)`). El canvas es el primero del `body`: `lib/fotogramas.mjs` pide
  `querySelector('canvas').getContext('webgl2')`.
- `toneMapping` ACES Filmic, exposición 0,88, `outputColorSpace` sRGB.
- Entorno: `PMREMGenerator.fromScene(new RoomEnvironment(), .04)`, `environmentIntensity` 0,55.
- **Un solo renderer y un solo contexto WebGL por reel.** Las piezas no crean renderers ni canvas propios.
- Geometrías y materiales se crean **una vez** en `montar()` y se reutilizan (`GEO_PERSONA`, `TEX_HALO`…). En
  `pintar(t)` no se crea nada; solo se cambian posiciones, escalas, opacidades y visibilidad.

### 3.2 Cámara

- `PerspectiveCamera` con FOV 30°, que mira siempre a `(0, 0, 0)`. `S = 250` px por unidad en el plano z = 0.
  Distancia `D = (H/2/S) / tan(15°) ≈ 14,33`, elevación `ELEV = 3,0`.
- **Cámara de reposo** (`reposo`): fija, solo sirve para convertir píxeles del lienzo en puntos del mundo con
  `mundo(px, py, z = 0)`. Todas las coordenadas `x`, `y` de las fichas son píxeles **a reposo**.
- **Cámara del fotograma:** oscila despacio, x `sin(0,37 t)·0,32`, y `ELEV + sin(0,23 t + 1)·0,12`, z
  `sin(0,31 t)·0,35 − 0,15`. Sustituye al «empuje» 1,00→1,04 del 2D.
- **Golpes** (`montar({ golpes: [ancla, …] })`): en cada ancla, la cámara se acerca 0,45 unidades y vuelve
  (subida de 0,04 s y caída de 0,22 s, la fórmula `T.punch` del piloto). Como mucho, **uno por escena**, en
  la palabra que carga la frase: la `clave` o la del efecto principal de esa escena. Nunca en el mismo instante
  que un relevo ni que un `a-firma`. El
  golpe acerca la imagen un 3 % hacia el centro (540, 960). Por eso las piezas se diseñan en la columna útil
  (§3.6) y no en el borde del escenario seguro.

### 3.3 Luz

- Luz principal `DirectionalLight` `#FFF3E6` de intensidad 2,3, en (3, 7, 8).
- Contraluz `DirectionalLight` con el **acento mezclado al 40 % con blanco**, de intensidad 1,6, en (−5, 3, −6).
  El piloto la tenía fija en `#A6C24A`; ahora sale del acento de la corriente.
- Ambiente `#4A4A58` a 0,7.
- Sin sombras proyectadas: el suelo lo dan la peana y su halo. No hay más luces por pieza. La única excepción
  es `llama`, que es emisiva y no ilumina.

### 3.4 Materiales y paleta (`nucleo/materiales.js`)

Un acento por reel (DECISIONES §5): el de la corriente. El coral solo para «no». Lo demás, neutro.

| `MAT.` | Qué | Valores | Lo usan |
|---|---|---|---|
| `arcilla` | figuras y objetos neutros | `#A8A39A`, rugosidad 0,40, metal 0,08 (con ACES sale marfil) | peones, contraste neutro |
| `acento` | lo destacado | acento, rugosidad 0,40, emisivo acento 0,25 | destacada, aros, nodos |
| `laca` | el protagonista del gancho | `MeshPhysical` en acento, rugosidad 0,36, clearcoat 1 (0,18) | casco, tarta (cobertura), móvil (canto) |
| `superficie` | peanas y losas | `#16151B` / `#1D1C22`, rugosidad 0,5-0,75, metal 0,15-0,25 | peana, losa, moneda |
| `piedra` | lo inerte | `#6E6A72`, rugosidad 0,95, `flatShading` | `piedra`, peón «piedra» (mala fe) |
| `vidrio` | recipientes | `MeshPhysical` con transmission 0,92, rugosidad 0,08, ior 1,45 y thickness 0,4 | vaso, `medidor` nivel |
| `agua` | líquido | `#EDEBE6`, transmission 0,6, borde emisivo de acento a 0,2 | vaso, flujo de `piedra` |
| `fantasma` | lo que no se ve o aún no existe | aristas (`EdgesGeometry`) en `texto_secundario` α 0,35, o en acento α 0,6 para el «plano» | engranaje «fantasma», herramienta «plano» |
| `coral` | «no» | `#FF7A6C`, emisivo 0,3 | aspa de `tacha`, ✗ |
| `luz` | fuego | `#FFE2B8` emisivo 1,2, sin acento: es luz, no color de marca | llama |

- No hay texturas de imagen. Solo `TEX_HALO`, un degradado radial hecho en un canvas, y lo que se dibuja con
  geometría. Nada de retratos, caras ni logotipos.
- Ningún texto sobre una superficie 3D. Los nombres van en DOM (§4) y la moneda lleva un busto genérico en
  relieve, no iniciales.

### 3.5 Peana, losa, motas y fondo

- **Peana** (`modelos/peana.js`, la `plinto()` del piloto): cilindro `superficie` de radio r y alto 0,12, aro de
  acento emisivo de 0,55 en el borde y halo aditivo (`TEX_HALO` en acento, α 0,32, radio 1,45 r). El halo
  no da caja (`nobox`). Formas:
  - `'disco'`: la del piloto;
  - `'carril'`: caja redondeada larga, para `figuras` en `'fila'`;
  - `'cama'`: caja redondeada con almohada, para `'tumbada'`.
  Todo objeto y toda figura está sobre una peana, salvo `losa` y `moneda`, que flotan.
- **Losa** (`modelos/losa.js`, el `slabM` del piloto): `RoundedBoxGeometry` `superficie` con un grosor de 0,16 y
  una barra de acento opcional a la izquierda. Se dimensiona en `preparar` con el tamaño del DOM que lleva
  dentro (padding de 34 px). La usan `cita`, `contraste` sin modelo y el `marco` de `icono`.
- **Motas:** 120 `Points` en `texto_secundario` (tamaño 0,13, α 0,45) con semilla fija (16807), que suben y
  vuelven a empezar. No dan caja.
- **Fondo:** degradado CSS `#141317` → `#0E0D10` en el `body`, más el halo radial del acento (α 0,18 ± 0,04,
  altura `--halo-y` por escena, que se pasa con `halo: {…}` como en el 2D) y la viñeta. El canvas es
  transparente.

### 3.6 Escenario seguro y columna útil

Son las del 2D, con dos añadidos del 3D:

- **Escenario seguro:** y entre 500 y 1560; x entre 62 y 1018; y **x ≤ 930 desde y = 860**. Se comprueba en
  `preparar` con la caja de cada pieza en su instante más visible, **con la cámara de reposo y con la del
  golpe**, que es la más cercana. Si una pieza se sale, avisa por consola sin parar el render.
- **Columna útil:** se diseña dentro de x 90-900 e y 520-1540. Un `x` de ficha es el **centro de la caja a
  reposo**, como en el 2D; el núcleo desplaza el modelo para que su caja quede centrada ahí. Lo que pasa de
  720 px de ancho se corre a la izquierda hasta caber, con `ajustarX` del 2D.
- **Portada:** en `portada_t`, ninguna caja puede empezar por encima de y = 700 (DECISIONES §2). Lo comprueba
  `vacios.mjs` (§7).
- **Franjas de reparto de la pantalla:**
  - firma del autor: y 510-670;
  - objeto principal: y 700-1240;
  - rótulos y tarjetas: y 1240-1540.
  Dos piezas a la vez van una encima de otra, o en las columnas x 90-490 y 510-900.

### 3.7 DOM anclado al 3D (`nucleo/dom.js`)

`ponDom(el, puntoMundo, presencia, { dx, dy, s, o })`:
- proyecta el punto con la cámara del fotograma, centra el elemento ahí (`translate(-50%, -50%)`) y lo hace
  entrar subiendo 26 px y con escala 0,94 → 1, como en el piloto;
- escala con la profundidad, pero **limitada a 0,95-1,05**, para que nunca baje de los tamaños mínimos de
  DECISIONES §5;
- con presencia u opacidad por debajo de 0,002, `display: none`.

Todo DOM de una pieza se coloca así, también el que no va pegado a un modelo (rótulos sueltos, en
`mundo(x, y, 0)`). Así el texto se mueve con la cámara y no flota desligado del 3D.

### 3.8 `__cajas(t)` (`nucleo/cajas.js`)

- **3D:** `cajaDe(raíz)` recorre los `Mesh` y `Points` visibles (los del objeto y los de todos sus padres) y
  toma hasta 500 vértices por malla. Los proyecta con la cámara del fotograma y devuelve el rectángulo que
  los envuelve. Se saltan los objetos `nobox` (halos, ondas, pulsos, motas) y los materiales transparentes con
  opacidad por debajo de 0,1.
- **DOM:** `getBoundingClientRect` si el elemento se ve con opacidad de 0,1 o más.
- **Una caja por pieza**, la unión de su 3D y su DOM. Excepciones: `contraste` da 2 (`<id>-a`, `<id>-b`) y
  `cierre`, 2 (`cierre-movil`, `cierre-sigueme`). Solo entran las piezas con presencia de 0,1 o más.
- No se devuelven el fondo, el halo, las motas ni las peanas de las piezas que no se ven.

### 3.9 `montar()`

```js
import { montar, rotulo, autor, cita, linea, contraste, objeto, medidor, burbuja, figuras, cierre } from '/escena/kit/kit.js';

montar({
  corriente: 'utilitarismo',                 // acento y nombre desde corrientes.json
  halo: { gancho: 56, idea: 46, cta: 60 },  // altura del halo (% de 1920) por escena; si falta, 55
  golpes: ['gancho:casco', 'idea:regla'],    // §3.2: como mucho uno por escena, en palabras clave
  piezas: [ /* … */ ],
});
```

- **Anclas:** igual que en el 2D (`'giro'`, `'giro:fin'`, `'giro:casco'`, `'giro:casco#1'`, `'giro:casco+0.3'`,
  `'fin'`). Si una palabra no está, `preparar` lanza `No encuentro «casco» en la escena giro`.
- **Parámetros comunes:** `id`, `x`, `y`, `ancho`, `desde`, `hasta`, `entra` y `efectos`, como en el 2D, con
  la misma ventana (entra 0,3 s antes de `desde` y sale entre `hasta − 0,65` y `hasta − 0,3`) y los mismos
  relevos. Hay dos nuevos para las piezas con modelo:
  - `tam`: ancho de la caja a reposo en px, **peana incluida**;
  - `giro`: `'lento'` (por defecto, ±0,42 rad a 0,7 rad/s, como el casco) | `'quieto'` | `'vuelta'` (una vuelta
    al entrar).
- **Entrada 3D por defecto:** escala con rebote (`eback`, de 0,84 a 1) más el fundido del DOM. `'fundido'` se
  queda en el fundido.
- Un parámetro desconocido es un error, como en el 2D: así un nombre mal escrito no se ignora en silencio.

## 4. Piezas DOM que se reutilizan del kit 2D

Del 2D se toman **tal cual el código DOM y el CSS** de estas partes. Solo cambia dónde se colocan, que ahora
es con `ponDom` (§3.7):

| Parte | Del 2D | Cambio de «estilo 3D» (en `kit.css`, clase `.rk3d` en `body`) |
|---|---|---|
| `rotulo` (tag, titular, cifra, marcas, `tacha`, `resalta`) | `piezas/rotulo.js` | El tag pasa a la píldora del piloto: Inter 600 a 40 px, **sin versalitas**, superficie `fondo_elevado` α 0,88, borde de 2 px en `separador`, sombra `0 16px 36px rgba(0,0,0,.45)` y marca de 40 px (✓ en círculo de acento, ✗ en círculo coral). El titular y la cifra no cambian |
| texto de `cita` | `piezas/cita.js` | Ancho del texto 680 px, sin fondo propio (va sobre la losa 3D) |
| `burbuja` (pila, `tacha`, `cambia`) | `piezas/burbuja.js` | Sombra del piloto |
| nombre y datos de `autor` | `piezas/autor.js` | El círculo SVG sale del DOM: lo sustituye la `moneda` 3D |
| hitos de `linea` (año y etiqueta) | `piezas/linea.js` | El eje y los puntos pasan a 3D |
| nota «esquema» de `medidor` | `piezas/medidor.js` | — |
| `etiqueta` de `objeto` | `piezas/objeto.js` | — |
| `cierre` **entero** | `piezas/cierre.js` | Ninguno: móvil de trazo, «Enviar», «Enviado ✓» y «Sígueme para más filosofía». Es igual en los 10 reels y no lleva 3D (las motas y el halo siguen detrás) |
| subtítulo | tubería (`lib/subtitulo-bloque.mjs`) | Ninguno: no es del kit |

Los tamaños mínimos, los tonos y la regla del acento en texto son los de DECISIONES §5, y se comprueban con
`kit.css` como en el 2D.

## 5. Catálogo de modelos

Cada modelo es una función de `modelos/<nombre>.js` que devuelve `{ g, partes, estados, efectos }`:
- un `Group` en unidades del mundo, con su peana;
- un `estado` inicial y los estados a los que se pasa con `cambia: [{ en, estado }]`, que hace un fundido o
  una transición de 0,45 s;
- sus efectos propios, que se suman a los comunes de `objeto` (§6.6).

Un modelo no sabe de anclas: la pieza le pasa `t` y los instantes ya resueltos.

En la columna **reels** salen los que lo usan. **Criterio:** al menos 2 reels, o se explica por qué no. Los de
un solo reel son el ejemplo canónico del autor o el objeto de la portada. Si fueran el icono en tubo, no se
leerían en la portada, que es lo que se ve en el feed. Si a F2f no le da tiempo, su reserva es
`modelo: 'icono'` con el icono 2D del mismo nombre: la ficha no cambia salvo ese parámetro.

| # | Modelo | Qué es | Estados · efectos propios | Origen | Reels |
|---|---|---|---|---|---|
| 5.1 | `peana` | §3.5 | `forma`: disco, carril, cama | piloto | los 10 |
| 5.2 | `losa` | §3.5 | `barra`: true/false · `parte` (se agrieta en dos, 0,5 s) | piloto | los 10 (cita, contraste) |
| 5.3 | `moneda` | El medallón del piloto: cuerpo `superficie` metálico, aro de acento y busto genérico en relieve (cabeza + torso). Con `pila: n` es un montón de n monedas lisas de canto de acento sobre peana (`modelo: 'monedas'` es lo mismo con `pila: 5`) | `cara`: busto, lisa · `vuelta` (giro de 360° en 1 s y onda de acento) · `crece` (`{ hace: 'crece', n }`: caen monedas hasta n) | piloto | los 10 (autor); `limite` (dinero) |
| 5.4 | `peon` | La figura torneada del piloto (`GEO_PERSONA` + cabeza). `figuras` la usa en grupo. `contraste` u `objeto` la usan suelta (`modelo: 'peon'`), en trío (`modelo: 'peones'`, como la tarjeta B del piloto) o en una escalera de 4 peldaños con un peón en cada uno (`modelo: 'escalera'`) | `estado` del peón: erguida, encogida (escala y 0,82 e inclinación de 12°), tumbada · de la escalera: `suelo` (se enciende el peldaño más bajo), `media` (se encienden los dos del medio) · `piedra` (pasa a `MAT.piedra` en 0,6 s) · `anillo` (añade un aro de acento al torso, hasta 3) | piloto | daño, imperativo, mala fe, velo, saber, wu-wei |
| 5.5 | `casco` | El del piloto, con correa y visera, sobre peana | — (`late` y `gira` comunes) | piloto | daño. **Un reel:** es la pregunta del gancho y la portada; ya existe y no cuesta nada |
| 5.6 | `puente` | El del piloto: estribos, siete tablas, postes y cuerda, con un peón caminante | `cruje` (la tabla central se hunde 0,05 y vibra; **no** se rompe, ver REVISION §C) · `cruza` (el peón va de un estribo al otro en 1,35 s) | piloto | daño. **Un reel:** es el ejemplo del propio Mill (cap. V); ya existe |
| 5.7 | `movil` | Teléfono genérico 9:19,5: cuerpo negro, canto en `laca` de acento y pantalla emisiva tenue, sin interfaz de ninguna red. Con `pantalla: { texto, quien, tono }` lleva una burbuja DOM (§4) anclada al centro de la pantalla. Esa burbuja es parte de la pieza y da **una** caja con el teléfono | `vacio`, `notificacion` · `notifica` (un globo de acento sale de la esquina superior derecha con rebote) · `cambia` (`{ hace: 'cambia', quien, tono }`: el mismo texto con otro remitente y otro borde) · `vibra` (±0,03 rad durante 0,4 s) | nuevo | condicionamiento, significado |
| 5.8 | `libro` | Tapas `superficie` con lomo de acento y bloque de páginas en marfil. Sin título en la tapa: el título va en `etiqueta` | `cerrado`, `abierto` (las tapas se abren 140°) · `tacha` común | nuevo | wu-wei, significado |
| 5.9 | `engranaje` | Rueda dentada extruida (12 dientes) con eje; gira sola a 0,6 rad/s | `normal` (acento), `fantasma` (`MAT.fantasma`: «lo que no ves») | nuevo | condicionamiento, crítica |
| 5.10 | `herramienta` | `tipo: 'cortapapeles'` (hoja plana y mango) \| `'caja'` (caja de herramientas abierta con martillo y llave) | `plano` (solo aristas de acento: el objeto antes de existir, la idea de para qué sirve), `solido` (se rellena de abajo arriba en 0,6 s) | nuevo | mala fe, significado |
| 5.11 | `vaso` | Vidrio con agua a `nivel` 0..1. Con `copias: { n, separacion }`, una fila | `nivel` · `bebe` (el nivel baja a 0 en 0,8 s) · `enciende` y `apaga` comunes | nuevo | límite. **Un reel:** la idea es que un deseo natural se llena, y eso solo lo dice un recipiente con nivel |
| 5.12 | `tarta` | Seis porciones extruidas con cobertura en `laca` | `entera`, `cortada` (las porciones se separan un 6 %) · `corta` (transición en 0,5 s) | nuevo | velo. **Un reel:** es el ejemplo del propio Rawls (§14) y la portada |
| 5.13 | `llama` | Llama emisiva (`MAT.luz`) que se deforma con dos senos y una bola de algodón de 7 esferas en marfil | `llama` (la llama sola), `toca` (llama junto al algodón), `arde` (el algodón con llamas propias, oscurecido) | nuevo | crítica. **Un reel:** es el ejemplo de al-Ghazali (disputa 17) y la portada; sale 3 veces en el reel |
| 5.14 | `piedra` | Roca (icosaedro de detalle 2 con desplazamiento sembrado y `MAT.piedra`) y una cinta de agua (`MAT.agua`) que la rodea y fluye | `desgasta` (la roca se reduce un 15 % y se alisa en 1,5 s) | nuevo | wu-wei. **Un reel:** es la imagen del *Daodejing* 8 y 78. El material `piedra` sí es compartido: lo usa mala fe |
| 5.15 | `icono` | **Reserva.** Un icono de `iconos.js` (viewBox 24×24) hecho tubo: `SVGLoader` → puntos de cada trazo → `TubeGeometry` de radio 0,75/24, con remates esféricos. Va en acento o en neutro, sobre peana. Con `marco: true` va dentro de una losa con barra (un «cuadro») | los de `objeto` | nuevo | condicionamiento (paloma, comedero), crítica (ascensor), significado (mapa en marco) |

**Metáforas de las ideas abstractas.** Ninguna es decorativa: cada una muestra lo que dice la frase. Si no se
lee en la hoja al 33 %, se usa la reserva.

| Idea | Metáfora 3D | Dónde | Reserva si no se lee |
|---|---|---|---|
| **Mala fe** (existir antes que ser) | 1. El cortapapeles aparece primero como `plano` y se vuelve `solido` en «serviría»: el uso antes que la cosa. 2. Tú, un peón desnudo que gana un `anillo` cada vez que «eliges»: te vas haciendo. 3. «Una cosa con propiedades fijas»: el peón se vuelve `piedra` con la etiqueta SOY ASÍ. 4. El mismo peón en dos peanas, erguido con sus amigos y encogido ante el jefe: si cambia, no era un rasgo | `mala-fe` | Etiqueta SOY ASÍ sin `piedra` ni anillos, más los rótulos |
| **Imperativo categórico** (la regla que se destruye) | 1. La fila sobre un carril: la destacada se cuela. 2. «¿Y si todos…?»: todas saltan a la vez, la fila se desordena y el carril se apaga, porque la regla hecha universal acaba con aquello de lo que vivía. 3. La promesa es un hilo de acento entre dos peones. Si todos prometieran así, aparecen más parejas y todos los hilos se apagan y se rompen: nadie cree una promesa | `imperativo` | Burbuja «Te lo prometo.» tachada y el rótulo «Ya no hay cola» |
| **«Ya hablaremos»** (el sentido está alrededor) | El mismo móvil con el mismo mensaje. En cada lectura solo cambia lo de alrededor: el remitente y el borde, en acento, neutro o coral | `significado` | La burbuja DOM sola (2D) |
| **Significado como uso** | *Tractatus*: el icono `mapa` dentro de un marco, la frase como dibujo del mundo. *Investigaciones*: la caja de herramientas abierta, la imagen del propio §11. Son dos objetos en relevo en el mismo sitio | `significado` | `icono: 'herramientas'` en tubo |
| **Velo de la ignorancia** | Un velo esmerilado (cilindro de `MAT.vidrio` con rugosidad 0,6) cubre a la destacada y salta de peldaño en peldaño: no sabes cuál te toca. En «suelo» se enciende el peldaño más bajo | `velo` | El velo sin saltos, con el rótulo |
| **Causalidad** (el «tiene que» no se ve) | Dos peanas separadas: la llama que toca y el algodón que arde, con un «?» debajo del hueco. Y en el ejemplo, el engranaje del ascensor en `fantasma`: el mecanismo que no ves | `critica` | Los rótulos «Una cosa» y «Luego otra» |
| **Definir** (Sócrates) | La definición es un aro alrededor de un grupo: deja fuera a un amigo (un peón de acento se queda fuera) y mete dentro a quien no debería (un peón con borde coral entra) | `saber` | Los rótulos «Deja fuera…» y «Mete a quien no debe» del 2D |

## 6. Las 10 piezas

Cada pieza lleva sus parámetros propios además de los comunes (§3.9), sus efectos, las cajas que da y los reels
que la usan. Esta es la lista exacta para `PARAMS`; un parámetro que no esté aquí es un error:

```js
const COMUN = ['id', 'x', 'y', 'ancho', 'desde', 'hasta', 'entra', 'efectos', 'tam', 'giro'];
const PARAMS = {
  rotulo: ['texto', 'tono', 'tam', 'marca'], autor: ['nombre', 'anos', 'obra', 'modo'], cita: ['texto', 'obra', 'tipo', 'resalta'],
  linea: ['hitos', 'escala', 'distancia'], contraste: ['disposicion', 'a', 'b', 'entra_b'],
  objeto: ['modelo', 'tono', 'estado', 'cambia', 'copias', 'etiqueta', 'icono', 'marco', 'tipo', 'pantalla', 'nivel', 'pila'],
  medidor: ['tipo', 'series', 'traza_hasta', 'valor', 'meta', 'nombre_meta', 'nota'], burbuja: ['texto', 'lado', 'quien', 'tono', 'pila'],
  figuras: ['disposicion', 'n', 'destacada', 'acciones'], cierre: ['titulo', 'enviar_en'],
};
// lados de contraste: { titulo, texto, modelo, icono, estado, tono } · acciones de figuras: { en, hace, texto, piedra, fuera, intruso }
// efectos: { en, hace, lado, copia, n, quien, tono }
```

### 6.1 `rotulo` (DOM, §4)
Es el `rotulo` del 2D con el estilo 3D: `texto` (≤ 6 palabras), `tono`, `tam` (`'tag'`, `'titular'`,
`'cifra'`) y `marca`. Efectos `tacha` y `resalta`. Cajas: 1. Reels: **los 10**.

### 6.2 `autor`: moneda 3D más nombre DOM
- `nombre`, `anos`, `obra`, `modo`, como en el 2D. No hay `icono`: la moneda lleva el busto genérico (sin
  retratos, como en el 2D). La corriente sale de `corrientes.json`.
- `'medallon'`: moneda de **300 px** (`tam`) centrada en (x, y), con el nombre (Newsreader 500, 64 px) en y +
  215 y los datos (Inter 500, 30 px, `texto_secundario`) debajo. Caja: de y − 150 a y + 320.
- `'firma'`: moneda de 140 px en (170, 590), con el nombre (Newsreader 500, 52 px) y la corriente (30 px)
  alineados a la izquierda desde x = 270. Caja dentro de la franja 510-670. Nada más ocupa esa franja
  mientras haya firma.
- Efectos:
  - `a-firma`: en 0,45 s, la moneda sube y se encoge a su sitio de firma, dando media vuelta, y el nombre se
    recoloca. La regla del 2D sigue: va **al menos 0,7 s antes** de que entre la pieza que ocupa el sitio del
    medallón.
  - `vuelta`.
- Cajas: 1, `id` (moneda + textos). Reels: **los 10**. `critica` usa dos.

### 6.3 `cita`: losa 3D con el texto DOM
`texto`, `obra`, `tipo` (`'cita'` | `'parafrasis'`) y `resalta`, como en el 2D (DECISIONES §7). La losa
mide lo que el texto más 34 px de padding, con un máximo de 760 px, y gira ±0,035 rad. Se corre a la izquierda
si hace falta (§3.6). Las líneas entran como en el 2D. Cajas: 1. Reels: 7 (los mismos del 2D).

### 6.4 `linea`: línea del tiempo 3D
- Pista `separador` de 0,05 u, relleno de acento que avanza de un hito al siguiente, nodos esféricos de acento
  y pulso en el último hito. Los hitos (año y etiqueta) son DOM, 105 px por debajo del eje.
- `hitos`, `escala`, `distancia` y `hoy`, como en el 2D.
- `ancho` máximo de 600 px, del primer al último nodo (en el piloto, x 230-830), y `y` es la altura del eje.
  Caja: de y − 25 a y + 160.
- Cajas: 1. Reels: 5.

### 6.5 `contraste`: dos peanas
- Dos columnas, siempre (`disposicion: 'columnas'`; `'filas'` desaparece porque ninguna ficha la usa), con
  centros en x 290 y 705. `x` no se usa.
- `a` y `b`: `{ titulo, texto?, modelo?, icono?, estado?, tono }`.
  - Con `modelo`, cada columna es una peana de 360 px con ese modelo encima (y + 0) y una tarjeta DOM debajo
    (centro en y + 210, 300 px de ancho, título Newsreader 500 a 44 px y texto Inter 500 a 30 px).
  - Sin `modelo`, cada columna es una `losa` 3D con la tarjeta dentro.
- `entra_b` y efectos:
  - `separa`: las columnas se apartan 30 px y aparece un filete vertical `separador` entre las dos;
  - `gana` (`lado`): la peana de ese lado enciende el aro y el halo, y la otra baja a α 0,45;
  - `tacha` (`lado`): aspa coral delante.
  **En una disputa abierta no se usan `gana` ni `tacha`.**
- Caja con `modelo`: de y − 190 a y + 290. Sin `modelo`: la losa.
- Cajas: 2, `<id>-a` y `<id>-b`. Reels: 8 (todos menos wu-wei y significado).

### 6.6 `objeto`: un modelo del catálogo
- `modelo` (§5), `tam`, `tono` (`'acento'` | `'neutro'`), `estado`, `cambia: [{ en, estado }]`,
  `copias: { n, separacion }` (solo `vaso` e `icono`), `etiqueta` (DOM de 30 px bajo la peana).
- Además, lo propio del modelo: `icono` y `marco` para `icono`; `tipo` para `herramienta`; `pantalla` para
  `movil`; `nivel` para `vaso`; `pila` para `moneda`; `n` y `postura` para `peones`.
- Efectos comunes:
  - `late`: 1 → 1,1 → 1 amortiguado, como el casco;
  - `tacha`: aspa coral de dos barras redondeadas delante del modelo;
  - `apaga`: a `arcilla` α 0,5, sin emisivo;
  - `enciende`: a acento y halo de peana a 0,5;
  - `gira`: una vuelta en 0,8 s.
  Más los efectos del modelo (§5). Con `copia: n`, el efecto solo afecta a esa copia.
- Cajas: 1 (con `copias`, una que las envuelve a todas). Reels: **los 10**.

### 6.7 `medidor`: esquema 3D (siempre «esquema»)
- `'barras'`: columnas de acento de 90 px de ancho sobre una peana carril. Crecen con los `valores`. El nombre
  va en DOM debajo, a 30 px. `ancho` ≤ 640.
- `'curvas'`: sobre una losa sin barra, cada serie es un tubo que baja y llega a 0 en `cae_en`. Se traza de
  izquierda a derecha entre `desde` y `traza_hasta`. Ejes `separador` sin números. `ancho` ≤ 760.
- `'nivel'`: un tubo horizontal de `vidrio` con `agua` hasta `valor` y una bandera de acento en `meta`, con el
  rótulo `nombre_meta` en DOM. Las dos se animan con `[{ en, v }]`. Para «la meta se aleja», la meta avanza
  con el valor. `ancho` ≤ 760.
- `nota`: «esquema» en DOM, abajo a la derecha, como en el 2D.
- Cajas: 1. Reels: 3 (condicionamiento, wu-wei, límite).

### 6.8 `burbuja` (DOM, §4)
`texto`, `lado`, `quien`, `tono`, `pila` y los efectos `tacha` y `cambia`, como en el 2D. Cajas: 1 por
burbuja. Reels: 6.

### 6.9 `figuras`: peones 3D
- `disposicion`:
  - `'grupo'`: corro de `n` (6) sobre un disco, con la destacada delante; son las posiciones `FIG` del piloto;
  - `'fila'`: `n` en fila sobre un carril visto en diagonal, de fondo a frente;
  - `'escalera'`: `n` peldaños que suben de izquierda a derecha, con un peón por peldaño;
  - `'sola'`: 1 peón sobre un disco;
  - `'pareja'`: `n` parejas (1-3) de peones que se miran, cada una en su disco y en fila;
  - `'tumbada'`: 1 peón tumbado en una cama.
- `n`, `destacada` (índice; en acento con emisivo 0,25; el resto, en `arcilla`), `tam`.
- `acciones: [{ en, hace, … }]`. Solo existen estas:

| `hace` | Qué pasa | Disposición | Reel |
|---|---|---|---|
| `limite` (`texto`) | aro de acento que crece alrededor de la destacada, con la píldora DOM (`texto`) delante | grupo | daño |
| `ensancha` | el aro crece hasta tocar a los demás (0,9 s) | grupo | daño |
| `ondas` | tres anillos salen de la destacada, con 0,38 s de desfase | grupo | daño |
| `define` (`fuera`, `intruso`) | aro de acento alrededor del grupo. Dos peones quedan fuera: el índice `fuera`, a la izquierda, que pasa a acento (el amigo que la definición deja fuera), y el índice `intruso`, a la derecha, con un filete coral | grupo | saber |
| `mete` | el `intruso` entra en el aro en 0,6 s (la definición mete dentro a quien no debería) | grupo | saber |
| `colarse` | la destacada salta del final de la fila a la cabeza en 0,6 s, en arco | fila | imperativo |
| `desordenar` | todos saltan a la vez y caen amontonados (posiciones sembradas), y el carril se apaga | fila | imperativo |
| `velo` | el velo esmerilado cubre a la destacada y salta entre peldaños (0,5 s por salto) | escalera | velo |
| `suelo` | el peldaño más bajo se enciende en acento | escalera | velo |
| `etiqueta` (`texto`, `piedra?`) | una píldora DOM cuelga del peón; con `piedra: true`, el peón pasa a `MAT.piedra` | sola | mala fe |
| `anillo` | un aro de acento más en el torso, hasta 3 | sola | mala fe |
| `hilo` | un hilo de acento une a la primera pareja | pareja | imperativo |
| `todos` | aparecen las demás parejas, cada una con su hilo | pareja | imperativo |
| `rompe` | todos los hilos pasan a `arcilla`, se cortan por el centro y caen | pareja | imperativo |
| `tiembla` | el peón tumbado se revuelve (giro de ±0,2 rad a 2 Hz), y la manta o almohada se arruga | tumbada | wu-wei |
| `duerme` | el peón se queda quieto y el halo de su peana baja a 0,1 | tumbada | wu-wei |

  Se quitan las del 2D que ya no usa ninguna ficha: `despega`, `postura` como acción (ahora es estado del
  modelo `peon`) y la notación `etiqueta: {}` (REVISION §B.5: solo vale `{ hace: 'etiqueta', texto, piedra }`).
- Cajas: 1, `id`: peones, peanas, aro, velo, hilos y píldoras juntos.
- Reels: daño (grupo), imperativo (fila y pareja), mala fe (sola), velo (escalera), saber (pareja y grupo) y
  wu-wei (tumbada): 6.

### 6.10 `cierre` (DOM, §4)
Es el del 2D, tal cual: `titulo` (≤ 6 palabras) y `enviar_en` (por defecto `'cta:envíaselo'`). Cajas: 2,
`cierre-movil` y `cierre-sigueme`. Reels: **los 10**.

> El cierre del piloto 3D de la comparativa (el casco con «La cabeza es tuya» en grande) **no** pasa al kit:
> el cierre es común a los 10 reels y está en DECISIONES §6.

## 7. Herramientas del kit

Son las del 2D, con estos cambios:
- **`copiar.mjs`:** sin cambios. Escribe `v2` en la meta.
- **`hoja.mjs`:** dos hojas sin voz. `--piezas` es la del 2D (las 10 piezas y sus efectos). `--modelos` es
  nueva: una rejilla con cada modelo de §5 en cada estado y en el instante medio de cada efecto, a 1080×1920
  por página, con su nombre en DOM debajo.
- **`comprobar-fichas.mjs`:**
  - lee también `golpes` y comprueba que haya como mucho uno por escena (cada ancla tiene que resolverse) y
    que ninguno caiga a menos de 0,3 s de un `a-firma`;
  - `DISTINTAS` pasa a la tabla de §8;
  - el resto (plan sintético de 0,3 s por palabra, anclas, escenario seguro y solapes con `lib/solapes.mjs`)
    sigue igual.
- **`vacios.mjs`:** además de los huecos, mira la portada. Lee `portada_t` de `guion.json` y las cajas de ese
  instante de `trabajo/cajas-escena.cache.json`, y falla si alguna caja empieza por encima de y = 700.
- **`web.mjs`:** sin cambios. El 3D pesa más, pero cabe: el piloto da 2,20 MB en web (COMPARA.md).
- **Renders:** la regla de cuántos a la vez está en DECISIONES §12.

## 8. Qué pieza usa cada reel

| Pieza | daño (F4) | condic. | wu-wei | límite | imperat. | mala fe | signif. | velo | crítica | saber | Reels |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rotulo | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | 10 |
| autor | ● | ● | ● | ● | ● | ● | ● | ● | ●● | ● | 10 |
| cita | ● |  | ● | ● | ● |  | ● |  | ● | ● | 7 |
| linea | ● |  | ● |  |  |  | ● |  | ● | ● | 5 |
| contraste | ● | ● |  | ● | ● | ● |  | ● | ● | ● | 8 |
| objeto | ● | ● | ● | ● |  | ● | ● | ● | ● |  | 8 |
| medidor |  | ● | ● | ● |  |  |  |  |  |  | 3 |
| burbuja | ● |  | ● |  | ● | ● | ● |  |  | ● | 6 |
| figuras | ● |  | ● |  | ● | ● |  | ● |  | ● | 6 |
| cierre | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | 10 |
| **distintas** | **9** | 6 | 9 | 7 | 7 | 7 | 7 | 6 | 7 | 8 | |

Cambios frente al 2D:
- `imperativo` y `saber` ya no usan `objeto`: el apretón de manos y los «dos amigos» pasan a ser peones
  (`figuras` en pareja). `saber` gana `figuras`.
- `wu-wei` gana `figuras` (el peón que no se duerme).

**Modelo × reel** (lo que carga cada reel; el criterio está en §5):

| Modelo | Reels |
|---|---|
| peana, losa | los 10 |
| moneda | los 10 (autor) + límite (pila) |
| peon | daño, imperativo, mala fe, velo, saber, wu-wei |
| movil | condicionamiento, significado |
| libro | wu-wei, significado |
| engranaje | condicionamiento, crítica |
| herramienta | mala fe, significado |
| icono | condicionamiento, crítica, significado |
| casco, puente | daño (justificados en §5) |
| vaso | límite (justificado) |
| tarta | velo (justificado) |
| llama | crítica (justificado) |
| piedra | wu-wei (justificado; su material lo comparte mala fe) |

## 9. Plantilla de `escena.html` y `escena.js`

```html
<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="rincon-kit" content="v2"></head>
<body class="rk3d"><script type="importmap">{ "imports": { "three": "/three/build/three.module.js", "three/addons/": "/three/examples/jsm/" } }</script>
<script type="module" src="/escena/escena.js"></script></body></html>
```

```js
// Escena de rincon-<id>. Solo parámetros: el dibujo está en el kit (docs/reels/KIT.md).
import { montar, objeto, autor /* , … */ } from '/escena/kit/kit.js';
montar({ corriente: '<corriente_id>', halo: { /* … */ }, golpes: [ /* … */ ], piezas: [ /* en el orden de la ficha */ ] });
```

## 10. Para F2f (construcción del kit 3D)

**Qué entregas:** el kit v2 de §2 en `videos-cortos/reel/reels/rincon-kit/`, su `LEEME.md` actualizado (uso y
desviaciones respecto de este documento) y un informe al jefe. No tocas `reel.mjs`, `lib/**`, `reel/escena/**`,
los reels de mentalista ni el repositorio elrincondelareflexion. Si algo de esta especificación no se puede
hacer, lo anotas en «Desviaciones» del `LEEME.md` del kit y lo dices en el informe; no cambias las fichas.

### Pasos

1. **Guarda el 2D.** Copia `kit.js`, `piezas/`, `util.js`, `fondo.js` y `hoja.mjs` a `rincon-kit/v1-2d/`, para
   consulta. El kit activo pasa a ser el 3D. `comparativa/` no se toca.
2. **Núcleo** (`nucleo/`). Sácalo de `comparativa/3d/fuente/escena.js`:
   - renderer, entorno, luces y cámara (`camara`, `reposo`, `mundo`, `aPx`, golpes);
   - motas;
   - `presencia`, `ponDom`, `cajaDe`, `cajaEt` y `une`.
   Las anclas y la validación de parámetros salen de `util.js` y `kit.js` del 2D (`crearResolutor`, `pieza`,
   `PARAMS`). Cambia lo que dice §3: el contraluz desde el acento, la escala de `ponDom` limitada, el escenario
   seguro con la cámara del golpe y `golpes` como parámetro de `montar()`.
3. **Modelos ya hechos:** pasa a `modelos/` lo que ya está en el piloto: `plinto` → `peana`, `slabM` →
   `losa`, `moneda`, `persona` y `grupoFiguras` → `peon`, `casco` y `puente`. Comprueba con `hoja.mjs
   --modelos`.
4. **Modelos nuevos**, en este orden: `icono` (el reserva; con él ya se pueden montar todas las fichas),
   `movil`, `libro`, `engranaje`, `herramienta`, `vaso`, `tarta`, `llama` y `piedra`. Cada uno cabe en unas
   40-90 líneas. Si el tiempo aprieta, los cinco últimos (de un solo reel) pueden quedar como `icono` y se
   anota.
5. **Piezas:** las 10 de §6. Las partes DOM se importan del código 2D (§4); no se reescriben.
6. **Disposiciones y acciones de `figuras`** (tabla de §6.9).
7. **Herramientas** (§7).
8. **Piloto de vuelta:** con el `montar()` de `fichas/principio-del-dano.md`, renderiza el clip mudo con el plan
   estimado. Puedes adaptar `comparativa/3d/fuente/render.mjs` a una copia en `trabajo/`. Compáralo
   fotograma a fotograma con `comparativa/3d/3d-clave-*.png`: tiene que verse igual, salvo el cierre (que
   ahora es el común) y lo que este documento cambia a propósito.

### Cómo comprobarlo (todo sin voz y sin gastar peticiones de Gemini)

```
node reel/reels/rincon-kit/hoja.mjs --piezas
node reel/reels/rincon-kit/hoja.mjs --modelos
node reel/reels/rincon-kit/comprobar-fichas.mjs --hoja        # las 10 fichas tal cual
```

Los renders siguen la regla de DECISIONES §12: uno a la vez por defecto, y dos solo si hay memoria libre.

### Criterios de aceptación

1. Los 10 bloques `montar()` de las fichas se ejecutan **sin tocarlos**: ningún parámetro desconocido, todas las
   anclas existen y `golpes` cumple §3.2. Si alguno no se puede ejecutar, se pide el arreglo al jefe y la
   ficha no se edita.
2. Con el plan sintético, `comprobar-fichas` da en las 10 fichas 0 solapes, 0 piezas fuera del escenario seguro
   (con la cámara de reposo y con la del golpe) y portada limpia (nada por encima de y = 700 en `portada_t`). El
   número de piezas distintas es el de §8.
3. En `__cajas`, cada pieza tiene su `id` y una caja (2 en `contraste` y `cierre`). Las cajas 3D salen de los
   vértices, no de un rectángulo fijo, y los halos, motas y ondas no dan caja.
4. `pintar(12.3)` dos veces da el mismo PNG. Consola limpia. `document.fonts.check` de Newsreader 500 e Inter
   600 en `true`. Un solo contexto WebGL.
5. Contraste del DOM según DECISIONES §5, comprobado con `kit.css` como en el 2D.
6. La hoja `--modelos` muestra los modelos de §5 con sus estados. Las metáforas de §5 se entienden en la hoja
   reducida al 33 %. Si una no se entiende, se usa su reserva y se anota.
7. El piloto sin voz se ve como `comparativa/3d.mp4` (paso 8). El render de un reel de unos 41 s tarda menos de
   3 min y no pasa de **1,5 GB** de pico (el piloto 3D dio 1,31 GB).
8. `LEEME.md` del kit actualizado y `VERSION` en `v2`.

### Qué no hace F2f

No monta reels con voz (eso es F4 y F5), no cambia las fichas ni DECISIONES y no gasta peticiones de Gemini.
