# VARIEDAD · F14a · lo que se muestra no puede ser siempre lo mismo

Tarea t-d912ef (encargo e-17e430). Diseño, sin código de producción y sin render. La regla que sale de aquí es
`DECISIONES.md` §14; las escenas rediseñadas están en las fichas del lote 3b (`fichas/flujo-y-permanencia.md`,
`el-tiempo-en-el-alma.md`, `placeres-superiores.md`, `ren-y-li.md`, `termino-medio.md`, sección «Escena»).

**Qué se cambia y qué no.** Voz, guion, subtítulos, anclas de voz (`escena:palabra`), golpes de cámara, halos y la web **no se
tocan**. Cambia solo lo que se ve. Los fotogramas se rehacen con la voz de la caché: **0 peticiones a Gemini**.

## 1. Qué se ha mirado

- Los 20 `escena.js` que hay hoy en `reel/reels/rincon-*/` (lote 1 y 2: 10; lote 3a: 5; lote 3b: 5; el encargo hablaba de 15, hay 20) y la hoja
  de fotogramas de `rincon-flujo-y-permanencia` como muestra del aspecto.
- El kit v2.1: `LEEME.md`, `piezas/` (las 10), `modelos/` (los 18 del catálogo, el maniquí `maniqui.js` y `durmiente.js`), `piezas/figuras.js`,
  `piezas/objeto.js`, `piezas/modelo3d.js`, `modelos/piedra.js` (patrón de un modelo con efecto).
- `DECISIONES.md` §11-§13, las cinco fichas del 3b y su sección «Hecho».

Los recuentos son de `escena.js` (llamadas a cada pieza y parámetros `modelo`, `disposicion`…), no de fotogramas.

## 2. Inventario

### 2.1 Las diez piezas (20 reels)

| pieza | usos | reels (de 20) | lectura |
|---|---:|---:|---|
| `rotulo` | **110** | 20 | media de 5,5 por reel; `el-tiempo-en-el-alma` y `las-cuatro-verdades` llevan 10 (pilas de 3-4 rótulos) |
| `objeto` | 41 | 17 | casi siempre un modelo suelto sobre su peana |
| `contraste` | **27** | **18** | **siempre `columnas`**: dos tarjetas lado a lado con un modelo o un icono encima |
| `figuras` | 20 | 12 | 17 usos con peones (`pareja` ×7, `sola` ×4, `grupo` ×3, `fila`, `escalera`…), 3 de `tumbada` (maniquí) |
| `burbuja` | 18 | 9 | sobre todo en `saber-que-no-se-sabe` (4), `alienacion` y `mala-fe` (3) |
| `autor` | 21 | 20 | medallón en 20 de 20 (`critica` suma una firma) |
| `cita` | 17 | 16 | |
| `cierre` | 20 | 20 | |
| `medidor` | 7 | 5 | `barras` ×2, `nivel` ×3, `curvas` ×1, uno más de `límite` |
| `linea` | 5 | 5 | |

### 2.2 Modelos y figuras (dentro de `objeto`, `contraste` y `figuras`)

| elemento | usos | reels | dónde |
|---|---:|---:|---|
| **peón** (modelo `peon`/`peones` + `figuras` con peones) | **28** | **12** | alienacion, duda, eterno-retorno, imperativo, mala-fe, placeres, daño, ren-y-li, saber, termino-medio, tiempo, velo |
| `icono` (tubo, el comodín) | 21 | 11 | `tabula-rasa` 6, `tiempo` 3 (el reloj, dos veces en contraste), alienacion 2, condicionamiento 2, eterno 2 |
| `piedra` | 7 | 3 | flujo (3), cuatro-verdades, wu-wei |
| `libro` | 6 | 4 | placeres, significado, tabula-rasa, wu-wei |
| `movil` | 6 | 3 | placeres (3), condicionamiento (2), significado |
| `vaso` | 5 | 2 | limite (4), flujo |
| `llama` | 4 | 2 | critica (3), flujo |
| `engranaje`, `herramienta` | 4 + 4 | 3 + 4 | |
| `casco`, `monedas`, `tarta`, `escalera`, `puente` | 1-3 | 1 cada uno | un solo reel: ya son «propios» |
| `figuras 'tumbada'` (maniquí) | 3 | 2 | duda-metodica (2), wu-wei (1): **el mismo durmiente en dos reels** |
| `peana` con aro y halo | todos los `objeto` | — | firma del kit (§11): **no se toca** |

### 2.3 Lo más repetido, por orden de cansancio

1. **El contraste en dos columnas**: 27 usos en 18 de 20 reels y, en el lote 3b, **7 usos en los 5 reels**.
2. **El peón** (solo, en pareja, en grupo, en fila): 28 usos en 12 reels; en el 3b, 4 de 5 reels (`ren-y-li` lo usa tres veces seguidas con la misma pareja).
3. **La pila de rótulos** (3-4 rótulos uno bajo otro): 110 rótulos en total; el 3b lleva 37 (flujo 6, tiempo 10, placeres 5, ren 8, termino 8).
4. **Los iconos tubo** como comodín (reloj, balanza, apretón…): 21 usos.
5. **El mismo objeto en gancho y cierre** con otro rótulo (`piedra` en flujo, `movil`/`libro` en placeres).
6. Medidores (`barras` y `nivel`) para ideas que no son una cantidad (`termino-medio`, `placeres`).

### 2.4 El esqueleto del 3b hoy (por qué los cinco se ven «el mismo»)

| reel | gancho / giro | idea | ejemplo | giro-2 / cierre |
|---|---|---|---|---|
| flujo | piedra + rótulo | medallón, cita, **contraste** vaso/piedra, rótulo | llama + rótulo | **contraste**, piedra + rótulo |
| tiempo | **contraste** (2 relojes) | medallón, cita, **3 rótulos**, **4 rótulos** | **5 peones** + 2 rótulos | reloj icono + rótulo |
| placeres | **contraste** móvil/libro + **medidor** | medallón, balanza icono, 2 rótulos, **peón**, cita | — | 2 rótulos, **contraste** libro/móvil |
| ren | **pareja de peones** + burbuja + rótulo | medallón, rótulo, **contraste**, cita | **pareja de peones** + 2 rótulos | 3 rótulos, **pareja de peones** + rótulo |
| termino | **contraste** (2 peones) + 4 rótulos | medallón, 3 rótulos, **medidor**, herramienta | cita | **peón** + rótulo |

Elementos propios de su idea, en el sentido de DECISIONES §14.1 (un modelo o una disposición con comportamiento que no sale en otro reel): **0 de 5**.
Solo hay iconos tubo sueltos (`reloj`, `balanza`, `apreton`) que son el comodín del kit.

## 3. La regla (resumen; el texto que manda es `DECISIONES.md` §14)

1. **Elemento propio**: cada reel lleva ≥ 2, y no salen en los otros 4 reels del lote ni en los 5 del lote anterior.
2. **N = 2 reels de 5** para las piezas genéricas (`contraste`, `burbuja`, figuras con peón, `objeto` con `icono` tubo); **N = 1** para `medidor` y `linea`. Rótulos: ≤ 6 por reel y ninguna pila de 3.
3. **Maniquí en vez de peón** cuando una persona hace algo humano; el peón queda para «uno cualquiera», una posición o un grupo anónimo.
4. **Marca** (se repite siempre): medallón de autor, cierre, cita, golpe de cámara, halo, peana con aro.
5. Parpadeo: ≤ 3 destellos por segundo y nunca a pantalla completa (fotosensibilidad).

## 4. Piezas nuevas

