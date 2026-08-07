# Fase 1 — Investigación: fichas del MVP

Entregable de la fase de investigación. Las fichas completas viven en `content/es/` y son la
fuente de verdad; este documento es el índice de revisión y el registro de decisiones editoriales.

- **14 corrientes**, **44 autores**, 3 niveles de profundidad por ficha, mínimo 2 fuentes cada una.
- Validado con `node scripts/validate-content.mjs` (integridad referencial, límites de longitud por
  nivel, presupuesto 3D, paridad de idiomas).

## Cómo revisar

| Qué | Dónde |
|---|---|
| Corrientes, contexto, orden cronológico | `content/es/corrientes.json` |
| Ficha completa de un autor | `content/es/autores/<id>.json` |
| Reglas de forma del contenido | `content/schema/autor.schema.json` |

Cada ficha contiene: `citas`, `nivel_1_resumen` (cromo), `nivel_2_desarrollo`, `nivel_3_experto`,
`preguntas_filosoficas`, `debate_abierto`, `visualizacion` y `fuentes`.

## Decisiones editoriales tomadas

**1. Cronologías paralelas, no una línea única.** El recorrido se organiza en tres bloques
(`occidental`, `no-occidental`, `psicologia`). Las corrientes no occidentales llevan un campo
`cronologia_paralela_a` que indica con qué tramo occidental son contemporáneas, en vez de insertarlas
como escalones de una secuencia europea. La filosofía china y la india son **anteriores o
contemporáneas** a Sócrates, y el recorrido tiene que decirlo, no disimularlo.

**2. La psicología no entra como apéndice.** Todas las fichas tienen `preguntas_filosoficas`, y las
seis de psicología añaden `dialogo_filosofico`: qué problema filosófico reformula esa escuela
(transparencia del yo en Freud, libre albedrío en Skinner, identidad en Jung, florecimiento en
Maslow, autonomía en Rogers, sentido tras el existencialismo en Frankl).

**3. El nivel 3 dice lo que está en disputa.** El campo `debate_abierto` es obligatorio en la
práctica y marca dónde una interpretación es controvertida en lugar de presentarla como cerrada.
Ejemplos: el problema socrático, la manipulación póstuma de Nietzsche por su hermana, el retrato de
Eichmann frente a la tesis de Arendt, la ausencia de respaldo empírico a la jerarquía de Maslow, el
estatuto científico del psicoanálisis, la estratificación de las Analectas.

**4. Rigor asimétrico en el bloque de psicología.** Donde hay evidencia empírica se dice qué se
sostiene y qué no: la pirámide de Maslow no es de Maslow y su secuencia no está respaldada; las
tres condiciones de Rogers no son suficientes aunque sí son factores comunes con apoyo; el testimonio
de Frankl tiene sesgo de supervivencia; el inconsciente cognitivo no es el inconsciente freudiano.

**5. Una frase célebre por autor, con la atribución marcada.** Las 44 fichas llevan un aforismo que
funciona como puerta de entrada emocional a la idea (cromo y nivel 2). No entra en el nivel 3: ahí se
analiza, no se evoca. Ver §"Citas" más abajo.

**6. Tradiciones no occidentales con sus propios problemas de traducción.** Las fichas de Confucio,
Laozi, Zhuangzi, Vedanta, Buda y Nāgārjuna señalan explícitamente los riesgos de encuadre: `ren` y
`li` sin equivalente limpio, el neovedanta como capa moderna, la mediación de traducciones del XIX
en Schopenhauer, el catuskoti y sus formalizaciones rivales.

## Reparto de visualizaciones

Una metáfora visual por idea, ninguna decorativa. El presupuesto de rendimiento se aplica ya en la
capa de datos: **el validador falla si hay más de 6 escenas Three.js** en todo el sitio, hero aparte.

| Tipo | Cuántas | Cuáles |
|---|---|---|
| `three-js` (destacada) | 2 de 6 | La caverna de Platón · Las condiciones a priori de Kant |
| `svg-interactivo` | 42 | El resto |

