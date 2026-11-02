# rincon-termino-medio · «¿Decir lo que piensas?» · tanda 3b

Ficha del sitio: `content/es/ideas/termino-medio.json` · corriente `clasica-griega` · acento `#4884CE` · autor
`aristoteles` (384-322 a. C.). Procedimiento común: `LEEME.md`, con lo que añade `../DECISIONES.md` §13. Candidato
n.º 10 de `../CANDIDATOS-2.md`.

## Objetivo

Partir de un dilema que todo el mundo tiene (¿cuánta verdad hay que decir?) y llevarlo a la ética de Aristóteles:
la virtud es un punto entre dos extremos, ese punto se mueve con cada situación, ninguna regla te lo da y se
aprende practicando, como un oficio. Segundo reel de la clásica griega, con otro autor y otro tono que el de
Sócrates.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Callarte siempre es cobardía. Pero soltarlo todo, tampoco es sinceridad. | clave `sinceridad.` | cobardía, soltarlo, tampoco, sinceridad |
| 2 | `giro` | Entonces, ¿cuánta verdad hay que decir? Depende. | clave `Depende.` | verdad, depende |
| 3 | `giro` | No es lo mismo con tu jefe, con tu pareja, o con quien acaba de recibir… malas noticias. | — | jefe, pareja, noticias |
| 4 | `idea` | Aristóteles lo llamó el término medio, hace veinticuatro siglos. | — | aristóteles, llamó, siglos |
| 5 | `idea` | La virtud está entre dos extremos: la valentía, entre la cobardía y la temeridad. | — | virtud, valentía, cobardía, temeridad |
| 6 | `idea` | Pero ese medio, no es la mitad exacta: se mueve, con cada situación. | clave `mueve,` | mitad, mueve, situación |
| 7 | `idea` | Y no hay regla que te lo dé. Se aprende como un oficio: practicando. | — | regla, oficio, practicando |
| 8 | `idea-2` | Escribió que nos hacemos justos haciendo cosas justas… como se aprende a tocar, tocando. | clave `tocando.` | escribió, justos, tocando |
| 9 | `cierre` | Así que la sinceridad, no se aprende leyendo: se afina, cada vez que hablas. | clave `afina,` | leyendo, afina, hablas |
| 10 | `cta` | Envíaselo a quien presume de decir siempre lo que piensa. | clave `Envíaselo` | envíaselo |

- **Palabras:** 123 · **pausas:** 30 (una cada 4,1) · **frase más larga:** 18 · **suspensivos:** 2.
- **Duración prevista:** 40,4 s a 3,38 pal/s; 42,5 s a 3,2.
- **Portada:** `"portada": "¿Decir lo | que piensas?"`, `"portada_resaltar": "piensas"`, `"portada_t": 1.0` (solo el
  peón de la izquierda), `"portada_color": "#4884CE"`.
- **Voz:** el bloque de `../DECISIONES.md` §13.2 tal cual, con `"ancla_pausas": true, "ancla_frases": true,
  "whisper_sin_prompt": true`, `"cta_cola_ms": 3200` y `"portada_color": "#4884CE"`. `atempo` final con `prueba-atempo` (1,00-1,16).
- En `idea` «medio» sale dos veces: no se usa como ancla.

## Escena (3D, kit v3 · F14a)

> Rediseño visual de F14a (`../VARIEDAD.md`, `../DECISIONES.md` §14). **Mismas anclas de voz, misma voz y mismo texto**: solo cambia lo que se
> ve. Necesita piezas nuevas del kit (`figuras 'cuerda'`, maniquí con tronco, `etiquetas` ancladas: `VARIEDAD.md` §4). Hasta que existan, la escena
> renderizada (kit v2.1) sigue en `reel/reels/rincon-termino-medio/escena.js`.

