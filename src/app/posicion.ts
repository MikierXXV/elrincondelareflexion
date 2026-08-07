/**
 * Dónde se quedó el usuario, para devolverlo ahí al recargar.
 *
 * POR QUÉ NO SE GUARDA EL DESPLAZAMIENTO EN PÍXELES. La página carga las ideas por proximidad, así
 * que su altura cambia mientras se lee. Un desplazamiento exacto aterriza donde no debe en cuanto
 * algo de arriba sustituye su altura reservada por la real —es el mismo fallo que obligó a escribir
 * `reanclar()` en rutas.ts—. El ancla, en cambio, siempre cae sobre algo que significa algo: la
 * idea o la corriente que se estaba leyendo.
 *
 * Y `sessionStorage` y no `localStorage`: recuperar la posición tiene sentido dentro de una sesión,
 * al recargar o al volver atrás. Reabrir el sitio una semana después y aterrizar en mitad de
 * Avicena sin contexto no ayuda a nadie.
 */

import { leer, suscribir } from './estado';

const CLAVE = 'rincon:posicion';

/** El ancla guardada, o null si el usuario no había pasado del hero. */
export function posicionGuardada(): string | null {
  try {
    const v = sessionStorage.getItem(CLAVE);
    return v && v.startsWith('#') ? v : null;
  } catch {
    // Navegación privada con almacenamiento bloqueado: sin memoria, pero el sitio funciona igual.
    return null;
  }
}

/**
 * Empieza a seguir la posición. Se apoya en el estado del recorrido, que ya es emisor único: aquí
 * no se observa nada nuevo ni se añade otro escucha de scroll.
 */
export function seguirPosicion(): () => void {
  return suscribir((e) => {
    let ancla: string | null = null;
    if (e.zona === 'recorrido') ancla = e.ideaActiva ? `#idea-${e.ideaActiva}` : (e.corrienteActiva ? `#corriente-${e.corrienteActiva}` : null);
    else if (e.zona === 'umbral') ancla = '#umbral';
    else if (e.zona === 'cromos') ancla = '#cromos';

    try {
      // En el hero se BORRA, no se deja lo anterior: volver arriba y recargar tiene que dejarte
      // arriba. Si no, la posición vieja te devolvería al recorrido que acababas de abandonar.
      if (ancla) sessionStorage.setItem(CLAVE, ancla);
      else if (e.zona === 'hero') sessionStorage.removeItem(CLAVE);
    } catch { /* almacenamiento bloqueado: se sigue sin recordar nada */ }
  });
}

/** Para el conmutador de idioma y demás sitios que remontan sin cambiar de posición. */
export function olvidarPosicion(): void {
  try { sessionStorage.removeItem(CLAVE); } catch { /* nada que olvidar */ }
}

/** La posición actual, para leerla sin esperar al siguiente cambio de estado. */
export function anclaActual(): string | null {
  const e = leer();
  if (e.zona !== 'recorrido') return null;
  return e.ideaActiva ? `#idea-${e.ideaActiva}` : (e.corrienteActiva ? `#corriente-${e.corrienteActiva}` : null);
}
