# rincon-velo-de-la-ignorancia · «Cómo partir una tarta» · F5b

Ficha del sitio: `content/es/ideas/velo-de-la-ignorancia.json` · corriente `etica-politica-contemporanea` ·
acento `#34945C` · autor `rawls` (John Rawls, 1921-2002). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea pase del truco de la tarta (corta quien elige el último) al velo de Rawls: reglas elegidas sin
saber qué lugar te tocará. Que entienda por qué, según Rawls, asegurarías el suelo, y que sepa que hay quien lo
discute (Harsanyi). El vídeo **no** da la discusión por cerrada.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | ¿Quieres que alguien parta una tarta en trozos iguales? Que elija el último. | clave `último.` | tarta, trozos, último |
| 2 | `gancho` | Como no sabe qué trozo le tocará, se esmera, sea buena persona o no. | — | trozo, esmera |
| 3 | `idea` | John Rawls propuso algo parecido para una sociedad entera. | — | rawls, sociedad |
| 4 | `idea` | Diseña las reglas tras un velo que te oculta si serás rico o pobre, con talento o sin él. | clave `velo` | diseña, velo, talento |
| 5 | `idea` | Como podrías caer en el peor sitio, no apostarías por la media: asegurarías el suelo. | clave `suelo.` | peor, media, suelo |
| 6 | `idea` | Por eso, según Rawls, una desigualdad solo es aceptable si beneficia a quien está peor. | — | desigualdad, beneficia |
| 7 | `giro` | Hay quien lo discute: tras el velo, dicen, apostarías por la media. | — | discute, media |
| 8 | `cierre` | Pero la pregunta te sirve igual: ¿aceptarías esta regla sin saber qué lugar te toca? | clave `toca?` | pregunta, toca |
| 9 | `cta` | Envíaselo a quien siempre se queda con el trozo más grande. | clave `Envíaselo` | envíaselo |

- **Palabras:** 123 (F3 cambió las frases 4 y 7; ver fuentes). **Duración prevista:** 39,9-42,1 s. Sin pausas de demostración.
- **Portada:** `"portada": "Cómo partir | una tarta"`, `"portada_resaltar": "tarta"`, `"portada_t": 1.2`
  (solo la tarta).

## Escena (3D, kit v2)

`halo: { gancho: 56, idea: 50, giro: 52, cierre: 54, cta: 60 }`

```js
montar({ corriente: 'etica-politica-contemporanea', halo: { /* arriba */ },
  golpes: ['gancho:último', 'idea:suelo', 'giro:discute', 'cierre:toca'],
  piezas: [
  // 1-2 · la tarta
  objeto({ id: 'objeto-tarta', modelo: 'tarta', estado: 'entera', x: 540, y: 980, tam: 500, desde: 'gancho', hasta: 'gancho:fin',
           cambia: [{ en: 'gancho:trozos', estado: 'cortada' }], efectos: [{ en: 'gancho:esmera', hace: 'late' }] }),
  rotulo({ id: 'rotulo-ultimo', texto: 'Elige el último', tono: 'acento', marca: 'punto', x: 540, y: 1400,
           desde: 'gancho:último', hasta: 'gancho:fin' }),
  // 3-6 · idea: el velo que salta de peldaño en peldaño y el suelo que se asegura
  autor({ id: 'autor-rawls', nombre: 'John Rawls', anos: '1921-2002', obra: 'Teoría de la justicia, 1971', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:propuso', hace: 'a-firma' }] }),
  figuras({ id: 'figuras-sociedad', disposicion: 'escalera', n: 5, destacada: 2, x: 540, y: 1190, tam: 760, desde: 'idea:sociedad', hasta: 'idea:fin',
            acciones: [{ en: 'idea:velo', hace: 'velo' }, { en: 'idea:suelo', hace: 'suelo' }] }),
  rotulo({ id: 'rotulo-peor', texto: 'Si beneficia a quien está peor', tono: 'acento', marca: 'punto', x: 540, y: 780,
           desde: 'idea:desigualdad', hasta: 'idea:fin' }),
  // 7 · giro: la objeción (en disputa, ninguno gana)
  contraste({ id: 'contraste-velo', disposicion: 'columnas', y: 1000, desde: 'giro', hasta: 'giro:fin',
              a: { titulo: 'Rawls', texto: 'Asegurar el suelo', modelo: 'escalera', estado: 'suelo', tono: 'neutro' },
              b: { titulo: 'Harsanyi', texto: 'Apostar por la media', modelo: 'escalera', estado: 'media', tono: 'neutro' },
              entra_b: 'giro:media', efectos: [{ en: 'giro:media+0.4', hace: 'separa' }] }),
  // 8 · cierre
  objeto({ id: 'objeto-tarta-2', modelo: 'tarta', estado: 'cortada', x: 540, y: 900, tam: 400, desde: 'cierre', hasta: 'cierre:fin' }),
  rotulo({ id: 'rotulo-sin-saber', texto: 'Sin saber qué lugar te toca', tono: 'neutro', x: 540, y: 1300,
           desde: 'cierre:toca', hasta: 'cierre:fin' }),
  // 9 · cta
  cierre({ titulo: 'Cómo partir una tarta' }),
] });
```