Todas siguen el estilo del kit: arcilla mate, acento de la corriente, vidrio/agua translúcidos de §3.4, sin modelos de terceros, sin texto
sobre el 3D (todo el texto es DOM), geometría y materiales en `crear()` y solo posiciones/escalas/opacidades en `pintar(t)` (determinista).
Reparto de lo reutilizable: cada pieza lleva «sirve también para». Los tamaños son el ancho `tam` en px del encargo de la ficha; los costes
(triángulos, llamadas de dibujo, esfuerzo) son **estimaciones de diseño, sin medir**: se miden con `hoja.mjs --modelos` y `comprobar-fichas.mjs`
al construirlas. Referencia medida: el piloto 3D renderiza 40,9 s en 140-204 s con un pico de 1,12-1,18 GB (`LEEME.md`); el criterio es no empeorarlo.

### 4.0 Cambios de núcleo (antes de las piezas)

| cambio | dónde | qué |
|---|---|---|
| **N1** maniquí con tronco | `modelos/maniqui.js` | `posar()` admite `tronco: { flexion, lateral, rotacion }` (columna y tórax) y `raiz: { x, y, z, giro }`; sin esto no hay reverencia ni equilibrista. Opción `pechoMaterial` (para el «calor» de `ritual`). Poses de mezcla en `modelos/posturas.js` (`mezclar(a, b, k)`). |
| **N2** etiquetas ancladas | `piezas/objeto.js`, `piezas/figuras.js`, `util.js` (`PARAMS`) | parámetro `etiquetas: [{ cual \| lado \| quien, texto, sub?, tono?, en, hasta? }]`: píldoras DOM junto a una zona del modelo (las anclas `en/hasta` se resuelven en `preparar`). Sustituye las pilas de rótulos. El modelo declara sus puntos de anclaje en `crear()` y devuelve `dom`. |
| **N3** exportar sub-constructores | `modelos/libro.js`, `movil.js`, `llama.js` | exportar `crearLibro`, `crearMovil`, `crearLlama` (hoy solo van por el catálogo) para `escritorio` y `vela`. |

Coste: S (medio día en total). Se hace primero y lo usan las siete piezas.

### 4.1 `rio` (modelo, `objeto`; `crearRio()` exportable)

- **Idea**: un cauce con agua hecha de partículas que corre de verdad. Lo que cambia (el agua) y lo que dura (el cauce) se ven a la vez.
- **Parámetros**: `tam` (520-700), `ritmo` (0,6-1,5, 1), `forma` ('sinuoso' | 'recto', 'sinuoso'). Estado: `rio`.
- **Construcción**: peana `carril` (L 4,2 × Wd 1,9), dos orillas de arcilla/piedra, 180 partículas (`InstancedMesh` de esferas 8×6, `MAT.agua`)
  con posición = f(índice, t) a lo largo de una curva sinuosa, color por instancia (agua o acento). Aro de acento fino en el borde interior de cada orilla (apagado).
- **Efectos** (los comunes más):
  - `tinta`: una partícula pasa a acento y crece al 1,6×, con estela de 6 partículas; recorre el cauce y sale por el extremo en ~4 s («ni una gota»).
  - `cauce`: las dos orillas se encienden (emisivo 0 → 0,9 en 0,6 s) y los aros de acento se dibujan de un extremo a otro.
  - `renueva`: una onda de izquierda a derecha (1,4 s) vuelve todas las partículas de acento; el agua «nueva»; no vuelve.
  - `remolino`: onda estacionaria de tres espirales de acento en medio del cauce; las partículas que lo cruzan se desvían y siguen; **el patrón se queda mientras el agua pasa**.
- **Se ve**: el agua que corre, una gota de acento que se va, las orillas que se encienden (lo que dura), el remolino quieto (el patrón).
- **Coste (estimado)**: ~16 mil triángulos, 4 llamadas de dibujo, < 10 MB, render +2 %; esfuerzo **M** (1 día).
- **Sirve también para**: `wu-wei` (el agua del Daodejing), Heráclito/Parménides, cualquier «corriente», «flujo» o «tradición que pasa»; con `forma: 'cinta'` (propuesta) sirve de cinta de montaje para `alienacion`.

### 4.2 `vela` (modelo, `objeto`)

- **Idea**: una vela que se gasta mientras la llama no cambia: un proceso, no una cosa.
- **Parámetros**: `tam` (400-480). Estado `vela`. Efecto `consume` (`dur`, 5 s por defecto).
- **Construcción**: candelabro bajo oscuro sobre peana `r 1,4`, cera de arcilla (cilindro) con dos gotas fijas, mecha y llama (reutiliza `crearLlama`).
- **`consume`**: la cera baja del 100 % al 40 % de su altura y la llama sigue a la punta **con el mismo tamaño y movimiento**; a la base crece un charco de cera (disco).
- **Coste**: ~4 mil triángulos (el de `llama`); esfuerzo **S** (medio día).
- **Sirve también para**: Heráclito, cualquier «quemarse», esfuerzo, finitud (Séneca, brevedad de la vida).

### 4.3 `arena` (modelo, `objeto`): el reloj de arena que se estira

- **Idea**: el tiempo vivido no mide lo mismo que el reloj; además, las tres zonas del reloj de arena son el pasado, el futuro y el presente.
- **Parámetros**: `tam` (300-480; el modelo mide ~2,1× de alto que de ancho), `etiquetas` con `cual: 'pasado' | 'futuro' | 'presente'`. Estado `arena`.
- **Construcción**: dos bulbos (`LatheGeometry`, `MAT.vidrio`), tapas y tres columnas de arcilla, ~90 granos (`InstancedMesh` icosaedro detalle 0) que caen por el cuello, dos montones (conos escalados según llenado).
- **Efectos**:
  - `estira`: el reloj se alarga (1,25× de alto, 0,9× de ancho, 0,8 s) y los granos caen a 0,35× de velocidad: «cuelgan».
  - `encoge`: se achata (0,8× de alto, 1,1× de ancho) y los granos caen a 2,4×.
  - `respira`: oscila entre los dos a 0,35 Hz (el tiempo de la cabeza, que se estira y se encoge).
  - `zona { cual }`: `pasado` enciende el montón de abajo; `futuro`, el bulbo de arriba; `presente`, el cuello, con un único grano de acento que cae y se desvanece al llegar abajo. Una zona a la vez; las anteriores quedan en tono tenue.
  - (propuesta para el 3a) `voltea`: gira 180° y vuelve a empezar (eterno retorno).
- **Se ve**: un reloj de arena de vidrio con arena viva que se estira, se achata, o se ilumina por zonas con su etiqueta al lado.
- **Coste**: ~9 mil triángulos, 6 llamadas; esfuerzo **M-L** (1,5 días: es la más trabajada). El alto con `estira` crece un 25 %: el `y` de la ficha reserva ese hueco.
- **Sirve también para**: Bergson/duración, Zenón, carpe diem, kairós; con `voltea`, `eterno-retorno`.

### 4.4 `reloj` (modelo, `objeto`): la esfera

- **Parámetros**: `tam` (300-360), `tono`. Estado `reloj`. Efecto `marca { min }`.
- **Construcción**: disco de arcilla con bisel de piedra, 12 marcas, dos agujas, 2 × 60 segmentos instanciados para el arco de acento (sin cifras: no se pinta texto en 3D).
- **`marca { min }`**: la minutera barre `min` minutos en 1,4 s y deja un arco de acento: 30 → media vuelta; 120 → dos anillos concéntricos.
- **Coste**: ~3 mil triángulos; esfuerzo **S**.
- **Sirve también para**: toda idea de medir o de horario (trabajo y tiempo libre, Marx), `eterno-retorno`.

### 4.5 `notas` (modelo, `objeto`): la canción

