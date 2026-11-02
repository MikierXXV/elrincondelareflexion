# rincon-alienacion · «¿Esto lo hice yo?» · tanda 3a

Ficha del sitio: `content/es/ideas/alienacion.json` · corriente `marxismo` · acento `#C95D93` · autor `marx`
(1818-1883). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Candidato n.º 5 de
`../CANDIDATOS-2.md`.

## Objetivo

Que el espectador se haga la pregunta al acabar el día (¿puedo señalar algo y decir «esto lo hice yo»?) y se
lleve el concepto, no una consigna: si ni el producto ni el modo de hacerlo son tuyos, las horas dejan de
sentirse tuyas. Y el matiz que lo separa de una queja: **no es una sensación**, es una situación. Se puede estar
alienado y sentirse bien. **Sin** tono de mitin: es un concepto que se usa mucho más allá de la política.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Al final del día, ¿puedes señalar algo… y decir: esto lo hice yo? | clave `yo?` | señalar, decir, yo |
| 2 | `giro` | Mucha gente, no puede. | — | puede |
| 3 | `giro` | Revisa una parte, de un proceso que no controla, para alguien que no conoce. | clave `parte,` | revisa, parte, conoce |
| 4 | `idea` | Karl Marx lo analizó en mil ochocientos cuarenta y cuatro, y lo llamó: alienación. | clave `alienación.` | marx, alienación |
| 5 | `idea` | Si el producto no es tuyo, y el cómo tampoco… las horas, ya no las vives como tuyas. | clave `tuyas.` | producto, cómo, horas, tuyas |
| 6 | `idea` | Y el trabajo, que debería expresarte, acaba vaciándote. | — | debería, acaba, vaciándote |
| 7 | `giro-2` | Ojo: no habla de una sensación. Puedes estar alienado, y sentirte bien. | error `sensación.` | sensación, puedes, bien |
| 8 | `ejemplo` | Se nota al preguntar a qué te dedicas. | — | dedicas |
| 9 | `ejemplo` | Unos cuentan lo que hacen. Otros, dicen un puesto. | — | cuentan, puesto |
| 10 | `cierre` | Para Marx, eso no es falta de ganas: es cómo está organizado el trabajo. | clave `organizado` | ganas, organizado |
| 11 | `cta` | Envíaselo a quien responde, con el nombre de su puesto. | clave `Envíaselo` | envíaselo |

