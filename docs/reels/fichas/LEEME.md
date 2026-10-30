# Cómo se hace un reel a partir de su ficha

Vale para las 10 fichas. Cada ficha trae lo propio del reel: guion, piezas, sincronía, portada, fuentes y
criterios. Esto es lo común. Antes de empezar se leen `../DECISIONES.md` y `../KIT.md`.

Todos los comandos se lanzan desde `C:\Users\migue\videos-cortos`.

## Pasos

1. **Carpeta y kit.** `node reel/reels/rincon-kit/copiar.mjs rincon-<id> --corriente <corriente_id>`. Crea
   `reel/reels/rincon-<id>/` desde la plantilla y copia el kit en `kit/`.
2. **Fuentes antes que voz.** Se abre cada fuente de «Fuentes que hay que comprobar» y se escribe
   `guion-fuentes.md` con el formato de `reel/reels/memoria-fluida/guion-fuentes.md`: tabla con frase o
   rótulo, afirmación, fuente con URL, nota y fecha de consulta. Si una fuente no dice lo que la ficha espera,
   **no se graba**: se reescribe la frase con lo que sí dice, se anota en «Hecho» y se avisa al jefe si cambia
   el sentido.
3. **`guion.json`.** Se copia el guion de la ficha **tal cual**: `texto`, `escena`, `clave`, `error` y
   `pausa_antes_ms`. `clave` y `error` van como arrays (`"clave": ["casco"]`); la puntuación con la que los
   escribe la ficha no importa (`DECISIONES.md` §6). Encima van el bloque `voz` y `cta_cola_ms` de `DECISIONES.md` §3, más `titulo`,
   `idioma: "es"`, `portada`, `portada_resaltar` y `portada_t`. Las pausas van como en la hipnosis
   (`DECISIONES.md` §3): `"pausa_antes_ms": 320` en la primera frase de cada escena salvo el gancho, y en la de
   la llamada. Donde una ficha diga 200, vale 320.
4. **`escena.js`.** Se pasan a `montar()` las piezas del bloque «Escena» de la ficha. Las coordenadas son un
   punto de partida: se pueden mover hasta 80 px si el detector de solapes lo pide. Si hay que mover más o
   quitar una pieza, se anota en «Hecho».
5. **Voz y render** (gasta 1 petición de Gemini): `node reel/reel.mjs --reel rincon-<id>`. Cuántos renders
   pueden ir a la vez lo dice `DECISIONES.md` §12: uno, salvo que haya 2 GB libres.
6. **Ritmo.** `node reel/qa/medir-fluida.mjs rincon-<id>`. Se parte de `atempo` 1,12 (la voz de la hipnosis).
   Si sale de 3,2-3,4 pal/s, se ajusta de 0,02 en 0,02, entre 1,04 y 1,16, y se vuelve a lanzar el paso 5. Sale
   de la caché y no gasta. Fuera de ese margen, se para y se avisa al jefe (`DECISIONES.md` §3). Si el
   alineado falla con un `atempo`, se prueba ±0,01.
7. **Mirar.** Se abre la hoja `salida/rincon-<id>-fotogramas.png`. Para instantes sueltos:
   `node reel/reel.mjs --reel rincon-<id> --vista 1.8,8,15,22,30` (deja PNG en `trabajo/vista/`).
8. **Huecos y web.** `node reel/reels/rincon-kit/vacios.mjs rincon-<id>` (0 huecos) y
   `node reel/reels/rincon-kit/web.mjs rincon-<id>` (≤ 5 MB).
9. **`post.md` y `CREDITOS.md`** con el formato de `memoria-fluida`. El post lleva título, cuerpo, fuentes,
   hashtags (Instagram 8, TikTok 5, con `#filosofia` y la corriente), alt text que describe lo que se ve, y
   «Nota para quien publique» con los matices de la ficha. Los créditos llevan Inter y Newsreader (OFL), los
   iconos propios del sitio, la música propia de la tubería y la voz Gemini.
10. **QA**: la lista de `DECISIONES.md` §9 entera.
11. **Rellenar «Hecho»** al final de la ficha (en `elrincondelareflexion/docs/reels/fichas/`): medidas,
    `atempo`, peticiones gastadas, cambios de guion o de escena y su porqué, y avisos de whisper que eran
    falsos.

## Ficheros que crea cada reel

En `videos-cortos/reel/reels/rincon-<id>/`:
- `guion.json`, `guion-fuentes.md`, `post.md`, `CREDITOS.md`;
- `escena.html` (de la plantilla) y `escena.js`;
- `kit/` (de `copiar.mjs`);
- `trabajo/` y `salida/` (de la tubería y de `web.mjs`).

Fuera de esa carpeta, solo el apartado «Hecho» de la ficha propia.

## Qué no se toca

`reel/reel.mjs`, `reel/lib/**`, `reel/qa/**`, `reel/escena/**`, `reel/reels/rincon-kit/**`, los reels de
mentalista y todo el repositorio elrincondelareflexion salvo «Hecho» de la ficha propia. Si el kit no hace
algo que la ficha pide, se para y se pide el cambio a quien lleve el kit 3D (F2f, que es quien lo construye), con el
jefe en copia; no se dibuja a mano en `escena.js`.

## Si algo no encaja

- **Palabra de sincronía que no está** (`No encuentro «x» en la escena y`): la ficha y el guion tienen que
  coincidir. Se corrige el guion para que diga lo de la ficha, no la escena.
- **Duración fuera de 30-45 s con el ritmo en rango**: se avisa al jefe con la medida. No se recorta el guion
  por cuenta propia.
- **429 de cuota diaria de Gemini**: se para y se avisa (`DECISIONES.md` §1).
