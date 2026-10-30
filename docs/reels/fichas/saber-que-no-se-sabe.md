# rincon-saber-que-no-se-sabe · «Define qué es un buen amigo» · F5b

Ficha del sitio: `content/es/ideas/saber-que-no-se-sabe.json` · corriente `clasica-griega` · acento `#4884CE` ·
autor `socrates` (470-399 a. C.). Procedimiento común: `LEEME.md`. No tenía entrada en `CANDIDATOS.md`; la
tiene ahora, con el número 13.

## Objetivo

Que quien lo vea viva el método de Sócrates en 10 segundos: cree saber qué es un buen amigo hasta que intenta
definirlo. Y que se lleve la idea: ese atasco (la aporía) no es un fracaso, es el comienzo, porque mientras
crees que ya sabes no buscas. **Sin** la frase falsa «solo sé que no sé nada».

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Sabes perfectamente qué es un buen amigo. Ahora intenta definirlo. | clave `definirlo.` | amigo, definirlo |
| 2 | `giro` | «El que siempre te apoya.» ¿También si te apoya para conducir bebido? | — | apoya, bebido |
| 3 | `giro` | «El que te dice la verdad.» ¿Y si te la dice solo para hacerte daño? | — | verdad, daño |
| 4 | `giro` | Cada definición deja fuera a alguien, o mete dentro a quien no debería. | — | fuera, dentro |
| 5 | `idea` | Es lo que hacía Sócrates en Atenas hace veinticuatro siglos. | — | sócrates, atenas, siglos |
| 6 | `idea` | Preguntaba a quien presumía de saber, y solía aparecer un caso que su definición no cubría. | — | presumía, caso, cubría |
| 7 | `idea` | Platón cuenta que lo hizo con la amistad, y que acabaron sin respuesta. | — | platón, amistad, respuesta |
| 8 | `cierre` | Ese atasco no era un fracaso: mientras crees que ya sabes, no buscas. | error `fracaso:` · clave `buscas.` | atasco, fracaso, buscas |
| 9 | `cierre` | Solo se tenía por más sabio en una cosa: no creía saber lo que no sabía. | clave `sabía.` | sabio, creía |
| 10 | `cta` | Envíaselo a quien tiene respuesta para todo. | clave `Envíaselo` | envíaselo |

- **Palabras:** 125, en el tope. **Duración prevista:** 40,5-42,8 s. Sin pausas de demostración. Las preguntas de las
  frases 2 y 3 no llevan pausa: el espectador no tiene que contestar.
- **Portada:** `"portada": "Define qué es | un buen amigo"`, `"portada_resaltar": "amigo"`, `"portada_t": 1.0`
  (solo las dos figuras).

## Escena (3D, kit v2)

`halo: { gancho: 56, giro: 54, idea: 50, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'clasica-griega', halo: { /* arriba */ },
  golpes: ['gancho:definirlo', 'giro:dentro', 'idea:respuesta', 'cierre:buscas'],
  piezas: [
  // 1 · gancho: dos amigos
  figuras({ id: 'figuras-amigos', disposicion: 'pareja', n: 1, x: 540, y: 1000, tam: 460, desde: 'gancho', hasta: 'gancho:fin' }),
  rotulo({ id: 'rotulo-buen-amigo', texto: 'Un buen amigo es…', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'gancho:definirlo', hasta: 'gancho:fin' }),
  // 2-4 · giro: las definiciones que fallan; la definición como aro que deja fuera o mete dentro
  burbuja({ id: 'burbuja-apoya', texto: 'El que siempre te apoya.', lado: 'izq', tono: 'neutro', x: 540, y: 860,
            desde: 'giro', hasta: 'giro:fin', efectos: [{ en: 'giro:bebido', hace: 'tacha' }] }),
  burbuja({ id: 'burbuja-verdad', texto: 'El que te dice la verdad.', lado: 'izq', tono: 'neutro', pila: 'burbuja-apoya', x: 540, y: 860,
            desde: 'giro:verdad', hasta: 'giro:fin', efectos: [{ en: 'giro:daño', hace: 'tacha' }] }),
  figuras({ id: 'figuras-definicion', disposicion: 'grupo', n: 6, destacada: 0, x: 540, y: 1270, tam: 560, desde: 'giro:cada', hasta: 'giro:fin',
            acciones: [{ en: 'giro:fuera', hace: 'define', fuera: 4, intruso: 5 }, { en: 'giro:dentro', hace: 'mete' }] }),
  // 5-7 · idea: Sócrates
  autor({ id: 'autor-socrates', nombre: 'Sócrates', anos: '470-399 a. C.', obra: 'lo cuentan Platón y Jenofonte', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:siglos', hace: 'a-firma' }] }),
  linea({ id: 'linea-socrates', x: 540, y: 1340, ancho: 600, escala: 'proporcional', desde: 'idea', hasta: 'idea:presumía',
          hitos: [{ ano: -399, etiqueta: 'Atenas', ancla: 'idea:atenas' }, { hoy: true, ancla: 'idea:siglos' }] }),
  burbuja({ id: 'burbuja-pregunta', texto: '¿Y qué es eso, exactamente?', lado: 'der', quien: 'Sócrates', tono: 'acento',
            x: 540, y: 960, desde: 'idea:presumía', hasta: 'idea:platón' }),
  burbuja({ id: 'burbuja-respuesta', texto: 'Pues es…', lado: 'izq', quien: 'El que sabía', tono: 'neutro', pila: 'burbuja-pregunta',
            x: 540, y: 960, desde: 'idea:caso', hasta: 'idea:platón', efectos: [{ en: 'idea:cubría', hace: 'tacha' }] }),
  cita({ id: 'cita-lisis', tipo: 'parafrasis', x: 540, y: 1000,
         texto: 'Todavía no hemos sido capaces de descubrir qué es un amigo.',
         obra: 'Platón, Lisis, 223b', desde: 'idea:platón', hasta: 'idea:fin' }),
  // 8-9 · cierre
  contraste({ id: 'contraste-saber', disposicion: 'columnas', y: 1000, desde: 'cierre', hasta: 'cierre:sabio',
              a: { titulo: 'Crees que sabes', texto: 'No buscas', tono: 'neutro' },
              b: { titulo: 'Sabes que no sabes', texto: 'Empiezas a buscar', tono: 'acento' }, entra_b: 'cierre:buscas',
              efectos: [{ en: 'cierre:buscas', hace: 'gana', lado: 'b' }] }),
  cita({ id: 'cita-apologia', tipo: 'parafrasis', x: 540, y: 1000,
         texto: 'Lo que no sé, tampoco creo saberlo.', obra: 'Platón, Apología, 21d',
         desde: 'cierre:sabio', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: 'Define qué es un buen amigo' }),   // = título de la ficha y de la portada
] });
```

- La definición como aro (KIT §5) sustituye a los rótulos «Deja fuera a alguien» y «Mete a quien no debe» del
  2D, que quedan como reserva. Entra en «Cada» (frase 4), deja fuera al amigo en «fuera» y mete al intruso en
  «dentro».
- Las dos citas van sin `resalta`. La voz no dice ninguna palabra exacta de ellas: dice «amistad» y no
  «amigo», y «saber» y no «saberlo» (KIT §6.3).
- La firma de Sócrates sigue arriba mientras dialogan las burbujas: «Sócrates» es también el remitente de
  `burbuja-pregunta`.
- Los dos amigos del gancho son una pareja de peones sin hilo (el hilo es de `imperativo`).
- **Portada** (1,0 s): solo la pareja, con su caja desde y ≈ 830.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-4 | Ejemplo nuevo de la ficha (cambiado en esta tarea): definir «buen amigo» | ficha: `ejemplo_real` |
| 5 y `linea-socrates` | Sócrates, 470-399 a. C., en Atenas; «veinticuatro siglos» redondea 2.425 años | Ficha de autor `socrates`; SEP, «Socrates» (https://plato.stanford.edu/entries/socrates/) |
| 6 | El *elenchos*: pide una definición, busca un caso que no cubre y el interlocutor acaba en aporía. La frase dice «solía aparecer» (F3; antes «siempre aparecía»): no todos los diálogos refutan con un contraejemplo | ficha: `desarrollo`; SEP «Socrates» |
| 7 y `cita-lisis` | El *Lisis* trata de la amistad y termina sin respuesta: «aún no hemos sido capaces de descubrir qué es un amigo» (223b). Comprobado en inglés el 28-10-2026 (Lamb, Loeb 1955: «what a “friend” is, we have not yet succeeded in discovering») | Platón, *Lisis*, 223b (trad. en Gredos, *Diálogos* I, u otra publicada); texto inglés en Perseus (https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0176:text=Lysis:section=223b) |
| 8 | La aporía como comienzo, no como fracaso | ficha: `desarrollo` |
| 9 y `cita-apologia` | *Apología* 21d: se cree más sabio que el otro en esa pequeña cosa, que lo que no sabe tampoco cree saberlo | Platón, *Apología*, 21d (trad. de J. Calonge, Gredos, u otra publicada) |
| `autor-socrates` «lo cuentan Platón y Jenofonte» | El Sócrates histórico no se separa del personaje de Platón (matiz de la ficha). Que el post lo diga | ficha: `matiz_experto` |

**Cita que no se usa:** la de la ficha («Una vida sin examen no merece ser vivida», *Apología* 38a) es correcta y
cercana, pero el reel ya lleva dos y no hace falta. **Nunca** «solo sé que no sé nada».

## Criterios de aceptación (además de `DECISIONES.md` §9)

- Ni la voz, ni la pantalla, ni el post dicen «solo sé que no sé nada». La tarjeta dice «Sabes que no
  sabes», que es el nombre de la idea en el sitio, no una cita.
- Las dos citas de Platón llevan «paráfrasis», salvo que se haya leído una traducción concreta.
- El post explica que lo que sabemos de Sócrates lo cuentan otros.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-saber-que-no-se-sabe --corriente clasica-griega
node reel/reel.mjs --reel rincon-saber-que-no-se-sabe
node reel/qa/medir-fluida.mjs rincon-saber-que-no-se-sabe
node reel/reel.mjs --reel rincon-saber-que-no-se-sabe --vista 1.0,4,8,12,16,21,26,31,35
node reel/reels/rincon-kit/vacios.mjs rincon-saber-que-no-se-sabe
node reel/reels/rincon-kit/web.mjs rincon-saber-que-no-se-sabe
```

## Hecho

F5b, 2026-10-30. atempo 1,04 · 3,28 pal/s · 41,28 s · 5,92 MB (web 2,14 MB) · pico −1,5 · **2 peticiones** (la primera, sin puntuar, salió a 3,68 pal/s; una repetición accidental mía con el mismo texto no ayudó). Guion: solo puntuación (comas y dos «…»), mismas palabras. Citas de Platón como paráfrasis; Platón y SEP «Socrates» no reabiertos hoy. Todo en verde.
