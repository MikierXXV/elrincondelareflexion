# rincon-mala-fe · «Yo es que soy así» · F5b

Ficha del sitio: `content/es/ideas/mala-fe.json` · corriente `existencialismo` · acento `#BE5AC5` · autor
`sartre` (Jean-Paul Sartre, 1905-1980). Procedimiento común: `LEEME.md`.

## Objetivo

Que quien lo vea entienda la mala fe de Sartre: tratarse como una cosa con propiedades fijas («soy así») para
no cargar con una elección. Y que se lleve la pista para reconocerla: **si cambia según quién tiene delante,
no era un rasgo**. Sin decir que todo «soy así» es mala fe: solo que **puede** serlo.

## Guion

| # | escena | texto | clave / error | sincronía |
|---|---|---|---|---|
| 1 | `gancho` | «Yo es que soy así.» Sartre tenía un nombre para esto. | — | así, sartre |
| 2 | `idea` | Mala fe: no es mentirle a otro, es mentirte a ti mismo. | clave `mismo.` | fe, otro, mismo |
| 3 | `idea` | Un cortapapeles existe porque alguien pensó antes para qué serviría. | — | cortapapeles, serviría |
| 4 | `idea` | Contigo es al revés: primero estás, y lo que eres lo vas haciendo al elegir. | — | revés, estás, elegir |
| 5 | `idea` | Y como no puedes dejar de elegir, es tentador tratarte como una cosa con propiedades fijas. | clave `fijas.` | cosa, fijas |
| 6 | `ejemplo` | Piensa en quien dice «soy muy directo, no lo puedo evitar». | — | directo, evitar |
| 7 | `ejemplo` | Y delante de su jefe lo evita sin ningún problema. | — | jefe, problema |
| 8 | `ejemplo` | Si cambia según quién tiene delante, no era un rasgo: era una elección. | error `rasgo:` · clave `elección.` | rasgo, elección |
| 9 | `cierre` | Así que «soy así» puede querer decir «elijo esto y no quiero que cuente». | clave `puede` | puede, elijo |
| 10 | `cta` | Envíaselo al amigo que es muy directo, pero solo con algunos. | clave `Envíaselo` | envíaselo |

- **Palabras:** 123 (F3 cambió la frase 5: «te tratas» generalizaba a todo el mundo; «es tentador tratarte»
  deja la mala fe como tentación, como pide el objetivo). **Duración prevista:** 39,9-42,1 s. Sin pausas de demostración.
- **Portada:** `"portada": "Yo es que | soy así"`, `"portada_resaltar": "así"`, `"portada_t": 1.0` (solo la
  burbuja, en y = 1000).

## Escena (3D, kit v2)

`halo: { gancho: 56, idea: 50, ejemplo: 52, cierre: 52, cta: 60 }`

```js
montar({ corriente: 'existencialismo', halo: { /* arriba */ },
  golpes: ['gancho:sartre', 'idea:fijas', 'ejemplo:elección', 'cierre:puede'],
  piezas: [
  // 1 · gancho: alguien dice «soy así»
  burbuja({ id: 'burbuja-soy-asi', texto: 'Yo es que soy así.', lado: 'izq', tono: 'neutro', x: 540, y: 860,
            desde: 'gancho', hasta: 'gancho:fin' }),
  figuras({ id: 'figuras-gancho', disposicion: 'sola', n: 1, destacada: 0, x: 540, y: 1200, tam: 300,
            desde: 'gancho', hasta: 'gancho:fin' }),
  // 2 · idea: el nombre
  autor({ id: 'autor-sartre', nombre: 'Jean-Paul Sartre', anos: '1905-1980', obra: 'El ser y la nada, 1943', modo: 'medallon',
          x: 540, y: 820, desde: 'idea', hasta: 'idea:fin', efectos: [{ en: 'idea:otro', hace: 'a-firma' }] }),   // ≥ 0,7 s antes del cortapapeles
  rotulo({ id: 'rotulo-mala-fe', texto: 'Mala fe', tam: 'titular', tono: 'acento', x: 540, y: 1260, desde: 'idea:fe', hasta: 'idea:cortapapeles' }),
  rotulo({ id: 'rotulo-a-ti-mismo', texto: 'Mentirte a ti mismo', tono: 'neutro', marca: 'punto', x: 540, y: 1390,
           desde: 'idea:mismo', hasta: 'idea:cortapapeles' }),
  // 3 · el objeto fabricado: primero el plano (para qué sirve), luego la cosa
  objeto({ id: 'objeto-cortapapeles', modelo: 'herramienta', tipo: 'cortapapeles', estado: 'plano', x: 540, y: 980, tam: 460,
           etiqueta: 'Primero, para qué sirve', cambia: [{ en: 'idea:serviría', estado: 'solido' }],
           desde: 'idea:cortapapeles', hasta: 'idea:revés' }),
  // 4-5 · tú, al revés: primero estás, te haces al elegir… y es tentador volverte piedra
  figuras({ id: 'figuras-tu', disposicion: 'sola', n: 1, destacada: 0, x: 540, y: 960, tam: 320, desde: 'idea:revés', hasta: 'idea:fin',
            acciones: [{ en: 'idea:elegir', hace: 'anillo' }, { en: 'idea:elegir+0.4', hace: 'anillo' },
                       { en: 'idea:cosa', hace: 'etiqueta', texto: 'SOY ASÍ', piedra: true }] }),
  rotulo({ id: 'rotulo-primero', texto: 'Primero estás', tono: 'neutro', x: 290, y: 1390, desde: 'idea:estás', hasta: 'idea:cosa' }),
  rotulo({ id: 'rotulo-eliges', texto: 'Luego eliges', tono: 'acento', x: 740, y: 1390, desde: 'idea:elegir', hasta: 'idea:cosa' }),
  // 6-8 · ejemplo: el mismo, erguido con sus amigos y encogido ante el jefe
  contraste({ id: 'contraste-directo', disposicion: 'columnas', y: 940, desde: 'ejemplo', hasta: 'ejemplo:fin',
              a: { titulo: 'Con sus amigos', texto: '«Soy muy directo»', modelo: 'peon', estado: 'erguida', tono: 'neutro' },
              b: { titulo: 'Delante del jefe', texto: 'Lo evita sin problema', modelo: 'peon', estado: 'encogida', tono: 'neutro' },
              entra_b: 'ejemplo:jefe' }),
  rotulo({ id: 'rotulo-rasgo', texto: 'Rasgo', tono: 'error', marca: 'no', x: 290, y: 1410, desde: 'ejemplo:rasgo', hasta: 'ejemplo:fin',
           efectos: [{ en: 'ejemplo:rasgo+0.2', hace: 'tacha' }] }),
  rotulo({ id: 'rotulo-eleccion', texto: 'Elección', tono: 'acento', marca: 'si', x: 740, y: 1410, desde: 'ejemplo:elección', hasta: 'ejemplo:fin' }),
  // 9 · cierre: la traducción de «soy así»
  burbuja({ id: 'burbuja-cierre-1', texto: 'Soy así.', lado: 'izq', tono: 'neutro', x: 540, y: 960, desde: 'cierre', hasta: 'cierre:fin' }),
  burbuja({ id: 'burbuja-cierre-2', texto: 'Elijo esto y no quiero que cuente.', lado: 'der', tono: 'acento', pila: 'burbuja-cierre-1',
            x: 540, y: 960, desde: 'cierre:elijo', hasta: 'cierre:fin' }),
  // 10 · cta
  cierre({ titulo: 'Yo es que soy así' }),
] });
```

