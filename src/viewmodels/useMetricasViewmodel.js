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
      // 2. Descargamos también las tareas globales desde la base de datos
      const [metricasData, proyectosData, tareasData] = await Promise.all([
        MetricasService.getAll(),
        ProyectoService.getProyectos(),
        TableroService.getTareas().catch(() => []) // Obtenemos todas las tareas
      ]);

      const activeMetricas = metricasData || [];
      const todasLasTareas = tareasData || [];
      
      const proyectosConProgreso = (proyectosData || []).map(proyecto => {
        // 3. Cruzamos los datos: Filtramos solo las tareas que pertenecen a ESTE proyecto
        const tareasDelProyecto = todasLasTareas.filter(t => 
          t.proyecto?.id === proyecto.id || t.proyectoId === proyecto.id
        );

        const totalTareas = tareasDelProyecto.length;
        
        // 4. Ahora sí contamos las completadas (usando t.progreso)
        const tareasCompletadas = tareasDelProyecto.filter(t => t.progreso === 'COMPLETADA').length;
        
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