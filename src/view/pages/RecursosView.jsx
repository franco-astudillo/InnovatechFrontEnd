import React, { useState } from 'react';
import { useRecursosViewModel } from '../../viewmodels/useRecursosViewModel';
import { validarNombre, validarEmail, validarPassword, validarSueldo, validarTextoCorto } from '../../components/validaciones';

const RecursosView = () => {
  const { 
    usuarios, categorias, cargos, loading, 
    agregarCategoria, agregarCargo, eliminarCategoria, eliminarCargo,
    agregarTrabajador,editarTrabajador, eliminarTrabajador,
    usuarioEncontrado,buscarLoading,buscarError, buscarUsuarioPorId,limpiarBusqueda
  } = useRecursosViewModel();

  const [isOpenCategorias, setIsOpenCategorias] = useState(true);
  const [isOpenCargos, setIsOpenCargos] = useState(true);
  const [isOpenBuscar, setIsOpenBuscar] = useState(true);
  const [isOpenFormTrabajador, setIsOpenFormTrabajador] = useState(true);
  const [isOpenListado, setIsOpenListado] = useState(true);

  const [newCat, setNewCat] = useState('');
  const [newCar, setNewCar] = useState('');

  const [buscarId, setBuscarId] = useState('');
  
  const [modoEdicion, setModoEdicion] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', sueldo: '', cargoId: '', categoriaId: ''
  });

  // --- NUEVOS ESTADOS PARA MANEJAR ERRORES EN PANTALLA ---
  const [erroresForm, setErroresForm] = useState({});
  const [errorCat, setErrorCat] = useState(null);
  const [errorCar, setErrorCar] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiamos el error de este input en cuanto el usuario empieza a escribir
    setErroresForm({ ...erroresForm, [name]: null });
  };

  const iniciarCrear = () => {
    setModoEdicion(null);
    setFormData({ nombre: '', email: '', password: '', sueldo: '', cargoId: '', categoriaId: '' });
    setErroresForm({});
    setIsOpenFormTrabajador(true);
  };

  const iniciarEdicion = (usuario) => {
    setModoEdicion(usuario.id);
    setFormData({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      password: '',
      sueldo: usuario.sueldo || '',
      cargoId: usuario.cargo?.id || '',
      categoriaId: usuario.categoria?.id || ''
    });
    setErroresForm({});
    setIsOpenFormTrabajador(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setModoEdicion(null);
    setFormData({ nombre: '', email: '', password: '', sueldo: '', cargoId: '', categoriaId: '' });
    setErroresForm({});
  };

  const onSubmitTrabajador = async (e) => {
    e.preventDefault();

    // --- EJECUTAR VALIDACIONES ---
    const errNombre = validarNombre(formData.nombre);
    const errSueldo = validarSueldo(formData.sueldo);
    let errEmail = null;
    let errPass = null;

    if (modoEdicion === null) {
      errEmail = validarEmail(formData.email);
      errPass = validarPassword(formData.password);
    }

    const errCargo = !formData.cargoId ? "Debe seleccionar un Cargo obligatorio." : null;
    const errCategoria = !formData.categoriaId ? "Debe seleccionar una Categoría obligatoria." : null;

    // Guardamos los errores en el estado
    const nuevosErrores = {
      nombre: errNombre,
      email: errEmail,
      password: errPass,
      sueldo: errSueldo,
      cargoId: errCargo,
      categoriaId: errCategoria
    };

    setErroresForm(nuevosErrores);

    // Si algún campo tiene un texto de error (no es null), detenemos el envío
    if (Object.values(nuevosErrores).some(error => error !== null)) {
      return; 
    }
    // -----------------------------

    if (modoEdicion !== null) {
      const res = await editarTrabajador(modoEdicion, formData);
      if (res.success) {
        alert(`Colaborador (ID: ${modoEdicion}) actualizado exitosamente.`);
        cancelarEdicion();
      } else {
        alert("Error al actualizar: " + res.message); // Mantenemos alert solo para errores graves del backend
      }
    } else {
      const res = await agregarTrabajador(formData);
      if (res.success) {
        alert("Trabajador registrado exitosamente en Firebase y base de datos.");
        setFormData({ nombre: '', email: '', password: '', sueldo: '', cargoId: '', categoriaId: '' });
      } else {
        alert("Error al registrar: " + res.message);
      }
    }
  };

  const onEliminarTrabajador = async (id, nombre) => {
    const confirmar = window.confirm(`¿Está seguro de que desea eliminar al trabajador "${nombre}" (ID: ${id})? Esta acción no se puede deshacer.`);
    if (!confirmar) return;
    const res = await eliminarTrabajador(id);
    if (!res.success) {
      alert("Error al eliminar: " + res.message);
    }
  };

  const onSubmitCategoria = (e) => {
    e.preventDefault();
    const error = validarTextoCorto(newCat, "Categoría");
    if (error) {
      setErrorCat(error);
      return;
    }
    setErrorCat(null);
    agregarCategoria(newCat);
    setNewCat('');
  };

  const onSubmitCargo = (e) => {
    e.preventDefault();
    const error = validarTextoCorto(newCar, "Cargo");
    if (error) {
      setErrorCar(error);
      return;
    }
    setErrorCar(null);
    agregarCargo(newCar);
    setNewCar('');
  };

  const onSubmitBuscar = (e) => {
    e.preventDefault();
    buscarUsuarioPorId(buscarId.trim());
  };

  const handleLimpiarBusqueda = () => {
    limpiarBusqueda();
    setBuscarId('');
  };

  return (
    <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Dashboard de Recursos Humanos</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 8px 0' }}>Total Personal</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : usuarios.length}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 8px 0' }}>Categorías</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : categorias.length}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 8px 0' }}>Cargos</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : cargos.length}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* CATEGORÍAS */}
        <CollapsibleCard title="Gestionar Categorías (Roles)" isOpen={isOpenCategorias} setIsOpen={setIsOpenCategorias}>
          <form onSubmit={onSubmitCategoria} style={inputGroupStyle}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <input 
                style={errorCat ? inputErrorStyle : inputStyle} 
                value={newCat} 
                onChange={(e) => { setNewCat(e.target.value); setErrorCat(null); }} 
                placeholder="Nombre de la categoría" required maxLength="50"
              />
              {errorCat && <span style={errorTextStyle}>{errorCat}</span>}
            </div>
            <button type="submit" style={{...btnStyle, height: 'fit-content'}}>Crear</button>
          </form>
          <ul style={listStyle}>
            {categorias.length === 0 ? (
              <li style={{ fontStyle: 'italic', color: '#666', padding: '5px 0' }}>No hay categorías registradas.</li>
            ) : categorias.map(c => (
              <li key={c.id} style={listItemStyle}>
                <span><strong>#{c.id}</strong> — {c.categoria}</span>
                <button style={btnDangerStyle} onClick={() => eliminarCategoria(c.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </CollapsibleCard>

        {/* CARGOS */}
        <CollapsibleCard title="Gestionar Cargos" isOpen={isOpenCargos} setIsOpen={setIsOpenCargos}>
          <form onSubmit={onSubmitCargo} style={inputGroupStyle}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <input 
                style={errorCar ? inputErrorStyle : inputStyle} 
                value={newCar} 
                onChange={(e) => { setNewCar(e.target.value); setErrorCar(null); }} 
                placeholder="Nombre del cargo" required maxLength="50" 
              />
              {errorCar && <span style={errorTextStyle}>{errorCar}</span>}
            </div>
            <button type="submit" style={{...btnStyle, height: 'fit-content'}}>Crear</button>
          </form>
          <ul style={listStyle}>
            {cargos.length === 0 ? (
              <li style={{ fontStyle: 'italic', color: '#666', padding: '5px 0' }}>No hay cargos registrados.</li>
            ) : cargos.map(c => (
              <li key={c.id} style={listItemStyle}>
                <span><strong>#{c.id}</strong> — {c.nombreCargo}</span>
                <button style={btnDangerStyle} onClick={() => eliminarCargo(c.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </CollapsibleCard>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* BÚSQUEDA */}
        <CollapsibleCard title="Buscar Trabajador por ID" isOpen={isOpenBuscar} setIsOpen={setIsOpenBuscar}>
          <form onSubmit={onSubmitBuscar} style={{ ...inputGroupStyle, maxWidth: '420px', alignItems: 'flex-start' }}>
            <input 
              style={inputStyle} type="number" value={buscarId} 
              onChange={(e) => setBuscarId(e.target.value)} 
              placeholder="ID del Colaborador" required min="1"
            />
            <button type="submit" style={btnStyle} disabled={buscarLoading}>
              {buscarLoading ? 'Buscando...' : 'Buscar'}
            </button>
            {(usuarioEncontrado || buscarError) && (
              <button type="button" onClick={handleLimpiarBusqueda} style={btnStyle}>Limpiar</button>
            )}
          </form>

          {buscarError && ( <div style={alertDangerStyle}>{buscarError}</div> )}

          {usuarioEncontrado && (
            <div style={{ border: '1px solid black', padding: '15px', backgroundColor: '#fff', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>Ficha del Trabajador (ID: {usuarioEncontrado.id})</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={btnEditStyle} onClick={() => iniciarEdicion(usuarioEncontrado)}>Editar</button>
                  <button style={btnDangerStyle} onClick={() => onEliminarTrabajador(usuarioEncontrado.id, usuarioEncontrado.nombre)}>Eliminar</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                <p style={{ margin: '4px 0' }}><strong>Nombre:</strong> {usuarioEncontrado.nombre}</p>
                <p style={{ margin: '4px 0' }}><strong>Email:</strong> {usuarioEncontrado.email}</p>
                <p style={{ margin: '4px 0' }}><strong>Sueldo:</strong> ${usuarioEncontrado.sueldo?.toLocaleString() || '0'}</p>
                <p style={{ margin: '4px 0' }}><strong>Cargo:</strong> {usuarioEncontrado.cargo?.nombreCargo || 'N/A'}</p>
                <p style={{ margin: '4px 0' }}><strong>Categoría:</strong> {usuarioEncontrado.categoria?.categoria || 'N/A'}</p>
              </div>
            </div>
          )}
        </CollapsibleCard>

        {/* FORMULARIO TRABAJADOR */}
        <CollapsibleCard 
          title={modoEdicion !== null ? `Editando Trabajador (ID: ${modoEdicion})` : 'Registrar Nuevo Trabajador'} 
          isOpen={isOpenFormTrabajador} setIsOpen={setIsOpenFormTrabajador}
        >
          {modoEdicion !== null && (
            <div style={{ backgroundColor: '#fef9c3', border: '1px solid #ca8a04', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
              <strong>Editar trabajador:</strong> Solo se pueden modificar el nombre, sueldo, cargo y categoría.
              <button onClick={cancelarEdicion} style={{ ...btnStyle, marginLeft: '15px', fontSize: '12px', padding: '4px 8px' }}>
                Cancelar Edición
              </button>
            </div>
          )}
          
          {/* Usamos noValidate para apagar las validaciones nativas de HTML y usar las nuestras en React */}
          <form onSubmit={onSubmitTrabajador} style={formGridStyle} autoComplete="off" noValidate>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Nombre Completo (Máx 80 caract.) *</label>
              <input name="nombre" placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={handleInput} maxLength="80" autoComplete="off"
                style={erroresForm.nombre ? inputErrorStyle : inputStyle} 
              />
              {erroresForm.nombre && <span style={errorTextStyle}>{erroresForm.nombre}</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Correo Electrónico *{modoEdicion !== null ? '(no editable)' : ''}</label>
              <input name="email" type="email" placeholder="correo@empresa.com" value={formData.email} onChange={handleInput} disabled={modoEdicion !== null} autoComplete="new-password"
                style={erroresForm.email ? { ...inputErrorStyle, backgroundColor: modoEdicion !== null ? '#f3f4f6' : 'white' } : { ...inputStyle, backgroundColor: modoEdicion !== null ? '#f3f4f6' : 'white', color: modoEdicion !== null ? '#9ca3af' : 'black' }} 
              />
              {erroresForm.email && <span style={errorTextStyle}>{erroresForm.email}</span>}
            </div>

            {modoEdicion === null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={labelStyle}>Contraseña (mínimo6 caract.) *</label>
                <input name="password" type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleInput} minLength="6" maxLength="20" autoComplete="new-password"
                  style={erroresForm.password ? inputErrorStyle : inputStyle} 
                />
                {erroresForm.password && <span style={errorTextStyle}>{erroresForm.password}</span>}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Sueldo (Mín: 539.000) *</label>
              <input name="sueldo" type="number" placeholder="Ej: 850000" value={formData.sueldo} onChange={handleInput} min="539000" autoComplete="off"
                style={erroresForm.sueldo ? inputErrorStyle : inputStyle} 
              />
              {erroresForm.sueldo && <span style={errorTextStyle}>{erroresForm.sueldo}</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Cargo *</label>
              <select name="cargoId" value={formData.cargoId} onChange={handleInput} style={erroresForm.cargoId ? inputErrorStyle : inputStyle}>
                <option value="">Seleccione un Cargo</option>
                {cargos.map(c => <option key={c.id} value={c.id}>{c.nombreCargo}</option>)}
              </select>
              {erroresForm.cargoId && <span style={errorTextStyle}>{erroresForm.cargoId}</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Categoría (Rol de acceso) *</label>
              <select name="categoriaId" value={formData.categoriaId} onChange={handleInput} style={erroresForm.categoriaId ? inputErrorStyle : inputStyle}>
                <option value="">Seleccione una Categoría</option>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.categoria}</option>)}
              </select>
              {erroresForm.categoriaId && <span style={errorTextStyle}>{erroresForm.categoriaId}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ ...btnStyle, padding: '10px 20px' }} disabled={loading}>
                {loading ? 'Procesando...' : (modoEdicion !== null ? 'Guardar Cambios' : 'Crear Cuenta y Ficha')}
              </button>
            </div>
          </form>
        </CollapsibleCard>

        {/* LISTADO */}
        <CollapsibleCard title="Listado de Trabajadores" isOpen={isOpenListado} setIsOpen={setIsOpenListado}>
          {usuarios.length > 0 && (
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#555' }}>
              Total: <strong>{usuarios.length}</strong> trabajador(es) registrado(s).
            </p>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th><th style={thStyle}>Nombre</th><th style={thStyle}>Email</th>
                  <th style={thStyle}>Cargo</th><th style={thStyle}>Categoría</th><th style={thStyle}>Sueldo</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ ...tdStyle, textAlign: 'center', fontStyle: 'italic' }}>
                      {loading ? 'Cargando trabajadores...' : 'No hay trabajadores registrados.'}
                    </td>
                  </tr>
                ) : (
                  usuarios.map(u => (
                    <tr key={u.id} style={{ backgroundColor: modoEdicion === u.id ? '#fef9c3' : 'transparent' }}>
                      <td style={tdStyle}>{u.id}</td><td style={tdStyle}>{u.nombre}</td><td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>{u.cargo?.nombreCargo || 'N/A'}</td><td style={tdStyle}>{u.categoria?.categoria || 'N/A'}</td>
                      <td style={tdStyle}>${u.sueldo?.toLocaleString() || '0'}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button style={btnEditStyle} onClick={() => iniciarEdicion(u)}>Editar</button>
                          <button style={btnDangerStyle} onClick={() => onEliminarTrabajador(u.id, u.nombre)}>Eliminar</button>
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
    </div>
  );
};

// --- ESTILOS ---
const cardStyle = { padding: '15px', border: '1px solid black', flex: '1 1 150px', backgroundColor: '#f0f0f0' };
const sectionStyle = { padding: '15px', border: '1px solid black', backgroundColor: '#f9f9f9' };

// Estilos de Input Normal y con Error
const inputStyle = { padding: '8px', border: '1px solid #777', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' };
const inputErrorStyle = { ...inputStyle, border: '2px solid #dc2626', backgroundColor: '#fef2f2' };
const errorTextStyle = { color: '#dc2626', fontSize: '12px', marginTop: '2px', fontWeight: 'bold' };

const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#334155' };
const inputGroupStyle = { display: 'flex', gap: '8px', marginBottom: '15px' };
const listStyle = { paddingLeft: '0', listStyle: 'none', margin: '0' };
const listItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '5px' };
const thStyle = { padding: '8px', border: '1px solid black', backgroundColor: '#e0e0e0', textAlign: 'left', whiteSpace: 'nowrap' };
const tdStyle = { padding: '8px', border: '1px solid black', verticalAlign: 'middle' };
const btnStyle = { padding: '8px 12px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#e0e0e0', color: 'black', fontWeight: '500', whiteSpace: 'nowrap' };
const btnEditStyle = { padding: '5px 10px', cursor: 'pointer', border: '1px solid #1d4ed8', backgroundColor: '#dbeafe', color: '#1e3a8a', fontWeight: '500', whiteSpace: 'nowrap' };
const btnDangerStyle = { padding: '5px 10px', cursor: 'pointer', border: '1px solid #991b1b', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: '500', whiteSpace: 'nowrap' };
const alertDangerStyle = { color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', border: '1px solid #fca5a5', marginTop: '10px', borderRadius: '4px' };

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

export default RecursosView;