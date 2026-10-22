import { PUNTOS_RETO } from "../config";
import { ciudadDesbloqueada, resumenCiudad } from "../data/catalogoCiudad";
import MiniCiudad from "./ciudad/MiniCiudad";
import { Avatar, BarraProgreso, VentanaAero } from "./ui";

// P-01 Inicio (CDU-1 paso 1; entrada a CDU-2, CDU-10 y CDU-12) y P-14 Inicio sin ciudad (CDU-10 E1)
export default function Inicio({ alumno, temas, amigos, onTema, onReto, onCiudad, onAmigos }) {
  const totalLecciones = temas.reduce((a, t) => a + t.lecciones.length, 0);
  const completadas = Object.values(alumno.progreso).filter((p) => p.completada).length;
  const reto = alumno.retoHoy;
  const conCiudad = ciudadDesbloqueada(alumno);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <VentanaAero titulo="Bienvenido · Introducción a la Ingeniería de Software" controles agua cuerpoClassName="px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="text-sm text-sky-100" style={{ textShadow: "0 1px 2px rgba(0,30,80,.6)" }}>Hola de nuevo,</p>
          <h1 className="font-display font-light text-4xl sm:text-5xl text-white" style={{ textShadow: "0 2px 6px rgba(0,30,80,.65)" }}>{alumno.nombre}</h1>
          <p className="text-sky-100 text-sm mt-1" style={{ textShadow: "0 1px 2px rgba(0,30,80,.6)" }}>Aprende, gana puntos y construye tu ciudad.</p>
        </div>
        <div className="flex gap-3">
          <Pill etiqueta="Puntos" valor={`${alumno.puntos}`} color="#0a6fb5" />
          <Pill etiqueta="Lecciones" valor={`${completadas}/${totalLecciones}`} color="#1c7f43" />
          <Pill etiqueta="Evaluaciones" valor={`${new Set(alumno.intentos.map((i) => i.temaId)).size}/${temas.length}`} color="#5b48c4" />
        </div>
      </VentanaAero>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {/* CDU-1 paso 1: lista de temas disponibles (RF-NAV-01) */}
          <section className="space-y-4">
            <Titulo color="#1a8fd6">Temas disponibles</Titulo>
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
                    style={{ borderColor: `${t.color}55` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="icono-gel w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ "--c": t.color }}
                        >
                          {t.icono}
                        </div>
                        <p className="font-display font-semibold text-base text-foreground leading-tight">{t.nombre}</p>
                      </div>
                      <span className="text-xs font-bold shrink-0" style={{ color: t.color }}>{pct}%</span>
                    </div>
                    <p className="text-xs text-secondary-foreground leading-relaxed">{t.descripcion}</p>
                    <BarraProgreso valor={pct} color={t.color} />
                    <div className="flex justify-between text-xs text-muted-foreground">
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
          <VentanaAero titulo="Reto del día" controles cuerpoClassName="p-5 space-y-4">
            <div className="text-4xl">{reto?.completado ? "🏆" : "⚡"}</div>
            {reto?.completado ? (
              <>
                <p className="font-display font-semibold text-lg text-foreground">¡Reto de hoy completado!</p>
                <p className="text-sm text-secondary-foreground">
                  {reto.recompensaAsignada ? `Ganaste +${reto.recompensa} puntos. Vuelve mañana por un reto nuevo.` : "Tu recompensa está pendiente de asignar."}
                </p>
                {!reto.recompensaAsignada && (
                  <button onClick={onReto} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold">
                    Ver recompensa →
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="font-display font-semibold text-lg text-foreground">Trivia rápida</p>
                <p className="text-sm text-secondary-foreground">Responde todas las preguntas del reto. Ganas puntos por cada respuesta correcta.</p>
                <p className="text-sm font-semibold text-primary">hasta +{PUNTOS_RETO} puntos</p>
                <button onClick={onReto} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold">
                  Ir al reto →
                </button>
              </>
            )}
          </VentanaAero>

          {/* CDU-12 paso 1: entrada a la sección de amigos */}
          <VentanaAero titulo="Amigos" controles cuerpoClassName="p-5 space-y-4">
            <p className="text-sm text-secondary-foreground">Visita la ciudad de tus amigos.</p>
            <div className="flex gap-2">
              {amigos.map((a) => <Avatar key={a.id} nombre={a.nombre} tamano="w-10 h-10 text-base" />)}
            </div>
            <button onClick={onAmigos} className="w-full py-2.5 rounded-lg border border-border text-foreground font-display font-bold">
              Ver amigos →
            </button>
          </VentanaAero>
        </div>
      </div>
    </div>
  );
}

function TarjetaCiudad({ lotes, onCiudad }) {
  const { ocupados, libres } = resumenCiudad(lotes);
  return (
    <VentanaAero titulo="Mi ciudad" controles cuerpoClassName="p-5 flex flex-col sm:flex-row gap-5 sm:items-center">
      <div className="sm:w-64 shrink-0 rounded-lg border border-border bg-white/60 p-2 shadow-inner">
        <MiniCiudad lotes={lotes} className="w-full h-36" />
      </div>
      <div className="space-y-3">
        <p className="font-display font-semibold text-xl text-foreground">Tu ciudad</p>
        <p className="text-sm text-secondary-foreground">
          {ocupados === 0 ? "Ya desbloqueaste tu ciudad. Compra tu primer edificio con tus puntos." : "Coloca edificios nuevos con tus puntos o mueve los que ya tienes."}
        </p>
        <p className="text-xs text-muted-foreground">
          {ocupados} edificio{ocupados === 1 ? "" : "s"} colocado{ocupados === 1 ? "" : "s"} · {libres} lote{libres === 1 ? "" : "s"} libre{libres === 1 ? "" : "s"}
        </p>
        <button onClick={onCiudad} className="px-5 py-2.5 rounded-lg bg-aero-green text-primary-foreground font-display font-bold">
          Entrar a mi ciudad →
        </button>
      </div>
    </VentanaAero>
  );
}

function Titulo({ color, children }) {
  return (
    <h2 className="font-display font-semibold text-xl text-foreground flex items-center gap-2">
      <span className="gema-aero" style={{ "--c": color }} aria-hidden="true" /> {children}
    </h2>
  );
}

function Pill({ etiqueta, valor, color }) {
  return (
    <div className="pastilla-aero text-center px-3 sm:px-4 py-2">
      <p className="font-display font-bold text-xl" style={{ color }}>{valor}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground">{etiqueta}</p>
    </div>
  );
}
