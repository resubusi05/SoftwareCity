import { useState } from "react";
import { resumenCiudad } from "../../data/catalogoCiudad";
import ControlesCamara from "../ciudad/ControlesCamara";
import EscenaCiudad from "../ciudad/EscenaCiudad";
import { Avatar } from "../ui";

// P-21 · CDU-12 pasos 4 a 6: ciudad del amigo en modo SOLO VISITA.
// Sin selección de lotes, sin menú de edificios y sin compras: la visita no cambia
// sus edificios ni sus puntos (poscondición 1). No se llama a ninguna operación de escritura.
export default function CiudadAmigoView({ amigo, lotes, onSalir }) {
  const [zoom, setZoom] = useState(1);
  const [giro, setGiro] = useState(0);
  const { ocupados } = resumenCiudad(lotes);

  return (
    <div className="flex flex-col h-[calc(100dvh-57px)]">
      <div className="border-b border-border bg-card/60 px-4 py-2.5 flex items-center gap-3">
        <Avatar nombre={amigo.nombre} tamano="w-10 h-10 text-base" />
        <div className="min-w-0">
          <h1 className="font-display font-bold text-lg sm:text-xl text-foreground truncate">Ciudad de {amigo.nombre}</h1>
          <p className="font-mono text-[11px] text-muted-foreground">{ocupados} edificio{ocupados === 1 ? "" : "s"}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full border border-primary/50 bg-white/60 text-xs font-semibold text-primary">Solo visita</span>
        <div className="flex-1" />
        {/* Paso 6: salir de la ciudad. Paso 7: regresa a la lista de amigos */}
        <button onClick={onSalir} className="px-4 py-2.5 rounded-lg border border-border text-foreground font-display font-bold hover:bg-muted whitespace-nowrap">
          Salir de la ciudad
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        {/* Paso 5: el alumno recorre la ciudad (solo cámara) */}
        <EscenaCiudad lotes={lotes} interactiva={false} zoom={zoom} giro={giro} />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
          <p className="pointer-events-auto max-w-md px-4 py-2 rounded-xl border border-border bg-card/90 text-xs text-secondary-foreground">
            Estás de visita: puedes recorrer la ciudad, pero no cambiar sus edificios.
          </p>
          <div className="pointer-events-auto">
            <ControlesCamara zoom={zoom} setZoom={setZoom} setGiro={setGiro} />
          </div>
        </div>
      </div>
    </div>
  );
}
