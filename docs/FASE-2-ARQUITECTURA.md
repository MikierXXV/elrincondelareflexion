# Fase 2 — Arquitectura de información y UX

Entregable de la fase 2: estructura de navegación, wireframes, comportamiento móvil/desktop y modelo
de estado. Todavía sin diseño visual (fase 3) ni implementación (fase 4).

Parte del contenido cerrado en la fase 1: **16 corrientes, 59 ideas, 47 autores, 3 niveles por ficha**.

---

> **Revisión: el recorrido narra ideas, no autores.** El contenido demostró que el autor era un
> envase que no encajaba: ocho fichas metían dos ideas en una sola visualización (Aristóteles,
> Locke, Nietzsche, Wittgenstein…) y varias ideas de primer orden se quedaban sin representar
> porque su autor ya había "gastado" la suya —Kant tenía las condiciones a priori pero no el
> imperativo categórico—. Los autores conservan su ficha de 3 niveles y viven en los cromos.
> Ver [`MAPA-DE-IDEAS.md`](MAPA-DE-IDEAS.md): **16 corrientes, 59 ideas, 47 autores**.

## 0. El problema de fondo: el recorrido no puede crecer con el catálogo

Ni 47 autores ni 59 ideas caben como paradas de un scroll lineal. La decisión estructural es separar
**longitud** de **profundidad** en tres niveles, no en dos:

| Eje | Qué contiene | Cuánto ocupa |
|---|---|---|
| **Longitud** (scroll vertical) | Una parada por corriente | 16 paradas, acotado |
| **Anchura** (sub-navegación dentro de la parada) | Las 3–5 ideas de esa corriente | No alarga el recorrido |
| **Profundidad** (capa superpuesta) | Ficha del autor: 3 niveles | No consume scroll |

El scroll narra **el arco histórico**; las ideas son el contenido de cada parada; los autores se
asoman desde dentro de una idea. Un visitante que solo desliza recorre 16 corrientes. Uno que se
interesa por una corriente recorre sus ideas sin que eso alargue el camino para los demás.

Consecuencias directas: **el scroll nunca se secuestra**, ninguna idea puede "empujar" el recorrido
hacia abajo, y **nunca se navega fuera del recorrido desde una idea** (§2.4).

---

## 1. Mapa del sitio

```
┌─ HERO ────────────────── El Pensador 3D. Qué es esto. Dos entradas:
│                          "Recorrer las ideas" · "Ir a los cromos"
│
├─ RECORRIDO ───────────── 16 paradas (corrientes), orden cronológico, 3 bloques
│   ├── ① Presocráticos ──── ideas: flujo · imposibilidad del cambio · el número
│   ├── ② Clásica griega ─── ideas: saber que no se sabe · las Ideas★ · término
│   │                               medio · animal político
│   ├── …
│   ├── ⑧ Utilitarismo ───── NUEVA
│   ├── ⑨ Marxismo ──────── NUEVA
│   ├── ⑬ Filosofía china ── marcada como cronología paralela
│   └── ⑯ Psicología s. XX ─ ideas: lo inconsciente · la sombra · …
│
├─ UMBRAL ──────────────── Cambio explícito de modo de explorar
│
└─ CROMOS ──────────────── Los 47 autores. Camino de corrientes interactivo arriba.
                           Al señalar un cromo, se ilumina su punto en el camino.

    ▓ WIDGET ───────────── Persistente. Muestra corriente E idea dentro de ella.
    ▓ FICHA DE AUTOR ───── Capa superpuesta. Se abre DESDE una idea o DESDE un cromo,
                           y siempre devuelve al sitio del que salió.

★ = visualización Three.js (6, asignadas por criterio: la idea depende de
    profundidad, oclusión o punto de vista. Ver MAPA-DE-IDEAS.md)
```

---

## 2. Wireframes

### 2.1 Hero (desktop)

