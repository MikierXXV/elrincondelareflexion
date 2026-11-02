# rincon-el-tiempo-en-el-alma · «Media hora no dura media hora» · tanda 3b

Ficha del sitio: `content/es/ideas/el-tiempo-en-el-alma.json` · corriente `escolastica` · acento `#9F7E2A` · autor
`agustin` (354-430). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Era el candidato
n.º 10 de `CANDIDATOS.md` (nota 3); en `../CANDIDATOS-2.md` sube a 4 y es el n.º 7.

## Objetivo

Que el espectador reconozca la espera que se estira y la cena que vuela, y se lleve el razonamiento de Agustín:
el pasado ya no está, el futuro todavía no y el presente no dura; así que lo que medimos es una huella en
nosotros (lo que recordamos, atendemos y esperamos). Con su cita, que es de las mejores del sitio. **Sin**
convertirlo en ciencia de la percepción del tiempo: no está en la ficha.

## Guion

El orden es gancho → idea → giro → idea-2: la cita va antes del argumento, porque el «si nadie me lo pregunta, lo
sé» es el giro natural tras el gancho (DECISIONES §6 permite cambiar el orden).

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Media hora esperando dura más, que dos horas con alguien. | clave `más,` | esperando, dos, alguien |
| 2 | `gancho` | Y el reloj, dice lo contrario. | clave `reloj,` | reloj, contrario |
| 3 | `idea` | Agustín de Hipona se atascó con el tiempo, hace dieciséis siglos. | — | agustín, atascó, siglos |
| 4 | `idea` | Escribió: ¿qué es, pues, el tiempo? Si nadie me lo pregunta, lo sé. | — | escribió, nadie |
| 5 | `idea` | Pero si quiero explicárselo al que me lo pregunta… no lo sé. | clave `sé.` | quiero, explicárselo |
| 6 | `giro` | Porque el pasado, ya no está. El futuro, todavía no. | — | pasado, futuro, todavía |
| 7 | `giro` | Y el presente, si lo apuras, no dura nada. | clave `nada.` | presente, apuras, nada |
| 8 | `idea-2` | Entonces, ¿qué mides? Una huella, dentro de ti: lo que recuerdas, lo que atiendes, lo que esperas. | clave `huella,` | mides, huella, recuerdas, atiendes, esperas |
| 9 | `ejemplo` | Como en una canción que te sabes: sostienes las notas que pasaron, y esperas las que vienen. | — | canción, pasaron, vienen |
| 10 | `cierre` | El reloj marca lo mismo. Pero tú, mides otra cosa. | clave `otra` | mismo, pero, otra |
| 11 | `cta` | Envíaselo a quien siempre te tiene esperando. | clave `Envíaselo` | envíaselo |

- **Palabras:** 122 · **pausas:** 35 (una cada 3,5) · **frase más larga:** 17 · **suspensivos:** 1.
- **Duración prevista:** 40,1 s a 3,38 pal/s; 42,2 s a 3,2.
- **F11:** las frases 4 y 5 son ahora literales de la traducción publicada (Custodio Vega, rev. Rodríguez Díez, en
  augustinus.it, leída el 31-10-2026): se añaden «pues» y «Pero» y «a quien» pasa a «al que». La voz la dice como cita
  («Escribió:»), así que la losa va como `cita` con su traductor.
