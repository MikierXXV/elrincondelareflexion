# Reels del rincón: decisiones (no se vuelven a discutir)

Tarea t-598ce2 (encargo e-17e430), 2026-10-28. Va con `KIT.md` (las piezas de escena) y `fichas/<id>.md` (un
reel por ficha). **Revisado en t-df0043 (28-10) con dos decisiones del humano:** las escenas son 3D (§11) y la voz
es la del reel de la hipnosis (§3). También añade la regla de renders (§12).

**Base.** Es la tubería de los 16 reels de mentalista, en `C:\Users\migue\videos-cortos`. Todo lo que dicen
`videos-cortos/DECISIONES.md` y `videos-cortos/reel/LEEME.md` vale aquí tal cual: voz, alineado, subtítulo, cola
de render, caché de voz, detector de solapes, sonoridad y tamaño. Este documento solo recoge **lo que cambia
para el rincón** y lo que hay que fijar porque allí no existía, como el kit, la paleta o las citas. Si algo de
aquí contradice a mentalista, manda mentalista, salvo los cambios marcados con **[cambia]**.

---

## 1. Los 10 reels, el piloto y el reparto

| Lote | Reel (`rincon-<id>`) | Corriente | Acento (oscuro) | Piezas del kit |
|---|---|---|---|---|
| **F4 · piloto** | `rincon-principio-del-dano` | Utilitarismo | `#708D2C` | 9 de 10 (todas menos `medidor`) |
| F5a | `rincon-condicionamiento-operante` | Psicología del siglo XX | `#A26CC6` | 6 |
| F5a | `rincon-wu-wei` | Filosofía china clásica | `#D05D70` | 9 |
| F5a | `rincon-limite-del-placer` | Helenismo | `#2E9271` | 7 |
| F5a | `rincon-imperativo-categorico` | Ilustración e idealismo alemán | `#D65B50` | 7 |
| F5b | `rincon-mala-fe` | Existencialismo y vitalismo | `#BE5AC5` | 7 |
| F5b | `rincon-significado-como-uso` | Filosofía analítica | `#727EC2` | 7 |
| F5b | `rincon-velo-de-la-ignorancia` | Ética y filosofía política contemporánea | `#34945C` | 6 |
| F5b | `rincon-critica-de-la-causalidad` | Filosofía islámica medieval | `#2A918D` | 7 |
| F5b | `rincon-saber-que-no-se-sabe` | Filosofía clásica griega | `#4884CE` | 8 |

- **Por qué este piloto.** `principio-del-dano` usa 9 de las 10 piezas: objeto, autor, línea del tiempo, cita,
  figuras, rótulo, contraste, burbuja y cierre. Si el kit aguanta este reel, aguanta los demás. Además tiene el
  riesgo de rigor que más conviene probar pronto: decir que algo está en disputa sin tomar partido.
- **Estilo: 3D** (decisión del humano, 28-10, tras comparar los clips 2D y 3D del piloto): §11. La voz es la del
  reel `sugestion-hipnotica-fluida`, en su versión `salida-gemini-orus` (decisión del humano, 28-10): §3.
- **El kit 3D lo construye F2f, no F4.** F2f hace el núcleo, los modelos y las 10 piezas de `KIT.md`, incluida
  `medidor`, y los prueba sin voz como dice `KIT.md` §10. El kit 2D (v1, de F2b) queda solo como referencia.
  **F4 solo monta el reel piloto** con el kit ya hecho. Ni F4 ni F5 tocan el kit: si a un reel le falta algo o
  una pieza falla, se pide el cambio a quien lleve el kit, con el jefe en copia; no se arregla en el reel.
- **Por qué F5a lleva esos 4.** Son los tres que usan `medidor` (la única pieza sin estrenar en el piloto) y
  `imperativo-categorico`, que estrena `figuras` en fila y en pareja.
- **Cuota de voz.** `gemini-3.8-flash-tts` da **10 peticiones al día** en la capa gratuita, y cada reel gasta 1
  si sale bien a la primera. F5a (4) y F5b (5) caben en un día solo si nadie repite toma. Si los dos lotes
  coinciden en el mismo día, F5b espera al día siguiente para generar la voz, o se reparten la cuota
  por mensaje. Ante un 429 de cuota diaria, se para y se avisa (regla de mentalista).

