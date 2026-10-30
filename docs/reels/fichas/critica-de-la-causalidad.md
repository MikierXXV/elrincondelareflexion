# rincon-critica-de-la-causalidad · «¿Por qué quema el fuego?» · F5b

Ficha del sitio: `content/es/ideas/critica-de-la-causalidad.json` · corriente `filosofia-islamica` · acento
`#2A918D` · autores `al-ghazali` (1058-1111) y `averroes` (1126-1198). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea entienda la observación de al-Ghazali: vemos una cosa y luego otra, nunca el vínculo
necesario. Que sepa que lo escribió siglos antes de Hume, **pero con otra conclusión** (teológica), y que
Averroes le respondió. Y que se lo aplique: mucho de lo que das por seguro es un historial, no un mecanismo.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Has visto el fuego quemar mil veces, y nunca has visto por qué quema. | clave `quema.` | fuego, nunca |
| 2 | `gancho` | Ves la llama tocar el algodón y, después, el algodón ardiendo. | — | llama, ardiendo |
| 3 | `giro` | Una cosa y luego otra, pero el «tiene que» no se ve. | — | cosa, luego, tiene |
| 4 | `idea` | Lo escribió al-Ghazali hacia el año mil cien, más de seis siglos antes de que Hume dijera algo parecido. | — | escribió, siglos, hume |
| 5 | `idea` | Pero él concluía otra cosa: si ese orden no es necesario, depende de la voluntad de Dios. | — | concluía, voluntad |
| 6 | `idea` | Averroes le contestó: si las cosas no actúan por su naturaleza, no hay ciencia posible. | clave `ciencia` | averroes, naturaleza, ciencia |
| 7 | `ejemplo` | Como el ascensor que siempre ha funcionado: tienes un historial, no un mecanismo. | — | ascensor, historial, mecanismo |
| 8 | `cierre` | Y casi todo lo que das por seguro es eso: un historial. | clave `historial.` | seguro, historial |
| 9 | `cta` | Envíaselo a quien dice «esto siempre ha funcionado». | clave `Envíaselo` | envíaselo |

- **Palabras:** 122 (contando «al-Ghazali» como dos). **Duración prevista:** 39,6-41,8 s. Sin pausas de
  demostración.
- **Pronunciación:** se escucha cómo dice Orus «al-Ghazali» y «Averroes». Si se tuerce, se usa `voz` en las
  frases 4 y 6 (p. ej. «al Gazali»). El `texto` y el subtítulo siguen como el sitio.
- **Portada:** `"portada": "¿Por qué quema | el fuego?"`, `"portada_resaltar": "quema"`, `"portada_t": 1.2`
  (solo la llama y el algodón).

## Escena (3D, kit v2)