Quedan 4 huecos 3D libres para cuando el diseño visual muestre que alguna idea concreta los pide
(candidatas naturales: el velo de la ignorancia de Rawls, ya marcado como `destacada` pero resoluble
en SVG, y la vista desde arriba de Marco Aurelio).

## Índice de autores

### Bloque occidental

| Corriente | Autores | Visualización de la idea |
|---|---|---|
| Presocráticos | Heráclito · Parménides · Pitágoras | el río que conserva forma y cambia materia · la esfera que resiste ser dividida · el monocordio y las proporciones consonantes |
| Clásica griega | Sócrates · Platón · Aristóteles | la red de la definición que se rompe caso a caso · **la caverna en 3D** · el término medio que se desplaza según la situación |
| Helenismo | Epicuro · Epicteto · Marco Aurelio · Pirrón | el recipiente sin fondo de los deseos vanos · el círculo de lo que depende de ti · el zoom que reescala una preocupación · la balanza que siempre vuelve al equilibrio |
| Patrística y escolástica | Agustín · Tomás de Aquino | el "ahora" que no se deja señalar · las dos vías por la misma ladera |
| Racionalismo | Descartes · Spinoza · Leibniz | las capas de certeza que se retiran hasta un punto irreductible · la cadena de causas tras una decisión "espontánea" · el mal que no se puede quitar sin arrastrar el resto |
| Empirismo | Locke · Berkeley · Hume | la página que solo se llena por experiencia · el cono de percepción y lo que queda fuera · el choque repetido donde no aparece la conexión |
| Ilustración e idealismo | Rousseau · Kant · Hegel · Schopenhauer | voluntad general frente a suma de intereses · **las condiciones a priori en 3D** · los dos medidores de reconocimiento · el ciclo del deseo y su suspensión |
| Existencialismo | Kierkegaard · Nietzsche · Sartre | el borde sin nada que empuje ni retenga · el valor que cambia de signo al tirar de él hacia atrás · los moldes de la mala fe |
| Analítica | Russell · Wittgenstein | la frase que se desarma en tres condiciones · la palabra que cambia de sentido al cambiar de escena |
| Ética y política contemporánea | Rawls · Arendt | el reparto antes y después del velo · el puesto en la cadena que no ve el conjunto |

### Bloque no occidental

| Corriente | Autores | Visualización de la idea |
|---|---|---|
| Filosofía china | Confucio · Laozi · Zhuangzi | editar los vínculos en vez de la persona · el agua que llega más lejos cuanto menos se la empuja · las etiquetas que se reescriben al cambiar de observador |
| Filosofía india | Upanishads/Vedanta · Buda · Nāgārjuna | las capas que se retiran hasta que no queda qué señalar · el objeto que desaparece con su ensamblaje · el elemento que pierde sus propiedades al aislarlo de la red |
| Filosofía islámica | Avicena · Al-Ghazali · Averroes | la definición completa que no decide si algo existe · el fuego y el algodón sin vínculo visible · el mismo pasaje en tres niveles de lectura |

### Bloque psicología del siglo XX

| Autores | Visualización de la idea |
|---|---|
| Freud · Jung · Skinner · Maslow · Rogers · Frankl | la razón construida después de decidir · la sombra que se proyecta sobre los demás · los programas de refuerzo y la resistencia a la extinción · la carencia básica que captura toda la atención · las dos figuras que convergen al retirar condiciones · el margen estrecho que sigue activo cuando nada más lo está |

## Citas: 44 aforismos con la atribución marcada

Cada ficha lleva una frase célebre en `citas`. Aparece en el cromo y en el nivel 2 —nunca en el
nivel 3— y su función es dar acceso inmediato a la idea antes de cualquier explicación.

Tres restricciones, las tres verificadas por el validador:

1. **Máximo 15 palabras.** Es una regla de derechos de autor, no de estilo, y el build falla si se
   supera.
