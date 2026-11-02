# rincon-eterno-retorno · «Esta semana, infinitas veces» · tanda 3a

Ficha del sitio: `content/es/ideas/eterno-retorno.json` · corriente `existencialismo` · acento `#BE5AC5` · autor
`nietzsche` (1844-1900). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Candidato n.º 3
de `../CANDIDATOS-2.md`.

## Objetivo

Que el espectador haga la prueba con su propia semana mientras lo ve. Y que entienda qué es: **no una teoría
del tiempo, sino una prueba** que separa lo que vives de verdad de lo que solo aguantas esperando otra cosa.
Sin consuelo ni autoayuda: la prueba no promete nada, enseña algo.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Piensa en esta semana, tal cual. ¿La repetirías? | clave `repetirías?` | semana, repetirías |
| 2 | `gancho` | Ahora, imagina repetirla… infinitas veces, sin cambiar nada. | clave `infinitas` | infinitas, nada |
| 3 | `giro` | Si te ha dado un escalofrío, no te pasa solo a ti. | — | escalofrío, ti |
| 4 | `idea` | Friedrich Nietzsche propuso esa prueba, en mil ochocientos ochenta y dos. | — | nietzsche, prueba |
| 5 | `idea` | Un demonio te dice: vivirás esta vida otra vez, con cada dolor y cada placer, en el mismo orden. | — | demonio, vivirás, orden |
| 6 | `idea` | Lo que importa no es si es verdad, sino qué sientes al oírlo. | clave `sientes` | importa, verdad, sientes |
| 7 | `idea` | Y no vale editar: no puedes quedarte con lo aprendido… y borrar lo que costó. | clave `editar:` | editar, aprendido, borrar |
| 8 | `ejemplo` | Mucha gente encuentra dos cosas: tramos que repetirían, sin dudar, y días enteros… que solo dejaban pasar. | — | tramos, días, pasar |
| 9 | `cierre` | Esos días son, justo, lo que la prueba quiere que veas. | clave `veas.` | prueba, veas |
| 10 | `cta` | Envíaselo a quien vive esperando el viernes. | clave `Envíaselo` | envíaselo |

- **Palabras:** 121 · **pausas:** 29 (una cada 4,2) · **frase más larga:** 19 · **suspensivos:** 3 (el tope para
  121 palabras).
