# Hoja de escucha: piloto `rincon-principio-del-dano` («La cabeza es tuya»)

Generado el 2026-10-29 (F4, t-f59075); **vuelto a renderizar el 2026-10-30 (F4b, t-a8a8de)** con el alineado y la portada corregidos en `lib`, desde la caché (0 peticiones a Gemini, mismo atempo 1,15). **PARADA: lo ve y lo escucha el humano.**

## Ficheros

| | Ruta |
|---|---|
| Vídeo para redes (1080×1920, 39,6 s, 6,56 MB, −14 LUFS, pico −1,2 dBTP) | `C:\Users\migue\videos-cortos\reel\reels\rincon-principio-del-dano\salida\rincon-principio-del-dano.mp4` |
| Versión web (720×1280, 2,30 MB) | `…\salida\rincon-principio-del-dano-web.mp4` (póster `-web.webp`, `-web-mini.webp`) |
| Portada | `…\salida\rincon-principio-del-dano-portada.png` |
| Hoja de fotogramas (cada 1 s, zonas de interfaz en rojo) | `…\salida\rincon-principio-del-dano-fotogramas.png` |
| Comprobaciones | `…\salida\rincon-principio-del-dano-comprobaciones.json` |
| Fuentes, post y créditos | `…\guion-fuentes.md`, `post.md`, `CREDITOS.md` |

Voz: Gemini `gemini-3.8-flash-tts`, Orus, una toma, **atempo 1,15** (ritmo 3,38 pal/s). Gastó 1 petición.

## Frases (segundo de inicio en el plan, que va hasta ~0,2 s por delante de la voz)

| # | Inicio | Escena | Frase | Qué mirar |
|---|---|---|---|---|
| 1 | 0,06 | gancho | La cabeza es tuya. Entonces, ¿por qué te obligan a llevar casco? | Casco verde sobre peana que late en «casco». «casco» en cian |
| 2 | 3,59 | idea | En el siglo diecinueve, Mill propuso una regla sencilla. | Medallón de Mill que gira en «propuso» y línea 1859 → hoy |
| 3 | 6,52 | idea | Sobre tu cuerpo y tu mente, mandas tú. | Cita en pantalla con «cuerpo» y «mente» resaltadas. **Aquí está el desfase conocido de «mandas tú»** (ver abajo) |
| 4 | 8,26 | idea-2 | Pueden aconsejarte, razonar contigo o suplicarte, pero no obligarte, si no dañas a otros. | Seis figuras con «SOLO TÚ»; tres rótulos con ✓ y «Obligar» en coral y tachado |
| 5 | 13,60 | ejemplo | Su ejemplo: un puente peligroso. Pueden pararte para avisarte, pero si lo sabes y aun así quieres cruzar, es cosa tuya. | El puente cruje pero no se rompe; burbuja «Ese puente no aguanta.»; rótulo «Es cosa tuya» |
| 6 | 20,43 | giro | ¿Y el casco? Mill nunca habló de cascos, y ahí empieza la discusión. | Casco blanco y rótulo «Mill no habló de cascos» |
| 7 | 23,58 | giro | Unos dicen: es mi cabeza. Otros: tu accidente lo pagamos todos, así que no es solo tuyo. | Dos tarjetas neutras del mismo peso, ninguna gana ni se tacha |
| 8 | 28,58 | cierre | La pelea no es por el casco: es por dónde empieza el daño a otros. | Figuras que se ensanchan y ondas en «daño»; título «¿Dónde empieza el daño a otros?» |
| 9 | 32,43 | cta | Envíaselo al que dice «es mi vida» y al que dice «lo pagamos todos». | Móvil que envía el mensaje y «Sígueme para más filosofía» (cola de ~4 s hasta 39,6) |

## Qué escuchar

- Que Orus no ponga a Mill de ningún bando en las frases 6 y 7: tono igual en «es mi cabeza» y «lo pagamos todos».
- Nombres: «Mill» (debería sonar «mil» a la inglesa o a la española, sin más), «diecinueve».
- Que «¿por qué» (frase 1) no suene a «porque», y que «mandas tú» no quede cortado.
- Ritmo: 3,38 pal/s, cerca del tope; ¿se oye apresurado frente a la hipnosis (3,31)? Si sí, el reparo es de ritmo y no de sincronía.

## Qué mirar

- La **portada** (`…-portada.png`): casco limpio, título arriba. «casco» sale ahora en el **verde del utilitarismo** (#708D2C), con `portada_color` en guion.json (sin él, lavanda).
- Que el medallón de Mill gire sin pisar la cita, la tacha de «Obligar», el crujido del puente, y que en el giro las dos tarjetas entren y se separen sin favorecer a ninguna.
- Subtítulo: una sola línea siempre, palabra doblada al decirse, `clave` en cian.
- Fotogramas a 33 %: rótulos legibles; en la hoja no hay texto cortado ni sobre las zonas rojas.

## Sincronía: defectos de F4 corregidos en F4b

Los dos defectos de F4 («mandas tú» +0,22 s tarde; «¿Y» 0,28 s antes) estaban en `reel/lib/alinear.mjs` y están resueltos:

- El reescalado de una frase «desplazada» usa solo la parte con voz de su ventana (sin el silencio inicial y final), y cada pausa interna recoloca la palabra que la sigue. La frase empieza donde empieza la voz.
- Medido contra anclas de energía (inicio de voz y fin de cada pausa, independientes de whisper): «mandas» (frase 3) **+231 → 0 ms**; «¿Y» (frase 6) **−270 → 0 ms** (la voz arranca a los 20,70 s); frase 4 («Pueden») −210 → dentro.
- El piloto activa `voz.ancla_pausas: true` para corregir «así» (frase 7), 0,3 s tarde tras una coma. La opción está apagada por defecto, así que los reels de mentalista no cambian.
- Resultado: **32 anclas, 0 fuera de −170/+150 ms** (antes, 6 de 33). Comprobaciones del §9 en verde.
- Atempo 1,15 sin tocar. La prueba desde caché (`node reel/prueba-atempo.mjs rincon-principio-del-dano`) propone 1,12 (3,28 pal/s, solo la frase 3 reescalada), por si prefiere la voz algo más lenta. Con 1,15 reescalan las frases 3 y 6.
- El alineado de las anclas es una medida mía, no un juicio de oído: si al escuchar sigue habiendo algún desfase, es lo que hay que decir.

## Texto del post

Está en `post.md` (título, cuerpo, fuentes, hashtags, alt text, nota). Resumen del cuerpo:

> En 1859, John Stuart Mill propuso una regla sencilla: a una persona adulta solo se la puede obligar, contra su voluntad, para evitar daño a otros. Su propio bien, físico o moral, no basta. […] ¿Y el casco? Mill nunca habló de cascos, y ahí empieza la discusión: «es mi cabeza» frente a «tu accidente lo pagamos todos». Lo que sí hizo fue contestar a ese tipo de argumento (cap. IV, *constructive injury*): ese perjuicio «constructivo» es un coste que la sociedad puede soportar por el bien mayor de la libertad, pero distinguió el daño o riesgo definido, que sí justifica intervenir. Aplicarlo al casco sigue siendo discutible.
