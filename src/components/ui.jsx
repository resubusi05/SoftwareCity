export function Cargando({ texto = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <div className="w-10 h-10 rounded-full border-[3px] border-white/80 border-t-primary shadow-lg animate-spin" />
      <p className="text-sm font-semibold text-secondary-foreground" style={{ textShadow: "0 1px 0 #fff" }}>{texto}</p>
    </div>
  );
}

/** Acción: { texto, onClick, primaria?, deshabilitada? } */
export function Boton({ texto, onClick, primaria, deshabilitada, color }) {
  return (
    <button
      onClick={onClick}
      disabled={deshabilitada}
      className={`px-5 py-2.5 rounded-lg font-display font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        primaria
          ? "btn-aero"
          : "border border-border text-secondary-foreground hover:text-foreground"
      }`}
      style={primaria && color ? { "--btn": color } : undefined}
    >
      {texto}
    </button>
  );
}

/** Panel para excepciones de los casos de uso: informa y ofrece acciones (reintentar, regresar...). */
export function PanelError({ titulo, mensaje, detalle, acciones }) {
  return (
    <VentanaAero titulo="Software City" icono cuerpoClassName="p-6 space-y-4 text-center">
      <div className="text-4xl">⚠️</div>
      <h2 className="font-display font-semibold text-xl text-foreground">{titulo}</h2>
      <p className="text-sm text-secondary-foreground">{mensaje}</p>
      {detalle && <p className="font-mono text-xs text-aero-orange">{detalle}</p>}
      <div className="flex flex-wrap gap-3 justify-center">
        {acciones.map((a) => <Boton key={a.texto} {...a} />)}
      </div>
    </VentanaAero>
  );
}

/**
 * Ventana de vidrio estilo Windows Vista/7: marco translúcido, barra de título y cuerpo claro.
 * `controles` dibuja los botones de ventana (solo decorativos). `agua` pinta el cuerpo como acuario.
 */
export function VentanaAero({ titulo, icono = true, controles = false, agua = false, className = "", cuerpoClassName = "", children }) {
  return (
    <section className={`ventana-aero ${className}`}>
      <div className="ventana-aero__barra">
        {icono && <span className="ventana-aero__icono" aria-hidden="true" />}
        <span className="ventana-aero__titulo">{titulo}</span>
        {controles && (
          <div className="ventana-aero__controles" aria-hidden="true">
            <span>–</span><span>▢</span><span>✕</span>
          </div>
        )}
      </div>
      <div className={`ventana-aero__cuerpo ${agua ? "agua-aero" : ""} ${cuerpoClassName}`}>{children}</div>
    </section>
  );
}

export function Modal({ abierto, children, ancho = "max-w-sm" }) {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-900/40 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
      <VentanaAero titulo="Software City" className={`w-full ${ancho}`} cuerpoClassName="p-6 space-y-4 text-center">
        {children}
      </VentanaAero>
    </div>
  );
}

/** Control deslizante tipo reproductor: pista hundida, relleno de gel y perilla. */
export function BarraProgreso({ valor, color }) {
  const pct = Math.max(0, Math.min(100, valor));
  return (
    <div className="slider-aero" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="slider-aero__pista">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color ? "" : "progress-bar"}`}
          style={{ width: `${pct}%`, ...(color ? { background: `linear-gradient(180deg, color-mix(in srgb, ${color}, #fff 45%), ${color} 50%, color-mix(in srgb, ${color}, #000 18%) 52%, color-mix(in srgb, ${color}, #fff 25%))`, boxShadow: `0 0 8px ${color}80, inset 0 1px 0 rgba(255,255,255,.7)` } : {}) }}
        />
      </div>
      {pct > 0 && pct < 100 && <span className="slider-aero__perilla" style={{ left: `calc(${pct}% - 7px)` }} aria-hidden="true" />}
    </div>
  );
}

export function Volver({ texto = "← Volver", onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-semibold text-sm text-primary hover:underline"
      style={{ textShadow: "0 1px 0 rgba(255,255,255,.9), 0 0 8px rgba(255,255,255,.7)" }}
    >
      {texto}
    </button>
  );
}

const COLORES_ORBE = ["#1a8fd6", "#2fb34a", "#f08a1c", "#e2559b", "#8b5fe0", "#16a8a8", "#e0b014", "#d94a3a"];

function colorDe(nombre) {
  let h = 0;
  for (const ch of nombre) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORES_ORBE[h % COLORES_ORBE.length];
}

/** Orbe de gel con la inicial (alumno y amigos); el color sale del nombre. */
export function Avatar({ nombre, tamano = "w-8 h-8 text-sm", className = "" }) {
  return (
    <div
      className={`${tamano} orbe-gel rounded-full flex items-center justify-center font-display font-bold shrink-0 ${className}`}
      style={{ "--c": colorDe(nombre) }}
    >
      <span className="relative z-[1]">{nombre.replace(/^Amigo\s+/i, "").charAt(0).toUpperCase()}</span>
    </div>
  );
}
