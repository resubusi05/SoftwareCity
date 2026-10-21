import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1) En la consola de Firebase: Configuración del proyecto > Tus apps > App web.
// 2) Copia los valores de firebaseConfig aquí.
// Mientras apiKey diga "PEGA_AQUI", la app funciona en MODO LOCAL (guarda en el navegador).
const firebaseConfig = {
  apiKey: "PEGA_AQUI",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export const firebaseConfigurado = firebaseConfig.apiKey !== "PEGA_AQUI" && firebaseConfig.projectId !== "";

/** Firestore si hay credenciales; null en modo local. */
export const db = firebaseConfigurado ? getFirestore(initializeApp(firebaseConfig)) : null;
