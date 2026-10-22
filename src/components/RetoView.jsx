import { useCallback, useEffect, useState } from "react";
import { alumnoRepo, borradorReto, contenido, ErrorConexion, ErrorRetoYaCompletado, mensajeError } from "../data/repositorio";
import { calcularRecompensa } from "../config";
import { BarraProgreso, Boton, Cargando, PanelError, Volver } from "./ui";

// Fases: "info" | "jugando" | "completado"

// CDU-2 Completar reto del día (P-05 a P-08)
export default function RetoView({ retoHoy, onRegistro, onPuntos, onVolver }) {
  const [reto, setReto] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const [fase, setFase] = useState(retoHoy?.completado ? "completado" : "info");
  const [respuestas, setRespuestas] = useState([]);
  const [actual, setActual] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [enLinea, setEnLinea] = useState(navigator.onLine);
  const [registrando, setRegistrando] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState(null);
  const [yaCompletado, setYaCompletado] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [errorRecompensa, setErrorRecompensa] = useState(null);
  const [recienGanados, setRecienGanados] = useState(null);

  // RF-RT-01 / E1: cargar el reto del día
  const cargar = useCallback(async () => {
    setErrorCarga(null);
    setReto(null);
    try {
      const r = await contenido.cargarRetoDelDia();
      setReto(r);
      const borrador = borradorReto.leer(r.fecha);
      setRespuestas(borrador);
      setActual(Math.min(borrador.length, r.preguntas.length - 1));
    } catch (e) {
      setErrorCarga(mensajeError(e));
    }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  // E2: detectar pérdida y regreso de conexión
  useEffect(() => {
    const on = () => setEnLinea(true);
    const off = () => setEnLinea(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // RF-RT-04/05 + RF-PRO-03: registrar la finalización con la recompensa proporcional a los aciertos
  const registrar = useCallback(async (resps) => {
    if (!reto) return;
    setRegistrando(true);
    setErrorRegistro(null);
    const total = reto.preguntas.length;
    const aciertos = reto.preguntas.reduce((a, p, i) => a + (resps[i] === p.correcta ? 1 : 0), 0);
    const registro = {
      fecha: reto.fecha,
      temaId: reto.tema.id,
      respuestas: resps,
      aciertos,
      total,
      completado: true,
      recompensa: calcularRecompensa(aciertos, total, reto.recompensaMaxima),
      recompensaAsignada: false,
    };
    try {
      await alumnoRepo.registrarRetoCompletado(registro);
      borradorReto.borrar(reto.fecha);
      onRegistro(registro);
      setFase("completado");
    } catch (e) {
      if (e instanceof ErrorRetoYaCompletado) setYaCompletado(true);
      else setErrorRegistro(e instanceof ErrorConexion ? `Se perdió la conexión. ${e.message}` : mensajeError(e));
    } finally {
      setRegistrando(false);
    }
  }, [reto, onRegistro]);

  // RF-RT-06: reclamar recompensa (E4 si falla)
  const reclamar = useCallback(async () => {
    const fecha = retoHoy?.fecha ?? reto?.fecha;
    if (!fecha) return;
    setAsignando(true);
    setErrorRecompensa(null);
    try {
      const res = await alumnoRepo.asignarRecompensa(fecha);
      onPuntos(res.puntos);
      if (retoHoy) onRegistro({ ...retoHoy, recompensaAsignada: true });
      if (!res.yaAsignada) setRecienGanados(retoHoy?.recompensa ?? 0);
    } catch (e) {
      setErrorRecompensa(mensajeError(e));
    } finally {
      setAsignando(false);
    }
  }, [retoHoy, reto, onPuntos, onRegistro]);

  // E2/E4: al volver la conexión, sincronizar lo pendiente
  useEffect(() => {
    if (!enLinea) return;
    if (errorRegistro && !registrando) registrar(respuestas);
    if (errorRecompensa && !asignando) reclamar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enLinea]);

  if (errorCarga) {
    return (
      <Contenedor>
        <PanelError
          titulo="Reto no disponible"
          mensaje="El reto del día no se encuentra disponible temporalmente."
          detalle={errorCarga}
          acciones={[{ texto: "Reintentar", onClick: cargar, primaria: true }, { texto: "Volver", onClick: onVolver }]}
        />
      </Contenedor>
    );
  }
  if (!reto) return <Cargando texto="Cargando reto del día" />;

  const color = reto.tema.color;
  const total = reto.preguntas.length;

  // P-08 · E1: el reto ya había sido completado
  if (yaCompletado) {
    return (
      <Contenedor>
        <PanelError
          titulo="Ya completaste el reto de hoy"
          mensaje="No se otorga una segunda recompensa. Vuelve mañana por un reto nuevo."
          acciones={[{ texto: "Volver al inicio", onClick: onVolver, primaria: true }]}
        />
      </Contenedor>
    );
  }

  // P-07 · pasos 6 a 10
  if (fase === "completado") {
    const registro = retoHoy;
    const asignada = registro?.recompensaAsignada;
    const correctas = registro?.total ? (
      <p className="font-mono text-xs text-muted-foreground">
        {registro.aciertos} de {registro.total} correctas · máximo +{reto.recompensaMaxima} puntos
      </p>
    ) : null;
    return (
      <Contenedor>
        <div className="rounded-xl border border-primary/40 bg-card p-8 text-center space-y-4 aero-glow">
          <div className="text-6xl animate-float">🏆</div>
          <h2 className="font-display font-bold text-3xl text-foreground">¡Reto del día completado!</h2>
          {recienGanados !== null ? (
            <>
              <p className="font-display font-bold text-4xl text-aero-green">+{recienGanados} puntos</p>
              {correctas}
              <p className="text-sm text-secondary-foreground">La recompensa se registró en tu perfil.</p>
              <Boton texto="Volver al inicio" onClick={onVolver} primaria />
            </>
          ) : asignada ? (
            <>
              <p className="text-secondary-foreground">Ya reclamaste tu recompensa de +{registro?.recompensa} puntos.</p>
              <p className="text-sm text-muted-foreground">Vuelve mañana por un reto nuevo.</p>
              <Boton texto="Volver al inicio" onClick={onVolver} primaria />
            </>
          ) : (
            <>
              <p className="text-secondary-foreground">Recompensa obtenida:</p>
              <p className="font-display font-bold text-4xl text-primary">+{registro?.recompensa ?? 0} puntos</p>
              {correctas}
              {errorRecompensa && (
                <div className="rounded-lg border border-aero-orange/40 bg-aero-orange/10 p-3 text-sm text-foreground space-y-1">
                  <p className="font-semibold">Tu reto quedó completado, pero la recompensa está pendiente de asignar.</p>
                  <p className="font-mono text-xs text-aero-orange">{errorRecompensa}</p>
                  <p className="text-xs text-muted-foreground">Se reintentará automáticamente al recuperar la conexión.</p>
                </div>
              )}
              <Boton
                texto={asignando ? "Asignando..." : errorRecompensa ? "Reintentar asignación" : "Reclamar recompensa"}
                onClick={reclamar}
                primaria
                deshabilitada={asignando}
              />
            </>
          )}
        </div>
      </Contenedor>
    );
  }

  // P-05 · pasos 2 y 3, A1
  if (fase === "info") {
    const continuar = respuestas.length > 0;
    return (
      <Contenedor>
        <Volver onClick={onVolver} />
        <div className="rounded-xl border bg-card p-6 sm:p-8 space-y-5" style={{ borderColor: `${color}50` }}>
          <p className="font-mono text-xs text-primary tracking-widest uppercase">⚡ Reto del día · {reto.fecha}</p>
          <h1 className="font-display font-bold text-3xl text-foreground">Trivia rápida: {reto.tema.nombre}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Dato titulo="Descripción" texto={`Responde ${total} preguntas del tema.`} />
            <Dato titulo="Condición" texto="Contesta todas las preguntas. Ganas puntos por cada respuesta correcta." />
            <Dato titulo="Recompensa" texto={`Hasta +${reto.recompensaMaxima} puntos`} destacado />
          </div>
          {continuar && <p className="font-mono text-xs text-aero-green">Tienes un avance guardado: {respuestas.length}/{total} respondidas.</p>}
          <div className="flex gap-3">
            <Boton texto="Ahora no" onClick={onVolver} />
            <Boton texto={continuar ? "Continuar reto →" : "Iniciar reto →"} onClick={() => setFase("jugando")} primaria color={color} />
          </div>
        </div>
      </Contenedor>
    );
  }

  // P-06 · pasos 4 y 5
  const pregunta = reto.preguntas[actual];
  const respondida = elegida !== null;
  const todas = respuestas.length >= total;

  const elegir = (i) => {
    if (respondida) return;
    setElegida(i);
    const nuevas = [...respuestas];
    nuevas[actual] = i;
    setRespuestas(nuevas);
    borradorReto.guardar(reto.fecha, nuevas); // se conserva en el dispositivo
  };
  const siguiente = () => {
    setElegida(null);
    if (actual + 1 < total) setActual(actual + 1);
  };

  return (
    <Contenedor>
      {!enLinea && (
        <div className="rounded-lg border border-aero-orange/40 bg-aero-orange/10 px-4 py-2 text-sm text-foreground">
          📡 Se perdió la conexión. Tu avance se conserva y se sincronizará al restablecerse.
        </div>
      )}
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>Pregunta {actual + 1} / {total}</span>
        <span className="text-primary">hasta +{reto.recompensaMaxima} pts</span>
      </div>
      <BarraProgreso valor={(respuestas.filter((x) => x !== undefined && x !== null).length / total) * 100} color={color} />

      {errorRegistro ? (
        <PanelError
          titulo="No se pudo registrar el reto"
          mensaje="Cumpliste el reto, pero no se pudo registrar como completado. Tu resultado se conserva."
          detalle={errorRegistro}
          acciones={[{ texto: registrando ? "Registrando..." : "Reintentar", onClick: () => registrar(respuestas), primaria: true, deshabilitada: registrando }]}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-xl text-foreground leading-snug">{pregunta.texto}</h2>
          <div className="space-y-2.5">
            {pregunta.opciones.map((op, i) => {
              let cls = "trivia-option";
              if (respondida) {
                if (i === pregunta.correcta) cls += " trivia-correct";
                else if (i === elegida) cls += " trivia-wrong";
              }
              return (
                <button key={i} onClick={() => elegir(i)} disabled={respondida}
                  className={`${cls} w-full text-left px-4 py-3 rounded-lg border border-border bg-muted/50 text-sm text-foreground flex items-center gap-3`}>
                  <span className="w-6 h-6 rounded shrink-0 flex items-center justify-center font-mono text-xs font-bold border border-white/15">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {op}
                </button>
              );
            })}
          </div>
          {respondida && (
            <div className="rounded-lg p-4 text-sm border" style={{
              background: elegida === pregunta.correcta ? "rgba(80,200,110,0.22)" : "rgba(255,150,90,0.22)",
              borderColor: elegida === pregunta.correcta ? "rgba(31,163,79,0.55)" : "rgba(224,88,15,0.55)",
            }}>
              <p className="font-semibold mb-1">{elegida === pregunta.correcta ? "✅ ¡Correcto!" : "❌ Incorrecto"}</p>
              <p className="text-secondary-foreground">{pregunta.explicacion}</p>
            </div>
          )}
          {respondida && (
            todas && actual === total - 1 ? (
              <button onClick={() => registrar(respuestas)} disabled={registrando}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold tracking-wide aero-glow hover:brightness-110 disabled:opacity-50">
                {registrando ? "Registrando..." : "TERMINAR RETO ✓"}
              </button>
            ) : (
              <button onClick={siguiente}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold tracking-wide aero-glow hover:brightness-110">
                SIGUIENTE →
              </button>
            )
          )}
        </div>
      )}
    </Contenedor>
  );
}

function Dato({ titulo, texto, destacado }) {
  return (
    <div className="rounded-lg bg-muted border border-border p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{titulo}</p>
      <p className={`text-sm mt-1 ${destacado ? "font-display font-bold text-lg text-primary" : "text-foreground"}`}>{texto}</p>
    </div>
  );
}

function Contenedor({ children }) {
  return <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">{children}</div>;
}