- **Idea**: tres «presentes» en el alma: lo que recuerdas (la estela), lo que atiendes (el cabezal), lo que esperas (las notas fantasma). Es literalmente la canción del ejemplo.
- **Parámetros**: `n` (6), `tam` (700-800), `etiquetas` con `cual: 'estela' | 'cabezal' | 'fantasmas'`. Estado `notas`.
- **Construcción**: peana `carril` (L 4,4 × Wd 1,4), 5 líneas finas de pentagrama, `n` notas (esferas aplanadas) a alturas fijas, un cabezal (aro de acento), un tubo de estela con `drawRange`, y las notas aún no tocadas con material fantasma (aristas de §3.4).
- **Efectos**: `zona { cual }` resalta una de las tres cosas y atenúa las otras; `toca` recorre las notas (la que suena sube y se enciende; al pasar se vuelve arcilla y deja rastro).
- **Coste**: ~5 mil triángulos, 8 llamadas; esfuerzo **S-M** (4-5 h).
- **Sirve también para**: Husserl (retención/protensión), Kant, Schopenhauer y la música; cualquier «secuencia que se cuenta en pasos».

### 4.6 `balanza` (modelo, `objeto`): cantidad contra clase

- **Parámetros**: `tam` (440-620), `estado` (`vacia` | `ambas`), `etiquetas` con `lado: 'izq' | 'der'`.
- **Construcción**: columna y fulcro de arcilla sobre peana, brazo de caja redondeada, dos platos (cilindros bajos) colgados de tres cadenas finas; cargas: 8 cubos de arcilla (izquierda) y una gema de acento (octaedro, emisivo 0,4) a la derecha.
- **Efectos**:
  - `cantidad`: los cubos caen en el plato izquierdo uno a uno con rebote y el brazo baja a −0,22 rad.
  - `clase`: la gema baja sobre el plato derecho y **el brazo cambia de lado** (+0,30 rad), con oscilación amortiguada de 1,2 s: pesa más una sola cosa de buena clase.
  - `sin-unidad`: la gema se vuelve fantasma, el brazo oscila ±0,12 rad sin asentarse y unas marcas de escala se desvanecen: «¿medida con qué?».
- **Coste**: ~6 mil triángulos, ~10 llamadas; esfuerzo **M** (medio día-1 día).
- **Sirve también para**: utilitarismo y todo cálculo de daños y beneficios, justicia (velo, Aristóteles), derecho, ponderar razones.

### 4.7 `escritorio` (modelo, `objeto`): el móvil que parpadea y el libro con luz

- **Parámetros**: `tam` (640-760), `etiquetas` con `cual: 'libro' | 'movil'`. Estado `escritorio`.
- **Construcción**: losa ancha; a la izquierda un libro (`crearLibro`, abierto, con marcapáginas) bajo un haz cálido estable; a la derecha un móvil recostado (`crearMovil`) con una tira de 6 miniaturas que sube sin parar y un haz frío que parpadea.
- **Efectos**:
  - `ofrece`: el libro se enciende en acento y el marcapáginas queda casi al final: «terminar un libro».
  - `engancha`: el móvil pulsa a 2 Hz suaves y su halo crece al 1,6×; el libro se desplaza un 15 % hacia él y su luz baja a la mitad: «minuto a minuto, el vídeo gana».
  - `amarga`: el halo del móvil se desatura a gris verdoso y se encoge; el libro no cambia: «la tarde de vídeos deja peor sabor».
  - `resiste`: el móvil sigue pulsando, el libro se queda quieto y su aro de acento late firme: la apuesta de Mill.
- **Coste**: ~8 mil triángulos (con los modelos que ya existen), ~12 llamadas; esfuerzo **M** (1 día).
- **Seguridad**: parpadeo ≤ 2,5 Hz y nunca a pantalla completa (§14.5).
- **Sirve también para**: atención y redes, hábitos, `condicionamiento-operante`, lectura.

### 4.8 `figuras 'vado'` (disposición con maniquí): una persona entra al río

- **Acciones**: `entra` (el maniquí camina desde la orilla, cuatro pasos, hasta el agua a media espinilla; 1,6 s), `otra` (las partículas que lo rodean pasan a acento y el maniquí mira abajo: «aguas distintas»), `sale`, `cauce` (como el efecto de `rio`), `etiqueta { texto, sobre: 'agua' | 'cauce' }` (una píldora por valor de `sobre`).
- **Construcción**: `crearRio()` más el maniquí con la pose `camina` (piernas ±0,5 rad en oposición, brazos al revés).
- **Coste**: M (1 día); ~22 mil triángulos.

### 4.9 `figuras 'ritual'` (disposición con dos maniquíes): saludo, reverencia, relación

- **Parámetros**: `distancia: 'lejos' | 'media' | 'cerca'` (como empieza), `tam` (560-760).
- **Acciones**: `saluda` (A levanta la mano y la agita, B inclina un poco la cabeza), `reverencia` (los dos se inclinan 35° en 1,2 s con una pausa y vuelven; una línea de acento dibuja el recorrido), `calor { nivel }` (el pecho se enciende en acento de 0 a `nivel`: *ren*), `fachada` (los dos maniquíes se aplanan a recortes de cartón: z × 0,12, color apagado: «pura fachada»), `cuenta { n, dur }` (n bolitas en el borde de la peana que se encienden de una en una: los meses), `acerca` (la distancia pasa a `cerca` en 1,8 s), `mano` (apretón), `hilo` (el hilo de acento entre las manos, el del kit), `fantasma` (los dos pasan a aristas translúcidas), `etiqueta { quien: 'a' | 'b', texto }`.
- **Construcción**: dos `crearManiqui` (N1) sobre una peana de `r 1,6`; `a` en arcilla, `b` en acento; `pechoMaterial` en `b`.
- **Coste**: M-L (1,5 días; el apretón y la reverencia piden iterar a ojo); ~14 mil triángulos.
- **Riesgo**: que el maniquí «haga bien» los gestos; por eso `ren-y-li` es el piloto (§7).

### 4.10 `figuras 'cuerda'` (disposición con maniquí): el equilibrista

- **Parámetros**: `temblor: 'alto' | 'bajo' | 'nulo'` (alto), `tam` (700-780), `etiquetas` con `lado: 'izq' | 'centro' | 'der'`.
- **Construcción**: dos postes de arcilla sobre peana `carril`, cuerda como tubo fino con caída suave, maniquí equilibrista con balancín en las manos, y una banderita (el «medio») que cuelga bajo la cuerda y se desliza.
- **Acciones**: `inclina { lado }` (el balancín y el tronco se van a un extremo), `tacha { lado }` (aspa coral en ese poste), `centra`, `medio { pos, texto }` (la banderita se desliza a `pos` en [−1, 1] y el maniquí la sigue; la píldora cambia a `texto`), `practica { n, texto }` (el maniquí cruza `n` veces y en cada paso el temblor baja a la mitad), `afina` (ondas de acento concéntricas desde el balancín, como un diapasón).
- **Coste**: M (1-1,5 días); ~9 mil triángulos.

### 4.11 `figuras 'juez'` (disposición con maniquí): quien ha probado los dos

- **Acciones**: `sopesa` (los dos brazos suben y bajan alternos, como una balanza viva, con un libro pequeño y un móvil pequeño en las palmas, hasta asentarse nivelados), `etiqueta { texto }`.
- **Coste**: S-M (medio día); ~5 mil triángulos.

### 4.12 Resumen de costes y reparto

| pieza | tipo | triángulos | llamadas | memoria | esfuerzo |
|---|---|---:|---:|---|:-:|
| N1 maniquí con tronco | núcleo | — | — | — | S |
| N2 etiquetas ancladas | núcleo | — | — | — | S |
| N3 exportar sub-constructores | núcleo | — | — | — | S |
| `rio` | modelo | 16 k | 4 | < 10 MB | M |
| `vela` | modelo | 4 k | 3 | < 5 MB | S |
| `arena` | modelo | 9 k | 6 | < 10 MB | M-L |
| `reloj` | modelo | 3 k | 4 | < 5 MB | S |
| `notas` | modelo | 5 k | 8 | < 5 MB | S-M |
| `balanza` | modelo | 6 k | 10 | < 5 MB | M |
| `escritorio` | modelo | 8 k | 12 | < 10 MB | M |
| `vado` | disposición | 22 k | 6 | < 10 MB | M |
| `ritual` | disposición | 14 k | 10 | < 10 MB | M-L |
| `cuerda` | disposición | 9 k | 8 | < 5 MB | M |
| `juez` | disposición | 5 k | 6 | < 5 MB | S-M |

