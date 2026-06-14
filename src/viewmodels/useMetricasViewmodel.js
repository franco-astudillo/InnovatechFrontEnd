import { useState, useEffect } from 'react';
import { MetricasService } from '../service/MetricasService';
import { ProyectoService } from '../service/ProyectoService'; 
import { TableroService } from '../service/TableroService'; 

export const useMetricasViewModel = () => {
  const [metricas, setMetricas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [kpis, setKpis] = useState({
    totalMetricas: 0,
    ultimaActualizacion: null
  });

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const [metricasData, proyectosData, tareasData] = await Promise.all([
        MetricasService.getAll(),
        ProyectoService.getProyectos(),
        TableroService.getTareas().catch(() => []) 
      ]);

      const activeMetricas = metricasData || [];
      const todasLasTareas = tareasData || [];
      
      const proyectosConProgreso = (proyectosData || []).map(proyecto => {
        
        // 1. Filtramos tareas del proyecto Y QUE NO ESTÉN ELIMINADAS
        const tareasDelProyecto = todasLasTareas.filter(t => 
          (t.proyecto?.id === proyecto.id || t.proyectoId === proyecto.id) &&
          t.estado === true 
        );


        const totalTareas = tareasDelProyecto.length;
        
        // 2. Contamos las completadas dentro de ese universo de tareas activas
        const tareasCompletadas = tareasDelProyecto.filter(t => {
          if (!t.progreso) return false;
          
          const progresoNormalizado = t.progreso.trim().toUpperCase();
          
          return progresoNormalizado === 'COMPLETADA' || 
                 progresoNormalizado === 'COMPLETADO' || 
                 progresoNormalizado === 'HECHO' ||
                 progresoNormalizado === 'FINALIZADA';
        }).length;
        
        const progreso = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;

        return { 
          ...proyecto, 
          progreso: Math.round(progreso), 
          totalTareas, 
          tareasCompletadas 
        };
      });

      setMetricas(activeMetricas);
      setProyectos(proyectosConProgreso);

      setKpis({
        totalMetricas: activeMetricas.length,
        ultimaActualizacion: new Date().toLocaleTimeString()
      });

    } catch (error) {
      console.error("Error al cargar la data:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarMetrica = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de métrica?')) {
      setLoading(true);
      try {
        await MetricasService.delete(id);
        await fetchDatos(); 
      } catch (error) {
        console.error("Error al eliminar métrica:", error);
        alert('Hubo un error al eliminar la métrica.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  return { 
    metricas, 
    proyectos, 
    kpis, 
    loading, 
    refreshMetricas: fetchDatos,
    eliminarMetrica 
  };
};