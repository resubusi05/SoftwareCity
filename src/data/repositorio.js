import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query, runTransaction, setDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { auth, db, firebaseConfigurado, proveedorGoogle } from "../firebase";
import { PREGUNTAS_RETO, PUNTAJE_CIUDAD, PUNTOS_LECCION, PUNTOS_RETO } from "../config";
import { TEMAS } from "./contenido";
import { buscarEdificio, buscarLote, cabeEnLote } from "./catalogoCiudad";
import { AMIGOS_DEMO, CIUDADES_DEMO } from "./amigosDemo";

// ---------- Errores ----------
export class ErrorConexion extends Error {}
export class ErrorRetoYaCompletado extends Error {}
export class ErrorValidacion extends Error {}
export class ErrorSinSesion extends Error {}
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

// ---------- Sesión (inicio de sesión del alumno) ----------
// Con Firebase: cuenta de Google (Firebase Authentication). En modo local: solo el nombre, guardado en este navegador.
const CLAVE_SESION = "softwarecity:sesion";
const oyentesLocal = new Set();
const leerSesionLocal = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE_SESION) ?? "null"); } catch { return null; }
};
/** "María Pérez" -> "maria-perez". En modo local el mismo nombre recupera el mismo progreso. */
const idLocalDeNombre = (n) =>
  n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const sesion = {
  /** Llama a cb({ uid, nombre }) o cb(null) cada vez que cambia la sesión. Regresa la función para dejar de escuchar. */
  observar(cb) {
    if (auth) {
      return onAuthStateChanged(auth, (u) => cb(u ? { uid: u.uid, nombre: u.displayName || u.email || "Alumno" } : null));
    }
    oyentesLocal.add(cb);
    cb(leerSesionLocal());
    return () => oyentesLocal.delete(cb);
  },
  entrarConGoogle: () =>
    ejecutar(async () => {
      try {
        await signInWithPopup(auth, proveedorGoogle);
      } catch (e) {
        if (e?.code === "auth/popup-blocked") await signInWithRedirect(auth, proveedorGoogle);
        else if (e?.code === "auth/popup-closed-by-user" || e?.code === "auth/cancelled-popup-request") throw new Error("Cerraste la ventana de Google antes de terminar.");
        else if (e?.code === "auth/network-request-failed") throw new ErrorConexion("Sin conexión a internet.");
        else throw e;
      }
    }, 60000),
  entrarLocal: (nombre) =>
    ejecutar(async () => {
      const limpio = (nombre ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
      const id = idLocalDeNombre(limpio);
      if (limpio.length < 2 || id.length < 2) throw new ErrorValidacion("Escribe tu nombre (mínimo 2 letras).");
      const s = { uid: `local-${id}`, nombre: limpio };
      localStorage.setItem(CLAVE_SESION, JSON.stringify(s));
      oyentesLocal.forEach((cb) => cb(s));
      return s;
    }),
  cerrar: async () => {
    if (auth) { await signOut(auth); return; }
    localStorage.removeItem(CLAVE_SESION);
    oyentesLocal.forEach((cb) => cb(null));
  },
};

let uid = null;
let nombreSesion = "Alumno";
/** App llama esto cuando cambia la sesión, antes de cargar al alumno. */
export function usarSesion(s) {
  uid = s?.uid ?? null;
  nombreSesion = s?.nombre ?? "Alumno";
}
const exigirSesion = () => { if (!uid) throw new ErrorSinSesion("No has iniciado sesión."); };

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

/** Del banco del tema se toman PREGUNTAS_RETO preguntas distintas cada día, en rotación (el mismo día siempre sale lo mismo). */
function preguntasDelDia(banco, dia) {
  if (banco.length <= PREGUNTAS_RETO) return banco;
  const inicio = (dia * PREGUNTAS_RETO) % banco.length;
  return Array.from({ length: PREGUNTAS_RETO }, (_, k) => banco[(inicio + k) % banco.length]);
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
      return { fecha, tema: resumir(t), preguntas: preguntasDelDia(t.reto, dia), recompensaMaxima: PUNTOS_RETO };
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
// Estructura ({uid} = id de la cuenta de Google que inició sesión):
//   alumnos/{uid}                       -> { nombre, puntos, ciudadDesbloqueada, tutorialCiudadVisto }
//   alumnos/{uid}/progresoLecciones/{leccionId}
//   alumnos/{uid}/intentosEvaluacion/{autoId}
//   alumnos/{uid}/retos/{AAAA-MM-DD}
//   alumnos/{uid}/ciudad/plano           -> { lotes: { L7: "torre-requisitos" }, ultimaOperacion, actualizado }
function backendFirebase(fs) {
  // Las referencias se arman en cada llamada porque el uid cambia al iniciar o cerrar sesión
  const refAlumno = () => { exigirSesion(); return doc(fs, "alumnos", uid); };
  const refPlano = () => doc(refAlumno(), "ciudad", "plano");
  return {
    async cargarAlumno() {
      const alumnoRef = refAlumno();
      const planoRef = refPlano();
      const snap = await getDoc(alumnoRef);
      // Primer ingreso: se crea el alumno con el nombre de su cuenta de Google
      if (!snap.exists()) await setDoc(alumnoRef, { nombre: nombreSesion, puntos: 0 });
      const datos = snap.exists() ? snap.data() : { nombre: nombreSesion, puntos: 0 };
      const [prog, ints, reto, plano] = await Promise.all([
        getDocs(collection(alumnoRef, "progresoLecciones")),
        getDocs(query(collection(alumnoRef, "intentosEvaluacion"), orderBy("fecha", "desc"))),
        getDoc(doc(alumnoRef, "retos", hoyISO())),
        getDoc(planoRef),
      ]);
      const progreso = {};
      prog.forEach((d) => { progreso[d.id] = d.data(); });
      return {
        nombre: datos.nombre ?? nombreSesion,
        puntos: datos.puntos ?? 0,
        progreso,
        intentos: ints.docs.map((d) => d.data()),
        retoHoy: reto.exists() ? reto.data() : null,
        ciudadDesbloqueada: !!datos.ciudadDesbloqueada,
        tutorialCiudadVisto: !!datos.tutorialCiudadVisto,
        lotes: plano.exists() ? plano.data().lotes ?? {} : {},
      };
    },
    // Devuelve { puntosGanados, puntos }. Al completar la lección por primera vez se suman PUNTOS_LECCION
    // en la misma transacción que guarda el progreso, así un reintento no los paga dos veces.
    async guardarProgreso(p) {
      const alumnoRef = refAlumno();
      const progRef = doc(alumnoRef, "progresoLecciones", p.leccionId);
      if (!p.completada) {
        await setDoc(progRef, p);
        return { puntosGanados: 0 };
      }
      return runTransaction(fs, async (tx) => {
        const [prev, a] = [await tx.get(progRef), await tx.get(alumnoRef)];
        const puntos = a.data()?.puntos ?? 0;
        if (prev.exists() && prev.data().completada) { tx.set(progRef, p); return { puntosGanados: 0, puntos }; }
        const nuevos = puntos + PUNTOS_LECCION;
        tx.set(progRef, p);
        const cambios = { puntos: nuevos };
        if (nuevos >= PUNTAJE_CIUDAD) cambios.ciudadDesbloqueada = true;
        tx.set(alumnoRef, cambios, { merge: true });
        return { puntosGanados: PUNTOS_LECCION, puntos: nuevos };
      });
    },
    async registrarIntento(i) {
      await addDoc(collection(refAlumno(), "intentosEvaluacion"), i);
    },
    async registrarRetoCompletado(r) {
      const ref = doc(refAlumno(), "retos", r.fecha);
      await runTransaction(fs, async (tx) => {
        const s = await tx.get(ref);
        if (s.exists() && s.data().completado) throw new ErrorRetoYaCompletado("Ya completaste el reto de hoy.");
        tx.set(ref, r);
      });
    },
    async asignarRecompensa(fecha) {
      const alumnoRef = refAlumno();
      const retoRef = doc(alumnoRef, "retos", fecha);
      return runTransaction(fs, async (tx) => {
        const [s, a] = [await tx.get(retoRef), await tx.get(alumnoRef)];
        if (!s.exists() || !s.data().completado) throw new Error("El reto no está registrado como completado.");
        const puntos = a.data()?.puntos ?? 0;
        if (s.data().recompensaAsignada) return { yaAsignada: true, puntos };
        const nuevos = puntos + s.data().recompensa;
        tx.update(retoRef, { recompensaAsignada: true });
        const cambios = { puntos: nuevos };
        if (nuevos >= PUNTAJE_CIUDAD) cambios.ciudadDesbloqueada = true; // CDU-10 E1: se desbloquea y ya no se vuelve a ocultar
        tx.set(alumnoRef, cambios, { merge: true });
        return { yaAsignada: false, puntos: nuevos };
      });
    },
    // CDU-10: descontar puntos y guardar el edificio en UNA transacción (SCS 7.4)
    async comprarEdificio({ loteId, edificioId, idOperacion }) {
      const alumnoRef = refAlumno();
      const planoRef = refPlano();
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
      const planoRef = refPlano();
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
      await setDoc(refAlumno(), { tutorialCiudadVisto: true }, { merge: true });
    },
  };
}

// ----- Local (navegador) -----
const clave = () => { exigirSesion(); return `softwarecity:${uid}`; };
function leer() {
  const vacio = {
    nombre: nombreSesion, puntos: 0, progreso: {}, intentos: [], retos: {},
    ciudadDesbloqueada: false, tutorialCiudadVisto: false, lotes: {}, ultimaOperacion: null,
  };
  try {
    const raw = localStorage.getItem(clave());
    if (raw) return { ...vacio, ...JSON.parse(raw) };
  } catch { /* datos corruptos: se reinicia */ }
  return vacio;
}
const escribir = (a) => localStorage.setItem(clave(), JSON.stringify(a));

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
  async guardarProgreso(p) {
    const a = leer();
    const yaCompletada = !!a.progreso[p.leccionId]?.completada;
    a.progreso[p.leccionId] = p;
    let puntosGanados = 0;
    if (p.completada && !yaCompletada) {
      puntosGanados = PUNTOS_LECCION;
      a.puntos += PUNTOS_LECCION;
      if (a.puntos >= PUNTAJE_CIUDAD) a.ciudadDesbloqueada = true;
    }
    escribir(a);
    return { puntosGanados, puntos: a.puntos };
  },
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
// Datos de prueba en ambos modos (ver amigosDemo.js). Aunque ya hay inicio de sesión, "agregar amigo por código"
// todavía no existe, así que la lista sigue siendo de prueba y no depende de la cuenta. Pasan por ejecutar() para que las fallas
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
const claveBorrador = (fecha) => `softwarecity:reto-borrador:${uid ?? "sin-sesion"}:${fecha}`;
export const borradorReto = {
  leer(fecha) {
    try { return JSON.parse(localStorage.getItem(claveBorrador(fecha)) ?? "[]"); } catch { return []; }
  },
  guardar(fecha, respuestas) { localStorage.setItem(claveBorrador(fecha), JSON.stringify(respuestas)); },
  borrar(fecha) { localStorage.removeItem(claveBorrador(fecha)); },
};