Total ≈ 11 días-persona; con cuatro constructores en paralelo es **una tanda**. Reparto sin choques de ficheros (cada paquete añade una
línea a `modelos/index.js` / `piezas/figuras.js`; las integra una sola persona):

| paquete | piezas | ficheros propios |
|---|---|---|
| **A** (primero) | N1, N2, N3, `ritual`, `juez` | `modelos/maniqui.js`, `posturas.js`, `piezas/objeto.js`, `figuras.js` (solo `ritual` y `juez`) |
| **B** | `rio`, `vado`, `vela`, `cuerda` | `modelos/rio.js`, `vela.js`, `figuras-b.js` (vado, cuerda) |
| **C** | `arena`, `reloj`, `notas` | `modelos/arena.js`, `reloj.js`, `notas.js` |
| **D** | `balanza`, `escritorio` | `modelos/balanza.js`, `escritorio.js` |

B, C y D esperan solo a N1-N3 del paquete A (medio día). Todo lo que renderiza va de uno en uno (`DECISIONES` §13.4).

## 5. El lote 3b rediseñado

El bloque `montar()` completo de cada reel está en su ficha. Resumen (las anclas de voz son las mismas: se conservan todas las de la escena anterior que siguen teniendo qué anclar y las nuevas solo usan palabras del guion).

| reel | propios (≥ 2) | genéricas que quedan | escena a escena |
|---|---|---|---|
| **flujo-y-permanencia** | `rio` (tinta, cauce, renueva, remolino), `vela` (consume), `vado` | 1 contraste (la disputa abierta) | río de partículas con una gota que se va y orillas que se encienden → medallón + cita B12 → persona que entra en el río y recibe agua nueva, con el cauce iluminado → vela que se gasta con la llama quieta → contraste de la disputa → el mismo río con un remolino fijo («el patrón») |
| **el-tiempo-en-el-alma** | `arena` (estira, encoge, zona, respira), `reloj` (marca), `notas` (zona, toca) | ninguna | reloj de arena que se estira («esperando») y se achata («con alguien») junto a un reloj que marca 30 y 120 min → medallón + cita → reloj de arena con tres zonas rotuladas → notas: estela, cabezal, fantasmas → la canción tocándose → reloj fijo frente a arena que respira |
| **placeres-superiores** | `escritorio` (ofrece, engancha, amarga, resiste), `balanza` (cantidad, clase, sin-unidad), `juez` | ninguna | libro con luz frente a móvil que pulsa, y el móvil gana → su sabor amargo → medallón + balanza (muchos cubos / una gema) + maniquí juez + cita → balanza que no se asienta («¿medida con qué?») → escritorio y la apuesta |
| **ren-y-li** (piloto) | `ritual` (saluda, fachada, reverencia, calor, cuenta, acerca, mano, fantasma), cuenta de meses | 1 burbuja | par de maniquíes lejos, saluda sin ganas, se vuelven cartón → medallón → reverencia y calor en el pecho → los meses se cuentan, se acercan → los dos fantasmas con «ren ≈ humanidad» y «li ≈ rito» → apretón con el hilo de acento |
| **termino-medio** | `cuerda` (inclina, tacha, medio, practica, afina), banderita del medio | ninguna | equilibrista entre «Callarlo todo» y «Soltarlo todo» (los dos tachados) → la banderita del medio se mueve con jefe/pareja/noticia → medallón + zonas rotuladas, el medio que se mueve, el temblor que baja con la práctica → cita → el equilibrista firme y las ondas de afinar |

Cuentas del lote tras el rediseño: **contraste 1/5** (N = 2), **medidor 0/5**, **peón 0/5**, **icono tubo 0/5**, burbuja 1/5, rótulos 37 → 18 sin ninguna pila de 3 (flujo 6, tiempo 2, placeres 3, ren 5, termino 2, más las píldoras ancladas a los modelos).
El maniquí está en 4 de 5 reels, cada uno con su propia disposición y acción (el maniquí es el actor, lo que cuenta como «propio» es la escena que hace).

Notas de colocación (todo provisional hasta ver `vista.mjs --cajas`):

- `y` y `tam` se han elegido para no pisar el medallón (≈ 740-900) ni la cita (≈ 900-1110); donde una pieza va bajo la cita (`vado`, `ritual`, `cuerda`) la banda libre es 1150-1540.
- Las que se estiran (`arena`) y las que se inclinan (`cuerda`) reservan el 25 % de más en su caja.
- `placeres`: el escritorio empieza en y ≈ 760 por la portada limpia (nada por encima de 700 en `portada_t`).

## 6. Lote 3a: qué retocar con el mismo criterio (sin rediseñar todavía)

> **Superado por §9** (F15a): el 3a se rediseña; esta tabla queda como histórico.

| reel | lo repetido hoy | idea de retoque (reutiliza lo nuevo) | prioridad |
|---|---|---|:-:|
| **las-cuatro-verdades** | 10 rótulos, piedra ×2, 1 icono, 1 contraste: ningún propio | una persona con una piedra atada que se suelta (`figuras 'carga'`, nueva y pequeña) y camina; las cuatro verdades como cuatro pasos con píldoras ancladas | 1 |
| **tabula-rasa** | 6 iconos tubo, libro ×2, 2 contrastes | una tablilla de cera (`tablilla`, modelo nuevo S) que se va marcando con huellas | 2 |
| **eterno-retorno** | 3 peones + 2 contrastes + 2 iconos | `arena` con `voltea` (la vida como reloj que se vuelve a girar) y un maniquí que repite el mismo gesto con eco | 3 |
| **alienacion** | engranaje ×2, herramienta, 2 iconos, 2 contrastes, 3 burbujas | `rio` con `forma: 'cinta'` (cajitas): el maniquí produce y el producto se aleja | 4 |
| **duda-metodica** | contraste ×2, peón solo, y el **mismo durmiente** que `wu-wei` | cambiar los contrastes por una torre de bloques de creencias de la que se van retirando piezas (`torre`, modelo S); el durmiente se queda solo aquí | 5 |

Del lote 1 y 2 quedan fuera de este encargo `saber-que-no-se-sabe` (4 burbujas, 0 objetos) y `mala-fe` (3 burbujas + peones), que serían los siguientes; y `wu-wei`, que comparte el durmiente con `duda-metodica`.

## 7. Plan, piloto y comprobaciones

**Pasos** (cada uno lo pueden coger distintas personas; uno a uno al renderizar):

1. **Paquete A** (N1-N3 + `ritual` + `juez`) en `rincon-kit` (subir `VERSION` a 3.0 y volver a `copiar.mjs`).
2. **Piloto: `rincon-ren-y-li`.** `hoja.mjs --modelos` para `ritual`, `comprobar-fichas.mjs ren-y-li`, render y revisión del humano de los gestos del maniquí.
   Es el reel con más repetición propia (la misma pareja de peones tres veces) y es donde el maniquí tiene que demostrar que «hace humano» y no «monigote»; si pasa, `cuerda` y `juez` pasan.
3. Paquetes B, C, D en paralelo → reels `flujo`, `tiempo`, `placeres`, `termino`.
4. Un reel a la vez: `copiar.mjs`, `reel.mjs` (voz de la caché), `vista.mjs --cajas`, `vacios.mjs`, `web.mjs`, `importar-reels`. Se rellena de nuevo «Hecho» (las medidas actuales son de la escena anterior).
5. Lote 3a: si el humano aprueba el 3b, retocar por la prioridad de §6.