## 2. Formato

| | Valor | Fuente |
|---|---|---|
| Duración | **30-45 s**, cola de la llamada incluida | **[cambia]** en mentalista se publicaron reels de 40-58 s |
| Palabras del guion | **105-125**, la llamada incluida. Tope duro: 125. Cuentan las separadas por espacio o guion: «al-Ghazali» son 2 | calculado abajo |
| Vídeo para redes | 1080×1920, 30 fps, x264 `-crf 20 -maxrate 4600k`, AAC, −14 LUFS ±1, pico ≤ −1 dBTP; ≤ 25 MB | `lib/render.mjs`, sin cambios |
| Versión web | 720×1280, **≤ 5 MB**, `salida/rincon-<id>-web.mp4` + póster WebP 720 y 360 px | **[cambia]** mentalista usa un tope de 6,5 MB al importar; aquí 5 MB (su mayor reel pesó 4,9 MB) |
| Portada | `salida/rincon-<id>-portada.png`, la saca la tubería en el instante `portada_t` | campos `portada`, `portada_resaltar` y `portada_t` del guion; reglas abajo |

**Portada.** `lib/revisar.mjs` escribe el título arriba y centrado, en Inter ExtraBold de 118 px desde
y = 250. Cada `|` es un salto de línea. Por eso:
- 2 o 3 líneas de **≤ 18 caracteres**;
- `portada_resaltar` es **una palabra en minúscula**, comparada sin `¿`, `?` ni comas. Con «» o con un punto
  pegados no coincide, así que esas palabras no se resaltan;
- en `portada_t` no puede haber **ninguna pieza por encima de y = 700**. Lo normal es un instante del gancho
  en el que solo está el objeto.

**Cálculo de las palabras (con la voz de la hipnosis, `atempo` 1,12).** Las medidas son las del reel de la
hipnosis:
- 154 palabras a **3,31 pal/s** sin la pausa de demostración (`reel/qa/ESCUCHAR-orus-d.md`);
- la voz acaba en 48,40 s y el vídeo dura 52,38 s, así que la cola real es de 3,98 s más 0,06 s de `inicio_ms`.

Duración ≈ palabras / ritmo + 4,04 s + pausas de demostración. Con el reel de la hipnosis cuadra: da 52,3 s y
midió 52,4 s. Ninguno de los 10 guiones lleva pausas de demostración. Con 125 palabras, el peor caso del rango
de QA (3,2 pal/s) da **43,1 s**; con 105 palabras y 3,4 pal/s, 34,9 s.

| Reel | Palabras | a 3,4 pal/s | a 3,31 (hipnosis) | a 3,2 pal/s |
|---|---|---|---|---|
| principio-del-dano | 123 | 40,2 | 41,2 | 42,5 |
| condicionamiento-operante | 118 | 38,7 | 39,7 | 40,9 |
| wu-wei | 124 | 40,5 | 41,5 | 42,8 |
| limite-del-placer | 120 | 39,3 | 40,3 | 41,5 |
| imperativo-categorico | 122 | 39,9 | 40,9 | 42,2 |
| mala-fe | 123 | 40,2 | 41,2 | 42,5 |
| significado-como-uso | 120 | 39,3 | 40,3 | 41,5 |
| velo-de-la-ignorancia | 123 | 40,2 | 41,2 | 42,5 |
| critica-de-la-causalidad | 122 | 39,9 | 40,9 | 42,2 |
| saber-que-no-se-sabe | 125 | 40,8 | 41,8 | 43,1 |

Las 10 quedan por debajo de 45 s en todo el rango. Las duraciones previstas que traen las fichas (con la
fórmula antigua de 3,7 s de cola) quedan sustituidas por esta tabla. El ritmo final depende de cómo lea Orus
cada guion, y lo que pasa si sale de rango está en §3.

