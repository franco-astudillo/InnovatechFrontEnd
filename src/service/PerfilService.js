import api from './ApiService';

export const PerfilService = {
  // Obtiene los datos del usuario logueado. 
  // ApiService inyecta el token JWT, y el API Gateway lo convierte en el header X-User-UID.
  getMyInfo: async () => {
    const response = await api.get('/api/v1/usuarios/me');
    return response.data;
  }
};