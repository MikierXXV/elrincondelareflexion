# rincon-ren-y-li · «Buenos días sin ganas» · tanda 3b

Ficha del sitio: `content/es/ideas/ren-y-li.json` · corriente `filosofia-china` · acento `#D05D70` · autor
`confucio` (551-479 a. C.). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Candidato
n.º 9 de `../CANDIDATOS-2.md`.

## Objetivo

Dar la vuelta a una sospecha de todos los días: saludar sin ganas parece hipocresía, y Confucio diría que es
el principio. Las formas (*li*) no adornan el sentimiento, lo educan, y la humanidad hacia los demás (*ren*) se
aprende practicándolas, como un oficio. Hace pareja con `wu-wei` (Laozi frente a Confucio), sin depender de él.
**Con** el aviso de que *ren* y *li* se traducen mal.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Dar los buenos días a alguien que no te cae bien. ¿Es hipocresía? | clave `hipocresía?` | días, hipocresía |
| 2 | `giro` | Parece que sí: el gesto, sin el sentimiento, sería pura fachada. | clave `fachada.` | gesto, fachada |
| 3 | `idea` | Confucio pensaba lo contrario, hace veinticinco siglos. | — | confucio, contrario, siglos |
| 4 | `idea` | Para él, las formas no adornan lo que sientes. Lo educan. | clave `educan.` | formas, adornan, educan |
| 5 | `idea` | Las llamaba li: ritos, cortesías, maneras. | — | llamaba, ritos, maneras |
| 6 | `idea` | Y el ren, la humanidad hacia los demás, se aprende practicándolas… como un oficio. | — | ren, humanidad, practicándolas, oficio |
| 7 | `ejemplo` | Saludas durante meses, por pura forma. Y un día notas que la relación ha cambiado de verdad. | clave `cambiado` | saludas, forma, cambiado |
| 8 | `ejemplo` | No lo decidiste: la práctica llegó antes, que el sentimiento. | — | decidiste, práctica, sentimiento |
| 9 | `giro-2` | Ojo: ren y li se traducen mal. Muchos expertos prefieren no traducirlos. | — | traducen, traducirlos |
| 10 | `cierre` | Así que el gesto que te parece falso… quizá es el principio de uno verdadero. | clave `verdadero.` | falso, principio, verdadero |
| 11 | `cta` | Envíaselo a quien saludas cada mañana, sin ganas. | clave `Envíaselo` | envíaselo |