**Comprobaciones por pieza** (las de `LEEME.md`): consola limpia; un solo contexto WebGL; `pintar(t)` determinista; sin parámetros desconocidos
(`PARAMS` de `util.js` ampliado); cajas dentro del escenario seguro con la cámara de reposo y la del golpe, **también con el efecto en su extremo**
(`estira`, `inclina`); 0 solapes; píldoras DOM dentro de la columna 90-930; parpadeo ≤ 3 Hz; render ≤ 3 min y pico ≤ 1,3 GB.

## 8. Riesgos y lo descartado

| riesgo | respuesta |
|---|---|
| El maniquí hace gestos raros (reverencia, apretón, equilibrio) | piloto con `ren-y-li` antes de seguir; grosor 1,3 y cabeza 1,15 del durmiente aprobado; poses por interpolación entre dos o tres, nada de ciclos largos |
| `arena` o `cuerda` se salen de su caja con el efecto | reservar 25 % en el `y`; medir con `--cajas` también en el instante del efecto |
| El parpadeo del móvil cansa o dispara fotosensibilidad | ≤ 2,5 Hz, cambios de brillo del 30 %, sin blancos a pantalla completa |
| Las píldoras ancladas se pisan con el medallón o la cita | banda libre de §5; si no cabe, reducir `tam`, no mover el medallón |
| Demasiado maniquí | límite: cada disposición en un solo reel; el lote 3a mezcla `arena`, `rio` y `tablilla` |
| Memoria del equipo al renderizar | todo nuevo es instanciado y sin texturas; un render a la vez; los costes se miden antes de dar por buena una pieza |

**Descartado:**
- *Más tarjetas con modelos nuevos encima* (contraste con otro objeto): es el mismo esqueleto con otro adorno; no cambia lo que se ve.
- *Un motor de partículas común a todo*: más trabajo que `rio`, `arena` y `notas` sueltos, y más difícil de mantener determinista.
- *Ideogramas chinos (仁, 禮) en `ren-y-li`*: las fuentes del kit (Newsreader, Inter) no los llevan; añadir una fuente CJK sube el peso y el riesgo. Queda como idea para el post.
- *Cambiar de peana o de cámara*: la peana con aro es la firma de §11 y la cámara fija con golpe es decisión del humano.
- *Modelos GLB de terceros*: el humano ya lo descartó con el maniquí de `befit`.
- *Rehacer las voces para «encajar» con las imágenes*: no se toca la voz.

## 9. Lote 3a rediseñado (F15a)

Tarea t-2db3ea (encargo e-17e430). Tras el «me encanta» del humano al 3b, se aplica §14 al 3a y **esta sección sustituye a §6** (que era una lista de ideas). Diseño, sin código ni render; voz, texto y anclas no se tocan (0 peticiones a Gemini). El bloque `montar()` de cada reel está en su ficha, sección «Escena (3D, kit v3 · F15a)».

### 9.1 Criterios que se han seguido

- **Propios no repetidos con el 3b ni entre sí.** El 3b ya gasta `rio`, `vela`, `vado`, `arena`, `reloj`, `notas`, `balanza`, `escritorio`, `juez`, `ritual`, `cuerda`. Por eso se **descartan** dos propuestas de §6: `arena` con `voltea` (la hora de arena es la protagonista de `el-tiempo-en-el-alma`) y `rio` con `forma: 'cinta'` (el río es el de `flujo-y-permanencia`). Quedan como modelos nuevos `semana` y `cinta`.
- **Se cambian dos ideas de §6 porque la voz dice otra cosa.** `carga` (piedra atada que se suelta) pasa a `sujeta`: la frase 9 de `las-cuatro-verdades` dice «cambiar cómo sujetas», no «soltar». `tablilla` (cera) pasa a `hoja`: Locke dice papel en blanco.
- **Cronología tras el autor en los cinco** (`linea` de §14.4). Antes, ninguno del 3a la llevaba.
- **Maniquí**: cada disposición en un solo reel (`tumbada`, `eco`, `sujeta`, `puesto`) y `tabula-rasa` no lleva ninguna.

### 9.2 Tabla del lote 3a

| reel | escena a escena | propios (≥ 2) | genéricas | rótulos |
|---|---|---|---|---:|
| **duda-metodica** | torre de «lo que das por seguro» que se ve igual de firme en sueño y en vela → Descartes y la cronología → torre que pierde sentidos, mundo y sumas (niebla del genio) y deja un solo bloque → cita → durmiente que se incorpora con el aro del «yo» → la torre como aristas alrededor del bloque firme | `torre` (7 efectos), durmiente con `incorpora` y `yo` | ninguna | 3 |
| **tabula-rasa** | bandeja de piezas simples con un hueco que no se llena; unicornio montado con esas piezas → Locke y la cronología → hoja en blanco que recibe marcas de dos fuentes, se combinan y la que nace de la nada se disuelve → la hoja ya traía marcas → piezas con hilos hasta su origen | `piezas`, `hoja` | ninguna | 2 |
| **eterno-retorno** | circuito de siete días con una ficha, una vuelta, otra, y copias hasta el infinito → maniquí con escalofrío → Nietzsche y la cronología → el demonio (burbuja) y la misma vida repetida en copias pálidas, sin poder editar el dolor → cita → la semana con los tramos que repetirías y los días que dejabas pasar → esos días resaltados | `semana` (5 efectos), `figuras 'eco'` | 1 burbuja | 3 |
| **las-cuatro-verdades** | persona que sujeta un orbe (las vacaciones) que merma y tira; sitio, tiempo y compañía tachados → Buda y la cronología → cuatro losas (malestar, causa, parar, camino) con la causa que se aprieta → cita → mismo agarre, ahora con la mano abierta y el orbe sigue menguando | `figuras 'sujeta'`, `camino` | ninguna | 3 |
| **alienacion** | taller: algo entero y señalado → el mismo maniquí en una cinta: revisa una parte, el producto se va → Marx y la cronología → cinta sola (producto, cómo, horas) → pecho encendido mientras la cinta se lleva todo → diálogo de la cena con la cinta de fondo → cinta con los hilos de quien la organiza | `figuras 'puesto'` (taller y cinta), `cinta` | 1 burbuja | 5 |

Inventario del lote (la tabla de §2.4 para el 3a, tras el rediseño):

| | antes | después | N |
|---|---:|---:|---:|
| `contraste` | 9 usos en 5 reels | **0** | 2 |
| `burbuja` | 2 reels (4 usos) | 2 reels (2 usos) | 2 |
| figuras con peón | 3 reels | **0** | 2 |
| `objeto` con icono tubo | 5 reels (12 usos) | **0** | 2 |
| `medidor` / `linea` no cronología | 0 | 0 | 1 |
| rótulos por reel | 3-10, con pilas de 3-4 | 2-5, **sin pilas** | 6 |
| elementos propios | 0 de 5 (el durmiente de `duda-metodica` lo comparte `wu-wei`) | 2 en cada uno | ≥ 2 |
| cronología del autor | 0 de 5 | **5 de 5** | — |
| disposiciones de maniquí | 1 (durmiente) | 4 reels, cada una en uno; `tabula-rasa` sin maniquí | cada una en un reel |

### 9.3 Piezas nuevas (listas para construir)

Mismas reglas que §4: arcilla mate y acento de la corriente, vidrio de §3.4, sin texto en 3D, geometría y materiales en `crear()`, solo posiciones, escalas y opacidades en `pintar(t)` (determinista), nada de modelos de terceros. Los costes son estimaciones de diseño; se miden con `hoja.mjs --modelos` y `comprobar-fichas.mjs`. Cada pieza se registra en `modelos/index.js` o `piezas/figuras.js`. Anclas (`cual`/`quien`) y `etiquetas` son las de N2 (v3.0).

**Cambio de núcleo N4 (para `eco`, S):** `crearManiqui(K, mat, { detalle: 'bajo' })`, con las esferas a 14×9 en lugar de 28×18, para las copias del eco. Sin esto cada copia pesa ≈ 20 mil triángulos.

#### 9.3.1 `torre` (modelo, `objeto`)  · duda-metodica

