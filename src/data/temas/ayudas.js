// Ayudas para escribir lecciones con menos ruido. Ver components/ActividadSeccion.jsx para el significado de cada tipo.

/** Sección de una lección: título, párrafos y (opcional) una actividad de práctica. */
export const sec = (titulo, parrafos, actividad) => ({ titulo, parrafos, ...(actividad ? { actividad } : {}) });

/** Lección número `n` del tema `temaId`. El id queda «tema-n» (por ejemplo «fundamentos-3»). */
export const lec = (temaId, n, titulo, resumen, secciones) => ({ id: `${temaId}-${n}`, temaId, titulo, resumen, secciones });

export const op = (pregunta, opciones, correcta, explicacion) => ({ tipo: "opcion", pregunta, opciones, correcta, explicacion });
export const co = (frase, opciones, correcta, explicacion) => ({ tipo: "completar", frase, opciones, correcta, explicacion });
export const vf = (afirmacion, verdadero, explicacion) => ({ tipo: "vf", afirmacion, verdadero, explicacion });
export const ord = (enunciado, pasos, explicacion) => ({ tipo: "ordenar", enunciado, pasos, explicacion });
export const rel = (enunciado, parejas, explicacion) => ({ tipo: "relacionar", enunciado, parejas, explicacion });
