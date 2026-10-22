import { Component, Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Line, useGLTF } from "@react-three/drei";
import { Box3, CanvasTexture, SRGBColorSpace, Vector3 } from "three";
import { buscarEdificio, LOTES, TAMANO_PLANO } from "../../data/catalogoCiudad";

// Escena 3D de la ciudad (SCS 2.3 y 2.6: React Three Fiber + drei sobre Three.js).
// La usan Mi ciudad (CDU-10, interactiva) y la ciudad del amigo (CDU-12, solo visita).
//
// Props:
//   lotes        { L7: "torre-requisitos", ... }
//   interactiva  true en Mi ciudad; false en la visita (no se pueden tocar los lotes)
//   seleccionado id del lote elegido (CDU-10 paso 3)
//   resaltado    id del lote con el edificio recién colocado (P-18)
//   zoom, giro   controles de cámara (+ / − / Girar)
//   onLote(id)   al tocar un lote o su edificio
export default function EscenaCiudad({ lotes, interactiva = false, seleccionado = null, resaltado = null, zoom = 1, giro = 0, onLote }) {
  return (
    <Canvas orthographic dpr={[1, 2]} camera={{ position: [21, 26, 21], zoom: 30, near: 0.1, far: 200 }} className="touch-none">
      <color attach="background" args={["#bfe8fb"]} />
      <ambientLight intensity={1.25} color="#f4fbff" />
      <directionalLight position={[12, 22, 8]} intensity={1.7} color="#fff3d2" />
      <directionalLight position={[-10, 8, -6]} intensity={0.4} color="#bfe0ff" />
      <Camara zoom={zoom} giro={giro} />

      {/* Suelo del plano */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[TAMANO_PLANO + 1, 0.4, TAMANO_PLANO + 1]} />
        <meshStandardMaterial color="#6fd16a" />
      </mesh>
      {/* Capa de tierra bajo el pasto */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[TAMANO_PLANO + 1.4, 0.7, TAMANO_PLANO + 1.4]} />
        <meshStandardMaterial color="#9a7448" />
      </mesh>

      {LOTES.map((lote) => {
        const edificio = lotes?.[lote.id] ? buscarEdificio(lotes[lote.id]) : null;
        return (
          <Lote
            key={lote.id}
            lote={lote}
            edificio={edificio}
            interactiva={interactiva}
            seleccionado={seleccionado === lote.id}
            resaltado={resaltado === lote.id}
            onLote={onLote}
          />
        );
      })}
    </Canvas>
  );
}

