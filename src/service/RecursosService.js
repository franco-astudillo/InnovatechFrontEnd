import api from './ApiService';

export const RecursosService = {
  // Obtiene la lista de usuarios (empleados) pasando por el Gateway
  getUsuarios: async () => {
    try {
      const response = await api.get('api/v1/usuarios');
      return response.data;
    } catch (error) {
      console.error("Error al obtener recursos: ", error);
      throw error;
    }
  }
};