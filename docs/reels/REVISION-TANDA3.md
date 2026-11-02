# Revisión de la tanda 3 (F11 · t-476543 · encargo e-17e430)

Revision-tanda3, 31-10-2026. He revisado las 10 fichas de `fichas/` (lotes 3a y 3b) contra `DECISIONES.md` (entero, y
sobre todo §3, §7 y §13), contra su ficha del sitio (`content/es/ideas/<id>.json` y `content/es/autores/<id>.json`) y
contra el código del kit (`videos-cortos/reel/reels/rincon-kit`: piezas, modelos, iconos y `nucleo/tiempo.js`). No he
generado voz ni renderizado, y no he tocado `content/` ni `src/`. Todo lo corregido son cambios locales en las fichas.

## Veredicto por ficha

| Lote | Ficha | Veredicto | Qué se cambió o queda pendiente |
|---|---|---|---|
| 3a | `duda-metodica` | **corregida** | Coma de «Pero no, en que» fuera; dos anclas de escena. El jefe decide lo de «existo» (D2) |
| 3a | `tabula-rasa` | **corregida** | Ancla del `late` del gancho |
| 3a | `eterno-retorno` | **OK** | Una sugerencia menor (D5) |
| 3a | `las-cuatro-verdades` | **corregida** | «Desear» lleva debajo «En general»; criterio nuevo para que el post explique el camino; ancla de una tacha |
| 3a | `alienacion` | **dudosa** | Se arregló la tacha del gancho, que no se veía, y otra ancla. Falta decidir «le puso nombre» (D1) |
| 3b | `flujo-y-permanencia` | **OK** | Criterio de post sobre *panta rhei*. Fuera de alcance, un problema en la ficha del sitio (D6) |
| 3b | `el-tiempo-en-el-alma` | **corregida** | La cita no era literal y ahora lo es (frases 4 y 5 y la losa, con traductor); ancla del resaltado |
| 3b | `placeres-superiores` | **corregida** | `cita-mill` pasa a `cita` con «trad. propia», porque la voz la dice como literal. Hay plan B (D4) |
| 3b | `ren-y-li` | **corregida** | Ancla del `hilo` del cierre |
| 3b | `termino-medio` | **corregida** | Ancla de la segunda tacha del gancho |

En las 10 fichas, además (cambio mecánico):
- **Bloque `voz`.** Ninguna ficha nombraba `ancla_frases` ni `whisper_sin_prompt`. Las tres opciones existen en
  `reel/lib/alinear.mjs` (líneas 72, 197-217). Cada ficha lleva ahora una línea **Voz:** que manda el bloque de §13.2
  tal cual, con `ancla_pausas`, `ancla_frases`, `whisper_sin_prompt`, `cta_cola_ms` y su `portada_color`.
- **Rango de `prueba-atempo`.** «Cómo comprobarlo» decía `1.00 1.08 0.01` y §13.2 dice `1.00 1.16 0.01`. Ya está
  cambiado, y no es un detalle: `duda-metodica` y `el-tiempo-en-el-alma` pueden necesitar más de 1,08 (ver «Ritmo»).

## Ritmo

Recuento con un script, contando palabras separadas por espacio o guion y pausas como grupos de `, . : ; ? ! …`.
Las cifras coinciden con las fichas salvo en las dos que he tocado.

**Cómo he estimado el ritmo.** La referencia es `saber-que-no-se-sabe`:
- puntuado (125 palabras y 30 pausas, una cada 4,17), salió a 3,28 pal/s con `atempo` 1,04, es decir, 3,15 a 1,00;
- sin puntuar salió a 3,68, que son unos 3,54 a 1,00. No conozco sus pausas exactas, así que supongo una cada ~5,5,
  la mitad del rango de las fichas de F3 según §3.

De ahí sale, a `atempo` 1,00, ritmo ≈ 3,15 − 6,7 × (pausas/palabra − 0,24). Es una estimación con dos puntos: las
tomas de Orus varían bastante, un ±5 % como poco, así que vale para ordenar las fichas, no para predecir el valor.

