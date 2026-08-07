# Créditos de recursos de terceros

Todo lo que el sitio embarca y no ha hecho este proyecto está aquí, con su licencia. Si un recurso
no aparece en esta lista, es propio.

---

## `pensador.glb` — figura del hero

| | |
|---|---|
| **Obra** | *Le Penseur* (El Pensador), Auguste Rodin, 1880–1904 |
| **Modelo 3D** | «The Thinker by Auguste Rodin» |
| **Autor del escaneo** | Rigsters |
| **Técnica** | Fotogrametría a partir de unas 700 imágenes (2017) |
| **Origen** | https://sketchfab.com/3d-models/the-thinker-by-auguste-rodin-08a1e693c9674a3292dec2298b09e0ae |
| **Licencia** | **CC BY 4.0** — Creative Commons Atribución |
| **Verificado** | 2026-08-01 |

### Modificaciones realizadas

CC BY obliga a indicar los cambios. Son estos:

- Reducción de malla de 51 000 a ~25 000 triángulos (`gltf-transform`: `weld`, `simplify`, `dedup`).
- **Eliminadas las texturas de fotogrametría.** La pieza se ilumina y se materializa con el bronce
  y las luces propias del sitio, para que encaje con el resto de las visualizaciones.
- Compresión de geometría con meshopt.
- Recentrado y reescalado para el encuadre del hero.

### Atribución en el sitio

La exige la licencia, así que aparece en el pie de página, no solo en este fichero.

### Sobre la obra original

Rodin murió en 1917: la escultura es de dominio público. Lo que se licencia aquí es el **escaneo**,
que es obra distinta. Se descartaron dos alternativas por licencia y por peso:

- Scan the World / MyMiniFactory — **CC BY-SA**, que obligaría a redistribuir la malla derivada bajo
  copyleft; además son 40 MB y 837 000 triángulos.
- Cults3D, Thingiverse, Printables — licencias heterogéneas o no declaradas con claridad.

Ni Smithsonian Open Access ni el Cleveland Museum of Art publican escaneo 3D de esta obra, pese a
que el segundo conserva uno de los pocos vaciados hechos en vida de Rodin.

## Tipografías

**Newsreader** — Copyright 2020 The Newsreader Project Authors
(https://github.com/productiontype/Newsreader), SIL Open Font License 1.1.

**Inter** — Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter),
SIL Open Font License 1.1.

Ninguna de las dos líneas de copyright incluye «with Reserved Font Name», comprobado el 2026-08-03
contra los `OFL.txt` del repositorio google/fonts. Por tanto los ficheros modificados conservan el
nombre de familia original, que es lo que la licencia permite en ausencia de nombre reservado.

**Modificaciones**, reproducibles con `node scripts/preparar-tipografias.mjs`:

- Recortadas a los subconjuntos `latin` y `latin-ext`, y dentro de ellos al repertorio que el
  contenido usa más el latino-1 y el latino extendido-A completos como margen.
- Fijado el eje de tamaño óptico: 32 en Newsreader (titulares) y 18 en Inter (texto corrido).
- Recortado el eje de peso a 400–600, los tres pesos declarados en `design/tokens.css`.
- Sin cursivas: ninguna hoja de estilos del sitio las usa.

Resultado: 414,9 kB tal como los sirve Google → 82,1 kB. Se sirven desde el propio dominio.