2. **Versión propia al castellano.** El original de Marco Aurelio o del Daodejing es de dominio
   público; la traducción publicada que uno encuentra en una edición moderna, no. Todas las
   versiones son propias y deliberadamente sobrias.
3. **Marca de atribución obligatoria**, con nota exigida cuando no es literal:

| Marca | Qué significa | Cuántas |
|---|---|---|
| `directa` | Localizable en la obra citada | 37 |
| `tradicional` | Formulación condensada o transmitida por la tradición, no literal | 6 |
| `dudosa` | Circula atribuida sin pasaje localizado | 1 |

Esto no es celo burocrático: **varias de las frases más famosas de esta lista no son de quien
parece**, y decirlo es más interesante que ocultarlo.

- **Sócrates**: se cita "solo sé que no sé nada", que no aparece así en Platón. La ficha usa una
  frase real de la Apología y desmiente la otra en la nota.
- **Aristóteles**: "somos lo que hacemos repetidamente" es de Will Durant, 1926.
- **Frankl**: la celebérrima frase sobre "el espacio entre estímulo y respuesta" **no aparece en
  ninguna de sus obras** — nadie ha conseguido localizarla. La ficha cita una suya real y lo
  advierte.
- **Jung**: la única marcada `dudosa`. La frase sobre lo inconsciente y el destino circula
  masivamente sin pasaje localizado. Recoge una idea suya; la formulación, probablemente, no.
- **Nietzsche**: "quien tiene un porqué…" es suya, pero Frankl la citó tanto que hoy se le atribuye
  a Frankl. Es el caso inverso, y también va anotado.
- **Heráclito** y **Pitágoras**: el río y "todo es número" son condensaciones posteriores, no
  fragmentos literales.

## Derechos de autor

- Todo el texto está redactado de cero, sintetizado; no hay traducción ni paráfrasis cercana de
  ninguna entrada de enciclopedia ni de ninguna edición con derechos.
- Las citas de autores todavía en derechos (Sartre, Arendt, Rawls, Skinner, Maslow, Rogers, Frankl)
  son fragmentos de una línea, con obra y año, dentro del derecho de cita con fines divulgativos.
- Las visualizaciones son geometría y animación propias. No se descarga ningún asset de terceros.

## Fuentes: verificadas por HTTP

`node scripts/check-fuentes.mjs` comprueba las 99 URLs declaradas y distingue OK / redirigida /
rota / sin comprobar. Solo las rotas hacen fallar el build; una redirección es un aviso accionable
(la URL sigue funcionando, pero conviene apuntar a la definitiva) y "sin red" no rompe CI en
entornos sin salida a internet.

Primera pasada: **85 OK, 12 redirigidas, 3 rotas**. Ya corregidas todas. Estado actual: **99/99 OK**.

- Rotas: los slugs antiguos de IEP `pythagor/` y `rawlspol/` ya no existen → `pythagoras/` y `rawls/`.
- Redirigidas: doce entradas de IEP con slugs abreviados que ahora usan la forma larga
  (`aquinas/` → `thomas-aquinas/`, `berkeley/` → `george-berkeley-british-empiricist/`, etc.).
  Donde el destino era una entrada más específica que la original se ajustó también el título,
  para que la referencia no prometa más de lo que enlaza (caso de Agustín, que ahora apunta a la
  entrada de filosofía política y social).
- **Jung no tiene entrada ni en SEP ni en IEP.** No es un enlace caducado: no existe, y eso dice algo
  sobre su posición en la filosofía académica. Su ficha se apoya en fuentes historiográficas
  (Shamdasani, Bair) y lo hace explícito en el propio listado de fuentes.

## Pendiente antes de publicar

1. **Traducción al inglés.** `content/en/` está vacío; el validador ya avisa y exigirá paridad exacta
   de ids cuando exista.
2. **Revisión por especialista** de los bloques no occidental y de psicología, tal como recomendaba
   el análisis filosófico del plan.
3. **Ambos scripts en CI**, como paso previo al build de GitHub Pages.
