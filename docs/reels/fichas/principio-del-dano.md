# rincon-principio-del-dano · «La cabeza es tuya» · PILOTO (F4)

Ficha del sitio: `content/es/ideas/principio-del-dano.json` · corriente `utilitarismo` · acento `#708D2C` ·
autor `mill` (John Stuart Mill, 1806-1873). Procedimiento común: `LEEME.md`.

## Objetivo

En 40 s, que quien lo vea entienda la regla de Mill: solo se te puede obligar para evitar daño a otros, no por
tu bien. Y que se lleve la pregunta abierta: **dónde empieza el daño a los demás**, sin que el vídeo tome
partido sobre el casco. Es el piloto: estrena 9 de las 10 piezas del kit (todas menos `medidor`).

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | La cabeza es tuya. Entonces, ¿por qué te obligan a llevar casco? | clave `casco?` | cabeza, casco |
| 2 | `idea` | En el siglo diecinueve, Mill propuso una regla sencilla. | — | Mill, propuso, regla |
| 3 | `idea` | Sobre tu cuerpo y tu mente, mandas tú. | clave `tú.` | sobre, mandas |
| 4 | `idea-2` | Pueden aconsejarte, razonar contigo o suplicarte, pero no obligarte, si no dañas a otros. | clave `otros.` | aconsejarte, razonar, suplicarte, obligarte, otros |
| 5 | `ejemplo` | Su ejemplo: un puente peligroso. Pueden pararte para avisarte, pero si lo sabes y aun así quieres cruzar, es cosa tuya. | clave `avisarte,` | puente, avisarte, cruzar, tuya |
| 6 | `giro` | ¿Y el casco? Mill nunca habló de cascos, y ahí empieza la discusión. | — | casco, nunca, discusión |
| 7 | `giro` | Unos dicen: es mi cabeza. Otros: tu accidente lo pagamos todos, así que no es solo tuyo. | — | unos, cabeza, pagamos |
| 8 | `cierre` | La pelea no es por el casco: es por dónde empieza el daño a otros. | clave `daño` | pelea, dónde, daño |
| 9 | `cta` | Envíaselo al que dice «es mi vida» y al que dice «lo pagamos todos». | clave `Envíaselo` | envíaselo |

- **Palabras:** 123, llamada incluida. **Duración prevista:** 39,9 s a 3,4 pal/s y 42,1 s a 3,2 pal/s (con
  3,7 s de cola). Sin pausas de demostración.
- La frase 9 lleva `"pausa_antes_ms": 200`. No hay más pausas a mano.
- **Portada:** `"portada": "La cabeza es tuya | ¿Y el casco?"`, `"portada_resaltar": "casco"`,
  `"portada_t": 1.8`. En 1,8 s solo está el casco: ni rótulos ni autor. Las reglas de la portada están en
  `DECISIONES.md` §2.

## Escena (3D, kit v2)

`halo: { gancho: 56, idea: 46, 'idea-2': 50, ejemplo: 48, giro: 52, cierre: 52, cta: 60 }`

Es la escena del piloto 3D de la comparativa (`rincon-kit/comparativa/3d/fuente/escena.js`) pasada a piezas del
kit. Coordenadas, tamaños y golpes salen de allí. Si el kit lo monta igual, el piloto se ve como `3d.mp4`.

