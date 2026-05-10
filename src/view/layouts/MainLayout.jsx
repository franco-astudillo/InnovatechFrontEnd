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
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {/* Navbar con el fondo Azul Pizarra Oscuro del login */}
      <nav style={{ width: '250px', background: '#0F172A', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column'}}>
        {/* Cambio de nombre solicitado */}
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Plataforma Innovatech</h3>
        
        {/* Línea divisoria en un gris/azul sutil */}
        <hr style={{ borderColor: '#334155', width: '100%', marginBottom: '20px' }} />
        
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/proyectos" style={{color: '#CBD5E1', textDecoration: 'none'}}>Proyectos</NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/recursos" style={{color: '#CBD5E1', textDecoration: 'none'}}>Recursos (RRHH)</NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/monitoreo" style={{color: '#CBD5E1', textDecoration: 'none'}}>Monitoreo y Analítica</NavLink>
          </li>
        </ul>

        {/* Botón de Cerrar Sesión con estilo corporativo */}
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#EF4444', border: '1px solid #EF4444', padding: '10px', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>
          Cerrar Sesión
        </button>
      </nav>
      
      {/* Contenedor principal con el fondo gris claro del login y sin márgenes */}
      <main style={{ flex: 1, padding: '30px', background: '#F8FAFC', overflowY: 'auto' }}>
        <Outlet />
      </main>
      
    </div>
  );
};

export default MainLayout;