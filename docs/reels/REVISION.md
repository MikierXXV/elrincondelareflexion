# Revisión del plan de los reels (F3)

> **Aviso del jefe (18:25, leído después de cerrar la revisión).** Las escenas pasan a **3D**. Un agente de
> diseño rehace `KIT.md`, DECISIONES §11 y los bloques de escena y `montar()` de las fichas. Por eso, los puntos
> de esta revisión que tratan de escena (**§A.3, §B.1 y §B.5**, y el icono del puente en §C) son
> **para el diseño 3D**: se dan como avisos y no como correcciones definitivas. El cambio que hice en DECISIONES
> §11 está revertido.
>
> Antes del aviso ya había tocado dentro de `montar()` lo siguiente; el diseño 3D puede rehacerlo, siempre que
> conserve el sentido:
> - piloto: `a-firma` de `idea:regla` a `idea:propuso`;
> - `imperativo`: el texto y la obra de `cita-kant` (es rigor, la cita literal de Morente) y su `desde` de
>   `idea:imagina` a `idea:ley`;
> - `mala-fe`: `a-firma` de `idea:mismo` a `idea:otro`;
> - `velo`: el texto de la tarjeta de Harsanyi («Apostar por la media») y las anclas de `giro:probable` a
>   `giro:media`, que son obligatorias porque la palabra cambió en el guion;
> - `wu-wei`: el hito `hoy` de `idea:nombre` a `idea:llamó`, también obligatorio por el cambio de guion;
> - `saber`: `titulo` del `cierre`;
> - `limite`: una nota de vigilancia bajo la escena.
>
> Las anclas atadas a palabras del guion que han cambiado (`media`, `llamó`, y `talento`, que sustituye a
> `enfermo` en la sincronía) las tiene que respetar el diseño 3D.

Tarea t-f87b83 (encargo e-17e430), 2026-10-28. Revisados `DECISIONES.md`, `KIT.md`, `fichas/LEEME.md` y las 10
fichas. Se han contrastado con `content/es/ideas/<id>.json` y con la tubería de `videos-cortos` (formato de
`memoria-fluida/guion-gemini-orus.json` y `norm` de `reel/lib/alinear.mjs`). En las fichas y en DECISIONES se han
hecho cambios mínimos, sin tocar el estilo. Los cambios de `KIT.md` se han pedido por mensaje a Kit-rincon, con
el jefe en copia.

**Veredicto: el piloto puede arrancar** cuando Kit-rincon entregue el kit. Hay una condición: que se resuelva
el aviso de anchos de §A.3, en el kit o moviendo piezas en el piloto dentro de los 80 px que permite `LEEME.md`.

---

## A. Grave (habría salido mal o con un error de rigor)

1. **Reparto F4 / F2b contradictorio.** DECISIONES §1, §10 y §11, LEEME y el piloto decían que F4 construye el
   kit. No es así: lo construye F2b (Kit-rincon) y **F4 solo monta el piloto**. → **Corregido** en DECISIONES §1,
   §10 y §11, en LEEME («Qué no se toca») y en el piloto («Criterios»). `KIT.md` también lo dice (cabecera y §6):
   → **pedido a Kit-rincon**.
2. **Cita de Kant que no era literal.** `cita-kant` llevaba `tipo: 'cita'` con un texto («…aquella máxima que
   puedas querer que se convierta en ley universal») que no coincide con ninguna traducción comprobada.
   García Morente (1921, Wikisource) dice: «obra sólo según una máxima tal que puedas querer al mismo tiempo
   que se torne ley universal». → **Corregido** el texto y la obra (trad. García Morente, 1921). Queda cotejar
   el facsímil, porque el OCR dice «torno».
3. **Piezas de 820 px centradas en x = 540 se salen del escenario seguro.** Van de x 130 a x 950, y el kit
   pide x ≤ 930 desde y = 860. Les pasa a `linea` (ancho por defecto de 820), a los `medidor` con `ancho: 820` y
   a `contraste` en `'columnas'` (2 × 400 + hueco). Las fichas las ponen casi todas por debajo de y = 860. Con
   eso saltaría `en_zona_interfaz` y fallaría la QA (§9.3). → **Pedido a Kit-rincon**: que `columnas` use las
   columnas fijas de §3.2 y que los anchos se recorten a 780, o que se centre en 495. Mientras tanto, F4 puede
   mover la pieza hasta 80 px.
4. **Harsanyi mal descrito** (`velo`, frase 7). «Apostarías por lo más probable» no es su objeción: él defiende
   maximizar la utilidad **media** con equiprobabilidad (SEP «Original Position»). → **Corregido**: «apostarías
   por la media». También se han cambiado el texto de la tarjeta, las anclas (`giro:media`) y la fila de fuentes.
5. **«Sano o enfermo» no está en el velo de Rawls** (`velo`, frase 4). La SEP enumera clase, riqueza,
   estatus, «natural assets and abilities», inteligencia, fuerza, concepción del bien y psicología, pero no la
   salud. → **Corregido**: «con talento o sin él». La ficha del sitio sí dice «su salud»: lo apunto en §D.
6. **Mill sí contestó al «lo pagamos todos»** (piloto). La fila de fuentes atribuía los dos argumentos del
   casco a la SEP «Paternalism», que nombra el casco y el cinturón pero no el argumento del coste. Mill lo
   discute en el cap. IV como *constructive injury* y concluye que la sociedad «can afford to bear» ese
   perjuicio. La voz sigue siendo correcta («Mill nunca habló de cascos»), pero decir que no tomó partido sobre
   el coste sería falso. → **Corregido** en la fila 6-7 y en los criterios: el post recoge su respuesta del
   cap. IV.

## B. Media (ambigüedad o regla del kit que se incumple)

1. **`a-firma` a menos de 0,7 s de la pieza que entra** (`KIT.md` §4.2). Con la entrada adelantada 0,3 s, el
   medallón se cruzaba con la pieza siguiente.
   - Piloto: `idea:regla` → `cita-mill` en `idea:sobre`, unos 0,6 s. → **Corregido**: `a-firma` en
     `idea:propuso`, que se ha añadido a la sincronía.
   - `imperativo`: `idea:prueba` → `cita-kant` en `idea:imagina`, unos 0,5 s. → **Corregido**: la cita entra en
     `idea:ley`.
   - `mala-fe`: `idea:mismo` → el cortapapeles, unos 0,6 s. → **Corregido**: `a-firma` en `idea:otro`.
   - `limite`: `idea:distinguió` → `idea:naturales` queda al límite. → **Nota en la ficha** con la salida
     prevista si se cruzan (retrasar `desde` a `naturales+0.4`).
2. **Orden de escenas.** DECISIONES §6 numeraba gancho → giro → idea → ejemplo, pero el piloto pone el giro
   tras el ejemplo y `limite` pone el ejemplo antes de la idea. → **Corregido** en §6: manda el orden de la
   ficha, y las anclas van por nombre.
3. **Formato de `clave` y `error`.** Las fichas los escriben con su puntuación (`casco?`), mientras que
   `guion.json` usa arrays. → **Aclarado** en DECISIONES §6 y en el paso 3 de LEEME: `norm` quita los signos,
   así que funciona igual.
4. **Título del cierre que no coincidía** (`saber`): ponía «Define a un buen amigo» y la ficha y la portada
   dicen «Define qué es un buen amigo». → **Corregido**. En las otras 9 fichas coincide.
5. **Notación de `figuras` en el kit.** `KIT.md` §4.9 escribe `etiqueta: { texto, piedra? }` y `postura: …`,
   mientras que `mala-fe` usa `{ hace: 'etiqueta', texto, piedra }`. → **Pedido a Kit-rincon** que fije una sola
   forma.

## C. Menor (rigor o tono, ya corregido o solo anotado)

- `wu-wei` 4: «le puso nombre» insinuaba que el término lo inventó el *Daodejing*, cuando también sale en las
  *Analectas* y en el *Zhuangzi*. → «lo llamó», y el hito `hoy` pasa a `idea:llamó`.
- `wu-wei` 7: «es lo que te mantiene alerta» daba por cerrado un modelo teórico (Espie et al., 2006, que es
  una *theoretical review*). → «puede ser lo que…». También se ha corregido el título del artículo y se han
  añadido autores, páginas y DOI.
