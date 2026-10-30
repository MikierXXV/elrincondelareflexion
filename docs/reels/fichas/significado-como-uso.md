# rincon-significado-como-uso · «Ya hablaremos» · F5b

Ficha del sitio: `content/es/ideas/significado-como-uso.json` · corriente `analitica` · acento `#727EC2` ·
autor `wittgenstein` (Ludwig Wittgenstein, 1889-1951). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea entienda la idea madura de Wittgenstein: en muchos casos, el significado de una palabra es su
uso, lo que se hace con ella en una situación. Y que lo reconozca en un mensaje que ha recibido. El «en muchos
casos» del §43 se respeta en la voz y en pantalla.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | «Ya hablaremos» puede ser una promesa, una despedida o una amenaza. | clave `amenaza.` | promesa, despedida, amenaza |
| 2 | `giro` | Son las mismas palabras. ¿Dónde está la diferencia? | — | mismas, diferencia |
| 3 | `giro` | En lo que pasa alrededor: quién lo dice, cuándo y para qué. | clave `alrededor:` | alrededor, quién |
| 4 | `idea` | Wittgenstein cambió de idea sobre esto. | — | wittgenstein, cambió |
| 5 | `idea` | Primero pensó que las frases eran como un dibujo del mundo. | — | primero, dibujo |
| 6 | `idea` | Después, que las palabras son herramientas dentro de juegos: avisar, pedir, prometer. | clave `herramientas` | después, herramientas, prometer |
| 7 | `idea` | Por eso escribió que, en muchos casos, el significado de una palabra es su uso. | clave `uso.` | escribió, muchos, uso |
| 8 | `ejemplo` | Y por eso nadie abre el diccionario para saber qué quería decir tu jefe. | — | diccionario, jefe |
| 9 | `cierre` | Muchas veces, lo que una frase significa no está en sus palabras, sino en lo que haces con ellas. | clave `haces` | palabras, haces |
| 10 | `cta` | Envíaselo a quien te dijo «ya hablaremos» y nunca volvió a escribir. | clave `Envíaselo` | envíaselo |

- **Palabras:** 120. **Duración prevista:** 39,0-41,2 s. Sin pausas de demostración.
- **Pronunciación:** «Wittgenstein» se escucha. Si se tuerce, se usa `voz` en la frase 4 («Vitguenstain»).
- **Portada:** `"portada": "Ya hablaremos: | ¿qué significa?"`, `"portada_resaltar": "significa"`,
  `"portada_t": 1.0` (solo la burbuja, en y = 950).

## Escena (3D, kit v2)

`halo: { gancho: 54, giro: 54, idea: 50, ejemplo: 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'analitica', halo: { /* arriba */ },
  golpes: ['gancho:amenaza', 'giro:alrededor', 'idea:uso', 'ejemplo:diccionario', 'cierre:haces'],
  piezas: [
  // 1-3 · el mismo móvil, el mismo mensaje: solo cambia lo de alrededor (remitente y tono)
  objeto({ id: 'objeto-movil', modelo: 'movil', x: 540, y: 980, tam: 320, desde: 'gancho', hasta: 'giro:fin',
           pantalla: { texto: 'Ya hablaremos.', quien: 'Ana · 21:10', tono: 'acento' },
           efectos: [{ en: 'gancho:despedida', hace: 'cambia', quien: 'Al salir de la cena', tono: 'neutro' },
                     { en: 'gancho:amenaza', hace: 'cambia', quien: 'Jefe · 18:42', tono: 'error' }] }),
  rotulo({ id: 'rotulo-promesa',   texto: 'Promesa',   tono: 'acento', x: 540, y: 1290, desde: 'gancho:promesa',   hasta: 'giro:alrededor' }),
  rotulo({ id: 'rotulo-despedida', texto: 'Despedida', tono: 'neutro', x: 540, y: 1390, desde: 'gancho:despedida', hasta: 'giro:alrededor' }),
  rotulo({ id: 'rotulo-amenaza',   texto: 'Amenaza',   tono: 'error',  x: 540, y: 1490, desde: 'gancho:amenaza',   hasta: 'giro:alrededor' }),
  rotulo({ id: 'rotulo-alrededor', texto: 'Quién, cuándo y para qué', tam: 'titular', tono: 'acento', x: 540, y: 1360,
           desde: 'giro:alrededor', hasta: 'giro:fin' }),
  // 4-7 · idea: del dibujo a la herramienta
  autor({ id: 'autor-wittgenstein', nombre: 'Ludwig Wittgenstein', anos: '1889-1951', modo: 'medallon', x: 540, y: 820,
          desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:cambió', hace: 'a-firma' }] }),
  linea({ id: 'linea-wittgenstein', x: 540, y: 1340, ancho: 600, escala: 'proporcional', desde: 'idea:primero', hasta: 'idea:escribió',
          hitos: [{ ano: 1921, etiqueta: 'Tractatus', ancla: 'idea:primero' },
                  { ano: 1953, etiqueta: 'Investigaciones', ancla: 'idea:después' }] }),
  objeto({ id: 'objeto-dibujo', modelo: 'icono', icono: 'mapa', marco: true, x: 540, y: 960, tam: 360, etiqueta: 'Un dibujo del mundo',
           desde: 'idea:dibujo', hasta: 'idea:después' }),
  objeto({ id: 'objeto-herramientas', modelo: 'herramienta', tipo: 'caja', estado: 'solido', x: 540, y: 960, tam: 400,
           etiqueta: 'Avisar, pedir, prometer', desde: 'idea:después', hasta: 'idea:escribió' }),
  cita({ id: 'cita-43', tipo: 'cita', x: 540, y: 960,
         texto: 'El significado de una palabra es su uso en el lenguaje.',
         obra: 'Wittgenstein, Investigaciones filosóficas, §43', resalta: ['uso'], desde: 'idea:escribió', hasta: 'idea:fin' }),
  rotulo({ id: 'rotulo-muchos-casos', texto: 'En muchos casos, no en todos', tono: 'neutro', x: 540, y: 1300,
           desde: 'idea:muchos', hasta: 'idea:fin' }),
  // 8 · ejemplo
  objeto({ id: 'objeto-diccionario', modelo: 'libro', estado: 'cerrado', etiqueta: 'Diccionario', x: 540, y: 900, tam: 360,
           desde: 'ejemplo', hasta: 'ejemplo:fin', efectos: [{ en: 'ejemplo:diccionario+0.3', hace: 'tacha' }] }),
  burbuja({ id: 'burbuja-jefe', texto: 'Ya hablaremos.', lado: 'izq', quien: 'Jefe · 18:42', tono: 'error', x: 540, y: 1340,
            desde: 'ejemplo:jefe', hasta: 'ejemplo:fin' }),
  // 9 · cierre
  rotulo({ id: 'rotulo-no-palabras', texto: 'No solo en las palabras', tono: 'neutro', x: 540, y: 860, desde: 'cierre:palabras', hasta: 'cierre:fin' }),
  rotulo({ id: 'rotulo-haces', texto: 'En lo que haces con ellas', tam: 'titular', tono: 'acento', x: 540, y: 1120,
           desde: 'cierre:haces', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: 'Ya hablaremos' }),
] });
```

