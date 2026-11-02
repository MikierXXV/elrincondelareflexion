# rincon-flujo-y-permanencia · «El mismo río» · tanda 3b

Ficha del sitio: `content/es/ideas/flujo-y-permanencia.json` · corriente `presocraticos` · acento `#C36B31` · autor
`heraclito` (c. 540-480 a. C.). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Candidato
n.º 6 de `../CANDIDATOS-2.md`.

## Objetivo

La paradoja de siempre contada bien: el río no tiene ni una gota de ayer y es el mismo río. Lo que dura no es la
materia sino el patrón, y el cambio no amenaza la identidad, la sostiene. **Sin** el ejemplo del cuerpo que la ficha
trae (células de la piel, átomos): no se usa, porque es justo donde estaba el mito de los siete años
(`CANDIDATOS.md`, «Descartados»). En su lugar va la llama, que es imagen del propio Heráclito y modelo del kit.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Ni una gota de este río, estaba aquí ayer. Y es el mismo río. | clave `mismo` | gota, ayer, mismo |
| 2 | `giro` | Entonces, ¿qué es lo que sigue siendo igual? | — | sigue, igual |
| 3 | `idea` | Heráclito se lo preguntó en Éfeso, hace veinticinco siglos. | — | heráclito, éfeso, siglos |
| 4 | `idea` | Escribió, más o menos, que a quien entra en el mismo río… le llegan aguas distintas. | clave `distintas.` | escribió, entra, distintas |
| 5 | `idea` | Lo que dura no es el agua. Es el cauce, la forma, el ritmo. | clave `cauce,` | dura, agua, cauce, ritmo |
| 6 | `idea` | Para él, el cambio no amenaza la identidad. Es lo que la sostiene. | — | cambio, sostiene |
| 7 | `ejemplo` | Mira una llama: parece una cosa, pero es un proceso. | clave `proceso.` | llama, cosa, proceso |
| 8 | `ejemplo` | Solo existe… mientras algo se está consumiendo. | — | existe, consumiendo |
| 9 | `giro-2` | Ojo: ese «todo fluye» nos llega por Platón, y está en disputa. | — | fluye, platón, disputa |
| 10 | `cierre` | Lo que permanece no es la materia… es el patrón. | clave `patrón.` | materia, patrón |
| 11 | `cta` | Envíaselo a quien dice que ya no es quien era. | clave `Envíaselo` | envíaselo |