`halo: { gancho: 58, giro: 56, idea: 50, ejemplo: 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'filosofia-islamica', halo: { /* arriba */ },
  golpes: ['gancho:quema', 'giro:tiene', 'idea:ciencia', 'ejemplo:mecanismo', 'cierre:historial'],
  piezas: [
  // 1-2 · gancho: la llama toca el algodón y el algodón arde
  objeto({ id: 'objeto-llama', modelo: 'llama', estado: 'llama', x: 540, y: 960, tam: 500, desde: 'gancho', hasta: 'gancho:fin',
           cambia: [{ en: 'gancho:tocar', estado: 'toca' }, { en: 'gancho:ardiendo', estado: 'arde' }] }),
  rotulo({ id: 'rotulo-llama', texto: 'Llama', tono: 'neutro', x: 290, y: 1390, desde: 'gancho:llama', hasta: 'gancho:fin' }),
  rotulo({ id: 'rotulo-arde', texto: 'Arde', tono: 'acento', x: 740, y: 1390, desde: 'gancho:ardiendo', hasta: 'gancho:fin' }),
  // 3 · giro: una cosa y luego otra, separadas; el «tiene que» no se ve
  contraste({ id: 'contraste-hueco', disposicion: 'columnas', y: 950, desde: 'giro', hasta: 'giro:fin',
              a: { titulo: 'Una cosa', modelo: 'llama', estado: 'toca', tono: 'neutro' },
              b: { titulo: 'Luego otra', modelo: 'llama', estado: 'arde', tono: 'neutro' }, entra_b: 'giro:luego',
              efectos: [{ en: 'giro:tiene', hace: 'separa' }] }),
  rotulo({ id: 'rotulo-hueco', texto: '?', tam: 'cifra', tono: 'acento', x: 540, y: 1390, desde: 'giro:tiene', hasta: 'giro:fin' }),
  // 4-6 · idea
  autor({ id: 'autor-ghazali', nombre: 'al-Ghazali', anos: '1058-1111', obra: 'La incoherencia de los filósofos', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:averroes', efectos: [{ en: 'idea:hume', hace: 'a-firma' }] }),
  linea({ id: 'linea-causalidad', x: 540, y: 1340, ancho: 600, escala: 'proporcional', distancia: true, desde: 'idea', hasta: 'idea:concluía',
          hitos: [{ ano: 1095, etiqueta: 'al-Ghazali', ancla: 'idea:escribió' }, { ano: 1739, etiqueta: 'Hume', ancla: 'idea:hume' }] }),
  cita({ id: 'cita-ghazali', tipo: 'parafrasis', x: 540, y: 1050,
         texto: 'La conexión entre lo que se suele tener por causa y lo que se tiene por efecto no es necesaria.',
         obra: 'al-Ghazali, La incoherencia de los filósofos, disputa 17', desde: 'idea:concluía', hasta: 'idea:averroes' }),
  autor({ id: 'autor-averroes', nombre: 'Averroes', anos: '1126-1198', modo: 'firma', x: 540, y: 580,
          desde: 'idea:averroes', hasta: 'idea:fin' }),
  contraste({ id: 'contraste-causa', disposicion: 'columnas', y: 1050, desde: 'idea:averroes', hasta: 'idea:fin',
              a: { titulo: 'al-Ghazali', texto: 'El orden depende de Dios', tono: 'neutro' },
              b: { titulo: 'Averroes', texto: 'Sin naturalezas no hay ciencia', tono: 'neutro' }, entra_b: 'idea:naturaleza',
              efectos: [{ en: 'idea:ciencia', hace: 'separa' }] }),
  // 7 · ejemplo: el ascensor tiene historial; el mecanismo no lo ves
  contraste({ id: 'contraste-ascensor', disposicion: 'columnas', y: 960, desde: 'ejemplo', hasta: 'ejemplo:fin',
              a: { titulo: 'Historial', modelo: 'icono', icono: 'ascensor', tono: 'acento' },
              b: { titulo: 'Mecanismo', modelo: 'engranaje', estado: 'fantasma', tono: 'neutro' }, entra_b: 'ejemplo:mecanismo',
              efectos: [{ en: 'ejemplo:mecanismo+0.3', hace: 'tacha', lado: 'b' }] }),
  // 8 · cierre
  rotulo({ id: 'rotulo-seguro', texto: 'Lo que das por seguro', tono: 'neutro', x: 540, y: 860, desde: 'cierre', hasta: 'cierre:fin' }),
  rotulo({ id: 'rotulo-un-historial', texto: 'Un historial', tam: 'titular', tono: 'acento', x: 540, y: 1100,
           desde: 'cierre:historial', hasta: 'cierre:fin' }),
  // 9 · cta
  cierre({ titulo: '¿Por qué quema el fuego?' }),
] });
```

- Dos autores: al-Ghazali pasa a firma en «Hume» y Averroes lo **releva** en la firma en «Averroes».
- `linea-causalidad` con `distancia: true` muestra «644 años». La voz dice «más de seis siglos», que es
  coherente con eso.
