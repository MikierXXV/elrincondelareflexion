# rincon-tabula-rasa · «Imagina un color nuevo» · tanda 3a

Ficha del sitio: `content/es/ideas/tabula-rasa.json` · corriente `empirismo` · acento `#2E8CAC` · autor `locke`
(1632-1704). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Candidato n.º 2 de
`../CANDIDATOS-2.md`.

## Objetivo

Un reto que el espectador intenta y no supera en 2 segundos (como el del buen amigo de Sócrates): imaginar un
color nuevo. De ahí, la tesis de Locke: no traemos ideas puestas, todo el material entra por la experiencia y
la mente solo combina. Y el matiz que no se puede saltar: **la tesis fuerte no ha aguantado** (los bebés traen
expectativas muy pronto); lo que aguanta es el método de preguntar a cada idea de dónde viene.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Imagina un color, que no hayas visto nunca. | clave `color,` | color, nunca |
| 2 | `gancho` | No un tono raro, ni una mezcla: uno nuevo. | clave `nuevo.` | mezcla, uno, nuevo |
| 3 | `giro` | No puedes. Y un unicornio, en cambio, sí. | — | puedes, unicornio |
| 4 | `giro` | Porque el unicornio es caballo… más cuerno. | clave `cuerno.` | caballo, cuerno |
| 5 | `idea` | John Locke lo explicó, hace más de tres siglos. | — | locke, siglos |
| 6 | `idea` | Según él, la mente empieza como un papel en blanco. | clave `blanco.` | papel, blanco |
| 7 | `idea` | Todo lo que piensas entró antes por la experiencia: por los sentidos, o mirando tu propia mente. | clave `experiencia:` | todo, sentidos, mirando |
| 8 | `idea` | Y con esas piezas, combinas lo demás. Pero no fabricas una pieza nueva. | — | combinas, fabricas |
| 9 | `giro-2` | Ojo: hoy se sabe que no nacemos tan en blanco. Los bebés, muy pronto, ya tienen algunas expectativas. | error `blanco.` | ojo, blanco, bebés |
| 10 | `cierre` | Pero la prueba sigue sirviendo: pregúntale a cada idea, de dónde viene. | clave `viene.` | prueba, pregúntale, viene |
| 11 | `cta` | Envíaselo a quien dice que sus ideas son totalmente originales. | clave `Envíaselo` | envíaselo |

