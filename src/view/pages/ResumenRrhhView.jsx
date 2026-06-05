import React, { useState } from 'react';
import { useResumenRrhhViewModel } from '../../viewmodels/useResumenRrhhViewModel';
// Importamos el ViewModel de recursos solo para traer la lista de trabajadores
import { useRecursosViewModel } from '../../viewmodels/useRecursosViewModel';

const ResumenRrhhView = () => {
  const { kpis, loading, refreshKpis } = useResumenRrhhViewModel();
  const { usuarios } = useRecursosViewModel(); // Traemos la lista de usuarios

  // Estado para controlar si la lista está abierta o colapsada
  const [isOpenListado, setIsOpenListado] = useState(true);

  return (
    <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Resumen del Personal (KPI de Recursos)</h2>
        <button onClick={refreshKpis} style={btnStyle} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Datos'}
        </button>
      </div>

      {/* Tarjetas Informativas Generales */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Colaboradores Activos</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : kpis.totalPersonal}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Cargos Registrados</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : kpis.totalCargos}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Categorías (Roles)</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : kpis.totalCategorias}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Sueldo Promedio</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : `$${kpis.sueldoPromedio.toLocaleString()}`}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* Distribución por Cargo */}
        <div style={sectionStyle}>
          <h3>Distribución por Cargos</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Cargo</th>
                <th style={thStyle}>Cantidad de Trabajadores</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="2" style={{ ...tdStyle, textAlign: 'center' }}>Cargando datos...</td></tr>
              ) : kpis.distribucionCargos.length === 0 ? (
                <tr><td colSpan="2" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>No hay información de cargos.</td></tr>
              ) : (
                kpis.distribucionCargos.map((cargo, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{cargo.nombreCargo}</td>
                    <td style={tdStyle}>{cargo.cantidad} {cargo.cantidad === 1 ? 'Trabajador' : 'Trabajadores'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Distribución por Categoría */}
        <div style={sectionStyle}>
          <h3>Distribución por Categorías / Permisos</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Cantidad de Trabajadores</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="2" style={{ ...tdStyle, textAlign: 'center' }}>Cargando datos...</td></tr>
              ) : kpis.distribucionCategorias.length === 0 ? (
                <tr><td colSpan="2" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>No hay información de categorías.</td></tr>
              ) : (
                kpis.distribucionCategorias.map((cat, index) => (
                  <tr key={index}>
                    <td style={tdStyle}><strong>{cat.categoria}</strong></td>
                    <td style={tdStyle}>{cat.cantidad} {cat.cantidad === 1 ? 'Trabajador' : 'Trabajadores'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Listado de Trabajadores (Solo vista) */}
      <CollapsibleCard title="Listado de Trabajadores" isOpen={isOpenListado} setIsOpen={setIsOpenListado}>
        {usuarios && usuarios.length > 0 && (
          <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#555' }}>
            Total: <strong>{usuarios.length}</strong> trabajador(es) registrado(s).
          </p>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Cargo</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Sueldo</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {!usuarios || usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>
                    {loading ? 'Cargando trabajadores...' : 'No hay trabajadores registrados.'}
                  </td>
                </tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.id}>
                    <td style={tdStyle}>{u.nombre}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>{u.cargo?.nombreCargo || 'N/A'}</td>
                    <td style={tdStyle}>{u.categoria?.categoria || 'N/A'}</td>
                    <td style={tdStyle}>${u.sueldo?.toLocaleString() || '0'}</td>
                    <td style={tdStyle}>
                      {u.logeado ? (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>Activo</span>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>Inactivo</span>
                      )}
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

// Estilos Básicos
const cardStyle = { padding: '20px', border: '1px solid black', flex: '1 1 200px', backgroundColor: '#f0f0f0' };
const sectionStyle = { padding: '20px', border: '1px solid black', backgroundColor: '#f9f9f9' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '10px' };
const thStyle = { padding: '8px', border: '1px solid black', backgroundColor: '#e0e0e0', textAlign: 'left' };
const tdStyle = { padding: '8px', border: '1px solid black' };
const btnStyle = { padding: '8px 12px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#e0e0e0', color: 'black', fontWeight: '500' };

// Componente Tarjeta Colapsable
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

export default ResumenRrhhView;