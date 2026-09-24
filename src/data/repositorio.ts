import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query, runTransaction, setDoc, type Firestore,
} from "firebase/firestore/lite";
import { db, firebaseConfigurado } from "../firebase";
import { ALUMNO_ID, ALUMNO_NOMBRE, PREGUNTAS_RETO, PUNTOS_RETO } from "../config";
import { TEMAS } from "./contenido";
import type {
  EstadoAlumno, EvaluacionCargada, IntentoEvaluacion, Leccion, ProgresoLeccion, RetoDelDia, RetoRegistro, Tema, TemaResumen,
} from "../types";

// ---------- Errores ----------
export class ErrorConexion extends Error {}
export class ErrorRetoYaCompletado extends Error {}

export function mensajeError(e: unknown): string {
  if (e instanceof Error && e.message) return e.message;
  return "Ocurrió un error inesperado.";
}

// ---------- Modo demo de fallas (para mostrar las excepciones de los casos de uso) ----------
let simularFallas = false;
export const setSimularFallas = (v: boolean) => { simularFallas = v; };
export const modo: "firebase" | "local" = firebaseConfigurado ? "firebase" : "local";

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Toda operación pasa por aquí: revisa conexión, fallas simuladas y tiempo de espera. */
async function ejecutar<T>(op: () => Promise<T>, limiteMs = 8000): Promise<T> {
  await esperar(250);
  if (simularFallas) throw new Error("Falla simulada (modo demostración de errores).");
  if (!navigator.onLine) throw new ErrorConexion("Sin conexión a internet.");
  const limite = new Promise<never>((_, rej) =>
    setTimeout(() => rej(new ErrorConexion("El servidor no respondió a tiempo. Revisa tu conexión.")), limiteMs),
  );
  return Promise.race([op(), limite]);
}

// ---------- Fechas ----------
export function hoyISO(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ---------- Contenido ----------
function resumir(t: Tema): TemaResumen {
  return {
    id: t.id, nombre: t.nombre, descripcion: t.descripcion, icono: t.icono, color: t.color,
    lecciones: t.lecciones.map((l) => ({ id: l.id, titulo: l.titulo, resumen: l.resumen, numSecciones: l.secciones.length })),
    numPreguntasEvaluacion: t.evaluacion.length,
  };
}
const temasDisponibles = () => TEMAS.filter((t) => t.disponible);
function buscarTema(id: string): Tema {
  const t = temasDisponibles().find((x) => x.id === id);
  if (!t) throw new Error("El tema no está disponible.");
  return t;
}

export const contenido = {
  cargarTemas: () => ejecutar(async () => temasDisponibles().map(resumir)),

  cargarLeccion: (leccionId: string) =>
    ejecutar(async (): Promise<Leccion> => {
      for (const t of temasDisponibles()) {
        const l = t.lecciones.find((x) => x.id === leccionId);
        if (l) return l;
      }
      throw new Error("No se encontró la lección.");
    }),

  cargarEvaluacion: (temaId: string) =>
    ejecutar(async (): Promise<EvaluacionCargada> => {
      const t = buscarTema(temaId);
      if (t.evaluacion.length === 0) throw new Error("La evaluación de este tema no está disponible.");
      return { tema: resumir(t), preguntas: t.evaluacion };
    }),

  cargarRetoDelDia: () =>
    ejecutar(async (): Promise<RetoDelDia> => {
      const fecha = hoyISO();
      const temas = temasDisponibles().filter((t) => t.reto.length > 0);
      const dia = Math.floor(new Date(fecha + "T00:00:00").getTime() / 86400000);
      const t = temas[dia % temas.length];
      return { fecha, tema: resumir(t), preguntas: t.reto.slice(0, PREGUNTAS_RETO), recompensa: PUNTOS_RETO };
    }),
};

// ---------- Datos del alumno ----------
type AsignacionResultado = { yaAsignada: boolean; puntos: number };

interface Backend {
  cargarAlumno(): Promise<EstadoAlumno>;
  guardarProgreso(p: ProgresoLeccion): Promise<void>;
  registrarIntento(i: IntentoEvaluacion): Promise<void>;
  registrarRetoCompletado(r: RetoRegistro): Promise<void>;
  asignarRecompensa(fecha: string): Promise<AsignacionResultado>;
}

// ----- Firebase (Firestore) -----
// Estructura:
//   alumnos/{alumnoId}                       -> { nombre, puntos }
//   alumnos/{alumnoId}/progresoLecciones/{leccionId}
//   alumnos/{alumnoId}/intentosEvaluacion/{autoId}
//   alumnos/{alumnoId}/retos/{AAAA-MM-DD}
function backendFirebase(fs: Firestore): Backend {
  const alumnoRef = doc(fs, "alumnos", ALUMNO_ID);
  return {
    async cargarAlumno() {
      const snap = await getDoc(alumnoRef);
      if (!snap.exists()) await setDoc(alumnoRef, { nombre: ALUMNO_NOMBRE, puntos: 0 });
      const datos = snap.exists() ? snap.data() : { nombre: ALUMNO_NOMBRE, puntos: 0 };
      const [prog, ints, reto] = await Promise.all([
        getDocs(collection(alumnoRef, "progresoLecciones")),
        getDocs(query(collection(alumnoRef, "intentosEvaluacion"), orderBy("fecha", "desc"))),
        getDoc(doc(alumnoRef, "retos", hoyISO())),
      ]);
      const progreso: Record<string, ProgresoLeccion> = {};
      prog.forEach((d) => { progreso[d.id] = d.data() as ProgresoLeccion; });
      return {
        nombre: (datos.nombre as string) ?? ALUMNO_NOMBRE,
        puntos: (datos.puntos as number) ?? 0,
        progreso,
        intentos: ints.docs.map((d) => d.data() as IntentoEvaluacion),
        retoHoy: reto.exists() ? (reto.data() as RetoRegistro) : null,
      };
    },
    async guardarProgreso(p) {
      await setDoc(doc(alumnoRef, "progresoLecciones", p.leccionId), p);
    },
    async registrarIntento(i) {
      await addDoc(collection(alumnoRef, "intentosEvaluacion"), i);
    },
    async registrarRetoCompletado(r) {
      const ref = doc(alumnoRef, "retos", r.fecha);
      await runTransaction(fs, async (tx) => {
        const s = await tx.get(ref);
        if (s.exists() && s.data().completado) throw new ErrorRetoYaCompletado("Ya completaste el reto de hoy.");
        tx.set(ref, r);
      });
    },
    async asignarRecompensa(fecha) {
      const retoRef = doc(alumnoRef, "retos", fecha);
      return runTransaction(fs, async (tx) => {
        const [s, a] = [await tx.get(retoRef), await tx.get(alumnoRef)];
        if (!s.exists() || !s.data().completado) throw new Error("El reto no está registrado como completado.");
        const puntos = (a.data()?.puntos as number) ?? 0;
        if (s.data().recompensaAsignada) return { yaAsignada: true, puntos };
        const nuevos = puntos + (s.data().recompensa as number);
        tx.update(retoRef, { recompensaAsignada: true });
        tx.set(alumnoRef, { nombre: ALUMNO_NOMBRE, puntos: nuevos }, { merge: true });
        return { yaAsignada: false, puntos: nuevos };
      });
    },
  };
}

// ----- Local (navegador) -----
type Almacen = { nombre: string; puntos: number; progreso: Record<string, ProgresoLeccion>; intentos: IntentoEvaluacion[]; retos: Record<string, RetoRegistro> };
const CLAVE = `softwarecity:${ALUMNO_ID}`;
function leer(): Almacen {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (raw) return JSON.parse(raw) as Almacen;
  } catch { /* datos corruptos: se reinicia */ }
  return { nombre: ALUMNO_NOMBRE, puntos: 0, progreso: {}, intentos: [], retos: {} };
}
const escribir = (a: Almacen) => localStorage.setItem(CLAVE, JSON.stringify(a));

