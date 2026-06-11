import React, { useState } from 'react';
import { useMiPerfilViewModel } from '../../viewmodels/useMiPerfilViewModel';
import CollapsibleCard from '../../components/CollapsibleCard';
import { globalStyles, colors } from '../../components/theme';

const MiPerfilView = () => {
  const { perfil, proyectos, tareas, loading, error } = useMiPerfilViewModel();
  
  const [isOpenDatos, setIsOpenDatos] = useState(true);
  const [isOpenProyectos, setIsOpenProyectos] = useState(true);
  const [isOpenTareas, setIsOpenTareas] = useState(true);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Cargando tu perfil...</h2>;
  if (error) return <div style={globalStyles.alertDanger}>{error}</div>;
  if (!perfil) return null;

  return (
    <div style={{ padding: '10px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '25px', color: '#1e3a8a' }}>Mi Perfil</h2>

      <div style={{ ...globalStyles.card, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#e0e7ff', border: '1px solid #1d4ed8' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
          {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '24px' }}>{perfil.nombre}</h3>
          <p style={{ margin: '0', color: '#334155', fontSize: '16px' }}>
            <span style={{ fontWeight: 'bold' }}>Rol actual:</span> {perfil.categoria?.categoria || 'Sin Categoría'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <CollapsibleCard title="Datos Personales y Laborales" isOpen={isOpenDatos} setIsOpen={setIsOpenDatos}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Correo Electrónico</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{perfil.email}</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Cargo</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{perfil.cargo?.nombreCargo || 'N/A'}</p>
            </div>
          </div>
        </CollapsibleCard>

        {/* PROYECTOS DONDE ES JEFE */}
        <CollapsibleCard title={`Proyectos a mi Cargo (${proyectos.length})`} isOpen={isOpenProyectos} setIsOpen={setIsOpenProyectos}>
          {proyectos.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#666' }}>No tienes proyectos a tu cargo en este momento.</p>
          ) : (
            <ul style={globalStyles.list}>
              {proyectos.map((p, index) => (
                <li key={index} style={{ ...globalStyles.listItem, flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#fff', padding: '15px', border: `1px solid ${colors.border}`, borderRadius: '4px', marginBottom: '10px' }}>
                  {/* Cambiamos p.nombre por p.nombreProyecto */}
                  <h4 style={{ margin: '0 0 8px 0', color: colors.primary }}>{p.nombreProyecto}</h4>
                  
                  {/* Cambiamos p.descripcion por p.descripcionProyecto */}
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: colors.text }}>
                    <strong>Descripción:</strong> {p.descripcionProyecto}
                  </p>
                  
                  {/* Reemplazamos la lógica de estado haciéndola directamente en el Front */}
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', backgroundColor: p.activo ? '#dcfce7' : '#f3f4f6', color: p.activo ? '#166534' : '#374151', marginTop: '5px' }}>
                    Estado: {p.activo ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleCard>

        {/* TAREAS ASIGNADAS */}
        <CollapsibleCard title={`Mis Tareas Asignadas (${tareas.length})`} isOpen={isOpenTareas} setIsOpen={setIsOpenTareas}>
          {tareas.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#666' }}>No tienes tareas asignadas en este momento.</p>
          ) : (
            <ul style={globalStyles.list}>
              {tareas.map((asignacion, index) => (
                <li key={index} style={{ ...globalStyles.listItem, flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#fff', padding: '15px', border: `1px solid ${colors.border}`, borderRadius: '4px', marginBottom: '10px' }}>
                  
                  {/* Cambiamos asignacion.tarea.nombre por asignacion.tarea.nombreTareas */}
                  <h4 style={{ margin: '0 0 8px 0', color: colors.primary }}>
                    {asignacion.tarea?.nombreTareas || 'Tarea sin nombre'}
                  </h4>
                  
                  {/* Cambiamos el nombre del proyecto anidado */}
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#4b5563' }}>
                    <strong>Proyecto:</strong> {asignacion.tarea?.proyecto?.nombreProyecto || 'N/A'}
                  </p>
                  
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                    Asignado el: {new Date(asignacion.fechaAsignacion).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleCard>

      </div>
    </div>
  );
};

export default MiPerfilView;