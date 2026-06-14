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

  // 1. Proyectos: Solo los que están en curso (activo === true)
  const proyectosEnCurso = proyectos.filter(p => p.activo === true);

  const tareasEnCurso = tareas.filter(asignacion => {
    // Si la variable viene vacía por error, asumimos que no está completada
    const estadoProgreso = asignacion.tarea?.progreso || '';
    return estadoProgreso !== 'Completado'; 
  });

  return (
    <div style={{ padding: '10px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Título principal en gris muy oscuro */}
      <h2 style={{ marginBottom: '25px', color: '#1f2937' }}>Mi Perfil</h2>

      {/* HEADER DEL PERFIL: ESCALA DE GRISES CORPORATIVA */}
      <div style={{ ...globalStyles.card, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        {/* Círculo del Avatar: Fondo gris oscuro sólido */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#374151', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#1f2937', fontSize: '24px' }}>{perfil.nombre}</h3>
          <p style={{ margin: '0', color: '#4b5563', fontSize: '16px' }}>
            <span style={{ fontWeight: 'bold', color: '#374151' }}>Rol actual:</span> {perfil.cargo?.nombreCargo || perfil.categoria?.categoria || 'Sin Categoría'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <CollapsibleCard title="Datos Personales y Laborales" isOpen={isOpenDatos} setIsOpen={setIsOpenDatos}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '10px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Correo Electrónico</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#374151' }}>{perfil.email}</p>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Cargo</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#374151' }}>{perfil.cargo?.nombreCargo || 'N/A'}</p>
            </div>
          </div>
        </CollapsibleCard>

        {/* PROYECTOS DONDE ES JEFE */}
        <CollapsibleCard title={`Proyectos en Curso (${proyectosEnCurso.length})`} isOpen={isOpenProyectos} setIsOpen={setIsOpenProyectos}>
          {proyectosEnCurso.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#6b7280' }}>No tienes proyectos en curso en este momento.</p>
          ) : (
            <ul style={globalStyles.list}>
              {proyectosEnCurso.map((p, index) => (
                <li key={index} style={{ ...globalStyles.listItem, flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#ffffff', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '10px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{p.nombreProyecto}</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#4b5563' }}>
                    <strong style={{ color: '#374151' }}>Descripción:</strong> {p.descripcionProyecto}
                  </p>
                  {/* Etiqueta de Estado en tonos grises */}
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', marginTop: '5px', fontWeight: '500' }}>
                    Estado: ACTIVO
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleCard>

        {/* TAREAS ASIGNADAS */}
        <CollapsibleCard title={`Mis Tareas Pendientes (${tareasEnCurso.length})`} isOpen={isOpenTareas} setIsOpen={setIsOpenTareas}>
          {tareasEnCurso.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#6b7280' }}>No tienes tareas pendientes o en proceso.</p>
          ) : (
            <ul style={globalStyles.list}>
              {tareasEnCurso.map((asignacion, index) => (
                <li key={index} style={{ ...globalStyles.listItem, flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#ffffff', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '10px' }}>
                  
                  <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
                    {asignacion.tarea?.nombreTareas || 'Tarea sin nombre'}
                  </h4>
                  
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#4b5563' }}>
                    <strong style={{ color: '#374151' }}>Proyecto:</strong> {asignacion.tarea?.proyecto?.nombreProyecto || 'N/A'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                      Asignado el: {new Date(asignacion.fechaAsignacion).toLocaleDateString()}
                    </p>
                    {asignacion.tarea?.progreso && (
                      <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontWeight: '500' }}>
                        {asignacion.tarea.progreso}
                      </span>
                    )}
                  </div>
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