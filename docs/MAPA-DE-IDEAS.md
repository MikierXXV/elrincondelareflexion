# Mapa de ideas del recorrido

**Estado: las 59 fichas están redactadas y validadas.** Este documento es el índice del recorrido:
16 corrientes, 59 ideas. Cada idea es un fichero en `content/es/ideas/<id>.json` con pregunta,
cita, resumen, desarrollo, ejemplo real, matiz experto y visualización propia.

Comprobado con `node scripts/validate-content.mjs --completo`: integridad corriente ↔ idea ↔ autor,
orden sin huecos dentro de cada corriente, un único autor `principal` por idea, los 225 enlaces
transversales resueltos, límite de 15 palabras en las citas y presupuesto de técnica respetado.

Cambio estructural respecto a la fase 2: **el recorrido narra ideas, no autores.** Los autores
conservan sus fichas de 3 niveles y viven en los cromos; dentro de una idea aparecen como tira
compacta, y su ficha se abre superpuesta sin sacar al usuario del recorrido.

## Roles del autor dentro de una idea

| Rol | Significado |
|---|---|
| `principal` | La formula |
| `contrapunto` | La discute o la niega |
| `convergente` | Llega a algo equivalente por otra vía, a veces sin contacto |
| `desarrollo` | La extiende o la corrige |

Esto es lo que el modelo por autor no permitía expresar. Ver §"Ideas con varios autores".

## Criterio de técnica

La técnica **no se reparte por cuota, se elige por adecuación**. La pregunta no es cuál impresiona
más, sino cuál hace que la idea se entienda.

| Técnica | Cuándo | Cuántas |
|---|---|---|
| **SVG** | Ideas lógicas, relacionales, cuantitativas o temporales. Cada elemento es un nodo del DOM: enfocable, etiquetable, legible por lector de pantalla y tematizable con variables CSS | 47 |
| **Física** (canvas 2D) | La idea se entiende por inercia, oscilación, colisión o acumulación. La simulación *es* el argumento, no su decorado | 6 |
| **3D** (Three.js) | Solo si la comprensión depende de **profundidad, oclusión o punto de vista del observador**. Exige el campo `justificacion_3d`: hay que decir por qué no vale 2D | 6 |

Por qué la mayoría es SVG: **casi ninguna de estas ideas es espacial.** La vacuidad de Nāgārjuna es
una red de dependencias; la isostenia de Pirrón, un equilibrio de fuerzas; el término medio, un eje.
Meterlas en 3D les añade una dimensión que no tienen, y eso estorba: aparecen oclusiones, la
perspectiva distorsiona las magnitudes que hay que comparar, y el usuario acaba gestionando una
cámara en vez de pensando. Cuando alguien tiene que orbitar para ver bien, ha dejado de razonar
sobre el concepto.

Y por qué el tope de 6 escenas 3D **no es un problema de peso**: el hero ya carga Three.js por El
Pensador, así que la biblioteca (~150 KB comprimidos) está pagada y cada escena adicional apenas
descarga nada más. Lo que escala es memoria de GPU y, sobre todo, **tiempo de autoría**. Con 59
ideas, prefiero que todas estén bien pensadas a que seis estén espectaculares y el resto sean
genéricas. La restricción de rendimiento que de verdad importa es de runtime y ya está en el diseño:
**un solo contexto WebGL vivo a la vez**.

Las 6 plazas de 3D quedan **asignadas y llenas**. Añadir una séptima exige justificar por qué esa
idea concreta lo necesita, no vale "por si acaso".

---

## Bloque occidental

### ① Presocráticos · 3 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Flujo y permanencia | Heráclito | **Física** |
| 2 | La imposibilidad del cambio | Parménides | SVG |
| 3 | El número como orden del mundo | Pitágoras | **Física** |

### ② Filosofía clásica griega · 4 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Saber que no se sabe | Sócrates | SVG |
| 2 | El mundo de las Ideas | Platón | **3D** |
| 3 | El término medio | Aristóteles | SVG |
| 4 | El animal político | Aristóteles | SVG |

### ③ Helenismo · 4 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | La dicotomía del control | Epicteto `principal` · Marco Aurelio `desarrollo` | SVG |
| 2 | El límite del placer | Epicuro | **Física** |
| 3 | La suspensión del juicio | Pirrón | **Física** |
| 4 | La vista desde arriba | Marco Aurelio | **3D** |

### ④ Patrística y escolástica · 3 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | El tiempo existe en el alma | Agustín | SVG |
| 2 | El mal como privación | Agustín | SVG |
| 3 | Razón y fe, dos vías | Tomás de Aquino | SVG |

### ⑤ Racionalismo · 4 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | La duda metódica | Descartes | SVG |
| 2 | El problema mente-cuerpo | Descartes `principal` · Spinoza `contrapunto` | SVG |
| 3 | La libertad como comprensión de las causas | Spinoza | SVG |
| 4 | Razón suficiente y mundos posibles | Leibniz | SVG |

