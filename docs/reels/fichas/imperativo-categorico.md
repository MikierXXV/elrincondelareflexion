# rincon-imperativo-categorico · «Colarse» · F5a

Ficha del sitio: `content/es/ideas/imperativo-categorico.json` · corriente `ilustracion-idealismo` · acento
`#D65B50` · autor `kant` (Immanuel Kant, 1724-1804). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea entienda la prueba de Kant (convertir tu regla en ley para todos y ver si se sostiene) y
**por qué falla**: la regla se destruye a sí misma, no es que «salga mal». Se pasa del ejemplo de la ficha (la
cola) al de Kant (la promesa falsa), y se dice cuál es cuál.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Colarte solo funciona porque nadie más se cuela. | clave `nadie` | colarte, funciona |
| 2 | `giro` | ¿Y si todos hicieran lo mismo? No habría cola en la que colarse. | — | todos, cola |
| 3 | `giro` | Tu ventaja depende de una excepción que solo te concedes a ti. | clave `excepción` | tu, excepción |
| 4 | `idea` | Kant tiene una prueba para esto: imagina tu regla como ley para todos. | — | kant, imagina, ley |
| 5 | `idea` | Si al hacerla universal se destruye a sí misma, no era una regla moral. | clave `destruye` | universal, destruye |
| 6 | `ejemplo` | Su ejemplo es una promesa que no piensas cumplir. | — | promesa, cumplir |
| 7 | `ejemplo` | Si todos prometieran así, nadie creería una promesa, y ya no podrías engañar con ella. | — | prometieran, creería, engañar |
| 8 | `ejemplo-2` | Fíjate: no dice que saldría mal, dice que la regla ya no se sostiene. | error `mal,` · clave `sostiene.` | mal, sostiene |
| 9 | `cierre` | Por eso «total, por uno» es justo la frase que esta prueba detecta. | — | total, detecta |
| 10 | `cta` | Envíaselo a ese amigo que siempre tiene prisa en la cola. | clave `Envíaselo` | envíaselo |

- **Palabras:** 122. **Duración prevista:** 39,6-41,8 s. Sin pausas de demostración.
- **Portada:** `"portada": "Colarte solo | funciona si nadie | más se cuela"`, `"portada_resaltar": "nadie"`,
  `"portada_t": 1.0` (solo la fila de figuras).

## Escena (3D, kit v2)

`halo: { gancho: 58, giro: 56, idea: 50, ejemplo: 52, 'ejemplo-2': 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'ilustracion-idealismo', halo: { /* arriba */ },
  golpes: ['gancho:nadie', 'giro:excepción', 'idea:destruye', 'ejemplo:creería', 'ejemplo-2:sostiene', 'cierre:detecta'],
  piezas: [
  // 1-3 · la cola: la destacada se cuela; si todos lo hacen, la fila se deshace
  figuras({ id: 'figuras-cola', disposicion: 'fila', n: 7, destacada: 6, x: 540, y: 1000, tam: 760, desde: 'gancho', hasta: 'giro:fin',
            acciones: [{ en: 'gancho:funciona', hace: 'colarse' }, { en: 'giro:todos', hace: 'desordenar' }] }),
  rotulo({ id: 'rotulo-sin-cola', texto: 'Ya no hay cola', tono: 'error', x: 540, y: 1400, desde: 'giro:cola', hasta: 'giro:tu' }),
  rotulo({ id: 'rotulo-excepcion', texto: 'Una excepción solo para ti', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'giro:tu', hasta: 'giro:fin' }),
  // 4-5 · idea: la prueba
  autor({ id: 'autor-kant', nombre: 'Immanuel Kant', anos: '1724-1804', obra: 'Fundamentación…, 1785', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:prueba', hace: 'a-firma' }] }),
  cita({ id: 'cita-kant', tipo: 'cita', x: 540, y: 1040,
         texto: 'Obra sólo según una máxima tal que puedas querer al mismo tiempo que se torne ley universal.',
         obra: 'Kant, Fundamentación…, II (trad. García Morente, 1921)', resalta: ['universal'],
         desde: 'idea:ley', hasta: 'idea:fin' }),   // en «ley» y no en «imagina»: ≥ 0,7 s tras el a-firma (KIT §6.2)
  rotulo({ id: 'rotulo-se-destruye', texto: 'Se destruye a sí misma', tono: 'error', marca: 'no', x: 540, y: 1400,
           desde: 'idea:destruye', hasta: 'idea:fin' }),
  // 6-7 · ejemplo: la promesa es un hilo entre dos; si todos prometen en falso, todos los hilos se rompen
  figuras({ id: 'figuras-promesa', disposicion: 'pareja', n: 3, x: 540, y: 940, tam: 760, desde: 'ejemplo', hasta: 'ejemplo:fin',
            acciones: [{ en: 'ejemplo:promesa', hace: 'hilo' }, { en: 'ejemplo:prometieran', hace: 'todos' },
                       { en: 'ejemplo:creería', hace: 'rompe' }] }),
  burbuja({ id: 'burbuja-promesa', texto: 'Te lo prometo.', lado: 'izq', tono: 'neutro', x: 540, y: 1340,
            desde: 'ejemplo:promesa', hasta: 'ejemplo:fin', efectos: [{ en: 'ejemplo:engañar', hace: 'tacha' }] }),
  // 8 · ejemplo-2: no es que salga mal
  contraste({ id: 'contraste-kant', disposicion: 'columnas', y: 1000, desde: 'ejemplo-2', hasta: 'ejemplo-2:fin',
              a: { titulo: 'Saldría mal', tono: 'neutro' }, b: { titulo: 'No se sostiene', tono: 'acento' },
              entra_b: 'ejemplo-2:sostiene',
              efectos: [{ en: 'ejemplo-2:mal+0.2', hace: 'tacha', lado: 'a' }, { en: 'ejemplo-2:sostiene', hace: 'gana', lado: 'b' }] }),
  // 9 · cierre
  burbuja({ id: 'burbuja-total', texto: 'Total, por uno…', lado: 'der', tono: 'error', x: 540, y: 900,
            desde: 'cierre', hasta: 'cierre:fin' }),
  rotulo({ id: 'rotulo-detecta', texto: 'La prueba lo detecta', tam: 'titular', tono: 'acento', x: 540, y: 1200,
           desde: 'cierre:detecta', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: 'Colarse' }),
] });
```