**Versión web.** No hay importación al sitio en esta fase: no se toca `src/`. Cada reel deja su versión web
hecha con `node reel/reels/rincon-kit/web.mjs rincon-<id>` (`KIT.md` §7). Esa herramienta reproduce el
`importar-reels.mjs` de mentalista con otro tope: escala lanczos a 720×1280, `-crf 23`, `-maxrate` calculado
con la duración (vídeo = 5 MiB × 8 × 0,95 / duración − 96 kb/s de audio) y AAC a 96k con `+faststart`. Cuando
se integren los reels en el sitio, esa fase leerá estos ficheros.

## 3. Voz: la del reel de la hipnosis [cambia]

Decisión del humano (28-10): la voz de `reel/reels/sugestion-hipnotica-fluida/`, versión `salida-gemini-orus`.
El bloque `voz` de todos los `guion.json` es el de su `guion-gemini-orus.json`, copiado tal cual:

```json
"voz": { "motor": "gemini", "una_toma": true, "voz": "Orus", "modelo": "gemini-3.8-flash-tts",
         "atempo": 1.12, "inicio_ms": 60, "cola_ms": 400, "max_pausa_ms": 260 },
"cta_cola_ms": 3200
```

- **`pausa_antes_ms`, como en la hipnosis:** `320` en la primera frase de cada escena salvo la del `gancho`, y
  `320` en la frase de la llamada. Sustituye al 200 de la llamada que dicen `fichas/LEEME.md` y el piloto.
  - **Ojo, comprobado en `reel/lib/voz.mjs` (líneas 150 y 173):** con `una_toma`, una `pausa_antes_ms` por
    debajo de 500 **no cambia el audio**; solo las de 500 o más meten silencio. Lo mismo pasa con `unir`, que
    solo cuenta sin `una_toma`. Se ponen igual, para que el `guion.json` sea idéntico al de la hipnosis en
    todo menos el texto. No suman duración.
  - Ninguna de las 10 fichas lleva pausas de 500 o más.
- **El ritmo de la hipnosis lo da su guion, no solo el `atempo`.** Orus lee aquel texto despacio: unas 2,96
  pal/s sin acelerar, que con 1,12 se quedan en 3,31. El texto tiene estos rasgos, que pasan a ser **reglas de
  escritura** para cualquier guion nuevo o reescrito del rincón:
  1. **Frases cortas:** 8 palabras de media y ninguna de más de 20.
  2. **Una pausa de puntuación cada ≤ 5 palabras de media** (coma, dos puntos, punto, interrogación o puntos
     suspensivos). La hipnosis tiene 34 en 154 palabras: una cada 4,5.
  3. **Dos puntos para anunciar** lo que viene («Ojo:», «la define así:»).
  4. **Pregunta corta que el guion contesta enseguida** («Entonces, ¿qué es de verdad?»).
  5. **Puntos suspensivos** para dejar una frase en el aire y seguir en la siguiente («recuerdas más… / pero
     también inventas más»). Como mucho, uno cada 40 palabras.
  6. **Conectores al empezar** («Y», «Pues», «Pero», «Así que»), nada de telegrama (§6).
  7. Ni siglas ni cifras en la voz: se dice el nombre entero y el número en letras.
- **Los 10 guiones de las fichas no se reescriben** (están revisados en F3). Cumplen las reglas 3, 4, 6 y 7,
  pero no del todo la 1 ni la 2: tienen 12-13,7 palabras por frase y una pausa cada 4,6-6,8 palabras. Por eso
  es probable que Orus los lea algo más deprisa que la hipnosis. Entonces:
  - Se mide con `node reel/qa/medir-fluida.mjs rincon-<id>`. Ritmo objetivo: **3,2-3,4 pal/s**.
  - Si con 1,12 sale por encima de 3,4, se baja `atempo` **desde la caché** (`reel/trabajo/gemini-cache/`, que
    no gasta peticiones) de 0,02 en 0,02, hasta 1,04 como mucho.
  - Si con 1,04 sigue por encima de 3,4, se para y se avisa al jefe. La salida sería puntuar el guion según
    las reglas 2 y 5, y eso es cambiar el guion, que decide el jefe.
  - Si sale por debajo de 3,2, se sube de la misma manera, hasta 1,16.

  El `atempo` final y su porqué se apuntan en «Hecho». La duración aguanta en los dos extremos (§2).
