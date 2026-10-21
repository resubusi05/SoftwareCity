import { useCallback, useEffect, useState } from "react";
import { alumnoRepo, contenido, mensajeError } from "../data/repositorio";
import { BarraProgreso, Boton, Cargando, PanelError } from "./ui";

// pendiente: { progreso, despues: "salir" | "completar", error }

// CDU-1 Estudiar tema: pasos 3–5, 9–10; A1 (salir); E1 (error al cargar); E3 (error al guardar)
export default function LeccionView({ leccionId, color, progreso, onGuardado, onVolver }) {
  const [leccion, setLeccion] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const [seccion, setSeccion] = useState(progreso && !progreso.completada ? progreso.seccion : 0);
  const [guardando, setGuardando] = useState(false);
  const [pendiente, setPendiente] = useState(null);
  const [terminada, setTerminada] = useState(false);

  const cargar = useCallback(async () => {
    setErrorCarga(null);
    setLeccion(null);
    try {
      setLeccion(await contenido.cargarLeccion(leccionId));
    } catch (e) {
      setErrorCarga(mensajeError(e));
    }
  }, [leccionId]);

  useEffect(() => { cargar(); }, [cargar]);

  const guardar = async (p, despues) => {
    setGuardando(true);
    try {
      await alumnoRepo.guardarProgreso(p);
      onGuardado(p);
      setPendiente(null);
      if (despues === "salir") onVolver();
      else setTerminada(true);
    } catch (e) {
      // E3: se conserva la información en memoria para reintentar
      setPendiente({ progreso: p, despues, error: mensajeError(e) });
    } finally {
      setGuardando(false);
    }
  };

  if (errorCarga) {
    return (
      <Contenedor>
        <PanelError
          titulo="No se pudo cargar la lección"
          mensaje="Ocurrió un error al cargar el contenido de la lección."
          detalle={errorCarga}
          acciones={[
            { texto: "Reintentar", onClick: cargar, primaria: true },
            { texto: "Volver al listado", onClick: onVolver },
          ]}
        />
      </Contenedor>
    );
  }
  if (!leccion) return <Cargando texto="Cargando lección" />;

  const total = leccion.secciones.length;
  const ultima = seccion === total - 1;
  const base = (completada) => ({
    leccionId: leccion.id,
    temaId: leccion.temaId,
    seccion,
    completada: completada || !!progreso?.completada,
    actualizado: Date.now(),
  });

  if (pendiente) {
    return (
      <Contenedor>
        <PanelError
          titulo="No se pudo guardar tu progreso"
          mensaje="Tu avance se conserva en esta sesión. Intenta registrarlo de nuevo."
          detalle={pendiente.error}
          acciones={[
            { texto: guardando ? "Guardando..." : "Reintentar", onClick: () => guardar(pendiente.progreso, pendiente.despues), primaria: true, deshabilitada: guardando },
            { texto: "Seguir en la lección", onClick: () => setPendiente(null) },
          ]}
        />
      </Contenedor>
    );
  }

  if (terminada) {
    return (
      <Contenedor>
        <div className="rounded-xl border bg-card p-8 text-center space-y-4 neon-glow-green" style={{ borderColor: "#00ff8866" }}>
          <div className="text-6xl animate-float">🎉</div>
          <h2 className="font-display font-bold text-3xl text-foreground">¡Lección completada!</h2>
          <p className="text-secondary-foreground">{leccion.titulo}</p>
          <p className="font-mono text-xs text-neon-green">Tu progreso quedó registrado</p>
          <Boton texto="Volver a las lecciones" onClick={onVolver} primaria color={color} />
        </div>
      </Contenedor>
    );
  }

  const s = leccion.secciones[seccion];
  return (
    <Contenedor>
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => guardar(base(false), "salir")}
          disabled={guardando}
          className="text-muted-foreground hover:text-foreground font-mono text-sm disabled:opacity-40"
        >
          ✕ Salir de la lección
        </button>
        <span className="font-mono text-xs text-muted-foreground">Sección {seccion + 1} de {total}</span>
      </div>
      <BarraProgreso valor={((seccion + 1) / total) * 100} color={color} />

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5">
        <p className="font-mono text-xs tracking-widest uppercase" style={{ color }}>{leccion.titulo}</p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">{s.titulo}</h1>
        {s.parrafos.map((p, i) => (
          <p key={i} className="text-secondary-foreground leading-relaxed">{p}</p>
        ))}
      </div>

      <div className="flex justify-between gap-3">
        <Boton texto="← Anterior" onClick={() => setSeccion((x) => x - 1)} deshabilitada={seccion === 0 || guardando} />
        {ultima ? (
          <Boton texto={guardando ? "Guardando..." : "Terminar lección ✓"} onClick={() => guardar(base(true), "completar")} primaria color={color} deshabilitada={guardando} />
        ) : (
          <Boton texto="Siguiente →" onClick={() => setSeccion((x) => x + 1)} primaria color={color} />
        )}
      </div>
    </Contenedor>
  );
}

function Contenedor({ children }) {
  return <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">{children}</div>;
}
