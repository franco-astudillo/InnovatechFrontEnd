import api from './ApiService';

export const CategoriaService = {
  getAll: async () => {
    const response = await api.get('/api/v1/categorias');
    return response.data;
  },
  create: async (categoria) => {
    const response = await api.post('/api/v1/categorias', categoria);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/v1/categorias/${id}`);
    return response.data;
  }
};