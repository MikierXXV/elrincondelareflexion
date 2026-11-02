# rincon-las-cuatro-verdades · «El primer día de vacaciones» · tanda 3a

Ficha del sitio: `content/es/ideas/las-cuatro-verdades.json` · corriente `filosofia-india` · acento `#878724` ·
autor `buda` (c. 480-400 a. C., datación discutida). Procedimiento común: `LEEME.md`, con lo que añade
`../DECISIONES.md` §13. Candidato n.º 4 de `../CANDIDATOS-2.md`.

## Objetivo

Que el espectador reconozca la escena (el primer día de vacaciones ya cuentas los que quedan) y entienda el
diagnóstico budista en su forma médica: hay un malestar de fondo, tiene una causa (aferrarse a lo que cambia), se
puede parar y hay un camino. **Sin** misticismo ni promesas de felicidad, y **sin** poner en boca del Buda
histórico palabras exactas: se dice «la tradición budista».

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Llevas meses esperando las vacaciones. Y el primer día… ya cuentas los que quedan. | clave `quedan.` | vacaciones, primer, quedan |
| 2 | `giro` | No falla el sitio, ni el tiempo, ni la compañía. | — | sitio, tiempo, compañía |
| 3 | `giro` | Falla otra cosa: estás sujetando algo, que se mueve. | clave `mueve.` | otra, sujetando, mueve |
| 4 | `idea` | La tradición budista lo plantea, como un médico. | — | budista, plantea, médico |
| 5 | `idea` | Hay un malestar, tiene causa, se puede parar… y hay un camino. | — | malestar, causa, parar, camino |
| 6 | `idea` | El malestar no es solo dolor. Es esa insatisfacción de fondo, que aparece hasta cuando todo va bien. | — | dolor, insatisfacción, bien |
| 7 | `idea` | Y la causa no es desear, sino aferrarse: querer que lo bueno no se acabe. | error `desear,` · clave `aferrarse:` | desear, aferrarse |
| 8 | `idea` | Pero todo lo compuesto, cambia. | — | compuesto, cambia |
| 9 | `cierre` | Así que la salida no es conseguir más, ni dejar de sentir: es cambiar cómo sujetas lo que pasa. | clave `sujetas` | salida, cambiar, sujetas |
| 10 | `cta` | Envíaselo a quien ya está pensando, en sus próximas vacaciones. | clave `Envíaselo` | envíaselo |

