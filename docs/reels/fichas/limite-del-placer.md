# rincon-limite-del-placer · «¿Cuánto es suficiente?» · F5a

Ficha del sitio: `content/es/ideas/limite-del-placer.json` · corriente `helenismo` · acento `#2E9271` · autor
`epicuro` (341-270 a. C.). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea distinga, con Epicuro, entre los deseos que tienen techo y se llenan (beber con sed) y los
que no lo tienen porque siempre hay alguien con más (dinero, fama). Y que deshaga el malentendido: el epicúreo
no es el que se da atracones, sino el que sabe dónde está su límite.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | Sabes cuándo parar de beber agua. ¿Sabes cuándo parar de querer dinero? | clave `dinero?` | agua, dinero |
| 2 | `ejemplo` | Con sed, el primer vaso es una delicia, y el cuarto ya no te apetece. | — | primer, cuarto |
| 3 | `ejemplo` | Ahí nadie duda de cuándo parar. | — | parar |
| 4 | `ejemplo` | Pero ¿cuánto dinero sería suficiente? ¿Cuántos seguidores? Casi nadie sabe decir la cifra. | clave `suficiente?` | pero, suficiente, seguidores, cifra |
| 5 | `idea` | Epicuro distinguió entre deseos naturales y deseos vanos. | — | epicuro, naturales, vanos |
| 6 | `idea` | Los naturales, como comer o beber, tienen un límite y se llenan. | — | límite, llenan |
| 7 | `idea` | Los vanos, como la fama o la riqueza sin tope, no tienen techo: siempre hay alguien con más. | clave `techo:` | fama, techo, más |
| 8 | `idea-2` | Por eso el epicúreo no se da atracones: sabe dónde está su límite. | error `atracones:` | atracones, sabe |
| 9 | `cierre` | Un deseo sin límite no se puede completar: solo se puede alimentar. | clave `alimentar.` | completar, alimentar |
| 10 | `cta` | Envíaselo a quien dice que con un poco más ya estaría. | clave `Envíaselo` | envíaselo |

- **Palabras:** 120. **Duración prevista:** 39,0-41,2 s. Sin pausas de demostración.
- **Portada:** `"portada": "¿Cuánto es | suficiente?"`, `"portada_resaltar": "suficiente"`,
  `"portada_t": 1.2` (solo el vaso).

## Escena (3D, kit v2)

`halo: { gancho: 54, ejemplo: 52, idea: 50, 'idea-2': 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'helenismo', halo: { /* arriba */ },
  golpes: ['gancho:dinero', 'ejemplo:suficiente', 'idea:techo', 'idea-2:sabe', 'cierre:alimentar'],
  piezas: [
  // 1 · gancho: agua frente a dinero
  objeto({ id: 'objeto-vaso', modelo: 'vaso', nivel: 0.8, x: 540, y: 1000, tam: 340, desde: 'gancho', hasta: 'gancho:dinero' }),
  contraste({ id: 'contraste-gancho', disposicion: 'columnas', y: 960, desde: 'gancho:dinero', hasta: 'gancho:fin',
              a: { titulo: 'Agua', modelo: 'vaso', tono: 'neutro' }, b: { titulo: 'Dinero', modelo: 'monedas', tono: 'acento' } }),
  // 2-3 · los cuatro vasos: el primero se bebe, el cuarto ya no apetece
  objeto({ id: 'objeto-vasos', modelo: 'vaso', nivel: 0.8, x: 500, y: 880, tam: 160, copias: { n: 4, separacion: 190 },
           desde: 'ejemplo', hasta: 'ejemplo:pero',
           efectos: [{ en: 'ejemplo:primer', hace: 'bebe', copia: 0 }, { en: 'ejemplo:cuarto', hace: 'apaga', copia: 3 }] }),
  medidor({ id: 'medidor-placer', tipo: 'barras', x: 540, y: 1330, ancho: 640, desde: 'ejemplo', hasta: 'ejemplo:pero',
            series: [{ nombre: '1.º', valores: [{ en: 'ejemplo:primer', v: 0.95 }] },
                     { nombre: '2.º', valores: [{ en: 'ejemplo:primer+0.4', v: 0.6 }] },
                     { nombre: '3.º', valores: [{ en: 'ejemplo:primer+0.8', v: 0.3 }] },
                     { nombre: '4.º', valores: [{ en: 'ejemplo:cuarto', v: 0.05 }] }] }),
  // 4 · la meta que se aleja: la pila crece y «suficiente» se va
  objeto({ id: 'objeto-monedas', modelo: 'moneda', pila: 3, x: 540, y: 900, tam: 300, desde: 'ejemplo:pero', hasta: 'ejemplo:fin',
           efectos: [{ en: 'ejemplo:seguidores', hace: 'crece', n: 7 }, { en: 'ejemplo:cifra', hace: 'crece', n: 11 }] }),
  medidor({ id: 'medidor-suficiente', tipo: 'nivel', x: 520, y: 1340, ancho: 720, desde: 'ejemplo:pero', hasta: 'ejemplo:fin',
            valor: [{ en: 'ejemplo:pero', v: 0.3 }, { en: 'ejemplo:cifra', v: 0.8 }],
            meta:  [{ en: 'ejemplo:pero', v: 0.5 }, { en: 'ejemplo:cifra', v: 1.0 }], nombre_meta: 'Suficiente' }),
  // 5-7 · idea
  autor({ id: 'autor-epicuro', nombre: 'Epicuro', anos: '341-270 a. C.', modo: 'medallon', x: 540, y: 820,
          desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:distinguió', hace: 'a-firma' }] }),
  contraste({ id: 'contraste-deseos', disposicion: 'columnas', y: 1000, desde: 'idea:naturales+0.4', hasta: 'idea:fama',
              a: { titulo: 'Naturales', texto: 'Comer, beber: tienen límite', modelo: 'vaso', tono: 'acento' },
              b: { titulo: 'Vanos', texto: 'Fama, riqueza sin tope', modelo: 'monedas', tono: 'neutro' }, entra_b: 'idea:vanos' }),
  cita({ id: 'cita-epicuro', tipo: 'parafrasis', x: 540, y: 1000,
         texto: 'La riqueza que pide la naturaleza tiene límite y es fácil de conseguir; la de las opiniones vanas se pierde en el infinito.',
         obra: 'Epicuro, Máximas capitales, XV', desde: 'idea:fama', hasta: 'idea:fin' }),
  // 8 · idea-2: el malentendido
  rotulo({ id: 'rotulo-atracones', texto: 'Atracones', tono: 'error', x: 540, y: 860, desde: 'idea-2', hasta: 'idea-2:fin',
           efectos: [{ en: 'idea-2:atracones+0.2', hace: 'tacha' }] }),
  rotulo({ id: 'rotulo-su-limite', texto: 'Saber dónde está tu límite', tam: 'titular', tono: 'acento', x: 540, y: 1150,
           desde: 'idea-2:sabe', hasta: 'idea-2:fin' }),
  // 9 · cierre: sin límite no se completa
  medidor({ id: 'medidor-cierre', tipo: 'nivel', x: 520, y: 1000, ancho: 720, desde: 'cierre', hasta: 'cierre:fin',
            valor: [{ en: 'cierre', v: 0.4 }, { en: 'cierre:alimentar', v: 0.85 }],
            meta:  [{ en: 'cierre', v: 0.6 }, { en: 'cierre:alimentar', v: 1.0 }], nombre_meta: 'Completo' }),
  // 10 · cta
  cierre({ titulo: '¿Cuánto es suficiente?' }),
] });
```

