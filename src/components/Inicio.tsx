import type { EstadoAlumno, TemaResumen } from "../types";
import { PUNTOS_RETO } from "../config";
import { BarraProgreso } from "./ui";

type Props = {
  alumno: EstadoAlumno;
  temas: TemaResumen[];
  onTema: (temaId: string) => void;
  onReto: () => void;
};

export default function Inicio({ alumno, temas, onTema, onReto }: Props) {
  const totalLecciones = temas.reduce((a, t) => a + t.lecciones.length, 0);
  const completadas = Object.values(alumno.progreso).filter((p) => p.completada).length;
  const reto = alumno.retoHoy;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="relative rounded-xl overflow-hidden border border-border bg-card">
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg, #00d4ff22 0%, #7c3aed22 50%, #00ff8822 100%)" }} />
        <div className="relative px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-mono text-xs text-primary mb-1 tracking-widest uppercase">Bienvenido</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-wide">{alumno.nombre}</h1>
            <p className="text-secondary-foreground text-sm mt-1">Introducción a la Ingeniería de Software</p>
          </div>
          <div className="flex gap-3">
            <Pill etiqueta="Puntos" valor={`${alumno.puntos}`} color="#00d4ff" />
            <Pill etiqueta="Lecciones" valor={`${completadas}/${totalLecciones}`} color="#00ff88" />
            <Pill etiqueta="Evaluaciones" valor={`${new Set(alumno.intentos.map((i) => i.temaId)).size}/${temas.length}`} color="#7c3aed" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CDU-1 paso 1: lista de temas disponibles (RF-NAV-01) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-bold text-xl text-foreground tracking-wide flex items-center gap-2">
            <span className="text-primary">◆</span> TEMAS DISPONIBLES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {temas.map((t) => {
              const hechas = t.lecciones.filter((l) => alumno.progreso[l.id]?.completada).length;
              const pct = t.lecciones.length ? Math.round((hechas / t.lecciones.length) * 100) : 0;
              const evaluado = alumno.intentos.some((i) => i.temaId === t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => onTema(t.id)}
                  className="w-full text-left rounded-xl border bg-card p-5 space-y-3 card-hover cursor-pointer"
                  style={{ borderColor: `${t.color}30` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-xl border shrink-0"
                        style={{ background: `${t.color}18`, borderColor: `${t.color}40`, boxShadow: `0 0 12px ${t.color}30` }}
                      >
                        {t.icono}
                      </div>
                      <p className="font-display font-bold text-base text-foreground leading-tight">{t.nombre}</p>
                    </div>
                    <span className="font-mono text-xs font-bold shrink-0" style={{ color: t.color }}>{pct}%</span>
                  </div>
                  <p className="text-xs text-secondary-foreground leading-relaxed">{t.descripcion}</p>
                  <BarraProgreso valor={pct} color={t.color} />
                  <div className="flex justify-between text-xs font-mono text-muted-foreground">
                    <span>{hechas}/{t.lecciones.length} lecciones</span>
                    <span>{evaluado ? "✓ Evaluación hecha" : "Evaluación pendiente"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CDU-2: acceso al reto del día */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-foreground tracking-wide flex items-center gap-2">
            <span className="text-accent">◆</span> RETO DEL DÍA
          </h2>
          <div className="rounded-xl border border-primary/30 bg-card p-5 neon-glow space-y-4">
            <div className="text-4xl">{reto?.completado ? "🏆" : "⚡"}</div>
            {reto?.completado ? (
              <>
                <p className="font-display font-bold text-lg text-foreground">¡Reto de hoy completado!</p>
                <p className="text-sm text-secondary-foreground">
                  {reto.recompensaAsignada ? `Ganaste +${reto.recompensa} puntos. Vuelve mañana por un reto nuevo.` : "Tu recompensa está pendiente de asignar."}
                </p>
                {!reto.recompensaAsignada && (
                  <button onClick={onReto} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:brightness-110">
                    Ver recompensa →
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="font-display font-bold text-lg text-foreground">Trivia rápida</p>
                <p className="text-sm text-secondary-foreground">Responde todas las preguntas del reto y gana puntos. No importa si te equivocas.</p>
                <p className="font-mono text-sm text-primary">+{PUNTOS_RETO} puntos</p>
                <button onClick={onReto} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:brightness-110">
                  Ir al reto →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ etiqueta, valor, color }: { etiqueta: string; valor: string; color: string }) {
  return (
    <div className="text-center px-3 sm:px-4 py-2 rounded-lg bg-muted border border-border">
      <p className="font-display font-bold text-xl" style={{ color }}>{valor}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider">{etiqueta}</p>
    </div>
  );
}
