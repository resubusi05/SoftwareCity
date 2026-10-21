import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Nav from "./components/Nav";
import Inicio from "./components/Inicio";
import TemaView from "./components/TemaView";
import LeccionView from "./components/LeccionView";
import RetoView from "./components/RetoView";
import EvaluacionView from "./components/EvaluacionView";
import AmigosView from "./components/amigos/AmigosView";
import { Cargando, PanelError } from "./components/ui";
import { alumnoRepo, amigosRepo, contenido, mensajeError } from "./data/repositorio";
import { ciudadDesbloqueada } from "./data/catalogoCiudad";
import { ALUMNO_NOMBRE, PUNTAJE_CIUDAD } from "./config";

// La escena 3D (three.js) se descarga solo al entrar a una ciudad, para que el Inicio cargue rápido en teléfono (SCS 2.7)
const CiudadView = lazy(() => import("./components/ciudad/CiudadView"));
const CiudadAmigoView = lazy(() => import("./components/amigos/CiudadAmigoView"));

// Navegación por estado (SCS 11, D1). Pantallas:
//   { nombre: "inicio" } | { nombre: "tema", temaId } | { nombre: "leccion", temaId, leccionId }
//   { nombre: "evaluacion", temaId } | { nombre: "reto" }
//   { nombre: "ciudad" } (CDU-10) | { nombre: "amigos" } | { nombre: "ciudadAmigo", amigo, lotes } (CDU-12)
export default function App() {
  const [pantalla, setPantalla] = useState({ nombre: "inicio" });
  const [alumno, setAlumno] = useState(null);
  const [temas, setTemas] = useState(null);
  const [amigos, setAmigos] = useState(null);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const [a, t, am] = await Promise.all([alumnoRepo.cargarAlumno(), contenido.cargarTemas(), amigosRepo.cargarAmigos()]);
      setAlumno(a);
      setTemas(t);
      setAmigos(am);
    } catch (e) {
      setError(mensajeError(e));
    }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  /** Vuelve a leer al alumno sin mostrar la pantalla de error (P-19: "Volver a la ciudad"). */
  const recargarAlumno = useCallback(async () => {
    try { setAlumno(await alumnoRepo.cargarAlumno()); } catch { /* se queda lo que ya se mostraba */ }
  }, []);

  const actualizar = (f) => setAlumno((a) => (a ? f(a) : a));
  const irInicio = () => setPantalla({ nombre: "inicio" });
  const tema = (id) => temas?.find((t) => t.id === id);

  let contenidoPantalla;
  if (error) {
    contenidoPantalla = (
      <div className="max-w-xl mx-auto px-4 py-10">
        <PanelError titulo="No se pudo cargar la información" mensaje="Ocurrió un error al cargar los temas o tu progreso." detalle={error}
          acciones={[{ texto: "Reintentar", onClick: cargar, primaria: true }]} />
      </div>
    );
  } else if (!alumno || !temas || !amigos) {
    contenidoPantalla = <Cargando />;
  } else if (pantalla.nombre === "tema" && tema(pantalla.temaId)) {
    const t = tema(pantalla.temaId);
    contenidoPantalla = (
      <TemaView tema={t} alumno={alumno}
        onLeccion={(leccionId) => setPantalla({ nombre: "leccion", temaId: t.id, leccionId })}
        onEvaluacion={() => setPantalla({ nombre: "evaluacion", temaId: t.id })}
        onVolver={irInicio} />
    );
  } else if (pantalla.nombre === "leccion") {
    const { temaId, leccionId } = pantalla;
    contenidoPantalla = (
      <LeccionView key={leccionId} leccionId={leccionId} color={tema(temaId)?.color ?? "#00d4ff"}
        progreso={alumno.progreso[leccionId]}
        onGuardado={(p) => actualizar((a) => ({ ...a, progreso: { ...a.progreso, [p.leccionId]: p } }))}
        onVolver={() => setPantalla({ nombre: "tema", temaId })} />
    );
  } else if (pantalla.nombre === "evaluacion") {
    const { temaId } = pantalla;
    contenidoPantalla = (
      <EvaluacionView key={temaId} temaId={temaId}
        intentosPrevios={alumno.intentos.filter((i) => i.temaId === temaId)}
        onIntento={(i) => actualizar((a) => ({ ...a, intentos: [i, ...a.intentos] }))}
        onVolver={() => setPantalla({ nombre: "tema", temaId })} />
    );
  } else if (pantalla.nombre === "reto") {
    contenidoPantalla = (
      <RetoView retoHoy={alumno.retoHoy}
        onRegistro={(r) => actualizar((a) => ({ ...a, retoHoy: r }))}
        onPuntos={(puntos) => actualizar((a) => ({ ...a, puntos, ciudadDesbloqueada: a.ciudadDesbloqueada || puntos >= PUNTAJE_CIUDAD }))}
        onVolver={irInicio} />
    );
  } else if (pantalla.nombre === "ciudad" && ciudadDesbloqueada(alumno)) {
    contenidoPantalla = (
      <CiudadView alumno={alumno}
        onActualizar={(cambios) => actualizar((a) => ({ ...a, ...cambios, ciudadDesbloqueada: true }))}
        onTutorialVisto={() => actualizar((a) => ({ ...a, tutorialCiudadVisto: true }))}
        onRecargar={recargarAlumno}
        onVolver={irInicio} />
    );
  } else if (pantalla.nombre === "amigos") {
    contenidoPantalla = (
      <AmigosView amigos={amigos}
        onVisitar={({ amigo, lotes }) => setPantalla({ nombre: "ciudadAmigo", amigo, lotes })}
        onVolver={irInicio} />
    );
  } else if (pantalla.nombre === "ciudadAmigo") {
    contenidoPantalla = (
      <CiudadAmigoView key={pantalla.amigo.id} amigo={pantalla.amigo} lotes={pantalla.lotes}
        onSalir={() => setPantalla({ nombre: "amigos" })} />
    );
  } else {
    contenidoPantalla = (
      <Inicio alumno={alumno} temas={temas} amigos={amigos}
        onTema={(temaId) => setPantalla({ nombre: "tema", temaId })}
        onReto={() => setPantalla({ nombre: "reto" })}
        onCiudad={() => setPantalla({ nombre: "ciudad" })}
        onAmigos={() => setPantalla({ nombre: "amigos" })} />
    );
  }

  return (
    <div className="min-h-full bg-background grid-bg flex flex-col">
      <Nav nombre={alumno?.nombre ?? ALUMNO_NOMBRE} puntos={alumno?.puntos ?? 0} onInicio={irInicio} />
      <main className="flex-1">
        <Suspense fallback={<Cargando texto="Cargando ciudad" />}>{contenidoPantalla}</Suspense>
      </main>
    </div>
  );
}
