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
      // 1. Cargamos el personal desde Recursos
      const resUsuarios = await api.get('/api/v1/usuarios');
      const listaUsuarios = resUsuarios.data || [];
      setUsuariosRecursos(listaUsuarios);

      // 2. Cargamos la lista de proyectos de la base de datos
      const listaBasica = await ProyectoService.getProyectos();
      
      // 3. Cruzamos los datos asegurando compatibilidad de nombres de variables
      const listaEnriquecida = await Promise.all(
        listaBasica.map(async (proyecto) => {
          try {
            // Buscamos al usuario comparando el jefeId del proyecto con el UID de Firebase
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

  const agregarProyecto = async (formData) => {
    try {
      //Guardamos el proyecto en Java y capturamos la respuesta (que debe contener el ID generado)
      const nuevoProyecto = await ProyectoService.crearProyecto(formData);
      
      //ORQUESTACIÓN: Si el proyecto se creó correctamente y tenemos su ID, creamos la métrica
      if (nuevoProyecto && nuevoProyecto.id) {
        try {
          await MetricasService.create({
            proyectoId: nuevoProyecto.id,
            nombreKpi: 'Progreso General de Tareas',
            valorCalculado: 0.0, // Nace en 0%
            fechaCalculo: new Date().toISOString().split('T')[0]
          });
        } catch (metricaError) {
          // Si el microservicio de métricas falla, no bloqueamos al usuario. El proyecto ya existe.
          console.warn("Proyecto creado, pero falló la inicialización de la métrica en Node:", metricaError);
        }
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

  const borrarProyecto = async (id) => {
    try {
      await ProyectoService.eliminarProyecto(id);
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