import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import Cookies from 'js-cookie';
import api from './ApiService';

export const AuthService = {
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;
      
      // 2. Guardar en Cookie en lugar de localStorage
      // expires: 1 significa que la cookie expira en 1 día
      // secure: true asegura que solo se envíe por HTTPS
      // sameSite: 'strict' evita ataques CSRF
      Cookies.set('token', token, { 
      expires: 1, 
      secure: true,      // Mantenlo para producción en Vercel (usa HTTPS)
      sameSite: 'Lax',   // Cambia 'strict' por 'Lax' para mejor compatibilidad en despliegues
      path: '/'          // Asegura que la cookie sea accesible en todas las rutas de tu página
    });

    //Espera respuesta para activar por uid
    try {

        await api.patch(`/api/v1/usuarios/firebase/${uid}/activar`, { activo: true });
      } catch (backendError) {
        console.error("Error al activar al usuario en la base de datos:", backendError);

      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },


  logout: async () => {
    try {
      // Capturar el usuario actual ANTES de cerrar la sesión en Firebase
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // 5. Petición PATCH al backend para INACTIVAR al usuario
        try {
          await api.patch(`/api/v1/usuarios/firebase/${currentUser.uid}/activar`, { activo: false });
        } catch (backendError) {
          console.error("Error al desactivar al usuario en la base de datos:", backendError);
        }
      }

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