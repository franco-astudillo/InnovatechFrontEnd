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
  },
  // Buscar un trabajador por ID
  getUsuarioById: async (id) => {
    const response = await api.get(`/api/v1/usuarios/${id}`);
    return response.data;
  },
  // Actualizar datos de un trabajador (nombre, sueldo, cargo, categoria)
  updateUsuario: async (id, usuarioData) => {
    const response = await api.put(`/api/v1/usuarios/${id}`, usuarioData);
    return response.data;
  },
  // Eliminar un trabajador de la base de datos
  deleteUsuario: async (id) => {
    const response = await api.delete(`/api/v1/usuarios/${id}`);
    return response.data;
  },

  //Obtener info del usuario logeado usando el token que envía el ApiService
  

  cambiarEstadoConexion: async (id, estado) => {
    const response = await api.patch(`/api/v1/usuarios/${id}/estado-conexion?logeado=${estado}`);
    return response.data;
  }


};