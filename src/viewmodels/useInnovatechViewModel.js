// src/viewmodels/useInnovatechViewModel.js
import { useState, useEffect } from 'react';
import { obtenerEstadoInnovatech } from '../models/apiService';

export const useInnovatechViewModel = () => {
    const [mensaje, setMensaje] = useState("Conectando con Innovatech...");

    useEffect(() => {
        const cargarDatos = async () => {
            const resultado = await obtenerEstadoInnovatech();
            setMensaje(resultado); 
        };
        cargarDatos();
    }, []);

    return { mensaje };
};