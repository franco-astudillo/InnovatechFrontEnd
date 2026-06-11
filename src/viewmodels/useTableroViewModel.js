import { useState, useEffect } from 'react';
import { TableroService } from '../service/TableroService';
import { ProyectoService } from '../service/ProyectoService';
import { MetricasService } from '../service/MetricasService'; // <-- IMPORTACIÓN DEL SERVICIO
import api from '../service/ApiService';

export const useTableroViewModel = () => {
  const [tareas, setTareas] = useState([]);
  const [proyectosList, setProyectosList] = useState([]);
  const [usuariosList, setUsuariosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarTablero = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Descargamos TODA la información en paralelo
      const [resUsuarios, dataProyectos, dataTareas, dataAsignaciones] = await Promise.all([
        api.get('/api/v1/usuarios').catch(() => ({ data: [] })),
        ProyectoService.getProyectos().catch(() => []),
        TableroService.getTareas().catch(() => []),
        TableroService.getAsignaciones().catch(() => [])
      ]);

      const usuarios = resUsuarios.data || [];
      setUsuariosList(usuarios);
      setProyectosList(dataProyectos);

      // 2. Enriquecemos la Tarea cruzando los datos correctamente
      const tareasEnriquecidas = dataTareas.map(tarea => {
        const proyectoAsociado = dataProyectos.find(p => p.id === tarea.proyecto?.id || p.id === tarea.proyectoId);
        
        const asignacionAsociada = dataAsignaciones.find(a => 
          (a.tarea && a.tarea.id === tarea.id) || a.tareaId === tarea.id
        );
        
        let usuarioAsignado = null;
        if (asignacionAsociada) {
          usuarioAsignado = usuarios.find(u => 
            u.uidFirebase === asignacionAsociada.usuarioId || 
            u.uid === asignacionAsociada.usuarioId || 
            u.firebaseUid === asignacionAsociada.usuarioId
          );
        }

        return {
          ...tarea,
          nombreProyectoAsociado: proyectoAsociado ? proyectoAsociado.nombreProyecto : 'Sin Proyecto',
          nombreResponsable: usuarioAsignado ? usuarioAsignado.nombre : 'No Asignado',
          uidResponsable: usuarioAsignado ? usuarioAsignado.uidFirebase : null
        };
      });

      setTareas(tareasEnriquecidas);
    } catch (err) {
      console.error("Error al cargar tablero:", err);
      setError("Error al sincronizar datos del tablero con los microservicios.");
    } finally {
      setLoading(false);
    }
  };

  // ---HELP PARA ACTUALIZAR MÉTRICAS ---
  const actualizarPorcentajeMetrica = async (proyectoId) => {
    if (!proyectoId) return;
    
    try {
      // Obtener el estado actual de las tareas desde el backend para un cálculo exacto
      const todasLasTareas = await TableroService.getTareas();
      const tareasDelProyecto = todasLasTareas.filter(t => 
        (t.proyecto && t.proyecto.id === proyectoId) || t.proyectoId === proyectoId
      );

      // Calcular la proporción
      const totalTareas = tareasDelProyecto.length;
      const completadas = tareasDelProyecto.filter(t => t.progreso === 'Completado').length;
      
      // Calculamos el porcentaje
      const nuevoPorcentaje = totalTareas === 0 ? 0.0 : parseFloat(((completadas / totalTareas) * 100).toFixed(2));

      // Buscar la métrica histórica de este proyecto en Node.js
      const metricas = await MetricasService.getAll();
      const metricaProyecto = metricas.find(m => m.proyectoId === proyectoId);

      // Si la métrica existe, disparamos la actualización
      if (metricaProyecto) {
        await MetricasService.update(metricaProyecto.id, {
          ...metricaProyecto,
          valorCalculado: nuevoPorcentaje,
          fechaCalculo: new Date().toISOString().split('T')[0] // Actualizamos la fecha al día de hoy
        });
      }
    } catch (error) {
      console.error(`Error de integración: No se pudo recalcular la métrica del proyecto ${proyectoId}`, error);
    }
  };

  const agregarTareaYAsignar = async (formData) => {
    try {
      // 1. Creamos la tarea base
      const nuevaTarea = await TableroService.crearTarea({
        nombreTareas: formData.nombreTareas,
        descripcionTareas: formData.descripcionTareas,
        estado: formData.estado,
        progreso: formData.progreso,
        proyectoId: parseInt(formData.proyectoId)
      });

      // 2. Si hay un usuario seleccionado, creamos la asignación
      if (formData.usuarioId && nuevaTarea.id) {
        await TableroService.crearAsignacion({
          tareaId: nuevaTarea.id,
          usuarioId: formData.usuarioId,
          fechaAsignacion: new Date().toISOString().split('T')[0],
          estado: true
        });
      }

      await cargarTablero();
      
      // Recalcular la métrica porque el total de tareas aumentó
      await actualizarPorcentajeMetrica(parseInt(formData.proyectoId));

      return { success: true };
    } catch (err) {
      console.error("Error al crear tarea:", err);
      return { success: false, message: "Error interno al crear tarea" };
    }
  };

  const cambiarProgreso = async (tarea, nuevoProgreso) => {
    try {
      const proyectoIdAsociado = tarea.proyecto?.id || tarea.proyectoId;
      const tareaModificada = {
        ...tarea,
        progreso: nuevoProgreso,
        proyectoId: proyectoIdAsociado
      };
      
      await TableroService.modificarTarea(tarea.id, tareaModificada);
      await cargarTablero();

      // Recalcular la métrica porque la tarea puede haber pasado a "Completado" (o salido de ese estado)
      await actualizarPorcentajeMetrica(proyectoIdAsociado);
      
    } catch (err) {
      console.error("Error al mover tarea:", err);
      alert("Error al actualizar progreso de la tarea.");
    }
  };

  const eliminarTarea = async (id) => {
    try {
      // Identificamos el proyecto ANTES de borrar la tarea para saber qué métrica actualizar
      const tareaAEliminar = tareas.find(t => t.id === id);
      const proyectoIdAsociado = tareaAEliminar ? (tareaAEliminar.proyecto?.id || tareaAEliminar.proyectoId) : null;

      await TableroService.eliminarTarea(id);
      await cargarTablero();

      // Recalcular la métrica porque el total de tareas disminuyó
      if (proyectoIdAsociado) {
        await actualizarPorcentajeMetrica(proyectoIdAsociado);
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: "Error interno al eliminar" };
    }
  };

  useEffect(() => {
    cargarTablero();
  }, []);

  return {
    tareas, proyectosList, usuariosList, loading, error, 
    cargarTablero, agregarTareaYAsignar, cambiarProgreso, eliminarTarea
  };
};