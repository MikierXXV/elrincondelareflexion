# rincon-condicionamiento-operante · «Por qué miras el móvil» · F5a

Ficha del sitio: `content/es/ideas/condicionamiento-operante.json` · corriente `psicologia-siglo-xx` ·
acento `#A26CC6` · autor `skinner` (B. F. Skinner, 1904-1990). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea entienda por qué el premio que llega de vez en cuando y sin aviso engancha más que el que
llega siempre (refuerzo intermitente frente a continuo, con las palomas de Skinner). Y que reconozca su propio
gesto de mirar el móvil como un caso de eso, **sin** que el vídeo diga que las apps estén diseñadas así.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Casi nunca hay nada nuevo en tu móvil, y justo por eso no dejas de mirarlo. | clave `mirarlo.` | móvil, mirarlo |
| 2 | `giro` | ¿No debería ser al revés? Sin premio, dejarías de buscarlo. | — | revés, premio |
| 3 | `idea` | Pues no, y Skinner lo midió con palomas. | — | skinner, palomas |
| 4 | `idea` | Si la comida sale siempre y de pronto deja de salir, la paloma deja de picar bastante pronto. | — | comida, siempre, deja |
| 5 | `idea` | Pero si sale de vez en cuando, sin patrón, sigue picando mucho más tiempo. | clave `tiempo.` | vez, tiempo |
| 6 | `idea` | Como nunca sabe cuándo toca, ningún fallo le dice que se acabó. | — | nunca, fallo |
| 7 | `ejemplo` | Con tu móvil pasa igual: lo que te importa llega pocas veces y sin avisar. | — | móvil, pocas, avisar |
| 8 | `cierre` | No te falta voluntad: tu mano ha aprendido un programa de refuerzo. | error `voluntad:` · clave `refuerzo.` | voluntad, programa |
| 9 | `cta` | Envíaselo a quien lo va a mirar en cuanto le vibre el móvil. | clave `Envíaselo` | envíaselo |

- **Palabras:** 118. **Duración prevista:** 38,4-40,6 s. Sin pausas de demostración.
- **Portada:** `"portada": "¿Por qué miras | el móvil?"`, `"portada_resaltar": "móvil"`, `"portada_t": 1.6`
  (solo el móvil).

## Escena (3D, kit v2)

`halo: { gancho: 54, giro: 54, idea: 50, ejemplo: 54, cierre: 50, cta: 60 }`

```js
montar({ corriente: 'psicologia-siglo-xx', halo: { /* arriba */ },
  golpes: ['gancho:mirarlo', 'idea:tiempo', 'ejemplo:importa', 'cierre:programa'],
  piezas: [
  // 1-2 · gancho y giro: el móvil sin nada nuevo
  objeto({ id: 'objeto-movil', modelo: 'movil', estado: 'vacio', x: 540, y: 1000, tam: 320, desde: 'gancho', hasta: 'giro:fin',
           efectos: [{ en: 'gancho:mirarlo', hace: 'late' }] }),
  rotulo({ id: 'rotulo-sin-premio', texto: 'Sin premio', tono: 'neutro', marca: 'punto', x: 540, y: 1420,
           desde: 'giro:premio', hasta: 'giro:fin' }),
  // 3-6 · idea: las palomas
  autor({ id: 'autor-skinner', nombre: 'B. F. Skinner', anos: '1904-1990', modo: 'medallon', x: 540, y: 830,
          desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:palomas', hace: 'a-firma' }] }),
  contraste({ id: 'contraste-premio', disposicion: 'columnas', y: 900, desde: 'idea:siempre', hasta: 'idea:nunca',
              a: { titulo: 'Siempre', modelo: 'icono', icono: 'comedero', tono: 'neutro' },
              b: { titulo: 'De vez en cuando', modelo: 'icono', icono: 'paloma', tono: 'acento' }, entra_b: 'idea:vez',
              efectos: [{ en: 'idea:tiempo', hace: 'gana', lado: 'b' }] }),
  medidor({ id: 'medidor-extincion', tipo: 'curvas', x: 520, y: 1370, ancho: 720,
            series: [{ nombre: 'Siempre', cae_en: 0.25 }, { nombre: 'De vez en cuando', cae_en: 0.92 }],
            desde: 'idea:deja', traza_hasta: 'idea:tiempo', hasta: 'idea:fin' }),          // nota «esquema» por defecto
  rotulo({ id: 'rotulo-nunca-sabe', texto: 'Nunca sabe cuándo toca', tono: 'acento', marca: 'punto', x: 540, y: 900,
           desde: 'idea:nunca', hasta: 'idea:fin' }),
  // 7 · ejemplo: el móvil otra vez, con lo que importa
  objeto({ id: 'objeto-movil-2', modelo: 'movil', estado: 'vacio', x: 540, y: 960, tam: 300, desde: 'ejemplo', hasta: 'ejemplo:fin',
           cambia: [{ en: 'ejemplo:importa', estado: 'notificacion' }],
           efectos: [{ en: 'ejemplo:importa', hace: 'notifica' }] }),
  rotulo({ id: 'rotulo-pocas', texto: 'Pocas veces', tono: 'neutro', x: 290, y: 1420, desde: 'ejemplo:pocas', hasta: 'ejemplo:fin' }),
  rotulo({ id: 'rotulo-sin-avisar', texto: 'Sin avisar', tono: 'acento', x: 740, y: 1420, desde: 'ejemplo:avisar', hasta: 'ejemplo:fin' }),
  // 8 · cierre: no es voluntad, es un programa (el engranaje que gira solo)
  rotulo({ id: 'rotulo-voluntad', texto: 'Falta de voluntad', tono: 'error', x: 540, y: 760, desde: 'cierre', hasta: 'cierre:fin',
           efectos: [{ en: 'cierre:voluntad+0.2', hace: 'tacha' }] }),
  objeto({ id: 'objeto-engranaje', modelo: 'engranaje', tono: 'acento', x: 540, y: 1050, tam: 360,
           desde: 'cierre:programa', hasta: 'cierre:fin' }),
  rotulo({ id: 'rotulo-programa', texto: 'Un programa de refuerzo', tam: 'titular', tono: 'acento', x: 540, y: 1400,
           desde: 'cierre:programa', hasta: 'cierre:fin' }),
  // 9 · cta
  cierre({ titulo: 'Por qué miras el móvil' }),
] });
```

