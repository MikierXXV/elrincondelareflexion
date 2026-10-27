# Ideas y cromos en bloques: decisiones

Rama `bloques`, sacada de `main`. Nada de push. Lo que está aquí no se vuelve a discutir. Lo que tiene que
decidir el humano está al final, en «Opciones para el humano».

Precedentes: software-engineer (`src/app/bloques.ts`, `src/estilos/app.css`, `content/reglas.json → bloques`,
`notas/iconos.md`) y mentalista, rama `rediseno`, commit 8a17878 «Ficha en bloques con icono…». Ese commit
es la «ficha A en bloques» con el texto de antes sin reescribir, y es el modelo que se sigue.

## Qué son las ideas y los cromos

- **Idea**: una parada del recorrido (`src/app/recorrido.ts`, `seccionIdea`). Hay 59 por idioma. Todas
  viven en una sola página que se va desplazando, y no tienen página propia.
- **Cromo**: la tarjeta de autor de la galería (`src/app/cromos.ts`). Hay 47 por idioma. Al pulsarla se abre
  la **ficha de autor** en una capa (`src/app/ficha-autor.ts`). Es la misma ficha que se abre desde una
  idea con «ver ficha». «Pasar un cromo a bloques» quiere decir pasar esa ficha. La tarjeta de la rejilla
  no cambia: la cita sigue siendo el cuerpo y el nombre va como firma.

## Qué se reutiliza tal cual

- `md()` y `escapar()` de software-engineer: markdown mínimo y escape antes de marcar.
- `ICONOS_ANALOGIA`: los 36 trazos, sin cambios. El validador los lee del renderizador, como hace
  software-engineer, para no tener dos listas.
- La cabecera de bloque (icono en baldosa tintada + rótulo), la caja de analogía (`.anal`, `.anal-ico`) y los
  plegables con chevron.
- La regla de mentalista: **la analogía es uno de los párrafos que ya existen, señalado por su índice**, no
  texto nuevo. También su comprobación de que el texto no cambia; aquí se hace sobre el JSON y no sobre la
  página (`scripts/comprobar-texto-bloques.mjs`), así que no hace falta navegador.

## Qué se adapta

- **Tokens de elrincon y no los de software-engineer**: `--t-*`, `--e*`, `--r-panel`, `--il-texto`,
  `--fuente-titulo` y `--fuente-texto`.
- **El acento es el de la corriente** (`--acento-corriente`, que pone `colores-corriente.ts`). Solo aparece
  en tres sitios: el icono del bloque, el filete de «En una frase» y la caja de la analogía. Nunca en el
  texto corrido, por la austeridad que pide `sitio.css`. Los tintes son el 8 % del acento (bajo texto) y el
  16 % (bajo el icono).
- **El rótulo del bloque es un rótulo y no un titular**: versalitas pequeñas, en la línea de los rótulos que
  ya tiene el sitio. La jerarquía la siguen llevando el título de la idea y la pregunta.
- **Sin índice «En esta página»**: una idea no es una página, y la posición ya la marca el widget lateral.
- **Sin los bloques que exigen texto nuevo**: «Cómo funciona» en pasos, error típico, cuándo sí y cuándo no.
  Ver las opciones.

## El modelo de datos

- `desarrollo` (idea), `nivel_2_desarrollo` y `nivel_3_experto` (autor) aceptan **una cadena** (como
  siempre) **o una lista de párrafos**. Los párrafos son 2-4 en los dos primeros campos y 2-5 en el
  experto, de 60 caracteres como mínimo. Los límites de longitud de siempre se miden sobre el texto unido.
- `analogia: { parrafo, icono }` es opcional. En la idea señala un párrafo de `desarrollo`; en el autor, uno
  de `nivel_2_desarrollo`. Exige que el campo esté en párrafos y que el icono exista.
- **El renderizador vale para las 106 fichas desde ya.** Una ficha sin partir se ve con la maqueta nueva y
  su texto en un solo párrafo. Por eso el lote solo toca contenido JSON y no código.