const backendLocal: Backend = {
  async cargarAlumno() {
    const a = leer();
    return { nombre: a.nombre, puntos: a.puntos, progreso: a.progreso, intentos: [...a.intentos].sort((x, y) => y.fecha - x.fecha), retoHoy: a.retos[hoyISO()] ?? null };
  },
  async guardarProgreso(p) { const a = leer(); a.progreso[p.leccionId] = p; escribir(a); },
  async registrarIntento(i) { const a = leer(); a.intentos.push(i); escribir(a); },
  async registrarRetoCompletado(r) {
    const a = leer();
    if (a.retos[r.fecha]?.completado) throw new ErrorRetoYaCompletado("Ya completaste el reto de hoy.");
    a.retos[r.fecha] = r; escribir(a);
  },
  async asignarRecompensa(fecha) {
    const a = leer();
    const r = a.retos[fecha];
    if (!r?.completado) throw new Error("El reto no está registrado como completado.");
    if (r.recompensaAsignada) return { yaAsignada: true, puntos: a.puntos };
    r.recompensaAsignada = true; a.puntos += r.recompensa; escribir(a);
    return { yaAsignada: false, puntos: a.puntos };
  },
};

const backend: Backend = db ? backendFirebase(db) : backendLocal;

export const alumnoRepo = {
  cargarAlumno: () => ejecutar(() => backend.cargarAlumno()),
  guardarProgreso: (p: ProgresoLeccion) => ejecutar(() => backend.guardarProgreso(p)),
  registrarIntento: (i: IntentoEvaluacion) => ejecutar(() => backend.registrarIntento(i)),
  registrarRetoCompletado: (r: RetoRegistro) => ejecutar(() => backend.registrarRetoCompletado(r)),
  asignarRecompensa: (fecha: string) => ejecutar(() => backend.asignarRecompensa(fecha)),
};

// ---------- Borrador del reto (RF-RT-10: conservar avance si se pierde la conexión) ----------
const claveBorrador = (fecha: string) => `softwarecity:reto-borrador:${ALUMNO_ID}:${fecha}`;
export const borradorReto = {
  leer(fecha: string): number[] {
    try { return JSON.parse(localStorage.getItem(claveBorrador(fecha)) ?? "[]") as number[]; } catch { return []; }
  },
  guardar(fecha: string, respuestas: number[]) { localStorage.setItem(claveBorrador(fecha), JSON.stringify(respuestas)); },
  borrar(fecha: string) { localStorage.removeItem(claveBorrador(fecha)); },
};
