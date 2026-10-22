// El alumno ya no es fijo: su id y nombre salen de la sesión (Google con Firebase; nombre en modo local).
// Ver `sesion` y `usarSesion` en data/repositorio.js.

// ---------- Lecciones (CDU-1) ----------
// POR DEFINIR (valor de relleno): puntos que se ganan al completar una lección POR PRIMERA VEZ.
// Repetir una lección ya completada no da puntos. Con 140, dos lecciones ya superan PUNTAJE_CIUDAD (200).
export const PUNTOS_LECCION = 140;

// ---------- Reto del día (CDU-2) ----------
// Valores POR DEFINIR en la SRS. Cámbialos aquí cuando el equipo los decida.
export const PUNTOS_RETO = 50; // recompensa MÁXIMA del reto: se gana completa con todas correctas (RF-PRO-03)
export const PREGUNTAS_RETO = 5; // número de preguntas de la trivia rápida del reto

/** RF-PRO-03: la recompensa es proporcional a las respuestas correctas. 3 de 5 con 50 máx. = 30 pts. */
export function calcularRecompensa(aciertos, total, maximo = PUNTOS_RETO) {
  if (total <= 0) return 0;
  return Math.round((maximo * aciertos) / total);
}

// ---------- Ciudad virtual (CDU-10) ----------
// POR DEFINIR (TK-08): puntaje con el que aparece "Mi ciudad" en el Inicio (CDU-10, E1).
// Valor de relleno; los precios, edificios y lotes están en data/catalogoCiudad.js.
export const PUNTAJE_CIUDAD = 200;