## El texto

- Por defecto, **el texto actual se reparte en párrafos sin cambiar una letra**. Se parte solo en finales de
  frase, de modo que unir los párrafos con un espacio da exactamente la cadena de `main`. Lo comprueba
  `npm run validar:texto`.
- La analogía se marca **solo si un párrafo entero es una analogía**. No se fuerza: el cromo piloto
  (Aristóteles) no lleva ninguna, porque su «semilla en potencia» es media frase dentro de una explicación.
- Hay texto que ya existía y no se veía, y ahora se pinta: el `resumen` de la idea y el `nivel_1_resumen`
  del autor como «En una frase», la segunda cita del autor (el schema ya decía que «ambas se muestran en
  el nivel 2») y `dialogo_filosofico` (en la psicología). No es texto nuevo.
- Los rótulos de bloque son texto de interfaz y van en `ui.json → bloques`, en es y en en.

## Orden de lectura con la analogía (R4, sustituida por R4b)

La analogía se pinta siempre en su posición original; el orden del texto no cambia. `repartir()` decide según
`analogia.parrafo`:

- **Primer párrafo (p0):** «Piénsalo así» va como bloque **antes** de «La idea» (o «Su pensamiento», en el autor).
  `repartir()` devuelve `analogiaPrimero`.
- **Intermedio:** la caja va **dentro** del flujo de «La idea», en su índice, entre los párrafos de antes y de
  después. Mismo aspecto de caja con icono; el rótulo «Piénsalo así» va en pequeño dentro de la caja
  (`.anal-cuerpo small`), no como cabecera de bloque. Es el caso de mundo-de-las-ideas, platon y
  dicotomia-del-control.
- **Último:** bloque aparte **después** de «La idea»; el orden ya se respeta.

`repartir(texto, analogia, rotulo)` recibe el rótulo traducido para la caja intermedia. Lo usan `recorrido.ts` y
`ficha-autor.ts`.

## Idiomas

Siempre es y en a la vez. El validador exige la misma forma en los dos idiomas: mismo número de párrafos por
campo, misma analogía y mismo icono. Si se parte un idioma y el otro no, `npm run validar` falla.

## Ideas frente a cromos

Comparten `src/app/bloques.ts` (`seccion`, `repartir`, `enUnaFrase`, `md`, iconos) y `src/estilos/bloques.css`.

| Idea (en el recorrido) | Ficha de autor (en la capa) |
|---|---|
| situación · título · pregunta · **En una frase** (`resumen`) | nombre · meta · **En una frase** (`nivel_1_resumen`) |
| cita | las dos citas |
| **Compruébalo tú**: la pieza | **Su pensamiento**: `nivel_2` en párrafos |
| **La idea**: `desarrollo` en párrafos | **Piénsalo así** (opcional) |
| **Piénsalo así** (opcional) | **Preguntas de fondo** |
| **En la vida real**: `ejemplo_real` | **Qué problema filosófico reformula** (si hay `dialogo_filosofico`) |
| **Matiz**, plegable: `matiz_experto` | **Ideas de su corriente** |
| **Quién la pensó**: la tira de autores | **Modo experto**, plegable: `nivel_3` en párrafos, en disputa, fuentes |

Los títulos de bloque son `h4` en la idea (su título es `h3`) y `h3` en la ficha (su título es `h2`).

## Listón de calidad y lista de comprobación del QA

Para cada tanda, y para el piloto, antes de darla por hecha:

1. `npm run validar:texto` → «0 con el texto cambiado».
2. `npm run build` en verde. Incluye `validate-content --completo`, `check-contraste`, `tsc` y `vite build`.
   El aviso del chunk de three es antiguo y se ignora.