- `contraste-causa` no usa `gana`. La ficha llama a la de Averroes «la mejor réplica», pero sigue siendo una
  disputa. `contraste-hueco` tampoco, porque no compara posturas.
- `contraste-ascensor` sí tacha el mecanismo, porque no es una disputa: es lo que dice la frase («un
  historial, no un mecanismo»). El engranaje en `fantasma` es lo que no ves. Los rótulos «Historial» y
  «Mecanismo» del 2D pasan a ser los títulos de las tarjetas.
- La llama es luz cálida (`MAT.luz`) y no lleva el acento ni el coral.
- **Portada** (1,2 s): solo la llama (todavía sin el algodón), con su caja desde y ≈ 780.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-3 y `cita-ghazali` | Disputa 17 de *Tahāfut al-falāsifa* (h. 1095): el ejemplo del fuego y el algodón; solo se observa contigüidad y sucesión. La apertura dice «lo que habitualmente se cree causa…». Va como paráfrasis salvo que se lea una traducción española concreta | M. E. Marmura (trad.), *The Incoherence of the Philosophers*, Brigham Young University Press (2.ª ed., 2000), disputa 17; SEP, «al-Ghazali» (https://plato.stanford.edu/entries/al-ghazali/) |
| 4 y `linea-causalidad` | *Tahāfut* h. 1095 («hacia el año mil cien» es un redondeo). Hume, *Treatise* libro I, 1739. 1739 − 1095 = 644 | SEP «al-Ghazali»; SEP «David Hume» |
| 4 «algo parecido» | El paralelo es de **contenido**, no de influencia: no decir que Hume lo leyera | ficha: `matiz_experto` |
| 5 | Su conclusión: la regularidad depende de la voluntad divina (y el milagro deja de ser contradicción) | ficha: `desarrollo`; SEP |
| 6 | Respuesta de Averroes en *Tahāfut al-tahāfut* (disputa 17): negar las naturalezas y las causas es negar el conocimiento | S. van den Bergh (trad.), *The Incoherence of the Incoherence* (1954); SEP, «Ibn Rushd» (https://plato.stanford.edu/entries/ibn-rushd/) |
| 7-8 | El ascensor, el historial y el mecanismo son ejemplos de la **ficha** | ficha: `ejemplo_real` |

**Cita.** La de la ficha («La conexión entre lo que llamamos causa y efecto no es necesaria») se usa como
paráfrasis, ajustada a la apertura real de la disputa.

**Rigor.** Nada de «al-Ghazali era escéptico como Hume» ni de «acabó con la filosofía islámica».

## Criterios de aceptación (además de `DECISIONES.md` §9)

- La frase 5 deja claro que la conclusión de al-Ghazali es teológica y distinta de la de Hume.
- La voz no afirma ninguna influencia de al-Ghazali en Hume.
- La cita lleva «paráfrasis», salvo que se haya leído una traducción concreta.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-critica-de-la-causalidad --corriente filosofia-islamica
node reel/reel.mjs --reel rincon-critica-de-la-causalidad
node reel/qa/medir-fluida.mjs rincon-critica-de-la-causalidad
node reel/reel.mjs --reel rincon-critica-de-la-causalidad --vista 1.2,5,9,13,18,23,29,34
node reel/reels/rincon-kit/vacios.mjs rincon-critica-de-la-causalidad
node reel/reels/rincon-kit/web.mjs rincon-critica-de-la-causalidad
```

## Hecho

F5b, 2026-10-30. atempo 1,04 (a 1,03 el pico salía −0,7) · 3,28 pal/s · 40,08 s · 6,22 MB (web 2,26 MB) · pico −1,5 · 1 petición. Escena: se quitó el efecto `separa` de `contraste-causa` (7 px a la zona de interfaz derecha durante 0,1 s). Cita de al-Ghazali como paráfrasis; la réplica de Averroes se respalda en *Tahāfut al-tahāfut* XVII (según el jefe) y en Marmura. Todo en verde.
