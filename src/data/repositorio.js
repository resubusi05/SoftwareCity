import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query, runTransaction, setDoc,
} from "firebase/firestore";
import { db, firebaseConfigurado } from "../firebase";
import { ALUMNO_ID, ALUMNO_NOMBRE, PREGUNTAS_RETO, PUNTAJE_CIUDAD, PUNTOS_RETO } from "../config";
import { TEMAS } from "./contenido";
import { buscarEdificio, buscarLote, cabeEnLote } from "./catalogoCiudad";
import { AMIGOS_DEMO, CIUDADES_DEMO } from "./amigosDemo";

// ---------- Errores ----------
export class ErrorConexion extends Error {}
export class ErrorRetoYaCompletado extends Error {}
// Ciudad (CDU-10): reglas que se revisan dentro de la transacción
export class ErrorPuntosInsuficientes extends Error {}
export class ErrorLoteOcupado extends Error {}
export class ErrorNoCabe extends Error {}

export function mensajeError(e) {
  if (e instanceof Error && e.message) return e.message;
  return "Ocurrió un error inesperado.";
}

// ---------- Modo demo de fallas (para mostrar las excepciones de los casos de uso) ----------
let simularFallas = false;
export const setSimularFallas = (v) => { simularFallas = v; };
export const modo = firebaseConfigurado ? "firebase" : "local";

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Toda operación pasa por aquí: revisa conexión, fallas simuladas y tiempo de espera (SCS 7.4). */
async function ejecutar(op, limiteMs = 8000) {
  await esperar(250);
  if (simularFallas) throw new Error("Falla simulada (modo demostración de errores).");
  if (!navigator.onLine) throw new ErrorConexion("Sin conexión a internet.");
  const limite = new Promise((_, rej) =>
    setTimeout(() => rej(new ErrorConexion("El servidor no respondió a tiempo. Revisa tu conexión.")), limiteMs),
  );
  return Promise.race([op(), limite]);
}

/** Id único de una operación. Se reusa al reintentar para que una compra no se cobre dos veces. */
export function nuevoIdOperacion() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Fechas ----------
export function hoyISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ---------- Contenido ----------
function resumir(t) {
  return {
    id: t.id, nombre: t.nombre, descripcion: t.descripcion, icono: t.icono, color: t.color,
    lecciones: t.lecciones.map((l) => ({ id: l.id, titulo: l.titulo, resumen: l.resumen, numSecciones: l.secciones.length })),
    numPreguntasEvaluacion: t.evaluacion.length,
  };
}
const temasDisponibles = () => TEMAS.filter((t) => t.disponible);
function buscarTema(id) {
  const t = temasDisponibles().find((x) => x.id === id);
  if (!t) throw new Error("El tema no está disponible.");
  return t;
}

export const contenido = {
  cargarTemas: () => ejecutar(async () => temasDisponibles().map(resumir)),

  cargarLeccion: (leccionId) =>
    ejecutar(async () => {
      for (const t of temasDisponibles()) {
        const l = t.lecciones.find((x) => x.id === leccionId);
        if (l) return l;
      }
      throw new Error("No se encontró la lección.");
    }),

  cargarEvaluacion: (temaId) =>
    ejecutar(async () => {
      const t = buscarTema(temaId);
      if (t.evaluacion.length === 0) throw new Error("La evaluación de este tema no está disponible.");
      return { tema: resumir(t), preguntas: t.evaluacion };
    }),

  /** recompensaMaxima: lo que se gana con todas correctas; lo ganado es proporcional (RF-PRO-03). */
  cargarRetoDelDia: () =>
    ejecutar(async () => {
      const fecha = hoyISO();
      const temas = temasDisponibles().filter((t) => t.reto.length > 0);
      const dia = Math.floor(new Date(fecha + "T00:00:00").getTime() / 86400000);
      const t = temas[dia % temas.length];
      return { fecha, tema: resumir(t), preguntas: t.reto.slice(0, PREGUNTAS_RETO), recompensaMaxima: PUNTOS_RETO };
    }),
};