- **Idea**: la duda como una torre de creencias a la que se van quitando capas hasta que queda una sola cosa en pie.
- **Parámetros**: `tam` (360-460, ancho de la base; alto ≈ 1,35 ×), `estado: 'entera' | 'resto'` (`resto` = solo el bloque del cogito). Anclas para `etiquetas`: `sentidos`, `mundo`, `sumas` (centro de cada capa, lado alterno) y `cogito`.
- **Construcción**: peana r 1,4; tres capas de tres bloques (cajas redondeadas, alternando la orientación 90° como en un Jenga): arriba `sentidos`, en medio `mundo`, abajo `sumas`. El bloque central de la capa baja es el `cogito` (acento, igual de grande). Una niebla de 60 esferas instanciadas translúcidas (`MAT.vidrio`, oscura) para `genio`.
- **Efectos**: `sueña` (toda la torre pasa a aristas translúcidas y luz cálida, con un vaivén de 0,03; 0,8 s) · `alterna` (conmuta sólida ↔ sueño cuatro veces en 3 s, misma silueta; ≤ 2 Hz) · `duda { cual }` (la capa tiembla ±0,02 y pasa a aristas) · `retira { cual }` (la capa se desliza hacia fuera y arriba y se desvanece, 1,2 s; las superiores ya se han ido) · `genio` (la niebla baja y rodea la capa `sumas`, cuyas caras parpadean entre dos tonos) · `resiste` (el bloque cogito sube 0,12, se enciende y un aro de acento late a 0,6 Hz; la niebla se retira) · `reconstruye` (las tres capas reaparecen como aristas sobre el bloque firme).
- **Se ve**: una torre que parece segura, que se desvanece por capas en el orden en que habla Descartes y que se queda en un bloque que brilla.
- **Coste (estimado)**: ≈ 8 mil triángulos (la niebla es la mitad), 7-8 llamadas, < 5 MB; esfuerzo **S-M** (≈ 1 día).
- **Sirve también para**: toda idea de «lo que se apoya en algo» (fundamentos, Neurath, Popper), escepticismo, deducción.

#### 9.3.2 `figuras 'tumbada'`: acciones `incorpora` y `yo`  · duda-metodica

- `incorpora`: el durmiente se incorpora en 1,4 s (tronco +0,9 rad, mano a la frente, la manta resbala) y se queda sentado. `yo`: un aro de acento sobre la cabeza que late dos veces y se queda tenue.
- Cambia `durmiente.js` (manta de 60×26 vértices que sigue al cuerpo): el riesgo es la manta al incorporarse; si se ve mal, la manta cae al lado con un desplazamiento fijo. Coste **S-M** (medio día-1 día).

#### 9.3.3 `piezas` (modelo, `objeto`)  · tabula-rasa

- **Idea**: lo que puedes imaginar son combinaciones de piezas que ya tienes; el hueco de lo realmente nuevo se queda vacío.
- **Parámetros**: `tam` (560-640), `estado: 'suelto' | 'armado'` (`armado` = el unicornio ya montado). Anclas: `hueco`, `caballo`, `cuerno`, `sentidos`, `reflexion`.
- **Construcción**: bandeja baja (carril 4,2 × 1,6) con cinco compartimentos con una pieza simple cada uno (cubo, esfera, cilindro, cono, prisma) y un sexto compartimento vacío dibujado en aristas (el hueco). Un unicornio de baja resolución hecho **con esas mismas piezas** (cuerpo = cubo redondeado, patas = cilindros, cabeza = esfera aplastada, cola = cono, cuerno = cono de acento). Dos esferas de origen a los lados para `rastrea`.
- **Efectos**: `busca` (el hueco late en acento y una luz recorre la bandeja sin encender nada) · `falla` (el contorno del hueco se resquebraja en cinco trozos que se apagan) · `ensambla` (las piezas vuelan de su compartimento a su sitio, 1,6 s; el cuerno entra el último con un aro) · `rastrea` (de cada pieza del unicornio sale un hilo fino de acento hasta una de las dos esferas de origen).
- **Coste**: ≈ 5 mil triángulos, ~12 llamadas, < 5 MB; esfuerzo **M** (1 día: la trayectoria de montaje).
- **Sirve también para**: Hume y las ideas complejas, lenguaje (palabras y gramática), cualquier combinatoria.

#### 9.3.4 `hoja` (modelo, `objeto`)  · tabula-rasa

- **Idea**: el papel en blanco de Locke, con dos fuentes que lo marcan.
- **Parámetros**: `tam` (520-600). Anclas: `hoja`, `sentidos`, `reflexion`, `previo`.
- **Construcción**: hoja de arcilla clara (caja 3,4 × 0,04 × 2,4, esquina levantada) sobre peana; ≈ 40 marcas (rombos finos instanciados) en posiciones fijas.
- **Efectos**: `marca { fuente: 'sentidos' | 'reflexion', n }` (n marcas de acento llegan desde el borde izquierdo o derecho y se posan, escalonadas 0,15 s) · `combina` (líneas finas unen las marcas en dos o tres figuras con un nodo mayor) · `intenta` (una marca nace del aire en medio, no se sostiene y se disuelve) · `previo` (marcas tenues en neutro aparecen ya impresas en la hoja).
- **Coste**: ≈ 2 mil triángulos, 5 llamadas; esfuerzo **S** (medio día).
- **Sirve también para**: memoria y aprendizaje, escritura, Hume.

#### 9.3.5 `semana` (modelo, `objeto`)  · eterno-retorno

- **Idea**: una semana como un circuito cerrado que se recorre una y otra vez.
- **Parámetros**: `tam` (640-720), `estado: 'blanca' | 'marcada'` (`marcada` = repite [1, 2, 4] y pasa [0, 3, 5, 6]). Anclas: `repites`, `pasas`.
- **Construcción**: peana circular r 1,6; siete losas redondeadas en anillo (radio 1,05); una ficha de acento que salta de losa en losa en arco; copias fantasma del anillo (instanciadas, hasta cuatro) para `eco`.
- **Efectos**: `gira` (la ficha da una vuelta en 1,6 s; la primera es más lenta) · `eco` (cuatro copias del anillo en aristas aparecen apiladas hacia arriba, cada una más tenue: «infinitas») · `repite { dias }` (las losas dadas se encienden en acento) · `pasa { dias }` (las demás se apagan a gris tenue y se hunden 0,05) · `mira` (las losas `pasa` se rodean de un aro de acento que late dos veces y las encendidas se atenúan un 40 %).
- **Coste**: ≈ 7 mil triángulos, 6 llamadas; esfuerzo **M** (1 día).
- **Sirve también para**: hábitos y rutinas, ciclos (días, estaciones), Sísifo y Camus.

#### 9.3.6 `figuras 'eco'` (disposición con maniquí)  · eterno-retorno

- **Idea**: una persona cuya secuencia vuelve a pasar, igual, una y otra vez.
- **Parámetros**: `copias` (0-3, 3), `tam` (620-720). Etiquetas con `quien: 'a' | 'copia'`.
- **Construcción**: peana carril (L 4,4 × Wd 1,4); el maniquí (acento, grosor 1,3, cabeza 1,15) a la izquierda; hasta tres copias en arcilla a opacidad .55 / .38 / .24, cada una 8 % menor y más al fondo, con detalle `bajo` (N4). **No son aristas** (no deben parecerse al `fantasma` de `ren-y-li`).
- **Acciones**: `escalofrio` (se encoge, hombros arriba y brazos cruzados, 1,6 s, y vuelve) · `vive` (secuencia de tres gestos de 1 s: placer = brazos arriba y abiertos, dolor = encorvado con la mano en el pecho, paso = un paso) · `repite` (las copias aparecen una a una repitiendo la secuencia con 0,6 s de retraso) · `edita { cual: 'dolor' }` (una mano de acento quita el gesto de dolor de la primera copia, se borra y vuelve idéntica; las demás lo repiten) · `etiqueta`.
- **Coste**: **M** (1 día; los gestos son interpolaciones entre tres poses); ≈ 30 mil triángulos con tres copias en detalle bajo.
- **Riesgo**: que la secuencia de gestos parezca un baile. Piloto con `gestos.mjs` antes de integrarla.