### ⑥ Empirismo británico · 5 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | La mente como página en blanco | Locke | SVG |
| 2 | La identidad personal | Locke `principal` · Hume `contrapunto` | SVG |
| 3 | Ser es ser percibido | Berkeley | **3D** |
| 4 | La causalidad como hábito | Hume `principal` · Al-Ghazali `convergente` | SVG |
| 5 | La ley de Hume: del ser al deber | Hume | SVG |

### ⑦ Ilustración e idealismo alemán · 5 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Contrato social y voluntad general | Rousseau | SVG |
| 2 | Las condiciones a priori | Kant | **3D** |
| 3 | El imperativo categórico | Kant | SVG |
| 4 | La dialéctica del reconocimiento | Hegel | SVG |
| 5 | La voluntad y el pesimismo | Schopenhauer `principal` · Hegel `contrapunto` | **Física** |

### ⑧ Utilitarismo · 3 ideas *(corriente nueva)*

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | El cálculo de la felicidad | Bentham | SVG |
| 2 | Placeres superiores | Mill `principal` · Bentham `contrapunto` | SVG |
| 3 | El principio del daño | Mill | SVG |

### ⑨ Marxismo · 3 ideas *(corriente nueva)*

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | La alienación | Marx | SVG |
| 2 | La ideología | Marx | SVG |
| 3 | El materialismo histórico | Marx | SVG |

### ⑩ Existencialismo y vitalismo · 4 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | La angustia como vértigo de la libertad | Kierkegaard | SVG |
| 2 | La genealogía de la moral | Nietzsche | SVG |
| 3 | El eterno retorno | Nietzsche | SVG |
| 4 | La mala fe | Sartre | SVG |

### ⑪ Filosofía analítica · 3 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Hablar de lo que no existe | Russell | SVG |
| 2 | Los límites del lenguaje | Wittgenstein | SVG |
| 3 | El significado es el uso | Wittgenstein | SVG |

### ⑫ Ética y política contemporánea · 3 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | El velo de la ignorancia | Rawls `principal` · Bentham `contrapunto` | **3D** |
| 2 | El principio de diferencia | Rawls | SVG |
| 3 | La banalidad del mal | Arendt | SVG |

---

## Bloque no occidental

### ⑬ Filosofía china clásica · 3 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Ren y li: el cultivo de sí | Confucio | SVG |
| 2 | Wu wei: la eficacia de no forzar | Laozi `principal` · Confucio `contrapunto` | **Física** |
| 3 | La relatividad de las perspectivas | Zhuangzi | **3D** |

### ⑭ Filosofía india · 4 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Atman y brahman | Upanishads/Vedanta | SVG |
| 2 | Las cuatro verdades | Buda | SVG |
| 3 | Anatman: el no-yo | Buda `principal` · Hume `convergente` · Upanishads `contrapunto` | SVG |
| 4 | La vacuidad | Nāgārjuna `principal` | SVG |

### ⑮ Filosofía islámica medieval · 3 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Esencia y existencia | Avicena `principal` · Tomás de Aquino `desarrollo` | SVG |
| 2 | La crítica de la causalidad | Al-Ghazali `principal` · Averroes `contrapunto` | SVG |
| 3 | Dos niveles de lectura | Averroes | SVG |

---

## Bloque psicología

### ⑯ Psicología del siglo XX · 5 ideas

| # | Idea | Autor(es) | Vis. |
|---|---|---|---|
| 1 | Lo inconsciente | Freud | SVG |
| 2 | La sombra | Jung `principal` · Freud `contrapunto` | SVG |
| 3 | El condicionamiento operante | Skinner | SVG |
| 4 | Aceptación y cambio | Rogers `principal` · Maslow `desarrollo` | SVG |
| 5 | La voluntad de sentido | Frankl `principal` · Nietzsche `convergente` | SVG |

---

## Recuento

| | |
|---|---|
| Corrientes | **16** (14 + utilitarismo + marxismo) |
| Ideas | **59** (3–5 por corriente, tal como se acordó) |
| Autores | **47** (44 + Bentham, Mill, Marx) |
| Visualizaciones | **59** = 47 SVG + 6 física + 6 3D |

### Las 6 escenas 3D y por qué lo son

Cada una tiene que superar la misma prueba: **¿se entiende igual en 2D?** Si la respuesta es sí, no
va en 3D. El campo `justificacion_3d` es obligatorio en el schema.

| Idea | Por qué no vale 2D |
|---|---|
| El mundo de las Ideas *(caverna)* | La posición de la luz respecto al objeto y al muro no ilustra la idea: **es** la idea. En 2D hay que dibujar la sombra correcta en vez de dejar que se produzca |
| Las condiciones a priori | Se mira **a través** de algo. Retirar una capa y ver que la escena deja de ser representable exige que haya un "a través" real |
| El velo de la ignorancia | El usuario cambia de posición dentro de una escena y ve lo mismo desde otro lugar. La ocultación de información es literalmente oclusión |
| La vista desde arriba | Alejarse por escalas hasta que la preocupación se reescala. La profundidad continua es el argumento entero |
| La relatividad de las perspectivas | Cambiar de observador **es** la tesis de Zhuangzi. Un cambio de cámara real dice lo que ninguna lista de etiquetas dice |
| Ser es ser percibido | El cono de percepción y lo que queda fuera de él es un problema de campo visual y oclusión, no de recorte plano |

