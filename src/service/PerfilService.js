import api from './ApiService';

export const PerfilService = {
  getMyInfo: async () => {
    const response = await api.get('/api/v1/usuarios/me');
    return response.data;
  },
  getMyProyectos: async () => {
    const response = await api.get('/api/v1/usuarios/me/proyectos');
    return response.data;
  },
  getMyTareas: async () => {
    const response = await api.get('/api/v1/usuarios/me/tareas');
    return response.data;
  }
};