// ---------- Reglas de la ciudad (iguales para Firebase y modo local) ----------

/** CDU-10 paso 6 (comprar): revisa puntos, lote libre y que el edificio quepa. Devuelve el precio. */
function validarCompra(puntos, lotes, loteId, edificioId) {
  const lote = buscarLote(loteId);
  const edificio = buscarEdificio(edificioId);
  if (!lote || !edificio) throw new Error("El lote o el edificio no existe.");
  if (lotes[loteId]) throw new ErrorLoteOcupado(`El lote ${loteId} ya tiene un edificio.`);
  if (!cabeEnLote(edificio, lote)) throw new ErrorNoCabe(`${edificio.nombre} no cabe en el lote ${loteId}.`);
  if (puntos < edificio.precio) throw new ErrorPuntosInsuficientes(`Te faltan ${edificio.precio - puntos} puntos para ${edificio.nombre}.`);
  return edificio.precio;
}

/** CDU-10 paso 6 (mover): el edificio sale de su lote y pasa a uno libre donde quepa. */
function validarMovimiento(lotes, origenId, destinoId) {
  const edificioId = lotes[origenId];
  const edificio = edificioId ? buscarEdificio(edificioId) : null;
  const destino = buscarLote(destinoId);
  if (!edificio || !destino) throw new Error("El edificio o el lote ya no existe.");
  if (lotes[destinoId]) throw new ErrorLoteOcupado(`El lote ${destinoId} ya tiene un edificio.`);
  if (!cabeEnLote(edificio, destino)) throw new ErrorNoCabe(`${edificio.nombre} no cabe en el lote ${destinoId}.`);
  const nuevos = { ...lotes, [destinoId]: edificioId };
  delete nuevos[origenId];
  return nuevos;
}

// ---------- Datos del alumno ----------
// Backend: cargarAlumno, guardarProgreso, registrarIntento, registrarRetoCompletado, asignarRecompensa,
//          comprarEdificio, moverEdificio, marcarTutorialVisto
// Las dos implementaciones (Firebase y local) deben comportarse igual (SCS 11).

