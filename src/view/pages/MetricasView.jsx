import React, { useState } from 'react';
import { useMetricasViewModel } from '../../viewmodels/useMetricasViewmodel';

const MetricasView = () => {
  const { metricas, proyectos, kpis, loading, refreshMetricas } = useMetricasViewModel();
  const [isOpenListado, setIsOpenListado] = useState(true);

  const obtenerNombreProyecto = (id) => {
    if (!id) return 'Global / Sin Asignar';
    const proyecto = proyectos.find(p => p.id === id);
    return proyecto ? proyecto.nombreProyecto || proyecto.nombre : `Proyecto ID: ${id}`;
  };

  return (
    <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard de Métricas e Indicadores</h2>
        <button onClick={refreshMetricas} style={btnStyle} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Datos'}
        </button>
      </div>

      {/* Tarjetas Informativas Generales */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Métricas Históricas Registradas</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
            {loading ? '...' : kpis.totalMetricas}
          </p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Última Sincronización</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
            {loading ? '...' : kpis.ultimaActualizacion}
          </p>
        </div>
      </div>

      {/* Listado de Métricas de Solo Lectura */}
      <CollapsibleCard title="Registro Histórico" isOpen={isOpenListado} setIsOpen={setIsOpenListado}>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre Proyecto</th>
                <th style={thStyle}>(%) Realizado</th>
                <th style={thStyle}>Última Actualización</th>
              </tr>
            </thead>
            <tbody>
              {!metricas || metricas.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>
                    {loading ? 'Sincronizando métricas...' : 'El sistema aún no ha autogenerado métricas.'}
                  </td>
                </tr>
              ) : (
                metricas.map(m => (
                  <tr key={m.id}>
                    <td style={tdStyle}><strong>{obtenerNombreProyecto(m.proyectoId)}</strong></td>
                    <td style={tdStyle}>{m.valorCalculado}%</td>
                    <td style={tdStyle}>{new Date(m.fechaCalculo).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CollapsibleCard>
    </div>
  );
};

// --- Estilos Básicos (Homologados con ResumenRrhhView) ---
const cardStyle = { padding: '20px', border: '1px solid black', flex: '1 1 200px', backgroundColor: '#f0f0f0' };
const sectionStyle = { padding: '20px', border: '1px solid black', backgroundColor: '#f9f9f9' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '10px' };
const thStyle = { padding: '8px', border: '1px solid black', backgroundColor: '#e0e0e0', textAlign: 'left' };
const tdStyle = { padding: '8px', border: '1px solid black' };
const btnStyle = { padding: '8px 12px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#e0e0e0', color: 'black', fontWeight: '500' };

// Componente Tarjeta Colapsable (Homologado con ResumenRrhhView)
const CollapsibleCard = ({ title, children, isOpen, setIsOpen }) => {
  return (
    <div style={sectionStyle}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          cursor: 'pointer', borderBottom: isOpen ? '1px solid black' : 'none',
          paddingBottom: isOpen ? '10px' : '0px', userSelect: 'none'
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{isOpen ? '▲ Contraer' : '▼ Expandir'}</span>
      </div>
      {isOpen && ( <div style={{ marginTop: '15px' }}>{children}</div> )}
    </div>
  );
};

export default MetricasView;