- **Tras el piloto (decidido por el jefe el 2026-10-30).** Sustituye a lo de arriba en todo lo que lo contradiga.
  - El `atempo` se elige con `node reel/prueba-atempo.mjs rincon-<id> <desde> <hasta> 0.01` desde la caché,
    sin gastar peticiones. Se toma el que deja el ritmo **≤3,38 pal/s**, como el piloto aprobado, con menos
    reescalados y avisos.
  - El margen se amplía a **1,00-1,16**. 1,00 es la toma tal cual, sin estirar, y es preferible a gastar otra
    petición. El humano devolvió dos reels de mentalista por ir rápidos, así que no se acepta pasar de 3,4.
  - Todo guion lleva `voz.ancla_pausas: true`, que recoloca las palabras tras cada pausa interna (piloto: de 6
    palabras fuera de margen a 0), y `portada_color` con el acento del reel (tabla de §1).
  - Los renders van por la cola, de uno en uno, con ≥1,2 GB libres. Un `render.lock` huérfano ya se retira solo.
- Trampa conocida: hay valores de `atempo` que hacen fallar el alineado. En la hipnosis, 1,09, 1,10 y 1,11
  fallan y 1,08 y 1,12 pasan (`ESCUCHAR-orus-d.md`). Si pasa, se prueba ±0,01. Sin instrucción de estilo,
  porque el 3.8 la lee en voz alta.
- Caché por toma en `reels/rincon-<id>/trabajo/voz-cache/`. `--forzar` no vuelve a sintetizar. Para una toma
  nueva hay que pasar `--revoz todas`, que gasta 1 petición. Los `.wav` de la caché se conservan siempre.
- Clave en `videos-cortos/.config/api.txt`: no se imprime, no se copia y no se cita.
- **Números en letras** dentro de `texto`: «mil ochocientos cincuenta y nueve», «dos mil». Así lo pide
  `medir-fluida.mjs`, que solo convierte del 0 al 10. En pantalla, la cifra va en número (`linea`, `rotulo`).
- **Nombres propios.** Si Orus pronuncia mal un nombre (al-Ghazali, Daodejing, wu wei, Wittgenstein), se escucha
  la toma y se corrige con el campo `voz` de esa frase (grafía fonética, p. ej. `"voz": "…al Gazali…"`). El
  `texto` no cambia, y el subtítulo sigue mostrando la grafía correcta. Hacerlo cuesta 1 petición.
  Whisper es una medida, no el juez del texto (regla de mentalista).

## 4. Subtítulo (heredado, sin cambios)

Es el subtítulo «bloque» de `lib/subtitulo-bloque.mjs`: a la izquierda, con filete, una línea por pantalla y
cada palabra apareciendo al decirse (dorada mientras suena, luego blanca; `clave` en cian, `error` en coral y
tachada). Ocupa la caja **x 62-xmax, y 338-462**, con un velo oscuro de ±150 px detrás.

- **No lleva el acento de la corriente.** Sus colores están fijos en `lib/` y no se toca la tubería. El
  acento vive en la escena (§5). Sobre fondo oscuro, el dorado del subtítulo y los acentos conviven bien.
- `clave`: 1 o 2 palabras por frase como mucho, solo las que cargan la idea. `error`: solo la palabra que se
  desmiente en el guion, nunca una opinión del autor.

## 5. Paleta y tipografía (del sitio, tema oscuro)

El reel usa el **tema oscuro** de `design/tokens.json` siempre, con el acento oscuro de su corriente
(`content/es/corrientes.json` → `color_acento.oscuro`). El kit lo lee de una copia (`KIT.md` §2).