`halo: { gancho: 56, giro: 54, idea: 50, 'idea-2': 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'clasica-griega', halo: { /* arriba */ },
  golpes: ['gancho:sinceridad', 'giro:depende', 'idea:mueve', 'idea-2:tocando', 'cierre:afina'],
  piezas: [
  // 1-3 · gancho y giro: un equilibrista entre «callarlo todo» y «soltarlo todo» (los dos tachados); el medio se mueve según con quién
  figuras({ id: 'figuras-cuerda', disposicion: 'cuerda', x: 540, y: 1280, tam: 780, desde: 'gancho', hasta: 'giro:fin',
            etiquetas: [{ lado: 'izq', texto: 'Callarlo todo', sub: 'Cobardía', tono: 'neutro', en: 'gancho', hasta: 'gancho:fin' },
                        { lado: 'der', texto: 'Soltarlo todo', sub: 'Falta de tacto', tono: 'neutro', en: 'gancho:soltarlo', hasta: 'gancho:fin' }],
            acciones: [{ en: 'gancho:cobardía', hace: 'inclina', lado: 'izq' }, { en: 'gancho:cobardía', hace: 'tacha', lado: 'izq' },
                       { en: 'gancho:soltarlo', hace: 'inclina', lado: 'der' }, { en: 'gancho:tampoco', hace: 'tacha', lado: 'der' },   // F11: «sinceridad» cierra la escena y cae en la salida
                       { en: 'giro:depende', hace: 'centra' },
                       { en: 'giro:jefe', hace: 'medio', pos: -0.35, texto: 'Tu jefe' },
                       { en: 'giro:pareja', hace: 'medio', pos: 0.3, texto: 'Tu pareja' },
                       { en: 'giro:noticias', hace: 'medio', pos: -0.1, texto: 'Una mala noticia' }] }),
  rotulo({ id: 'rotulo-depende', texto: 'Depende', tam: 'titular', tono: 'acento', x: 540, y: 840, desde: 'giro:depende', hasta: 'giro:fin' }),
  // 4-7 · idea: Aristóteles; las tres zonas de la cuerda, el medio que se mueve y el oficio (el temblor baja al practicar)
  autor({ id: 'autor-aristoteles', nombre: 'Aristóteles', anos: '384-322 a. C.', obra: 'Ética a Nicómaco', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea-2:fin', efectos: [{ en: 'idea:llamó', hace: 'a-firma' }] }),
  linea({ id: 'linea-aristoteles', x: 530, y: 1260, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:cobardía',
          hitos: [{ ano: -384, etiqueta: 'Nace Aristóteles', ancla: 'idea:Aristóteles' }, { hoy: true, ancla: 'idea:siglos' }] }),
  figuras({ id: 'figuras-cuerda-2', disposicion: 'cuerda', x: 540, y: 1260, tam: 690, desde: 'idea:cobardía', hasta: 'idea:fin',
            etiquetas: [{ lado: 'izq', texto: 'Cobardía', tono: 'neutro', en: 'idea:cobardía', hasta: 'idea:regla' },
                        { lado: 'centro', texto: 'Valentía', tono: 'acento', en: 'idea:valentía', hasta: 'idea:regla' },
                        { lado: 'der', texto: 'Temeridad', tono: 'neutro', en: 'idea:temeridad', hasta: 'idea:regla' }],
            acciones: [{ en: 'idea:pero', hace: 'medio', pos: 0 }, { en: 'idea:mueve', hace: 'medio', pos: 0.45 },
                       { en: 'idea:situación', hace: 'medio', pos: -0.3 },
                       { en: 'idea:oficio', hace: 'practica', n: 3, texto: 'Como un oficio' }] }),
  // 8 · idea-2: haciendo cosas justas
  cita({ id: 'cita-etica', tipo: 'parafrasis', x: 540, y: 1000,
         texto: 'Nos hacemos justos practicando la justicia, como los citaristas tocando la cítara.', resalta: ['justos'],
         obra: 'Aristóteles, Ética a Nicómaco, II, 1', desde: 'idea-2', hasta: 'idea-2:fin' }),
  // 9 · cierre: el equilibrista firme, y las ondas de afinar
  figuras({ id: 'figuras-afina', disposicion: 'cuerda', temblor: 'bajo', x: 540, y: 1020, tam: 700, desde: 'cierre', hasta: 'cierre:fin',
            acciones: [{ en: 'cierre', hace: 'centra' }, { en: 'cierre:afina', hace: 'afina' }] }),
  rotulo({ id: 'rotulo-afina', texto: 'Se afina practicando', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'cierre:afina', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: '¿Decir lo que piensas?' }),
] });
```

- **Elementos propios** (§14.1): `figuras 'cuerda'` (con `inclina`, `tacha`, `centra`, `practica`, `afina`) y la banderita del medio (`medio`), que se desliza bajo la cuerda con su píldora.
- **Genéricas**: ninguna. Fuera: el `contraste` con dos peones, el `medidor` de nivel, la caja de herramienta, el peón solo y 5 rótulos (cobardía/valentía/temeridad, jefe, pareja, noticia).
  Quedan 2 rótulos (Depende y Se afina practicando) y las píldoras ancladas a la cuerda.
- **Una misma imagen**: la cuerda es la metáfora única del reel y se ve en gancho, giro, idea y cierre, cada vez con otra acción (extremos tachados → el medio que cambia →
  zonas con su nombre y el oficio → firme y afinando).
