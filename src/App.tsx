import { useCallback, useEffect, useState } from "react";
import Nav from "./components/Nav";
import Inicio from "./components/Inicio";
import TemaView from "./components/TemaView";
import LeccionView from "./components/LeccionView";
import RetoView from "./components/RetoView";
import EvaluacionView from "./components/EvaluacionView";
import { Cargando, PanelError } from "./components/ui";
import { alumnoRepo, contenido, mensajeError } from "./data/repositorio";
import { ALUMNO_NOMBRE } from "./config";
import type { EstadoAlumno, Pantalla, TemaResumen } from "./types";

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>({ nombre: "inicio" });
  const [alumno, setAlumno] = useState<EstadoAlumno | null>(null);
  const [temas, setTemas] = useState<TemaResumen[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const [a, t] = await Promise.all([alumnoRepo.cargarAlumno(), contenido.cargarTemas()]);
      setAlumno(a);
      setTemas(t);
    } catch (e) {
      setError(mensajeError(e));
    }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const actualizar = (f: (a: EstadoAlumno) => EstadoAlumno) => setAlumno((a) => (a ? f(a) : a));
  const irInicio = () => setPantalla({ nombre: "inicio" });
  const tema = (id: string) => temas?.find((t) => t.id === id);

  let contenidoPantalla;
  if (error) {
    contenidoPantalla = (
      <div className="max-w-xl mx-auto px-4 py-10">
        <PanelError titulo="No se pudo cargar la información" mensaje="Ocurrió un error al cargar los temas o tu progreso." detalle={error}
          acciones={[{ texto: "Reintentar", onClick: cargar, primaria: true }]} />
      </div>
    );
  } else if (!alumno || !temas) {
    contenidoPantalla = <Cargando />;
  } else if (pantalla.nombre === "tema" && tema(pantalla.temaId)) {
    const t = tema(pantalla.temaId)!;
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
        onPuntos={(puntos) => actualizar((a) => ({ ...a, puntos }))}
        onVolver={irInicio} />
    );
  } else {
    contenidoPantalla = (
      <Inicio alumno={alumno} temas={temas}
        onTema={(temaId) => setPantalla({ nombre: "tema", temaId })}
        onReto={() => setPantalla({ nombre: "reto" })} />
    );
  }

  return (
    <div className="min-h-full bg-background grid-bg flex flex-col">
      <Nav nombre={alumno?.nombre ?? ALUMNO_NOMBRE} puntos={alumno?.puntos ?? 0} onInicio={irInicio} />
      <main className="flex-1">{contenidoPantalla}</main>
    </div>
  );
}
