# Fase 3 — Sistema de diseño

Entregable: tipografía, color, espaciado, movimiento, componentes y —lo más importante— el **lenguaje
gráfico común** que hace que 59 visualizaciones distintas se sientan del mismo sistema.

Los valores viven en [`design/tokens.json`](../design/tokens.json) y
[`design/tokens.css`](../design/tokens.css). El color está **verificado, no afirmado**:
`node scripts/check-contraste.mjs` → **44/44 en WCAG AA, en ambos temas**.

---

## 1. Color

### 1.1 El dark mode no es invertir

Era la advertencia del análisis de diseño y la medición la confirmó. Al comprobar la paleta original
—un solo acento por corriente— fallaron **19 de 40** comprobaciones, casi todas en tema oscuro: un
color calibrado para leerse sobre papel pierde contraste al ponerlo sobre un fondo casi negro.

La consecuencia estructural es que **cada corriente declara dos acentos**, no uno:

```json
"color_acento": { "claro": "#7C5ACB", "oscuro": "#8F72D2" }
```

El schema lo exige y el checker lo comprueba. Los 32 valores están generados manteniendo tono y
saturación y ajustando solo la luminosidad hasta **4.8:1**, con margen deliberado sobre el 4.5 que
pide la norma para que un retoque posterior no rompa el cumplimiento.

### 1.2 Los 16 acentos

Repartidos por la rueda de tono en orden cronológico, con **separación mínima de 15°**. La primera
paleta tenía cinco pares indistinguibles —escolástica y filosofía india coincidían exactamente— y
un color que no orienta solo decora.

| # | Corriente | Claro | Oscuro | Tono |
|---|---|---|---|---|
| 1 | Presocráticos | `#A65B29` | `#C36B31` | 24° |
| 2 | Clásica griega | `#3270BC` | `#4884CE` | 213° |
| 3 | Helenismo | `#277D60` | `#2E9271` | 160° |
| 4 | Escolástica | `#876B24` | `#9F7E2A` | 43° |
| 5 | Racionalismo | `#7C5ACB` | `#8F72D2` | 258° |
| 6 | Empirismo | `#277791` | `#2E8CAC` | 195° |
| 7 | Ilustración e idealismo | `#C93C2F` | `#D65B50` | 5° |
| 8 | Utilitarismo | `#5F7726` | `#708D2C` | 78° |
| 9 | Marxismo | `#BD3F7E` | `#C95D93` | 330° |
| 10 | Existencialismo | `#AD40B5` | `#BE5AC5` | 296° |
| 11 | Analítica | `#5A69B8` | `#727EC2` | 231° |
| 12 | Ética y política | `#2C7D4E` | `#34945C` | 145° |
| 13 | Filosofía china | `#C63C53` | `#D05D70` | 350° |
| 14 | Filosofía india | `#72721E` | `#878724` | 60° |
| 15 | Filosofía islámica | `#247B78` | `#2A918D` | 178° |
| 16 | Psicología s. XX | `#9253BC` | `#A26CC6` | 276° |

### 1.3 Base de cada tema

Ni blanco ni negro puros. El fondo claro es un blanco cálido de papel; el oscuro, un gris con una
gota de violeta. El texto tampoco llega a los extremos: reduce el deslumbramiento en claro y evita
el halo en pantallas OLED en oscuro.

| Rol | Claro | Oscuro |
|---|---|---|
| Fondo | `#FBFAF8` | `#141317` |
| Texto | `#1A1917` | `#EDEBE6` |
| Texto secundario | `#5C5850` | `#A8A39A` |
| Separador | `#DDD9D1` | `#2E2C34` |
| Borde interactivo | `#7A736A` | `#6E6979` |

Una distinción que el checker toma en serio: **`separador` está exento de contraste y
`borde_interactivo` no**. WCAG 1.4.11 exige 3:1 al borde solo cuando es el único indicador del
componente; forzar una línea divisoria decorativa a 3:1 la convertiría en un tajo. Los bordes que sí
delimitan controles se comprueban.

### 1.4 Cómo se usa el acento

Con moderación deliberada. El acento **no tiñe el fondo de la sección**: aparece en la etiqueta de
corriente, en el marcador activo del widget, en el trazo de énfasis de la visualización y en una
banda fina. Todo lo demás es neutro. Si el acento se derrama por la pantalla, el minimalismo se
pierde y las 16 corrientes acaban pareciendo 16 temas distintos en vez de 16 paradas del mismo
recorrido.

Los tintes se derivan en runtime con `color-mix(in oklab, ...)`, nunca se declaran a mano.

---

## 2. Tipografía

Dos familias, **tres pesos en total** para todo el sitio. No hay negrita 700 ni light 300: el
contraste tipográfico se consigue con tamaño y espacio, no añadiendo pesos.

