# rincon-placeres-superiores · «¿Un vídeo más o un libro?» · tanda 3b

Ficha del sitio: `content/es/ideas/placeres-superiores.json` · corriente `utilitarismo` · acento `#708D2C` · autor
`mill` (1806-1873). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Candidato n.º 8 de
`../CANDIDATOS-2.md`.

## Objetivo

Un gancho que se ríe de sí mismo: el espectador está viendo un vídeo corto y el reel le pregunta si lo cambiaría
por terminar un libro. De ahí, la corrección de Mill a Bentham: no basta la cantidad de placer, cuenta la clase,
y decide quien ha probado los dos. **Con** la objeción que no se puede callar: para medir la calidad parece hacer
falta algo más que el placer. Y **sin** sermón contra las redes: es la apuesta de Mill, no una orden.

Segundo reel de Mill (el primero es `principio-del-dano`): se acepta porque la idea y la corriente necesitan uno
cotidiano y este es el gancho más fuerte del utilitarismo que queda.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Estás viendo un vídeo corto. ¿Lo cambiarías por terminar un libro? | clave `libro?` | corto, libro |
| 2 | `gancho` | Minuto a minuto, el vídeo gana, casi siempre. | — | gana, siempre |
| 3 | `giro` | Y aun así, la tarde de vídeos deja peor sabor. ¿Por qué? | clave `sabor.` | tarde, sabor, por |
| 4 | `idea` | John Stuart Mill pensaba, que no todo placer vale lo mismo. | — | mill, mismo |
| 5 | `idea` | Además de cuánto, cuenta de qué clase es. | clave `clase` | cuánto, clase |
| 6 | `idea` | ¿Y quién decide cuál es mejor? Quien ha probado los dos. | clave `probado` | decide, probado |
| 7 | `idea` | Lo resumió así: mejor ser un Sócrates insatisfecho, que un necio satisfecho. | — | resumió, sócrates, satisfecho |
| 8 | `giro-2` | Ojo: aquí, se le critica. Para medir la calidad, parece que hace falta… algo más que el placer. | — | critica, calidad, placer |
| 9 | `cierre` | Y esa es su apuesta: quien conoce las dos cosas, no cambia sus libros… por más tardes de vídeos. | clave `apuesta:` | apuesta, libros, vídeos |
| 10 | `cta` | Envíaselo a quien te ha mandado este vídeo. | clave `Envíaselo` | envíaselo |