// ----- Firebase (Firestore) -----
// Estructura:
//   alumnos/{alumnoId}                       -> { nombre, puntos, ciudadDesbloqueada, tutorialCiudadVisto }
//   alumnos/{alumnoId}/progresoLecciones/{leccionId}
//   alumnos/{alumnoId}/intentosEvaluacion/{autoId}
//   alumnos/{alumnoId}/retos/{AAAA-MM-DD}
//   alumnos/{alumnoId}/ciudad/plano           -> { lotes: { L7: "torre-requisitos" }, ultimaOperacion, actualizado }
function backendFirebase(fs) {
  const alumnoRef = doc(fs, "alumnos", ALUMNO_ID);
  const planoRef = doc(alumnoRef, "ciudad", "plano");
  return {
    async cargarAlumno() {
      const snap = await getDoc(alumnoRef);
      if (!snap.exists()) await setDoc(alumnoRef, { nombre: ALUMNO_NOMBRE, puntos: 0 });
      const datos = snap.exists() ? snap.data() : { nombre: ALUMNO_NOMBRE, puntos: 0 };
      const [prog, ints, reto, plano] = await Promise.all([
        getDocs(collection(alumnoRef, "progresoLecciones")),
        getDocs(query(collection(alumnoRef, "intentosEvaluacion"), orderBy("fecha", "desc"))),
        getDoc(doc(alumnoRef, "retos", hoyISO())),
        getDoc(planoRef),
      ]);
      const progreso = {};
      prog.forEach((d) => { progreso[d.id] = d.data(); });
      return {
        nombre: datos.nombre ?? ALUMNO_NOMBRE,
        puntos: datos.puntos ?? 0,
        progreso,
        intentos: ints.docs.map((d) => d.data()),
        retoHoy: reto.exists() ? reto.data() : null,
        ciudadDesbloqueada: !!datos.ciudadDesbloqueada,
        tutorialCiudadVisto: !!datos.tutorialCiudadVisto,
        lotes: plano.exists() ? plano.data().lotes ?? {} : {},
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
        const puntos = a.data()?.puntos ?? 0;
        if (s.data().recompensaAsignada) return { yaAsignada: true, puntos };
        const nuevos = puntos + s.data().recompensa;
        tx.update(retoRef, { recompensaAsignada: true });
        const cambios = { nombre: ALUMNO_NOMBRE, puntos: nuevos };
        if (nuevos >= PUNTAJE_CIUDAD) cambios.ciudadDesbloqueada = true; // CDU-10 E1: se desbloquea y ya no se vuelve a ocultar
        tx.set(alumnoRef, cambios, { merge: true });
        return { yaAsignada: false, puntos: nuevos };
      });
    },
    // CDU-10: descontar puntos y guardar el edificio en UNA transacción (SCS 7.4)
    async comprarEdificio({ loteId, edificioId, idOperacion }) {
      return runTransaction(fs, async (tx) => {
        const [a, p] = [await tx.get(alumnoRef), await tx.get(planoRef)];
        const puntos = a.data()?.puntos ?? 0;
        const lotes = p.exists() ? { ...(p.data().lotes ?? {}) } : {};
        // Reintento de una compra que sí se guardó (p. ej. se agotó el tiempo de espera): no se cobra otra vez
        if (p.exists() && p.data().ultimaOperacion === idOperacion) return { puntos, lotes, yaAplicada: true };
        const precio = validarCompra(puntos, lotes, loteId, edificioId);
        const nuevos = { ...lotes, [loteId]: edificioId };
        tx.set(alumnoRef, { puntos: puntos - precio, ciudadDesbloqueada: true }, { merge: true });
        tx.set(planoRef, { lotes: nuevos, ultimaOperacion: idOperacion, actualizado: Date.now() });
        return { puntos: puntos - precio, lotes: nuevos, yaAplicada: false };
      });
    },
    async moverEdificio({ origenId, destinoId, idOperacion }) {
      return runTransaction(fs, async (tx) => {
        const p = await tx.get(planoRef);
        const lotes = p.exists() ? { ...(p.data().lotes ?? {}) } : {};
        if (p.exists() && p.data().ultimaOperacion === idOperacion) return { lotes, yaAplicada: true };
        const nuevos = validarMovimiento(lotes, origenId, destinoId);
        tx.set(planoRef, { lotes: nuevos, ultimaOperacion: idOperacion, actualizado: Date.now() });
        return { lotes: nuevos, yaAplicada: false };
      });
    },
    async marcarTutorialVisto() {
      await setDoc(alumnoRef, { tutorialCiudadVisto: true }, { merge: true });
    },
  };
}

// ----- Local (navegador) -----
const CLAVE = `softwarecity:${ALUMNO_ID}`;
function leer() {
  const vacio = {
    nombre: ALUMNO_NOMBRE, puntos: 0, progreso: {}, intentos: [], retos: {},
    ciudadDesbloqueada: false, tutorialCiudadVisto: false, lotes: {}, ultimaOperacion: null,
  };
  try {
    const raw = localStorage.getItem(CLAVE);
    if (raw) return { ...vacio, ...JSON.parse(raw) };
  } catch { /* datos corruptos: se reinicia */ }
  return vacio;
}
const escribir = (a) => localStorage.setItem(CLAVE, JSON.stringify(a));