- **Vigilar el `a-firma` (F3).** De «distinguió» a «naturales» hay dos palabras. En 3D el medallón es más
  grande que en el 2D, así que `contraste-deseos` ya entra con la salida que F3 tenía prevista,
  `idea:naturales+0.4`. Así va al menos 0,7 s detrás del `a-firma` (KIT §6.2). Si en la hoja todavía se
  cruzan, se retrasa a `idea:vanos`; no se toca el guion.
- `nombre_meta` es el rótulo de la bandera del `medidor` tipo `nivel` (KIT §6.7). Los tres medidores muestran
  «esquema».
- La pila de monedas es dinero genérico: sin símbolo de moneda ni cifra.
- **Portada** (1,2 s): solo el vaso, con su caja desde y ≈ 790.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 5-6 | *Carta a Meneceo* 127: de los deseos, unos son naturales y otros vanos; de los naturales, unos necesarios y otros no. El guion usa solo la primera división, que es literal | Diógenes Laercio X, 127 (texto griego e inglés en Perseus o en Wikisource); en español, la traducción de C. García Gual u otra publicada |
| 7 y `cita-epicuro` | *Máximas capitales* XV («la riqueza conforme a la naturaleza está limitada y es fácil de procurar; la de las vanas opiniones cae al infinito») y XXIX-XXX | Diógenes Laercio X, 144 y 149 |
| 7 «siempre hay alguien con más» | Es el porqué que da la **ficha**, no una frase de Epicuro. Se anota así | ficha: `desarrollo` |
| 8 | El epicureísmo no propone el exceso (ficha); *Carta a Meneceo* 131-132 («no son los banquetes…») | Diógenes Laercio X, 131-132 |
| 2-4 | Ejemplos de la ficha sin cifras | ficha: `ejemplo_real` |

**Cita que no se usa:** la de la ficha («Mientras existimos, la muerte no está…») es correcta, pero trata de la
muerte.

**Rigor.** Nada de «adaptación hedónica» ni de estudios de felicidad e ingresos, que no están en la ficha.
El matiz del placer «catastemático» no cabe y no hace falta.

## Criterios de aceptación (además de `DECISIONES.md` §9)

- Los tres medidores llevan «esquema».
- La cita dice «paráfrasis», salvo que se haya leído una traducción concreta.
- Ni la voz ni el post dicen «el dinero no da la felicidad».

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-limite-del-placer --corriente helenismo
node reel/reel.mjs --reel rincon-limite-del-placer
node reel/qa/medir-fluida.mjs rincon-limite-del-placer
node reel/reel.mjs --reel rincon-limite-del-placer --vista 1.2,4,8,12,17,22,28,33
node reel/reels/rincon-kit/vacios.mjs rincon-limite-del-placer
node reel/reels/rincon-kit/web.mjs rincon-limite-del-placer
```

## Hecho

_(lo rellena quien haga el reel)_