- «Ya hablaremos» (KIT §5): el móvil y el mensaje no cambian; solo cambia lo de alrededor (remitente y borde).
  La burbuja va dentro de la pieza `objeto-movil` y da una sola caja con el teléfono.
- El *Tractatus* es un cuadro (el icono `mapa` en un marco) y las *Investigaciones*, la caja de herramientas
  del §11. Van en relevo en el mismo sitio.
- Los tres rótulos de la frase 1 se apilan y se quedan; no se relevan en el mismo sitio, para no solaparse.
- El remitente «Ana» es inventado y genérico. No se pone el nombre de nadie real.
- `rotulo-no-palabras` dice «no solo», igual que la voz dice «muchas veces»: no se afirma que nunca esté en las
  palabras.
- **Portada** (1,0 s): solo el móvil con su burbuja, con la caja desde y ≈ 730. Si en la hoja empieza por
  encima de 700, se baja el móvil hasta 40 px.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 4-5 y `linea-wittgenstein` | *Tractatus* (1921/1922): las proposiciones como figuras o imágenes de los hechos («dibujo del mundo»). Publicación en 1921 (alemán) y 1922 (bilingüe) | SEP, «Ludwig Wittgenstein» (https://plato.stanford.edu/entries/wittgenstein/), §2-3 |
| 6 | *Investigaciones* §11 (las palabras como herramientas) y §23 (juegos de lenguaje). Publicadas póstumas en 1953. **Ojo:** la lista del §23 es dar órdenes, describir, informar, hacer conjeturas… y «pedir, agradecer, maldecir, saludar, rezar»; «prometer» **no** está, y «avisar» tampoco tal cual. En la voz, «avisar, pedir, prometer» son ejemplos del vídeo (avisar y pedir salen del «agua» de la ficha; prometer, del gancho), no la lista de Wittgenstein, y `guion-fuentes.md` lo anota así. F3 no pudo leer el §23 entero en línea: se comprueba en la traducción | Traducción de A. García Suárez y U. Moulines (Crítica / UNAM, 1988) u otra publicada |
| 7 y `cita-43` | §43: «Para una **gran clase** de casos —aunque no para todos— … el significado de una palabra es su uso en el lenguaje». Se copia letra a letra de la traducción que se lea; si no, «paráfrasis» | ídem, §43 |
| 1-3 y 8 | «Ya hablaremos» y el diccionario son ejemplos de la **ficha**, no de Wittgenstein | ficha: `ejemplo_real` |

**Cita.** Es la de la ficha y se usa, recortada a la frase central. El «en muchos casos» va en la voz y en
`rotulo-muchos-casos`.

## Criterios de aceptación (además de `DECISIONES.md` §9)

- Ni la voz ni la pantalla dicen que el significado sea **siempre** el uso.
- Las tres caras de la burbuja se leen en la hoja (cambia el remitente y el color).

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-significado-como-uso --corriente analitica
node reel/reel.mjs --reel rincon-significado-como-uso
node reel/qa/medir-fluida.mjs rincon-significado-como-uso
node reel/reel.mjs --reel rincon-significado-como-uso --vista 1.0,3.5,7,12,16,21,26,32
node reel/reels/rincon-kit/vacios.mjs rincon-significado-como-uso
node reel/reels/rincon-kit/web.mjs rincon-significado-como-uso
```

## Hecho

F5b, 2026-10-30. atempo 1,02 · 3,25 pal/s · 40,16 s · 6,17 MB (web 2,23 MB) · pico −1,5 · 1 petición. Escena: `rotulo-no-palabras` entra en `cierre` (antes en `cierre:palabras`) para quitar un hueco de 2,9 s. La cita del §43 va como paráfrasis (no se leyó traducción española). Todo en verde.
