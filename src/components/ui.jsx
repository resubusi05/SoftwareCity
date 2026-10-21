export function Cargando({ texto = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="font-mono text-xs tracking-widest uppercase">{texto}</p>
    </div>
  );
}

/** Acción: { texto, onClick, primaria?, deshabilitada? } */
export function Boton({ texto, onClick, primaria, deshabilitada, color }) {
  return (
    <button
      onClick={onClick}
      disabled={deshabilitada}
      className={`px-5 py-2.5 rounded-lg font-display font-bold tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        primaria
          ? "text-primary-foreground hover:brightness-110 neon-glow"
          : "border border-border text-secondary-foreground hover:text-foreground hover:bg-muted"
      }`}
      style={primaria ? { background: color ?? "var(--color-primary)" } : undefined}
    >
      {texto}
    </button>
  );
}

/** Panel para excepciones de los casos de uso: informa y ofrece acciones (reintentar, regresar...). */
export function PanelError({ titulo, mensaje, detalle, acciones }) {
  return (
    <div className="rounded-xl border border-neon-orange/40 bg-card p-6 space-y-4 text-center">
      <div className="text-4xl">⚠️</div>
      <h2 className="font-display font-bold text-xl text-foreground">{titulo}</h2>
      <p className="text-sm text-secondary-foreground">{mensaje}</p>
      {detalle && <p className="font-mono text-xs text-neon-orange">{detalle}</p>}
      <div className="flex flex-wrap gap-3 justify-center">
        {acciones.map((a) => <Boton key={a.texto} {...a} />)}
      </div>
    </div>
  );
}

export function Modal({ abierto, children, ancho = "max-w-sm" }) {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true">
      <div className={`w-full ${ancho} rounded-xl border border-border bg-card p-6 space-y-4 text-center`}>{children}</div>
    </div>
  );
}

export function BarraProgreso({ valor, color }) {
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color ? "" : "progress-bar"}`}
        style={{ width: `${Math.max(0, Math.min(100, valor))}%`, ...(color ? { background: color, boxShadow: `0 0 8px ${color}60` } : {}) }}
      />
    </div>
  );
}

export function Volver({ texto = "← Volver", onClick }) {
  return (
    <button onClick={onClick} className="text-muted-foreground hover:text-foreground transition-colors font-mono text-sm">
      {texto}
    </button>
  );
}

/** Círculo con la inicial (alumno y amigos). */
export function Avatar({ nombre, tamano = "w-8 h-8 text-sm", className = "" }) {
  return (
    <div className={`${tamano} rounded-full bg-accent/30 border border-accent/60 flex items-center justify-center font-display font-bold text-accent-foreground shrink-0 ${className}`}>
      {nombre.replace(/^Amigo\s+/i, "").charAt(0).toUpperCase()}
    </div>
  );
}
