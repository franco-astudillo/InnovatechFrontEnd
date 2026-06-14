import api from './ApiService';

export const TableroService = {
  // --- ENDPOINTS DE TAREAS ---
  getTareas: async () => {
    const response = await api.get('/api/v1/tareas');
    return response.data;
  },
  crearTarea: async (tareaDTO) => {
    const response = await api.post('/api/v1/tareas', tareaDTO);
    return response.data;
  },
  modificarTarea: async (id, tareaDTO) => {
    const response = await api.put(`/api/v1/tareas/${id}`, tareaDTO);
    return response.data;
  },
  eliminarTarea: async (id) => {
    const response = await api.delete(`/api/v1/tareas/${id}`);
    return response.data;
  },

  // --- ENDPOINTS DE ASIGNACIONES ---
  getAsignaciones: async () => {
    const response = await api.get('/api/v1/asignaciones-tareas');
    return response.data;
  },
  crearAsignacion: async (asignacionDTO) => {
    const response = await api.post('/api/v1/asignaciones-tareas', asignacionDTO);
    return response.data;
  },
  modificarAsignacion: async (id, asignacionDTO) => {
    const response = await api.put(`/api/v1/asignaciones-tareas/${id}`, asignacionDTO);
    return response.data;
  },
  eliminarAsignacion: async (id) => {
    const response = await api.delete(`/api/v1/asignaciones-tareas/${id}`);
    return response.data;
  },

  // --- ENDPOINTS DE REGISTRO OPERATIVO ---
  crearRegistroHoras: async (registroDTO) => {
    const response = await api.post('/api/v1/registro-horas', registroDTO);
    return response.data;
  },
  crearInforme: async (informeDTO) => {
    const response = await api.post('/api/v1/informes', informeDTO);
    return response.data;
  }
};