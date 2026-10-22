import { buscarEdificio, LOTES, TAMANO_PLANO } from "../../data/catalogoCiudad";

// Dibujo isométrico pequeño (SVG) de la ciudad para la tarjeta "Mi ciudad" del Inicio (P-01).
// No usa la escena 3D para que el Inicio cargue rápido.

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const ESCALA = 10;
const ALTURA = 9; // escala vertical

const iso = (x, z, y = 0) => [(x - z) * COS * ESCALA, (x + z) * SIN * ESCALA - y * ALTURA];
const puntos = (lista) => lista.map((p) => p.join(",")).join(" ");

function esquinas(cx, cz, ancho, fondo, y = 0) {
  const a = ancho / 2;
  const f = fondo / 2;
  return [iso(cx - a, cz - f, y), iso(cx + a, cz - f, y), iso(cx + a, cz + f, y), iso(cx - a, cz + f, y)];
}

export default function MiniCiudad({ lotes, className = "" }) {
  const m = TAMANO_PLANO / 2;
  const base = esquinas(0, 0, TAMANO_PLANO, TAMANO_PLANO);
  // Se dibujan de atrás hacia adelante para que los edificios cercanos tapen a los lejanos
  const ordenados = [...LOTES].sort((a, b) => a.x + a.z - (b.x + b.z));
  const w = m * 2 * COS * ESCALA + 4;

  return (
    <svg viewBox={`${-w} ${-m * 2 * SIN * ESCALA - 50} ${w * 2} ${m * 4 * SIN * ESCALA + 60}`} className={className} aria-hidden="true">
      <polygon points={puntos(base)} fill="rgba(90,200,90,0.45)" stroke="rgba(255,255,255,0.85)" strokeWidth="1" />
      {ordenados.map((l) => {
        const edificioId = lotes?.[l.id];
        const e = edificioId ? buscarEdificio(edificioId) : null;
        const suelo = esquinas(l.x, l.z, l.ancho, l.fondo);
        if (!e) {
          return <polygon key={l.id} points={puntos(suelo)} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" strokeDasharray="3 2" />;
        }
        const ab = l.ancho * 0.8;
        const fb = l.fondo * 0.8;
        const [, b1, b2, b3] = esquinas(l.x, l.z, ab, fb);
        const [t0, t1, t2, t3] = esquinas(l.x, l.z, ab, fb, e.altura);
        return (
          <g key={l.id}>
            <polygon points={puntos([b3, b2, t2, t3])} fill={e.color} fillOpacity="0.55" stroke={e.color} strokeWidth="0.8" />
            <polygon points={puntos([b1, b2, t2, t1])} fill={e.color} fillOpacity="0.35" stroke={e.color} strokeWidth="0.8" />
            <polygon points={puntos([t0, t1, t2, t3])} fill={e.color} fillOpacity="0.8" stroke={e.color} strokeWidth="0.8" />
          </g>
        );
      })}
    </svg>
  );
}