3. `node scripts/check-idiomas.mjs` en verde.
4. Capturas de las fichas de la tanda, en es y en, tema claro y oscuro, escritorio (1366) y móvil (390):
   - la idea, desde el recorrido;
   - la ficha de autor, en `#/cromos/<id>`, con el modo experto abierto.
   - En las capturas: sin desbordamiento horizontal ni errores de página; ningún párrafo partido a mitad
     de frase; la analogía, cuando la hay, se lee como analogía; el icono se distingue en los dos temas.
5. Antes de unir la rama, una pasada completa con el skill `auditar-sitio` (`npm run capturar:sitio` y
   `npm run auditar`), o con el agente auditor-visual. **Una cosa cada vez, y nada de navegador si el
   orquestador avisa de memoria.** Al acabar se cierran el servidor y el navegador.

## Fichas de ejecución

### P0 · Piloto (HECHO en esta rama)

- **Objetivo**: infraestructura, más una idea (`termino-medio`) y un cromo (`aristoteles`) en bloques, en
  es y en.
- **Ficheros**: `src/app/bloques.ts` (nuevo), `src/estilos/bloques.css` (nuevo), `src/app/recorrido.ts`,
  `src/app/ficha-autor.ts`, `src/app/contenido.ts`, `src/estilos/sitio.css`, `content/{es,en}/ui.json`,
  `content/schema/{idea,autor}.schema.json`, `scripts/validate-content.mjs`,
  `scripts/comprobar-texto-bloques.mjs` (nuevo), `package.json` (`validar:texto`), `docs/iconos.md`, y las
  4 fichas JSON del piloto.
- **Aceptación**: los puntos 1-4 del QA están verdes. Comprobado el 2026-10-27, con 16 capturas sin errores
  ni desbordamiento.

### L1-L5 · El lote: partir las fichas que faltan (sonnet, una tanda por agente)

- **Objetivo**: dejar en párrafos las ideas y los autores de las corrientes de la tanda, en es y en, y
  marcar la analogía donde un párrafo entero lo sea.
- **Tandas**: no se pisan, porque cada una es dueña de los JSON de sus corrientes.

  | Tanda | Corrientes | Ideas | Autores |
  |---|---|---|---|
  | L1 | presocraticos, clasica-griega, helenismo, escolastica | las de esas corrientes salvo `termino-medio` | salvo `aristoteles` |
  | L2 | racionalismo, empirismo, ilustracion-idealismo, utilitarismo | todas | todos |
  | L3 | marxismo, existencialismo, analitica, etica-politica-contemporanea | todas | todos |
  | L4 | filosofia-china, filosofia-india, filosofia-islamica | 10 | 9 |
  | L5 | psicologia-siglo-xx | 5 | 6 (revisar que `dialogo_filosofico` se ve) |

  Las listas exactas salen de `content/es/corrientes.json → corrientes[].ideas` y `[].autores`.
- **Pasos**:
  1. Reclamar `content/*/ideas/<id>.json` y `content/*/autores/<id>.json` de la tanda.
  2. Por cada ficha, leer el texto y decidir los cortes en final de frase:
     - `desarrollo`, 2-4 párrafos;
     - `nivel_2_desarrollo`, 2-4;
     - `nivel_3_experto`, 2-5.

     Cada párrafo es una unidad de sentido: el qué, el porqué, la consecuencia, el debate. Se corta en
     el mismo sitio en es y en en.
  3. Partir **con un script que lo verifique** (como `partir.mjs` del piloto: parte antes de cada marca y
     comprueba que `join(' ')` reproduce la cadena). Nunca a mano, copiando texto.
  4. Si un párrafo entero es una analogía, añadir `"analogia": { "parrafo": n, "icono": "…" }` en los dos
     idiomas, eligiendo el icono en `docs/iconos.md`, y apuntarla en «Asignados». Si no hay ninguna, no se
     marca nada.
  5. `npm run validar:texto` y `node scripts/validate-content.mjs --completo` tras cada ficha.