- **Palabras:** 121 · **pausas:** 30 (una cada 4,0) · **frase más larga:** 18 · **suspensivos:** 1.
- **Duración prevista:** 39,8 s a 3,38 pal/s; 41,9 s a 3,2.
- **Portada:** `"portada": "Imagina un | color nuevo"`, `"portada_resaltar": "color"`, `"portada_t": 1.0` (solo la
  bombilla), `"portada_color": "#2E8CAC"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#2E8CAC"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- La frase 3 dice «No puedes» a secas. Es lo que dice Locke (II, 2, 2), pero tiene un contraejemplo famoso, el
  tono de azul que falta de Hume. No cabe en la voz: va en el post (ver «Riesgos»).

## Escena (3D, kit v3 · F15a)

> Rediseño de F15a (`../VARIEDAD.md` §9, `../DECISIONES.md` §14). **Misma voz, mismo texto**: solo cambia lo que se ve. Necesita piezas nuevas:
> `piezas` y `hoja` (`VARIEDAD.md` §9.3). Hasta que existan, la escena renderizada (kit v2.1) sigue en `reel/reels/rincon-tabula-rasa/escena.js`.
> Locke habla de **papel** en blanco, no de tablilla de cera: por eso la pieza es `hoja` y no `tablilla`.

`halo: { gancho: 56, giro: 54, idea: 50, 'giro-2': 54, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'empirismo', halo: { /* arriba */ },
  golpes: ['gancho:nuevo', 'giro:cuerno', 'idea:experiencia', 'giro-2:bebés', 'cierre:viene'],
  piezas: [
  // 1-4 · gancho y giro: la bandeja de piezas simples; el hueco del color nuevo no se llena, el unicornio sí se monta
  objeto({ id: 'objeto-piezas', modelo: 'piezas', x: 540, y: 1000, tam: 600, desde: 'gancho', hasta: 'giro:fin',
           etiquetas: [{ cual: 'hueco', texto: 'No puedes', tono: 'neutro', en: 'giro:puedes', hasta: 'giro:unicornio' },
                       { cual: 'caballo', texto: 'Caballo', tono: 'neutro', en: 'giro:caballo', hasta: 'giro:fin' },
                       { cual: 'cuerno', texto: 'Cuerno', tono: 'acento', en: 'giro:cuerno', hasta: 'giro:fin' }],
           efectos: [{ en: 'gancho:nunca', hace: 'busca' }, { en: 'giro:puedes', hace: 'falla' }, { en: 'giro:unicornio', hace: 'ensambla' }] }),
  rotulo({ id: 'rotulo-color', texto: 'Un color nuevo', tam: 'titular', tono: 'acento', x: 540, y: 1400, desde: 'gancho:color', hasta: 'gancho:fin' }),
  // 5-8 · idea: Locke, el papel en blanco, las dos fuentes y las piezas que se combinan
  autor({ id: 'autor-locke', nombre: 'John Locke', anos: '1632-1704', obra: 'Ensayo sobre el entendimiento humano, 1690', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:siglos', hace: 'a-firma' }] }),
  linea({ id: 'linea-locke', x: 530, y: 1150, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:según',
          hitos: [{ ano: 1632, etiqueta: 'Nace Locke', ancla: 'idea:locke' }, { hoy: true, ancla: 'idea:siglos' }] }),
  objeto({ id: 'objeto-hoja', modelo: 'hoja', x: 540, y: 1270, tam: 540, desde: 'idea:papel', hasta: 'idea:fin',
           etiquetas: [{ cual: 'hoja', texto: 'Papel en blanco', tono: 'neutro', en: 'idea:papel', hasta: 'idea:todo' },
                       { cual: 'sentidos', texto: 'Sensación', sub: 'Los sentidos', tono: 'acento', en: 'idea:sentidos', hasta: 'idea:fin' },
                       { cual: 'reflexion', texto: 'Reflexión', sub: 'Tu propia mente', tono: 'acento', en: 'idea:mirando', hasta: 'idea:fin' }],
           efectos: [{ en: 'idea:sentidos', hace: 'marca', fuente: 'sentidos', n: 5 }, { en: 'idea:mirando', hace: 'marca', fuente: 'reflexion', n: 5 },
                     { en: 'idea:combinas', hace: 'combina' }, { en: 'idea:fabricas', hace: 'intenta' }] }),
  cita({ id: 'cita-locke', tipo: 'parafrasis', x: 540, y: 1000,
         texto: 'Ni el ingenio más alto puede inventar una sola idea simple nueva.',
         obra: 'Locke, Ensayo, II, 2, 2', desde: 'idea:combinas', hasta: 'idea:fin' }),
  // 9 · giro-2: la hoja ya traía algo
  objeto({ id: 'objeto-hoja-2', modelo: 'hoja', x: 540, y: 1020, tam: 560, desde: 'giro-2', hasta: 'giro-2:fin',
           etiquetas: [{ cual: 'previo', texto: 'Expectativas desde muy pronto', tono: 'neutro', en: 'giro-2:bebés', hasta: 'giro-2:fin' }],
           efectos: [{ en: 'giro-2:blanco', hace: 'previo' }] }),
  // 10 · cierre: cada pieza con su hilo hasta de dónde vino
  objeto({ id: 'objeto-piezas-2', modelo: 'piezas', estado: 'armado', x: 540, y: 1000, tam: 600, desde: 'cierre', hasta: 'cierre:fin',
           etiquetas: [{ cual: 'sentidos', texto: 'Sensación', tono: 'acento', en: 'cierre:pregúntale', hasta: 'cierre:fin' },
                       { cual: 'reflexion', texto: 'Reflexión', tono: 'acento', en: 'cierre:pregúntale', hasta: 'cierre:fin' }],   // F11: «viene» cierra la escena
           efectos: [{ en: 'cierre:pregúntale', hace: 'rastrea' }] }),
  rotulo({ id: 'rotulo-de-donde', texto: '¿De dónde viene?', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'cierre:pregúntale', hasta: 'cierre:fin' }),
  // 11 · cta
  cierre({ titulo: 'Imagina un color nuevo' }),
] });
```

- **Elementos propios** (§14.1): `piezas` (`busca`, `falla`, `ensambla`, `rastrea`) y `hoja` (`marca`, `combina`, `intenta`, `previo`). No salen en el 3b ni en el resto del 3a.
- **Genéricas**: ninguna. Fuera: 6 iconos tubo, 2 `libro`, 2 `contraste`. Rótulos: de 3 a 2 (Un color nuevo, ¿De dónde viene?); «Expectativas desde muy pronto» pasa a píldora de la hoja.
- Es el reel del lote **sin disposición de maniquí** (§14.3: al menos uno de cada lote no la usa).
- `falla`: el hueco no se llena (se resquebraja); es lo que dice la voz («No puedes»). El contraejemplo de Hume (el azul que falta) sigue en el post.
- `previo`: marcas tenues ya impresas en la hoja, en neutro: es el matiz de la frase 9 sin decir cuánto viene de serie.
- Cronología: `linea-locke` 1632 → hoy, como las tandas 1-2.
- Colocación (provisional): la cita (y 1000) y la hoja (y 1270) no se pisan; la hoja ya está desde `idea:papel` y la cita entra con `idea:combinas`.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-4 | Ejemplos de la ficha (`ejemplo_real`): el color nuevo y el unicornio por combinación | ficha: `ejemplo_real` |
| 5 y `autor-locke` | 1632-1704; el *Ensayo* sale en diciembre de 1689 con fecha de 1690: el rótulo dice 1690; «más de tres siglos» vale con las dos | Ficha de autor `locke`; SEP, «John Locke» (https://plato.stanford.edu/entries/locke/) |
| 6 y `objeto-papel` | II, 1, 2: «white paper, void of all characters». La expresión *tabula rasa* **no** está en el *Ensayo* (es de la tradición); el reel dice «papel en blanco» | Locke, *An Essay Concerning Human Understanding* (https://www.gutenberg.org/ebooks/10615) |
| 7 y `contraste-fuentes` | II, 1, 3-4: sensación y reflexión, las dos fuentes | *Essay* II, 1 |
| 8 y `cita-locke` | II, 2, 2: no está en poder «of the most exalted wit» inventar o formar «one new simple idea». Paráfrasis de esa frase | *Essay* II, 2, 2 |
| 9 | Hay capacidades y expectativas muy tempranas (objetos, número, agentes): la tesis fuerte no aguanta | ficha: `matiz_experto`; E. Spelke y K. Kinzler, «Core knowledge», *Developmental Science* 10 (1), 2007; SEP, «Rationalism vs. Empiricism» (https://plato.stanford.edu/entries/rationalism-empiricism/) |
| 10 | Lo que aguanta es el método: que cada idea acredite de dónde viene | ficha: `matiz_experto` |
| post | El tono de azul que falta (Hume, *Tratado* I, 1, 1, y *Investigación* II): un contraejemplo que el propio Hume admite | Hume, *Enquiry* §2 (https://www.gutenberg.org/ebooks/9662) |

**Cita que no se usa:** la de la ficha («Ningún conocimiento humano puede ir más allá de su experiencia») es
`tradicional`, una condensación: no va. Va II, 2, 2, que es la que dice lo del reto.

## Riesgos de rigor

- **El matiz es obligatorio** (frase 9): el innatismo fuerte está refutado, pero el empirismo fuerte también.
  Ni la voz ni el post dicen que Locke «tenía razón».
- «No puedes» (frase 3) tiene el contraejemplo de Hume: va en el post.
- Ni *tabula rasa* en pantalla como si fuera de Locke.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- La frase 9 se graba entera y el libro se tacha en «blanco».
- El post cita el tono de azul de Hume y dice que *tabula rasa* no es expresión de Locke.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-tabula-rasa --corriente empirismo
node reel/reel.mjs --reel rincon-tabula-rasa
node reel/qa/medir-fluida.mjs rincon-tabula-rasa
node reel/prueba-atempo.mjs rincon-tabula-rasa 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-tabula-rasa --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-tabula-rasa
node reel/reels/rincon-kit/web.mjs rincon-tabula-rasa
```

## Hecho

> F15a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md` §9). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12a, 2026-10-31. atempo 1,05 · 3,21 pal/s · 40,91 s · 6,27 MB (web 2,19 MB) · pico −1,5 dBTP · **1 petición**. prueba-atempo: 1,05 sin avisos y sin frases reescaladas. Guion tal cual. `cita-locke` como paráfrasis (II, 2, 2 leído en inglés en Gutenberg); el post cita el azul de Hume (leído) y dice que *tabula rasa* no es de Locke. Whisper marca «uno», «bebés» y «pregúntale» como no coincidentes: sin tocar, a confirmar al escuchar. Spelke/Kinzler y SEP no reabiertos. Todo en verde.