| Uso | Familia | Peso |
|---|---|---|
| Títulos, citas, cifras del hero | **Newsreader** (serif variable) | 400 / 600 |
| Texto, interfaz, etiquetas | **Inter** (sans variable) | 400 / 500 |

Ambas con licencia SIL OFL, variables, subseteadas a latin + latin-ext y servidas en woff2 **desde el
propio dominio**: ninguna petición a terceros, ni por rendimiento ni por privacidad.

La escala es fluida con `clamp()`, de `--t-micro` a `--t-hero`. Dos medidas de línea, y la diferencia
entre ellas es intencionada:

- **Texto: 68ch.** Lo cómodo para leer un párrafo.
- **Cita: 34ch.** La mitad. Obliga a que la frase se lea como una unidad y no como un párrafo más.

---

## 3. El lenguaje gráfico de las 59 visualizaciones

El análisis de diseño avisaba: con una metáfora visual por idea, 59 piezas pueden acabar pareciendo
59 proyectos distintos. Estas son las reglas que las cosen, y todas son verificables.

### 3.1 Regla de tres colores

Cada visualización usa **exactamente tres roles de color, nunca más**:

1. **Neutro** — la estructura, el andamiaje, lo que no está en juego. `--texto-secundario`.
2. **Acento de su corriente** — el elemento sobre el que actúa el usuario.
3. **Una señal semántica** — lo que responde a su acción. Una sola por pieza.

Ningún degradado, con una excepción declarada: las fuentes de luz de la caverna de Platón y de las
condiciones a priori de Kant, donde el degradado *es* el fenómeno.

### 3.2 Un solo grosor de trazo

`--trazo-base: 1.5` para todo, `--trazo-enfasis: 3` para lo que está activo. Nada más. Remates y
uniones redondeados, y siempre `vector-effect: non-scaling-stroke` para que al escalar el SVG el
trazo no engorde.

### 3.3 Todas entran igual

La entrada es idéntica en las 59, y ese es justamente el punto:

1. El trazo se dibuja solo, `--m-trazo` (900 ms), con `stroke-dasharray`.
2. Los elementos manipulables aparecen después, `--m-medio`, escalonados 60 ms.
3. Un único pulso de afordancia sobre el primer elemento interactivo. **Uno, y no se repite.**

### 3.4 Lo que se puede tocar se ve igual siempre

Contorno discontinuo de 1.5 y cursor `grab`. En las 59. Un usuario que ha entendido una visualización
sabe leer las otras 58 sin instrucciones, y eso vale más que cualquier tutorial.

### 3.5 Estado de resolución

Cada visualización tiene un estado que señala "has entendido la idea", y se marca de la misma forma
en todas: la escena se asienta, cesa el movimiento residual y aparece una línea de texto. No hay
puntuación, ni felicitación, ni sonido. La recompensa es la comprensión.

### 3.6 Bajo `prefers-reduced-motion`

No se apaga la animación: **se lleva a su estado final**. Toda visualización debe ser legible y
manipulable sin movimiento, y ninguna puede perder contenido por desactivarlo. Se suma a la
`alternativa_textual` obligatoria de cada ficha, que el validador ya exige.

---

## 4. Componentes

### 4.1 Cromo

```
┌──────────────────┐   Cita: Newsreader 400, --t-medio, 34ch, centrada
│ ❝                │   vertical. La tarjeta tiene ALTURA FIJA y el tamaño
│  Ser es ser      │   de la cita responde a su longitud: van de 3 palabras
│  percibido. ❞    │   ("Tú eres eso") a 15 (Jung), y una rejilla de alturas
│                  │   desiguales sería el ruido visual que evitamos.
│ ──────────────── │   ← separador, no borde
│ GEORGE BERKELEY  │   Inter 500, --t-pequeno, versalitas
│ Empirismo        │   Inter 400, --t-micro, color de acento
│ 1685–1753        │   Inter 400, --t-micro, texto-secundario
└──────────────────┘
```

Cuatro niveles tipográficos con **tres pesos y dos familias**. La cita manda porque es lo que hace
que una rejilla de 47 tarjetas invite a detenerse.

### 4.2 Tira de autor

Fondo `--fondo-hundido`, sin sombra: se lee como incrustada en la idea, no flotando sobre ella. El
rol (`principal`, `contrapunto`, `convergente`, `desarrollo`) va como etiqueta en `--t-micro` con el
acento de la corriente **del autor**, no de la idea. Es lo que hace visible de un vistazo que
Al-Ghazali viene de otra tradición que Hume.

### 4.3 Marca de atribución

Las 7 citas no literales llevan un `ⓘ` discreto que despliega la nota. **No es una advertencia**: no
atenúa la cita, no la tacha, no la precede. La frase se lee igual de bien y quien quiera saber de
dónde sale, lo pulsa.

### 4.4 Bloque "En disputa"