| Uso en el reel | Token | Valor |
|---|---|---|
| Fondo (arriba → abajo) | `oscuro.fondo` → `oscuro.fondo_hundido` | `#141317` → `#0E0D10` |
| Superficie de rótulos, burbujas y tarjetas | `oscuro.fondo_elevado`, α 0,88 | `#1D1C22` |
| Borde neutro | `oscuro.separador` | `#2E2C34` |
| Texto principal | `oscuro.texto` | `#EDEBE6` (15,5:1 sobre el fondo) |
| Texto secundario (obra, fechas, «esquema») | `oscuro.texto_secundario` | `#A8A39A` (7,4:1) |
| Acento de la corriente | `color_acento.oscuro` | 4,8:1 sobre el fondo y 4,4:1 sobre la superficie |
| Error, tachado o «no» | coral del subtítulo | `#FF7A6C` (6,6:1 sobre la superficie) |

- **Regla del acento.** Los 10 acentos dan 4,40-4,46:1 sobre `fondo_elevado`, por debajo de 4,5. En texto, el
  acento solo va en tamaño grande (≥ 38 px y 600) o directamente sobre el fondo. El texto pequeño va siempre
  en `texto` o `texto_secundario`. Trazos, filetes, puntos, halos e iconos van en acento sin restricción.
- **Un solo acento por reel.** Nada de cian, dorado ni violeta de mentalista en la escena: el acento es la
  corriente, el coral es «no» y lo demás es neutro. Excepción: el subtítulo, que es de la tubería.
- **Tipografía.** Newsreader (títulos del sitio) para la cita, el nombre del autor y las cifras grandes. Inter
  para rótulos, burbujas y datos. Pesos 500 y 600, como el sitio, que no usa 700. Tamaños mínimos en el vídeo:
  rótulo 38 px, dato secundario 30 px, cita 60 px y nombre del autor 64 px. Las fuentes las aporta el kit:
  Inter en TTF desde `/fuentes/` de la tubería y Newsreader desde una copia del woff2 del sitio, ambas OFL.
- **Lenguaje gráfico.** El DOM (rótulos, citas, burbujas, cierre) sigue el del sitio: radios de 4-8 px,
  remates redondos y movimiento con las curvas de los tokens (`curva_entrada`, `curva_salida`). La escena es
  3D con las reglas de §11. El trazo del sitio sobrevive en el modelo reserva `icono` (el icono de 24×24
  hecho tubo, con remates redondos) y en los filetes de acento.

## 6. Guion: tono y estructura

Se hereda de `videos-cortos/notas/referencia-audio.md` y del modelo `memoria-fluida/GUION-NUEVO.md`: segunda
persona, tono de quien cuenta algo que el otro no sabía, frases enlazadas con conectores («y como», «así que»,
«por eso», «pero») y nada de telegrama. Para el rincón, la estructura se nombra así. El orden de 2-4 puede
variar según la ficha (en `principio-del-dano` el giro va tras el ejemplo; en `limite-del-placer` el ejemplo va
antes de la idea): manda el orden de la tabla de la ficha, y las anclas van por nombre de escena, no por posición.

1. **Gancho** (0-3 s): una paradoja cotidiana que el espectador reconoce, sin saludo ni «¿sabías que…?». El
   filósofo no sale en el gancho, salvo que su nombre sea parte del gancho (`mala-fe`).
2. **Giro**: la pregunta que el gancho deja abierta, o el primer intento de respuesta que falla.
3. **Idea**: el autor y su tesis, dicha como la dice la ficha. El nombre del autor aparece aquí, con la pieza
   `autor`.
4. **Ejemplo**: el caso de hoy en el que se ve la idea, con su ejemplo canónico si lo hay (el puente de Mill,
   la promesa de Kant).
5. **Cierre**: una frase que reformula sin dato nuevo.
6. **Llamada**: «Envíaselo a» + alguien concreto ligado al tema. En pantalla, la pieza `cierre` con «Sígueme
   para más filosofía» (en mentalista era «más psicología»). Ni cartel de «suscríbete» ni web en la voz.

- **Contenido.** Cada reel sale de su ficha de `content/es/ideas/<id>.json` y no añade afirmaciones que la
  ficha no tenga, salvo las fuentes de apoyo de su `fichas/<id>.md`. El ejemplo de hoy se presenta como
  aplicación («se parece mucho», «es lo mismo que»), nunca como si lo dijera el autor.
