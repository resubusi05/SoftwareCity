import { useState } from "react";
import { amigosRepo, mensajeError } from "../../data/repositorio";
import { Avatar, Boton, Modal, Volver } from "../ui";

// CDU-12 Visitar ciudad de amigo
//   P-20 lista de amigos (pasos 1 a 3) · P-22 amigo sin ciudad (E1)
// La lista viene de amigosRepo (amigos de prueba mientras no exista el caso de uso para agregarlos).
export default function AmigosView({ amigos, onVisitar, onVolver }) {
  const [cargando, setCargando] = useState(null); // id del amigo cuya ciudad se está cargando
  const [sinCiudad, setSinCiudad] = useState(null); // amigo -> P-22
  const [falla, setFalla] = useState(null); // { amigo, error } -> falla técnica (RNF-05)

  // Paso 3: el alumno elige al amigo. Paso 4 (o E1.1): el sistema revisa si tiene ciudad.
  const visitar = async (amigo) => {
    setFalla(null);
    setCargando(amigo.id);
    try {
      const ciudad = await amigosRepo.cargarCiudadAmigo(amigo.id);
      if (!ciudad) setSinCiudad(amigo); // E1.2
      else onVisitar(ciudad);
    } catch (e) {
      setFalla({ amigo, error: mensajeError(e) });
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Volver texto="← Inicio" onClick={onVolver} />
      <div className="space-y-1">
        <h1 className="font-display font-bold text-3xl text-foreground tracking-wide">Amigos</h1>
        <p className="text-sm text-secondary-foreground">Elige a un amigo para visitar su ciudad.</p>
      </div>

      {amigos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-secondary-foreground">
          Todavía no tienes amigos en tu lista.
        </div>
      ) : (
        <ul className="space-y-3">
          {amigos.map((a) => (
            <li key={a.id} className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3">
              <Avatar nombre={a.nombre} tamano="w-11 h-11 text-base" />
              <p className="flex-1 font-display font-bold text-lg text-foreground">{a.nombre}</p>
              <button onClick={() => visitar(a)} disabled={!!cargando}
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:brightness-110 disabled:opacity-50 whitespace-nowrap">
                {cargando === a.id ? "Cargando..." : "Visitar ciudad →"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {falla && (
        <div className="rounded-xl border border-aero-orange/40 bg-card p-5 space-y-3 text-center" role="alert">
          <p className="font-display font-bold text-lg text-foreground">No se pudo cargar la ciudad de {falla.amigo.nombre}</p>
          <p className="font-mono text-xs text-aero-orange">{falla.error}</p>
          <div className="flex gap-3 justify-center">
            <Boton texto="Reintentar" onClick={() => visitar(falla.amigo)} primaria deshabilitada={!!cargando} />
            <Boton texto="Cerrar" onClick={() => setFalla(null)} />
          </div>
        </div>
      )}

      {/* P-22 · E1: el amigo todavía no tiene ciudad. E1.3: regresa a la lista */}
      <Modal abierto={!!sinCiudad} ancho="max-w-md">
        <div className="text-5xl">🏗️</div>
        <h2 className="font-display font-bold text-2xl text-foreground">{sinCiudad?.nombre} todavía no tiene una ciudad para visitar</h2>
        <p className="text-sm text-secondary-foreground">Cuando diseñe su ciudad podrás visitarla.</p>
        <Boton texto="Volver a amigos" onClick={() => setSinCiudad(null)} primaria />
      </Modal>
    </div>
  );
}