- Metáforas (KIT §5):
  - el plano antes que el cortapapeles: la esencia antes que la existencia;
  - los anillos que se ganan al elegir: te vas haciendo;
  - el peón que se vuelve piedra con la etiqueta SOY ASÍ: tratarse como una cosa con propiedades fijas.

  La reserva, si en la hoja al 33 % no se lee, es la etiqueta sin `piedra` ni anillos.
- `a-firma` en `idea:otro` (F3, REVISION §B.1).
- `contraste-directo` no usa `gana` ni `tacha`. Lo que se juzga es la etiqueta («rasgo» o «elección»), no a
  las personas. Los dos lados son el mismo peón neutro; solo cambia la postura.
- **Portada** (1,0 s): la burbuja y la figura de debajo, con sus cajas desde y ≈ 790.

## Fuentes que hay que comprobar

| Frase / rótulo | Qué comprobar | Dónde |
|---|---|---|
| 1-2 | «Mala fe» en *El ser y la nada* (1943), parte I, cap. 2: es una mentira a uno mismo, no a otro | Traducción española de *El ser y la nada*; SEP, «Jean-Paul Sartre» (https://plato.stanford.edu/entries/sartre/), apartado sobre la mala fe |
| 3-4 | El objeto fabricado: Sartre usa un **cortapapeles** («la existencia precede a la esencia»). La ficha dice «cuchillo»; el guion sigue a Sartre | *El existencialismo es un humanismo* (1946). Se anota la edición y la página |
| 5 | «Condenados a ser libres» y tratarse como cosa: ficha y *El ser y la nada* | ficha: `desarrollo`; SEP |
| 6-8 | El «muy directo» es ejemplo de la **ficha**. La pista (lo evita delante de quien le conviene) también | ficha: `ejemplo_real` |
| 9 «puede» | Matiz de la ficha: Merleau-Ponty y Beauvoir objetan que la libertad tiene grados y que la situación limita. Por eso «puede querer decir» y no «quiere decir». Que el post lo diga | ficha: `matiz_experto` |

**Cita que no se usa:** la de la ficha («El infierno son los otros») es correcta, pero no trata de la mala fe y
se malinterpreta.

**Rigor.** El camarero de Sartre no cabe; si sobra tiempo, no se añade. La voz no dice que toda excusa sea mala
fe.

## Criterios de aceptación (además de `DECISIONES.md` §9)

- La frase 9 dice «puede querer decir».
- El post recoge la objeción de Beauvoir y Merleau-Ponty en una línea.

## Cómo comprobarlo

```
node reel/reels/rincon-kit/copiar.mjs rincon-mala-fe --corriente existencialismo
node reel/reel.mjs --reel rincon-mala-fe
node reel/qa/medir-fluida.mjs rincon-mala-fe
node reel/reel.mjs --reel rincon-mala-fe --vista 1.0,5,9,13,18,23,28,33
node reel/reels/rincon-kit/vacios.mjs rincon-mala-fe
node reel/reels/rincon-kit/web.mjs rincon-mala-fe
```

## Hecho

F5b, 2026-10-30. atempo 1,00 · 3,37 pal/s · 39,65 s · 5,95 MB (web 2,07 MB) · pico −1 dBTP · 1 petición de voz. Sin cambios de guion ni de escena. Fuentes: SEP «Sartre», conferencia de 1946 (Mairet); *El ser y la nada* no abierto. Comprobaciones en verde, 0 huecos. Pendiente: escucha del humano.