```
┌──────────────────────────────────────────────────────────────────────┐
│  El Rincón de la Reflexión                          ES/EN   ☾/☀     │
│                                                                      │
│                                    ╭─────────╮                       │
│   Veinticinco siglos de            │         │                       │
│   preguntas que todavía            │  ╭───╮  │   ← Three.js          │
│   no están cerradas.               │  │   │  │     geometría propia  │
│                                    │ ╭┴───┴╮ │     baja poligonal    │
│   59 ideas · 16 corrientes         │ │     │ │                       │
│   47 pensadores                    ╰─┴─────┴─╯                       │
│   Occidente, China, India, el                                        │
│   mundo islámico y la psicología                                     │
│   del siglo XX.                                                      │
│                                                                      │
│   [ Recorrer las ideas ]  [ Ver los cromos ]                         │
│                                                                      │
│                          ⌄ desliza                                   │
└──────────────────────────────────────────────────────────────────────┘
```

El texto se renderiza **antes** que la escena 3D y no depende de ella. Si el 3D no carga (o hay
`prefers-reduced-motion`, o la detección de GPU falla), su hueco lo ocupa una imagen estática y el
resto de la página es idéntico. La segunda entrada, "Ver los cromos", existe porque no todo el mundo
quiere una narración: algunos vienen a buscar a un autor concreto.

### 2.2 Parada de corriente: la portada

Cada corriente abre con una portada breve que da contexto y **anuncia sus ideas**. No es una pantalla
de paso: es donde el usuario decide si entra a fondo o sigue.

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                              ┌─────┐ │
│  ⑦  ILUSTRACIÓN E IDEALISMO ALEMÁN                           │ ▮ 5 │ │
│      s. XVIII–XIX · Francia, Prusia, Suiza                   │ ▮ 6 │ │
│      ─────────────────────────────────────────               │ ▶ 7 │ │
│                                                              │ ▯ 8 │ │
│      ¿Qué podemos conocer, qué debemos hacer                 │ ▯ 9 │ │
│      y qué mueve realmente al ser humano?                    │ ▯10 │ │
│                                                              │ ─── │ │
│      La confianza ilustrada en la razón convive con dos      │ ▯13 │ │
│      golpes: la constatación de que el conocimiento tiene    │ ▯14 │ │
│      límites estructurales y la sospecha de que la           │ ▯15 │ │
│      civilización no ha hecho mejores a los humanos.         │ ─── │ │
│                                                              │ ▯16 │ │
│      5 ideas en esta corriente                               └─────┘ │
│      ①  Contrato social y voluntad general      Rousseau             │
│      ②  Las condiciones a priori           ★    Kant                 │
│      ③  El imperativo categórico                Kant                 │
│      ④  La dialéctica del reconocimiento        Hegel                │
│      ⑤  La voluntad y el pesimismo              Schopenhauer         │
│                                                                      │
│      ⌄ entrar en las ideas          saltar a ⑧ Utilitarismo →        │
└──────────────────────────────────────────────────────────────────────┘
```

**Las dos salidas están a la vista desde el principio.** Esto es lo que hace que 16 corrientes × 5
ideas no resulten agobiantes: quien quiere la panorámica salta de portada en portada y termina el
recorrido en 16 pantallas; quien se engancha con una corriente entra y recorre sus ideas.

Las corrientes no occidentales (⑬–⑮) llevan aquí el distintivo de **cronología paralela**: una regla
temporal que muestra con qué tramo occidental coinciden. Sin eso, ponerlas después de Arendt en un
eje vertical sugiere que son posteriores, y no lo son.

### 2.3 Parada de idea

La unidad real del recorrido. Una pantalla por idea.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⑦ Ilustración e idealismo alemán · idea ③ de 5           ┌─────┐   │
│                                                            │ ▶ 7 │   │
│  EL IMPERATIVO CATEGÓRICO                                  │ ●●○○ │   │
│  ¿Cómo saber si algo que voy a hacer está bien?            └─────┘   │
│                                                                      │
│  ❝ Obra solo según aquella máxima que puedas querer                  │
│    como ley universal. ❞                                             │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │   [ escribe lo que vas a hacer ]                               │  │
│  │                                                                │  │
│  │   "prometer algo sin intención de cumplirlo"                   │  │
│  │            ↓  universalizar  ↓                                 │  │
│  │   Todo el mundo lo hace  →  la promesa deja de significar      │  │
│  │   nada  →  tu propia acción se vuelve imposible                │  │
│  │                                              ⚠ se autodestruye │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Kant no pregunta por las consecuencias sino por la forma de la      │
│  regla: si al convertirla en ley para todos se destruye a sí         │
│  misma, no podía ser una regla moral…                                │
│                                                                      │
│  ┌── En la vida real ──────────────────────────────────────────┐     │
│  │  Colarte en una cola cuando tienes prisa. Lo que hace que    │     │
│  │  funcione es justamente que los demás no lo hagan.           │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │ ◐ IMMANUEL KANT · 1724–1804 · Idealismo alemán               │    │
│  │   Formula la prueba de universalización.          ver ficha → │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ‹ ② Condiciones a priori        ④ Dialéctica del reconocimiento ›   │
│                              saltar a ⑧ Utilitarismo →               │
└──────────────────────────────────────────────────────────────────────┘
```

