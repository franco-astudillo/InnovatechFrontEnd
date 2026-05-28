import { useState, useEffect } from 'react';
import { ProyectoService } from '../service/ProyectoService';

export const useMiProyectoViewModel = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProyectos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProyectoService.getProyectos();
      setProyectos(data);
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
      setError("No se pudieron cargar los proyectos. Verifica la conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  return {
    proyectos,
    loading,
    error,
    cargarProyectos
  };
};