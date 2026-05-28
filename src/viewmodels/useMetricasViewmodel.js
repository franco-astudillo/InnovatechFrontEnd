import { useState, useEffect } from 'react';
import { MetricasService } from '../service/MetricasService';
import { ProyectoService } from '../service/ProyectoService'; // Importamos el servicio de proyectos

export const useMetricasViewModel = () => {
  const [metricas, setMetricas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario de nueva métrica
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
      // Cargamos métricas y proyectos al mismo tiempo
      const [metricasData, proyectosData] = await Promise.all([
        MetricasService.getAll(),
        ProyectoService.getProyectos() // Asume que tienes un método listar() o getAll() en ProyectoService
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

  const crearMetrica = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        nombreKpi: nuevaMetrica.nombreKpi,
        valorCalculado: parseFloat(nuevaMetrica.valorCalculado),
        proyectoId: nuevaMetrica.proyectoId ? parseInt(nuevaMetrica.proyectoId) : null,
        fechaCalculo: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
      };

      await MetricasService.create(dto);
      alert('Métrica creada exitosamente');
      
      // Limpiamos el formulario y recargamos los datos
      setNuevaMetrica({ nombreKpi: '', valorCalculado: '', proyectoId: '' });
      fetchDatos();
    } catch (error) {
      console.error("Error al crear métrica:", error);
      alert('Hubo un error al crear la métrica');
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
    manejarCambioFormulario,
    crearMetrica,
    refreshMetricas: fetchDatos
  };
};