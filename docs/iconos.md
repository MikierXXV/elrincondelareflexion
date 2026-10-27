# Catálogo de iconos de «Piénsalo así»

Se elige con `"analogia": { "parrafo": <n>, "icono": "<nombre>" }` en la idea (párrafo de `desarrollo`) o en el
autor (párrafo de `nivel_2_desarrollo`). El mismo valor va en `content/es` y en `content/en`: el validador exige
que la forma en bloques sea igual en los dos idiomas. Un nombre fuera de esta lista **rompe `npm run validar`**.

Los trazos están copiados tal cual de software-engineer y viven en `ICONOS_ANALOGIA` (`src/app/bloques.ts`):
24×24, trazo de 1,75 y `currentColor`, así que siguen el acento de la corriente y los dos temas. Para añadir uno,
se añade allí (nombre solo a–z, una línea) y aquí. `idea` es el comodín: conviene usarlo poco.

| Icono | Qué dibuja | Analogías de… |
|---|---|---|
| `idea` | bombilla | comodín, «imagina que…» sin objeto concreto |
| `bucle` | dos flechas circulares | práctica, hábito, repetición, ciclos, eterno retorno |
| `balanza` | balanza | equilibrio, justicia, término medio, sopesar |
| `mapa` | mapa plegado | orientarse, recorrido, perspectiva, territorio |
| `puente` | puente | unir dos orillas, mediación, diálogo entre tradiciones |
| `capas` | tres capas | niveles de realidad, jerarquías, apariencia y fondo |
| `arbol` | árbol de nodos | genealogías, ramificación, clasificaciones |
| `red` | nodos conectados | relaciones, comunidad, interdependencia |
| `ramas` | ramas que se separan | bifurcaciones, alternativas, caminos que se separan |
| `caja` | caja | contenedor, lo cerrado, cosa en sí |
| `candado` / `llave` | candado, llave | lo inaccesible, acceso, desvelar |
| `escudo` | escudo | protección, defensa, ataraxia |
| `reloj` | reloj | tiempo, finitud, duración |
| `libro` | libro abierto | texto, escritura, tradición, saber transmitido |
| `examen` | hoja con check | prueba, verificación, criterios |
| `lupa` | lupa | examinar, duda, indagar |
| `persona` | una persona | el sujeto, «tú» en la analogía, un personaje |
| `fila` | dos personas | los otros, sociedad, turnos |
| `mensaje` | bocadillo | conversación, diálogo socrático, lenguaje |
| `sombrero` | sombrero | papeles, máscaras, perspectivas |
| `semaforo` | semáforo | normas, permitido y prohibido |
| `fabrica` | fábrica | trabajo, producción, alienación |
| `tienda` | tienda | mercado, intercambio, comercio |
| `trueque` | dos flechas opuestas | intercambio, contrato, reciprocidad |
| `camion` | camión | transporte, transmisión |
| `receta` | olla en el fuego | procedimiento, elaboración paso a paso |
| `engranaje` | engranaje | mecanismo, causalidad, el mundo como máquina |
| `rayo` | rayo | lo súbito, iluminación, energía |
| `nube` | nube | lo vago, lo que no se puede asir |
| `sobre` | sobre | mensaje, aviso, revelación |
| `nevera` | nevera | guardar y recuperar, memoria |
| `datos` | cilindro | archivo, registro, memoria colectiva |
| `platos` | pila de platos | acumulación, lo último que entra |
| `canal` | pantalla con «play» | espectáculo, representación, caverna |
| `robot` | robot | máquinas, autómatas, mente artificial |

### Iconos propios de la filosofía (R2, aprobados por el humano)

| Icono | Qué dibuja | Ejemplo de uso |
|---|---|---|
| `vela` | vela encendida | la razón como luz frágil, la llama que se pasa de uno a otro |
| `ojo` | ojo | ver y ser visto, contemplación, la mirada del otro |
| `espejo` | espejo de mano | reflexión sobre uno mismo, autoconocimiento, el reflejo |
| `mascara` | máscara | persona y papel, apariencia social, el yo que se muestra |
| `semilla` | brote | potencia y acto, lo que está en germen, desarrollo |
| `camino` | camino que se aleja | la vía, el método, el Tao, el sendero de la virtud |
| `caverna` | boca de cueva con figura | la caverna de Platón, ignorancia, lo que se toma por real |
| `cadena` | dos eslabones | causalidad, dependencia, encadenamiento de razones |
| `sol` | sol | el Bien, la verdad que ilumina, la luz de la razón |

(`balanza` y `mapa` ya existían y cubren justicia/equilibrio y orientación.)

## Asignados

| Ficha | Icono | Por qué |
|---|---|---|
| idea `termino-medio` | `bucle` | «las virtudes se adquieren como los oficios, practicándolas» |
| idea `anatman` | `engranaje` | el carro que no es nada aparte de sus piezas ensambladas y funcionando (párrafo 0 entero) |
| idea `mundo-de-las-ideas` | `caverna` | la alegoría de la caverna, párrafo 2 entero |
| autor `platon` | `caverna` | la alegoría de la caverna, párrafo 1 entero de `nivel_2_desarrollo` |
| idea `dicotomia-del-control` | `mascara` | el actor al que se asigna un papel: no elige cuál, sí cómo lo representa (párrafo 2 entero) |
| autor `epicteto` | `mascara` | la vida como un papel asignado en una obra (párrafo 1 entero de `nivel_2_desarrollo`) |
| idea `libertad-como-comprension` | `cadena` | la piedra lanzada que se creería libre: causalidad que no se ve (párrafo 0 entero) |