```js
montar({ corriente: 'utilitarismo', halo: { /* arriba */ },
  golpes: ['gancho:casco', 'idea:regla', 'idea-2:obligarte', 'ejemplo:peligroso', 'giro:otros', 'cierre:daño'],
  piezas: [
  // 1 · gancho: el casco
  objeto({ id: 'objeto-casco', modelo: 'casco', x: 540, y: 1010, tam: 620, desde: 'gancho', hasta: 'idea',
           efectos: [{ en: 'gancho:casco', hace: 'late' }] }),
  // 2-3 · idea: Mill y su regla
  autor({ id: 'autor-mill', nombre: 'John Stuart Mill', anos: '1806-1873', obra: 'Sobre la libertad, 1859',
          modo: 'medallon', x: 540, y: 830, desde: 'idea', hasta: 'idea:fin',
          efectos: [{ en: 'idea:propuso', hace: 'a-firma' }] }),   // ≥ 0,7 s antes de que entre cita-mill (KIT §6.2)
  linea({ id: 'linea-mill', x: 530, y: 1360, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:sobre',
          hitos: [{ ano: 1859, etiqueta: 'Sobre la libertad', ancla: 'idea:mill' }, { hoy: true, ancla: 'idea:regla' }] }),
  cita({ id: 'cita-mill', tipo: 'cita', x: 540, y: 1060,
         texto: 'Sobre sí mismo, sobre su propio cuerpo y su propia mente, el individuo es soberano.',
         obra: 'J. S. Mill, Sobre la libertad, cap. I', resalta: ['cuerpo', 'mente'], desde: 'idea:sobre', hasta: 'idea:fin' }),
  // 4 · idea-2: lo que se puede y lo que no
  figuras({ id: 'figuras-mill', disposicion: 'grupo', n: 6, destacada: 0, x: 540, y: 960, tam: 720, desde: 'idea-2', hasta: 'idea-2:fin',
            acciones: [{ en: 'idea-2:aconsejarte', hace: 'limite', texto: 'SOLO TÚ' }] }),
  rotulo({ id: 'rotulo-aconsejar', texto: 'Aconsejar', tono: 'neutro', marca: 'si', x: 290, y: 1250, desde: 'idea-2:aconsejarte', hasta: 'idea-2:fin' }),
  rotulo({ id: 'rotulo-razonar',   texto: 'Razonar',   tono: 'neutro', marca: 'si', x: 740, y: 1250, desde: 'idea-2:razonar',    hasta: 'idea-2:fin' }),
  rotulo({ id: 'rotulo-suplicar',  texto: 'Suplicar',  tono: 'neutro', marca: 'si', x: 290, y: 1370, desde: 'idea-2:suplicarte',  hasta: 'idea-2:fin' }),
  rotulo({ id: 'rotulo-obligar',   texto: 'Obligar',   tono: 'error',  marca: 'no', x: 740, y: 1370, desde: 'idea-2:obligarte',  hasta: 'idea-2:fin',
           efectos: [{ en: 'idea-2:obligarte+0.2', hace: 'tacha' }] }),
  // 5 · ejemplo: el puente de Mill (cruje, no se rompe) y el que cruza sabiéndolo
  objeto({ id: 'objeto-puente', modelo: 'puente', x: 540, y: 900, tam: 650, desde: 'ejemplo', hasta: 'ejemplo:fin',
           efectos: [{ en: 'ejemplo:peligroso', hace: 'cruje' }, { en: 'ejemplo:cruzar', hace: 'cruza' }] }),
  burbuja({ id: 'burbuja-aviso', texto: 'Ese puente no aguanta.', lado: 'izq', quien: 'Aviso', tono: 'neutro',
            x: 420, y: 1300, desde: 'ejemplo:avisarte', hasta: 'ejemplo:fin' }),
  rotulo({ id: 'rotulo-cosa-tuya', texto: 'Es cosa tuya', tono: 'acento', marca: 'punto', x: 540, y: 1480,
           desde: 'ejemplo:cruzar', hasta: 'ejemplo:fin' }),
  // 6 · giro: Mill no habló de cascos
  objeto({ id: 'objeto-casco-2', modelo: 'casco', x: 540, y: 930, tam: 560, desde: 'giro', hasta: 'giro:unos' }),
  rotulo({ id: 'rotulo-sin-cascos', texto: 'Mill no habló de cascos', tono: 'neutro', x: 540, y: 1300,
           desde: 'giro:nunca', hasta: 'giro:unos' }),
  // 7 · giro: los dos bandos (en disputa, ninguno gana)
  contraste({ id: 'contraste-casco', disposicion: 'columnas', y: 960, desde: 'giro:unos', hasta: 'giro:fin',
              a: { titulo: '«Es mi cabeza»', modelo: 'casco', tono: 'neutro' },
              b: { titulo: '«Lo pagamos todos»', modelo: 'peones', tono: 'neutro' }, entra_b: 'giro:otros',
              efectos: [{ en: 'giro:otros+0.4', hace: 'separa' }] }),
  // 8 · cierre: dónde empieza el daño
  figuras({ id: 'figuras-cierre', disposicion: 'grupo', n: 6, destacada: 0, x: 540, y: 990, tam: 720, desde: 'cierre', hasta: 'cierre:fin',
            acciones: [{ en: 'cierre', hace: 'limite', texto: 'SOLO TÚ' }, { en: 'cierre:dónde', hace: 'ensancha' },
                       { en: 'cierre:daño', hace: 'ondas' }] }),
  rotulo({ id: 'rotulo-donde', texto: '¿Dónde empieza el daño a otros?', tam: 'titular', tono: 'acento', x: 540, y: 1430,
           desde: 'cierre:dónde', hasta: 'cierre:fin' }),
  // 9 · cta
  cierre({ titulo: 'La cabeza es tuya' }),
] });
```

- En la frase 7, `contraste` **no** usa `gana` ni `tacha`, porque es una disputa y el vídeo no toma partido.
  Las dos columnas son neutras y pesan lo mismo.
- El puente **cruje** (la tabla central se hunde y vibra) y no se rompe. Así no sugiere un daño seguro, que
  es el caso en el que Mill sí deja parar a la persona (REVISION §C).
- `objeto-casco-2` es el mismo casco que vuelve. No se reutiliza `objeto-casco` porque cada pieza tiene una sola
  ventana.
- El cierre del clip de la comparativa (el casco con el título en grande) no se usa: el cierre es el común
  (KIT §6.10).
- **Portada** (1,8 s): solo el casco, con su caja desde y ≈ 750.