const backendLocal = {
  async cargarAlumno() {
    const a = leer();
    return {
      nombre: a.nombre, puntos: a.puntos, progreso: a.progreso,
      intentos: [...a.intentos].sort((x, y) => y.fecha - x.fecha),
      retoHoy: a.retos[hoyISO()] ?? null,
      ciudadDesbloqueada: a.ciudadDesbloqueada, tutorialCiudadVisto: a.tutorialCiudadVisto, lotes: a.lotes,
    };
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
    r.recompensaAsignada = true; a.puntos += r.recompensa;
    if (a.puntos >= PUNTAJE_CIUDAD) a.ciudadDesbloqueada = true;
    escribir(a);
    return { yaAsignada: false, puntos: a.puntos };
  },
  async comprarEdificio({ loteId, edificioId, idOperacion }) {
    const a = leer();
    if (a.ultimaOperacion === idOperacion) return { puntos: a.puntos, lotes: a.lotes, yaAplicada: true };
    const precio = validarCompra(a.puntos, a.lotes, loteId, edificioId);
    a.puntos -= precio;
    a.lotes = { ...a.lotes, [loteId]: edificioId };
    a.ciudadDesbloqueada = true;
    a.ultimaOperacion = idOperacion;
    escribir(a);
    return { puntos: a.puntos, lotes: a.lotes, yaAplicada: false };
  },
  async moverEdificio({ origenId, destinoId, idOperacion }) {
    const a = leer();
    if (a.ultimaOperacion === idOperacion) return { lotes: a.lotes, yaAplicada: true };
    a.lotes = validarMovimiento(a.lotes, origenId, destinoId);
    a.ultimaOperacion = idOperacion;
    escribir(a);
    return { lotes: a.lotes, yaAplicada: false };
  },
  async marcarTutorialVisto() { const a = leer(); a.tutorialCiudadVisto = true; escribir(a); },
};

const backend = db ? backendFirebase(db) : backendLocal;

export const alumnoRepo = {
  cargarAlumno: () => ejecutar(() => backend.cargarAlumno()),
  guardarProgreso: (p) => ejecutar(() => backend.guardarProgreso(p)),
  registrarIntento: (i) => ejecutar(() => backend.registrarIntento(i)),
  registrarRetoCompletado: (r) => ejecutar(() => backend.registrarRetoCompletado(r)),
  asignarRecompensa: (fecha) => ejecutar(() => backend.asignarRecompensa(fecha)),
};

// ---------- Ciudad del alumno (CDU-10) ----------
export const ciudadRepo = {
  /** { loteId, edificioId, idOperacion } -> { puntos, lotes, yaAplicada } */
  comprarEdificio: (datos) => ejecutar(() => backend.comprarEdificio(datos)),
  /** { origenId, destinoId, idOperacion } -> { lotes, yaAplicada } */
  moverEdificio: (datos) => ejecutar(() => backend.moverEdificio(datos)),
  marcarTutorialVisto: () => ejecutar(() => backend.marcarTutorialVisto()),
};

// ---------- Amigos (CDU-12) ----------
// Datos de prueba en ambos modos (ver amigosDemo.js). Pasan por ejecutar() para que las fallas
// simuladas y la falta de conexión se comporten igual que el resto (RNF-05).
export const amigosRepo = {
  cargarAmigos: () => ejecutar(async () => AMIGOS_DEMO.map((a) => ({ ...a }))),
  /** -> { amigo, lotes } o null si el amigo todavía no tiene ciudad (CDU-12 E1). Solo lectura. */
  cargarCiudadAmigo: (amigoId) =>
    ejecutar(async () => {
      const amigo = AMIGOS_DEMO.find((a) => a.id === amigoId);
      if (!amigo) throw new Error("No se encontró a tu amigo.");
      const lotes = CIUDADES_DEMO[amigoId];
      if (!lotes || Object.keys(lotes).length === 0) return null;
      return { amigo: { ...amigo }, lotes: { ...lotes } };
    }),
};

// ---------- Borrador del reto (RF-RT-10: conservar avance si se pierde la conexión) ----------
const claveBorrador = (fecha) => `softwarecity:reto-borrador:${ALUMNO_ID}:${fecha}`;
export const borradorReto = {
  leer(fecha) {
    try { return JSON.parse(localStorage.getItem(claveBorrador(fecha)) ?? "[]"); } catch { return []; }
  },
  guardar(fecha, respuestas) { localStorage.setItem(claveBorrador(fecha), JSON.stringify(respuestas)); },
  borrar(fecha) { localStorage.removeItem(claveBorrador(fecha)); },
};