- **`clave` y `error` en `guion.json`** son arrays de palabras (`"clave": ["casco"]`). Las fichas las escriben con
  la puntuación de la frase (`casco?`); da igual, porque la tubería compara sin signos ni tildes (`norm` de
  `lib/alinear.mjs`).
- **Gramática.** Cada frase tiene un sujeto coherente (regla de mentalista). Los guiones de las fichas ya
  están escritos así y se graban **tal cual**. Si una frase no suena bien al oírla, se cambia la mínima palabra
  posible, se apunta en la ficha y se revisan sus palabras de sincronía.

## 7. Rigor y citas

- **`guion-fuentes.md` en cada reel**, con el formato de mentalista: tabla con frase o rótulo, afirmación,
  fuente con URL y nota, más la fecha de consulta. **Cada fuente se abre y se comprueba en línea antes de
  grabar la voz**: la obra existe, el pasaje dice eso y la traducción citada es real. Si no se puede comprobar,
  la frase se reescribe para no necesitarla, o se para y se pregunta al jefe.
- **Citas en pantalla (`cita`).** Hay dos tipos:
  - `"tipo": "cita"`: texto literal de una traducción concreta, con obra, pasaje y traductor en
    `guion-fuentes.md`. Solo si se ha leído ese texto. También vale una traducción propia del original, si el
    original se ha leído en línea, se enlaza y se dice «trad. propia» en la obra del rótulo y en el post.
  - `"tipo": "parafrasis"`: el rótulo dice «paráfrasis» debajo de la obra. Es lo que se hace cuando la
    traducción literal es más larga o no se ha podido leer. En la voz, la paráfrasis se dice como tal
    («escribió que…», «según Platón…»), sin comillas.
- **Fuera las citas que no tratan de la idea**, aunque sean reales y estén en la ficha: Skinner (las máquinas
  que piensan), Epicuro (la muerte), Sartre («el infierno son los otros»), el Daodejing 1 (el dao que puede
  nombrarse) y Rawls §1 (la primera virtud). Cada ficha dice cuál usa y cuál no.
- **Lo que está en disputa se dice como disputado**, en la voz o en un rótulo: Harsanyi frente a Rawls, el
  casco frente a Mill, el Sócrates histórico. Nada de «está demostrado» ni de «la ciencia dice» sin fuente.
- **Esquemas.** Toda gráfica que no lleve datos reales (curvas de extinción, medidores) lleva el rótulo
  «esquema» en `texto_secundario`. Lo hace la pieza `medidor` sola.
- **El post** (`post.md`, formato de mentalista: título, cuerpo, fuentes, hashtags, alt text y «Nota para quien
  publique») repite los matices que la voz no tiene tiempo de decir.

## 8. Nombres y ficheros

- **id del reel:** `rincon-<id de la ficha>` (p. ej. `rincon-wu-wei`). La carpeta es
  `videos-cortos/reel/reels/rincon-<id>/` y se lanza con `node reel/reel.mjs --reel rincon-<id>`.
- **Carpeta de cada reel:**
  - `guion.json`;
  - `guion-fuentes.md`;
  - `post.md`;
  - `CREDITOS.md`;
  - `escena.html` y `escena.js`, que importan el kit;
  - `kit/`, copia del kit que pone `copiar.mjs` y que no se edita a mano;
  - `trabajo/`, que genera la tubería y donde `voz-cache/` se conserva siempre;
  - `salida/rincon-<id>.mp4`, `-portada.png`, `-fotogramas.png` y `-comprobaciones.json`, de la tubería;
  - `salida/rincon-<id>-web.mp4` más `-web.webp` y `-web-mini.webp`, de `web.mjs`.
- **Escenas del guion** (`frases[].escena`): nombres cortos en minúscula sin tildes y siempre los mismos para el
  mismo papel: `gancho`, `giro`, `idea`, `ejemplo`, `cierre` y `cta`, con sufijo si hay más de una del mismo papel
  (`idea-2`). La escena `cta` es la de la llamada y la que pinta la pieza `cierre`.
