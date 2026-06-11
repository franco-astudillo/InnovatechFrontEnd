import { useState, useEffect } from 'react';
import { ProyectoService } from '../service/ProyectoService';
import { MetricasService } from '../service/MetricasService';
import api from '../service/ApiService';

export const useMiProyectoViewModel = () => {
  const [proyectos, setProyectos] = useState([]);
  const [usuariosRecursos, setUsuariosRecursos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProyectos = async () => {
    setLoading(true);
    setError(null);
    try {
      const resUsuarios = await api.get('/api/v1/usuarios');
      const listaUsuarios = resUsuarios.data || [];
      setUsuariosRecursos(listaUsuarios);

      const listaBasica = await ProyectoService.getProyectos();
      
      const listaEnriquecida = await Promise.all(
        listaBasica.map(async (proyecto) => {
          try {
            const jefeEncontrado = listaUsuarios.find(u => 
              u.uidFirebase === proyecto.jefeId || 
              u.uid === proyecto.jefeId || 
              u.firebaseUid === proyecto.jefeId
            );

            return {
              ...proyecto,
              jefeNombre: jefeEncontrado ? jefeEncontrado.nombre : 'Sin Jefe / Usuario Externo'
            };
          } catch (err) {
            return {
              ...proyecto,
              jefeNombre: 'Error de resolución'
            };
          }
        })
      );

      setProyectos(listaEnriquecida);
    } catch (err) {
      console.error("Error al obtener y sincronizar proyectos:", err);
      setError("No se pudieron sincronizar los proyectos con el personal de Recursos.");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA PARA AGREGAR PROYECTO Y CREAR SU MÉTRICA ---
  const agregarProyecto = async (formData) => {
    try {
      // 1. Creamos el proyecto y capturamos la respuesta (que contiene el ID generado en BD)
      const proyectoCreado = await ProyectoService.crearProyecto(formData);

      // 2. Creamos instantáneamente la métrica asociada en Node.js usando el ID del nuevo proyecto
      // 2. Creamos instantáneamente la métrica asociada en Node.js
      try {
        await MetricasService.create({
          proyectoId: proyectoCreado.id,
          nombreKpi: 'Progreso Inicial', // O el nombre que requiera tu modelo
          valorCalculado: 0              // Valor numérico inicial
        });
        console.log("Métrica creada exitosamente para el proyecto:", proyectoCreado.id);
      } catch (metricaError) {
        console.error("El proyecto se creó, pero falló la creación de la métrica:", metricaError);
      }

      await cargarProyectos();
      return { success: true };
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      return { success: false, message: err.message || "Error interno" };
    }
  };

  const editarProyecto = async (id, formData) => {
    try {
      await ProyectoService.modificarProyecto(id, formData);
      await cargarProyectos();
      return { success: true };
    } catch (err) {
      console.error("Error al modificar proyecto:", err);
      return { success: false, message: err.message || "Error interno" };
    }
  };

  // --- LÓGICA PARA ELIMINAR PROYECTO Y SU MÉTRICA ---
  const borrarProyecto = async (id) => {
    try {
      // 1. Eliminamos el proyecto primero en Spring Boot
      await ProyectoService.eliminarProyecto(id);

      // 2. Buscamos y eliminamos la métrica asociada en Node.js
      try {
        const metricas = await MetricasService.getAll();
        
        // Convertimos ambos a String para evitar que falle si uno es Integer y otro String
        const metricaAsociada = metricas.find(m => String(m.proyectoId) === String(id));
        
        if (metricaAsociada) {
          await MetricasService.delete(metricaAsociada.id);
          console.log(`Métrica asociada al proyecto ${id} eliminada correctamente.`);
        } else {
          console.warn(`No se encontró métrica para eliminar del proyecto ${id}`);
        }
      } catch (metricaError) {
        console.warn("Proyecto eliminado, pero hubo un problema al limpiar su métrica:", metricaError);
      }

      // Recargamos la vista
      await cargarProyectos();
      return { success: true };
    } catch (err) {
      console.error("Error al desactivar proyecto:", err);
      return { success: false, message: err.message || "Error interno" };
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  return {
    proyectos,
    usuariosRecursos,
    loading,
    error,
    cargarProyectos,
    agregarProyecto,
    editarProyecto,
    borrarProyecto
  };
};