| Ficha | Palabras | Pausas (pal/pausa) | Más larga | «…» | Duración a 3,38 / 3,2 | pal/s estimados a 1,00 | `atempo` máx. para ≤ 3,38 |
|---|---|---|---|---|---|---|---|
| duda-metodica | 120 | 35 (3,43) | 14 | 1 | 39,5 / 41,5 s | ~2,80 | ~1,21 |
| tabula-rasa | 121 | 30 (4,03) | 17 | 1 | 39,8 / 41,9 s | ~3,10 | ~1,09 |
| eterno-retorno | 121 | 29 (4,17) | 19 | 3 | 39,8 / 41,9 s | ~3,15 | ~1,07 |
| las-cuatro-verdades | 120 | 28 (4,29) | 19 | 2 | 39,5 / 41,5 s | ~3,19 | ~1,06 |
| alienacion | 122 | 31 (3,94) | 18 | 2 | 40,1 / 42,2 s | ~3,06 | ~1,10 |
| flujo-y-permanencia | 123 | 29 (4,24) | 16 | 3 | 40,4 / 42,5 s | ~3,18 | ~1,06 |
| el-tiempo-en-el-alma | 122 | 35 (3,49) | 17 | 1 | 40,1 / 42,2 s | ~2,84 | ~1,19 |
| placeres-superiores | 118 | 28 (4,21) | 19 | 2 | 39,0 / 40,9 s | ~3,17 | ~1,07 |
| ren-y-li | 124 | 32 (3,88) | 15 | 2 | 40,7 / 42,8 s | ~3,03 | ~1,12 |
| termino-medio | 123 | 30 (4,10) | 18 | 2 | 40,4 / 42,5 s | ~3,12 | ~1,08 |

- **Ninguna pasará probablemente de 3,38 con `atempo` 1,00.** Todas tienen igual o más puntuación que `saber` puntuado.
  Las más justas, con un margen de ~6 % sobre la variación entre tomas, son **`las-cuatro-verdades`,
  `flujo-y-permanencia` y `placeres-superiores`**, las de una pausa cada 4,2-4,3. Si alguna sale rápida, se baja el
  `atempo` desde la caché. Si sigue rápida, se puntúa más con las mismas palabras (2.ª petición). Por ejemplo:
  `las-cuatro-verdades` 6, «Es esa insatisfacción, de fondo, que aparece…», o `placeres` 9, «quien conoce las dos
  cosas…».
- **Las que puede que salgan lentas:** `duda-metodica` y `el-tiempo-en-el-alma`. Si 3,2 sigue siendo el suelo (§9.2),
  necesitarán un `atempo` de ~1,13-1,14, cerca del tope de 1,16. Lo pregunto en D3.
- Todas cumplen §13.1: 105-125 palabras, ≤ 4,5 por pausa, frases de ≤ 20 palabras, ≤ 1 «…» cada 40 palabras y
  duraciones de 30-45 s. `eterno-retorno` y `flujo` tienen 3 «…», justo en el tope.

## Escenas: lo que se ha corregido

**Trampa del kit, comprobada en `nucleo/tiempo.js:55`.** Una pieza empieza a irse 0,65 s antes de su `hasta` y a los
0,30 s ya no está. Un efecto anclado a la última palabra de una escena con `hasta: '<escena>:fin'` cae justo mientras
la pieza se va, y uno anclado a la misma palabra que el `hasta` no se ve nunca. Lo he buscado con un script en las 10
fichas y lo he arreglado así, sin cambiar lo que dice la escena:

| Ficha | Pieza | Antes | Ahora |
|---|---|---|---|
| alienacion | `rotulo-hice-yo` y `objeto-obra` | `hasta: 'giro:puede'` con la tacha en `giro:puede`: **la tacha no se veía** | `hasta: 'giro:parte'` (rótulo) y `'giro:revisa'` (caja); son los relevos con `rotulo-una-parte` y `figuras-proceso` |
| alienacion | `rotulo-expresarte` | tacha en `idea:vaciándote` | `idea:acaba` |
| duda-metodica | `rotulo-sumas` | tacha en `idea:siempre` | `idea:engañara` |
| duda-metodica | `figuras-yo` | `hasta: 'idea-2:dejó'` | `'idea-2:escrito'`, el mismo relevo que `cita-cogito`, para que la etiqueta dure más |
| tabula-rasa | `objeto-idea` | `late` en `gancho:nuevo` | `gancho:uno` |
| las-cuatro-verdades | `rotulo-compania` | tacha en `giro:compañía+0.3` | `giro:compañía` |
| el-tiempo-en-el-alma | `rotulo-presente` | resaltado en `giro:nada` | `giro:dura` |
| ren-y-li | `figuras-cierre` | `hilo` en `cierre:verdadero` | `cierre:principio` |
| termino-medio | `contraste-extremos` b | tacha en `gancho:sinceridad` | `gancho:tampoco` |

Con eso, el efecto llega ~0,5 s antes de que la pieza empiece a irse. Las palabras nuevas están en la columna de
sincronía. En la vista (`--vista`) hay que mirar que se ven. Los golpes de cámara en la última palabra no tienen este
problema.

**Comprobado y sin problemas:**
- Todas las piezas, modelos, estados, iconos, disposiciones y acciones que usan las fichas existen en el kit v2.
  Entre ellos `peones`, `tumbada` con `duerme`/`tiembla`, `sola` con `etiqueta`, `pareja` con `hilo`, `piedra` con
  `desgasta`, `movil` `vacio`, `libro` `abierto`, `engranaje` `fantasma`, `herramienta` `caja`, `medidor`
  `nivel`/`barras`, las tachas de `contraste` con `lado` y el resaltado de `rotulo`.
- Las 16 corrientes están en `rincon-kit/corrientes.json`, incluidas las seis nuevas.
- Todas las anclas `escena:palabra` existen en su escena. La única repetida es `alienacion` `idea:cómo` («el cómo» y
  «como tuyas» se normalizan igual), y el kit toma la primera, que es la buena.
- Hay un golpe por escena como mucho, en todas.
- Portadas: 2 líneas de ≤ 18 caracteres, y ningún `portada_resaltar` lleva signos pegados. En `tabula`, `duda` y
  `eterno`, en `portada_t` = 1,0 ya está el rótulo de abajo (y = 1400), no «solo el objeto» como dice la ficha. No
  incumple nada, porque la regla es no tener nada por encima de y = 700.
- Las fechas de los medallones coinciden con `content/es/autores/`.

## Rigor y fichas del sitio

Ninguna ficha contradice a la del sitio. Lo que me pedía el jefe que mirara:
- **Eterno retorno (¿prueba o cosmología?): bien resuelto.** La voz dice «propuso esa prueba» y «lo que importa no es
  si es verdad». El resumen del sitio también dice que «no es una teoría sobre el tiempo». La disputa (`matiz_experto`)
  va al post, como pide el criterio de aceptación. La cita de *Crepúsculo* queda fuera, bien.
- **Las cuatro verdades.** Se atribuye a «la tradición budista», el medallón dice «discutido» y no se ponen palabras
  literales en boca del Buda: bien. He corregido dos cosas:
  - La tacha de «Desear» a secas podía leerse como «el deseo no importa», cuando *taṇhā* suele traducirse por deseo.
    La ficha del sitio dice «no es desear **en general**», y ahora el contraste lo pone debajo.
  - El cierre reduce la cuarta verdad, el camino, a «cambiar cómo sujetas», y eso suena a autoayuda. He añadido el
    criterio de que el post explique la conducta, la disciplina mental y la comprensión (sitio: `desarrollo` §3).
  - Queda un matiz que no toco: «aferrarse» junta *taṇhā* con *upādāna*. Es la lectura del sitio, y va al post con
    *taṇhā*.