- **Palabras:** 124 · **pausas:** 32 (una cada 3,9) · **frase más larga:** 17 · **suspensivos:** 2.
- **Duración prevista:** 40,7 s a 3,38 pal/s; 42,8 s a 3,2.
- **Portada:** `"portada": "Buenos días | sin ganas"`, `"portada_resaltar": "ganas"`, `"portada_t": 1.0` (solo la
  pareja de peones), `"portada_color": "#D05D70"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#D05D70"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- **Pronunciación.** «li» y «ren» son cortas y Orus puede leerlas en inglés («rén», «lai»). Se escucha la toma:
  si suenan mal, se corrige con el campo `voz` de las frases 5, 6 y 9 (p. ej. «Li» → «Lí», «ren» → «rren»), que
  cuesta 1 petición (DECISIONES §3 y §13.4). El subtítulo sigue diciendo «li» y «ren».

## Escena (3D, kit v3 · F14a) · PILOTO de la variedad

> Rediseño visual de F14a (`../VARIEDAD.md`, `../DECISIONES.md` §14). **Mismas anclas de voz, misma voz y mismo texto**: solo cambia lo que se
> ve. Necesita piezas nuevas del kit (`figuras 'ritual'`, maniquí con tronco, `etiquetas` ancladas: `VARIEDAD.md` §4). **Es el reel piloto**: se
> construye y se renderiza el primero, y el humano mira los gestos del maniquí antes de seguir con los demás. Hasta entonces, la escena renderizada
> (kit v2.1) sigue en `reel/reels/rincon-ren-y-li/escena.js`.

`halo: { gancho: 56, giro: 54, idea: 50, ejemplo: 54, 'giro-2': 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'filosofia-china', halo: { gancho: 56, giro: 54, idea: 50, ejemplo: 54, 'giro-2': 52, cierre: 52, cta: 60 },
  golpes: ['gancho:hipocresía', 'giro:fachada', 'idea:educan', 'ejemplo:cambiado', 'giro-2:traducirlos', 'cierre:verdadero'],
  piezas: [
  // 1-2 · gancho y giro: dos personas lejos, un saludo sin ganas, y los dos se vuelven cartón
  figuras({ id: 'figuras-saludo', disposicion: 'ritual', distancia: 'lejos', x: 540, y: 1000, tam: 720, desde: 'gancho', hasta: 'idea:Confucio',
            acciones: [{ en: 'gancho:días', hace: 'saluda' }, { en: 'giro:sería', hace: 'fachada' }] }),
  burbuja({ id: 'burbuja-buenos-dias', texto: 'Buenos días.', lado: 'izq', tono: 'neutro', x: 540, y: 1400,
            desde: 'gancho:días', hasta: 'gancho:fin' }),
  rotulo({ id: 'rotulo-fachada', texto: 'Pura fachada', tam: 'titular', tono: 'neutro', x: 540, y: 1400,
           desde: 'giro:pura', hasta: 'giro:fin' }),
  // 3-6 · idea: Confucio; el rito (reverencia) y el ren (calor en el pecho que crece al practicar)
  autor({ id: 'autor-confucio', nombre: 'Confucio (Kongzi)', anos: '551-479 a. C.', obra: 'Analectas', modo: 'medallon',
          x: 540, y: 820, desde: 'idea:Confucio', hasta: 'idea:fin', efectos: [{ en: 'idea:contrario', hace: 'a-firma' }] }),
  linea({ id: 'linea-confucio', x: 530, y: 1360, ancho: 600, escala: 'proporcional', desde: 'idea:Confucio', hasta: 'idea:llamaba',
          hitos: [{ ano: -551, etiqueta: 'Nace Confucio', ancla: 'idea:Confucio' }, { hoy: true, ancla: 'idea:siglos' }] }),
  rotulo({ id: 'rotulo-educan', texto: 'Las formas educan', tam: 'titular', tono: 'acento', x: 540, y: 1000,
           desde: 'idea:formas', hasta: 'idea:llamaba' }),
  figuras({ id: 'figuras-li-ren', disposicion: 'ritual', distancia: 'media', x: 540, y: 1378, tam: 440, desde: 'idea:llamaba', hasta: 'idea:fin',
            acciones: [{ en: 'idea:llamaba', hace: 'reverencia' },
                       { en: 'idea:llamaba', hace: 'etiqueta', quien: 'a', texto: 'Li · ritos, cortesías, maneras' },
                       { en: 'idea:ren', hace: 'calor', nivel: 0.3 },
                       { en: 'idea:ren', hace: 'etiqueta', quien: 'b', texto: 'Ren · humanidad hacia los demás' },
                       { en: 'idea:practicándolas', hace: 'reverencia' }, { en: 'idea:practicándolas', hace: 'calor', nivel: 0.6 },
                       { en: 'idea:oficio', hace: 'reverencia' }, { en: 'idea:oficio', hace: 'calor', nivel: 1 }] }),
  cita({ id: 'cita-analectas', tipo: 'parafrasis', x: 540, y: 1000, texto: 'Vencerse a uno mismo y volver al rito: eso es ren.',
         obra: 'Confucio, Analectas, XII, 1', desde: 'idea:practicándolas', hasta: 'idea:fin' }),
  // 7-8 · ejemplo: meses de forma (las bolitas se encienden), y un día la relación se acerca de verdad
  figuras({ id: 'figuras-relacion', disposicion: 'ritual', distancia: 'lejos', x: 540, y: 1000, tam: 760, desde: 'ejemplo', hasta: 'ejemplo:fin',
            acciones: [{ en: 'ejemplo:saludas', hace: 'cuenta', n: 12, dur: 5 },
                       { en: 'ejemplo:cambiado', hace: 'acerca' }, { en: 'ejemplo:cambiado', hace: 'hilo' }] }),
  rotulo({ id: 'rotulo-antes', texto: 'La práctica, antes', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'ejemplo:práctica', hasta: 'ejemplo:fin' }),
  // 9 · giro-2: traducciones; los dos se vuelven fantasma, con una traducción cada uno
  figuras({ id: 'figuras-fantasma', disposicion: 'ritual', distancia: 'media', x: 540, y: 1230, tam: 600, desde: 'giro-2', hasta: 'giro-2:fin',
            acciones: [{ en: 'giro-2:traducen', hace: 'fantasma' },
                       { en: 'giro-2:traducen', hace: 'etiqueta', quien: 'b', texto: 'ren ≈ humanidad' },
                       { en: 'giro-2:traducen+0.3', hace: 'etiqueta', quien: 'a', texto: 'li ≈ rito' }] }),
  rotulo({ id: 'rotulo-sin-traduccion', texto: 'Sin traducción exacta', tono: 'neutro', marca: 'punto', x: 540, y: 880,
           desde: 'giro-2', hasta: 'giro-2:fin' }),
  // 10 · cierre: el gesto que parece falso, y el apretón con el hilo de acento
  figuras({ id: 'figuras-cierre', disposicion: 'ritual', distancia: 'cerca', x: 540, y: 1000, tam: 680, desde: 'cierre', hasta: 'cierre:fin',
            acciones: [{ en: 'cierre:falso', hace: 'saluda' }, { en: 'cierre:principio', hace: 'mano' }, { en: 'cierre:principio', hace: 'hilo' }] }),
  rotulo({ id: 'rotulo-principio', texto: 'El principio de uno verdadero', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'cierre:principio', hasta: 'cierre:fin' }),   // F11: «verdadero» cierra la escena y cae en la salida
  // 11 · cta
  cierre({ titulo: 'Buenos días sin ganas' }),
] });
```

- **Elementos propios** (§14.1): `figuras 'ritual'` (con `saluda`, `fachada`, `reverencia`, `calor`, `acerca`, `mano`, `fantasma`) y la cuenta de meses (`cuenta`, las bolitas de la peana).
- **Genéricas**: 1 `burbuja` («Buenos días.»). Fuera: los 3 pares de peones (los de `pareja` de gancho, ejemplo y cierre), `peones` del contraste, el icono del apretón y el
  `contraste` li/ren. Rótulos: 5 (fachada, educan, antes, sin traducción, principio), ninguna pila.
- **Una sola pareja de maniquíes, tres «estados»**: lejos y frío (gancho, ejemplo al empezar), con rito y calor (idea), cerca y con hilo (cierre). Cada pieza arranca en su `distancia`.
- `fantasma` y las dos píldoras `ren ≈ humanidad` / `li ≈ rito` sustituyen a los dos rótulos de traducción: la traducción no encaja, y por eso los dos maniquíes se vuelven aristas.
- El hilo es el del kit (`pareja`): dos mitades de acento que cuelgan de las manos y se juntan.
- Maniquí: proporciones del durmiente aprobado (grosor 1,3, cabeza 1,15); `a` en arcilla (el rito, lo que se hace) y `b` en acento (el sentimiento).
- Ideogramas (仁, 禮): descartados, las fuentes del kit no los llevan (`VARIEDAD.md` §8).
- Colocación (provisional): cita 900-1110, `figuras-li-ren` bajo ella (1150-1490, `tam` 600).

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-2 | El saludo a quien no te apetece: ejemplo de la ficha (`ejemplo_real`), como aplicación | ficha: `ejemplo_real` |
| 3 y `autor-confucio` | 551-479 a. C.; «veinticinco siglos» redondea | Ficha de autor `confucio`; SEP, «Confucius» (https://plato.stanford.edu/entries/confucius/) |
| 4-6 y `contraste-li-ren` | *Li* (ritos, cortesías, maneras) y *ren* (humanidad, benevolencia); la forma educa el sentimiento; se aprende practicando, como un oficio | ficha: `resumen` y `desarrollo`; SEP «Confucius», §§ sobre *ren* y *li* |
| `cita-analectas` | XII, 1: «克己復禮為仁» («vencerse a sí mismo y volver al rito es *ren*»), paráfrasis | *Analectas* XII, 1 (texto chino y trad. inglesa de Legge en https://ctext.org/analects/yan-yuan); en castellano, trad. de J. Pérez Arroyo (Alianza) u otra publicada |
| 7-8 | La práctica llega antes que el sentimiento: ejemplo de la ficha | ficha: `ejemplo_real` |
| 9 | Traducir *ren* y *li* es un problema filosófico; buena parte de la sinología prefiere no traducirlos | ficha: `matiz_experto` |
| post | Las *Analectas* son una compilación estratificada de generaciones | ficha: `matiz_experto` |

**Cita que no se usa:** la de la ficha («No impongas a otro lo que no desearías para ti», XV, 24) es real pero
no trata de *ren* y *li* (DECISIONES §7). Va XII, 1.

## Riesgos de rigor

- La cita de XII, 1 hay que comprobarla en una traducción publicada antes de dejarla en pantalla; si no, se quita
  y la escena queda con el contraste hasta `idea:fin`.
- Que el reel diga que la cortesía hace buena a cualquiera. La voz dice «se aprende practicando» y el cierre usa
  «quizá».
- Pronunciación de *li* y *ren* (arriba).

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- No aparece la cita de XV, 24.
- El post explica qué significan *ren* y *li* y por qué no se traducen bien.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-ren-y-li --corriente filosofia-china
node reel/reel.mjs --reel rincon-ren-y-li
node reel/qa/medir-fluida.mjs rincon-ren-y-li
node reel/prueba-atempo.mjs rincon-ren-y-li 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-ren-y-li --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-ren-y-li
node reel/reels/rincon-kit/web.mjs rincon-ren-y-li
```