- **Qué no tocar**: ninguna palabra del texto; ningún otro campo; el código (`src/`, `scripts/`); las
  fichas de otras tandas; `main`. Tampoco push.
- **Aceptación**:
  - `validar:texto` da 0 fallos;
  - todas las fichas de la tanda están en párrafos en es y en en;
  - las analogías están justificadas en `docs/iconos.md`;
  - `npm run build` en verde.
- **Cómo comprobarlo**: QA 1-4 sobre 2 ideas y 2 autores de la tanda (los de párrafos más largos). Al
  final de todas las tandas, el QA 5 una sola vez.

### L6 · Cierre (cuando acaben L1-L5)

- Hacer obligatorio el formato en párrafos: en `validate-content.mjs`, que una cadena sea error. En los
  schemas, quitar la rama `string` del `oneOf`.
- QA 5 completo y fusión con `main`, cuando el humano lo apruebe.

## Riesgos

- **Un corte mal puesto se lee como texto roto.** Por eso: solo en final de frase, mismos cortes en es y
  en, y capturas por tanda.
- **El color.** El acento entra en la ficha por primera vez, más allá de la línea de situación. Se limita
  a icono, filete y analogía, pero si el humano lo ve como «confeti», basta con poner `--acento-bloque`
  igual a `--texto-secundario` en `bloques.css`.
- **El contraste de los tintes no lo mide `check-contraste.mjs`**, que mide los acentos sobre el fondo. Con
  el 8 % y el 16 % la diferencia es mínima, pero si se suben, hay que añadirlos al script.
- **La RAM.** `comprobar-texto-bloques.mjs` no usa navegador justamente por eso.

## Alternativas descartadas

- **Los bloques completos de software-engineer** (pasos, error típico, cuándo sí/no, analogía con título
  propio): exigen texto nuevo en 106 fichas × 2 idiomas. Quedan como opción.
- **Guardar desplazamientos de corte en vez de partir el JSON**: es frágil ante cualquier corrección de
  texto, y no hay precedente.
- **Duplicar el texto en un campo `bloques` nuevo**: dos copias que se desincronizan.
- **Comprobar el texto en el navegador, como mentalista**: no hay RAM para eso, y sobre el JSON es más
  estricto (letra a letra, no por recuento de palabras).
- **Una página propia por idea con índice lateral**: rompe el recorrido continuo, que es la decisión de
  fondo del sitio (fase 2).

## Decidido por el humano (antes eran dudas)

1. **El acento de la corriente en los bloques se queda** (icono, filete y analogía).
2. **Sí se muestra lo que antes no se veía**: «En una frase» (`resumen` y `nivel_1_resumen`), la segunda
   cita y `dialogo_filosofico`.
3. **No se escriben los bloques que piden texto nuevo** de software-engineer (pasos, error típico, cuándo
   sí/no, título de analogía).
4. **Sí a iconos propios de filosofía.** Hechos en R2, ver abajo.
5. **No se marcan analogías de media frase**: solo un párrafo entero que lo sea.

## Iconos propios de filosofía (R2)

Añadidos a `ICONOS_ANALOGIA` (`src/app/bloques.ts`), mismo viewBox 24×24 y mismo trazo que los 36 previos
(el validador los lee de ahí). Catálogo con ejemplos en `docs/iconos.md`. Ejemplos de uso, para el lote:

| Icono | Uso típico |
|---|---|
| `vela` | la razón como luz frágil; la llama que se transmite |
| `ojo` | contemplación, la mirada del otro |
| `espejo` | reflexión sobre uno mismo, autoconocimiento |
| `mascara` | persona/papel, apariencia social |
| `semilla` | potencia y acto, lo que está en germen |
| `camino` | la vía, el método, el Tao |
| `caverna` | la caverna de Platón, lo que se toma por real |
| `cadena` | causalidad, encadenamiento de razones |
| `sol` | el Bien, la luz de la razón |

`balanza` (justicia, término medio) y `mapa` ya existían.