- **ids de las piezas** (los que salen en `__cajas` y en el informe de solapes): `<pieza>-<qué>`, p. ej.
  `objeto-casco`, `cita-mill` o `contraste-a`.

## 9. Lista de comprobación de QA (por reel)

Un reel está listo cuando cumple todo esto. Los números salen de `salida/rincon-<id>-comprobaciones.json`
y de `node reel/qa/medir-fluida.mjs rincon-<id>`.

1. **Sincronía voz-subtítulo.** `comprobaciones.alineado` sin avisos. Se revisan a ojo 6-8 palabras repartidas
   por el reel en la hoja o con `--vista`. Se acepta que el plan vaya entre 100 y 170 ms por delante de la
   voz, que es lo sistemático y aceptado en mentalista. No se acepta ningún retraso de más de 150 ms.
2. **Ritmo y duración.** 3,2-3,4 pal/s, con `atempo` 1,12 o con el que haya salido del ajuste de §3, anotado;
   duración total de 30-45 s; como mucho 3 pausas de más de 0,4 s, todas a propósito.
3. **Solapes.** `solapes_de_escena.ok === true`, sin `pares`, sin `pisan_subtitulo` y sin `en_zona_interfaz`.
   No vale `null`, porque el kit siempre da `__cajas`, proyectadas desde los vértices de los modelos 3D.
   Subtítulo con 0 pantallas en dos líneas.
4. **Sin pantallas vacías y portada limpia.** `node reel/reels/rincon-kit/vacios.mjs rincon-<id>` da 0 huecos y
   ninguna caja por encima de y = 700 en `portada_t`. Un hueco es un tramo de más de 0,6 s sin ninguna caja
   visible fuera de la escena `cta`.
5. **Legibilidad en móvil.** Se mira la hoja de fotogramas reducida al 33 % (lo que se ve en un móvil de 360
   px): todo rótulo se lee y ningún texto queda cortado. Tamaños y contrastes de §5. En la portada, el título no
   pisa ninguna pieza (lección de mentalista; reglas en §2).
6. **Rigor.** Cada afirmación de la voz y cada rótulo está en `guion-fuentes.md` con su fuente abierta y su
   fecha. Las citas, con su tipo correcto (§7). Lo disputado se dice como disputado. Ninguna cita fuera de
   la idea.
7. **Peso y formato.** mp4 de redes en 1080×1920 a 30 fps, −14 LUFS ±1, pico ≤ −1 dBTP y ≤ 25 MB. Web ≤ 5 MB.
8. **Audio.** Se escucha entero una vez: los nombres propios suenan bien y no hay palabras cambiadas. Los
   avisos de whisper se revisan y los falsos se anotan en la ficha.
9. **Entregables.** `post.md` completo (con alt text), `CREDITOS.md` y la ficha con el apartado «Hecho»
   rellenado: medidas, `atempo` final, peticiones de voz gastadas y lo que se cambió del guion.

## 10. Qué no se toca

- `videos-cortos/reel/reel.mjs`, `reel/lib/**`, `reel/qa/medir-fluida.mjs` y `reel/escena/**`.
- Los reels de mentalista (`reel/reels/*` que no empiezan por `rincon-`) y su `salida/`.
- El sitio: `src/`, `content/`, `design/` y `public/` de elrincondelareflexion. Los reels no se integran en
  esta fase.
- `reel/reels/rincon-kit/` solo lo toca F2f, que construye el kit 3D. En F4 y F5, si el kit falla, se pide el
  cambio a quien lleve el kit, con el jefe en copia.

## 11. Estilo 3D [cambia]

Decisión del humano (28-10), tomada tras ver `rincon-kit/comparativa/COMPARA.md` y `par-1..4.png`: «da algo más
de juego». El 3D cuesta poco más en lo medido: render de 115 s frente a 92 s, pico de 1,31 GB frente a 1,29 GB,
2,20 MB en web frente a 1,70 MB, y 0 solapes y 0 huecos en los dos. El detalle técnico está en `KIT.md` §3.