#### 9.3.7 `figuras 'sujeta'` (disposición con maniquí)  · las-cuatro-verdades

- **Idea**: una persona que sujeta algo que se mueve y se gasta; lo que cambia es cómo lo sujeta.
- **Parámetros**: `tam` (640-720). Anclas: `orbe`, `mano`, `izq`, `der`, `arriba`.
- **Construcción**: peana r 1,5; el maniquí en arcilla (el acento se reserva al orbe); un orbe de vidrio con núcleo de acento emisivo atado por un hilo fino (tubo) a la mano derecha, con un vaivén lento.
- **Acciones**: `aferra` (las dos manos cierran el hilo, hombros arriba, el orbe tira hacia arriba y el hilo se pone recto) · `tira` (el orbe se aleja un poco; el brazo se estira) · `merma` (el orbe se encoge del 100 al 45 % y su núcleo se apaga en 8 s; no se detiene) · `afloja` (el puño pasa a mano abierta con el hilo en bucle flojo; tronco recto, brazo bajo; el orbe sigue mermando) · `tacha { cual }` (aspa coral junto a un ancla: `izq`, `der`, `arriba`) · `etiqueta`.
- **Coste**: **M** (1 día); ≈ 24 mil triángulos.
- **Sirve también para**: apego, duelo, control (estoicos), posesión.

#### 9.3.8 `camino` (modelo, `objeto`)  · las-cuatro-verdades

- **Idea**: cuatro etapas (diagnóstico, causa, pronóstico, tratamiento) como cuatro losas de un camino.
- **Parámetros**: `tam` (660-740). Anclas: `malestar`, `causa`, `parar`, `camino`.
- **Construcción**: peana carril (L 4,4 × Wd 1,6); cuatro losas redondas en zigzag suave hacia el fondo, unidas por una cinta fina (tubo) apagada; un nudo (toro) sobre la segunda; un arco bajo (dos postes y un dintel) tras la cuarta; una bolita de acento como marcador.
- **Efectos**: `paso { n }` (la losa n se enciende, sube 0,06, la cinta se dibuja hasta ella y el marcador la alcanza; en la 4 el marcador pasa bajo el arco) · `foco { n }` (aro que late sobre la losa n) · `aprieta` (el nudo de la losa 2 se estrecha al 70 %) · `abre` (el nudo se abre; no se usa en esta ficha).
- **Coste**: ≈ 3 mil triángulos, 8 llamadas; esfuerzo **S-M** (medio día-1 día).
- **Sirve también para**: toda enumeración por etapas (óctuple sendero, estadios de Kierkegaard, cualquier «proceso en pasos»).

#### 9.3.9 `cinta` (modelo, `objeto`)  · alienacion

- **Idea**: el proceso que organiza el trabajo, sin nadie dentro.
- **Parámetros**: `tam` (680-760), `ritmo` (0,6-1,8, 1). Anclas: `producto` (boca de salida), `como` (pupitre), `parte` (puesto).
- **Construcción**: peana carril (L 4,4 × Wd 1,4); la cinta es una caja larga y baja con dos rodillos en los extremos y una banda con marcas que avanzan; siete cajitas instanciadas que van de izquierda a derecha; a la derecha, una boca oscura (arco bajo); al fondo, un pupitre con una palanca.
- **Efectos**: `se-lleva` (la caja marcada en acento llega a la boca y desaparece; queda un hueco que no se rellena) · `manda` (la palanca se mueve sola y el ritmo pasa de 0,6 a 1,8 ×; un hilo tenue de acento sale del pupitre fuera de cuadro) · `horas` (las marcas de la banda pasan en gris) · `organiza` (hilos finos de acento salen del pupitre a cada caja y a la boca).
- **Coste**: ≈ 6 mil triángulos, ~8 llamadas; esfuerzo **M** (1 día).
- **Sirve también para**: producción y consumo, logística, burocracia, «el sistema».

#### 9.3.10 `figuras 'puesto'` (disposición con maniquí)  · alienacion

- **Idea**: una persona en su puesto: o hace algo entero (taller) o una parte repetida (cinta).
- **Parámetros**: `modo: 'taller' | 'cinta'` (taller), `tam` (560-720). Anclas: `producto`, `parte`, `pecho`.
- **Construcción**: peana carril; el maniquí (acento) con `pechoMaterial` (como `ritual`) detrás de un banco. En `taller`: un banco con tres piezas que encajan en un taburete que se ve acabado. En `cinta`: `crearCinta` (de 9.3.9) pasando por el puesto de derecha a izquierda, con un gesto cíclico de 1,2 s (coge, gira, deja).
- **Acciones**: `construye` (las tres piezas caen y encajan, 2,4 s) · `señala` (el maniquí señala la pieza con la palma y un aro de acento la rodea) · `revisa` (el gesto cíclico sobre cada caja) · `se-lleva` (la caja sale por la boca y no vuelve) · `vacia` (el pecho pasa de acento a arcilla en `dur` s) · `bien` (el pecho se enciende, el tronco se endereza, los brazos se relajan, mientras la cinta sigue llevándose cajas) · `etiqueta`.
- **Coste**: **M-L** (1,5 días: el gesto cíclico y el modo `taller`); ≈ 30 mil triángulos.
- **Riesgo**: que el gesto de revisar parezca un autómata ajeno; es la intención, pero hay que verlo con `gestos.mjs`.

#### 9.3.11 Resumen y reparto

| pieza | tipo | triángulos | llamadas | esfuerzo |
|---|---|---:|---:|:-:|
| N4 maniquí `detalle: 'bajo'` | núcleo | — | — | S |
| `torre` | modelo | 8 k | 8 | S-M |
| `tumbada`: `incorpora`, `yo` | acciones | — | — | S-M |
| `piezas` | modelo | 5 k | 12 | M |
| `hoja` | modelo | 2 k | 5 | S |
| `semana` | modelo | 7 k | 6 | M |
| `eco` | disposición | 30 k | 12 | M |
| `sujeta` | disposición | 24 k | 8 | M |
| `camino` | modelo | 3 k | 8 | S-M |
| `cinta` | modelo | 6 k | 8 | M |
| `puesto` | disposición | 30 k | 10 | M-L |

Total ≈ 9 días-persona. Reparto sin choques de ficheros, tras N4 (medio día): **A** `torre`, `tumbada`, `camino`, `hoja` (modelos pequeños y el durmiente) · **B** `piezas`, `semana` · **C** `eco`, `sujeta` (maniquí) · **D** `cinta`, `puesto` (en este orden: `puesto` usa `crearCinta`). Todo lo que renderiza va de uno en uno (§13.4). Cuatro de las diez piezas llevan maniquí, como en el 3b; el piloto recomendado es `las-cuatro-verdades` (`sujeta` + `camino`).

### 9.4 Riesgos del 3a

| riesgo | respuesta |
|---|---|
| `semana` se parece a `reloj` (3b), ambos son redondos | siete losas planas con una ficha que salta frente a una esfera con agujas; si en la hoja se confunden, subir la altura de las losas |
| Las copias de `eco` se parecen al `fantasma` de `ren-y-li` | copias sólidas y pálidas, no en aristas (9.3.6) |
| La torre de `duda-metodica` suena a «no se puede saber nada» | el reel termina en el bloque firme y la ficha ya lo dice en «Riesgos de rigor» |
| `incorpora` rompe la manta del durmiente | manta que cae al lado con desplazamiento fijo (9.3.2) |
| Demasiado maniquí (4 de 5) | igual que en el 3b; `tabula-rasa` queda sin ninguno |
| Un reel de 3a se publica a la vez que el 3b y se parece | no hay ningún propio común; se comprobó con el inventario de 9.3 |