Orden deliberado: **pregunta → cita → visualización → explicación → ejemplo real**. Se entra por la
pregunta, la frase da acceso inmediato, la visualización hace la idea manipulable, el texto la
precisa y el ejemplo la aterriza. Quien solo lee la cita ya se lleva algo.

La visualización se instancia al entrar en la idea y **se destruye al salir**. Esta es la restricción
de rendimiento que de verdad importa —**un solo contexto WebGL vivo a la vez**, y un solo bucle de
simulación—, muy por encima de cuántas escenas 3D haya en el catálogo: el hero ya carga Three.js, así
que la biblioteca está pagada y lo que cuesta es tenerlas *activas*, no tenerlas.

Tres técnicas, elegidas por adecuación a la idea y no por espectacularidad (§MAPA-DE-IDEAS):
**SVG** para lo lógico y relacional (47), **canvas con física** cuando la simulación es el argumento
(6), **Three.js** solo cuando la comprensión depende de profundidad, oclusión o punto de vista (6).

**Regla del ejemplo real:** es siempre una *situación*, nunca una noticia, una figura pública ni una
referencia de actualidad. Lo primero envejece bien; lo segundo caduca y trivializa la idea.

### 2.4 La tira de autor: cómo se cita sin romper el hilo

Este es el punto donde la navegación se puede romper, y la regla es una sola:

> **Nunca se navega desde una idea. El autor se asoma encima.**

La tira compacta da lo justo —nombre, fechas, corriente y **qué aporta exactamente a esta idea**— sin
sacar a nadie de ningún sitio. Si el usuario pulsa "ver ficha", la ficha del autor se abre
**superpuesta sobre la idea**; al cerrarla vuelve a la misma idea, en el mismo punto.

Cuando una idea tiene varios autores, la tira los muestra con su papel:

```
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │ ◐ DAVID HUME · 1711–1776 · Empirismo            principal    │    │
│  │   Muestra que la conexión causal no se observa.  ver ficha → │    │
│  ├──────────────────────────────────────────────────────────────┤    │
│  │ ◐ AL-GHAZALI · 1058–1111 · Filosofía islámica   convergente  │    │
│  │   Llega al mismo análisis 700 años antes, y      ver ficha → │    │
│  │   concluye lo contrario.                                     │    │
│  └──────────────────────────────────────────────────────────────┘    │
```

Esto no se podía expresar en el modelo por autor, y es donde el enfoque por ideas rinde más: la
convergencia entre Hume y Al-Ghazali, o entre el Buda y Hume sobre el no-yo, **deja de ser una nota
al pie del nivel 3 y pasa a ser la estructura del sitio**.

**Prohibiciones explícitas**, para que la interacción no se enrede:

1. Desde una idea **nunca** se salta a la galería de cromos. Eso es cambiar de modo de exploración
   en mitad de una lectura.
2. **Una sola capa superpuesta.** Desde la ficha de un autor no se abre otra ficha ni otra idea:
   como mucho, se cierra y se sigue. Nunca dos paneles apilados.
3. El botón "atrás" del navegador cierra la capa; no saca del recorrido.

### 2.5 Ficha de autor (capa superpuesta)

Es el mismo componente tanto si se abre desde una idea como desde un cromo, y siempre devuelve al
sitio del que salió. Contiene los 3 niveles ya escritos en la fase 1.

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← volver a "El imperativo categórico"                             ✕  │
│                                                                      │
│  IMMANUEL KANT                                                       │
│  1724–1804 · Königsberg (Prusia) · Ilustración e idealismo alemán    │
│                                                                      │
│  ❝ Sapere aude: ten el valor de servirte de tu propio                │
│    entendimiento. ❞                                                  │
│    Respuesta a la pregunta: ¿qué es la Ilustración?                  │
│                                                                      │
│  Kant intenta resolver el bloqueo entre racionalistas y empiristas   │
│  invirtiendo la pregunta…                                    [niv.2] │
│                                                                      │
│  Preguntas de fondo                                                  │
│  · ¿Qué puedo conocer?   · ¿Qué debo hacer?                          │
│                                                                      │
│  Ideas suyas en el recorrido                                         │
│  ② Las condiciones a priori    ③ El imperativo categórico ← estás aquí│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  ⊕  Modo experto — matices, debate historiográfico, fuentes  │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

La lista "ideas suyas en el recorrido" marca dónde está el usuario, pero **no es navegable desde
aquí**: es orientación, no un atajo. Si lo fuera, volveríamos a apilar capas.

#### Cuando la atribución de una cita no es literal

Siete de las citas no son literales (§Fase 1). En esos casos la cita lleva una marca discreta que
despliega la nota:

```
│  ❝ No es posible bañarse dos veces en el mismo río. ❞                │
│    Formulación tradicional a partir del fragmento DK B12    ⓘ        │
│    └─ El fragmento conservado es más matizado: habla de aguas        │
│       siempre distintas fluyendo sobre los que entran en los         │
│       mismos ríos. La versión célebre es una condensación posterior. │
```

La marca **no desactiva la cita ni la esconde tras una advertencia**: la frase se lee igual de bien,
y quien quiera saber de dónde sale, lo pulsa. Es el mismo criterio del bloque "En disputa" del nivel
3, aplicado a la puerta de entrada en vez de a la salida.

### 2.6 Ficha de autor — modo experto (nivel 3)

```
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  ⊖  Modo experto                                             │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  El corazón técnico de la primera Crítica es la pregunta por los     │
│  juicios sintéticos a priori y la deducción trascendental de las     │
│  categorías, cuyo argumento —y las diferencias entre las ediciones   │
│  A y B— sigue siendo uno de los textos más discutidos…               │
│                                                                      │
│  ⚠ En disputa                                                        │
│  │ La lectura de "dos mundos" frente a "dos aspectos", el            │
│  │ formalismo del imperativo categórico y la relación entre su       │
│  │ universalismo y sus escritos sobre razas son debates activos.     │
│                                                                      │
│  Fuentes                                                             │
│  · Stanford Encyclopedia of Philosophy — Immanuel Kant           ↗   │
│  · Stanford Encyclopedia of Philosophy — Kant's Moral Philosophy ↗   │
│  · Internet Encyclopedia of Philosophy — Kant: Metaphysics       ↗   │
```

El bloque **"En disputa"** tiene tratamiento visual propio y aparece siempre que la ficha tenga
`debate_abierto`. Es una decisión editorial con consecuencia de UI: distingue lo que la comunidad
académica discute de lo que da por establecido, en lugar de servirlo todo con el mismo tono de
autoridad.

### 2.7 Umbral: del recorrido a los cromos

El análisis de UX advertía que pasar de scroll cronológico a rejilla es un cambio de paradigma y hay
que señalarlo. Se resuelve con una sección corta y deliberada:

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│              Hasta aquí, las ideas en orden.                         │
│              A partir de aquí, quienes las pensaron.                 │
│                                                                      │
│         ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑯                              │
│                        ↓                                             │
│         ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                  │
│         ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

