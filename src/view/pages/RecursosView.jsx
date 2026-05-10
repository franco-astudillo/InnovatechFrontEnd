import React, { useState } from 'react';
import { useRecursosViewModel } from '../../viewmodels/useRecursosViewModel';

const RecursosView = () => {
  const { 
    usuarios, categorias, cargos, loading, 
    agregarCategoria, agregarCargo, eliminarCategoria, eliminarCargo,
    agregarTrabajador 
  } = useRecursosViewModel();

  const [newCat, setNewCat] = useState('');
  const [newCar, setNewCar] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '', 
    sueldo: '',   
    cargoId: '',     
    categoriaId: ''  
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitTrabajador = async (e) => {
    e.preventDefault();
    const res = await agregarTrabajador(formData);
    if (res.success) {
      setFormData({ nombre: '', email: '', password: '', sueldo: '', cargoId: '', categoriaId: '' });
    } else {
      alert("Error al registrar: " + res.message);
    }
  };

  // Validaciones para evitar envíos vacíos o con puros espacios
  const onSubmitCategoria = (e) => {
    e.preventDefault();
    if (newCat.trim() !== '') {
      agregarCategoria(newCat);
      setNewCat('');
    }
  };

  const onSubmitCargo = (e) => {
    e.preventDefault();
    if (newCar.trim() !== '') {
      agregarCargo(newCar);
      setNewCar('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Dashboard de Recursos</h2>

      {/* Cards Informativas - Diseño Default */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Total Personal</h4>
          <p style={{ fontSize: '18px', margin: '0' }}>{loading ? '...' : usuarios.length}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Categorías</h4>
          <p style={{ fontSize: '18px', margin: '0' }}>{loading ? '...' : categorias.length}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0' }}>Cargos</h4>
          <p style={{ fontSize: '18px', margin: '0' }}>{loading ? '...' : cargos.length}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Gestión de Categorías */}
        <div style={sectionStyle}>
          <h3>Gestionar Categorías</h3>
          {/* Se cambió div por form para activar el "required" del HTML */}
          <form onSubmit={onSubmitCategoria} style={inputGroupStyle}>
            <input 
              style={inputStyle}
              value={newCat} 
              onChange={(e) => setNewCat(e.target.value)} 
              placeholder="Nombre categoría" 
              required 
            />
            <button type="submit" style={btnStyle}>Crear</button>
          </form>
          <ul style={listStyle}>
            {categorias.map(c => (
              <li key={c.id} style={listItemStyle}>
                <span>{c.categoria}</span>
                <button style={btnStyle} onClick={() => eliminarCategoria(c.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Gestión de Cargos */}
        <div style={sectionStyle}>
          <h3>Gestionar Cargos</h3>
          <form onSubmit={onSubmitCargo} style={inputGroupStyle}>
            <input 
              style={inputStyle}
              value={newCar} 
              onChange={(e) => setNewCar(e.target.value)} 
              placeholder="Nombre cargo" 
              required 
            />
            <button type="submit" style={btnStyle}>Crear</button>
          </form>
          <ul style={listStyle}>
            {cargos.map(c => (
              <li key={c.id} style={listItemStyle}>
                <span>{c.nombreCargo}</span>
                <button style={btnStyle} onClick={() => eliminarCargo(c.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario Nuevo Trabajador */}
        <div style={{ ...sectionStyle, gridColumn: '1 / -1' }}>
          <h3>Registrar Nuevo Trabajador</h3>
          <form onSubmit={onSubmitTrabajador} style={formGridStyle} autoComplete="off">
            <input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleInput} required style={inputStyle} autoComplete="off"/>
            <input name="email" type="email" placeholder="Correo corporativo" value={formData.email} onChange={handleInput} required style={inputStyle} autoComplete="new-password"/>
            <input name="password" type="password" placeholder="Contraseña de acceso (Firebase)" value={formData.password} onChange={handleInput} required style={inputStyle} autoComplete="new-password"/>
            <input name="sueldo" type="number" placeholder="Sueldo" value={formData.sueldo} onChange={handleInput} required style={inputStyle} autoComplete="off"/>
            
            <select name="cargoId" value={formData.cargoId} onChange={handleInput} required style={inputStyle}>
              <option value="">Seleccione Cargo</option>
              {cargos.map(c => <option key={c.id} value={c.id}>{c.nombreCargo}</option>)}
            </select>

            <select name="categoriaId" value={formData.categoriaId} onChange={handleInput} required style={inputStyle}>
              <option value="">Seleccione Categoría</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.categoria}</option>)}
            </select>

            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Procesando...' : 'Crear Cuenta y Ficha'}
            </button>
          </form>
        </div>

        {/* Listado de Personal */}
        <div style={{ ...sectionStyle, gridColumn: '1 / -1' }}>
          <h3>Listado de Colaboradores</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Cargo</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Sueldo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.nombre}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.cargo?.nombreCargo || 'N/A'}</td>
                  <td style={tdStyle}>{u.categoria?.categoria || 'N/A'}</td>
                  <td style={tdStyle}>${u.sueldo?.toLocaleString() || '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Estilos Básicos (Apariencia Default HTML)
const cardStyle = { padding: '15px', border: '1px solid black', flex: 1, backgroundColor: '#f0f0f0' };
const sectionStyle = { padding: '15px', border: '1px solid black', backgroundColor: '#f9f9f9' };
const inputStyle = { padding: '5px', border: '1px solid #777' };
const inputGroupStyle = { display: 'flex', gap: '5px', marginBottom: '15px' };
const listStyle = { paddingLeft: '0', listStyle: 'none', margin: '0' };
const listItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', borderBottom: '1px solid #ccc', paddingBottom: '5px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginTop: '10px' };
const thStyle = { padding: '8px', border: '1px solid black', backgroundColor: '#e0e0e0', textAlign: 'left' };
const tdStyle = { padding: '8px', border: '1px solid black' };
const btnStyle = { padding: '5px 10px', cursor: 'pointer', border: '1px solid black', backgroundColor: '#e0e0e0', color: 'black' };

export default RecursosView;