Nivel 3. Filete vertical de 3 px en `--borde-interactivo` —neutro, no de alarma— y fondo hundido. El
tono importa: no señala un error, señala que la comunidad académica sigue discutiéndolo.

### 4.5 Iconografía de corriente

Un glifo geométrico por corriente, construido con las mismas reglas de trazo: círculo, línea y
ángulo, sin ilustración figurativa ni símbolos religiosos o nacionales. Se dibujan sobre una rejilla
de 24 px y funcionan a 16 px en el widget.

---

## 5. Decisiones que cierran la fase 2

1. **Contraste de los 16 acentos** — resuelto y medido. 44/44.
2. **Columnas de la rejilla de cromos** — **5 en pantallas grandes**, no 6. Con 47 autores dan 10
   filas, y una tarjeta cuyo cuerpo es una cita necesita anchura para no partir la frase en cinco
   líneas. Por debajo: 4 / 3 / 2 / 1.
3. **Hero 3D en móvil** — se carga solo si el dispositivo pasa la detección de capacidad; si no,
   imagen estática. La medición real va en la fase 5, pero el diseño no depende de ella: el texto se
   renderiza antes y no espera al 3D.
4. **Escenas Three.js** — 6, asignadas por criterio y con `justificacion_3d` obligatoria.

---

## 6. Prototipos de referencia: construidos y verificados

Los tres están en `src/vis/` y se revisan juntos en `prototipos.html`. La verificación no fue a ojo:
`npm run capturar` levanta Chromium con Playwright, ejercita las tres piezas hasta su estado de
resolución y captura cuatro escenarios —claro, oscuro, móvil y `prefers-reduced-motion`—, recogiendo
además errores de consola.

| Prototipo | Técnica | Qué puso a prueba |
|---|---|---|
| El término medio (Aristóteles) | SVG | Manipulación directa, estado de resolución |
| La suspensión del juicio (Pirrón) | Canvas con física | Que la simulación se sienta del mismo sistema que el SVG |
| El mundo de las Ideas (Platón) | Three.js | Iluminación con carácter en ambos temas, y el fallback 2D |

### Defectos que la revisión visual encontró

Ninguno de estos se veía en el build, que compilaba y tipaba limpio. Es la justificación entera de
esta fase.

1. **La cámara estaba donde el prisionero no está.** La escena mostraba los objetos y el muro a la
   vez desde el primer fotograma, así que el usuario nunca llegaba a tomar las sombras por la
   realidad — que es el argumento completo. La `justificacion_3d` prometía un descubrimiento que la
   escena no producía.
2. **No se proyectaba ninguna sombra.** Con la hoguera por encima de los objetos, las sombras caían
   al suelo y el muro quedaba liso. La luz tiene que ir por debajo.
3. **Sombras magnificadas 3,3×**, ilegibles. El factor es la razón entre las distancias
   hoguera→muro y hoguera→objetos; se ajustó a 2,5×, que las mantiene imponentes y reconocibles.
4. **La balanza no llegaba a detenerse.** Relación de amortiguamiento 0,30: tardaba casi cinco
   segundos en bajar del umbral de calma, y la pieza afirma que "se detiene sola cuando dejas de
   empujar". Subida a 0,57, se asienta en menos de dos.
5. **El arrastre del SVG se perdía** al salir el cursor del círculo de 13 px. Los listeners pasaron
   a `window` y ahora también se puede pulsar directamente sobre el eje.

### Conclusión sobre el lenguaje gráfico

**SVG y física son inequívocamente de la misma familia**: mismo trazo, misma superficie, mismo
estado de resolución, y aguantan igual de bien en claro y en oscuro.

**El 3D pertenecía a otro registro, y se resolvió con "marco común, interior propio".** El
diagnóstico inicial exageraba el problema: en el banco de pruebas la escena 3D ocupaba la fila
entera mientras las otras dos iban a media anchura, y esa diferencia era del banco, no del sistema
—en el producto cada idea tiene su propia pantalla y ninguna se ve junto a otra—.

Lo que sí faltaba era una regla, y ahora existe: **`--vis-proporcion` fija un único hueco (7:3) para
las 59 piezas, sea cual sea la técnica.** El marco es lo que crea la familia. Dentro de él, cada
pieza hace lo suyo, y las escenas 3D conservan su atmósfera: en la caverna y en las condiciones a
priori la luz **es** el fenómeno, así que enfriarla habría dañado la comprensión y no solo el
aspecto. Sigue siendo la excepción de color declarada en §3.1, ahora acotada por el encuadre.

### Verificado además

- Bajo `prefers-reduced-motion` las tres piezas muestran su estado final con su texto de resolución,
  y la 3D cae al respaldo estático. **No se pierde contenido en ningún caso.**
- Sin errores de consola ni excepciones en los cuatro escenarios.