- **Palabras:** 120 · **pausas:** 28 (una cada 4,3) · **frase más larga:** 19 · **suspensivos:** 2.
- **Duración prevista:** 39,5 s a 3,38 pal/s; 41,5 s a 3,2.
- **Portada:** `"portada": "El primer día | de vacaciones"`, `"portada_resaltar": "vacaciones"`, `"portada_t": 1.0`
  (solo el sol), `"portada_color": "#878724"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#878724"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- Las palabras «causa» y «malestar» salen dos veces en `idea`: las anclas de la escena usan las que no se repiten.

## Escena (3D, kit v3 · F15a)

> Rediseño de F15a (`../VARIEDAD.md` §9, `../DECISIONES.md` §14). **Misma voz, mismo texto**: solo cambia lo que se ve. Necesita piezas nuevas:
> `figuras 'sujeta'` y `camino` (`VARIEDAD.md` §9.3). Hasta que existan, la escena renderizada (kit v2.1) sigue en `reel/reels/rincon-las-cuatro-verdades/escena.js`.
> La propuesta de `VARIEDAD.md` §6 (`carga`: piedra atada que se suelta) se cambia por `sujeta`: la voz no dice «soltar», dice «cambiar cómo sujetas»
> y «lo que se mueve» (frases 3 y 9); soltar sería otra tesis.

`halo: { gancho: 56, giro: 54, idea: 50, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'filosofia-india', halo: { /* arriba */ },
  golpes: ['gancho:quedan', 'giro:mueve', 'idea:camino', 'cierre:sujetas'],
  piezas: [
  // 1-3 · gancho y giro: alguien que sujeta con fuerza lo que espera; el orbe merma y tira; ni el sitio, ni el tiempo, ni la compañía
  figuras({ id: 'figuras-sujeta', disposicion: 'sujeta', x: 540, y: 1010, tam: 680, desde: 'gancho', hasta: 'giro:fin',
            etiquetas: [{ cual: 'izq', texto: 'El sitio', tono: 'neutro', en: 'giro:sitio', hasta: 'giro:otra' },
                        { cual: 'der', texto: 'El tiempo', tono: 'neutro', en: 'giro:tiempo', hasta: 'giro:otra' },
                        { cual: 'arriba', texto: 'La compañía', tono: 'neutro', en: 'giro:compañía', hasta: 'giro:otra' },
                        { cual: 'orbe', texto: 'Lo que sujetas se mueve', tono: 'acento', en: 'giro:sujetando', hasta: 'giro:fin' }],   // F11: «mueve» cierra la escena
            acciones: [{ en: 'gancho:primer', hace: 'merma' }, { en: 'gancho:cuentas', hace: 'aferra' },
                       { en: 'giro:sitio', hace: 'tacha', cual: 'izq' }, { en: 'giro:tiempo', hace: 'tacha', cual: 'der' },
                       { en: 'giro:compañía', hace: 'tacha', cual: 'arriba' }, { en: 'giro:sujetando', hace: 'tira' }] }),
  rotulo({ id: 'rotulo-quedan', texto: 'Quedan 13 días', tono: 'neutro', marca: 'punto', x: 540, y: 1420,
           desde: 'gancho:quedan', hasta: 'gancho:fin' }),
  // 4-8 · idea: el esquema médico como cuatro losas de un camino; la causa se aprieta; todo lo compuesto cambia
  autor({ id: 'autor-buda', nombre: 'Siddhartha Gautama', anos: 'c. 480-400 a. C. (discutido)', obra: 'el Buda · canon pali', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:plantea', hace: 'a-firma' }] }),
  linea({ id: 'linea-buda', x: 530, y: 1150, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:médico',
          hitos: [{ ano: -440, texto: 'c. 440 a. C.', etiqueta: 'El Buda (fechas discutidas)', ancla: 'idea:budista' }, { hoy: true, ancla: 'idea:plantea' }] }),
  objeto({ id: 'objeto-camino', modelo: 'camino', x: 540, y: 1270, tam: 700, desde: 'idea:médico+0.5', hasta: 'idea:compuesto',
           etiquetas: [{ cual: 'malestar', texto: 'Malestar', tono: 'neutro', en: 'idea:médico+0.5', hasta: 'idea:compuesto' },
                       { cual: 'causa', texto: 'Causa', tono: 'neutro', en: 'idea:tiene', hasta: 'idea:aferrarse' },
                       { cual: 'causa', texto: 'Aferrarse', sub: 'Que lo bueno no se acabe', tono: 'acento', en: 'idea:aferrarse', hasta: 'idea:compuesto' },
                       { cual: 'parar', texto: 'Se puede parar', tono: 'neutro', en: 'idea:parar', hasta: 'idea:compuesto' },
                       { cual: 'camino', texto: 'Camino', tono: 'acento', en: 'idea:camino', hasta: 'idea:compuesto' }],
           efectos: [{ en: 'idea:médico+0.5', hace: 'paso', n: 1 }, { en: 'idea:tiene', hace: 'paso', n: 2 }, { en: 'idea:parar', hace: 'paso', n: 3 },
                     { en: 'idea:camino', hace: 'paso', n: 4 }, { en: 'idea:insatisfacción', hace: 'foco', n: 1 },
                     { en: 'idea:aferrarse', hace: 'aprieta' }] }),
  rotulo({ id: 'rotulo-fondo', texto: 'Hasta cuando todo va bien', tam: 'titular', tono: 'acento', x: 540, y: 980,
           desde: 'idea:insatisfacción', hasta: 'idea:desear' }),
  cita({ id: 'cita-dhammapada', tipo: 'parafrasis', x: 540, y: 1000, texto: 'Todo lo compuesto es impermanente.', resalta: ['compuesto'],
         obra: 'Dhammapada, 277', desde: 'idea:compuesto', hasta: 'idea:fin' }),
  // 9 · cierre: el orbe sigue menguando; cambia cómo lo sujetas
  figuras({ id: 'figuras-sujeta-2', disposicion: 'sujeta', x: 540, y: 1010, tam: 680, desde: 'cierre', hasta: 'cierre:fin',
            acciones: [{ en: 'cierre', hace: 'aferra' }, { en: 'cierre', hace: 'merma' }, { en: 'cierre:cambiar', hace: 'afloja' }] }),
  rotulo({ id: 'rotulo-sujetas', texto: 'Cambiar cómo sujetas', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'cierre:cambiar', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: 'El primer día de vacaciones' }),
] });
```

- **Elementos propios** (§14.1): `figuras 'sujeta'` (`aferra`, `tira`, `merma`, `afloja`, `tacha`) y `camino` (`paso`, `foco`, `aprieta`). No salen en el 3b ni en el resto del 3a.
- **Genéricas**: ninguna. Fuera: 2 `piedra`, 1 icono tubo (`sol`), 1 `contraste` y 7 de los 10 rótulos (la pila de tres del giro y el cuadro de cuatro de la idea son ahora píldoras ancladas). Quedan 3 rótulos.
- **El mismo gesto, dos veces, distinto**: gancho y cierre usan la misma figura a propósito. Primero el agarre es de puño y el orbe tira; al final el agarre es de mano abierta y el orbe sigue menguando: no se deja de sentir, no se consigue más; cambia cómo se sujeta (frase 9).
- `merma` es **«todo lo compuesto cambia»** hecho visible; en el cierre sigue activa: lo que pasa sigue pasando.
- Cronología: `linea-buda`, hito `c. 440 a. C.` (centro del rango discutido 480-400 del medallón) hasta hoy. En el post, la fecha tradicional (c. 563-483) frente a la revisada.
- Ojo: «malestar» y «causa» salen dos veces en `idea`; las anclas usan `médico+0.5`, `tiene`, `parar`, `camino`, `insatisfacción`, `aferrarse`, `compuesto`, que no se repiten.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-3 | Ejemplo de la ficha (`ejemplo_real`): las vacaciones y «estás sujetando algo que se está moviendo» | ficha: `ejemplo_real` |
| 4-5 y píldoras | Las cuatro verdades (*dukkha*, origen, cese, sendero) del primer sermón. El esquema «como un médico» es una lectura tradicional (comentarios posteriores), por eso la voz dice «la tradición budista lo plantea» | *Dhammacakkappavattana Sutta*, SN 56.11 (https://www.accesstoinsight.org/tipitaka/sn/sn56/sn56.011.than.html); SEP, «The Buddha» (https://plato.stanford.edu/entries/buddha/); ficha: `resumen` |
| 6 | *Dukkha* no es solo dolor: insatisfacción de fondo, también cuando todo va bien | ficha: `desarrollo` (párrafo 1) |
| 7 y `contraste-causa` | La causa no es desear en general sino aferrarse (*taṇhā*, «sed»). **Ojo:** muchas traducciones dicen «deseo»; la frase sigue la ficha. Que el post explique *taṇhā* | ficha: `desarrollo`; SN 56.11 |
| 8 y `cita-dhammapada` | «Todo lo compuesto es impermanente» (*sabbe saṅkhārā aniccā*) | *Dhammapada* 277 (https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.20.budd.html) |
| 9 | La salida no es conseguir más ni dejar de sentir: cambiar la relación con lo que ocurre; evita los dos extremos | ficha: `desarrollo` (párrafos 2-3) |
| `autor-buda` | Fechas discutidas; el canon pali se fijó siglos después | Ficha de autor `buda`; ficha: `matiz_experto` |

**Cita de la ficha:** es la que va (*Dhammapada* 277), como paráfrasis salvo que se lea una traducción concreta.

## Riesgos de rigor

- **Atribución.** Nada de «Buda dijo…» con palabras exactas: «la tradición budista». El medallón lleva la fecha
  como discutida.
- «No es desear, sino aferrarse»: es la lectura de la ficha; el post aclara *taṇhā*.
- Que suene a autoayuda. El cierre no promete nada: dice qué cambia (cómo sujetas), no que vayas a ser feliz.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- La voz no atribuye frases literales al Buda.
- El post explica *dukkha* y *taṇhā* y que el canon se fijó por escrito siglos después.
- El post dice qué es el «camino» (la cuarta verdad): conducta ética, disciplina mental y comprensión, evitando los
  dos extremos (ficha: `desarrollo`, párrafo 3). Así el «cambiar cómo sujetas» del cierre no se queda en un truco
  mental. El contraste de la causa tacha «Desear» con el texto «En general» debajo, no «Desear» a secas.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-las-cuatro-verdades --corriente filosofia-india
node reel/reel.mjs --reel rincon-las-cuatro-verdades
node reel/qa/medir-fluida.mjs rincon-las-cuatro-verdades
node reel/prueba-atempo.mjs rincon-las-cuatro-verdades 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-las-cuatro-verdades --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-las-cuatro-verdades
node reel/reels/rincon-kit/web.mjs rincon-las-cuatro-verdades
```

## Hecho

> F15a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md` §9). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12a, 2026-10-31. atempo 1,01 · 3,26 pal/s · 40,03 s · 5,68 MB (web 2,02 MB) · pico −1,4 dBTP · **1 petición** (la primera tanda del día dio 429 de cuota en los 3 reintentos y se paró; tras renovarse la cuota salió a la primera). prueba-atempo: 1,01 sin avisos (2 frases reescaladas). Guion tal cual. Bug de la ficha corregido: el `b:` del contraste de la causa estaba dentro de un comentario `// F11` y la escena fallaba; ahora va en su línea (sin cambios de contenido, «En general» bajo «Desear»). `cita-dhammapada` como paráfrasis (Dhp 277 en inglés, Buddharakkhita). SN 56.11 leído; SEP «The Buddha» no reabierta. Whisper marca «falla» y «estás»: probables falsos, a confirmar al escuchar. Todo en verde.
