import api from './ApiService';

export const RecursosService = {
  // Obtener lista de trabajadores
  getUsuarios: async () => {
    const response = await api.get('/api/v1/usuarios');
    return response.data;
  },
  // Crear un nuevo trabajador
  createUsuario: async (usuarioData) => {
    const response = await api.post('/api/v1/usuarios', usuarioData);
    return response.data;
  }
};