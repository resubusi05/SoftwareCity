import { useCallback, useEffect, useState } from "react";
import { alumnoRepo, contenido, ErrorConexion, mensajeError } from "../data/repositorio";
import { BarraProgreso, Boton, Cargando, Modal, PanelError, Volver } from "./ui";

// Fases: "info" | "respondiendo" | "resumen" | "resultado"

// CDU-3 Realizar evaluación del tema
export default function EvaluacionView({ temaId, intentosPrevios, onIntento, onVolver }) {
  const [ev, setEv] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const [fase, setFase] = useState("info");
  const [respuestas, setRespuestas] = useState([]);
  const [actual, setActual] = useState(0);
  const [confirmarSalida, setConfirmarSalida] = useState(false);
  const [avisoPendientes, setAvisoPendientes] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null) // { tipo: "conexion" | "registro", mensaje };
  const [resultado, setResultado] = useState(null);

  // RF-EV-01 / E1
  const cargar = useCallback(async () => {
    setErrorCarga(null);
    setEv(null);
    try {
      const e = await contenido.cargarEvaluacion(temaId);
      setEv(e);
      setRespuestas(e.preguntas.map(() => null));
    } catch (err) {
      setErrorCarga(mensajeError(err));
    }
  }, [temaId]);
  useEffect(() => { cargar(); }, [cargar]);

  if (errorCarga) {
    return (
      <Contenedor>
        <PanelError
          titulo="No se pudo cargar la evaluación"
          mensaje="Ocurrió un error al cargar la evaluación de este tema."
          detalle={errorCarga}
          acciones={[{ texto: "Reintentar", onClick: cargar, primaria: true }, { texto: "Regresar al tema", onClick: onVolver }]}
        />
      </Contenedor>
    );
  }
  if (!ev) return <Cargando texto="Cargando evaluación" />;

  const { tema, preguntas } = ev;
  const color = tema.color;
  const total = preguntas.length;
  const pendientes = respuestas.map((r, i) => (r === null ? i : -1)).filter((i) => i >= 0);
  const preguntaValida = (i) => preguntas[i].opciones.length >= 2; // E2

  // RF-EV-06 (E3 conexión / E4 registro)
  const enviar = async () => {
    if (pendientes.length > 0) { setAvisoPendientes(true); return; } // A1
    if (preguntas.some((_, i) => !preguntaValida(i))) return; // E2: no se envía incompleta
    const aciertos = preguntas.reduce((a, p, i) => a + (respuestas[i] === p.correcta ? 1 : 0), 0);
    const intento = { temaId: tema.id, respuestas: [...respuestas], aciertos, total, fecha: Date.now() };
    setEnviando(true);
    setErrorEnvio(null);
    try {
      await alumnoRepo.registrarIntento(intento);
      onIntento(intento);
      setResultado(intento);
      setFase("resultado");
    } catch (e) {
      setErrorEnvio(e instanceof ErrorConexion
        ? { tipo: "conexion", mensaje: e.message }
        : { tipo: "registro", mensaje: mensajeError(e) });
    } finally {
      setEnviando(false);
    }
  };

  const modalSalida = (
    <Modal abierto={confirmarSalida}>
      <div className="text-4xl">🚪</div>
      <h2 className="font-display font-bold text-xl text-foreground">¿Abandonar la evaluación?</h2>
      <p className="text-sm text-secondary-foreground">Tus respuestas no se guardarán y la evaluación no quedará como completada.</p>
      <div className="flex gap-3 justify-center">
        <Boton texto="Seguir respondiendo" onClick={() => setConfirmarSalida(false)} />
        <Boton texto="Sí, salir" onClick={onVolver} primaria color="#ff6b35" />
      </div>
    </Modal>
  );

  if (fase === "info") {
    const ultimo = intentosPrevios[0];
    return (
      <Contenedor>
        <Volver texto="← Regresar al tema" onClick={onVolver} />
        <div className="rounded-xl border bg-card p-6 sm:p-8 space-y-5" style={{ borderColor: `${color}50` }}>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color }}>📝 Evaluación del tema</p>
          <h1 className="font-display font-bold text-3xl text-foreground">{tema.nombre}</h1>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted border border-border p-3">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Preguntas</p>
              <p className="font-display font-bold text-2xl text-foreground">{total}</p>
            </div>
            <div className="rounded-lg bg-muted border border-border p-3">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Intentos anteriores</p>
              <p className="font-display font-bold text-2xl text-foreground">
                {intentosPrevios.length}{ultimo && <span className="text-sm font-mono text-muted-foreground"> · último {ultimo.aciertos}/{ultimo.total}</span>}
              </p>
            </div>
          </div>
          <p className="text-sm text-secondary-foreground">Responde todas las preguntas. Podrás revisar tus respuestas antes de enviarlas.</p>
          <Boton texto="Iniciar evaluación →" onClick={() => setFase("respondiendo")} primaria color={color} />
        </div>
      </Contenedor>
    );
  }

  if (fase === "resultado" && resultado) {
    const pct = Math.round((resultado.aciertos / resultado.total) * 100);
    return (
      <Contenedor>
        <div className="rounded-xl border bg-card p-8 text-center space-y-4 neon-glow" style={{ borderColor: `${color}60` }}>
          <div className="text-6xl animate-float">{pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📚"}</div>
          <h2 className="font-display font-bold text-2xl text-foreground">Resultado de la evaluación</h2>
          <p className="font-display font-bold text-6xl" style={{ color }}>{resultado.aciertos}/{resultado.total}</p>
          <p className="text-secondary-foreground">respuestas correctas</p>
          <p className="font-mono text-xs text-neon-green">Tu intento quedó registrado</p>
          <div className="flex gap-3 justify-center">
            <Boton texto="Regresar al tema" onClick={onVolver} primaria color={color} />
          </div>
        </div>
      </Contenedor>
    );
  }

  if (fase === "resumen") {
    return (
      <Contenedor>
        {modalSalida}
        <div className="flex justify-between items-center">
          <button onClick={() => setConfirmarSalida(true)} className="text-muted-foreground hover:text-foreground font-mono text-sm">✕ Salir</button>
          <span className="font-mono text-xs text-muted-foreground">Resumen del intento</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-display font-bold text-2xl text-foreground">Revisa antes de enviar</h2>
          <p className="text-sm text-secondary-foreground">{total - pendientes.length} de {total} preguntas respondidas.</p>
          {avisoPendientes && pendientes.length > 0 && (
            <div className="rounded-lg border border-neon-orange/40 bg-neon-orange/10 p-3 text-sm text-foreground">
              No puedes enviar la evaluación: faltan por responder las preguntas {pendientes.map((i) => i + 1).join(", ")}.
            </div>
          )}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {preguntas.map((_, i) => {
              const falta = respuestas[i] === null;
              return (
                <button key={i} onClick={() => { setActual(i); setFase("respondiendo"); }}
                  className="h-10 rounded-lg font-mono text-sm font-bold border transition-all hover:brightness-125"
                  style={falta
                    ? { borderColor: avisoPendientes ? "#ff6b35" : "var(--color-border)", color: avisoPendientes ? "#ff6b35" : "var(--color-muted-foreground)" }
                    : { borderColor: `${color}80`, background: `${color}20`, color }}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          {errorEnvio && (
            <PanelError
              titulo={errorEnvio.tipo === "conexion" ? "No se pudieron enviar tus respuestas" : "No se pudo guardar el resultado"}
              mensaje={errorEnvio.tipo === "conexion"
                ? "Tus respuestas se conservan. Intenta enviarlas de nuevo cuando se restablezca la conexión."
                : "La evaluación no se marcó como completada. Tus respuestas se conservan; intenta registrarla de nuevo."}
              detalle={errorEnvio.mensaje}
              acciones={[{ texto: enviando ? "Enviando..." : "Reintentar envío", onClick: enviar, primaria: true, deshabilitada: enviando }]}
            />
          )}
          {!errorEnvio && (
            <div className="flex gap-3 justify-end">
              <Boton texto="← Volver a las preguntas" onClick={() => setFase("respondiendo")} />
              <Boton texto={enviando ? "Enviando..." : "Enviar evaluación ✓"} onClick={enviar} primaria color={color} deshabilitada={enviando} />
            </div>
          )}
        </div>
      </Contenedor>
    );
  }

  // Fase respondiendo (RF-EV-02, RF-EV-03)
  const p = preguntas[actual];
  const ultima = actual === total - 1;
  return (
    <Contenedor>
      {modalSalida}
      <div className="flex justify-between items-center">
        <button onClick={() => setConfirmarSalida(true)} className="text-muted-foreground hover:text-foreground font-mono text-sm">✕ Salir</button>
        <span className="font-mono text-xs text-muted-foreground">Pregunta {actual + 1} de {total}</span>
      </div>
      <BarraProgreso valor={((total - pendientes.length) / total) * 100} color={color} />

      <div className="flex gap-1.5 justify-center">
        {preguntas.map((_, i) => (
          <button key={i} onClick={() => setActual(i)} title={`Pregunta ${i + 1}`}
            className="w-3 h-3 rounded-full transition-all"
            style={{ background: i === actual ? color : respuestas[i] !== null ? `${color}80` : "var(--color-muted)", outline: i === actual ? `2px solid ${color}50` : undefined }} />
        ))}
      </div>

      {!preguntaValida(actual) ? (
        <PanelError
          titulo="Pregunta no disponible"
          mensaje="Esta pregunta no se puede mostrar temporalmente. La evaluación no se puede enviar incompleta."
          acciones={[{ texto: "Reintentar carga", onClick: cargar, primaria: true }]}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-xl text-foreground leading-snug">{p.texto}</h2>
          <div className="space-y-2.5">
            {p.opciones.map((op, i) => {
              const sel = respuestas[actual] === i;
              return (
                <button key={i}
                  onClick={() => setRespuestas((r) => r.map((x, j) => (j === actual ? i : x)))}
                  className="trivia-option w-full text-left px-4 py-3 rounded-lg border bg-muted/50 text-sm text-foreground flex items-center gap-3"
                  style={sel ? { borderColor: color, background: `${color}20`, boxShadow: `0 0 12px ${color}30` } : { borderColor: "var(--color-border)" }}>
                  <span className="w-6 h-6 rounded shrink-0 flex items-center justify-center font-mono text-xs font-bold border"
                    style={{ borderColor: sel ? color : "rgba(255,255,255,0.15)", color: sel ? color : undefined }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {op}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Boton texto="← Anterior" onClick={() => setActual((x) => x - 1)} deshabilitada={actual === 0} />
        {ultima ? (
          <Boton texto="Ver resumen →" onClick={() => setFase("resumen")} primaria color={color} />
        ) : (
          <Boton texto="Siguiente →" onClick={() => setActual((x) => x + 1)} primaria color={color} />
        )}
      </div>
    </Contenedor>
  );
}

function Contenedor({ children }) {
  return <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">{children}</div>;
}