- **Portada:** `"portada": "Media hora no | dura media hora"`, `"portada_resaltar": "dura"`, `"portada_t": 1.0` (solo
  el reloj de la izquierda), `"portada_color": "#9F7E2A"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#9F7E2A"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- En `idea` se repiten «tiempo», «pregunta» y «sé»: ninguna de esas palabras se usa como ancla.

## Escena (3D, kit v3 · F14a)

> Rediseño visual de F14a (`../VARIEDAD.md`, `../DECISIONES.md` §14). **Mismas anclas de voz, misma voz y mismo texto**: solo cambia lo que se
> ve. Necesita piezas nuevas del kit (`arena`, `reloj`, `notas`, más `etiquetas` ancladas: `VARIEDAD.md` §4). Hasta que existan, la escena
> renderizada (kit v2.1) sigue en `reel/reels/rincon-el-tiempo-en-el-alma/escena.js`.

`halo: { gancho: 56, idea: 50, giro: 54, 'idea-2': 52, ejemplo: 54, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'escolastica', halo: { /* arriba */ },
  golpes: ['gancho:reloj', 'idea:explicárselo', 'giro:nada', 'idea-2:huella', 'ejemplo:vienen', 'cierre:otra'],
  piezas: [
  // 1-2 · gancho: el tiempo vivido se estira y se achata; el reloj dice lo contrario
  objeto({ id: 'objeto-arena', modelo: 'arena', x: 340, y: 1100, tam: 340, desde: 'gancho', hasta: 'gancho:fin',
           efectos: [{ en: 'gancho:esperando', hace: 'estira' }, { en: 'gancho:alguien', hace: 'encoge' }] }),
  objeto({ id: 'objeto-reloj', modelo: 'reloj', tono: 'neutro', x: 740, y: 1100, tam: 320, desde: 'gancho:reloj', hasta: 'gancho:fin',
           efectos: [{ en: 'gancho:reloj', hace: 'marca', min: 30 }, { en: 'gancho:contrario', hace: 'marca', min: 120 }] }),
  // 3-5 · idea: Agustín y su cita
  autor({ id: 'autor-agustin', nombre: 'Agustín de Hipona', anos: '354-430', obra: 'Confesiones, libro XI', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea-2:fin', efectos: [{ en: 'idea:atascó', hace: 'a-firma' }] }),
  linea({ id: 'linea-agustin', x: 530, y: 1150, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:escribió',
          hitos: [{ ano: 354, etiqueta: 'Nace Agustín', ancla: 'idea:Agustín' }, { hoy: true, ancla: 'idea:siglos' }] }),
  cita({ id: 'cita-confesiones', tipo: 'cita', x: 540, y: 1040,
         texto: '¿Qué es, pues, el tiempo? Si nadie me lo pregunta, lo sé; pero si quiero explicárselo al que me lo pregunta, no lo sé.',
         resalta: ['explicárselo'], obra: 'Agustín, Confesiones, XI, 14, 17 · trad. Á. Custodio Vega', desde: 'idea:escribió', hasta: 'idea:fin' }),
  // 6-7 · giro: pasado, futuro y presente son las zonas del reloj de arena (tres píldoras ancladas, no tres rótulos)
  objeto({ id: 'objeto-arena-zonas', modelo: 'arena', x: 400, y: 1225, tam: 300, desde: 'giro', hasta: 'giro:fin',
           efectos: [{ en: 'giro:pasado', hace: 'zona', cual: 'pasado' }, { en: 'giro:futuro', hace: 'zona', cual: 'futuro' },
                     { en: 'giro:presente', hace: 'zona', cual: 'presente' }],   // F11: «nada» cierra la escena y cae en la salida
           etiquetas: [{ cual: 'pasado', texto: 'Pasado: ya no está', tono: 'neutro', en: 'giro:pasado', hasta: 'giro:fin' },
                       { cual: 'futuro', texto: 'Futuro: todavía no', tono: 'neutro', en: 'giro:futuro', hasta: 'giro:fin' },
                       { cual: 'presente', texto: 'Presente: no dura', tono: 'acento', en: 'giro:presente', hasta: 'giro:fin' }] }),
  // 8-9 · idea-2 y ejemplo: la huella en ti (estela, cabezal, fantasmas) y la canción tocándose
  rotulo({ id: 'rotulo-huella', texto: 'Una huella en ti', tam: 'titular', tono: 'acento', x: 540, y: 900,
           desde: 'idea-2:huella', hasta: 'idea-2:fin' }),
  objeto({ id: 'objeto-notas', modelo: 'notas', n: 6, x: 540, y: 1230, tam: 760, desde: 'idea-2:recuerdas', hasta: 'ejemplo:fin',
           efectos: [{ en: 'idea-2:recuerdas', hace: 'zona', cual: 'estela' }, { en: 'idea-2:atiendes', hace: 'zona', cual: 'cabezal' },
                     { en: 'idea-2:esperas', hace: 'zona', cual: 'fantasmas' }, { en: 'ejemplo:canción', hace: 'toca' }],
           etiquetas: [{ cual: 'estela', texto: 'Lo que recuerdas', tono: 'neutro', en: 'idea-2:recuerdas', hasta: 'idea-2:fin' },
                       { cual: 'cabezal', texto: 'Lo que atiendes', tono: 'acento', en: 'idea-2:atiendes', hasta: 'idea-2:fin' },
                       { cual: 'fantasmas', texto: 'Lo que esperas', tono: 'neutro', en: 'idea-2:esperas', hasta: 'idea-2:fin' },
                       { cual: 'estela', texto: 'Ya sonaron', tono: 'neutro', en: 'ejemplo:pasaron', hasta: 'ejemplo:fin' },
                       { cual: 'fantasmas', texto: 'Vienen', tono: 'neutro', en: 'ejemplo:vienen', hasta: 'ejemplo:fin' }] }),
  // 10 · cierre: el reloj marca lo mismo; el reloj de arena respira, que es lo que tú mides
  objeto({ id: 'objeto-reloj-2', modelo: 'reloj', tono: 'neutro', x: 330, y: 980, tam: 330, etiqueta: 'Marca lo mismo',
           desde: 'cierre', hasta: 'cierre:fin' }),
  objeto({ id: 'objeto-arena-2', modelo: 'arena', x: 760, y: 980, tam: 300, desde: 'cierre', hasta: 'cierre:fin',
           efectos: [{ en: 'cierre:pero', hace: 'respira' }] }),
  rotulo({ id: 'rotulo-otra', texto: 'Tú mides otra cosa', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'cierre:pero', hasta: 'cierre:fin' }),
  // 11 · cta
  cierre({ titulo: 'Media hora no dura media hora' }),
] });
```

- **Elementos propios** (§14.1): `arena` (con `estira`, `encoge`, `zona`, `respira`), `reloj` (con `marca`) y `notas` (con `zona`, `toca`).
- **Genéricas**: ninguna. Fuera: los dos relojes en contraste, los 7 rótulos de las listas, los 5 peones de la canción y el icono del reloj. Quedan 2 rótulos
  (huella y «Tú mides otra cosa») y 8 píldoras ancladas a los modelos.
- **Bis**: gancho y cierre repiten reloj + arena a propósito (enmarque); en el gancho la arena se estira y se achata, en el cierre respira.
- `notas` aparece desde `idea-2:recuerdas` y continúa en `ejemplo` (la idea y su aplicación son lo mismo, vistas con otro movimiento: `zona` y luego `toca`).
- `reloj` en 3D va sin cifras: «30 minutos» y «2 horas» salen de los arcos (media vuelta; dos vueltas). La voz y el post dicen los números.
- Colocación (provisional, a ver con `vista.mjs --cajas`): la arena con zonas es alta (≈ 2 : 1); `y` 1225 y `tam` 300 la dejan bajo el medallón; si no cabe, `tam` 280.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-2 | La espera y la cena: ejemplo de la ficha (`ejemplo_real`), presentado como aplicación | ficha: `ejemplo_real` |
| 3 y `autor-agustin` | 354-430; *Confesiones* hacia 397-401: «dieciséis siglos» | Ficha de autor `agustin`; SEP, «Saint Augustine» (https://plato.stanford.edu/entries/augustine/) |
| 4-5 y `cita-confesiones` | XI, 14, 17: «¿Qué es, pues, el tiempo? Si nadie me lo pregunta, lo sé; pero si quiero explicárselo al que me lo pregunta, no lo sé» (trad. Á. Custodio Vega, rev. J. Rodríguez Díez) | Agustín, *Confesiones* XI (https://www.augustinus.it/spagnolo/confessioni/conf_11_libro.htm; leído en F11 el 31-10-2026; la página sale con las tildes mal codificadas) |
| 6-7 | El pasado ya no es, el futuro aún no es y el presente no tiene extensión | *Confesiones* XI, 14-15 |
| 8 | Memoria, atención (*contuitus*) y expectación: los tres «presentes» en el alma; el tiempo como *distentio animi* | *Confesiones* XI, 20, 26 y 26, 33 |
| 9 | Agustín usa un canto (recitar un salmo, XI, 28, 38); la canción es la aplicación de la ficha | *Confesiones* XI, 28, 38; ficha: `ejemplo_real` |
| post | La función del libro XI es religiosa y autobiográfica, no una teoría autónoma; lectura como anticipo de Husserl | ficha: `matiz_experto` |

**Cita de la ficha:** es la que va (XI, 14, 17), directa. Es la única cita del reel.

## Riesgos de rigor

- No meter psicología del tiempo («el cerebro…»). El gancho es la experiencia; el argumento es de Agustín.
- «Se atascó con el tiempo» es narración: lo que sigue es su propia frase.
- El salmo de Agustín pasa a «canción»: el post lo dice.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- Ninguna afirmación científica sobre la percepción del tiempo.
- La cita, con su pasaje (XI, 14, 17) y, si es `cita`, su traductor.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-el-tiempo-en-el-alma --corriente escolastica
node reel/reel.mjs --reel rincon-el-tiempo-en-el-alma
node reel/qa/medir-fluida.mjs rincon-el-tiempo-en-el-alma
node reel/prueba-atempo.mjs rincon-el-tiempo-en-el-alma 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-el-tiempo-en-el-alma --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-el-tiempo-en-el-alma
node reel/reels/rincon-kit/web.mjs rincon-el-tiempo-en-el-alma
```

## Hecho

> F14a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md`). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12b, 2026-10-31 (t-a20f04). Kit v2.1.

- **Medidas:** 40.53 s, 6.95 MB, -14.1 LUFS, pico -1.4 dBTP; web 2.41 MB (720×1280, póster 720 y 360). 122 palabras, 3.27 pal/s, 0 huecos, solapes 0, alineado sin avisos.
- **atempo final:** 1.02 (elegido con `prueba-atempo` 1,00-1,16 desde la caché).
- **Peticiones de voz:** 1.
- **Cambios de guion:** Ninguno: guion tal cual (con la cita literal de F11). 1 petición.
- **Cambios de escena:** Sin cambios sobre la ficha.
- **Avisos de whisper (palabras no coincidentes):** hipona, dieciséis; probables falsos (nombres propios y números en letras). Sin avisos de alineado.
- **Pendiente de escucha humana:** Que la cita suena como cita («Escribió: ¿qué es, pues, el tiempo?…») y que «Hipona» y «dieciséis» suenan bien (whisper los marca, probables falsos).
- Hoja de escucha: `ESCUCHA-LOTE3B.md`.


**F14b (2026-10-31, t-3e334d) · kit v3.0, escena nueva de la ficha.** Re-renderizado con la voz de la caché (0 peticiones a Gemini): 40.53 s, 8.15 MB, web 2.76 MB. 0 solapes, 0 huecos, portada limpia, `web.mjs` pasa. Cronología `linea-agustin` (354 → hoy, y 1150, hasta `idea:escribió`). `objeto-arena` y `objeto-reloj` del gancho bajan a y 1100: con 980 la arena empezaba en y 592 y la portada no salía limpia. La cronología del autor es marca (DECISIONES §14.4), no cuenta para N. Hoja: `reel/reels/rincon-el-tiempo-en-el-alma/salida/rincon-el-tiempo-en-el-alma-fotogramas.png`.
