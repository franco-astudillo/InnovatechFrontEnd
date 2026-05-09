import axios from 'axios';

const api = axios.create({
  // URL de tu API Gateway (ajusta el puerto según tu configuración de Spring Boot)
  baseURL: ' https://gateinnovatech.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;