- `wu-wei`: ctext.org bloquea a los agentes. Se ha añadido como fuente la traducción de Legge en Gutenberg
  (#216).
- `mala-fe` 5: «te tratas como una cosa» generalizaba a todo el mundo, contra el objetivo («puede serlo»). →
  «es tentador tratarte».
- `saber` 6: «siempre aparecía un caso» → «solía aparecer». No todos los diálogos refutan con un
  contraejemplo, y la ficha sigue teniendo 125 palabras.
- `significado` 6: la fila de fuentes decía que «prometer» está en el §23, y no está. La voz se mantiene
  (son ejemplos del vídeo); se ha corregido la fila.
- Piloto 5: `puente-roto` en «peligroso» sugiere un daño **seguro**, el caso en el que Mill sí permite parar a
  la persona. Lo dejo como está: la voz dice «peligroso» y lo que se ve es aceptable. Si se quiere afinar,
  se usa `puente` con la burbuja de aviso, sin cambiar de icono.
- `condicionamiento` 8: «tu mano ha aprendido un programa» es una licencia. La frase «No te falta voluntad»
  sale de la ficha («No es falta de voluntad»), así que está bien.

**Sin cambios**: `condicionamiento`, `critica` y `limite` (salvo la nota del `a-firma`). Sus guiones están
dentro de lo que dice la ficha, los ganchos no prometen más que la idea y las citas fuera de tema están
excluidas.

## Duración (recontada tras los cambios)

Se calcula con palabras / ritmo + 3,7 s de cola + 0,2 s de la pausa de la llamada. Todas caben en 45 s.

| Reel | Palabras | a 3,4 pal/s | a 3,2 pal/s |
|---|---|---|---|
| principio-del-dano | 123 | 40,1 | 42,3 |
| condicionamiento-operante | 118 | 38,6 | 40,8 |
| wu-wei | 124 | 40,4 | 42,6 |
| limite-del-placer | 120 | 39,2 | 41,4 |
| imperativo-categorico | 122 | 39,8 | 42,0 |
| mala-fe | 123 | 40,1 | 42,3 |
| significado-como-uso | 120 | 39,2 | 41,4 |
| velo-de-la-ignorancia | 123 | 40,1 | 42,3 |
| critica-de-la-causalidad | 122 | 39,8 | 42,0 |
| saber-que-no-se-sabe | 125 | 40,7 | 43,0 |

Ninguna repasa el tope de 125. Las anclas cambiadas se han comprobado contra el texto de su escena.

## Fuentes: cuáles se abrieron (28-10-2026)

| Comprobada en línea | Dónde |
|---|---|
| Mill, *On Liberty*, cap. I (soberanía; «remonstrating… entreating») | Gutenberg #34901 |
| Mill, cap. V (puente: detener si no hay tiempo de avisar; si solo hay riesgo, «only warned») | ídem |
| Mill, cap. IV (*constructive injury*, «can afford to bear») | ídem |
| SEP «Paternalism» (Dworkin): casco, cinturón y puente de Mill; **no** el argumento del coste | plato.stanford.edu |
| Kant, *Fundamentación* II, fórmula de la ley universal y promesa (Morente, 1921) | es.wikisource.org |
| SEP «Original Position»: qué oculta el velo (sin salud) y la objeción de Harsanyi | plato.stanford.edu |
| Harsanyi 1975, APSR 69(2), 594-606 (referencia; el DOI no se ha confirmado en doi.org) | RePEc / Cambridge |
| Espie et al. 2006, *Sleep Med Rev* 10(4), 215-245, doi:10.1016/j.smrv.2006.03.002 | PubMed 16809056 |
| Platón, *Lisis* 223b (Lamb) | Perseus |
| *Daodejing* 8, 37, 48 y 78 (Legge) | Gutenberg #216 |

**Sin abrir** (quedan para el `guion-fuentes.md` de cada reel, como manda DECISIONES §7): Epicuro, *Carta a
Meneceo* 127 y 131-132 y *Máximas* XV (D. L. X); Platón, *Apología* 21d; al-Ghazali, *Tahāfut*, disputa 17
(Marmura); Averroes (van den Bergh); Ferster y Skinner (1957), Humphreys (1939) y Jenkins y Stanley (1950);
Sartre, *El ser y la nada* y *El existencialismo es un humanismo* (el cortapapeles); Wittgenstein, *IF* §11, §23
y §43 (García Suárez y Moulines; el §23 solo se ha visto en parte); Rawls, *TJ* §13, §14, §24, §26 y §46;
fechas del *Tractatus*; *Analectas* 15.5.

## D. Queda abierto (fuera de mi alcance: lo decide el jefe o el humano)

1. **`content/es/ideas/saber-que-no-se-sabe.json` y su versión `en/` están modificados sin commit.** El
   `ejemplo_real` se cambió de «un juego» y el montón de arena a «un buen amigo», y la ficha del reel dice
   «cambiado en esta tarea». Eso choca con DECISIONES §10, que prohíbe tocar el sitio en esta fase. El reel
   depende de ese cambio (filas 1-4 de sus fuentes). Hay que decidir si se mantiene, y si se hace commit,
   antes de F5b.
2. **Ficha del sitio `velo-de-la-ignorancia`**: pone «su salud» entre lo que oculta el velo. No consta en
   Rawls (§A.5).
3. **Ficha del sitio `condicionamiento-operante`**: dice que Skinner «descubre» que el refuerzo impredecible
   es el más resistente, y que es «el programa de refuerzo más resistente que existe». El efecto ya estaba
   descrito antes (Humphreys, 1939). El reel ya lo evita.
4. **Cambios de `KIT.md`** pedidos a Kit-rincon: el reparto F2b/F4, los anchos y las columnas (§A.3) y la
   notación de `figuras` (§B.5). Si Kit-rincon no los acepta, F4 lo resuelve moviendo piezas.
