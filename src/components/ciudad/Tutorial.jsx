import { Modal } from "../ui";

// P-15 · CDU-10 A1: tutorial la primera vez que el alumno entra a su ciudad.
// Al cerrarlo (Saltar o Empezar) se sigue en el paso 3 y no vuelve a aparecer (A1.3).
const PASOS = [
  { icono: "▢", texto: "Toca un lote libre del plano: ahí pondrás un edificio nuevo o moverás uno que ya tienes." },
  { icono: "☰", texto: "Elige un edificio que quepa en ese lote: uno nuevo con tus puntos o uno que ya tienes." },
  { icono: "✓", texto: "El cambio se aplica en tu ciudad." },
];

export default function Tutorial({ abierto, onCerrar }) {
  return (
    <Modal abierto={abierto} ancho="max-w-lg">
      <div className="text-left space-y-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-neon-green">Tutorial · primera vez</p>
        <h2 className="font-display font-bold text-2xl text-foreground">Así diseñas tu ciudad</h2>
        <ol className="space-y-4">
          {PASOS.map((p, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="w-9 h-9 rounded-full border border-primary/50 text-primary font-display font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="w-11 h-11 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center text-muted-foreground shrink-0" aria-hidden="true">{p.icono}</span>
              <p className="text-sm text-secondary-foreground pt-1">{p.texto}</p>
            </li>
          ))}
        </ol>
        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onCerrar} className="px-5 py-2.5 rounded-lg border border-border text-secondary-foreground font-display font-bold hover:text-foreground hover:bg-muted">Saltar</button>
          <button onClick={onCerrar} className="px-5 py-2.5 rounded-lg bg-neon-green text-primary-foreground font-display font-bold hover:brightness-110">Empezar →</button>
        </div>
      </div>
    </Modal>
  );
}
