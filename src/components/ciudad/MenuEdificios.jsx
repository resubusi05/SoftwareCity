import { buscarEdificio, cabeEnLote, EDIFICIOS, TAMANOS } from "../../data/catalogoCiudad";

// P-17 · CDU-10 pasos 4 y 5: menú del lote elegido.
// Solo aparecen los edificios que caben en el lote. Los que no alcanza a pagar se muestran
// deshabilitados con "Faltan X pts" (decisión del equipo, 13/10/2026).
export default function MenuEdificios({ lote, lotes, puntos, operando, aviso, onComprar, onMover, onCerrar }) {
  const comprables = EDIFICIOS.filter((e) => cabeEnLote(e, lote)).sort((a, b) => a.precio - b.precio);
  const mios = Object.entries(lotes ?? {})
    .map(([loteId, edificioId]) => ({ loteId, edificio: buscarEdificio(edificioId) }))
    .filter(({ loteId, edificio }) => edificio && loteId !== lote.id && cabeEnLote(edificio, lote));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-2xl text-foreground">Lote {lote.id}</h2>
            <span className="px-2 py-0.5 rounded border border-border font-mono text-[11px] text-secondary-foreground">{TAMANOS[lote.tamano].nombre}</span>
          </div>
          <p className="text-xs text-secondary-foreground">Solo aparecen los edificios que caben en este lote.</p>
        </div>
        <button onClick={onCerrar} aria-label="Cerrar menú" className="w-11 h-11 rounded-lg border border-border text-foreground hover:bg-muted shrink-0">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
        {aviso && (
          <div className="rounded-lg border border-neon-orange/40 bg-neon-orange/10 px-3 py-2 text-sm text-foreground" role="alert">{aviso}</div>
        )}

        <section className="space-y-2.5">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Comprar con puntos</h3>
          {comprables.length === 0 && <p className="text-sm text-muted-foreground">No hay edificios de este tamaño en el catálogo.</p>}
          {comprables.map((e) => {
            const faltan = e.precio - puntos;
            return (
              <Fila key={e.id} edificio={e} punteada={faltan > 0}
                detalle={`${TAMANOS[e.tamano].nombre} · ${e.precio} pts`}
                accion={faltan > 0 ? (
                  <button disabled className="px-3 py-2 rounded-lg border border-dashed border-border text-muted-foreground font-display font-bold text-sm cursor-not-allowed whitespace-nowrap">
                    Faltan {faltan} pts
                  </button>
                ) : (
                  <button onClick={() => onComprar(e)} disabled={operando}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:brightness-110 disabled:opacity-50 whitespace-nowrap">
                    {operando === e.id ? "Comprando..." : "Comprar"}
                  </button>
                )}
              />
            );
          })}
        </section>

        <section className="space-y-2.5">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Mis edificios que caben</h3>
          {mios.length === 0 && <p className="text-sm text-muted-foreground">No tienes edificios de este tamaño en otro lote.</p>}
          {mios.map(({ loteId, edificio }) => (
            <Fila key={loteId} edificio={edificio}
              detalle={`${TAMANOS[edificio.tamano].nombre} · está en ${loteId}`}
              accion={
                <button onClick={() => onMover(loteId, edificio)} disabled={operando}
                  className="px-4 py-2 rounded-lg border border-primary/60 text-primary font-display font-bold text-sm hover:bg-primary/10 disabled:opacity-50 whitespace-nowrap">
                  {operando === loteId ? "Moviendo..." : "Mover aquí"}
                </button>
              }
            />
          ))}
        </section>
      </div>
    </div>
  );
}

function Fila({ edificio, detalle, accion, punteada }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border bg-muted/40 p-3 ${punteada ? "border-dashed border-border opacity-80" : "border-border"}`}>
      <div className="w-12 h-12 rounded-lg border flex items-end justify-center shrink-0 overflow-hidden" style={{ borderColor: `${edificio.color}60`, background: `${edificio.color}14` }} aria-hidden="true">
        <div className="w-6 rounded-t-sm" style={{ height: `${Math.min(100, 25 + edificio.altura * 15)}%`, background: edificio.color, opacity: 0.85 }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-foreground leading-tight">{edificio.nombre}</p>
        <p className="font-mono text-xs text-muted-foreground">{detalle}</p>
      </div>
      {accion}
    </div>
  );
}
