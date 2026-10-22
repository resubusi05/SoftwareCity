import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// La configuración sale de variables de entorno de Vite (archivo .env en la raíz; ver .env.example y LEEME).
// En la consola de Firebase: Configuración del proyecto > Tus apps > App web > firebaseConfig.
// Además: Authentication > Método de acceso > activa "Google".
// Si falta la apiKey o el projectId, la app funciona en MODO LOCAL (guarda en el navegador).
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: env.VITE_FIREBASE_APP_ID ?? "",
};

export const firebaseConfigurado = firebaseConfig.apiKey !== "" && firebaseConfig.projectId !== "";

const app = firebaseConfigurado ? initializeApp(firebaseConfig) : null;

/** Firestore si hay credenciales; null en modo local. */
export const db = app ? getFirestore(app) : null;
/** Firebase Authentication si hay credenciales; null en modo local. */
export const auth = app ? getAuth(app) : null;
export const proveedorGoogle = app ? new GoogleAuthProvider() : null;
