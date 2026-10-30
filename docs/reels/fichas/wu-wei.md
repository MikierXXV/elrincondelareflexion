# rincon-wu-wei · «Intenta dormirte» · F5a

Ficha del sitio: `content/es/ideas/wu-wei.json` · corriente `filosofia-china` · acento `#D05D70` · autor
`laozi` (figura legendaria; el *Daodejing* se compiló h. s. IV-III a. C.). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea entienda el wu wei como «actuar sin forzar», no como «no hacer nada», con la imagen del
agua del *Daodejing*, y que lo reconozca en dos experiencias suyas: no poder dormirse y el nombre que no sale.
El sueño se presenta como **aplicación**: el libro no habla de él, y la voz lo dice.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Cuanto más te esfuerzas en dormirte, más despierto estás. | clave `despierto` | esfuerzas, despierto |
| 2 | `giro` | ¿Por qué aquí no sirve esforzarse? | — | esforzarse |
| 3 | `giro` | Porque dormirse no se hace: se deja pasar. | clave `pasar.` | porque, pasar |
| 4 | `idea` | Hace más de dos mil años, el Daodejing lo llamó wu wei: actuar sin forzar. | clave `forzar.` | daodejing, llamó, wu, forzar |
| 5 | `idea` | Una de sus imágenes es el agua: nada es más blando y nada la supera contra lo duro. | — | agua, blando, duro |
| 6 | `idea` | No pelea con la piedra: la rodea, y con el tiempo la desgasta. | — | piedra, desgasta |
| 7 | `ejemplo` | El libro no habla del sueño, pero encaja: el empeño por dormir puede ser lo que te mantiene alerta. | — | libro, empeño, alerta |
| 8 | `ejemplo` | Como el nombre que no te sale y aparece en la ducha, cuando dejas de buscarlo. | — | nombre, ducha, buscarlo |
| 9 | `cierre` | Wu wei no es no hacer nada: es dejar de estorbar. | error `nada:` · clave `estorbar.` | nada, estorbar |
| 10 | `cta` | Envíaselo a quien esta noche va a contar ovejas. | clave `Envíaselo` | envíaselo |

- **Palabras:** 124 (F3 cambió las frases 4 y 7 sin variar el total). **Duración prevista:** 40,2-42,5 s. Sin pausas de demostración.
- **Pronunciación:** se escucha cómo dice Orus «Daodejing» y «wu wei». Si se tuerce, se usa el campo `voz` de
  las frases 4 y 9 con grafía fonética (p. ej. «Dao De Ying», «u uei»), que cuesta 1 petición.
- **Portada:** `"portada": "Intenta | dormirte"`, `"portada_resaltar": "dormirte"`, `"portada_t": 1.4`
  (luna y almohada con el medidor abajo; nada por encima de y = 700).

## Escena (3D, kit v2)

`halo: { gancho: 56, giro: 54, idea: 50, ejemplo: 54, cierre: 50, cta: 60 }`

