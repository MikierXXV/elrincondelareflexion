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

Iconos que la filosofía pediría y que no existen todavía (vela, ojo, espejo, máscara, semilla): son una
opción para el humano en DECISIONES.md, no una decisión.

## Asignados

| Ficha | Icono | Por qué |
|---|---|---|
| idea `termino-medio` | `bucle` | «las virtudes se adquieren como los oficios, practicándolas» |