- Las dos metáforas (KIT §5) son estas:
  - La cola que se deshace cuando todos se cuelan: la regla, hecha universal, destruye aquello de lo que vivía.
  - Los hilos de las promesas que se rompen todos: si todos prometieran así, nadie creería una promesa.

  El apretón de manos del 2D desaparece; su reserva es la burbuja tachada, que se queda.
- Aquí `contraste` sí usa `tacha` y `gana`: no es una disputa, sino la lectura de Kant frente a un
  malentendido de su prueba. Sin `modelo`, cada lado es una losa.
- El texto y la obra de `cita-kant` son los de F3 (García Morente, 1921) y no se tocan.
- «Fundamentación…, 1785» en el autor: el título entero no cabe en la firma.
- **Portada** (1,0 s): solo la fila de figuras. La destacada salta a la cabeza en un arco de 80 px como
  mucho, y la caja empieza en y ≈ 820.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 4-5 y `cita-kant` | Fórmula de la ley universal, *Fundamentación* II, Ak. 4:421. F3 leyó la de García Morente (Madrid, 1921) en Wikisource el 28-10-2026: «obra sólo según una máxima tal que puedas querer al mismo tiempo que se torne ley universal» (el OCR dice «torno»; se coteja con el facsímil). La versión que traía esta ficha («…aquella máxima que puedas querer que se convierta en…») **no es literal** de ninguna traducción comprobada. Se anota la página del facsímil | https://es.wikisource.org/wiki/Fundamentación_para_la_metafísica_de_las_costumbres (cap. II); el original en la Akademie-Ausgabe (AA IV, 421; korpora.org) |
| 5 | La regla falla porque se contradice al universalizarla (contradicción en la concepción), no por sus consecuencias | SEP, «Kant's Moral Philosophy» (https://plato.stanford.edu/entries/kant-moral/), §5 |
| 6-7 | El ejemplo de la promesa falsa: si todos lo hicieran, nadie creería las promesas y la propia promesa sería imposible | *Fundamentación* II, Ak. 4:422 |
| 1-3 y 9 | La cola y el «total, por uno» son ejemplos de la **ficha**, no de Kant. La frase 6 marca el paso («Su ejemplo») | ficha: `ejemplo_real` |

**Cita.** Es la de la ficha y se usa, pero comprobada contra una traducción concreta. La ficha la trae
condensada («que puedas querer como ley universal»).

**Rigor.** Fuera el caso del asesino a la puerta y la segunda formulación: no caben y no hacen falta.

## Criterios de aceptación (además de `DECISIONES.md` §9)

- `cita-kant` coincide con la traducción anotada, o lleva «paráfrasis».
- El post separa los ejemplos: la cola es de hoy y la promesa es de Kant.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-imperativo-categorico --corriente ilustracion-idealismo
node reel/reel.mjs --reel rincon-imperativo-categorico
node reel/qa/medir-fluida.mjs rincon-imperativo-categorico
node reel/reel.mjs --reel rincon-imperativo-categorico --vista 1.0,4,8,13,18,23,28,33
node reel/reels/rincon-kit/vacios.mjs rincon-imperativo-categorico
node reel/reels/rincon-kit/web.mjs rincon-imperativo-categorico
```

## Hecho

_(lo rellena quien haga el reel)_
