import { useState, useEffect } from 'react';
import { TableroService } from '../service/TableroService';
import { ProyectoService } from '../service/ProyectoService';
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
        // Buscamos a qué proyecto pertenece
        const proyectoAsociado = dataProyectos.find(p => p.id === tarea.proyecto?.id || p.id === tarea.proyectoId);
        
        // ¡SOLUCIÓN AQUÍ!: Buscamos en el objeto anidado a.tarea?.id
        const asignacionAsociada = dataAsignaciones.find(a => 
          (a.tarea && a.tarea.id === tarea.id) || a.tareaId === tarea.id
        );
        
        let usuarioAsignado = null;
        if (asignacionAsociada) {
          // Comparamos el usuarioId de la asignación con el uidFirebase del trabajador
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
          usuarioId: formData.usuarioId, // Se envía el UID de Firebase
          fechaAsignacion: new Date().toISOString().split('T')[0],
          estado: true
        });
      }

      await cargarTablero();
      return { success: true };
    } catch (err) {
      console.error("Error al crear tarea:", err);
      return { success: false, message: "Error interno al crear tarea" };
    }
  };

  const cambiarProgreso = async (tarea, nuevoProgreso) => {
    try {
      const tareaModificada = {
        ...tarea,
        progreso: nuevoProgreso,
        proyectoId: tarea.proyecto?.id || tarea.proyectoId
      };
      await TableroService.modificarTarea(tarea.id, tareaModificada);
      await cargarTablero();
    } catch (err) {
      console.error("Error al mover tarea:", err);
      alert("Error al actualizar progreso de la tarea.");
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await TableroService.eliminarTarea(id);
      await cargarTablero();
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