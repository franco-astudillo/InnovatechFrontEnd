import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import Cookies from 'js-cookie'; 

export const AuthService = {
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      // 2. Guardar en Cookie en lugar de localStorage
      // expires: 1 significa que la cookie expira en 1 día
      // secure: true asegura que solo se envíe por HTTPS
      // sameSite: 'strict' evita ataques CSRF
      Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'strict' });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },


  logout: async () => {
    try {
      await signOut(auth);
      // 3. Eliminar la cookie al cerrar sesión
      Cookies.remove('token');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  getToken: () => {
    // 4. Recuperar el token desde la cookie
    return Cookies.get('token');
  },

  isAuthenticated: () => {
    // 5. Verificar existencia de la cookie
    return !!Cookies.get('token');
  }


};