Los 16 marcadores de corriente se abren en 47 cromos. **El cambio de unidad es el mensaje**: el
recorrido iba de ideas, los cromos van de personas. El widget cambia de rol a la vez (§4).

### 2.8 Cromos, con el camino de corrientes

El camino de vuelta que pediste, y que aquí sí funciona: el usuario **ya ha terminado la narración**,
así que orientarse en ella no le rompe ningún hilo.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Los 47                                                              │
│                                                                      │
│  ●──●──●──●──●──●──●──●──●──●──●──╌╌●──●──●──╌╌●                     │
│  ①  ②  ③  ④  ⑤  ⑥  ⑦  ⑧  ⑨  ⑩  ⑪   ⑬  ⑭  ⑮   ⑯                      │
│              ▲                                                       │
│              └─ Racionalismo · 3 autores · 4 ideas                   │
│                                                                      │
│  [Todos] [Occidente] [China·India·Islam] [Psicología]     ⌕ buscar   │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ ❝            │ │ ❝            │ │ ❝            │ │ ❝            │ │
│  │ No es        │ │ Lo mismo es  │ │ Todo es      │ │ Una vida sin │ │
│  │ posible      │ │ pensar y     │ │ número. ❞    │ │ examen no    │ │
│  │ bañarse dos  │ │ ser. ❞       │ │              │ │ merece ser   │ │
│  │ veces en el  │ │              │ │              │ │ vivida. ❞    │ │
│  │ mismo río. ❞ │ │              │ │              │ │              │ │
│  │              │ │              │ │              │ │              │ │
│  │ HERÁCLITO    │ │ PARMÉNIDES   │ │ PITÁGORAS    │ │ SÓCRATES     │ │
│  │ Presocrát.   │ │ Presocrát.   │ │ Presocrát.   │ │ Clásica gr.  │ │
│  │ 540–480 a.C. │ │ 515–450 a.C. │ │ 570–495 a.C. │ │ 470–399 a.C. │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**La cita es el cuerpo del cromo, no un añadido.** Es lo que hace que una rejilla de 47 tarjetas
invite a detenerse: se recorre leyendo frases, no fichas. Por eso ocupa la zona superior y el
nombre queda abajo, como firma. Aquí no se muestra la marca de atribución —descargaría la tarjeta—;
aparece al abrir el autor, que es donde el usuario ya está leyendo con atención.

Consecuencia de diseño para la fase 3: las citas van de 3 a 15 palabras, así que **la tarjeta tiene
altura fija y el texto se ajusta**, no al revés. Una rejilla con tarjetas de alturas distintas por
la longitud de la frase sería exactamente el ruido visual que el proyecto quiere evitar.

Jerarquía tipográfica de la card, en tres pesos como máximo (nota de diseño para la fase 3):
**cita** (peso medio, tamaño mayor) → **nombre** (peso alto, tamaño menor) → corriente (peso bajo,
color de acento de la corriente) → periodo (peso bajo, atenuado).

#### Cómo se comporta el camino

| Gesto | Qué pasa |
|---|---|
| Pasar el ratón / mantener sobre un cromo | Se ilumina su punto en el camino, con corriente, número de autores e ideas |
| Pulsar un punto del camino | Filtra la rejilla a los autores de esa corriente. **No** salta al recorrido |
| Pulsar un cromo | Se abre la ficha del autor (§2.5). El punto de su corriente queda marcado detrás |

El camino usa trazo discontinuo entre ⑪–⑬ y ⑮–⑯ para marcar los saltos de bloque: ahí la línea no es
una sucesión, porque las tradiciones no occidentales corren en paralelo.

**Un solo componente de detalle** para las dos vías de entrada: la ficha que se abre desde un cromo
es exactamente la misma que se abre desde una idea (§2.5). Lo único que cambia es a dónde vuelve al
cerrarse.

---

## 3. Móvil

### 3.1 Decisión: no se secuestra el gesto vertical

El análisis de UX señalaba el riesgo de que un swipe propio choque con el gesto nativo del navegador
y del sistema. La decisión es clara: **en móvil no hay paginación por swipe vertical**. Se usa scroll
nativo, con el pinning reducido o desactivado. Motivos:

