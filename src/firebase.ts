
// Initialize Firebase

import { initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyBz2Q92K64cUBWRVoZll7UDkTqUgr_EoaM",
  authDomain: "softwarecity-98a98.firebaseapp.com",
  projectId: "softwarecity-98a98",
  storageBucket: "softwarecity-98a98.firebasestorage.app",
  messagingSenderId: "996094468078",
  appId: "1:996094468078:web:37265ca8bc3284fd62b8ff",
};

export const firebaseConfigurado = firebaseConfig.apiKey !== "PEGA_AQUI" && firebaseConfig.projectId !== "";

export const db: Firestore | null = firebaseConfigurado ? getFirestore(initializeApp(firebaseConfig)) : null;