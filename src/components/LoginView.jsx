import { useState } from "react";
import { mensajeError, modo, sesion } from "../data/repositorio";
import { VentanaAero } from "./ui";

// Inicio de sesión: el alumno entra para que su progreso, sus puntos y su ciudad queden guardados en su cuenta.
// Con Firebase: cuenta de Google (Firebase Authentication). En modo local: solo su nombre, guardado en este navegador.
export default function LoginView() {
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const entrar = async (e) => {
    e?.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      if (modo === "firebase") await sesion.entrarConGoogle();
      else await sesion.entrarLocal(nombre);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-57px)] flex items-center justify-center px-4 py-10">
      <VentanaAero titulo="Iniciar sesión · Software City" controles className="w-full max-w-md" cuerpoClassName="p-0">
        <div className="agua-aero px-7 sm:px-8 py-7 space-y-2 text-center">
          <div className="orbe-logo mx-auto !w-16 !h-16">
            <span className="font-display font-bold text-xl">SC</span>
          </div>
          <h1 className="font-display font-light text-4xl text-white" style={{ textShadow: "0 2px 6px rgba(0,30,80,.65)" }}>
            Software<span className="font-semibold"> City</span>
          </h1>
          <p className="text-sm text-sky-100" style={{ textShadow: "0 1px 2px rgba(0,30,80,.6)" }}>
            Aprende Introducción a la Ingeniería de Software, gana puntos y construye tu ciudad.
          </p>
        </div>
        <div className="p-7 sm:p-8 space-y-6">

        {modo === "firebase" ? (
          <div className="space-y-3">
            <button onClick={entrar} disabled={enviando}
              className="w-full py-3 rounded-lg border border-border text-slate-900 font-display font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-60">
              <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              {enviando ? "Abriendo Google..." : "Entrar con Google"}
            </button>
            <p className="text-xs text-muted-foreground text-center">Entra con tu cuenta de Google. La primera vez se crea tu perfil con tu nombre de Google.</p>
          </div>
        ) : (
          <form onSubmit={entrar} className="space-y-3">
            <label htmlFor="nombre" className="block text-sm font-semibold text-secondary-foreground">Tu nombre</label>
            <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} autoComplete="name"
              placeholder="¿Cómo te llamas?"
              className="w-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none" />
            <button type="submit" disabled={enviando}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg disabled:opacity-60">
              {enviando ? "Entrando..." : "Entrar →"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Modo local: con el mismo nombre recuperas tu progreso, guardado en este navegador. Para entrar con Google, conecta Firebase (ver LEEME).
            </p>
          </form>
        )}

        {error && (
          <div className="rounded-lg border border-aero-orange/40 bg-aero-orange/10 px-3 py-2 text-sm text-foreground" role="alert">
            <p className="font-semibold">No se pudo iniciar sesión.</p>
            <p className="font-mono text-xs text-aero-orange">{error}</p>
          </div>
        )}
        </div>
      </VentanaAero>
    </div>
  );
}
