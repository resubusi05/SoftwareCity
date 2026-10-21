import { useState } from "react";
import { modo, setSimularFallas } from "../data/repositorio";
import { Avatar } from "./ui";

export default function Nav({ nombre, puntos, onInicio }) {
  const [fallas, setFallas] = useState(false);
  const alternarFallas = () => {
    setSimularFallas(!fallas);
    setFallas(!fallas);
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-[110]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 sm:gap-4">
        <button onClick={onInicio} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center neon-glow">
            <span className="text-primary font-display font-bold text-sm">SC</span>
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-foreground hidden sm:inline">
            SOFTWARE<span className="text-primary text-glow"> CITY</span>
          </span>
        </button>

        <div className="flex-1" />

        <button
          onClick={alternarFallas}
          title="Hace que las siguientes operaciones fallen, para mostrar el manejo de errores"
          aria-label={fallas ? "Fallas ON" : "Simular fallas"}
          className={`px-2.5 py-1 rounded font-mono text-xs border transition-all whitespace-nowrap ${
            fallas ? "border-neon-orange text-neon-orange bg-neon-orange/10" : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {fallas ? <>⚠<span className="hidden sm:inline"> Fallas ON</span></> : <>🧪<span className="hidden sm:inline"> Simular fallas</span></>}
        </button>

        <span
          className="hidden md:inline px-2 py-1 rounded font-mono text-[10px] border border-border text-muted-foreground"
          title={modo === "firebase" ? "Los datos se guardan en Firebase" : "Sin credenciales de Firebase: los datos se guardan en este navegador"}
        >
          {modo === "firebase" ? "● FIREBASE" : "● MODO LOCAL"}
        </span>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 font-display font-bold text-primary whitespace-nowrap">
          ⚡ {puntos} <span className="text-xs font-mono font-normal">pts</span>
        </div>

        <div className="flex items-center gap-2">
          <Avatar nombre={nombre} />
          <p className="hidden md:block text-xs font-semibold text-foreground">{nombre}</p>
        </div>
      </div>
    </header>
  );
}