- **Palabras:** 123 · **pausas:** 29 (una cada 4,2) · **frase más larga:** 16 · **suspensivos:** 3 (el tope).
- **Duración prevista:** 40,4 s a 3,38 pal/s; 42,5 s a 3,2.
- **Portada:** `"portada": "El mismo río | con otra agua"`, `"portada_resaltar": "agua"`, `"portada_t": 1.0` (solo la
  roca con el agua), `"portada_color": "#C36B31"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#C36B31"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- «Ni una gota de este río estaba aquí ayer» vale para un río que corre (es lo que dice la ficha: «ni una sola gota
  del agua que lo forma hoy estaba ahí ayer»); no se generaliza a lagos ni a cifras.

## Escena (3D, kit v3 · F14a)

> Rediseño visual de F14a (`../VARIEDAD.md`, `../DECISIONES.md` §14). **Mismas anclas de voz, misma voz y mismo texto**: solo cambia lo que se
> ve. Necesita piezas nuevas del kit (`rio`, `vela`, `figuras 'vado'`, más `etiquetas` ancladas: `VARIEDAD.md` §4). Hasta que existan, la escena
> renderizada (kit v2.1) sigue en `reel/reels/rincon-flujo-y-permanencia/escena.js`.

`halo: { gancho: 56, giro: 54, idea: 50, ejemplo: 54, 'giro-2': 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'presocraticos', halo: { /* arriba */ },
  golpes: ['gancho:mismo', 'giro:igual', 'idea:distintas', 'ejemplo:proceso', 'giro-2:disputa', 'cierre:patrón'],
  piezas: [
  // 1-2 · gancho y giro: un río de partículas; una gota de acento se va y las orillas dicen «el mismo»
  objeto({ id: 'objeto-rio', modelo: 'rio', x: 540, y: 980, tam: 640, desde: 'gancho', hasta: 'giro:fin',
           efectos: [{ en: 'gancho:gota', hace: 'tinta' }, { en: 'gancho:mismo', hace: 'cauce' }] }),
  rotulo({ id: 'rotulo-mismo-rio', texto: 'El mismo río', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'gancho:mismo', hasta: 'gancho:fin' }),
  rotulo({ id: 'rotulo-que-sigue', texto: '¿Qué sigue igual?', tono: 'neutro', marca: 'punto', x: 540, y: 1400,
           desde: 'giro', hasta: 'giro:fin' }),
  // 3-6 · idea: Heráclito, el fragmento, y una persona que entra en el río y recibe agua nueva
  autor({ id: 'autor-heraclito', nombre: 'Heráclito de Éfeso', anos: 'c. 540-480 a. C.', obra: 'fragmentos (Diels-Kranz)', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:éfeso', hace: 'a-firma' }] }),
  linea({ id: 'linea-heraclito', x: 530, y: 1150, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:escribió',
          hitos: [{ ano: -540, texto: 'c. 540 a. C.', etiqueta: 'Heráclito', ancla: 'idea:Heráclito' }, { hoy: true, ancla: 'idea:siglos' }] }),
  cita({ id: 'cita-b12', tipo: 'parafrasis', x: 540, y: 930,
         texto: 'A quienes entran en los mismos ríos les llegan aguas distintas, y distintas.',
         obra: 'Heráclito, fragmento B12', desde: 'idea:escribió', hasta: 'idea:dura' }),
  figuras({ id: 'figuras-vado', disposicion: 'vado', x: 540, y: 1420, tam: 540, desde: 'idea:entra', hasta: 'idea:fin',
            acciones: [{ en: 'idea:entra', hace: 'entra' }, { en: 'idea:distintas', hace: 'otra' },
                       { en: 'idea:agua', hace: 'etiqueta', texto: 'El agua cambia', sobre: 'agua' },
                       { en: 'idea:cauce', hace: 'cauce' },
                       { en: 'idea:cauce', hace: 'etiqueta', texto: 'El cauce dura', sobre: 'cauce' }] }),
  rotulo({ id: 'rotulo-sostiene', texto: 'El cambio la sostiene', tam: 'titular', tono: 'acento', x: 540, y: 1000,
           desde: 'idea:cambio', hasta: 'idea:fin' }),
  // 7-8 · ejemplo: la vela; la cera baja y la llama sigue igual
  objeto({ id: 'objeto-vela', modelo: 'vela', x: 540, y: 960, tam: 440, desde: 'ejemplo', hasta: 'ejemplo:fin',
           efectos: [{ en: 'ejemplo:proceso', hace: 'late' }, { en: 'ejemplo:existe', hace: 'consume', dur: 6 }] }),
  rotulo({ id: 'rotulo-proceso', texto: 'Un proceso, no una cosa', tono: 'neutro', marca: 'punto', x: 540, y: 1400,
           desde: 'ejemplo:proceso', hasta: 'ejemplo:fin' }),
  // 9 · giro-2: la lectura está en disputa (nadie gana)
  rotulo({ id: 'rotulo-disputa', texto: 'Lectura en disputa', tono: 'neutro', marca: 'punto', x: 540, y: 820,
           desde: 'giro-2', hasta: 'giro-2:fin' }),
  contraste({ id: 'contraste-lectura', disposicion: 'columnas', y: 1080, desde: 'giro-2:fluye', hasta: 'giro-2:fin',
              a: { titulo: 'Todo fluye', texto: 'La lectura de Platón', tono: 'neutro' },
              b: { titulo: 'Unidad de opuestos', texto: 'Otra lectura', tono: 'neutro' }, entra_b: 'giro-2:disputa' }),
  // 10 · cierre: el mismo río, ahora con un remolino que se queda mientras el agua pasa
  objeto({ id: 'objeto-rio-2', modelo: 'rio', x: 540, y: 980, tam: 600, desde: 'cierre', hasta: 'cierre:fin',
           efectos: [{ en: 'cierre:materia', hace: 'renueva' }, { en: 'cierre:patrón', hace: 'remolino' },
                     { en: 'cierre:patrón', hace: 'cauce' }] }),
  rotulo({ id: 'rotulo-patron', texto: 'Lo que dura es el patrón', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'cierre:patrón', hasta: 'cierre:fin' }),
  // 11 · cta
  cierre({ titulo: 'El mismo río' }),
] });
```

- **Elementos propios** (§14.1): `rio` (con `tinta`, `cauce`, `renueva`, `remolino`), `vela` (con `consume`) y `figuras 'vado'`.
- **Genéricas**: 1 `contraste` (la disputa abierta, **sin** `gana` ni `tacha`: DECISIONES §7, KIT §6.5), 6 rótulos y ninguna pila. Fuera: `piedra`,
  `vaso`, `llama` y el segundo `contraste` (vaso/piedra), sustituido por el vado con sus dos píldoras «El agua cambia» / «El cauce dura».
- `piedra` con la cinta de agua sigue en el catálogo; aquí ya no se usa. La roca del viejo `objeto-rio` pasa a ser las orillas de `rio`.
- `cita-b12` sin `resalta` (paráfrasis de paráfrasis, KIT §6.3). El ejemplo de las células sigue **sin** usarse.
- Colocación (provisional, a ver con `vista.mjs --cajas`): cita 900-1110, `vado` bajo ella (1140-1540). El río de gancho y cierre no lleva nada encima.
- Reserva si el río de partículas no se lee al 33 %: `modelo: 'piedra'` (el de la escena anterior) en gancho y cierre.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1 | El río que no tiene el agua de ayer: ejemplo de la ficha | ficha: `desarrollo` (párrafo 1) |
| 3 y `autor-heraclito` | c. 540-480 a. C., Éfeso; «veinticinco siglos» redondea | Ficha de autor `heraclito`; SEP, «Heraclitus» (https://plato.stanford.edu/entries/heraclitus/) |
| 4 y `cita-b12` | DK 22 B12: «sobre los que entran en los mismos ríos fluyen aguas distintas y distintas». Es paráfrasis; la ficha cita la fórmula tradicional («No es posible bañarse dos veces en el mismo río», B91), que no se usa | SEP «Heraclitus», §3; texto griego y traducción en la edición de Kirk-Raven-Schofield, *Los filósofos presocráticos* (Gredos), u otra publicada |
| 5-6 | Lo que dura es la forma, no la materia; el cambio como condición de la identidad | ficha: `resumen` y `desarrollo` |
| 7-8 | La llama como proceso que solo existe mientras consume (ejemplo de la ficha; el fuego es central en Heráclito, B30) | ficha: `ejemplo_real`; SEP «Heraclitus» |
| 9 y `contraste-lectura` | El flujo universal es la lectura de Platón (*Crátilo* 402a) y puede ser una caricatura; la otra lectura habla de la unidad de los opuestos | ficha: `matiz_experto`; Platón, *Crátilo* 402a |

**Cita que no se usa:** la de la ficha («No es posible bañarse dos veces en el mismo río») es `tradicional`
(B91, reformulada). Va B12, que es la que la SEP da como más fiable.

**Ejemplo de la ficha que no se usa:** «todas las células de tu piel se sustituyen cada pocas semanas, y buena
parte de los átomos…». Aunque no repite el mito de los siete años, generaliza («todas»): no va ni en voz ni en el post.

## Riesgos de rigor

- Lo de Platón: la frase 9 lo dice como disputa, sin decir quién tiene razón.
- No cifras biológicas (arriba).
- «Heráclito se lo preguntó»: es narración, no cita. Lo que se le atribuye es B12, y como paráfrasis.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- Ni la voz ni el post usan el ejemplo de las células.
- La cita en pantalla es B12 y lleva «paráfrasis».
- El post explica la disputa sobre la lectura de Platón y precisa que Platón da la lectura (*Crátilo* 402a, «todo se
  mueve y nada permanece»), mientras que la fórmula *panta rhei* es más tardía (Simplicio). La voz dice «ese "todo
  fluye"» por la lectura, no por la fórmula.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-flujo-y-permanencia --corriente presocraticos
node reel/reel.mjs --reel rincon-flujo-y-permanencia
node reel/qa/medir-fluida.mjs rincon-flujo-y-permanencia
node reel/prueba-atempo.mjs rincon-flujo-y-permanencia 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-flujo-y-permanencia --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-flujo-y-permanencia
node reel/reels/rincon-kit/web.mjs rincon-flujo-y-permanencia
```

## Hecho

> F14a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md`). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12b, 2026-10-31 (t-a20f04). Kit v2.1.

- **Medidas:** 40.33 s, 6.19 MB, -14 LUFS, pico -1.3 dBTP; web 2.17 MB (720×1280, póster 720 y 360). 123 palabras, 3.31 pal/s, 0 huecos, solapes 0, alineado sin avisos.
- **atempo final:** 1 (elegido con `prueba-atempo` 1,00-1,16 desde la caché).
- **Peticiones de voz:** 2.
- **Cambios de guion:** Cuatro comas añadidas (frases 3, 9, 10 y 11; mismas palabras) tras salir la 1.ª toma a 3,42 pal/s con `atempo` 1,00 (§13.1): «preguntó, en Éfeso», «permanece, no es», «dice, que ya» y «“todo fluye”, nos». 2 peticiones.
- **Cambios de escena:** Sin cambios sobre la ficha.
- **Avisos de whisper (palabras no coincidentes):** heráclito, éfeso, veinticinco, entra; probables falsos (nombres propios y números en letras). Sin avisos de alineado.
- **Pendiente de escucha humana:** Que «Heráclito» y «Éfeso» suenan bien (whisper los marca como no coincidentes, probable falso) y «veinticinco».
- Hoja de escucha: `ESCUCHA-LOTE3B.md`.


**F14b (2026-10-31, t-3e334d) · kit v3.0, escena nueva de la ficha.** Re-renderizado con la voz de la caché (0 peticiones a Gemini): 40.33 s, 7.37 MB, web 2.56 MB. 0 solapes, 0 huecos, portada limpia, `web.mjs` pasa. Cronología `linea-heraclito` (c. 540 a. C. → hoy, y 1150, hasta `idea:escribió`). `cita-b12` sube a y 930 y `vado` baja a y 1420 (a 1340 la cita pisaba la cabeza del maniquí; a 1470 el vado entraba en la zona de interfaz inferior). La cronología del autor es marca (DECISIONES §14.4), no cuenta para N. Hoja: `reel/reels/rincon-flujo-y-permanencia/salida/rincon-flujo-y-permanencia-fotogramas.png`.
