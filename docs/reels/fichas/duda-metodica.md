# rincon-duda-metodica · «¿Estás soñando ahora mismo?» · tanda 3a

Ficha del sitio: `content/es/ideas/duda-metodica.json` · corriente `racionalismo` · acento `#8F72D2` · autor
`descartes` (1596-1650). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13 («Tandas
siguientes»). Candidato n.º 1 de `../CANDIDATOS-2.md`.

## Objetivo

Que quien lo vea se lo pregunte de verdad: ¿cómo sé que ahora no estoy soñando? Y que se lleve el método, no
solo la frase: Descartes duda a propósito y por capas (los sentidos, el mundo, las matemáticas) para ver si algo
aguanta. Aguanta una cosa: que hay alguien dudando. **Sin** vender la duda como escepticismo: es una herramienta.

## Guion

Puntuado ya para el ritmo (DECISIONES §13.1): una pausa de puntuación cada 3,3 palabras. Las comas «de más»
(«Anoche, dentro del sueño, …») están a propósito y se graban tal cual.

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | ¿Cómo sabes, ahora mismo, que no estás soñando? | clave `soñando?` | soñando |
| 2 | `gancho` | Anoche, dentro del sueño, también estabas seguro. | clave `seguro.` | anoche, seguro |
| 3 | `giro` | Y no hay ninguna señal segura, desde dentro, que lo distinga. | — | señal, segura, distinga |
| 4 | `idea` | Descartes llevó esa duda, a propósito, hasta el final. | — | descartes, propósito |
| 5 | `idea` | Primero, los sentidos: a veces engañan. | — | sentidos, engañan |
| 6 | `idea` | Luego, el mundo entero: podría ser un sueño. | — | luego, sueño |
| 7 | `idea` | Y al final, hasta las sumas: imaginó un genio maligno… que le engañara siempre. | clave `maligno…` | sumas, genio, maligno, engañara |
| 8 | `idea-2` | Pero una cosa resistía: para que te engañen, tienes que existir. | clave `existir.` | resistía, existir |
| 9 | `idea-2` | Lo dejó escrito así: pienso, luego existo. | clave `existo.` | escrito, existo |
| 10 | `ejemplo` | Lo notas al despertar de un sueño muy real. | — | despertar |
| 11 | `ejemplo` | Dudas de todo, menos de que hay alguien, confundido. | clave `alguien,` | alguien, confundido |
| 12 | `cierre` | Puedes equivocarte en todo lo que piensas. Pero no en que lo estás pensando. | clave `pensando.` | pero, pensando |
| 13 | `cta` | Envíaselo a quien está seguro de todo. | clave `Envíaselo` | envíaselo |

- **Palabras:** 120 · **pausas:** 35 (una cada 3,4; F11 quitó la coma de «Pero no, en que», que se oía como un «no» suelto) · **frase más larga:** 14 · **puntos suspensivos:** 1.
- **Duración prevista:** 39,5 s a 3,38 pal/s; 41,5 s a 3,2 pal/s. Sin pausas de demostración.
- **Portada:** `"portada": "¿Estás soñando | ahora mismo?"`, `"portada_resaltar": "soñando"`, `"portada_t": 1.0`
  (solo el peón dormido), `"portada_color": "#8F72D2"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#8F72D2"`. `atempo` final con `prueba-atempo` (1,00-1,16).

## Escena (3D, kit v3 · F15a)

> Rediseño de F15a (`../VARIEDAD.md` §9, `../DECISIONES.md` §14). **Misma voz, mismo texto, mismas anclas de las escenas que se conservan**: solo cambia lo que se ve.
> Necesita piezas nuevas del kit: `torre` y las acciones `incorpora` / `yo` de `figuras 'tumbada'` (`VARIEDAD.md` §9.3). Hasta que existan, la escena
> renderizada (kit v2.1) sigue en `reel/reels/rincon-duda-metodica/escena.js`.