- Arriba van `contraste-premio` (las dos condiciones) y abajo `medidor-extincion` (sus curvas). En la frase 6,
  `rotulo-nunca-sabe` releva al contraste en el mismo sitio. Aquí `gana` sí se usa: es un resultado, no una
  disputa.
- La paloma y el comedero son el modelo reserva `icono` (KIT §5.15); no tienen modelo propio.
- El engranaje es «el programa», no una máquina de la app. Ni la voz ni el post dicen que las apps estén
  diseñadas así.
- **Portada** (1,6 s): solo el móvil, con su caja desde y ≈ 740.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 3-5 | Skinner trabajó con palomas y programas de refuerzo, y tras un programa intermitente la extinción es mucho más lenta que tras el refuerzo continuo (efecto del refuerzo parcial) | C. B. Ferster y B. F. Skinner, *Schedules of Reinforcement* (1957). Una referencia de manual del efecto del refuerzo parcial en la extinción: «partial reinforcement effect» en el APA Dictionary of Psychology, o Jenkins y Stanley, «Partial reinforcement: a review and critique», *Psychological Bulletin* 47 (1950) |
| 3 «lo midió» | No decir que Skinner lo **descubrió**: el efecto ya se había descrito antes (Humphreys, 1939). La frase solo dice que lo midió | ídem |
| `medidor-extincion` | Es un esquema, no datos: lleva la nota «esquema» | — |
| 7-8 | El móvil es una **analogía** de la ficha, no un experimento con móviles. Que el post lo diga | ficha: `ejemplo_real` |

**Cita que no se usa:** la de la ficha («La cuestión no es si las máquinas piensan…») es real, pero no trata
del refuerzo.

**Rigor.** La ficha dice «el programa de refuerzo más resistente que existe». El guion lo baja a «mucho más
tiempo» que el refuerzo continuo. Nada de «las apps están diseñadas como tragaperras».

## Criterios de aceptación (además de `DECISIONES.md` §9)

- No sale en voz ni en pantalla «el más resistente», «adicción» ni «diseñado para».
- `medidor-extincion` muestra «esquema».
- El post aclara que el móvil es una analogía de un resultado con palomas.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-condicionamiento-operante --corriente psicologia-siglo-xx
node reel/reel.mjs --reel rincon-condicionamiento-operante
node reel/qa/medir-fluida.mjs rincon-condicionamiento-operante
node reel/reel.mjs --reel rincon-condicionamiento-operante --vista 1.6,6,12,17,22,27,32
node reel/reels/rincon-kit/vacios.mjs rincon-condicionamiento-operante
node reel/reels/rincon-kit/web.mjs rincon-condicionamiento-operante
```

## Hecho

_(lo rellena quien haga el reel)_
