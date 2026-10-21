import { useEffect, useRef, useState } from "react";
import { buscarEdificio, buscarLote } from "../../data/catalogoCiudad";
import {
  ciudadRepo, ErrorLoteOcupado, ErrorNoCabe, ErrorPuntosInsuficientes, mensajeError, nuevoIdOperacion,
} from "../../data/repositorio";
import { Modal } from "../ui";
import ControlesCamara from "./ControlesCamara";
import EscenaCiudad from "./EscenaCiudad";
import MenuEdificios from "./MenuEdificios";
import Tutorial from "./Tutorial";

// CDU-10 Diseñar ciudad virtual
//   P-16 plano (pasos 1 a 3) · P-15 tutorial (A1) · P-17 menú (pasos 3 a 5)
//   P-18 edificio colocado (paso 6) · P-19 no se pudo guardar (RNF-05, SCS 7.4)
// Errores de negocio (lote ocupado, no cabe, puntos) se muestran en el menú; las fallas técnicas en P-19.
const esErrorDeRegla = (e) => e instanceof ErrorPuntosInsuficientes || e instanceof ErrorLoteOcupado || e instanceof ErrorNoCabe;

export default function CiudadView({ alumno, onActualizar, onTutorialVisto, onRecargar, onVolver }) {
  const lotes = alumno.lotes ?? {};
  const [tutorial, setTutorial] = useState(!alumno.tutorialCiudadVisto);
  const [seleccionado, setSeleccionado] = useState(null);
  const [ocupado, setOcupado] = useState(null); // lote con edificio que se tocó (solo informa)
  const [operando, setOperando] = useState(null); // id del edificio o lote en operación
  const [avisoMenu, setAvisoMenu] = useState(null);
  const [pendiente, setPendiente] = useState(null); // { tipo, datos, edificio, error } -> P-19
  const [hecho, setHecho] = useState(null); // { texto, loteId } -> P-18
  const [zoom, setZoom] = useState(1);
  const [giro, setGiro] = useState(0);
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  // A1.3: al cerrar el tutorial se sigue en el paso 3 y no vuelve a aparecer
  const cerrarTutorial = () => {
    setTutorial(false);
    onTutorialVisto();
    ciudadRepo.marcarTutorialVisto().catch(() => { /* si falla, se vuelve a mostrar la próxima vez */ });
  };

  // Paso 3: el alumno elige el lote
  const tocarLote = (loteId) => {
    if (operando) return;
    setAvisoMenu(null);
    if (lotes[loteId]) {
      setSeleccionado(null);
      setOcupado(loteId);
      return;
    }
    setOcupado(null);
    setSeleccionado(loteId);
  };

  const mostrarHecho = (texto, loteId) => {
    clearTimeout(temporizador.current);
    setHecho({ texto, loteId });
    temporizador.current = setTimeout(() => setHecho(null), 4500);
  };

  // Paso 6: la aplicación hace el cambio (compra = descontar puntos + guardar edificio en una transacción)
  const ejecutarCambio = async (tipo, datos, edificio) => {
    setOperando(tipo === "comprar" ? edificio.id : datos.origenId);
    setAvisoMenu(null);
    try {
      if (tipo === "comprar") {
        const r = await ciudadRepo.comprarEdificio(datos);
        onActualizar({ puntos: r.puntos, lotes: r.lotes });
        mostrarHecho(`✓ ${edificio.nombre} colocado en ${datos.loteId} · −${edificio.precio} pts`, datos.loteId);
      } else {
        const r = await ciudadRepo.moverEdificio(datos);
        onActualizar({ lotes: r.lotes });
        mostrarHecho(`✓ ${edificio.nombre} movido de ${datos.origenId} a ${datos.destinoId} · sin costo`, datos.destinoId);
      }
      setPendiente(null);
      setSeleccionado(null);
    } catch (e) {
      if (esErrorDeRegla(e)) {
        setPendiente(null);
        setAvisoMenu(mensajeError(e));
      } else {
        setPendiente({ tipo, datos, edificio, error: mensajeError(e) });
      }
    } finally {
      setOperando(null);
    }
  };

  const comprar = (edificio) =>
    ejecutarCambio("comprar", { loteId: seleccionado, edificioId: edificio.id, idOperacion: nuevoIdOperacion() }, edificio);
  const mover = (origenId, edificio) =>
    ejecutarCambio("mover", { origenId, destinoId: seleccionado, idOperacion: nuevoIdOperacion() }, edificio);

  // P-19: "Volver a la ciudad" recarga lo guardado por si el cambio sí alcanzó a guardarse
  const volverALaCiudad = () => {
    setPendiente(null);
    setSeleccionado(null);
    onRecargar();
  };

  const lote = seleccionado ? buscarLote(seleccionado) : null;
  const edificioOcupado = ocupado ? buscarEdificio(lotes[ocupado]) : null;

  return (
    <div className="flex flex-col h-[calc(100dvh-57px)]">
      {/* Barra de la pantalla */}
      <div className="border-b border-border bg-card/60 px-4 py-2.5 flex items-center gap-3 sm:gap-5">
        <button onClick={onVolver} className="font-mono text-sm text-muted-foreground hover:text-foreground">← Inicio</button>
        <h1 className="font-display font-bold text-xl tracking-wide text-foreground">MI CIUDAD</h1>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-4 font-mono text-[11px] text-secondary-foreground">
          <Leyenda clase="border border-dashed border-slate-500">Lote libre</Leyenda>
          <Leyenda clase="bg-secondary border border-border">Con edificio</Leyenda>
          <Leyenda clase="bg-blue-700/70 border border-dashed border-blue-400">Seleccionado</Leyenda>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Plano 3D */}
        <div className="flex-1 min-w-0 min-h-0 relative">
          <EscenaCiudad lotes={lotes} interactiva seleccionado={seleccionado} resaltado={hecho?.loteId} zoom={zoom} giro={giro} onLote={tocarLote} />

          {hecho && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl border border-neon-green/60 bg-card/95 font-display font-bold text-foreground neon-glow-green whitespace-nowrap text-sm sm:text-base" role="status">
              {hecho.texto}
            </div>
          )}

          {edificioOcupado && (
            <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm rounded-xl border border-border bg-card/95 p-4 space-y-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display font-bold text-foreground">Lote {ocupado} · {edificioOcupado.nombre}</p>
                <button onClick={() => setOcupado(null)} aria-label="Cerrar" className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <p className="text-xs text-secondary-foreground">Para moverlo, toca el lote libre a donde lo quieres llevar y elige "Mover aquí".</p>
            </div>
          )}

          <div className={`absolute bottom-4 left-4 right-4 flex-wrap items-end justify-between gap-3 pointer-events-none ${lote ? "hidden lg:flex" : "flex"}`}>
            {!lote ? (
              <p className="pointer-events-auto px-4 py-2 rounded-full border border-border bg-card/90 text-sm text-foreground">
                Toca un lote libre para agregar o mover un edificio
              </p>
            ) : <span />}
            <div className="pointer-events-auto">
              <ControlesCamara zoom={zoom} setZoom={setZoom} setGiro={setGiro} />
            </div>
          </div>
        </div>

        {/* P-17: panel lateral en laptop, hoja inferior en teléfono */}
        {lote && (
          <aside className="h-[58%] shrink-0 rounded-t-2xl border-t border-border bg-card shadow-2xl lg:h-auto lg:w-[400px] lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-none flex flex-col">
            <div className="lg:hidden w-12 h-1.5 rounded-full bg-border mx-auto mt-2 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-h-0">
            <MenuEdificios
              lote={lote}
              lotes={lotes}
              puntos={alumno.puntos}
              operando={operando}
              aviso={avisoMenu}
              onComprar={comprar}
              onMover={mover}
              onCerrar={() => { setSeleccionado(null); setAvisoMenu(null); }}
            />
            </div>
          </aside>
        )}
      </div>

      <Tutorial abierto={tutorial} onCerrar={cerrarTutorial} />

      {/* P-19 · RNF-05: falla técnica al guardar. Reintentar usa el mismo idOperacion: no se cobra dos veces */}
      <Modal abierto={!!pendiente} ancho="max-w-md">
        <div className="w-14 h-14 rounded-full border-2 border-neon-orange text-neon-orange font-display font-bold text-3xl flex items-center justify-center mx-auto">!</div>
        <h2 className="font-display font-bold text-2xl text-foreground">No se pudo guardar el cambio</h2>
        <p className="text-sm text-secondary-foreground">
          {pendiente?.tipo === "comprar" ? "Tus puntos no se descontaron y tu ciudad quedó como estaba." : "Tu ciudad quedó como estaba."}
        </p>
        {pendiente?.error && <p className="font-mono text-xs text-neon-orange">{pendiente.error}</p>}
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={volverALaCiudad} disabled={!!operando} className="px-5 py-2.5 rounded-lg border border-border text-secondary-foreground font-display font-bold hover:text-foreground hover:bg-muted disabled:opacity-40">
            Volver a la ciudad
          </button>
          <button onClick={() => ejecutarCambio(pendiente.tipo, pendiente.datos, pendiente.edificio)} disabled={!!operando}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:brightness-110 disabled:opacity-50">
            {operando ? "Reintentando..." : "Reintentar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Leyenda({ clase, children }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-4 h-3 rounded-sm ${clase}`} aria-hidden="true" />
      {children}
    </span>
  );
}
