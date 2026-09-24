export type Seccion = { titulo: string; parrafos: string[] };

export type Leccion = { id: string; temaId: string; titulo: string; resumen: string; secciones: Seccion[] };

export type Pregunta = { id: string; texto: string; opciones: string[]; correcta: number; explicacion: string };

export type Tema = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  disponible: boolean;
  lecciones: Leccion[];
  evaluacion: Pregunta[];
  reto: Pregunta[];
};

/** Lo que se muestra en listados (sin contenido completo). */
export type TemaResumen = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  lecciones: { id: string; titulo: string; resumen: string; numSecciones: number }[];
  numPreguntasEvaluacion: number;
};

export type EvaluacionCargada = { tema: TemaResumen; preguntas: Pregunta[] };

export type RetoDelDia = { fecha: string; tema: TemaResumen; preguntas: Pregunta[]; recompensa: number };

// ---- Datos del alumno (lo que se guarda en Firebase) ----

export type ProgresoLeccion = {
  leccionId: string;
  temaId: string;
  seccion: number; // última sección alcanzada (índice)
  completada: boolean;
  actualizado: number;
};

export type IntentoEvaluacion = {
  temaId: string;
  respuestas: number[];
  aciertos: number;
  total: number;
  fecha: number;
};

export type RetoRegistro = {
  fecha: string; // AAAA-MM-DD
  temaId: string;
  respuestas: number[];
  completado: boolean;
  recompensa: number;
  recompensaAsignada: boolean;
};

export type EstadoAlumno = {
  nombre: string;
  puntos: number;
  progreso: Record<string, ProgresoLeccion>;
  intentos: IntentoEvaluacion[];
  retoHoy: RetoRegistro | null;
};

export type Pantalla =
  | { nombre: "inicio" }
  | { nombre: "tema"; temaId: string }
  | { nombre: "leccion"; temaId: string; leccionId: string }
  | { nombre: "evaluacion"; temaId: string }
  | { nombre: "reto" };