`halo: { gancho: 56, giro: 54, idea: 50, 'idea-2': 52, ejemplo: 54, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'racionalismo', halo: { /* arriba */ },
  golpes: ['gancho:soñando', 'giro:distinga', 'idea:maligno', 'idea-2:existir', 'ejemplo:confundido', 'cierre:pensando'],
  piezas: [
  // 1-3 · gancho y giro: la torre de lo que das por seguro; en «sueño» se ve igual de firme, y no hay señal que distinga una de otra
  objeto({ id: 'objeto-torre', modelo: 'torre', x: 540, y: 1060, tam: 380, desde: 'gancho', hasta: 'giro:fin',
           etiquetas: [{ cual: 'sentidos', texto: 'Lo que das por seguro', tono: 'neutro', en: 'gancho', hasta: 'gancho:fin' }],
           efectos: [{ en: 'gancho:soñando', hace: 'sueña' }, { en: 'giro:señal', hace: 'alterna' }] }),
  rotulo({ id: 'rotulo-despierto', texto: '¿Despierto o soñando?', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'gancho:seguro', hasta: 'gancho:fin' }),
  rotulo({ id: 'rotulo-sin-senal', texto: 'Ninguna señal segura', tono: 'neutro', marca: 'punto', x: 540, y: 1420,
           desde: 'giro:segura', hasta: 'giro:fin' }),
  // 4-7 · idea: Descartes; la torre pierde una capa por frase y queda un solo bloque
  autor({ id: 'autor-descartes', nombre: 'René Descartes', anos: '1596-1650', obra: 'Meditaciones metafísicas, 1641', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea-2:fin', efectos: [{ en: 'idea:propósito', hace: 'a-firma' }] }),
  linea({ id: 'linea-descartes', x: 530, y: 1150, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:primero',
          hitos: [{ ano: 1596, etiqueta: 'Nace Descartes', ancla: 'idea:descartes' }, { ano: 1641, etiqueta: 'Meditaciones', ancla: 'idea:propósito' }] }),
  objeto({ id: 'objeto-torre-2', modelo: 'torre', x: 540, y: 1170, tam: 360, desde: 'idea:sentidos', hasta: 'idea-2:escrito',
           etiquetas: [{ cual: 'sentidos', texto: 'Los sentidos', tono: 'neutro', en: 'idea:sentidos', hasta: 'idea:luego' },
                       { cual: 'mundo', texto: 'El mundo entero', tono: 'neutro', en: 'idea:luego', hasta: 'idea:sumas' },
                       { cual: 'sumas', texto: 'Las sumas', tono: 'neutro', en: 'idea:sumas', hasta: 'idea-2' },
                       { cual: 'cogito', texto: 'Alguien que duda', tono: 'acento', en: 'idea-2:existir', hasta: 'idea-2:escrito' }],
           efectos: [{ en: 'idea:engañan', hace: 'duda', cual: 'sentidos' }, { en: 'idea:engañan+0.6', hace: 'retira', cual: 'sentidos' },
                     { en: 'idea:sueño', hace: 'duda', cual: 'mundo' }, { en: 'idea:sueño+0.6', hace: 'retira', cual: 'mundo' },
                     { en: 'idea:sumas', hace: 'duda', cual: 'sumas' }, { en: 'idea:genio', hace: 'genio' },
                     { en: 'idea:engañara', hace: 'retira', cual: 'sumas' },   // F11: «siempre» cae en la salida
                     { en: 'idea-2:resistía', hace: 'resiste' }] }),
  // 8-9 · idea-2: lo que resiste
  cita({ id: 'cita-cogito', tipo: 'cita', x: 540, y: 1000, texto: 'Pienso, luego existo.', resalta: ['existo'],
         obra: 'Descartes, Discurso del método, IV (1637) · trad. propia', desde: 'idea-2:escrito', hasta: 'idea-2:fin' }),
  // 10-11 · ejemplo: al despertar de un sueño muy real, alguien confundido
  figuras({ id: 'figuras-despierta', disposicion: 'tumbada', x: 540, y: 1000, tam: 520, desde: 'ejemplo', hasta: 'ejemplo:fin',
            acciones: [{ en: 'ejemplo', hace: 'duerme' }, { en: 'ejemplo:despertar', hace: 'incorpora' }, { en: 'ejemplo:alguien', hace: 'yo' }] }),
  rotulo({ id: 'rotulo-alguien', texto: 'Hay alguien confundido', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'ejemplo:alguien', hasta: 'ejemplo:fin' }),
  // 12 · cierre: todo lo demás puede fallar (aristas), el bloque no
  objeto({ id: 'objeto-torre-3', modelo: 'torre', estado: 'resto', x: 540, y: 1020, tam: 400, desde: 'cierre', hasta: 'cierre:fin',
           etiquetas: [{ cual: 'sentidos', texto: 'Lo que piensas', sub: 'Puede fallar', tono: 'neutro', en: 'cierre', hasta: 'cierre:pero' },
                       { cual: 'cogito', texto: 'Que lo piensas', sub: 'No falla', tono: 'acento', en: 'cierre:pero', hasta: 'cierre:fin' }],
           efectos: [{ en: 'cierre', hace: 'reconstruye' }, { en: 'cierre:pero', hace: 'resiste' }] }),
  // 13 · cta
  cierre({ titulo: '¿Estás soñando ahora mismo?' }),   // = título de la ficha y de la portada
] });
```