- El swipe horizontal desde el borde es "atrás" en iOS y en Android. Un carrusel a pantalla completa
  compite con él y pierde.
- `scroll-snap` de CSS da la sensación de paradas sin quitarle al usuario el control del scroll, y
  degrada solo.
- Lenis aporta poco en móvil y sí añade coste; se desactiva por debajo del breakpoint de tablet.

El swipe horizontal se usa **solo dentro del carril de ideas** de una corriente, que es un carril
acotado, no ocupa el ancho completo hasta el borde y no compite con el gesto de retroceso.

### 3.2 Parada de corriente (móvil)

```
┌───────────────────────┐
│ ⑦ ILUSTRACIÓN E       │
│   IDEALISMO ALEMÁN    │
│   s. XVIII–XIX        │
│ ───────────────────── │
│                       │
│ ¿Qué podemos conocer, │
│ qué debemos hacer y   │
│ qué mueve al humano?  │
│                       │
│ La confianza ilustra- │
│ da convive con dos    │
│ golpes: …             │
│                       │
│ 5 ideas                │
│ ┌───────┐┌───────┐    │
│ │① Con- ││② Con- │ →  │  ← swipe horizontal, carril acotado
│ │trato  ││dicio- │    │
│ │social ││nes a  │    │
│ │       ││priori★│    │
│ └───────┘└───────┘    │
│                       │
│ saltar a ⑧ →          │
├───────────────────────┤
│ ⑦/16 ·●●○○○·       ▲  │  ← widget colapsado, fijo abajo
└───────────────────────┘
```

Dentro de una idea, la visualización va a ancho completo y el resto se lee en scroll vertical
nativo. La **tira de autor** queda al final, antes de los controles de idea anterior/siguiente.

La ficha de autor en móvil es una hoja a pantalla completa que entra desde abajo, con arrastre hacia
abajo para cerrar. `history.back()` la cierra: el botón "atrás" del sistema cierra la hoja y devuelve
a la idea, no saca del sitio. Como solo hay una capa superpuesta (§2.4), nunca hay dos hojas
apiladas que el gesto de retroceso tenga que desapilar.

---

## 4. Widget de posicionamiento

Requisitos: visible siempre, permite saltar, **y muestra el progreso dentro del total** (nota del
análisis de UX: sin eso, el usuario no sabe cuánto le queda de un contenido largo).

### Desktop — carril vertical derecho

Con dos ejes de navegación (corriente e idea), el widget tiene que mostrar los dos o el usuario se
pierde dentro de una corriente larga.

```
   ┌─────┐        Estados de corriente
   │ ▮ 5 │        ▮  visitada
   │ ▮ 6 │        ▶  actual (etiqueta siempre visible)
   │ ▶ 7 │◄─ Ilustración e idealismo   ▯  pendiente
   │ ●●○○○│   ← ideas de la corriente actual: 5, estás en la 2ª
   │ ▯ 8 │
   │ ▯ 9 │        Al pasar el ratón sobre una corriente: nombre,
   │ ─── │        periodo y cuántas ideas tiene
   │ ▯13 │
   │ ▯14 │        Separadores = cambio de bloque
   │ ─── │        (occidental / no occidental / psicología)
   │ ▯16 │
   └─────┘        Barra de progreso continua al margen: mide
                  recorrido real, no cuenta paradas
```

Los puntos de idea **solo se despliegan en la corriente actual**. Mostrar los 59 a la vez convertiría
el widget en un índice, que es justo lo que no debe ser: es una brújula, no un mapa.

En la zona de cromos el carril **se transforma en filtros de corriente**, en lugar de desaparecer:
el mismo elemento cambia de función, lo que refuerza el mensaje de que ha cambiado el modo de
explorar. Es el mismo dato que el camino horizontal de §2.8, en su versión persistente.

### Móvil — barra inferior colapsada