```js
montar({ corriente: 'filosofia-china', halo: { /* arriba */ },
  golpes: ['gancho:despierto', 'giro:pasar', 'idea:desgasta', 'ejemplo:buscarlo', 'cierre:estorbar'],
  piezas: [
  // 1-3 · gancho y giro: el que no se duerme (se revuelve) y se duerme al dejarlo pasar
  figuras({ id: 'figuras-insomne', disposicion: 'tumbada', n: 1, destacada: 0, x: 540, y: 900, tam: 560, desde: 'gancho', hasta: 'giro:fin',
            acciones: [{ en: 'gancho', hace: 'tiembla' }, { en: 'giro:pasar', hace: 'duerme' }] }),
  medidor({ id: 'medidor-sueno', tipo: 'barras', x: 540, y: 1330, ancho: 520, desde: 'gancho', hasta: 'giro:porque',
            series: [{ nombre: 'Esfuerzo', valores: [{ en: 'gancho', v: 0.2 }, { en: 'gancho:despierto', v: 0.9 }] },
                     { nombre: 'Sueño',    valores: [{ en: 'gancho', v: 0.7 }, { en: 'gancho:despierto', v: 0.15 }] }] }),
  rotulo({ id: 'rotulo-dejar-pasar', texto: 'Se deja pasar', tam: 'titular', tono: 'acento', x: 540, y: 1330,
           desde: 'giro:pasar', hasta: 'giro:fin' }),
  // 4-6 · idea: el Daodejing y el agua
  autor({ id: 'autor-laozi', nombre: 'Laozi', anos: 'figura legendaria', obra: 'Daodejing (atribuido)', modo: 'medallon',
          x: 540, y: 800, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:forzar', hace: 'a-firma' }] }),
  linea({ id: 'linea-daodejing', x: 540, y: 1190, ancho: 600, escala: 'equidistante', desde: 'idea', hasta: 'idea:agua',
          hitos: [{ ano: -300, texto: 's. IV-III a. C.', etiqueta: 'Daodejing (aprox.)', ancla: 'idea:daodejing' },
                  { hoy: true, ancla: 'idea:llamó' }] }),
  rotulo({ id: 'rotulo-wu-wei', texto: 'Wu wei: actuar sin forzar', tam: 'titular', tono: 'acento', x: 540, y: 1440,
           desde: 'idea:wu', hasta: 'idea:agua' }),
  cita({ id: 'cita-agua', tipo: 'parafrasis', x: 540, y: 880,
         texto: 'Nada en el mundo es más blando que el agua, y nada la supera para vencer lo duro.',
         obra: 'Daodejing, 78', resalta: ['blando', 'duro'], desde: 'idea:agua', hasta: 'idea:fin' }),
  objeto({ id: 'objeto-piedra', modelo: 'piedra', x: 540, y: 1310, tam: 420, desde: 'idea:agua', hasta: 'idea:fin',
           efectos: [{ en: 'idea:desgasta', hace: 'desgasta' }] }),
  // 7-8 · ejemplo: el libro no habla del sueño; el nombre que aparece al dejar de buscarlo
  objeto({ id: 'objeto-libro', modelo: 'libro', estado: 'cerrado', etiqueta: 'Daodejing', x: 540, y: 900, tam: 380,
           desde: 'ejemplo', hasta: 'ejemplo:nombre' }),
  rotulo({ id: 'rotulo-libro', texto: 'El libro no habla del sueño', tono: 'neutro', x: 540, y: 1260,
           desde: 'ejemplo:libro', hasta: 'ejemplo:nombre' }),
  rotulo({ id: 'rotulo-empeno', texto: 'El empeño te despierta', tono: 'acento', marca: 'punto', x: 540, y: 1380,
           desde: 'ejemplo:empeño', hasta: 'ejemplo:nombre' }),
  burbuja({ id: 'burbuja-nombre', texto: '¿Cómo se llamaba…?', lado: 'izq', tono: 'neutro', x: 540, y: 900,
            desde: 'ejemplo:nombre', hasta: 'ejemplo:fin' }),
  burbuja({ id: 'burbuja-ya', texto: '¡Ya está!', lado: 'der', tono: 'acento', pila: 'burbuja-nombre', x: 540, y: 900,
            desde: 'ejemplo:buscarlo', hasta: 'ejemplo:fin' }),
  // 9 · cierre: no es no hacer nada; el agua rodea la piedra
  rotulo({ id: 'rotulo-nada', texto: 'No hacer nada', tono: 'error', x: 540, y: 780, desde: 'cierre', hasta: 'cierre:fin',
           efectos: [{ en: 'cierre:nada+0.2', hace: 'tacha' }] }),
  objeto({ id: 'objeto-piedra-2', modelo: 'piedra', x: 540, y: 1080, tam: 380, desde: 'cierre', hasta: 'cierre:fin' }),
  rotulo({ id: 'rotulo-estorbar', texto: 'Dejar de estorbar', tam: 'titular', tono: 'acento', x: 540, y: 1420,
           desde: 'cierre:estorbar', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: 'Intenta dormirte' }),
] });
```

