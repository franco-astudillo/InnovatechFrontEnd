import React, { useMemo } from 'react';
import { useMetricasViewModel } from '../../viewmodels/useMetricasViewmodel';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { colors, globalStyles } from '../../components/theme';

const MonitoreoView = () => {
  const { proyectos, metricas, loading } = useMetricasViewModel();

  const { proyectosActivos, progresoGlobal, totalTareasGlobal, tareasCompletadasGlobal } = useMemo(() => {
    const listaProyectos = proyectos || [];
    const listaMetricas = metricas || [];

    // 1. Filtramos solo los proyectos activos
    const activos = listaProyectos.filter(p => p.activo);

    // 2. CRUZAMOS LOS DATOS: Unimos el proyecto (Spring Boot) con su métrica (Node.js)
    const proyectosConMetricas = activos.map(proyecto => {
      
      // Buscamos la métrica histórica de este proyecto usando proyectoId
      // Usamos String() para asegurar que "1" y 1 coincidan correctamente
      const metrica = listaMetricas.find(m => String(m.proyectoId) === String(proyecto.id));

      // Si existe la métrica, extraemos valorCalculado. Si no, usamos 0.
      const progresoReal = metrica ? parseFloat(metrica.valorCalculado) : 0;

      return {
        ...proyecto,
        // Limpiamos el número para evitar demasiados decimales (ej: 8.33333... -> 8.33)
        progreso: isNaN(progresoReal) ? 0 : Number(progresoReal.toFixed(2)),
        // Mantenemos las tareas que ya trae tu backend en Java
        tareasCompletadas: proyecto.tareasCompletadas || 0,
        totalTareas: proyecto.totalTareas || 0
      };
    });

    // 3. Calculamos los totales
    const totalTareas = proyectosConMetricas.reduce((acc, p) => acc + (p.totalTareas || 0), 0);
    const completadas = proyectosConMetricas.reduce((acc, p) => acc + (p.tareasCompletadas || 0), 0);
    
    // Calculamos el promedio global exacto basado en el 'valorCalculado' de todas las métricas activas
    let progresoGlobalPromedio = 0;
    if (proyectosConMetricas.length > 0) {
      const sumaPorcentajes = proyectosConMetricas.reduce((acc, p) => acc + p.progreso, 0);
      progresoGlobalPromedio = Math.round(sumaPorcentajes / proyectosConMetricas.length);
    }

    return {
      proyectosActivos: proyectosConMetricas,
      progresoGlobal: progresoGlobalPromedio,
      totalTareasGlobal: totalTareas,
      tareasCompletadasGlobal: completadas
    };
  }, [proyectos, metricas]);

  // Aseguramos que el gráfico circular no falle si el progreso global sobrepasa el 100%
  const dataGrafico = [
    { name: 'Completado', value: progresoGlobal > 100 ? 100 : progresoGlobal },
    { name: 'Pendiente', value: 100 - progresoGlobal < 0 ? 0 : 100 - progresoGlobal }
  ];

  const COLOR_COMPLETADO = colors.primary; 
  const COLOR_PENDIENTE = '#d1d5db'; 
  const COLORS = [COLOR_COMPLETADO, COLOR_PENDIENTE];

  const layoutStyles = {
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' },
    mainDashboard: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' },
  };

  if (loading) {
    return <div style={{ ...globalStyles.section, textAlign: 'center', color: colors.text }}>Cargando métricas de producción...</div>;
  }

  return (
    <div style={{ ...globalStyles.section, border: 'none' }}>
      
      <h1 style={{ color: colors.text, fontSize: '28px', margin: '0 0 5px 0' }}>
        Monitoreo de Producción
      </h1>
      <p style={{ color: colors.text, opacity: 0.8, margin: '0 0 25px 0', fontSize: '14px' }}>
        Resumen en tiempo real del estado de los proyectos
      </p>

      {/* SECCIÓN 1: Tarjetas KPI */}
      <div style={layoutStyles.kpiGrid}>
        <div style={{ ...globalStyles.card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: colors.text, fontSize: '13px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Proyectos Activos
          </h3>
          <p style={{ color: colors.text, fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            {proyectosActivos.length}
          </p>
        </div>
        
        <div style={{ ...globalStyles.card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: colors.text, fontSize: '13px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Progreso Global
          </h3>
          <p style={{ color: colors.primary, fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            {progresoGlobal}%
          </p>
        </div>
        
        <div style={{ ...globalStyles.card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: colors.text, fontSize: '13px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Tareas Completadas
          </h3>
          <p style={{ color: colors.text, fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            {tareasCompletadasGlobal} / {totalTareasGlobal}
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: Panel Principal con el Gráfico Circular */}
      <div style={layoutStyles.mainDashboard}>
        
        <div style={{ ...globalStyles.card, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ color: colors.text, fontSize: '16px', margin: '0 0 20px 0', width: '100%', textAlign: 'left', fontWeight: '600' }}>
            Estado General de Producción
          </h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dataGrafico}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke={colors.border} 
                >
                  {dataGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECCIÓN 3: Desglose por Proyecto */}
        <div style={{ ...globalStyles.card }}>
          <h2 style={{ color: colors.text, fontSize: '16px', margin: '0 0 20px 0', fontWeight: '600' }}>
            Desglose por Proyecto
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}>
            {proyectosActivos.map((proyecto) => (
              <div key={proyecto.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.text, fontWeight: '500', fontSize: '14px' }}>
                    {proyecto.nombreProyecto}
                  </span>
                  <span style={{ color: colors.text, fontWeight: 'bold', fontSize: '14px' }}>
                    {proyecto.progreso}%
                  </span>
                </div>
                {/* Barra de progreso */}
                <div style={{ 
                  width: '100%', 
                  height: '12px', 
                  backgroundColor: colors.primaryBg, 
                  border: `1px solid ${colors.border}` 
                }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${proyecto.progreso > 100 ? 100 : proyecto.progreso}%`,
                      backgroundColor: colors.primary, 
                      transition: 'width 0.5s ease-in-out'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonitoreoView;