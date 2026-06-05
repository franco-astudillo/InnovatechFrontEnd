import api from './ApiService';

const RESOURCE_PATH = '/api/v1/metricas-historicas';

export const MetricasService = {
  getAll: async () => {
    try {
      const response = await api.get(RESOURCE_PATH);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo métricas:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${RESOURCE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo métrica con id ${id}:`, error);
      throw error;
    }
  },

  create: async (metricaDto) => {
    try {
      const response = await api.post(RESOURCE_PATH, metricaDto);
      return response.data;
    } catch (error) {
      console.error("Error creando métrica:", error);
      throw error;
    }
  },

  update: async (id, metricaDto) => {
    try {
      const response = await api.put(`${RESOURCE_PATH}/${id}`, metricaDto);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando métrica con id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${RESOURCE_PATH}/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Error eliminando métrica con id ${id}:`, error);
      throw error;
    }
  }
  
};