import React, { useState } from 'react';
import { useRecursosViewModel } from '../../viewmodels/useRecursosViewModel';
import { validarNombre, validarEmail, validarPassword, validarSueldo, validarTextoCorto } from '../../components/validaciones';
import CollapsibleCard from '../../components/CollapsibleCard';
import { globalStyles } from '../../components/theme';

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

  const [erroresForm, setErroresForm] = useState({});
  const [errorCat, setErrorCat] = useState(null);
  const [errorCar, setErrorCar] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    const nuevosErrores = {
      nombre: errNombre,
      email: errEmail,
      password: errPass,
      sueldo: errSueldo,
      cargoId: errCargo,
      categoriaId: errCategoria
    };

    setErroresForm(nuevosErrores);

    if (Object.values(nuevosErrores).some(error => error !== null)) {
      return; 
    }

    if (modoEdicion !== null) {
      const res = await editarTrabajador(modoEdicion, formData);
      if (res.success) {
        alert(`Colaborador (ID: ${modoEdicion}) actualizado exitosamente.`);
        cancelarEdicion();
      } else {
        alert("Error al actualizar: " + res.message); 
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
        <div style={globalStyles.card}>
          <h4 style={{ margin: '0 0 8px 0' }}>Total Personal</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : usuarios.length}</p>
        </div>
        <div style={globalStyles.card}>
          <h4 style={{ margin: '0 0 8px 0' }}>Categorías</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : categorias.length}</p>
        </div>
        <div style={globalStyles.card}>
          <h4 style={{ margin: '0 0 8px 0' }}>Cargos</h4>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{loading ? '...' : cargos.length}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* CATEGORÍAS */}
        <CollapsibleCard title="Gestionar Categorías (Roles)" isOpen={isOpenCategorias} setIsOpen={setIsOpenCategorias}>
          <form onSubmit={onSubmitCategoria} style={globalStyles.inputGroup} autoComplete="off">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <input 
                style={errorCat ? globalStyles.inputError : globalStyles.input} 
                value={newCat} 
                onChange={(e) => { setNewCat(e.target.value); setErrorCat(null); }} 
                placeholder="Nombre de la categoría" required maxLength="50"
                autoComplete="nope"
              />
              {errorCat && <span style={globalStyles.errorText}>{errorCat}</span>}
            </div>
            <button type="submit" style={{...globalStyles.btn, height: 'fit-content'}}>Crear</button>
          </form>
          <ul style={globalStyles.list}>
            {categorias.length === 0 ? (
              <li style={{ fontStyle: 'italic', color: '#666', padding: '5px 0' }}>No hay categorías registradas.</li>
            ) : categorias.map(c => (
              <li key={c.id} style={globalStyles.listItem}>
                <span>{c.categoria}</span>
                <button style={globalStyles.btnDanger} onClick={() => eliminarCategoria(c.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </CollapsibleCard>

        {/* CARGOS */}
        <CollapsibleCard title="Gestionar Cargos" isOpen={isOpenCargos} setIsOpen={setIsOpenCargos}>
          <form onSubmit={onSubmitCargo} style={globalStyles.inputGroup} autoComplete="off">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <input 
                style={errorCar ? globalStyles.inputError : globalStyles.input} 
                value={newCar} 
                onChange={(e) => { setNewCar(e.target.value); setErrorCar(null); }} 
                placeholder="Nombre del cargo" required maxLength="50" 
                autoComplete="nope"
              />
              {errorCar && <span style={globalStyles.errorText}>{errorCar}</span>}
            </div>
            <button type="submit" style={{...globalStyles.btn, height: 'fit-content'}}>Crear</button>
          </form>
          <ul style={globalStyles.list}>
            {cargos.length === 0 ? (
              <li style={{ fontStyle: 'italic', color: '#666', padding: '5px 0' }}>No hay cargos registrados.</li>
            ) : cargos.map(c => (
              <li key={c.id} style={globalStyles.listItem}>
                <span>{c.nombreCargo}</span>
                <button style={globalStyles.btnDanger} onClick={() => eliminarCargo(c.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </CollapsibleCard>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* BÚSQUEDA */}
        <CollapsibleCard title="Buscar Trabajador por ID" isOpen={isOpenBuscar} setIsOpen={setIsOpenBuscar}>
          <form onSubmit={onSubmitBuscar} style={{ ...globalStyles.inputGroup, maxWidth: '420px', alignItems: 'flex-start' }} autoComplete="off">
            <input 
              style={globalStyles.input} type="number" value={buscarId} 
              onChange={(e) => setBuscarId(e.target.value)} 
              placeholder="ID del Colaborador" required min="1"
              autoComplete="nope"
            />
            <button type="submit" style={globalStyles.btn} disabled={buscarLoading}>
              {buscarLoading ? 'Buscando...' : 'Buscar'}
            </button>
            {(usuarioEncontrado || buscarError) && (
              <button type="button" onClick={handleLimpiarBusqueda} style={globalStyles.btn}>Limpiar</button>
            )}
          </form>

          {buscarError && ( <div style={globalStyles.alertDanger}>{buscarError}</div> )}

          {usuarioEncontrado && (
            <div style={{ border: '1px solid black', padding: '15px', backgroundColor: '#fff', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>Ficha del Trabajador (ID: {usuarioEncontrado.id})</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={globalStyles.btnEdit} onClick={() => iniciarEdicion(usuarioEncontrado)}>Editar</button>
                  <button style={globalStyles.btnDanger} onClick={() => onEliminarTrabajador(usuarioEncontrado.id, usuarioEncontrado.nombre)}>Eliminar</button>
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
              <button onClick={cancelarEdicion} style={{ ...globalStyles.btn, marginLeft: '15px', fontSize: '12px', padding: '4px 8px' }}>
                Cancelar Edición
              </button>
            </div>
          )}
          
          <form onSubmit={onSubmitTrabajador} style={globalStyles.formGrid} autoComplete="off" noValidate>
            {/* TRAMPA NAVEGADOR */}
            <div style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}>
              <input type="text" name="fake_email_hook" tabIndex="-1" autoComplete="username" />
              <input type="password" name="fake_password_hook" tabIndex="-1" autoComplete="current-password" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Nombre Completo (Máx 80 caract.) *</label>
              <input name="nombre" placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={handleInput} maxLength="80" autoComplete="nope"
                style={erroresForm.nombre ? globalStyles.inputError : globalStyles.input} 
              />
              {erroresForm.nombre && <span style={globalStyles.errorText}>{erroresForm.nombre}</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Correo Electrónico *{modoEdicion !== null ? '(no editable)' : ''}</label>
              <input name="email" type="text" placeholder="correo@empresa.com" value={formData.email} onChange={handleInput} disabled={modoEdicion !== null} autoComplete="off"
                style={erroresForm.email ? { ...globalStyles.inputError, backgroundColor: modoEdicion !== null ? '#f3f4f6' : 'white' } : { ...globalStyles.input, backgroundColor: modoEdicion !== null ? '#f3f4f6' : 'white', color: modoEdicion !== null ? '#9ca3af' : 'black' }} 
              />
              {erroresForm.email && <span style={globalStyles.errorText}>{erroresForm.email}</span>}
            </div>

            {modoEdicion === null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={globalStyles.label}>Contraseña (mínimo 6 caract.) *</label>
                <input name="password" type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleInput} minLength="6" maxLength="20" autoComplete="new-password"
                  style={erroresForm.password ? globalStyles.inputError : globalStyles.input} 
                />
                {erroresForm.password && <span style={globalStyles.errorText}>{erroresForm.password}</span>}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Sueldo (Mín: 539.000) *</label>
              <input name="sueldo" type="number" placeholder="Ej: 850000" value={formData.sueldo} onChange={handleInput} min="539000" autoComplete="nope"
                style={erroresForm.sueldo ? globalStyles.inputError : globalStyles.input} 
              />
              {erroresForm.sueldo && <span style={globalStyles.errorText}>{erroresForm.sueldo}</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Cargo *</label>
              <select name="cargoId" value={formData.cargoId} onChange={handleInput} style={erroresForm.cargoId ? globalStyles.inputError : globalStyles.input}>
                <option value="">Seleccione un Cargo</option>
                {cargos.map(c => <option key={c.id} value={c.id}>{c.nombreCargo}</option>)}
              </select>
              {erroresForm.cargoId && <span style={globalStyles.errorText}>{erroresForm.cargoId}</span>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={globalStyles.label}>Categoría (Rol de acceso) *</label>
              <select name="categoriaId" value={formData.categoriaId} onChange={handleInput} style={erroresForm.categoriaId ? globalStyles.inputError : globalStyles.input}>
                <option value="">Seleccione una Categoría</option>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.categoria}</option>)}
              </select>
              {erroresForm.categoriaId && <span style={globalStyles.errorText}>{erroresForm.categoriaId}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ ...globalStyles.btn, padding: '10px 20px' }} disabled={loading}>
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
            <table style={globalStyles.table}>
              <thead>
                <tr>
                  <th style={globalStyles.th}>Nombre</th><th style={globalStyles.th}>Email</th>
                  <th style={globalStyles.th}>Cargo</th><th style={globalStyles.th}>Categoría</th><th style={globalStyles.th}>Sueldo</th>
                  <th style={{ ...globalStyles.th, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ ...globalStyles.td, textAlign: 'center', fontStyle: 'italic' }}>
                      {loading ? 'Cargando trabajadores...' : 'No hay trabajadores registrados.'}
                    </td>
                  </tr>
                ) : (
                  usuarios.map(u => (
                    <tr key={u.id} style={{ backgroundColor: modoEdicion === u.id ? '#fef9c3' : 'transparent' }}>
                      <td  style={globalStyles.td}>{u.nombre}</td><td style={globalStyles.td}>{u.email}</td>
                      <td style={globalStyles.td}>{u.cargo?.nombreCargo || 'N/A'}</td><td style={globalStyles.td}>{u.categoria?.categoria || 'N/A'}</td>
                      <td style={globalStyles.td}>${u.sueldo?.toLocaleString() || '0'}</td>
                      <td style={{ ...globalStyles.td, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button style={globalStyles.btnEdit} onClick={() => iniciarEdicion(u)}>Editar</button>
                          <button style={globalStyles.btnDanger} onClick={() => onEliminarTrabajador(u.id, u.nombre)}>Eliminar</button>
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

export default RecursosView;