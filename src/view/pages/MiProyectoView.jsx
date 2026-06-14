import React, { useState } from 'react';
import { useMiProyectoViewModel } from '../../viewmodels/useMiProyectoViewModel';
import { globalStyles, colors } from '../../components/theme';
import CollapsibleCard from '../../components/CollapsibleCard';

const MiProyectoView = () => {
  const { proyectos, loading, error, cargarProyectos } = useMiProyectoViewModel();
  const [isOpenListado, setIsOpenListado] = useState(true);

  const proyectosActivos = proyectos.filter(p => p.activo).length;

  return (
    <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Resumen Corporativo de Proyectos</h2>

      {/* Tarjetas de Resumen */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={globalStyles.card}>
          <h4 style={{ margin: '0 0 8px 0' }}>Total Proyectos</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : proyectos.length}</p>
        </div>
        <div style={globalStyles.card}>
          <h4 style={{ margin: '0 0 8px 0', color: '#166534' }}>Proyectos Activos</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0', color: '#15803d' }}>
            {loading ? '...' : proyectosActivos}
          </p>
        </div>
      </div>

      {error && <div style={globalStyles.alertDanger}>{error}</div>}

      <CollapsibleCard title="Listado General de Proyectos" isOpen={isOpenListado} setIsOpen={setIsOpenListado}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button type="button" onClick={cargarProyectos} style={globalStyles.btn} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Tabla'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={globalStyles.table}>
            <thead>
              <tr>
                <th style={globalStyles.th}>Nombre del Proyecto</th>
                <th style={globalStyles.th}>Descripción</th>
                <th style={globalStyles.th}>Estado</th>
                <th style={globalStyles.th}>Jefe de Proyecto Responsable</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ ...globalStyles.td, textAlign: 'center', fontStyle: 'italic' }}>
                    {loading ? 'Cargando proyectos y resolviendo lideres...' : 'No hay proyectos registrados.'}
                  </td>
                </tr>
              ) : (
                proyectos.map(p => (
                  <tr key={p.id}>
                    <td style={globalStyles.td}><strong>{p.nombreProyecto}</strong></td>
                    <td style={globalStyles.td}>{p.descripcionProyecto || 'Sin descripción'}</td>
                    <td style={globalStyles.td}>
                      <span style={{
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        backgroundColor: p.activo ? '#dcfce7' : '#fef2f2',
                        color: p.activo ? '#166534' : '#991b1b'
                      }}>
                        {p.activo ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td style={{ ...globalStyles.td, color: colors.primary, fontWeight: '600' }}>{p.jefeNombre}</td>
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

export default MiProyectoView;