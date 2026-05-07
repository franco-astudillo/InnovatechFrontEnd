import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/AuthService';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h3>Innovatech App</h3>
        <hr style={{ borderColor: '#34495e', width: '100%' }} />
        
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          <li style={{ marginBottom: '10px' }}><NavLink to="/proyectos" style={{color: '#bdc3c7', textDecoration: 'none'}}>Proyectos</NavLink></li>
          <li style={{ marginBottom: '10px' }}><NavLink to="/recursos" style={{color: '#bdc3c7', textDecoration: 'none'}}>Recursos (RRHH)</NavLink></li>
          <li style={{ marginBottom: '10px' }}><NavLink to="/monitoreo" style={{color: '#bdc3c7', textDecoration: 'none'}}>Monitoreo y Analítica</NavLink></li>
        </ul>

        <button onClick={handleLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
          Cerrar Sesión
        </button>
      </nav>
      
      <main style={{ flex: 1, padding: '30px', background: '#ecf0f1', overflowY: 'auto' }}>
        <Outlet /> {/* Aquí se renderizan las vistas hijas */}
      </main>
    </div>
  );
};

export default MainLayout;