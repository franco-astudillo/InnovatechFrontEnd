import api from './ApiService';

export const ProyectoService = {
  // Obtener lista de proyectos
  getProyectos: async () => {
    // Ruta del microserviicio
    const response = await api.get('/api/v1/proyectos');
    return response.data;
  }
};