### Las 6 de física

Ideas que se entienden por inercia, oscilación o acumulación, donde una animación guionizada mentiría
sobre el mecanismo:

| Idea | Qué simula |
|---|---|
| Flujo y permanencia | Partículas que se renuevan mientras la forma del cauce persiste |
| El número como orden | Ondas estacionarias reales en una cuerda: la consonancia se oye, no se afirma |
| El límite del placer | Recipientes que se llenan frente a uno sin fondo, con acumulación real |
| La suspensión del juicio | Una balanza con pesos: cada argumento arrastra su contrapeso y el equilibrio se produce solo |
| La voluntad y el pesimismo | Un péndulo entre dolor y hastío, con inercia: no se queda quieto en el medio |
| Wu wei | Agua sobre un terreno irregular: empujarla la desborda, retirar obstáculos la deja llegar más lejos |

## Ideas con varios autores

**14 de las 59** reúnen a más de un autor. Esto es lo que el modelo por autor no podía expresar, y
es donde el enfoque por ideas rinde más:

| Idea | Diálogo |
|---|---|
| La causalidad como hábito | Hume `principal` · **Al-Ghazali** `convergente` |
| Anatman: el no-yo | Buda `principal` · **Hume** `convergente` · Upanishads `contrapunto` |
| La voluntad de sentido | Frankl `principal` · **Nietzsche** `convergente` |
| El velo de la ignorancia | Rawls `principal` · Bentham `contrapunto` |
| La crítica de la causalidad | Al-Ghazali `principal` · Averroes `contrapunto` |
| Esencia y existencia | Avicena `principal` · Tomás de Aquino `desarrollo` |
| El problema mente-cuerpo | Descartes `principal` · Spinoza `contrapunto` |
| La identidad personal | Locke `principal` · Hume `contrapunto` |
| La sombra | Jung `principal` · Freud `contrapunto` |
| Wu wei | Laozi `principal` · Confucio `contrapunto` |
| La voluntad y el pesimismo | Schopenhauer `principal` · Hegel `contrapunto` |
| Placeres superiores | Mill `principal` · Bentham `contrapunto` |
| La dicotomía del control | Epicteto `principal` · Marco Aurelio `desarrollo` |
| Aceptación y cambio | Rogers `principal` · Maslow `desarrollo` |

Los casos que más justifican el cambio de modelo:

- **La causalidad como hábito** — Hume (s. XVIII) y **Al-Ghazali (s. XI)** llegan al mismo análisis
  sin contacto alguno, y divergen en la conclusión: uno funda un naturalismo escéptico, el otro la
  voluntad divina. Es el argumento más fuerte contra tratar la filosofía islámica como un anexo.
- **Anatman** — el Buda niega el yo sustancial; **Hume**, veintitrés siglos después y desde el
  empirismo, describe el yo como un haz de percepciones; y los **Upanishads** sostienen justo lo
  contrario dentro de la misma tradición india.
- **La voluntad de sentido** — Frankl construye su terapia sobre una frase de **Nietzsche**, a quien
  suele considerarse su opuesto.
- **El velo de la ignorancia** — solo se entiende contra el **utilitarismo** de Bentham, que es
  exactamente lo que Rawls quiere refutar. La corriente nueva no es un añadido: es el interlocutor
  que faltaba.
- **Esencia y existencia** — Avicena la formula y **Tomás de Aquino** la reelabora doscientos años
  después. La escolástica europea depende de la falsafa, y aquí se ve.

## Notas de redacción

- **`matiz_experto` en las 59.** Recoge lo que la visualización simplifica o la objeción principal, y
  mantiene la política de no presentar interpretaciones como hechos cerrados: el sesgo de
  supervivencia en Frankl, la reseña de Chomsky contra Skinner, la falsificación póstuma de
  Nietzsche, la ausencia de respaldo empírico a la jerarquía de Maslow, la revisión del caso Eichmann.
- **El ejemplo real es siempre una situación**, nunca una noticia ni una figura pública: el vuelo
  cancelado de Epicteto, colarse en la cola de Kant, mirar el móvil en Skinner, partir la tarta en
  Rawls. Envejecen bien y no trivializan la idea.
- **Un solo autor `principal` por idea.** El rol describe la relación con *la idea*, no con la
  corriente: Mill es `desarrollo` respecto a Bentham, pero `principal` de "Placeres superiores".
- **Ampliar el mapa es barato**: añadir una idea es un fichero JSON más y una línea en
  `corrientes.json`. El cupo de 3–5 por corriente lo vigila el validador.
- **Las 6 plazas de 3D están asignadas por criterio, no por cuota** (§Criterio de técnica). Si al
   prototipar alguna resulta que se entiende igual en 2D, baja y deja la plaza libre; si otra idea
   demuestra necesitar profundidad, sube con su `justificacion_3d` delante.
