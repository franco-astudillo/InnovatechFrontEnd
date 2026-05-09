import React, { useState } from 'react';
import { useRecursosViewModel } from '../../viewmodels/useRecursosViewModel';

const RecursosView = () => {
  const { usuarios, categorias, cargos, loading, agregarCategoria, agregarCargo, eliminarCategoria, eliminarCargo } = useRecursosViewModel();
  const [newCat, setNewCat] = useState('');
  const [newCar, setNewCar] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard de Recursos</h2>

      {/* Cards Informativas */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Total Personal" count={usuarios.length} loading={loading} color="#2ecc71" />
        <StatCard title="Categorías" count={categorias.length} loading={loading} color="#3498db" />
        <StatCard title="Cargos" count={cargos.length} loading={loading} color="#9b59b6" />
      </div>

      {/* Formularios de Creación */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <section style={sectionStyle}>
          <h3>Gestionar Categorías</h3>
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nombre categoría" />
          <button onClick={() => { agregarCategoria(newCat); setNewCat(''); }}>Crear</button>
          <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
            {categorias.map(c => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '5px', borderBottom: '1px solid #eee' }}>
                <span>{c.categoria}</span>
                <button 
                  onClick={() => eliminarCategoria(c.id)} 
                  style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section style={sectionStyle}>
          <h3>Gestionar Cargos</h3>
          <input value={newCar} onChange={(e) => setNewCar(e.target.value)} placeholder="Nombre cargo" />
          <button onClick={() => { agregarCargo(newCar); setNewCar(''); }}>Crear</button>
          <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
            {cargos.map(c => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '5px', borderBottom: '1px solid #eee' }}>
                <span>{c.nombreCargo}</span>
                <button 
                  onClick={() => eliminarCargo(c.id)} 
                  style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

// Componentes pequeños para mantener el orden
const StatCard = ({ title, count, loading, color }) => (
  <div style={{ ...cardStyle, borderLeft: `5px solid ${color}` }}>
    <h4>{title}</h4>
    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{loading ? '...' : count}</p>
  </div>
);

const cardStyle = { padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 };
const sectionStyle = { background: 'white', padding: '20px', borderRadius: '8px' };

export default RecursosView;