- **Elementos propios** (§14.1): `torre` (modelo: `sueña`, `alterna`, `duda`, `retira`, `genio`, `resiste`, `reconstruye`) y la acción nueva del durmiente (`incorpora`: se incorpora y se lleva la mano a la frente; `yo`: aro de acento sobre la cabeza). No salen en el 3b ni en el resto del 3a.
- **Genéricas**: ninguna. Fuera: 2 `contraste`, el peón solo, el icono tubo `mascara` y 3 de los 6 rótulos (sentidos, mundo, matemáticas: ahora son píldoras ancladas a las capas). Quedan 3 rótulos.
- **Una misma imagen**: la torre es la metáfora única (gancho, giro, idea, idea-2, cierre). El durmiente solo sale en el ejemplo (antes salía en dos escenas, y `wu-wei` también usa la cama).
- `torre` en `gancho`: la torre entera pasa a «sueño» (aristas translúcidas y luz cálida) y vuelve a sólida: se ve igual de firme. En `giro`, `alterna` conmuta cuatro veces en 3 s con la misma silueta: «ninguna señal».
- `torre-3` empieza en `estado: 'resto'` (solo el bloque) y `reconstruye` dibuja las capas como aristas: pueden fallar; el bloque, no. Sin `gana` ni `tacha` (el cogito tiene objeciones: §13.5.5).
- Cronología: `linea-descartes` 1596 → 1641 (las *Meditaciones* del medallón); anclas a comprobar con `comprobar-fichas.mjs`.
- Colocación (provisional): la torre mide ≈ 1,35 × `tam` de alto; con `y 1060 / tam 380` queda sobre el rótulo del gancho (1420).

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-3 | El argumento del sueño: no hay indicios ciertos para distinguir la vigilia del sueño | Descartes, *Meditaciones* I (AT VII 19); texto latino y trad. inglesa de Cottingham; en castellano, trad. de Vidal Peña (Alfaguara) u otra publicada. SEP, «Descartes' Epistemology» (https://plato.stanford.edu/entries/descartes-epistemology/) |
| 4 y `autor-descartes` | 1596-1650; *Meditaciones* (1641); la duda como método, no como escepticismo | Ficha de autor `descartes`; ficha de la idea: `desarrollo` |
| 5-6 | Primero los sentidos, luego el sueño | *Meditaciones* I |
| 7 y `objeto-genio` | **Ojo:** en *Med.* I la duda sobre las sumas («cada vez que sumo dos y tres») nace con la hipótesis de un Dios engañador, y el genio maligno llega después y la recoge. La ficha lo simplifica en el genio. La frase dice «imaginó un genio maligno que le engañara siempre», que es fiel a cómo cierra la *Med.* I. Si quien lo comprueba lo ve forzado, cambiar «hasta las sumas» por «hasta lo más seguro» (mismas palabras de sincronía salvo `sumas` → `seguro`, que hay que cambiar en la escena) | *Meditaciones* I (AT VII 21-23) |
| 8-9 y `cita-cogito` | «Je pense, donc je suis», *Discours* IV (1637). En *Med.* II la fórmula es «yo soy, yo existo» | Descartes, *Discours de la méthode*, 4.ª parte (https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode/Quatri%C3%A8me_partie) |
| 10-11 | El ejemplo del despertar es de la ficha (`ejemplo_real`): aplicación, no de Descartes | ficha: `ejemplo_real` |
| post | Objeciones al cogito: ¿inferencia o intuición? Lichtenberg («se piensa»), Hume, Nietzsche | ficha: `matiz_experto`; SEP |

**Cita que no se usa:** ninguna más. La de la ficha («Pienso, luego existo») es la que va, en su fuente original.

## Riesgos de rigor

- Que el reel suene a escepticismo («no se puede saber nada»). La frase 4 dice «a propósito» y el objetivo lo
  deja claro: es un método para encontrar suelo.
- La simplificación del genio maligno (fila 7 de las fuentes).
- El cogito tiene objeciones serias: van en el post, no en la voz.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- Ni la voz ni la pantalla dicen que Descartes «demostró» que existes «sin discusión».
- La cita está en su fuente original con «trad. propia», o es paráfrasis.
- El post explica la diferencia entre el *Discurso* (1637) y las *Meditaciones* (1641) y menciona las objeciones.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-duda-metodica --corriente racionalismo
node reel/reel.mjs --reel rincon-duda-metodica
node reel/qa/medir-fluida.mjs rincon-duda-metodica
node reel/prueba-atempo.mjs rincon-duda-metodica 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-duda-metodica --vista 1.0,4,9,14,19,24,29,33,37
node reel/reels/rincon-kit/vacios.mjs rincon-duda-metodica
node reel/reels/rincon-kit/web.mjs rincon-duda-metodica
```

## Hecho

> F15a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md` §9). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12a, 2026-10-31. atempo 1,02 · 3,06 pal/s · 42,38 s · 6,02 MB (web 2,13 MB) · pico −1,3 dBTP · **1 petición**. prueba-atempo: 1,02 sin avisos (1,14 daba 3,34 con 2 reescaladas; se prefiere la toma más pausada, D3). Guion tal cual, sin cambios de palabras. Cita del cogito como `cita` «trad. propia» del francés leído en Wikisource (D2); el post explica «je suis» / «ego sum, ego existo». Aviso de whisper «estabas» (frase 1: whisper oyó «está soñando»): probable falso, a confirmar al escuchar. Fuentes abiertas hoy: Meditaciones (latín, Gutenberg), Discurso IV (Wikisource); SEP no reabierta. Todo en verde.