- **Duración prevista:** 39,8 s a 3,38 pal/s; 41,9 s a 3,2.
- **Portada:** `"portada": "Esta semana, | infinitas veces"`, `"portada_resaltar": "infinitas"`, `"portada_t": 1.0`
  (solo el bucle), `"portada_color": "#BE5AC5"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#BE5AC5"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- La pregunta de la frase 1 **no** lleva pausa de demostración: se contesta sola con la frase 2.

## Escena (3D, kit v3 · F15a)

> Rediseño de F15a (`../VARIEDAD.md` §9, `../DECISIONES.md` §14). **Misma voz, mismo texto**: solo cambia lo que se ve. Necesita piezas nuevas:
> `semana` y `figuras 'eco'` (`VARIEDAD.md` §9.3). Hasta que existan, la escena renderizada (kit v2.1) sigue en `reel/reels/rincon-eterno-retorno/escena.js`.
> No se usa `arena` con `voltea` (propuesta de `VARIEDAD.md` §6): ya es la protagonista de `el-tiempo-en-el-alma` (3b) y §14.1 impide repetirla.

`halo: { gancho: 56, giro: 54, idea: 50, ejemplo: 54, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'existencialismo', halo: { /* arriba */ },
  golpes: ['gancho:infinitas', 'giro:escalofrío', 'idea:sientes', 'ejemplo:pasar', 'cierre:veas'],
  piezas: [
  // 1-2 · gancho: la semana como circuito de siete días; una vuelta, otra, y las copias hasta el infinito
  objeto({ id: 'objeto-semana', modelo: 'semana', x: 540, y: 1000, tam: 680, desde: 'gancho', hasta: 'gancho:fin',
           efectos: [{ en: 'gancho:semana', hace: 'gira' }, { en: 'gancho:repetirías', hace: 'gira' }, { en: 'gancho:infinitas', hace: 'eco' }] }),
  rotulo({ id: 'rotulo-semana', texto: 'Esta semana, tal cual', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'gancho:semana', hasta: 'gancho:fin' }),
  // 3 · giro: el escalofrío
  figuras({ id: 'figuras-escalofrio', disposicion: 'eco', copias: 0, x: 540, y: 1180, tam: 640, desde: 'giro', hasta: 'giro:fin',
            acciones: [{ en: 'giro:escalofrío', hace: 'escalofrio' }] }),
  rotulo({ id: 'rotulo-no-solo', texto: 'No te pasa solo a ti', tono: 'neutro', marca: 'punto', x: 540, y: 860,
           desde: 'giro:escalofrío', hasta: 'giro:fin' }),
  // 4-7 · idea: Nietzsche, el demonio y la prueba
  autor({ id: 'autor-nietzsche', nombre: 'Friedrich Nietzsche', anos: '1844-1900', obra: 'La gaya ciencia, 1882', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:prueba', hace: 'a-firma' }] }),
  linea({ id: 'linea-nietzsche', x: 530, y: 1150, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:demonio',
          hitos: [{ ano: 1844, etiqueta: 'Nace Nietzsche', ancla: 'idea:nietzsche' }, { ano: 1882, etiqueta: 'La gaya ciencia', ancla: 'idea:prueba' }] }),
  burbuja({ id: 'burbuja-demonio', texto: 'Vivirás esta vida otra vez.', lado: 'izq', quien: 'Un demonio', tono: 'acento',
            x: 540, y: 920, desde: 'idea:demonio', hasta: 'idea:importa' }),
  figuras({ id: 'figuras-eco', disposicion: 'eco', copias: 3, x: 540, y: 1300, tam: 680, desde: 'idea:demonio', hasta: 'idea:fin',
            etiquetas: [{ quien: 'a', texto: 'Lo aprendido', tono: 'acento', en: 'idea:aprendido', hasta: 'idea:fin' },
                        { quien: 'copia', texto: 'Lo que costó', tono: 'neutro', en: 'idea:borrar', hasta: 'idea:fin' }],
            acciones: [{ en: 'idea:vivirás', hace: 'vive' }, { en: 'idea:orden', hace: 'repite' }, { en: 'idea:editar', hace: 'edita', cual: 'dolor' }] }),
  cita({ id: 'cita-gaya', tipo: 'parafrasis', x: 540, y: 1000,
         texto: 'Esta vida tendrás que vivirla una vez más, e innumerables veces más.',
         obra: 'Nietzsche, La gaya ciencia, §341', desde: 'idea:importa', hasta: 'idea:editar' }),
  // 8 · ejemplo: lo que repetirías y lo que dejabas pasar, sobre la misma semana
  objeto({ id: 'objeto-semana-2', modelo: 'semana', x: 540, y: 1000, tam: 680, desde: 'ejemplo', hasta: 'ejemplo:fin',
           etiquetas: [{ cual: 'repites', texto: 'Lo repetirías', tono: 'acento', en: 'ejemplo:tramos', hasta: 'ejemplo:fin' },
                       { cual: 'pasas', texto: 'Lo dejabas pasar', tono: 'neutro', en: 'ejemplo:días', hasta: 'ejemplo:fin' }],
           efectos: [{ en: 'ejemplo:tramos', hace: 'repite', dias: [1, 2, 4] }, { en: 'ejemplo:días', hace: 'pasa', dias: [0, 3, 5, 6] }] }),
  // 9 · cierre: los días que se dejaron pasar, resaltados
  objeto({ id: 'objeto-semana-3', modelo: 'semana', estado: 'marcada', x: 540, y: 1000, tam: 640, desde: 'cierre', hasta: 'cierre:fin',
           efectos: [{ en: 'cierre:días', hace: 'mira' }] }),
  rotulo({ id: 'rotulo-dejas-pasar', texto: 'Los días que dejas pasar', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'cierre:días', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: 'Esta semana, infinitas veces' }),
] });
```

- **Elementos propios** (§14.1): `semana` (`gira`, `eco`, `repite`, `pasa`, `mira`) y `figuras 'eco'` (`escalofrio`, `vive`, `repite`, `edita`). No salen en el 3b ni en el resto del 3a.
- **Genéricas**: 1 `burbuja` (el demonio es un diálogo de verdad). Fuera: 3 peones, 2 iconos tubo (`bucle`, `ojo`), 2 `contraste`. Los 3 rótulos se quedan.
- `edita`: una mano de acento intenta quitar el gesto de dolor de la primera copia; se borra y vuelve idéntica, y las demás lo repiten. Es el «no vale editar» sin tarjetas. Las etiquetas «Lo aprendido» / «Lo que costó» sustituyen al contraste.
- Las copias de `eco` van **sólidas y cada vez más pálidas** (no en aristas), para no parecerse a `fantasma` de `ren-y-li` (3b).
- Cronología: `linea-nietzsche` 1844 → 1882 (la de *La gaya ciencia* del medallón).
- Última palabra de la escena: `ejemplo:pasar` y `cierre:veas` no se usan como ancla de acción (F11); `pasa` va en `días`.
- Colocación (provisional): `figuras-eco` va a y 1300 para dejar libre la franja de la cita (900-1110).

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-3 | La prueba aplicada a la semana: ejemplo de la ficha | ficha: `ejemplo_real` |
| 4 y `autor-nietzsche` | 1844-1900; *La gaya ciencia*, libro IV, 1882 | Ficha de autor `nietzsche`; SEP, «Friedrich Nietzsche» (https://plato.stanford.edu/entries/nietzsche/) |
| 5 y `cita-gaya` | §341 «El peso más pesado»: un demonio, «esta vida… tendrás que vivirla una vez más e innumerables veces más», cada dolor y cada placer en el mismo orden | Nietzsche, *La gaya ciencia* §341 (trad. de J. L. López y López de Lizaga, Tecnos, u otra publicada); alemán en Nietzsche Source (http://www.nietzschesource.org/#eKGWB/FW-341) |
| 6 | Importa qué te pasa al oírlo, no si es verdad: lectura de la ficha | ficha: `desarrollo` |
| 7 | No vale quedarse con lo aprendido y borrar el precio | ficha: `desarrollo` (párrafo 2) |
| 8 | «Mucha gente descubre dos cosas»: es la generalización de la ficha («la mayoría»), rebajada | ficha: `ejemplo_real` |
| post | ¿Tesis cosmológica o imperativo ético? Se discute; la ética es hoy mayoritaria, pero hay notas que apuntan a la otra | ficha: `matiz_experto` |

**Cita que no se usa:** la de la ficha («Quien tiene un porqué para vivir soporta casi cualquier cómo»,
*Crepúsculo de los ídolos*) es real pero no trata del eterno retorno (DECISIONES §7).

## Riesgos de rigor

- Decir que Nietzsche **creía** que la vida se repite. La voz dice «propuso esa prueba», y el post explica la
  disputa sobre la lectura cosmológica.
- Que suene a «vive cada día como si fuera el último». El cierre no da consejo: dice lo que la prueba enseña.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- No aparece la cita del «porqué» ni ninguna otra que no sea de §341.
- El post dice que la lectura (prueba ética o tesis sobre el tiempo) está en disputa.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-eterno-retorno --corriente existencialismo
node reel/reel.mjs --reel rincon-eterno-retorno
node reel/qa/medir-fluida.mjs rincon-eterno-retorno
node reel/prueba-atempo.mjs rincon-eterno-retorno 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-eterno-retorno --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-eterno-retorno
node reel/reels/rincon-kit/web.mjs rincon-eterno-retorno
```

## Hecho

> F15a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md` §9). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12a, 2026-10-31. atempo 1,11 · 3,14 pal/s · 41,77 s · 6,29 MB (web 2,21 MB) · pico −1,4 dBTP · **1 petición** (un 429 suelto se resolvió con un reintento de la tubería). D5 aplicada («cada dolor y cada placer»). prueba-atempo: 1,11 sin avisos (2 frases reescaladas). Guion tal cual. §341 leído en la traducción inglesa de Common (PG 52881); el alemán no se pudo abrir, y el post lo dice. Whisper marca «mil», «ochocientos», «ochenta» y «mucha»: a confirmar al escuchar. Todo en verde.
