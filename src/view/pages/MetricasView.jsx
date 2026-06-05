import React, { useState } from 'react';
import { useMetricasViewModel } from '../../viewmodels/useMetricasViewmodel';

const MetricasView = () => {
  const { 
    metricas, proyectos, kpis, loading, refreshMetricas, 
    nuevaMetrica, metricaEditando, manejarCambioFormulario, 
    guardarMetrica, iniciarEdicion, cancelarEdicion, eliminarMetrica 
  } = useMetricasViewModel();
  
  const [isOpenListado, setIsOpenListado] = useState(true);
  const [isOpenFormulario, setIsOpenFormulario] = useState(true);

  const obtenerNombreProyecto = (id) => {
    if (!id) return 'Global / Sin Asignar';
    const proyecto = proyectos.find(p => p.id === id);
    return proyecto ? proyecto.nombre : `Proyecto ID: ${id}`;
  };

  return (
    <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard de Métricas e Indicadores</h2>
        <button onClick={refreshMetricas} style={btnStyle} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Datos'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Métricas Registradas</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : kpis.totalMetricas}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Última Sincronización</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : kpis.ultimaActualizacion}</p>
        </div>
      </div>

      {/* Formulario Adaptado para Crear/Editar */}
      <CollapsibleCard title={metricaEditando ? "Editar Métrica" : "Asignar Nueva Métrica a Proyecto"} isOpen={isOpenFormulario} setIsOpen={setIsOpenFormulario}>
        <form onSubmit={guardarMetrica} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <label style={labelStyle}>Proyecto:</label>
            <select name="proyectoId" value={nuevaMetrica.proyectoId} onChange={manejarCambioFormulario} style={inputStyle}>
              <option value="">Seleccione un Proyecto (Opcional)</option>
              {proyectos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <label style={labelStyle}>Nombre del KPI:</label>
            <input 
              type="text" name="nombreKpi" required
              placeholder="Ej: Progreso Tareas..." 
              value={nuevaMetrica.nombreKpi} onChange={manejarCambioFormulario} 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <label style={labelStyle}>Valor Calculado:</label>
            <input 
              type="number" step="0.01" name="valorCalculado" required
              placeholder="Ej: 85.5" 
              value={nuevaMetrica.valorCalculado} onChange={manejarCambioFormulario} 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ ...btnStyle, height: '38px', padding: '0 20px' }}>
              {metricaEditando ? 'Actualizar Métrica' : 'Guardar Métrica'}
            </button>
            {metricaEditando && (
              <button type="button" onClick={cancelarEdicion} style={{ ...btnStyle, height: '38px', padding: '0 20px' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </CollapsibleCard>

      {/* Listado de Métricas con Botones */}
      <CollapsibleCard title="Listado Histórico de Métricas" isOpen={isOpenListado} setIsOpen={setIsOpenListado}>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Proyecto Asociado</th>
                <th style={thStyle}>Nombre KPI</th>
                <th style={thStyle}>Valor</th>
                <th style={thStyle}>Fecha de Cálculo</th>
                <th style={{...thStyle, textAlign: 'center'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!metricas || metricas.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>
                    {loading ? 'Cargando métricas...' : 'No hay métricas registradas.'}
                  </td>
                </tr>
              ) : (
                metricas.map(m => (
                  <tr key={m.id}>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{obtenerNombreProyecto(m.proyectoId)}</td>
                    <td style={tdStyle}>{m.nombreKpi}</td>
                    <td style={tdStyle}>{m.valorCalculado}</td>
                    <td style={tdStyle}>{m.fechaCalculo}</td>
                    <td style={{...tdStyle, textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center'}}>
                      <button 
                        onClick={() => iniciarEdicion(m)} 
                        style={{ ...btnStyle, padding: '4px 8px', fontSize: '13px' }}>
                        Editar
                      </button>
                      <button 
                        onClick={() => eliminarMetrica(m.id)} 
                        style={{ ...btnStyle, padding: '4px 8px', fontSize: '13px' }}>
                        Eliminar
                      </button>
                    </td>
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

// Estilos
const cardStyle = { padding: '20px', border: '1px solid black', flex: '1 1 200px', backgroundColor: '#f0f0f0' };
const sectionStyle = { padding: '20px', border: '1px solid black', backgroundColor: '#f9f9f9', marginBottom: '20px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '10px' };
const thStyle = { padding: '8px', border: '1px solid black', backgroundColor: '#e0e0e0', textAlign: 'left' };
const tdStyle = { padding: '8px', border: '1px solid black' };
const btnStyle = { padding: '8px 12px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#e0e0e0', color: 'black', fontWeight: '500' };
const labelStyle = { marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' };
const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', height: '38px', boxSizing: 'border-box' };

const CollapsibleCard = ({ title, children, isOpen, setIsOpen }) => {
  return (
    <div style={sectionStyle}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isOpen ? '1px solid black' : 'none', paddingBottom: isOpen ? '10px' : '0', userSelect: 'none' }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{isOpen ? '▲ Contraer' : '▼ Expandir'}</span>
      </div>
      {isOpen && ( <div style={{ marginTop: '15px' }}>{children}</div> )}
    </div>
  );
};

export default MetricasView;