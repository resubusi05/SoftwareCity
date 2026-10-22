import { useMemo, useState } from "react";
import { Boton } from "./ui";

// Actividad corta al final de una sección de la lección (CDU-1). No bloquea el "Siguiente" ni da puntos:
// sirve para practicar lo que se acaba de leer y ver la explicación al momento.
//
// Formatos de `actividad` en data/temas/*.js:
//   { tipo: "opcion",     pregunta, opciones: [..], correcta: indice, explicacion }
//   { tipo: "vf",         afirmacion, verdadero: true|false, explicacion }
//   { tipo: "completar",  frase: "El ___ define ...", opciones: [..], correcta: indice, explicacion }
//   { tipo: "ordenar",    enunciado, pasos: [..en el orden correcto..], explicacion }
//   { tipo: "relacionar", enunciado, parejas: [[izquierda, derecha], ...], explicacion }
export default function ActividadSeccion({ actividad, color }) {
  const Tipo = { opcion: Opcion, completar: Opcion, vf: VerdaderoFalso, ordenar: Ordenar, relacionar: Relacionar }[actividad.tipo];
  if (!Tipo) return null;
  return (
    <div className="rounded-xl border bg-muted/40 p-5 space-y-4" style={{ borderColor: `${color}55` }}>
      <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color }}>⚡ Practica</p>
      <Tipo actividad={actividad} color={color} />
    </div>
  );
}