- El hito `hoy` va en `idea:llamó` (REVISION: la palabra cambió en el guion).
- El insomne es una figura del kit, no una persona concreta. El sueño se presenta como aplicación: lo dicen
  `rotulo-libro` y la voz.
- La piedra que el agua rodea y desgasta es la imagen del *Daodejing* (caps. 8 y 78). En el cierre vuelve para
  «dejar de estorbar»: el agua no pelea.
- **Portada** (1,4 s): la figura tumbada y el medidor, con sus cajas desde y ≈ 760.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 4 y `linea-daodejing` | Wu wei aparece en el *Daodejing* (caps. 37 y 48, entre otros). El texto se compiló h. s. IV-III a. C. y Laozi es legendario. «Actuar sin forzar» es interpretación habitual; la traducción literal es «no acción». La frase dice «lo llamó», no «le puso nombre»: el término también sale en las *Analectas* (15.5; F3 no lo abrió, se comprueba) y en el *Zhuangzi*, así que no se presenta como invención del libro | Ficha de autor `laozi` del sitio; Legge en Project Gutenberg (https://www.gutenberg.org/ebooks/216; comprobado el 28-10-2026: cap. 37 «does nothing (for the sake of doing it)», cap. 48 «diminish (his doing)»); ctext.org (https://ctext.org/dao-de-jing) para el chino, que **bloquea a los agentes**: se abre a mano o se usa Gutenberg; SEP, «Laozi» (https://plato.stanford.edu/entries/laozi/) |
| 5 y `cita-agua` | Cap. 78: nada es más blando que el agua y nada la supera contra lo duro (Legge: «nothing in the world more soft and weak than water, and yet for attacking things that are firm and strong…»; comprobado el 28-10-2026). Por defecto es paráfrasis; si se lee una traducción española publicada, `tipo: 'cita'` con traductor | Legge, cap. 78 (Gutenberg #216) |
| 6 | El agua «no compite» (cap. 8, Legge: «without striving») y desgasta la piedra (ficha). «La rodea» es imagen del vídeo, no cita | Legge, cap. 8; ficha: `desarrollo` |
| 7 | El esfuerzo por dormir puede mantener despierto: es un modelo teórico del insomnio psicofisiológico, no una ley, y por eso la frase dice «puede ser» | C. A. Espie, N. M. Broomfield, K. M. A. MacMahon, L. M. Macphee y L. M. Taylor, «The attention-intention-effort pathway in the development of psychophysiologic insomnia: a theoretical review», *Sleep Medicine Reviews* 10(4), 215-245, 2006, doi:10.1016/j.smrv.2006.03.002 (PubMed 16809056; comprobado el 28-10-2026) |
| 8 | El nombre que aparece al dejar de buscarlo | Ejemplo de la ficha, sin cifra. No se añade fuente: se dice como experiencia común |

**Cita que no se usa:** la de la ficha («El dao que puede nombrarse…», cap. 1) es correcta, pero no trata del
wu wei ni del agua.

**Rigor.** La voz dice «el Daodejing», nunca «Laozi dijo». El vídeo no vende un remedio contra el insomnio: el
post lo deja claro («no es un consejo médico»).

## Criterios de aceptación (además de `DECISIONES.md` §9)

- La frase 7 dice que el libro no habla del sueño, y el rótulo `rotulo-libro` también.
- `autor-laozi` dice «figura legendaria» y la línea, «aprox.».
- Ni la voz ni el post dicen «cura» ni «remedio».

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-wu-wei --corriente filosofia-china
node reel/reel.mjs --reel rincon-wu-wei
node reel/qa/medir-fluida.mjs rincon-wu-wei
node reel/reel.mjs --reel rincon-wu-wei --vista 1.4,5,10,15,20,25,30,35
node reel/reels/rincon-kit/vacios.mjs rincon-wu-wei
node reel/reels/rincon-kit/web.mjs rincon-wu-wei
```

## Hecho

_(lo rellena quien haga el reel)_
