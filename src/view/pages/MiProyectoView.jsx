import React, { useState } from 'react';
import { useMiProyectoViewModel } from '../../viewmodels/useMiProyectoViewModel';

const MiProyectoView = () => {
  const { proyectos, loading, error, cargarProyectos } = useMiProyectoViewModel();
  const [isOpenListado, setIsOpenListado] = useState(true);

  // Calculamos cuántos proyectos están activos
  const proyectosActivos = proyectos.filter(p => p.activo).length;

  return (
    <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Gestión de Proyectos</h2>

      {/* Tarjetas de Resumen (Mismo estilo que RecursosView) */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 8px 0' }}>Total Proyectos</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : proyectos.length}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 8px 0', color: '#166534' }}>Proyectos Activos</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0', color: '#15803d' }}>
            {loading ? '...' : proyectosActivos}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', border: '1px solid #fca5a5', marginBottom: '20px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* LISTADO DE PROYECTOS */}
      <CollapsibleCard title="Listado de Proyectos" isOpen={isOpenListado} setIsOpen={setIsOpenListado}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button onClick={cargarProyectos} style={btnStyle} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Tabla'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre del Proyecto</th>
                <th style={thStyle}>Descripción</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>ID Jefe</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>
                    {loading ? 'Cargando proyectos...' : 'No hay proyectos registrados.'}
                  </td>
                </tr>
              ) : (
                proyectos.map(p => (
                  <tr key={p.id}>
                    <td style={tdStyle}><strong>{p.nombreProyecto}</strong></td>
                    <td style={tdStyle}>{p.descripcionProyecto || 'Sin descripción'}</td>
                    <td style={tdStyle}>
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
                    <td style={tdStyle}>{p.jefeId || 'N/A'}</td>
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

//estilos 
const cardStyle = { padding: '15px', border: '1px solid black', flex: '1 1 150px', backgroundColor: '#f0f0f0' };
const sectionStyle = { padding: '15px', border: '1px solid black', backgroundColor: '#f9f9f9' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '5px' };
const thStyle = { padding: '8px', border: '1px solid black', backgroundColor: '#e0e0e0', textAlign: 'left', whiteSpace: 'nowrap' };
const tdStyle = { padding: '8px', border: '1px solid black', verticalAlign: 'middle' };
const btnStyle = { padding: '8px 12px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#e0e0e0', color: 'black', fontWeight: '500', whiteSpace: 'nowrap' };

//Las card que ocupamos
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

export default MiProyectoView;