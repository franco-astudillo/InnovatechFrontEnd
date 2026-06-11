import React, { useState } from 'react';
import { useMiPerfilViewModel } from '../../viewmodels/useMiPerfilViewModel';
import CollapsibleCard from '../../components/CollapsibleCard';
import { globalStyles } from '../../components/theme';

const MiPerfilView = () => {
  const { perfil, loading, error } = useMiPerfilViewModel();
  
  const [isOpenDatosPersonales, setIsOpenDatosPersonales] = useState(true);
  const [isOpenDatosLaborales, setIsOpenDatosLaborales] = useState(true);

  if (loading) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Cargando tu perfil...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div style={globalStyles.alertDanger}>{error}</div>
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div style={{ padding: '10px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '25px', color: '#6b7280' }}>Mi Perfil</h2>

      {/* Tarjeta de Resumen Rápido */}
      <div style={{ ...globalStyles.card, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#e0e7ff', border: '1px solid #6b7280' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#6b7280', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
          {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#6b7280', fontSize: '24px' }}>{perfil.nombre}</h3>
          <p style={{ margin: '0', color: '#334155', fontSize: '16px' }}>
            <span style={{ fontWeight: 'bold' }}>Rol actual:</span> {perfil.categoria?.categoria || 'Sin Categoría'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* DATOS PERSONALES */}
        <CollapsibleCard title="Mis Datos Personales" isOpen={isOpenDatosPersonales} setIsOpen={setIsOpenDatosPersonales}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Nombre Completo</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{perfil.nombre}</p>
            </div>
            
            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Correo Electrónico</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{perfil.email}</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Estado en Plataforma</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: perfil.activo ? '#6b7280' : '#6b7280' }}>
                {perfil.activo ? 'Activo' : 'Desconectado'}
              </p>
            </div>
          </div>
        </CollapsibleCard>

        {/* DATOS LABORALES */}
        <CollapsibleCard title="Información Laboral" isOpen={isOpenDatosLaborales} setIsOpen={setIsOpenDatosLaborales}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Cargo Asignado</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{perfil.cargo?.nombreCargo || 'No asignado'}</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Categoría / Nivel de Acceso</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{perfil.categoria?.categoria || 'No asignada'}</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ ...globalStyles.label, color: '#6b7280', display: 'block', marginBottom: '4px' }}>Sueldo Base</label>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                ${perfil.sueldo ? perfil.sueldo.toLocaleString('es-CL') : '0'} CLP
              </p>
            </div>
          </div>
        </CollapsibleCard>

      </div>
    </div>
  );
};

export default MiPerfilView;