/** Mueve la cámara suavemente al cambiar el zoom o el giro (pasos de 90°). */
function Camara({ zoom, giro }) {
  const { camera, size } = useThree();
  const objetivo = useMemo(() => new Vector3(), []);
  // Ajusta el plano al tamaño de la pantalla (laptop o teléfono, RNF-01)
  const base = Math.min(size.width / 23, size.height / 19);

  useFrame((_, dt) => {
    const angulo = Math.PI / 4 + (giro * Math.PI) / 2;
    objetivo.set(Math.sin(angulo) * 29.7, 26, Math.cos(angulo) * 29.7);
    const t = 1 - Math.pow(0.002, dt);
    camera.position.lerp(objetivo, t);
    camera.zoom += (base * zoom - camera.zoom) * t;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}

function Lote({ lote, edificio, interactiva, seleccionado, resaltado, onLote }) {
  const [encima, setEncima] = useState(false);
  const libre = !edificio;

  const borde = useMemo(() => {
    const a = (lote.ancho / 2) * 0.96;
    const f = (lote.fondo / 2) * 0.96;
    const y = 0.07;
    return [[-a, y, -f], [a, y, -f], [a, y, f], [-a, y, f], [-a, y, -f]];
  }, [lote]);

  const tocar = interactiva
    ? (e) => { e.stopPropagation(); onLote?.(lote.id); }
    : undefined;
  const sobre = interactiva
    ? (e) => { e.stopPropagation(); setEncima(true); document.body.style.cursor = "pointer"; }
    : undefined;
  const fuera = interactiva
    ? () => { setEncima(false); document.body.style.cursor = ""; }
    : undefined;

  let relleno = libre ? "#a8e8a0" : "#eaf8ff";
  if (interactiva && encima) relleno = "#c8ffc0";
  if (seleccionado) relleno = "#38bdf8";

  return (
    <group position={[lote.x, 0, lote.z]}>
      <mesh position={[0, 0.02, 0]} onClick={tocar} onPointerOver={sobre} onPointerOut={fuera}>
        <boxGeometry args={[lote.ancho * 0.96, 0.04, lote.fondo * 0.96]} />
        <meshStandardMaterial color={relleno} transparent opacity={seleccionado ? 0.75 : 1} />
      </mesh>
      <Line
        points={borde}
        color={seleccionado ? "#0284c7" : "#ffffff"}
        lineWidth={seleccionado ? 2.5 : 1.2}
        dashed
        dashSize={0.35}
        gapSize={0.25}
      />

      {libre && interactiva && <EtiquetaLote texto={lote.id} seleccionado={seleccionado} />}

      {edificio && (
        <group onClick={tocar} onPointerOver={sobre} onPointerOut={fuera}>
          <Edificio edificio={edificio} lote={lote} resaltado={resaltado} />
        </group>
      )}
    </group>
  );
}

/** Nombre del lote (L1, L2...) dibujado en una textura; siempre mira a la cámara. */
function EtiquetaLote({ texto, seleccionado }) {
  const textura = useMemo(() => {
    const lienzo = document.createElement("canvas");
    lienzo.width = 128;
    lienzo.height = 64;
    const ctx = lienzo.getContext("2d");
    ctx.font = "bold 40px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = seleccionado ? "#075985" : "#2f7a3a";
    ctx.fillText(texto, 64, 34);
    const t = new CanvasTexture(lienzo);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [texto, seleccionado]);
  useEffect(() => () => textura.dispose(), [textura]);
  return (
    <sprite position={[0, 0.45, 0]} scale={[1.3, 0.65, 1]} renderOrder={1}>
      <spriteMaterial map={textura} transparent depthWrite={false} />
    </sprite>
  );
}

/** Caja de relleno mientras no haya .glb; si el catálogo trae `modelo`, se carga el GLB de Cinema 4D. */
function Edificio({ edificio, lote, resaltado }) {
  const ancho = lote.ancho * 0.8;
  const fondo = lote.fondo * 0.8;
  const caja = <CajaEdificio edificio={edificio} ancho={ancho} fondo={fondo} resaltado={resaltado} />;
  if (!edificio.modelo) return caja;
  return (
    <SinModelo respaldo={caja}>
      <Suspense fallback={caja}>
        <ModeloGLB url={edificio.modelo} ancho={ancho} fondo={fondo} />
        {resaltado && <MarcoResaltado ancho={ancho} fondo={fondo} altura={edificio.altura} />}
      </Suspense>
    </SinModelo>
  );
}

function CajaEdificio({ edificio, ancho, fondo, resaltado }) {
  return (
    <mesh position={[0, edificio.altura / 2, 0]}>
      <boxGeometry args={[ancho, edificio.altura, fondo]} />
      <meshStandardMaterial color={edificio.color} roughness={0.55} metalness={0.1} />
      <Edges color={resaltado ? "#ffffff" : "#35607f"} lineWidth={resaltado ? 3 : 1} />
    </mesh>
  );
}

function MarcoResaltado({ ancho, fondo, altura }) {
  return (
    <mesh position={[0, altura / 2, 0]}>
      <boxGeometry args={[ancho * 1.04, altura * 1.04, fondo * 1.04]} />
      <meshBasicMaterial transparent opacity={0} />
      <Edges color="#ffffff" lineWidth={3} />
    </mesh>
  );
}

/** Carga el .glb y lo escala para que quepa en el lote (SCS 2.4). */
function ModeloGLB({ url, ancho, fondo }) {
  const { scene } = useGLTF(url);
  const { copia, escala, base } = useMemo(() => {
    const c = scene.clone(true);
    const medidas = new Box3().setFromObject(c);
    const tam = medidas.getSize(new Vector3());
    const s = Math.min(ancho / (tam.x || 1), fondo / (tam.z || 1));
    return { copia: c, escala: s, base: -medidas.min.y * s };
  }, [scene, ancho, fondo]);
  return <primitive object={copia} scale={escala} position={[0, base, 0]} />;
}

/** Si el .glb no existe o está dañado, se dibuja la caja de relleno en lugar de tumbar la escena. */
class SinModelo extends Component {
  constructor(props) {
    super(props);
    this.state = { fallo: false };
  }
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  componentDidCatch(error) {
    console.warn("No se pudo cargar el modelo del edificio:", error);
  }
  render() {
    return this.state.fallo ? this.props.respaldo : this.props.children;
  }
}