- El texto de la tarjeta de Harsanyi («Apostar por la media») y las anclas `giro:media` son de F3 y no se
  tocan (REVISION §A.4).
- `contraste-velo` no usa `gana` ni `tacha`, porque es una disputa abierta. Las dos escaleras son la misma y
  son neutras; solo cambia qué peldaño se enciende.
- `rotulo-peor` va en y = 780, entre la firma del autor (510-670) y la escalera (desde y ≈ 960). Si choca con
  la escalera, se baja la escalera a y = 1230, no el rótulo.
- El velo es un cilindro esmerilado que salta de peldaño en peldaño: no sabes en cuál estás (KIT §5).
- **Portada** (1,2 s): solo la tarta, con su caja desde y ≈ 800.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-2 | Rawls usa el reparto de la tarta (uno corta y se queda el último trozo) como ejemplo de justicia procesal perfecta | *A Theory of Justice* (1971), §14. En español, *Teoría de la justicia* (FCE) |
| 3-4 | El velo de la ignorancia oculta clase, posición social, riqueza y la suerte en «natural assets and abilities» (inteligencia, fuerza); se saben las generalidades de la sociedad. **La salud no aparece** en la SEP (comprobado el 28-10-2026) ni, que se sepa, en el §24: por eso F3 cambió «sano o enfermo» por «con talento o sin él». La ficha del sitio sí dice «su salud»; eso queda como aviso al jefe, no se toca `content/` | ídem, §24; SEP, «Original Position» (https://plato.stanford.edu/entries/original-position/) |
| 5 | Maximin: no apostar por el promedio, asegurar la peor posición | ídem, §26 |
| 6 | Principio de la diferencia: desigualdades aceptables si benefician a los peor situados. La ficha añade «y con igualdad efectiva de oportunidades». El post lo dice | ídem, §13 y §46; ficha: `desarrollo` |
| 7 | Objeción de Harsanyi: con la misma probabilidad de caer en cualquier puesto, se maximizaría la utilidad **media** (esperada). No es «apostar por lo más probable», como decía antes la frase; F3 la cambió a «por la media», que además contesta a la frase 5 | J. C. Harsanyi, «Can the Maximin Principle Serve as a Basis for Morality? A Critique of John Rawls's Theory», *American Political Science Review* 69(2), 594-606, 1975 (JSTOR 1959090; el DOI de Cambridge parece ser 10.1017/S0003055400243141, sin confirmar en doi.org); SEP «Original Position» lo resume igual |

**Cita que no se usa:** la de la ficha («La justicia es la primera virtud de las instituciones sociales», §1) es
correcta, pero no trata del velo.

## Criterios de aceptación (además de `DECISIONES.md` §9)

- La frase 6 dice «según Rawls» y la 7 presenta la objeción sin resolverla.
- El post nombra a Harsanyi y la condición de igualdad de oportunidades.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-velo-de-la-ignorancia --corriente etica-politica-contemporanea
node reel/reel.mjs --reel rincon-velo-de-la-ignorancia
node reel/qa/medir-fluida.mjs rincon-velo-de-la-ignorancia
node reel/reel.mjs --reel rincon-velo-de-la-ignorancia --vista 1.2,5,9,13,18,23,28,33
node reel/reels/rincon-kit/vacios.mjs rincon-velo-de-la-ignorancia
node reel/reels/rincon-kit/web.mjs rincon-velo-de-la-ignorancia
```

## Hecho

F5b, 2026-10-30. atempo 1,00 · 3,33 pal/s · 40,10 s · 5,86 MB (web 2,02 MB) · pico −1,5 · 1 petición. Sin cambios. Rawls §14 y Harsanyi confirmados en fuentes secundarias; la SEP no incluye la salud entre lo que oculta el velo (la ficha del sitio sí: aviso para F8). Todo en verde.
