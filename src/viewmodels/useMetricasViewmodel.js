import { useState, useEffect } from 'react';
import { MetricasService } from '../service/MetricasService';
import { ProyectoService } from '../service/ProyectoService'; 

export const useMetricasViewModel = () => {
  const [metricas, setMetricas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nuevo estado para saber si estamos editando
  const [metricaEditando, setMetricaEditando] = useState(null);

  const [nuevaMetrica, setNuevaMetrica] = useState({
    nombreKpi: '',
    valorCalculado: '',
    proyectoId: ''
  });

  const [kpis, setKpis] = useState({
    totalMetricas: 0,
    ultimaActualizacion: null
  });

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const [metricasData, proyectosData] = await Promise.all([
        MetricasService.getAll(),
        ProyectoService.getProyectos() 
      ]);

      const activeMetricas = metricasData || [];
      setMetricas(activeMetricas);
      setProyectos(proyectosData || []);

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

  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target;
    setNuevaMetrica({ ...nuevaMetrica, [name]: value });
  };

  // Cargar datos en el formulario para editar
  const iniciarEdicion = (metrica) => {
    setMetricaEditando(metrica);
    setNuevaMetrica({
      nombreKpi: metrica.nombreKpi,
      valorCalculado: metrica.valorCalculado,
      proyectoId: metrica.proyectoId || ''
    });
  };

  // Limpiar el formulario y salir del modo edición
  const cancelarEdicion = () => {
    setMetricaEditando(null);
    setNuevaMetrica({ nombreKpi: '', valorCalculado: '', proyectoId: '' });
  };

  // Función unificada para Guardar o Actualizar
  const guardarMetrica = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        nombreKpi: nuevaMetrica.nombreKpi,
        valorCalculado: parseFloat(nuevaMetrica.valorCalculado),
        proyectoId: nuevaMetrica.proyectoId ? parseInt(nuevaMetrica.proyectoId) : null,
        fechaCalculo: metricaEditando ? metricaEditando.fechaCalculo : new Date().toISOString().split('T')[0]
      };

      if (metricaEditando) {
        await MetricasService.update(metricaEditando.id, dto);
        alert('Métrica actualizada exitosamente');
      } else {
        await MetricasService.create(dto);
        alert('Métrica creada exitosamente');
      }
      
      cancelarEdicion();
      fetchDatos();
    } catch (error) {
      console.error("Error al guardar métrica:", error);
      alert('Hubo un error al guardar la métrica');
    }
  };

  // Función para eliminar
  const eliminarMetrica = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta métrica? Esta acción no se puede deshacer.')) {
      try {
        await MetricasService.delete(id);
        alert('Métrica eliminada exitosamente');
        fetchDatos(); 
      } catch (error) {
        console.error("Error al eliminar métrica:", error);
        alert('Hubo un error al eliminar la métrica');
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
    nuevaMetrica,
    metricaEditando,
    manejarCambioFormulario,
    guardarMetrica,
    iniciarEdicion,
    cancelarEdicion,
    eliminarMetrica,
    refreshMetricas: fetchDatos
  };
};