Una línea: `⑦/16 · ●●○○○ · ▲`. Al pulsar, se despliega una hoja con las 16 corrientes agrupadas por
bloque, y la corriente actual expandida con sus ideas. Ocupa 44 px en reposo.

### Sincronización: una sola fuente de verdad

Riesgo señalado en el análisis de ingeniería: que el widget y el scroll real se desincronicen. Se
evita con una regla de dirección única.

```
                   ┌────────────────────────┐
   ScrollTrigger ──►                        │
                   │   recorridoStore       │──► Widget (solo lee)
   (único emisor)  │   { corrienteActiva,   │──► Fondo / color de acento
                   │     ideaActiva,        │──► Título accesible de la sección
                   │     progresoTotal,     │──► Camino de cromos
                   │     autorAbierto }     │
                   └────────────────────────┘
                             ▲
   Widget (clic) ────────────┘  NO escribe el estado:
                                llama a lenis.scrollTo(), que mueve el scroll,
                                que dispara ScrollTrigger, que actualiza el store.
```

**El widget nunca escribe `corrienteActiva`.** Pide un desplazamiento; el estado lo actualiza siempre
el mismo emisor. Así es imposible que el indicador diga una cosa y el scroll esté en otra, incluso si
el usuario interrumpe la animación de salto a mitad.

---

## 5. Rutas y deep-linking

Con paneles superpuestos, el botón "atrás" es el primer sitio donde se rompe la experiencia. Cada
estado con entidad propia tiene URL:

| Estado | URL | Al recargar |
|---|---|---|
| Hero | `/` | — |
| Portada de corriente | `/#/corriente/ilustracion-idealismo` | Salta a esa portada sin animar el recorrido previo |
| Idea | `/#/idea/imperativo-categorico` | Abre esa idea, con su corriente como contexto |
| Autor desde una idea | `/#/idea/imperativo-categorico/autor/kant` | Idea detrás, ficha abierta encima |
| Autor desde los cromos | `/#/cromos/kant` | Rejilla detrás, ficha abierta encima |
| Modo experto | `…/kant?nivel=experto` | Abre la ficha ya desplegada |
| Cromos | `/#/cromos` | — |
| Cromos filtrados | `/#/cromos?bloque=psicologia` | — |

La ruta del autor **cuelga del contexto del que salió**, y eso no es cosmético: es lo que hace que
cerrar la ficha devuelva siempre al sitio correcto, incluso si el usuario llegó por un enlace
compartido. Un solo nivel de anidamiento, nunca dos.

Se usa hash routing porque GitHub Pages sirve estáticos sin reescritura de rutas. Cerrar la ficha es
`history.back()`, y abrirla es `pushState`: el gesto de retroceso del móvil hace lo esperable.

Consecuencia editorial: **cada idea y cada autor son enlazables**. Un profesor puede mandar
`/#/idea/velo-de-la-ignorancia` para una clase de ética, o `/#/cromos/nagarjuna` para el autor.

---

## 6. Carga por nivel

La capa de datos de la fase 1 ya está partida para esto.

| Cuándo | Qué se carga | De dónde |
|---|---|---|
| Bundle inicial | 16 corrientes + títulos de las 59 ideas + los 47 `citas[0]` y `nivel_1_resumen` | Índice generado en build |
| Al acercarse una corriente | Las 3–5 ideas de esa corriente completas | `fetch` de un bundle por corriente |
| Al entrar en una idea | Módulo de su visualización | `import()` dinámico por `visualizacion.id` |
| Al abrir un autor | `nivel_2`, `nivel_3`, `fuentes`, `debate_abierto`, `citas[].nota` | `fetch` de `content/<lang>/autores/<id>.json` |
| Al entrar en cromos | Nada nuevo | — |

**Las ideas se agrupan por corriente, no una petición por idea.** Con 59 ideas, 59 peticiones sería
peor que una por corriente: son 16 bundles de 3–5 ideas, y se piden cuando la portada de esa
corriente se acerca al viewport. Quien salta corrientes nunca descarga las ideas que no mira.