## Fuentes que hay que comprobar (en `guion-fuentes.md`)

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 2, 3, 4 y `cita-mill` | Cap. I de *On Liberty* (1859): «The only purpose for which power can be rightfully exercised over any member of a civilised community, against his will, is to prevent harm to others…»; «Over himself, over his own body and mind, the individual is sovereign»; y la lista «remonstrating with him, or reasoning with him, or persuading him, or entreating him, but not for compelling him» | Texto inglés completo en Project Gutenberg o Wikisource (se enlaza el que se lea). Si se usa traducción publicada, se anotan traductor y edición; si no, `obra: '… cap. I (trad. propia)'` |
| 4 «aconsejarte» | Mill dice *remonstrate / reason / persuade / entreat*. «Aconsejar» es la palabra de la ficha y equivale a *remonstrate* o *persuade*. Se anota así | ídem |
| 5, el puente | Cap. V: el puente que se sabe inseguro. Si no hay tiempo de avisar, se le puede detener, porque nadie quiere caerse al río. Si solo hay riesgo, solo él puede juzgar y se le debe avisar, no impedirle cruzar. La frase dice exactamente eso | ídem, cap. V («Applications») |
| `linea-mill` | *On Liberty* publicado en 1859; Mill, 1806-1873 | Portada de la edición de 1859 o la ficha de autor del sitio |
| 6-7, el casco | Que el casco y el cinturón son casos de manual del debate sobre el paternalismo (la SEP los nombra; comprobado el 28-10-2026). La SEP **no** trae el argumento de «lo pagamos todos»: ese sale de la ficha (`ejemplo_real`) y del propio Mill, que en el cap. IV lo discute como *constructive injury* y responde que la sociedad «can afford to bear» ese perjuicio por la libertad. El post lo dice: Mill no habló de cascos, pero sí contestó a ese argumento; la discusión sigue en qué cuenta como daño | Stanford Encyclopedia of Philosophy, «Paternalism» (G. Dworkin), https://plato.stanford.edu/entries/paternalism/ ; *On Liberty*, cap. IV |
| 8 | Que «qué cuenta como daño» está abierto | Matiz de la ficha; SEP «Paternalism» o «Mill's Moral and Political Philosophy» |

**Cita que no se usa:** ninguna de la ficha. La de la ficha («El único fin que legitima interferir…») es una
condensación; en pantalla va la del cap. I comprobada.

## Criterios de aceptación (además de `DECISIONES.md` §9)

- La voz no pone a Mill de ningún bando sobre el casco. Las dos posturas tienen el mismo peso en pantalla, y
  ninguna tarjeta gana ni se tacha. Ni la voz ni el post dicen que Mill dejara abierta la cuestión del coste:
  el post recoge su respuesta del cap. IV (fila 6-7 de las fuentes).
- `cita-mill` coincide letra a letra con la fuente anotada, o lleva `tipo: 'parafrasis'`.
- Las 9 piezas aparecen en la hoja. Es el piloto: si alguna no se ve bien, se pide el arreglo a quien lleve
  el kit 3D (F2f, jefe en copia) antes de cerrar, y se anota. F4 no edita `rincon-kit/`.
- Duración de 30-45 s, ritmo de 3,2-3,4 pal/s, 0 solapes y 0 huecos.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-principio-del-dano --corriente utilitarismo
node reel/reel.mjs --reel rincon-principio-del-dano
node reel/qa/medir-fluida.mjs rincon-principio-del-dano
node reel/reel.mjs --reel rincon-principio-del-dano --vista 1.8,7,11,16,22,26,31,36
node reel/reels/rincon-kit/vacios.mjs rincon-principio-del-dano
node reel/reels/rincon-kit/web.mjs rincon-principio-del-dano
```

Se abre `reel/reels/rincon-principio-del-dano/salida/rincon-principio-del-dano-comprobaciones.json`:
`solapes_de_escena.ok`, `alineado` y formato.

## Hecho

**F4, 2026-10-29 (Piloto-rincon).** Hoja de escucha: `docs/reels/ESCUCHA-PILOTO.md`.
- Reel en `videos-cortos/reel/reels/rincon-principio-del-dano/`.
- Medidas: 39,57 s, 1080×1920 a 30 fps, 6,56 MB, −14 LUFS, pico −1,2 dBTP. Web: 2,30 MB. 123 palabras a 3,38 pal/s, 0 pausas > 0,4 s, 39 pantallas de subtítulo y 0 en dos líneas. 395 muestras sin solapes, 0 huecos y portada limpia.
- **atempo final 1,15** (de 1,12). Con 1,12 «mandas tú» salía 0,45 s tarde; con 1,15, 0,22 s. Se probaron 1,09-1,16 desde la caché y todos reescalan la frase 3.
- Voz: 1 petición de Gemini. Guion tal cual, con `pausa_antes_ms` 320 como en la hipnosis. `cita-mill` lleva «(trad. propia)». Escena sin cambios de coordenadas.
- Avisos de whisper que eran falsos: «discusión» y «unos» (acentos rotos de whisper-cli). Whisper oye «tú.» como «tiffany».
- El resaltado de la portada sale en lavanda (fijo en `lib/revisar.mjs`), no en el verde del acento.