## Hecho

> F14a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md`). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12b, 2026-10-31 (t-a20f04). Kit v2.1.

- **Medidas:** 43.3 s, 6.48 MB, -14 LUFS, pico -1.4 dBTP; web 2.23 MB (720×1280, póster 720 y 360). 124 palabras, 3.09 pal/s, 0 huecos, solapes 0, alineado sin avisos.
- **atempo final:** 1.1 (elegido con `prueba-atempo` 1,00-1,16 desde la caché).
- **Peticiones de voz:** 1.
- **Cambios de guion:** Ninguno en el guion. A `atempo` 1,04 salía a 2,95 pal/s y 45,2 s (fuera de 30-45 s y bajo el suelo de 3,0), y se subió a 1,10. 1 petición, sin 2.ª toma.
- **Cambios de escena:** Sin cambios sobre la ficha.
- **Avisos de whisper (palabras no coincidentes):** confucio, veinticinco, meses; probables falsos (nombres propios y números en letras). Sin avisos de alineado.
- **Pendiente de escucha humana:** **Pronunciación de «li» y «ren»** (frases 5, 6 y 9), que no puedo comprobar: si suenan mal hace falta una 2.ª toma con el campo `voz`, para mañana. Whisper marca «Confucio», «veinticinco» y «meses» como no coincidentes (probables falsos).
- Hoja de escucha: `ESCUCHA-LOTE3B.md`.


**F14b (2026-10-31, t-3e334d) · kit v3.0, escena nueva de la ficha.** Re-renderizado con la voz de la caché (0 peticiones a Gemini): 43.3 s, 7.49 MB, web 2.51 MB. 0 solapes, 0 huecos, portada limpia, `web.mjs` pasa. Cronología `linea-confucio` (−551 → hoy) tras el autor, llena el hueco de 8,5-12,5 s. `rotulo-fachada` acortado a `giro:fin` (pisaba la línea 6,7-7,3 s). Colocación y tiempos de Kit-A (ya en escena.js) llevados a la ficha. La cronología del autor es marca (DECISIONES §14.4), no cuenta para N. Hoja: `reel/reels/rincon-ren-y-li/salida/rincon-ren-y-li-fotogramas.png`.
