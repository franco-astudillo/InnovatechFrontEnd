import axios from 'axios';
import Cookies from 'js-cookie'

const api = axios.create({
  // Define la URL raíz a la que apuntarán todas las peticiones.
  // URL de tu API Gateway (ajusta el puerto según tu configuración de Spring Boot)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    // Establece que el formato de los datos que enviaremos al backend será siempre JSON.
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el JWT en cada petición
api.interceptors.request.use((config) => {
  // 1. El interceptor busca en las cookies del navegador si existe un 'token' guardado (el JWT que nos dio Firebase/Backend).
  const token = Cookies.get('token'); // Recuperamos el token desde la cookie
  if (token) {
    // ...se lo inyecta automáticamente a los "headers" de la petición HTTP bajo el estándar "Bearer Token".
    // Así, el API Gateway sabrá que quien hace la petición es un usuario autenticado.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;