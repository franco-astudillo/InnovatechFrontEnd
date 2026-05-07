import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export const AuthService = {
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Extraemos el JWT para enviarlo luego al API Gateway
    const token = await userCredential.user.getIdToken(); 
    localStorage.setItem('jwt_token', token);
    return userCredential.user;
  },
  logout: async () => {
    await signOut(auth);
    localStorage.removeItem('jwt_token');
  }
};