- **Palabras:** 118 · **pausas:** 28 (una cada 4,2) · **frase más larga:** 19 · **suspensivos:** 2.
- **Duración prevista:** 39,0 s a 3,38 pal/s; 40,9 s a 3,2.
- **Portada:** `"portada": "¿Un vídeo más | o un libro?"`, `"portada_resaltar": "libro"`, `"portada_t": 1.0` (solo el
  móvil), `"portada_color": "#708D2C"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#708D2C"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- En `gancho` se repiten «minuto» y «vídeo»: no se usan como ancla.

## Escena (3D, kit v3 · F14a)

> Rediseño visual de F14a (`../VARIEDAD.md`, `../DECISIONES.md` §14). **Mismas anclas de voz, misma voz y mismo texto**: solo cambia lo que se
> ve. Necesita piezas nuevas del kit (`escritorio`, `balanza`, `figuras 'juez'`, más `etiquetas` ancladas: `VARIEDAD.md` §4). Hasta que existan,
> la escena renderizada (kit v2.1) sigue en `reel/reels/rincon-placeres-superiores/escena.js`.

`halo: { gancho: 56, giro: 54, idea: 50, 'giro-2': 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'utilitarismo', halo: { /* arriba */ },
  golpes: ['gancho:gana', 'giro:sabor', 'idea:probado', 'giro-2:placer', 'cierre:vídeos'],
  piezas: [
  // 1-3 · gancho y giro: el libro con luz y el móvil que pulsa; el móvil gana minuto a minuto, y deja mal sabor
  objeto({ id: 'objeto-escritorio', modelo: 'escritorio', x: 540, y: 1060, tam: 740, desde: 'gancho', hasta: 'giro:fin',   // caja desde y ≈ 760: portada limpia
           efectos: [{ en: 'gancho:libro', hace: 'ofrece' }, { en: 'gancho:gana', hace: 'engancha' }, { en: 'giro:sabor', hace: 'amarga' }] }),
  rotulo({ id: 'rotulo-por-que', texto: '¿Por qué?', tam: 'titular', tono: 'acento', x: 540, y: 1400, desde: 'giro:por', hasta: 'giro:fin' }),
  // 4-7 · idea: Mill; cuánto contra qué clase en una balanza; el juez que conoce los dos; Sócrates
  autor({ id: 'autor-mill', nombre: 'John Stuart Mill', anos: '1806-1873', obra: 'El utilitarismo, 1863', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:mill', hace: 'a-firma' }] }),
  linea({ id: 'linea-mill', x: 530, y: 1380, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:además',
          hitos: [{ ano: 1806, etiqueta: 'Nace Mill', ancla: 'idea:Mill' }, { ano: 1863, etiqueta: 'El utilitarismo', ancla: 'idea:placer' }] }),
  objeto({ id: 'objeto-balanza', modelo: 'balanza', x: 540, y: 1100, tam: 620, desde: 'idea:además', hasta: 'idea:decide',
           efectos: [{ en: 'idea:cuánto', hace: 'cantidad' }, { en: 'idea:clase', hace: 'clase' }],
           etiquetas: [{ lado: 'izq', texto: 'Cuánto', tono: 'neutro', en: 'idea:cuánto', hasta: 'idea:decide' },
                       { lado: 'der', texto: 'Qué clase', tono: 'acento', en: 'idea:clase', hasta: 'idea:decide' }] }),
  figuras({ id: 'figuras-juez', disposicion: 'juez', x: 540, y: 1020, tam: 560, desde: 'idea:decide', hasta: 'idea:resumió',
            acciones: [{ en: 'idea:probado', hace: 'sopesa' }, { en: 'idea:probado', hace: 'etiqueta', texto: 'Ha probado los dos' }] }),
  cita({ id: 'cita-mill', tipo: 'cita', x: 540, y: 1000, texto: 'Es mejor ser un Sócrates insatisfecho que un necio satisfecho.',
         resalta: ['satisfecho'], obra: 'Mill, El utilitarismo, cap. II · trad. propia', desde: 'idea:resumió', hasta: 'idea:fin' }),
  // 8 · giro-2: la objeción; la balanza ya no se asienta (¿medida con qué?)
  rotulo({ id: 'rotulo-objecion', texto: 'La objeción', tono: 'neutro', marca: 'punto', x: 540, y: 880, desde: 'giro-2', hasta: 'giro-2:fin' }),
  rotulo({ id: 'rotulo-medida', texto: '¿Calidad medida con qué?', tam: 'titular', tono: 'acento', x: 540, y: 1020,
          desde: 'giro-2:calidad', hasta: 'giro-2:fin' }),
  objeto({ id: 'objeto-balanza-2', modelo: 'balanza', estado: 'ambas', x: 540, y: 1330, tam: 440, desde: 'giro-2:calidad', hasta: 'giro-2:fin',
           efectos: [{ en: 'giro-2:calidad', hace: 'sin-unidad' }] }),
  // 9 · cierre: la apuesta (en disputa: nadie gana); el móvil sigue pulsando y el libro se queda
  objeto({ id: 'objeto-escritorio-2', modelo: 'escritorio', x: 540, y: 1000, tam: 740, desde: 'cierre', hasta: 'cierre:fin',
           efectos: [{ en: 'cierre:vídeos', hace: 'resiste' }],
           etiquetas: [{ cual: 'libro', texto: 'Sus libros', tono: 'acento', en: 'cierre:libros', hasta: 'cierre:fin' },
                       { cual: 'movil', texto: 'Más tardes de vídeos', tono: 'neutro', en: 'cierre:vídeos', hasta: 'cierre:fin' }] }),
  // 10 · cta
  cierre({ titulo: '¿Un vídeo más o un libro?' }),
] });
```

- **Elementos propios** (§14.1): `escritorio` (con `ofrece`, `engancha`, `amarga`, `resiste`), `balanza` (con `cantidad`, `clase`, `sin-unidad`) y `figuras 'juez'`.
- **Genéricas**: ninguna. Fuera: los dos `contraste`, el `medidor` de barras (el «esquema»), el icono de la balanza, el móvil suelto y el peón solo.
  Quedan 3 rótulos (¿Por qué?, La objeción y ¿Calidad medida con qué?).
- **Parpadeo** (§14.5): el móvil pulsa a 2 Hz con cambios de brillo moderados, nunca pantalla completa.
- La apuesta final **no gana ni tacha**: el libro se queda y el móvil pulsa; la voz dice «su apuesta» (la de Mill), no una verdad.
- La balanza de la objeción arranca con el estado `ambas` (cubos y gema ya puestos) y `sin-unidad` la desestabiliza: es la pregunta, no la respuesta.
- Colocación (provisional): el escritorio de gancho empieza en y ≈ 760 (portada limpia: nada por encima de 700 en `portada_t`); la balanza de la objeción queda bajo los dos rótulos (1135-1525).
- `idea:probado`, `idea:decide` y `giro-2:calidad` son los de la escena anterior; `idea:además`, `idea:cuánto`, `idea:clase` y `cierre:libros` salen del guion (frases 5 y 9).

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-3 | La tarde de vídeos frente al libro: ejemplo de la ficha (`ejemplo_real`), como aplicación. Mill no habla de pantallas | ficha: `ejemplo_real` |
| 4-5 y `autor-mill` | 1806-1873; *El utilitarismo* (en revista, 1861; libro, 1863): cantidad y calidad del placer | Ficha de autor `mill`; Mill, *Utilitarianism*, cap. II (https://www.gutenberg.org/ebooks/11224); SEP, «John Stuart Mill» (https://plato.stanford.edu/entries/mill/) |
| 6 y `figuras-juez` | El criterio: el juicio de quienes han experimentado los dos placeres («competent judges») | *Utilitarianism*, cap. II |
| 7 y `cita-mill` | «It is better to be a human being dissatisfied than a pig satisfied; better to be Socrates dissatisfied than a fool satisfied» | *Utilitarianism*, cap. II |
| 8 | La objeción: un criterio de calidad parece pedir un valor externo al placer (y la de Moore, falacia naturalista) | ficha: `matiz_experto`; SEP «Mill's Moral and Political Philosophy» (https://plato.stanford.edu/entries/mill-moral-political/) |
| 9 | «Quien conoce las dos cosas no cambia sus libros…»: la apuesta de Mill (los jueces competentes) llevada al ejemplo de la ficha; la voz dice «su apuesta» | ficha: `desarrollo` y `ejemplo_real` |
| post | La crisis de Mill a los veinte años | ficha: `desarrollo` (párrafo 1) |

**Cita de la ficha:** es la que va, como paráfrasis de la segunda mitad (la del cerdo no cabe ni hace falta).

## Riesgos de rigor

- **Sermón.** El reel no dice que ver vídeos sea malo: pregunta, da el criterio de Mill, da la objeción y llama
  «apuesta» a la conclusión.
- Mill no habló de pantallas: la frase 1-3 y el cierre son aplicación.
- El gancho es meta (el propio reel es un vídeo corto). Que no se lea como burla del espectador: la llamada es
  cómplice («a quien te ha mandado este vídeo»).

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- La objeción (frase 8) se graba entera y ningún contraste tiene `gana`.
- La cita lleva «paráfrasis», o el traductor si es literal.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-placeres-superiores --corriente utilitarismo
node reel/reel.mjs --reel rincon-placeres-superiores
node reel/qa/medir-fluida.mjs rincon-placeres-superiores
node reel/prueba-atempo.mjs rincon-placeres-superiores 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-placeres-superiores --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-placeres-superiores
node reel/reels/rincon-kit/web.mjs rincon-placeres-superiores
```

## Hecho

> F14a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md`). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12b, 2026-10-31 (t-a20f04). Kit v2.1.

- **Medidas:** 38.38 s, 5.42 MB, -14 LUFS, pico -1.5 dBTP; web 2.00 MB (720×1280, póster 720 y 360). 118 palabras, 3.35 pal/s, 0 huecos, solapes 0, alineado sin avisos.
- **atempo final:** 1 (elegido con `prueba-atempo` 1,00-1,16 desde la caché).
- **Peticiones de voz:** 1.
- **Cambios de guion:** Ninguno en el guion. D4, plan A: leído el inglés de *Utilitarianism* II en Gutenberg («better to be Socrates dissatisfied than a fool satisfied»); la losa es `cita` con «trad. propia». 1 petición.
- **Cambios de escena:** `contraste-tarde` baja 100 px (y 930→1030) y sale en `gancho:gana`; `medidor-minuto` y 1360→1370. Con la ficha, la portada tenía una caja en y = 609 y el contraste pisaba 0,4 s al medidor. El medidor del gancho queda pequeño al 33 %: es lo más flojo visualmente.
- **Avisos de whisper (palabras no coincidentes):** sócrates, insatisfecho; probables falsos (nombres propios y números en letras). Sin avisos de alineado.
- **Pendiente de escucha humana:** Que la frase 7 suena a cita y que «Sócrates» suena bien.
- Hoja de escucha: `ESCUCHA-LOTE3B.md`.


**F14b (2026-10-31, t-3e334d) · kit v3.0, escena nueva de la ficha.** Re-renderizado con la voz de la caché (0 peticiones a Gemini): 38.38 s, 6.84 MB, web 2.35 MB. 0 solapes, 0 huecos, portada limpia, `web.mjs` pasa. Cronología `linea-mill` (1806 «Nace Mill» → 1863 «El utilitarismo», y 1380, hasta `idea:además`): a y 1100 la moneda grande de `a-firma` (673-1113) la pisaba. `objeto-balanza` baja a y 1100 (rozaba el medallón a 1020). La cronología del autor es marca (DECISIONES §14.4), no cuenta para N. Hoja: `reel/reels/rincon-placeres-superiores/salida/rincon-placeres-superiores-fotogramas.png`.
