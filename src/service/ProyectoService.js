import api from './ApiService';

export const ProyectoService = {
  // Obtener lista básica de proyectos
  getProyectos: async () => {
    const response = await api.get('/api/v1/proyectos');
    return response.data;
  },

  // Obtener el proyecto junto con el Jefe desde el microservicio externo de Recursos
  getProyectoDetalle: async (id) => {
    const response = await api.get(`/api/v1/proyectos/${id}/detalle`);
    return response.data;
  },

  // Crear un nuevo proyecto (POST)
  crearProyecto: async (proyectoDTO) => {
    const response = await api.post('/api/v1/proyectos', proyectoDTO);
    return response.data;
  },

  // Modificar un proyecto existente (PUT)
  modificarProyecto: async (id, proyectoDTO) => {
    const response = await api.put(`/api/v1/proyectos/${id}`, proyectoDTO);
    return response.data;
  },

  // Eliminación lógica masiva en cascada (DELETE)
  eliminarProyecto: async (id) => {
    const response = await api.delete(`/api/v1/proyectos/${id}`);
    return response.data;
  }
};