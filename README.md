# El Rincón de la Reflexión

Recorrido interactivo por la historia de la filosofía —de los presocráticos al pensamiento
contemporáneo, incluyendo tradiciones no occidentales y psicología del siglo XX— con una
representación visual propia para la idea central de cada autor.

**Estado: fases 1, 2 y 3 completadas.** Contenido cerrado: **16 corrientes, 59 ideas, 47 autores.**

- [`docs/FASE-1-INVESTIGACION.md`](docs/FASE-1-INVESTIGACION.md) — criterios editoriales, citas y fuentes verificadas.
- [`docs/MAPA-DE-IDEAS.md`](docs/MAPA-DE-IDEAS.md) — las 59 ideas, sus autores y su técnica de visualización.
- [`docs/FASE-2-ARQUITECTURA.md`](docs/FASE-2-ARQUITECTURA.md) — navegación, wireframes, móvil vs desktop, rutas y carga.
- [`docs/FASE-3-DISENO.md`](docs/FASE-3-DISENO.md) — tipografía, color medido, componentes y lenguaje gráfico de las visualizaciones.

## Estructura

```
content/
  schema/            Schemas JSON (idea, autor, visualización, corrientes)
  es/                Original
    ui.json          Cadenas de interfaz
    corrientes.json  Corrientes, bloques, contexto, orden cronológico y sus ideas
    ideas/<id>.json    Unidad del recorrido: pregunta, cita, desarrollo,
                       ejemplo real, matiz experto y visualización
    autores/<id>.json  Ficha de autor para los cromos: 3 niveles + citas + fuentes
  en/                Mismos ficheros, mismos ids. El validador exige la paridad
plantilla/
  index.html         Plantilla única de la que se generan los HTML por idioma
scripts/
  validate-content.mjs  Validación sin dependencias, pensada para CI
  check-fuentes.mjs     Verificación HTTP de los enlaces de fuentes
  generar-html.mjs      Escribe index.html y en/index.html desde la plantilla
docs/
```

## Idiomas

Español en `/` e inglés en `/en/`, **con un documento HTML por idioma**. No es purismo de URLs: todo
el sitio se apoya en que el titular y la entradilla están en el documento antes de que cargue nada,
y si el inglés lo pusiera JavaScript, quien lo leyera vería el titular en español durante los
primeros cientos de milisegundos. Los dos HTML se generan de `plantilla/index.html`, así que no
pueden desincronizarse.

El texto visible vive siempre en `content/`, nunca en el código: las mecánicas reciben sus cadenas
en `visualizacion.parametros` y las doce piezas propias en `visualizacion.textos`. El validador
comprueba que las claves de rótulos coincidan entre idiomas, porque una que falte se monta como
`undefined` en un botón y no se nota hasta verlo en pantalla.

Cambiar de idioma conserva el hash, de modo que quien esté leyendo una idea concreta sigue en ella.
El sitio recuerda la elección solo si se pulsa el conmutador; nunca redirige por el idioma que
anuncia el navegador, porque eso rompería los enlaces compartidos.

Y el sistema de diseño:

```
design/
  tokens.json      Fuente de verdad: color, tipografía, espaciado, movimiento, trazo
  tokens.css       Variables CSS, temas claro/oscuro y reducción de movimiento
```

**El recorrido narra ideas; los autores viven en los cromos.** Una idea puede tener varios autores
con su papel (`principal`, `contrapunto`, `convergente`, `desarrollo`), lo que permite que la
convergencia entre Hume y Al-Ghazali sobre la causalidad, o entre el Buda y Hume sobre el no-yo, sea
estructura del sitio y no una nota al pie.

**El color se mide, no se afirma.** Cada corriente declara dos acentos —claro y oscuro— porque un
color calibrado para papel no funciona sobre fondo casi negro, y el checker rechaza el que no llegue
a 4.5:1 o se parezca demasiado en tono a otra corriente.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173/prototipos.html
npm run build    # valida contenido + contraste, tipa y compila
```

- `/` — **el sitio**: hero, recorrido de 16 paradas, widget, umbral y cromos.
- `/prototipos.html` — los tres prototipos de referencia, uno por técnica (desarrollo).
- `/galeria.html` — todas las visualizaciones juntas, para revisarlas de una pasada (desarrollo).

### Estructura del sitio

```
src/app/
  estado.ts        Fuente de verdad única: solo el observador de scroll escribe
  contenido.ts     Acceso a la capa de datos, con carga por corriente
  recorrido.ts     16 portadas + sus ideas, montaje diferido de visualizaciones
  widget.ts        Brújula persistente: corriente e idea, solo lee el estado
  cromos.ts        Umbral, camino de corrientes y rejilla de 47
  ficha-autor.ts   La única capa superpuesta
  rutas.ts         Enrutado por hash, con el autor colgando de su contexto
