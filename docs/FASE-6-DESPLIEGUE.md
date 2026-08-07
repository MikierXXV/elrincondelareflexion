# Fase 6 — Despliegue en GitHub Pages

El flujo está en [.github/workflows/desplegar.yml](../.github/workflows/desplegar.yml) y ya está
verificado contra una compilación servida bajo subdirectorio, que es como sirve Pages y donde se
rompen estas cosas. Lo que queda es crear el repositorio y empujar.

## Qué hay que hacer una vez

```bash
git init -b main
git add .
git commit -m "El Rincón de la Reflexión"
git remote add origin https://github.com/<usuario>/<repo>.git
git push -u origin main
```

Y después, en el repositorio: **Settings → Pages → Source: GitHub Actions**. No hace falta rama
`gh-pages` ni ningún secreto: el flujo usa el despliegue oficial con `id-token`.

A partir de ahí, cada `push` a `main` publica.

## Lo que el flujo comprueba antes de publicar

Bloquean la publicación, porque un aviso que no bloquea acaba ignorándose:

| Comprobación | Qué exige |
|---|---|
| `npm run validar` | contenido válido, paridad de claves entre idiomas, citas breves con atribución, y 44 comprobaciones de contraste |
| `check-idiomas.mjs` | ningún texto visible escrito dentro del código |
| `tsc --noEmit` | TypeScript en estricto |
| `vite build` | que compile |

No bloquean, pero fallan a la vista, en un trabajo aparte porque tardan varios minutos: el recorrido
del sitio, las 59 piezas, las 35 variantes de mecánica, la legibilidad y el tacto de las piezas en
un móvil —`check-piezas.mjs`— y los presupuestos de rendimiento. Están
separadas a propósito: lo que puede tumbar el sitio de verdad ya lo cubre el trabajo rápido, y no
conviene que una corrección urgente de contenido espere a que se descargue Chromium.

## La base del sitio

Un sitio de proyecto se sirve en `https://<usuario>.github.io/<repo>/`, así que la base es el nombre
del repositorio. El flujo lo **deduce** de `github.event.repository.name` en vez de tenerlo escrito:
renombrar el repositorio no puede romper el despliegue en silencio.

Verificado sirviendo la compilación bajo `/<repo>/`: cero peticiones fallidas, cero errores de
JavaScript, tipografías cargadas, piezas montadas y la versión inglesa correcta.

Para un dominio propio o un sitio de usuario (`<usuario>.github.io`), la base es `/` y basta con
dejar `BASE_PATH` vacío.

## Qué no se publica

`galeria.html` y `prototipos.html` se compilan —los guiones de comprobación los necesitan— pero se
borran del artefacto antes de subirlo. La galería es el banco de pruebas y los prototipos son las
piezas de referencia de la fase de diseño; ninguna está enlazada desde el sitio. Si algún día
interesa publicarlas, se quita ese paso del flujo.

## Qué se versiona aunque sea salida de un guion

Dos cosas, y las dos porque su entrada **no está** en el repositorio y la compilación no puede
regenerarlas:

- `plantilla/silueta-pensador.html` — la produce `preparar-pensador.mjs` a partir del GLB descargado.
- `src/estilos/fuentes/*.woff2` — las produce `preparar-tipografias.mjs`, que necesita `fonttools`
  de Python.

En cambio `index.html` y `en/index.html` **no** se versionan: los genera `npm run generar` desde
`plantilla/index.html`, y tenerlos en el repositorio solo sirve para que alguien edite el generado y
vea desaparecer su cambio en la siguiente compilación.

## Antes de la primera subida

Las atribuciones obligatorias —CC BY del escaneo del Pensador y OFL de las dos tipografías— están en
`assets/CREDITOS.md` y en la página de créditos del sitio, enlazada desde el pie de todas las
páginas.

**El escaneo original sí está en el repositorio**: `assets/the_thinker_by_auguste_rodin.glb`, 4,5 MB.
Se versiona a propósito, porque sin él `preparar-pensador.mjs` no se puede volver a ejecutar y la
malla publicada quedaría sin forma de reproducirse ni de auditarse. La licencia CC BY permite
redistribuirlo y la atribución está puesta. No se despliega: lo que se sirve es la malla procesada
de `public/pensador.glb`, de 0,2 MB. Si en algún momento pesa demasiado para el repositorio, la
alternativa correcta es Git LFS, no borrarlo: borrarlo rompe la trazabilidad de un asset de terceros,
que es justo lo que la licencia obliga a mantener claro.