## 10. Auditoría de las tandas 1-2 con §14 (F15a, propuesta para el humano)

Se han leído los 10 `escena.js` y las hojas de fotogramas que ya existen (se ha mirado la de `condicionamiento-operante` y coincide con el código). **No se ha rediseñado nada**: es una propuesta para decidir. Puntos de §14 comprobados (1 punto cada uno): ≥ 2 elementos propios · ≤ 3 usos de genéricas (`contraste`, `burbuja`, icono tubo, `medidor`) · ≤ 6 rótulos · ninguna pila de 3 · cronología del autor (§14.4).

### 10.1 Tabla

| reel | propios | genéricas (usos) | rótulos | cronología | pts | veredicto |
|---|---|---|---:|:-:|:-:|---|
| principio-del-dano | 3 (`puente` cruje/cruza, `grupo` con límite y ondas, `casco`) | contraste 1 (real), burbuja 1 | **7**, un 2×2 de 4 | sí | 3 | se queda; retoque barato |
| condicionamiento-operante | 1 (`movil` que recibe la notificación) | contraste 1 con **2 iconos tubo**, `medidor` curvas 1 | 6 | **no** | **2** | **rehacer** |
| wu-wei | 2 (durmiente `tiembla`/`duerme`, `piedra` `desgasta`) | `medidor` 1, burbuja 2 | 6 | sí | 5 | se queda |
| limite-del-placer | 2 (cuatro vasos que se beben y se apagan; monedas que crecen) | contraste 2, **`medidor` 3** | 2 | **no** | 3 | se queda; retoque |
| imperativo-categorico | 2 (`fila` que se cuela, `pareja` con hilo que se rompe) | contraste 1 (**no es real**), burbuja 2 | 4 | **no** | 4 | se queda; retoque |
| mala-fe | 2 (cortapapeles plano→sólido, `sola` con anillo y «SOY ASÍ») | **burbuja 3**, contraste 1 con peones, peón solo ×2 | 6 | **no** | 3 | **rehacer parcial** |
| significado-como-uso | 1 (el `movil` con mensaje que cambia de remitente) | burbuja 1, icono tubo 1 | **7, con una pila de 3** | sí | **2** | retoque fuerte |
| velo-de-la-ignorancia | 3 (`tarta`, `escalera` con velo y suelo, contraste real Rawls/Harsanyi) | contraste 1 (real) | 3 | **no** | 4 | se queda; solo cronología |
| critica-de-la-causalidad | 1 (`llama` toca/arde) | **contraste 3**, icono tubo 1 | 5 | sí | 3 | retoque |
| saber-que-no-se-sabe | 1 (el aro de la definición, `grupo` define/mete) | **burbuja 4**, contraste 1, peón pareja y grupo | 1 | sí | 3 | retoque (o rehacer parcial) |

Lo que resume las diez: contraste 11 usos en 8 reels, burbuja 13 usos en 6, `medidor` 5 usos en 3 (tres en un solo reel), iconos tubo 4 usos en 3, 47 rótulos (media de 4,7), un solo reel con maniquí. **Cronología: solo 5 de 10 la llevan** (principio-del-dano, wu-wei, significado-como-uso, critica-de-la-causalidad, saber-que-no-se-sabe). §14.4 la da por «de las tandas 1-2»; no es así. Les falta a condicionamiento-operante, limite-del-placer, imperativo-categorico, mala-fe y velo-de-la-ignorancia.

### 10.2 Qué rehacer, por prioridad

| prioridad | reel | qué se hace | piezas | coste |
|:-:|---|---|---|---|
| **1** | **condicionamiento-operante** | caja de Skinner: palanca, comedero y paloma; refuerzo continuo frente a intermitente, y qué pasa al quitar el premio. Fuera el contraste con iconos tubo y el `medidor` (las curvas de extinción las cuenta la propia caja). El móvil queda para el ejemplo | **nueva** `caja` (efectos `pica`, `premia`, `intermitente`, `extingue`; paloma de primitivas) ≈ 6 mil triángulos | M (1-1,5 días) |
| **2** | **mala-fe** | quitar las 3 burbujas y los peones: una persona de verdad (maniquí) con el cortapapeles; «soy así» como piedra que se le va poniendo encima; erguida con los amigos y encogida ante el jefe sin tarjetas | **nueva** `figuras 'persona'` (maniquí con poses nombradas `erguida`, `encogida`, y los efectos `anillo` y `piedra` de `sola`), reutilizable en `saber-que-no-se-sabe`; reutiliza `herramienta` | M (1 día) |
| **3** | **saber-que-no-se-sabe** | 4 burbujas → 2; el aro de la definición (`grupo define/mete`) como protagonista, con etiquetas ancladas; Sócrates como maniquí (`persona`) | `persona` (de mala-fe); opcional `escruta` (una lupa de vidrio recorre el grupo; S) | S (si ya está `persona`) |
| **4** | **significado-como-uso** | la pila de 3 rótulos (Promesa, Despedida, Amenaza) pasa a una sola píldora anclada al móvil que cambia con cada remitente; bajar los rótulos de 7 a 5 | ninguna (N2 ya existe en `objeto`) | S (medio día) |
| **5** | **critica-de-la-causalidad** | los dos contrastes que no son disputa (el hueco y el ascensor) se sustituyen por efectos de la llama; queda el contraste real al-Ghazali/Averroes | ninguna (opcional `domino` de cajas; S) | S |

### 10.3 Qué se queda

- **Se queda tal cual**: **wu-wei** (5/5; ya es de los más completos). Al rehacer **duda-metodica** el durmiente deja de repetirse (en 3a solo sale en el ejemplo).
- **Solo cronología (XS)**: velo-de-la-ignorancia (Rawls: 1921 → *Teoría de la justicia*, 1971, y hoy), imperativo-categorico (Kant 1724 → *Fundamentación*, 1785), limite-del-placer (Epicuro, 341 a. C. → hoy), mala-fe (Sartre 1905 → *El ser y la nada*, 1943), condicionamiento-operante (Skinner 1904 → hoy; entra con su rehacer). Las anclas hay que elegirlas en el guion de la escena `idea` de cada reel.
- **Retoque barato (S)**: principio-del-dano (el 2×2 de rótulos pasa a píldoras ancladas al `grupo`: queda en 4 rótulos); limite-del-placer (de 3 `medidor` a 1, y el contraste del gancho sale: queda el de los deseos, que sí es real); imperativo-categorico (fuera el contraste «Saldría mal / No se sostiene», que reparte una frase en dos tarjetas).

### 10.4 Coste total y lo que recomiendo

- **Mínimo (≈ 1,5 días)**: las cinco cronologías, los dos retoques de rótulos (principio, significado) y el de imperativo. Sin piezas nuevas. Es lo que arregla lo que el humano ya pidió (cronología) y las dos pilas.
- **Recomendado (≈ 3,5 días)**: lo anterior + **condicionamiento-operante** (`caja`) + **mala-fe** y **saber** (`persona`). Son los tres que hoy más se parecen al esqueleto repetitivo y los únicos con 1-2 puntos o 6-7 genéricas.
- **Completo (≈ 5 días)**: añade los retoques de critica y limite. No recomiendo rehacer wu-wei, velo ni principio.
- **Orden**: primero el 3a (esta tarea), luego el piloto del 3a, y los rehaceres de tandas 1-2 con el humano aprobando por reel, porque cada reel ya publicado tiene vídeo, pósters y web que se vuelven a generar con la voz en caché.
- **Decisión que necesito del humano**: si quiere (a) solo cronologías y retoques, (b) los tres rehaceres, o (c) todo. Y si `DECISIONES.md` §14.6 («los lotes 1, 2 y 3a no se rehacen») se reescribe para el 3a, que ya se rehace por este encargo; no lo he tocado porque tiene cambios sin guardar de otra persona.
