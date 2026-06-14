import { useState, useEffect } from 'react';
import { TableroService } from '../service/TableroService';
import { ProyectoService } from '../service/ProyectoService';
import { MetricasService } from '../service/MetricasService';
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
      const [resUsuarios, dataProyectos, dataTareas, dataAsignaciones] = await Promise.all([
        api.get('/api/v1/usuarios').catch(() => ({ data: [] })),
        ProyectoService.getProyectos().catch(() => []),
        TableroService.getTareas().catch(() => []),
        TableroService.getAsignaciones().catch(() => [])
      ]);

      const usuarios = resUsuarios.data || [];
      setUsuariosList(usuarios);
      setProyectosList(dataProyectos);

      const tareasEnriquecidas = dataTareas.map(tarea => {
        const proyectoAsociado = dataProyectos.find(p => p.id === tarea.proyecto?.id || p.id === tarea.proyectoId);
        
        const asignacionAsociada = dataAsignaciones.find(a => 
          (a.tarea && a.tarea.id === tarea.id) || a.tareaId === tarea.id
        );
        
        let usuarioAsignado = null;
        if (asignacionAsociada) {
          usuarioAsignado = usuarios.find(u => 
            String(u.uidFirebase) === String(asignacionAsociada.usuarioId) || 
            String(u.id) === String(asignacionAsociada.usuarioId)
          );
        }

        return {
          ...tarea,
          nombreProyectoAsociado: proyectoAsociado ? proyectoAsociado.nombreProyecto : 'Sin Proyecto',
          nombreResponsable: usuarioAsignado ? usuarioAsignado.nombre : 'No Asignado',
          uidResponsable: usuarioAsignado ? (usuarioAsignado.uidFirebase || usuarioAsignado.id) : null
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

  const actualizarPorcentajeMetrica = async (proyectoId) => {
    if (!proyectoId) return;
    try {
      const todasLasTareas = await TableroService.getTareas();
      const tareasDelProyecto = todasLasTareas.filter(t => 
        ((t.proyecto && t.proyecto.id === proyectoId) || t.proyectoId === proyectoId) && t.estado === true
      );
      const totalTareas = tareasDelProyecto.length;
      const completadas = tareasDelProyecto.filter(t => {
        if (!t.progreso) return false;
        const progresoNormalizado = t.progreso.trim().toUpperCase();
        return progresoNormalizado === 'COMPLETADA' || progresoNormalizado === 'COMPLETADO' || progresoNormalizado === 'HECHO' || progresoNormalizado === 'FINALIZADA';
      }).length;

      const nuevoPorcentaje = totalTareas === 0 ? 0.0 : parseFloat(((completadas / totalTareas) * 100).toFixed(2));
      const metricas = await MetricasService.getAll();
      const metricaProyecto = metricas.find(m => m.proyectoId === proyectoId);

      if (metricaProyecto) {
        await MetricasService.update(metricaProyecto.id, {
          ...metricaProyecto,
          valorCalculado: nuevoPorcentaje,
          fechaCalculo: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error(`Error de integración métricas`, error);
    }
  };

  const agregarTareaYAsignar = async (formData) => {
    try {
      const tareaPayload = {
        nombreTareas: formData.nombreTareas,
        descripcionTareas: formData.descripcionTareas || "",
        estado: formData.estado !== undefined ? formData.estado : true, 
        progreso: formData.progreso || "Por Hacer", 
        proyectoId: parseInt(formData.proyectoId)
      };

      const nuevaTarea = await TableroService.crearTarea(tareaPayload);
      const idGenerado = nuevaTarea.id;

      if (formData.usuarioId && idGenerado) {
        await TableroService.crearAsignacion({
          tareaId: idGenerado,
          usuarioId: String(formData.usuarioId),
          fechaAsignacion: new Date().toISOString().split('T')[0],
          estado: true
        });
      }

      await cargarTablero();
      if (formData.proyectoId) await actualizarPorcentajeMetrica(parseInt(formData.proyectoId));
      return { success: true };
    } catch (err) {
      return { success: false, message: "Error interno al crear tarea" };
    }
  };

  const cambiarProgreso = async (tarea, nuevoProgreso) => {
    try {
      const proyectoIdAsociado = tarea.proyecto?.id || tarea.proyectoId;
      const tareaModificada = { ...tarea, progreso: nuevoProgreso, proyectoId: proyectoIdAsociado };
      
      await TableroService.modificarTarea(tarea.id, tareaModificada);
      await cargarTablero();
      if (proyectoIdAsociado) await actualizarPorcentajeMetrica(proyectoIdAsociado);
    } catch (err) {
      alert("Error al actualizar progreso de la tarea.");
    }
  };

  const eliminarTarea = async (id) => {
    try {
      const tareaAEliminar = tareas.find(t => t.id === id);
      const proyectoIdAsociado = tareaAEliminar ? (tareaAEliminar.proyecto?.id || tareaAEliminar.proyectoId) : null;
      await TableroService.eliminarTarea(id);
      await cargarTablero();
      if (proyectoIdAsociado) await actualizarPorcentajeMetrica(proyectoIdAsociado);
      return { success: true };
    } catch (err) {
      return { success: false, message: "Error interno al eliminar" };
    }
  };

  const registrarHoras = async (tareaId, usuarioId, horasTrabajadas) => {
    try {
      const payload = {
        tareaId: parseInt(tareaId),
        usuarioId: String(usuarioId),
        horasTrabajadas: parseFloat(horasTrabajadas),
        fechaRegistro: new Date().toISOString().split('T')[0],
        estado: true
      };
      await TableroService.crearRegistroHoras(payload);
      return { success: true };
    } catch (err) {
      return { success: false, message: "Error al registrar las horas." };
    }
  };

  const registrarInforme = async (tareaId, usuarioId, enlaceInforme) => {
    try {
      const payload = {
        tareaId: parseInt(tareaId),
        usuarioId: String(usuarioId),
        url: enlaceInforme,
        fechaSubida: new Date().toISOString().split('T')[0],
        estado: true
      };
      await TableroService.crearInforme(payload);
      return { success: true };
    } catch (err) {
      return { success: false, message: "Error al registrar el informe." };
    }
  };

  // --- NUEVA LÓGICA DE REASIGNACIÓN (POST, PUT, DELETE) ---
  const cambiarResponsable = async (tareaId, nuevoUsuarioId) => {
    try {
      const dataAsignaciones = await TableroService.getAsignaciones();
      const asignacionActual = dataAsignaciones.find(a => 
        (a.tarea && a.tarea.id === tareaId) || a.tareaId === tareaId
      );

      if (nuevoUsuarioId) {
        if (asignacionActual) {
          await TableroService.modificarAsignacion(asignacionActual.id, {
            ...asignacionActual,
            usuarioId: String(nuevoUsuarioId),
            tareaId: tareaId
          });
        } else {
          await TableroService.crearAsignacion({
            tareaId: tareaId,
            usuarioId: String(nuevoUsuarioId),
            fechaAsignacion: new Date().toISOString().split('T')[0],
            estado: true
          });
        }
      } else {
        if (asignacionActual) {
          await TableroService.eliminarAsignacion(asignacionActual.id);
        }
      }
      
      await cargarTablero();
      return { success: true };
    } catch (err) {
      console.error("Error al reasignar colaborador:", err);
      return { success: false, message: "Error al actualizar la asignación de la tarea." };
    }
  };

  useEffect(() => {
    cargarTablero();
  }, []);

  return {
    tareas, proyectosList, usuariosList, loading, error, 
    cargarTablero, agregarTareaYAsignar, cambiarProgreso, eliminarTarea,
    registrarHoras, registrarInforme, cambiarResponsable
  };
};