- **Un kit común, no una escena a mano por reel** como en mentalista. Los 10 reels comparten núcleo, modelos y
  piezas, y cada `escena.js` sigue siendo un `montar()` de parámetros. Lo propio de cada tema es un `modelo` del
  catálogo (`KIT.md` §5) o, si no lo tiene, el icono del sitio hecho tubo (`modelo: 'icono'`).
- **Cámara:** perspectiva de 30°, ligeramente desde arriba (elevación 3 sobre 14,3 de distancia), mirando
  siempre al centro. Deriva lenta (±0,32 en x, ±0,12 en y, ±0,35 en z) y un **golpe** de acercamiento del 3 %
  en la palabra que carga cada escena, uno por escena como mucho. Nada de giros de cámara ni de cortes: el
  movimiento lo hacen los objetos.
- **Luz:** principal cálida (`#FFF3E6`) arriba a la derecha, contraluz con el acento de la corriente, ambiente
  frío tenue y entorno `RoomEnvironment` suave. Tone mapping ACES, sin sombras proyectadas. Cada reel queda
  teñido de su corriente por la contraluz y el halo, sin un segundo color.
- **Materiales:** arcilla mate para lo neutro (con ACES sale marfil), acento con un emisivo leve para lo
  destacado, laca brillante solo para el protagonista del gancho, superficie oscura para peanas y losas,
  vidrio y agua para recipientes, piedra para lo inerte y coral solo para «no». Sin texturas de imagen, sin
  caras ni retratos y sin texto sobre el 3D: el texto es DOM.
- **Paleta:** la de §5, sin cambios. Un acento por reel, el de su corriente (`color_acento.oscuro`); el coral es
  «no» y lo demás es neutro. La única excepción es la llama de `critica`, que es luz cálida, no un color de
  marca.
- **Objetos sobre peana:** cada objeto o grupo está sobre una peana oscura con un aro y un halo de acento,
  como en el piloto. Es lo que une los 10 reels a la vista y sustituye al «icono grande» del 2D.
- **Ideas abstractas:** cada una tiene una metáfora 3D que muestra lo que dice la frase, y no adorna. Si no se
  lee en la hoja al 33 %, tiene una reserva: `KIT.md` §5.
- **Zonas seguras:** las de siempre. x ≤ 930 desde y = 860, todo entre y 500 y 1560, y nada por encima de y =
  700 en la portada. Se comprueban también con la cámara del golpe (`KIT.md` §3.6).

**Sigue abierto** (no bloquea): un acento por corriente en el subtítulo exigiría tocar
`lib/subtitulo-bloque.mjs`. No se hace (§4).

## 12. Renders [nuevo]

- Cada render de un reel 3D tiene un pico de unos **1,3 GB** (node + Chromium + ffmpeg; 1,31 GB medidos en la
  comparativa).
- **Por defecto, uno a la vez:** `node reel/reel.mjs --reel rincon-<id>` espera su turno en la cola de la
  tubería (`lib/cola.mjs`, un solo cerrojo).
- **Dos a la vez solo si hay memoria libre suficiente.** Justo antes de lanzar el segundo, con el primero ya
  en marcha, la memoria física libre tiene que ser de **2,0 GB o más** (1,3 GB del pico y 0,7 GB de margen).
  Se mide con
  `powershell -NoProfile -Command "[math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB,1)"`.
  - El segundo se lanza con `--sin-cola`, que ya existe en `reel.mjs`, y así no espera al cerrojo.
  - **Nunca tres.** Nunca dos que vayan a gastar voz a la vez: la cuota de Gemini es por día (§1).
  - Si no llega a 2,0 GB, se espera a que acabe el primero.
  - En este equipo hay 7,8 GB en total; el 28-10 por la tarde había 1,2 GB libres, así que lo normal será uno
    a la vez.
- Si un render en paralelo falla por memoria, el que falló se vuelve a lanzar solo, sin `--sin-cola`. Lo ya
  hecho sale de la caché.
- Las herramientas del kit que renderizan (`hoja.mjs` y `comprobar-fichas.mjs`) usan la misma cola y siguen
  la misma regla.