El índice inicial se genera en build (no se cargan las 47 fichas completas para leer dos campos de
cada una). En ese índice entra `texto` y `atribucion` de la cita, pero **no la `nota`**: las notas
son párrafos y solo hacen falta al abrir el autor. Prefetch del JSON del autor al pasar el ratón/`pointerenter` sobre su tarjeta: para cuando
llega el clic, suele estar.

Las escenas Three.js se cargan con `IntersectionObserver` y **solo puede haber una instanciada**. El
contexto WebGL se libera al cerrar el panel.

---

## 7. Accesibilidad y degradación

- `prefers-reduced-motion`: sin pinning, sin scroll suave, sin animaciones de entrada. El recorrido
  pasa a ser un documento largo y navegable, y las visualizaciones muestran su estado final estático
  con controles equivalentes. **El contenido no se pierde nunca por desactivar el movimiento.**
- Cada visualización necesita una **alternativa textual que explique lo que la interacción muestra**,
  no una descripción de la imagen. Ya es un campo obligatorio del schema (`alternativa_textual`), así
  que el build falla si falta: no puede quedarse para el final.
- El recorrido es navegable por teclado: `Tab` entre tarjetas, el widget es una lista de enlaces
  reales, el panel atrapa el foco y `Esc` lo cierra.
- Sin JavaScript o si falla el 3D, el texto de los 44 autores en nivel 1 sigue siendo legible.

---

## 7 bis. Idiomas

Añadido al implementar la traducción; la fase 2 lo había dejado como «i18n basada en ficheros» sin
decidir cómo se sirve.

**Un documento HTML por idioma**: español en `/`, inglés en `/en/`. La alternativa —un solo HTML y
JavaScript que sustituye los textos— se descartó por una razón medida, no estética: el sitio entero
se apoya en que el titular y la entradilla están en el documento antes de que cargue nada, y con esa
alternativa quien leyera en inglés vería el titular en español durante los primeros cientos de
milisegundos, casi un segundo bajo CPU lenta. Es exactamente el defecto que la carga diferida de las
visualizaciones existe para evitar. Los dos documentos se generan de `plantilla/index.html`, de modo
que no hay dos ficheros que mantener sincronizados a mano.

**El idioma se lee del documento** (`<html lang>`), no de la URL ni de una consulta: si algún día hay
un tercer idioma, el mecanismo ya funciona.

**Nada de redirigir por el idioma del navegador.** Se recuerda la elección solo cuando el usuario
pulsa el conmutador. Adivinar rompe los enlaces compartidos —alguien envía una idea en español y el
destinatario aterriza en otra parte— y deja sin salida a quien quiere leer el original.

**El texto visible pertenece al contenido.** Las mecánicas ya recibían sus cadenas en
`visualizacion.parametros`; al traducir apareció el agujero: las doce piezas propias llevaban sus
rótulos escritos dentro, y la versión inglesa mostraba botones en castellano. Ahora los reciben en
`visualizacion.textos`, y el validador comprueba que las claves coincidan entre idiomas.

---

## 8. Decisiones abiertas para la fase 3

1. **Un color de acento por corriente** ya está en `corrientes.json` (14 valores provisionales).
   Falta validar contraste en ambos temas; los que no pasen AA se ajustan en el sistema de diseño.
2. **Cuántos cromos por fila** en pantallas grandes: con 44 autores, 6 columnas dan 8 filas.
   Conviene probar 5 y 6 con contenido real. Con la cita como cuerpo de la tarjeta, la altura fija
   la marca la frase más larga (15 palabras: Jung), así que hay que comprobar que la más corta
   (3 palabras: "Tú eres eso") no deje la tarjeta vacía — probablemente pida centrado vertical y un
   tamaño de fuente que responda a la longitud.
3. **El hero en móvil**: decidir si el 3D se carga o se sustituye siempre por estático. Depende del
   presupuesto de rendimiento; la medición va en la fase 5.
4. **Las 6 escenas Three.js** ya están asignadas por criterio, no por cuota, y cada una lleva su
   `justificacion_3d` obligatoria. Al prototipar, cualquiera que se entienda igual en 2D baja a SVG
   y deja su plaza libre.
