import React, { useState } from 'react';
import { useTableroViewModel } from '../../viewmodels/useTableroViewModel';
import CollapsibleCard from '../../components/CollapsibleCard';
import { globalStyles, colors } from '../../components/theme';

const TableroTrabajoView = () => {
  const { 
    tareas, proyectosList, usuariosList, loading, error, 
    cargarTablero, agregarTareaYAsignar, cambiarProgreso, eliminarTarea 
  } = useTableroViewModel();

  const [isOpenForm, setIsOpenForm] = useState(true);
  const [formData, setFormData] = useState({
    nombreTareas: '',
    descripcionTareas: '',
    proyectoId: '',
    usuarioId: '',
    progreso: 'Pendiente',
    estado: true
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombreTareas || !formData.proyectoId) {
      alert("El nombre de la tarea y el proyecto asociado son obligatorios.");
      return;
    }

    const res = await agregarTareaYAsignar(formData);
    if (res.success) {
      alert("Tarea creada exitosamente en el Tablero.");
      setFormData({ nombreTareas: '', descripcionTareas: '', proyectoId: '', usuarioId: '', progreso: 'Pendiente', estado: true });
    } else {
      alert("Error: " + res.message);
    }
  };

  const onEliminar = async (id, nombre) => {
    if (window.confirm(`¿Deseas eliminar permanentemente la tarea "${nombre}"?`)) {
      await eliminarTarea(id);
    }
  };

  // Separación de columnas
  const pendientes = tareas.filter(t => t.progreso === 'Pendiente' && t.estado);
  const enProceso = tareas.filter(t => t.progreso === 'En Proceso' && t.estado);
  const completadas = tareas.filter(t => t.progreso === 'Completado' && t.estado);

  const renderKanbanCard = (tarea) => (
    <div key={tarea.id} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '12px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h5 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{tarea.nombreTareas}</h5>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6b7280' }}>
        <strong>Proyecto:</strong> {tarea.nombreProyectoAsociado}
      </p>
      {tarea.descripcionTareas && (
        <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontStyle: 'italic' }}>{tarea.descripcionTareas}</p>
      )}
      
      {/* Indicador de Responsable */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: colors.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
          {tarea.nombreResponsable.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{tarea.nombreResponsable}</span>
      </div>

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <select 
          value={tarea.progreso} 
          onChange={(e) => cambiarProgreso(tarea, e.target.value)}
          style={{ ...globalStyles.input, padding: '4px', fontSize: '12px', flex: 1, minWidth: '110px' }}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
        </select>
        <button type="button" onClick={() => onEliminar(tarea.id, tarea.nombreTareas)} style={{ ...globalStyles.btnDanger, padding: '4px 8px', fontSize: '11px' }}>
          Eliminar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '10px', maxWidth: '1300px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Tablero Kanban de Operaciones</h2>
      
      {error && <div style={globalStyles.alertDanger}>{error}</div>}

      {/* FORMULARIO DE CREACIÓN */}
      <div style={{ marginBottom: '20px' }}>
        <CollapsibleCard title="Registrar y Asignar Nueva Tarea" isOpen={isOpenForm} setIsOpen={setIsOpenForm}>
          <form onSubmit={handleSubmit} style={globalStyles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Nombre de Tarea *</label>
              <input name="nombreTareas" placeholder="Ej: Migración de Base de Datos" value={formData.nombreTareas} onChange={handleInput} style={globalStyles.input} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Vincular al Proyecto *</label>
              <select name="proyectoId" value={formData.proyectoId} onChange={handleInput} style={globalStyles.input} required>
                <option value="">Seleccione Proyecto</option>
                {proyectosList.filter(p => p.activo).map(p => (
                  <option key={p.id} value={p.id}>{p.nombreProyecto}</option>
                ))}
              </select>
            </div>

            {/* SELECCIONADOR DE USUARIO CORREGIDO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Asignar a Colaborador</label>
              <select name="usuarioId" value={formData.usuarioId} onChange={handleInput} style={globalStyles.input}>
                <option value="">Asignar más tarde (Sin responsable)</option>
                {usuariosList.map(u => (
                   // Usamos estrictamente uidFirebase para sincronizar la asignación
                   <option key={u.id} value={u.uidFirebase}>
                     {u.nombre} {u.cargo?.nombreCargo ? `— ${u.cargo.nombreCargo}` : ''}
                   </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
              <label style={globalStyles.label}>Descripción</label>
              <input name="descripcionTareas" placeholder="Detalles operativos de la tarea..." value={formData.descripcionTareas} onChange={handleInput} style={globalStyles.input} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <button type="submit" style={globalStyles.btn} disabled={loading}>
                {loading ? 'Procesando...' : 'Registrar y Asignar Tarea'}
              </button>
            </div>
          </form>
        </CollapsibleCard>
      </div>

      {/* KANBAN BOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
        
        {/* COLUMNA PENDIENTES */}
        <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', borderTop: '4px solid #9ca3af' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#4b5563', display: 'flex', justifyContent: 'space-between' }}>
            PENDIENTE <span style={{ backgroundColor: '#d1d5db', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{pendientes.length}</span>
          </h3>
          {loading && pendientes.length === 0 ? <p style={{ fontSize: '13px', color: '#6b7280' }}>Cargando...</p> : pendientes.map(renderKanbanCard)}
          {!loading && pendientes.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>No hay tareas pendientes.</p>}
        </div>

        {/* COLUMNA EN PROCESO */}
        <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '6px', borderTop: '4px solid #3b82f6' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1d4ed8', display: 'flex', justifyContent: 'space-between' }}>
            EN PROCESO <span style={{ backgroundColor: '#bfdbfe', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{enProceso.length}</span>
          </h3>
          {loading && enProceso.length === 0 ? <p style={{ fontSize: '13px', color: '#6b7280' }}>Cargando...</p> : enProceso.map(renderKanbanCard)}
          {!loading && enProceso.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>No hay tareas en proceso.</p>}
        </div>

        {/* COLUMNA COMPLETADO */}
        <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '6px', borderTop: '4px solid #22c55e' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#15803d', display: 'flex', justifyContent: 'space-between' }}>
            COMPLETADO <span style={{ backgroundColor: '#bbf7d0', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{completadas.length}</span>
          </h3>
          {loading && completadas.length === 0 ? <p style={{ fontSize: '13px', color: '#6b7280' }}>Cargando...</p> : completadas.map(renderKanbanCard)}
          {!loading && completadas.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>No hay tareas completadas.</p>}
        </div>

      </div>
    </div>
  );
};

export default TableroTrabajoView;