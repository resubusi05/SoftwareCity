import { Volver } from "./ui";

// CDU-1 paso 2: lecciones del tema seleccionado (RF-NAV-02) + acceso a la evaluación (CDU-3)
export default function TemaView({ tema, alumno, onLeccion, onEvaluacion, onVolver }) {
  const intentos = alumno.intentos.filter((i) => i.temaId === tema.id);
  const ultimo = intentos[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Volver texto="← Temas" onClick={onVolver} />

      <div className="flex items-center gap-4">
        <div
          className="icono-gel w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ "--c": tema.color }}
        >
          {tema.icono}
        </div>
        <div>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-foreground">{tema.nombre}</h1>
          <p className="text-sm text-secondary-foreground">{tema.descripcion}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <span className="gema-aero" style={{ "--c": tema.color }} aria-hidden="true" /> Lecciones
        </h2>
        {tema.lecciones.map((l, i) => {
          const p = alumno.progreso[l.id];
          const estado = p?.completada ? "completada" : p ? "en-curso" : "nueva";
          return (
            <button
              key={l.id}
              onClick={() => onLeccion(l.id)}
              className="w-full text-left flex items-center gap-4 px-4 py-4 rounded-xl border bg-card card-hover"
              style={{ borderColor: estado === "completada" ? `${tema.color}50` : undefined }}
            >
              <span
                className="icono-gel w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold shrink-0"
                style={{ "--c": tema.color, color: tema.color }}
              >
                {estado === "completada" ? "✓" : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-base text-foreground">{l.titulo}</p>
                <p className="text-xs text-secondary-foreground">{l.resumen}</p>
              </div>
              <span className="font-mono text-xs shrink-0" style={{ color: estado === "nueva" ? undefined : tema.color }}>
                {estado === "completada" ? "Completada" : estado === "en-curso" ? `Sección ${p.seccion + 1}/${l.numSecciones}` : "Nueva"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-3" style={{ borderColor: `${tema.color}40` }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">📝 Evaluación del tema</h2>
            <p className="text-xs text-secondary-foreground">{tema.numPreguntasEvaluacion} preguntas de opción múltiple</p>
          </div>
          {ultimo && (
            <div className="text-right">
              <p className="font-display font-bold text-xl" style={{ color: tema.color }}>{ultimo.aciertos}/{ultimo.total}</p>
              <p className="font-mono text-[10px] text-muted-foreground">Último resultado · {intentos.length} intento{intentos.length === 1 ? "" : "s"}</p>
            </div>
          )}
        </div>
        <button
          onClick={onEvaluacion}
          className="btn-aero w-full py-3 font-display font-bold hover:brightness-110 transition-all"
          style={{ "--btn": tema.color }}
        >
          {ultimo ? "Realizar de nuevo" : "Realizar evaluación"} →
        </button>
      </div>
    </div>
  );
}