- **Citas que sonaban a literales sin serlo:**
  - `el-tiempo-en-el-alma`: la voz decía «Escribió: ¿qué es el tiempo? … a quien me lo pregunta…» y la losa estaba
    marcada como paráfrasis. He leído la traducción publicada (Á. Custodio Vega, rev. J. Rodríguez Díez, augustinus.it
    `conf_11_libro.htm`): «¿Qué es, pues, el tiempo? Si nadie me lo pregunta, lo sé; **pero** si quiero explicárselo
    **al que** me lo pregunta, no lo sé». La voz pasa a ser literal (+2 palabras: «pues», «Pero»; «a quien» → «al que»)
    y la losa pasa a `cita` con traductor. Total: 122 palabras y una pausa cada 3,5.
  - `placeres-superiores`: «Lo resumió así: mejor ser un Sócrates insatisfecho…» suena a cita, y la losa era
    paráfrasis. Ahora es `cita` con «trad. propia» de *Utilitarianism* II en Gutenberg, como en `duda` con el francés.
    El plan B está en D4.
  - `termino-medio` («Escribió que…»), `flujo` («Escribió, más o menos, que…») y el demonio de `eterno` se dicen como
    paráfrasis: bien.

## Lo que decide el jefe

- **D1 · `alienacion`, frase 4: «Karl Marx le puso nombre en 1844: alienación».** Marx no acuñó el término: la
  *Entfremdung*/*Entäußerung* viene de Hegel y Feuerbach, y Marx la reelabora. Propuesta: «Karl Marx lo analizó en mil
  ochocientos cuarenta y cuatro, y lo llamó: alienación.» Son 123 palabras y una pausa más. Las anclas `marx` y
  `alienación` no cambian, ni el `a-firma`. Cambia una afirmación del guion, así que no lo he tocado.
- **D2 · `duda-metodica`: «pienso, luego existo» como `cita` «trad. propia».** El francés dice «je suis», que es
  «soy». «Existo» es la fórmula habitual en castellano, y se apoya en el «ego sum, ego existo» de la *Med.* II, pero
  como traducción literal se puede discutir. Propongo mantenerlo y que el post lo explique. La otra opción es
  `parafrasis`, y entonces «Lo dejó escrito así:» debería ser «Lo resumió en:». Lo de que el genio maligno abarque las
  sumas es la misma simplificación que hace el sitio y la ficha ya la avisa: no la contradice.
- **D3 · ¿3,2 pal/s sigue siendo el suelo?** §13 solo pone el techo (≤ 3,38), y §9.2 dice 3,2-3,4. Si es el suelo,
  `duda` y `tiempo` necesitarán un `atempo` de ~1,13-1,14. Si no, sirve 1,00.
- **D4 · `placeres`, plan B.** Si no se puede leer el inglés de Gutenberg antes de grabar, la losa vuelve a
  `parafrasis` y la frase 7 tendría que pasar a indirecta, lo que cambia palabras.
- **D5 (menor) · `eterno-retorno`, frase 5: «cada dolor y cada alegría».** En §341 es «jeder Schmerz und jede Lust»,
  es decir, placer. Cambiar a «cada placer» deja las mismas palabras de sincronía. Lo dejo como sugerencia.
- **D6 (fuera de alcance) · ficha del sitio `flujo-y-permanencia`.** Su `ejemplo_real` dice «Todas las células de tu
  piel se sustituyen cada pocas semanas», y eso generaliza: no vale para la dermis, por ejemplo. El reel no lo usa,
  pero el error está en `content/`, que no toco. Que lo mire quien lleve el contenido.

Aviso para Diseno-tanda3: en `CANDIDATOS-2.md` hay que actualizar dos filas de la tabla de la tanda, porque la ficha
ha cambiado: `duda-metodica` pasa a 35 pausas (una cada 3,4) y `el-tiempo-en-el-alma`, a 122 palabras, 35 pausas
(3,5) y 40,1 / 42,2 s. No he tocado ese fichero.

## Criterios de aceptación

Se pueden comprobar todos: son sí/no sobre la voz, la pantalla o el post. Dos de ellos dependen de lo que se vea en
la hoja (`figuras-notas` en `tiempo`, `piedra` en `cuatro-verdades`), y la ficha ya les da una alternativa y pide
anotar el cambio en «Hecho». He añadido criterios en `las-cuatro-verdades` (el post explica el camino y el contraste
lleva «En general») y en `flujo` (*panta rhei*).
