// src/models/apiService.js

// El puerto por defecto de tu API Spring Boot
const API_URL = 'http://localhost:8080';

// Función del Modelo para verificar el estado de Innovatech
export const obtenerEstadoInnovatech = async () => {
    try {
        const respuesta = await fetch(`${API_URL}/api/v1/health`);
        return await respuesta.text(); 
    } catch (error) {
        return "No hay conexión con la API de Innovatech aún.";
    }
};