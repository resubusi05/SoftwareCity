// Botones de cámara de P-16, P-18 y P-21: acercar, alejar y girar 90°.
export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 2.2;

export default function ControlesCamara({ zoom, setZoom, setGiro }) {
  const boton = "w-11 h-11 rounded-lg border border-border bg-card/90 backdrop-blur text-foreground font-display font-bold text-lg hover:bg-muted disabled:opacity-40 transition-colors";
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1">cámara</span>
      <button className={boton} aria-label="Acercar" disabled={zoom >= ZOOM_MAX} onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + 0.2).toFixed(2)))}>+</button>
      <button className={boton} aria-label="Alejar" disabled={zoom <= ZOOM_MIN} onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - 0.2).toFixed(2)))}>−</button>
      <button className={`${boton} w-auto px-4 text-sm`} onClick={() => setGiro((g) => g + 1)}>Girar</button>
    </div>
  );
}