```

### Cómo se construyen las 59 visualizaciones

**Por mecánicas reutilizables, no una a una.** Una mecánica es un gesto de interacción
parametrizado por contenido; la ficha de la idea declara cuál usa y con qué parámetros, y el
registro despacha. Así el parecido de familia queda garantizado por construcción en lugar de
depender de la disciplina, y añadir una idea no toca código.

| Mecánica | Gesto | Ideas que ya cubre |
|---|---|---|
| `capas` | Retirar capas hasta el fondo | La duda metódica · Atman y brahman · La mente como página en blanco |
| `red` | Aislar un elemento de sus relaciones | La vacuidad · El animal político · La alienación · Anatman |
| `repeticion` | Repetir un suceso y buscar la conexión | La causalidad como hábito · La crítica de la causalidad · El condicionamiento operante |
| `recipientes` | Repartir y mirar los agregados | El límite del placer · El cálculo de la felicidad · El principio de diferencia |
| `dos-figuras` | Separar lo que debería coincidir | Aceptación y cambio · La sombra · La mala fe · El problema mente-cuerpo |
| `prueba` | Someter una propuesta a su propia consecuencia | El imperativo categórico · Saber que no se sabe · Del ser al deber · El eterno retorno · La imposibilidad del cambio |
| `linea-temporal` | Arrastrar hacia atrás y ver cambiar el signo | La genealogía de la moral · La ideología |
| `eje` | Situar un punto cuyo lugar correcto se desplaza | El principio del daño · Placeres superiores |
| `dos-capas` | Intervenir arriba o abajo y ver la asimetría | El materialismo histórico · Lo inconsciente · La libertad como comprensión |
| `descomponer` | Separar lo que parece una unidad | Hablar de lo que no existe · Esencia y existencia · Las cuatro verdades |
| `contexto` | Cambiar el marco sin tocar el elemento | El significado es el uso · Dos niveles de lectura |
| `cadena` | Recorrer paso a paso y luego mirar el conjunto | La banalidad del mal · Ren y li · El tiempo existe en el alma |
| `clasificar` | Repartir entre dos regiones que se resisten | La dicotomía del control · Los límites del lenguaje · Razón y fe |
| `margen` | Todo bloqueado salvo un hueco estrecho | La angustia como vértigo de la libertad · La voluntad de sentido |

Que ideas de tradiciones que no se conocieron compartan mecánica **es el argumento hecho
interfaz**. Hume y Al-Ghazali usan la misma porque están mirando lo mismo. Y Bentham y Rawls
reparten en los mismos recipientes: lo único que cambia es qué indicador se mira, que es
exactamente en lo que discrepan.

Dos detalles de diseño que hacen de esto argumentos y no adornos: en `dos-figuras` el usuario
**nunca puede empujar las figuras para juntarlas**, solo quitar condiciones —convergen solas, que
es la tesis de Rogers—; y en `recipientes` el recipiente sin fondo **no sube de nivel** por mucho
que se le eche.

### Piezas propias

Son la excepción, no el caso general. Hoy son siete, y cada una está ahí por un motivo concreto:

| Pieza | Técnica | Por qué no encaja en una mecánica |
|---|---|---|
| El término medio | SVG | Su zona de acierto además se estrecha con la práctica, y eso solo significa algo en su idea |
| La suspensión del juicio | Física | Balanza con inercia: el equilibrio se produce, no se dibuja |
| Flujo y permanencia | Física | Partículas transitorias dentro de un cauce que es una restricción del sistema |
| El número como orden | Física | Ondas estacionarias reales, con audio opcional: la consonancia se oye |
| Wu wei | Física | Fluido sobre terreno: empujarlo lo desborda, retirar obstáculos lo deja llegar |
| La voluntad y el pesimismo | Física | Mismo integrador que la balanza de Pirrón y tesis opuesta: empujar añade energía |
| El mundo de las Ideas | 3D | La sombra se produce sola en vez de dibujarse |
| Las condiciones a priori | 3D | Se mira *a través* de capas con profundidad efectiva |
| La vista desde arriba | 3D | Alejamiento continuo, sin cortes ni saltos de escala |
| La relatividad de las perspectivas | 3D | Hay que ocupar de verdad la posición de cada observador |
| Ser es ser percibido | 3D | Campo visual y oclusión real desde dentro de la escena |
| El velo de la ignorancia | 3D | Ocupar un lugar concreto y no poder ver el resto |

Las cuatro simulaciones de física no comparten mecánica porque cada una necesita su propio
integrador. Las seis escenas 3D comparten el andamiaje de `escena3d.ts` —renderer, respaldo
estático, proporción del hueco y **liberación real del contexto WebGL**— para que la regla de un
solo contexto vivo a la vez no dependa de que nadie se olvide. Todas comparten marco, trazo, paleta
de tres roles y estado de resolución con las demás.

Medición real del primer build:

| Chunk | Sin comprimir | Gzip |
|---|---|---|
| JS crítico | 28,3 kB | **11,5 kB** |
| CSS | 5,7 kB | 1,9 kB |
| Three.js (diferido) | 684 kB | 175,8 kB |

Three.js va en su propio chunk con `import()` dinámico: no entra en el JS crítico y solo lo descarga
quien abre una de las 6 ideas en 3D.

## La figura del hero, y una regla que se cambió a propósito

El encargo original decía que los assets 3D debían ser **geometría propia**, nunca un escaneo de
terceros. La figura del hero se construyó así durante un tiempo, y se leía como una figura
articulada, no como una talla. Se cambió la regla de forma deliberada, y se sustituyó por otra más
estricta en lo que de verdad protege: **la licencia se verifica y se declara**.

- La escultura es de dominio público — Rodin murió en 1917. Lo que se licencia es el **escaneo**,
  que es obra distinta.
- Solo se aceptaban CC0 o CC-BY. Se descartó la versión de Scan the World por ser **CC BY-SA**, que
  obligaría a redistribuir la malla derivada bajo copyleft.
- Origen, autor, licencia y **las modificaciones hechas** —que CC BY exige declarar— están en
  [`assets/CREDITOS.md`](assets/CREDITOS.md). La atribución aparece además en el pie del sitio.
- El procedimiento no se documenta en prosa sino en [`scripts/preparar-pensador.mjs`](scripts/preparar-pensador.mjs):
  una lista de comandos en un README se desincroniza del fichero real; un script no.

Del escaneo se conserva **solo la geometría**. Sus texturas eran fotogrametría —el bronce real bajo
la luz de aquel día— y competían con la iluminación de la escena en vez de sumarse a ella. El
material y las luces son propios, y son lo que hace que la pieza pertenezca a este sitio.

| | |
|---|---|
| Original | 50 974 triángulos, 4,6 MB, tres texturas |
| Publicado | 25 486 triángulos, **165 kB**, sin texturas, comprimido con meshopt |

El hueco no se queda en blanco mientras llega: lo ocupa una silueta extraída de la propia malla, que
se dibuja sola y se funde al montarse la escena. No pretende ser un retrato —se probaron seis
direcciones y el contorno de esta figura no es reconocible por sí solo— sino sostener la forma y dar
señal de progreso. Es además el respaldo permanente sin WebGL y con movimiento reducido.

## Validar el contenido

```bash
node scripts/validate-content.mjs             # estructura (offline, rápido)
node scripts/validate-content.mjs --completo  # además exige que no falte ninguna ficha (CI)
node scripts/check-fuentes.mjs                # enlaces de fuentes por HTTP
node scripts/check-contraste.mjs              # paleta contra WCAG AA en ambos temas
node scripts/check-contraste.mjs --sugerir    # propone el color más cercano que sí pasa
```

El primero comprueba schema, integridad referencial en ambos sentidos (corriente ↔ idea ↔ autor),
unicidad de ids, orden sin huecos dentro de cada corriente, un único autor `principal` por idea,
los enlaces transversales entre ideas, longitudes por nivel, límite de palabras en las citas,
presupuesto de técnica y paridad entre idiomas.

Sin `--completo`, una idea mapeada pero aún sin redactar es un aviso: durante la escritura, decenas
de errores idénticos impedirían ver los de verdad. En CI se pasa `--completo` y entonces sí falla.

El segundo verifica las URLs de las fuentes y separa OK / redirigida / rota / sin comprobar. Solo las
rotas hacen fallar el build: una redirección es un aviso y la falta de red no debe romper CI.
Estado actual: **99/99 OK**.

## Principios de la capa de datos

- **El contenido no toca código.** Añadir una corriente del backlog (filosofía africana,
  postestructuralismo, psicología social…) es añadir ficheros JSON, no modificar componentes.
- **Carga por nivel.** `nivel_1_resumen` entra en el bundle inicial (alimenta los cromos);
  `nivel_2_desarrollo`, `nivel_3_experto` y la visualización se cargan bajo demanda por autor.
- **La técnica se elige por adecuación, no por cuota.** SVG para ideas lógicas y relacionales,
  canvas con física cuando la simulación *es* el argumento, y Three.js solo si la comprensión depende
  de profundidad, oclusión o punto de vista — con `justificacion_3d` obligatoria que explique por qué
  no vale 2D. El validador lo exige.
- **La visualización es parte de la ficha**, no un adorno posterior: cada `descripcion_interaccion`
  tiene que responder a qué hace el usuario y qué comprende al hacerlo, y cada `alternativa_textual`
  a qué demuestra la interacción para quien no puede usarla.
