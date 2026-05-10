import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Creamos un objeto con todas las "llaves" y direcciones de nuestro proyecto en Firebase.
// Usamos 'import.meta.env' porque estamos usando Vite. Esto es por SEGURIDAD:
// Nos permite leer estas claves desde un archivo oculto (.env) en lugar de escribirlas
// directamente aquí, evitando que cualquier persona en internet pueda robarnos las credenciales.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);