function Resultado({ acierto, explicacion }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${acierto ? "border-aero-green/50 bg-aero-green/10" : "border-aero-orange/50 bg-aero-orange/10"}`} role="status">
      <p className="font-semibold text-foreground">{acierto ? "✓ ¡Correcto!" : "✗ No es esa."}</p>
      {explicacion && <p className="text-secondary-foreground mt-1">{explicacion}</p>}
    </div>
  );
}

const claseOpcion = (estado) =>
  `w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
    estado === "bien" ? "border-aero-green bg-aero-green/10 text-foreground"
      : estado === "mal" ? "border-aero-orange bg-aero-orange/10 text-foreground"
        : estado === "elegida" ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-secondary-foreground hover:text-foreground hover:bg-muted"
  }`;

// ---- Opción múltiple y completar la frase ----
function Opcion({ actividad }) {
  const [elegida, setElegida] = useState(null);
  const respondida = elegida !== null;
  const enunciado = actividad.tipo === "completar" ? actividad.frase : actividad.pregunta;
  return (
    <div className="space-y-3">
      <p className="text-foreground font-semibold leading-relaxed">{enunciado}</p>
      <div className="space-y-2">
        {actividad.opciones.map((o, i) => {
          const estado = !respondida ? "" : i === actividad.correcta ? "bien" : i === elegida ? "mal" : "";
          return (
            <button key={i} disabled={respondida} onClick={() => setElegida(i)} className={claseOpcion(estado)}>{o}</button>
          );
        })}
      </div>
      {respondida && <Resultado acierto={elegida === actividad.correcta} explicacion={actividad.explicacion} />}
    </div>
  );
}

// ---- Verdadero o falso ----
function VerdaderoFalso({ actividad }) {
  const [elegida, setElegida] = useState(null);
  const respondida = elegida !== null;
  return (
    <div className="space-y-3">
      <p className="text-foreground font-semibold leading-relaxed">¿Verdadero o falso? {actividad.afirmacion}</p>
      <div className="grid grid-cols-2 gap-2">
        {[true, false].map((v) => {
          const estado = !respondida ? "" : v === actividad.verdadero ? "bien" : v === elegida ? "mal" : "";
          return (
            <button key={String(v)} disabled={respondida} onClick={() => setElegida(v)} className={`${claseOpcion(estado)} text-center font-display font-bold`}>
              {v ? "Verdadero" : "Falso"}
            </button>
          );
        })}
      </div>
      {respondida && <Resultado acierto={elegida === actividad.verdadero} explicacion={actividad.explicacion} />}
    </div>
  );
}

function barajar(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Si quedó en el orden correcto, se rota para que no regale la respuesta
  if (n > 1 && a.every((v, i) => v === i)) a.push(a.shift());
  return a;
}

// ---- Ordenar: se toca cada paso en el orden en que va ----
function Ordenar({ actividad, color }) {
  const mezcla = useMemo(() => barajar(actividad.pasos.length), [actividad]);
  const [elegidos, setElegidos] = useState([]); // índices originales, en el orden que el alumno los puso
  const [revisado, setRevisado] = useState(false);
  const completo = elegidos.length === actividad.pasos.length;
  const acierto = completo && elegidos.every((v, i) => v === i);

  const reiniciar = () => { setElegidos([]); setRevisado(false); };
  return (
    <div className="space-y-3">
      <p className="text-foreground font-semibold leading-relaxed">{actividad.enunciado}</p>
      <p className="text-xs text-muted-foreground">Toca los pasos en el orden correcto. Toca uno de tu lista para quitarlo.</p>

      <ol className="space-y-2">
        {actividad.pasos.map((_, pos) => {
          const idx = elegidos[pos];
          const estado = !revisado || idx === undefined ? (idx === undefined ? "" : "elegida") : idx === pos ? "bien" : "mal";
          return (
            <li key={pos}>
              <button disabled={revisado || idx === undefined} onClick={() => setElegidos((e) => e.filter((_, k) => k !== pos))}
                className={`${claseOpcion(estado)} min-h-11 ${idx === undefined ? "border-dashed" : ""}`}>
                <span className="font-mono text-xs mr-2" style={{ color }}>{pos + 1}.</span>
                {idx === undefined ? <span className="text-muted-foreground">…</span> : actividad.pasos[idx]}
              </button>
            </li>
          );
        })}
      </ol>

      {!revisado && (
        <div className="flex flex-wrap gap-2">
          {mezcla.filter((i) => !elegidos.includes(i)).map((i) => (
            <button key={i} onClick={() => setElegidos((e) => [...e, i])}
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-secondary-foreground hover:text-foreground hover:bg-muted">
              {actividad.pasos[i]}
            </button>
          ))}
        </div>
      )}

      {!revisado ? (
        <Boton texto="Comprobar" onClick={() => setRevisado(true)} deshabilitada={!completo} primaria color={color} />
      ) : (
        <div className="space-y-3">
          <Resultado acierto={acierto} explicacion={actividad.explicacion} />
          {!acierto && <Boton texto="Intentar otra vez" onClick={reiniciar} />}
        </div>
      )}
    </div>
  );
}

// ---- Relacionar: se toca un elemento de la izquierda y luego su pareja de la derecha ----
function Relacionar({ actividad, color }) {
  const n = actividad.parejas.length;
  const mezcla = useMemo(() => barajar(n), [n, actividad]);
  const [pares, setPares] = useState({}); // izquierda -> derecha
  const [sel, setSel] = useState(null);
  const [revisado, setRevisado] = useState(false);
  const completo = Object.keys(pares).length === n;
  const acierto = completo && Object.entries(pares).every(([l, r]) => Number(l) === r);
  const derechaUsada = (r) => Object.values(pares).includes(r);

  const tocarIzq = (i) => {
    if (revisado) return;
    if (pares[i] !== undefined) { setPares((p) => { const c = { ...p }; delete c[i]; return c; }); setSel(i); return; }
    setSel(i);
  };
  const tocarDer = (r) => {
    if (revisado || sel === null || derechaUsada(r)) return;
    setPares((p) => ({ ...p, [sel]: r }));
    setSel(null);
  };
  const reiniciar = () => { setPares({}); setSel(null); setRevisado(false); };

  return (
    <div className="space-y-3">
      <p className="text-foreground font-semibold leading-relaxed">{actividad.enunciado}</p>
      <p className="text-xs text-muted-foreground">Toca un elemento de la izquierda y luego su pareja de la derecha.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          {actividad.parejas.map(([izq], i) => {
            const estado = revisado && pares[i] !== undefined ? (pares[i] === i ? "bien" : "mal") : sel === i ? "elegida" : pares[i] !== undefined ? "elegida" : "";
            return (
              <button key={i} onClick={() => tocarIzq(i)} className={claseOpcion(estado)}>
                {izq}{pares[i] !== undefined && <span className="block font-mono text-xs mt-1 opacity-80">→ {actividad.parejas[pares[i]][1]}</span>}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {mezcla.map((r) => (
            <button key={r} onClick={() => tocarDer(r)} disabled={revisado || derechaUsada(r) || sel === null}
              className={`${claseOpcion(derechaUsada(r) ? "elegida" : "")} disabled:opacity-50`}>
              {actividad.parejas[r][1]}
            </button>
          ))}
        </div>
      </div>
      {!revisado ? (
        <Boton texto="Comprobar" onClick={() => setRevisado(true)} deshabilitada={!completo} primaria color={color} />
      ) : (
        <div className="space-y-3">
          <Resultado acierto={acierto} explicacion={actividad.explicacion} />
          {!acierto && <Boton texto="Intentar otra vez" onClick={reiniciar} />}
        </div>
      )}
    </div>
  );
}
