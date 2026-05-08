import api from './ApiService';

export const CargoService = {
  getAll: async () => {
    const response = await api.get('/api/v1/cargos');
    return response.data;
  },
  create: async (cargo) => {
    const response = await api.post('/api/v1/cargos', cargo);
    return response.data;
  }
};