- **Palabras:** 124 · **pausas:** 32 (una cada 3,9; D1 de la revisión: frase 4 reescrita) · **frase más larga:** 18 · **suspensivos:** 2.
- **Duración prevista:** 40,7 s a 3,38 pal/s; 42,8 s a 3,2.
- **Portada:** `"portada": "¿Esto lo | hice yo?"`, `"portada_resaltar": "yo"`, `"portada_t": 1.0` (solo la caja de
  herramientas), `"portada_color": "#C95D93"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#C95D93"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- La frase 5 junta dos de las cuatro separaciones de Marx (producto y actividad) y la 6 la tercera (lo que
  debería expresarte). La cuarta (los demás como rivales) no cabe: va en el post.

## Escena (3D, kit v3 · F15a)

> Rediseño de F15a (`../VARIEDAD.md` §9, `../DECISIONES.md` §14). **Misma voz, mismo texto**: solo cambia lo que se ve. Necesita piezas nuevas:
> `figuras 'puesto'` y `cinta` (`VARIEDAD.md` §9.3). Hasta que existan, la escena renderizada (kit v2.1) sigue en `reel/reels/rincon-alienacion/escena.js`.
> La propuesta de §6 (`rio` con `forma: 'cinta'`) se cambia por un modelo propio `cinta`: `rio` es el protagonista de `flujo-y-permanencia` (3b) y §14.1 no deja repetirlo.

`halo: { gancho: 56, giro: 54, idea: 50, 'giro-2': 52, ejemplo: 54, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'marxismo', halo: { /* arriba */ },
  golpes: ['gancho:yo', 'giro:parte', 'idea:tuyas', 'giro-2:bien', 'ejemplo:puesto', 'cierre:organizado'],
  piezas: [
  // 1-2 · gancho: un taller; la persona termina algo entero y lo señala
  figuras({ id: 'figuras-taller', disposicion: 'puesto', modo: 'taller', x: 540, y: 1020, tam: 700, desde: 'gancho', hasta: 'giro:revisa',
            acciones: [{ en: 'gancho:final', hace: 'construye' }, { en: 'gancho:decir', hace: 'señala' }] }),
  rotulo({ id: 'rotulo-hice-yo', texto: 'Esto lo hice yo', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'gancho:decir', hasta: 'giro:parte', efectos: [{ en: 'giro:puede', hace: 'tacha' }] }),   // F11: con hasta 'giro:puede' la pieza salía antes de la tacha
  // 3 · giro: el mismo maniquí, ahora en una cinta: revisa una parte y el producto se va a alguien que no conoce
  figuras({ id: 'figuras-puesto', disposicion: 'puesto', modo: 'cinta', x: 540, y: 1020, tam: 720, desde: 'giro:revisa', hasta: 'giro:fin',
            etiquetas: [{ cual: 'producto', texto: 'Alguien que no conoce', tono: 'neutro', en: 'giro:alguien', hasta: 'giro:fin' }],   // F11: «conoce» cierra la escena
            acciones: [{ en: 'giro:revisa', hace: 'revisa' }, { en: 'giro:alguien', hace: 'se-lleva' }] }),
  rotulo({ id: 'rotulo-una-parte', texto: 'Una parte de un proceso', tono: 'neutro', marca: 'punto', x: 540, y: 1420,
           desde: 'giro:parte', hasta: 'giro:fin' }),
  // 4-6 · idea: Marx; la cinta sin persona: el producto se va, el cómo lo manda una palanca, las horas pasan en gris
  autor({ id: 'autor-marx', nombre: 'Karl Marx', anos: '1818-1883', obra: 'Manuscritos de economía y filosofía, 1844', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:marx', hace: 'a-firma' }] }),
  linea({ id: 'linea-marx', x: 530, y: 1150, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:producto',
          hitos: [{ ano: 1818, etiqueta: 'Nace Marx', ancla: 'idea:marx' }, { ano: 1844, etiqueta: 'Manuscritos', ancla: 'idea:alienación' }] }),
  objeto({ id: 'objeto-cinta', modelo: 'cinta', x: 540, y: 1190, tam: 720, desde: 'idea:producto', hasta: 'idea:fin',
           etiquetas: [{ cual: 'producto', texto: 'El producto', sub: 'No es tuyo', tono: 'neutro', en: 'idea:producto', hasta: 'idea:horas' },
                       { cual: 'como', texto: 'El cómo', sub: 'Tampoco', tono: 'neutro', en: 'idea:cómo', hasta: 'idea:horas' }],
           efectos: [{ en: 'idea:producto+0.3', hace: 'se-lleva' }, { en: 'idea:cómo+0.2', hace: 'manda' }, { en: 'idea:horas', hace: 'horas' }] }),
  rotulo({ id: 'rotulo-expresarte', texto: 'Debería expresarte', tam: 'titular', tono: 'acento', x: 540, y: 1440,
           desde: 'idea:debería', hasta: 'idea:fin', efectos: [{ en: 'idea:acaba', hace: 'tacha' }] }),   // F11: «vaciándote» cierra la escena y cae en la salida
  // 7 · giro-2: situación, no sensación: el pecho encendido (se siente bien) mientras la cinta sigue llevándose todo
  figuras({ id: 'figuras-bien', disposicion: 'puesto', modo: 'cinta', x: 540, y: 1010, tam: 700, desde: 'giro-2', hasta: 'giro-2:fin',
            etiquetas: [{ cual: 'pecho', texto: 'Te sientes bien', tono: 'neutro', en: 'giro-2:sentirte', hasta: 'giro-2:fin' }],
            acciones: [{ en: 'giro-2', hace: 'revisa' }, { en: 'giro-2:alienado', hace: 'se-lleva' }, { en: 'giro-2:sentirte', hace: 'bien' }] }),
  rotulo({ id: 'rotulo-situacion', texto: 'Una situación, no una sensación', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'giro-2:sensación', hasta: 'giro-2:fin' }),
  // 8-9 · ejemplo: «¿a qué te dedicas?» (un diálogo de verdad) con la cinta de fondo
  burbuja({ id: 'burbuja-dedicas', texto: '¿A qué te dedicas?', lado: 'der', quien: 'En una cena', tono: 'neutro',
            x: 540, y: 900, desde: 'ejemplo', hasta: 'ejemplo:fin' }),
  burbuja({ id: 'burbuja-hago', texto: 'Arreglo bicis.', lado: 'izq', tono: 'acento', pila: 'burbuja-dedicas',
            x: 540, y: 900, desde: 'ejemplo:cuentan', hasta: 'ejemplo:fin' }),
  burbuja({ id: 'burbuja-puesto', texto: 'Soy analista de nivel dos.', lado: 'izq', tono: 'neutro', pila: 'burbuja-hago',
            x: 540, y: 900, desde: 'ejemplo:puesto', hasta: 'ejemplo:fin' }),
  figuras({ id: 'figuras-fondo', disposicion: 'puesto', modo: 'cinta', x: 540, y: 1380, tam: 560, desde: 'ejemplo', hasta: 'ejemplo:fin',
            acciones: [{ en: 'ejemplo', hace: 'revisa' }] }),
  // 10 · cierre: la cinta entera y los hilos de quien la organiza
  objeto({ id: 'objeto-cinta-2', modelo: 'cinta', x: 540, y: 1000, tam: 720, desde: 'cierre', hasta: 'cierre:fin',
           etiquetas: [{ cual: 'como', texto: 'No es falta de ganas', tono: 'neutro', en: 'cierre:ganas', hasta: 'cierre:organizado' }],
           efectos: [{ en: 'cierre:organizado', hace: 'organiza' }] }),
  rotulo({ id: 'rotulo-organizado', texto: 'Cómo está organizado', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'cierre:organizado', hasta: 'cierre:fin' }),
  // 11 · cta
  cierre({ titulo: '¿Esto lo hice yo?' }),
] });
```

- **Elementos propios** (§14.1): `figuras 'puesto'` (`construye`, `señala`, `revisa`, `se-lleva`, `bien`; modos `taller` y `cinta`) y `cinta` (`se-lleva`, `manda`, `horas`, `organiza`). No salen en el 3b ni en el resto del 3a.
- **Genéricas**: 1 `burbuja` (el diálogo de la cena). Fuera: la fila de 7 peones, 2 iconos tubo (`caja`, `reloj`), el engranaje, la caja de herramienta, 2 `contraste`. Rótulos: de 4 a 5 (entra «Una situación, no una sensación» en lugar del contraste), ninguno apilado.
- Se pasa de «hice algo entero» (taller, una pieza que puedes señalar) a «reviso una parte» (cinta, muchas piezas iguales y ninguna tuya): es el reel entero en un cambio de escenario.
- Giro-2 sin tarjetas: el pecho del maniquí **enciende** (se siente bien) mientras la cinta sigue llevándose el producto; eso es «puedes estar alienado y sentirte bien» (la frase lo dice; el contraste decía lo mismo con dos cajas).
- Cronología: `linea-marx` 1818 → 1844 (los *Manuscritos* del medallón).
- Se conserva la `tacha` de «Esto lo hice yo» (F11).

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-3 | Ejemplo de la ficha (`ejemplo_real`): revisar una parte de un proceso que no controlas, para un cliente que no conoces | ficha: `ejemplo_real` |
| 4 y `autor-marx` | 1818-1883; *Manuscritos* de 1844, **publicados en 1932** (que el post lo diga) | Ficha de autor `marx`; SEP, «Karl Marx» (https://plato.stanford.edu/entries/marx/) |
| 5-6 y `contraste-ajeno` | Las separaciones: del producto, de la actividad y de la «esencia genérica» (la tercera es la frase 6). La cuarta, de los demás, va al post | Marx, *Manuscritos*, primer manuscrito, «El trabajo enajenado» (https://www.marxists.org/espanol/m-e/1840s/manuscritos/) |
| 7 y `contraste-situacion` | No es una sensación subjetiva sino una situación objetiva: se puede estar alienado sin sentirse mal | ficha: `desarrollo` (párrafo 3) |
| 8-9 | Ejemplo de la ficha: a qué te dedicas | ficha: `ejemplo_real` |
| 10 | «Para Marx» atribuye la tesis: no es un defecto personal, sino la organización del trabajo | ficha: `resumen` y `desarrollo` |
| post | El debate del «corte epistemológico» (Althusser) entre el Marx joven y el de *El capital* | ficha: `matiz_experto` |

**Cita de la ficha** («El trabajador se relaciona con el producto de su trabajo como con un objeto ajeno»,
*Manuscritos*, 1844): directa y sobre la idea. No va en pantalla para no cargar `idea`, pero va en el post con su
traducción comprobada (Rubio Llorente, Alianza, u otra publicada).

## Riesgos de rigor

- **Lectura política.** El reel no dice qué hacer ni culpa a nadie: describe un concepto y lo atribuye («para
  Marx»). Nada de «el capitalismo te roba» en voz, pantalla ni post.
- «Mucha gente» (frase 2) es la generalización suave de la ficha; no hay cifra y no se pone.
- La cuarta separación no está en la voz: el post la nombra para no dejar el concepto cojo.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- El cierre atribuye la tesis a Marx («Para Marx»).
- El post explica las cuatro separaciones, la fecha de publicación (1932) y el debate de Althusser.
- Ningún rótulo ni el post llevan consignas.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-alienacion --corriente marxismo
node reel/reel.mjs --reel rincon-alienacion
node reel/qa/medir-fluida.mjs rincon-alienacion
node reel/prueba-atempo.mjs rincon-alienacion 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-alienacion --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-alienacion
node reel/reels/rincon-kit/web.mjs rincon-alienacion
```

## Hecho

> F15a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md` §9). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12a, 2026-10-31. atempo 1,01 · 3,15 pal/s · 42,57 s · 6,18 MB (web 2,17 MB) · pico −1,5 dBTP · **1 petición** (tras el 429 de cuota del primer intento). D1 aplicada: frase 4 «Karl Marx lo analizó en mil ochocientos cuarenta y cuatro, y lo llamó: alienación.» (124 palabras, 32 pausas). Con la música a 0,1 el pico salía a −0,6/−0,7 dBTP con cualquier atempo (la mezcla da −1,5 y el AAC añade ~0,9 dB); se fijó `vol_musica: 0.07` en el guion, como en condicionamiento-operante, y sale −1,5. prueba-atempo: 1,01 sin avisos ni frases reescaladas. Sin cita en pantalla; el post cita los Manuscritos (leídos en castellano en marxists.org). Cuatro separaciones, 1932 y Althusser en el post. Whisper marca «revisa», «mil», «ochocientos», «cuarenta», «cuatro» y «unos»: probables falsos. Entre 11 y 15 s solo queda la firma de Marx en pantalla (sin hueco para el detector). Todo en verde.
