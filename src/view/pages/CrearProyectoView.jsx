import React, { useState } from 'react';
import { useMiProyectoViewModel } from '../../viewmodels/useMiProyectoViewModel';
import CollapsibleCard from '../../components/CollapsibleCard';
import { globalStyles, colors } from '../../components/theme';

const CrearProyectoView = () => {
  const { 
    proyectos, usuariosRecursos, loading, error, cargarProyectos,
    agregarProyecto, editarProyecto, borrarProyecto 
  } = useMiProyectoViewModel();

  const [isOpenFormulario, setIsOpenFormulario] = useState(true);
  const [isOpenListado, setIsOpenListado] = useState(true);

  const [modoEdicion, setModoEdicion] = useState(null);
  const [formData, setFormData] = useState({
    nombreProyecto: '', descripcionProyecto: '', jefeId: '', activo: true
  });

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const iniciarEdicion = (proyecto) => {
    setModoEdicion(proyecto.id);
    setFormData({
      nombreProyecto: proyecto.nombreProyecto || '',
      descripcionProyecto: proyecto.descripcionProyecto || '',
      jefeId: proyecto.jefeId || '',
      activo: proyecto.activo
    });
    setIsOpenFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setModoEdicion(null);
    setFormData({ nombreProyecto: '', descripcionProyecto: '', jefeId: '', activo: true });
  };

  const onSubmitProyecto = async (e) => {
    e.preventDefault();

    if (!formData.nombreProyecto.trim() || !formData.jefeId) {
      alert("El nombre del proyecto y el jefe responsable son obligatorios.");
      return;
    }

    if (modoEdicion !== null) {
      const res = await editarProyecto(modoEdicion, formData);
      if (res.success) {
        alert("Proyecto modificado correctamente.");
        cancelarEdicion();
      } else {
        alert("Error al actualizar proyecto: " + res.message);
      }
    } else {
      const res = await agregarProyecto(formData);
      if (res.success) {
        alert("Proyecto registrado y dado de alta exitosamente.");
        setFormData({ nombreProyecto: '', descripcionProyecto: '', jefeId: '', activo: true });
      } else {
        alert("Error al registrar proyecto: " + res.message);
      }
    }
  };

  const onEliminarProyecto = async (id, nombre) => {
    const confirmar = window.confirm(`¿Está seguro de desactivar al proyecto "${nombre}"? Esta acción ejecutará la baja en cascada de sus componentes asociados.`);
    if (!confirmar) return;
    
    const res = await borrarProyecto(id);
    if (res.success) {
      alert("Proyecto desactivado correctamente.");
    } else {
      alert("Error al desactivar: " + res.message);
    }
  };

  return (
    <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Dashboard de Gestión Operativa de Proyectos</h2>

      {/* FORMULARIO UNIFICADO (POST / PUT) */}
      <div style={{ marginBottom: '20px' }}>
        <CollapsibleCard 
          title={modoEdicion !== null ? 'Modificar Parámetros de Proyecto' : 'Registrar Nuevo Proyecto'} 
          isOpen={isOpenFormulario} setIsOpen={setIsOpenFormulario}
        >
          {modoEdicion !== null && (
            <div style={{ backgroundColor: '#fef9c3', border: '1px solid #ca8a04', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
              <strong>Modo Edición:</strong> Estás reconfigurando los parámetros de un proyecto. Los cambios se aplicarán al instante.
              <button type="button" onClick={cancelarEdicion} style={{ ...globalStyles.btn, marginLeft: '15px', fontSize: '12px', padding: '4px 8px' }}>
                Cancelar Edición
              </button>
            </div>
          )}
          
          <form onSubmit={onSubmitProyecto} style={globalStyles.formGrid} autoComplete="off">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Nombre del Proyecto *</label>
              <input 
                name="nombreProyecto" 
                placeholder="Ej: Desarrollo Módulo Proyectos" 
                value={formData.nombreProyecto} 
                onChange={handleInput}
                style={globalStyles.input}
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Jefe de Proyecto Responsable *</label>
              <select 
                name="jefeId" 
                value={formData.jefeId} 
                onChange={handleInput} 
                style={globalStyles.input}
                required
              >
                <option value="">Seleccione un Colaborador</option>
                {usuariosRecursos.map(u => {
                  const uidRealDeFirebase = u.uidFirebase || u.uid || u.firebaseUid || "";
                  
                  return (
                    <option key={u.id} value={uidRealDeFirebase}>
                      {u.nombre} {u.cargo?.nombreCargo ? `— ${u.cargo.nombreCargo}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
              <label style={globalStyles.label}>Descripción General</label>
              <input 
                name="descripcionProyecto" 
                placeholder="Objetivos e hitos principales del proyecto..." 
                value={formData.descripcionProyecto} 
                onChange={handleInput}
                style={globalStyles.input}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1', marginTop: '5px' }}>
              <input 
                type="checkbox" 
                name="activo" 
                id="activoProyectoForm"
                checked={formData.activo} 
                onChange={handleInput}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="activoProyectoForm" style={{ ...globalStyles.label, cursor: 'pointer' }}>Proyecto Activo en la Organización</label>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px', gridColumn: '1 / -1' }}>
              <button type="submit" style={{ ...globalStyles.btn, padding: '10px 20px' }} disabled={loading}>
                {loading ? 'Procesando...' : (modoEdicion !== null ? 'Guardar Cambios' : 'Registrar Proyecto')}
              </button>
            </div>
          </form>
        </CollapsibleCard>
      </div>

      {/* TABLA PRINCIPAL DEL DASHBOARD CON ACCIONES */}
      <CollapsibleCard title="Listado de Control de Proyectos" isOpen={isOpenListado} setIsOpen={setIsOpenListado}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          {proyectos.length > 0 && (
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>
              Registros en Base de Datos: <strong>{proyectos.length}</strong> proyecto(s).
            </p>
          )}
          <button type="button" onClick={cargarProyectos} style={globalStyles.btn} disabled={loading}>
            {loading ? 'Sincronizando...' : 'Sincronizar Tabla'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={globalStyles.table}>
            <thead>
              <tr>
                <th style={globalStyles.th}>Nombre del Proyecto</th>
                <th style={globalStyles.th}>Descripción</th>
                <th style={globalStyles.th}>Estado</th>
                <th style={globalStyles.th}>Jefe de Proyecto</th>
                <th style={{ ...globalStyles.th, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ ...globalStyles.td, textAlign: 'center', fontStyle: 'italic' }}>
                    {loading ? 'Cargando registros...' : 'No hay proyectos registrados.'}
                  </td>
                </tr>
              ) : (
                proyectos.map(p => (
                  <tr key={p.id} style={{ backgroundColor: modoEdicion === p.id ? '#fef9c3' : 'transparent' }}>
                    <td style={globalStyles.td}><strong>{p.nombreProyecto}</strong></td>
                    <td style={globalStyles.td}>{p.descripcionProyecto || 'Sin descripción'}</td>
                    
                    {/* ETIQUETA VISUAL UNIFICADA */}
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
                    <td style={{ ...globalStyles.td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button type="button" style={globalStyles.btnEdit} onClick={() => iniciarEdicion(p)}>Editar</button>
                        <button 
                          type="button" 
                          style={globalStyles.btnDanger} 
                          onClick={() => onEliminarProyecto(p.id, p.nombreProyecto)}
                          disabled={!p.activo}
                        >
                          Eliminar
                        </button>
                      </div>
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

export default CrearProyectoView;