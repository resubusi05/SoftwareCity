import { PUNTOS_RETO } from "../config";
import { ciudadDesbloqueada, resumenCiudad } from "../data/catalogoCiudad";
import MiniCiudad from "./ciudad/MiniCiudad";
import { Avatar, BarraProgreso } from "./ui";

// P-01 Inicio (CDU-1 paso 1; entrada a CDU-2, CDU-10 y CDU-12) y P-14 Inicio sin ciudad (CDU-10 E1)
export default function Inicio({ alumno, temas, amigos, onTema, onReto, onCiudad, onAmigos }) {
  const totalLecciones = temas.reduce((a, t) => a + t.lecciones.length, 0);
  const completadas = Object.values(alumno.progreso).filter((p) => p.completada).length;
  const reto = alumno.retoHoy;
  const conCiudad = ciudadDesbloqueada(alumno);

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
        <div className="lg:col-span-2 space-y-8">
          {/* CDU-1 paso 1: lista de temas disponibles (RF-NAV-01) */}
          <section className="space-y-4">
            <Titulo color="text-primary">TEMAS DISPONIBLES</Titulo>
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
          </section>

          {/* CDU-10 paso 1. E1: si no tiene el puntaje, el apartado no se muestra (P-14) */}
          {conCiudad && <TarjetaCiudad lotes={alumno.lotes} onCiudad={onCiudad} />}
        </div>

        <div className="space-y-8">
          {/* CDU-2: acceso al reto del día */}
          <section className="space-y-4">
            <Titulo color="text-accent">RETO DEL DÍA</Titulo>
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
                  <p className="text-sm text-secondary-foreground">Responde todas las preguntas del reto. Ganas puntos por cada respuesta correcta.</p>
                  <p className="font-mono text-sm text-primary">hasta +{PUNTOS_RETO} puntos</p>
                  <button onClick={onReto} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:brightness-110">
                    Ir al reto →
                  </button>
                </>
              )}
            </div>
          </section>

          {/* CDU-12 paso 1: entrada a la sección de amigos */}
          <section className="space-y-4">
            <Titulo color="text-neon-green">AMIGOS</Titulo>
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-sm text-secondary-foreground">Visita la ciudad de tus amigos.</p>
              <div className="flex gap-2">
                {amigos.map((a) => <Avatar key={a.id} nombre={a.nombre} tamano="w-10 h-10 text-base" />)}
              </div>
              <button onClick={onAmigos} className="w-full py-2.5 rounded-lg border border-border text-foreground font-display font-bold hover:bg-muted transition-colors">
                Ver amigos →
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function TarjetaCiudad({ lotes, onCiudad }) {
  const { ocupados, libres } = resumenCiudad(lotes);
  return (
    <section className="space-y-4">
      <Titulo color="text-neon-green">MI CIUDAD</Titulo>
      <div className="rounded-xl border border-neon-green/30 bg-card p-5 flex flex-col sm:flex-row gap-5 sm:items-center">
        <div className="sm:w-64 shrink-0 rounded-lg border border-dashed border-border bg-background/40 p-2">
          <MiniCiudad lotes={lotes} className="w-full h-36" />
        </div>
        <div className="space-y-3">
          <p className="font-display font-bold text-xl text-foreground">Tu ciudad</p>
          <p className="text-sm text-secondary-foreground">
            {ocupados === 0 ? "Ya desbloqueaste tu ciudad. Compra tu primer edificio con tus puntos." : "Coloca edificios nuevos con tus puntos o mueve los que ya tienes."}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {ocupados} edificio{ocupados === 1 ? "" : "s"} colocado{ocupados === 1 ? "" : "s"} · {libres} lote{libres === 1 ? "" : "s"} libre{libres === 1 ? "" : "s"}
          </p>
          <button onClick={onCiudad} className="px-5 py-2.5 rounded-lg bg-neon-green text-primary-foreground font-display font-bold hover:brightness-110 neon-glow-green">
            Entrar a mi ciudad →
          </button>
        </div>
      </div>
    </section>
  );
}

function Titulo({ color, children }) {
  return (
    <h2 className="font-display font-bold text-xl text-foreground tracking-wide flex items-center gap-2">
      <span className={color}>◆</span> {children}
    </h2>
  );
}

function Pill({ etiqueta, valor, color }) {
  return (
    <div className="text-center px-3 sm:px-4 py-2 rounded-lg bg-muted border border-border">
      <p className="font-display font-bold text-xl" style={{ color }}>{valor}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider">{etiqueta}</p>
    </div>
  );
}
