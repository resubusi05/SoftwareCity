import { useState } from "react";
import { modo, setSimularFallas } from "../data/repositorio";
import { Avatar } from "./ui";

export default function Nav({ nombre, puntos, onInicio, onCerrarSesion }) {
  const [fallas, setFallas] = useState(false);
  const [menu, setMenu] = useState(false);
  const alternarFallas = () => {
    setSimularFallas(!fallas);
    setFallas(!fallas);
  };

  return (
    <header className="barra-aero sticky top-0 z-[110]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 sm:gap-4">
        <button onClick={onInicio} className="flex items-center gap-2 shrink-0">
          <div className="orbe-logo">
            <span className="font-display text-sm">SC</span>
          </div>
          <span className="font-display font-light text-2xl text-foreground hidden sm:inline" style={{ textShadow: "0 1px 0 #fff" }}>
            Software<span className="font-semibold text-primary"> City</span>
          </span>
        </button>

        <div className="flex-1" />

        <button
          onClick={alternarFallas}
          title="Hace que las siguientes operaciones fallen, para mostrar el manejo de errores"
          aria-label={fallas ? "Fallas ON" : "Simular fallas"}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
            fallas ? "border-aero-orange text-aero-orange bg-aero-orange/10" : "border-border"
          }`}
        >
          {fallas ? <>⚠<span className="hidden sm:inline"> Fallas ON</span></> : <>🧪<span className="hidden sm:inline"> Simular fallas</span></>}
        </button>

        <span
          className="hidden md:inline display-ready text-[11px]"
          title={modo === "firebase" ? "Los datos se guardan en Firebase" : "Sin credenciales de Firebase: los datos se guardan en este navegador"}
        >
          {modo === "firebase" ? "Firebase" : "Modo local"}
        </span>

        {onCerrarSesion && (
          <>
            <div className="display-ready whitespace-nowrap" title="Tus puntos">
              {puntos} <span className="text-xs font-normal">pts</span>
            </div>

            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Menú de tu cuenta"
                className="flex items-center gap-2 rounded-full pr-1">
                <Avatar nombre={nombre} />
                <span className="hidden md:block text-xs font-semibold text-foreground max-w-32 truncate">{nombre}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-2xl p-3 space-y-2">
                  <p className="font-display font-bold text-foreground truncate">{nombre}</p>
                  <button onClick={() => { setMenu(false); onCerrarSesion(); }}
                    className="w-full py-2 rounded-lg border border-border text-sm text-foreground">Cerrar sesión</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