- El maniquí del cierre lleva `temblor: 'bajo'` (lo que cuesta práctica) y a partir de `afina` salen ondas de acento concéntricas desde el balancín: «se afina».
- `tacha` aquí es sobre los **extremos** (cobardía, falta de tacto), no sobre una disputa: DECISIONES §13.5.5 no se rompe.
- Colocación (provisional): `figuras-cuerda` entra bajo el rótulo de «Depende» (y 880); `figuras-cuerda-2` ocupa 1060-1440 bajo el medallón; con la cita de `idea-2` la cuerda ya no está.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-3 | Decir lo que piensas, con tu jefe, tu pareja o alguien con una mala noticia: ejemplo de la ficha (`ejemplo_real`), como aplicación. **Ojo:** la virtud aristotélica de la veracidad (IV, 7) está entre la jactancia y la falsa modestia, no entre la cobardía y la falta de tacto. Que el post lo diga | ficha: `ejemplo_real`; *Ética a Nicómaco* IV, 7 |
| 4 y `autor-aristoteles` | 384-322 a. C.; «veinticuatro siglos» redondea | Ficha de autor `aristoteles`; SEP, «Aristotle's Ethics» (https://plato.stanford.edu/entries/aristotle-ethics/) |
| 5 y rótulos | La virtud como medio entre exceso y defecto; la valentía entre la temeridad y la cobardía (II, 7; III, 6-9) | *Ética a Nicómaco* II, 6-7 (texto griego y trad. inglesa en Perseus: https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054); en castellano, trad. de J. Pallí Bonet (Gredos) u otra publicada |
| 6 y `medidor-medio` | El medio «relativo a nosotros», no aritmético (el ejemplo de Milón, II, 6) | *Ética a Nicómaco* II, 6 |
| 7 | La prudencia (*phronesis*) acierta en cada caso; no se deduce de reglas | ficha: `desarrollo`; SEP |
| 8 y `cita-etica` | II, 1: nos hacemos constructores construyendo y citaristas tocando la cítara; así, justos practicando la justicia | *Ética a Nicómaco* II, 1 (1103a-b) |
| post | El debate entre la vida buena «inclusiva» y la contemplativa del libro X | ficha: `matiz_experto` |

**Cita que no se usa:** la de la ficha («La virtud es un medio entre el exceso y el defecto», II, 6) es correcta y
de la idea, pero la voz ya la dice en la frase 5. La pantalla lleva II, 1, que es la del oficio.

## Riesgos de rigor

- El gancho usa la sinceridad, que no es el ejemplo de Aristóteles (arriba). Se presenta como aplicación y el post
  da su versión.
- «Entre dos extremos»: Aristóteles dice exceso y defecto; «extremos» es fiel y más corto.
- No decir que el medio es «la mitad» ni «lo moderado»: la frase 6 lo niega a propósito.

## Criterios de aceptación (además de `DECISIONES.md` §9 y §13)

- El post explica la veracidad de IV, 7 y que el gancho es una aplicación.
- El medidor lleva «esquema».

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-termino-medio --corriente clasica-griega
node reel/reel.mjs --reel rincon-termino-medio
node reel/qa/medir-fluida.mjs rincon-termino-medio
node reel/prueba-atempo.mjs rincon-termino-medio 1.00 1.16 0.01
node reel/reel.mjs --reel rincon-termino-medio --vista 1.0,4,8,12,17,22,27,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-termino-medio
node reel/reels/rincon-kit/web.mjs rincon-termino-medio
```

## Hecho

> F14a (2026-10-31): la escena se ha rediseñado (`../VARIEDAD.md`). Las medidas de abajo son de la escena anterior (kit v2.1); se rehacen al renderizar la nueva, con la misma voz (0 peticiones a Gemini).

F12b, 2026-11-01 (t-a20f04). Kit v3.0, escena nueva de F14b (cuerda del equilibrista + cronología de Aristóteles).

- **Medidas:** 41.96 s, 7.62 MB, -14 LUFS, pico -1.4 dBTP; web 2.63 MB (póster 720 y 360). 123 palabras, 3.17 pal/s, 0 huecos, 0 solapes (419 muestras), portada limpia, alineado sin avisos.
- **atempo final:** 1.02 (`prueba-atempo` 1,00-1,16 desde la caché: a 1,00 sale 3,11 pal/s con 1 aviso; 1,02 deja 0 avisos y 0 frases reescaladas; la propuesta automática era 1,06, y se prefirió 1,02 por más pausado).
- **Peticiones de voz:** 1 (a la primera, sin 429).
- **Cambios de guion:** ninguno. **Cambios de escena:** ninguno sobre la preparada por F14b (las colocaciones ya estaban ajustadas).
- **Avisos de whisper:** ninguno de alineado. Un solo aviso con atempo 1,00-1,01 que desaparece a 1,02.
- **Pendiente de escucha humana:** «Aristóteles», «veinticuatro» y «citaristas»/«cítara» (la cita de pantalla es paráfrasis de II, 1).
- Hoja de escucha: `ESCUCHA-LOTE3B.md`. Sin web del sitio y sin push.


**F14b (2026-10-31, t-3e334d) · escena preparada, sin voz.** `comprobar-fichas.mjs termino-medio` en verde (parámetros, anclas, golpes, escenario seguro, portada, 0 solapes, 0 huecos con tiempos sintéticos). Cambios de colocación: `figuras-cuerda` y 1280, `figuras-cuerda-2` tam 690 (se salía a la zona derecha de interfaz), «Depende» y 840; cronología `linea-aristoteles` (−384 → hoy, hasta `idea:cobardía`). Los solapes definitivos se miden con la voz real, mañana.
