import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../service/AuthService';
import { useMainLayoutViewModel } from '../../viewmodels/useMainLayoutViewModel';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userRole, loading, isRouteAuthorized, getNavLinks } = useMainLayoutViewModel();

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', backgroundColor: '#F8FAFC' }}>
        <div style={{ padding: '20px', border: '1px solid black', backgroundColor: '#fff', textAlign: 'center' }}>
          <h3>Cargando sesión</h3>
        </div>
      </div>
    );
  }

  const authorized = isRouteAuthorized(location.pathname);
  const links = getNavLinks();

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {/* Navbar con el fondo Azul Pizarra Oscuro del login */}
      <nav style={{ width: '250px', background: '#0F172A', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box'}}>
        {currentUser && (
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '10px' }}>
            Usuario: <strong>{currentUser.nombre}</strong><br />
            Categoría: <span style={{ color: '#F1F5F9', fontWeight: 'bold', textTransform: 'uppercase' }}>{userRole || 'Ninguna'}</span>
          </div>
        )}

        {/* Línea divisoria en un gris/azul sutil */}
        <hr style={{ borderColor: '#334155', width: '100%', marginBottom: '20px', marginTop: '5px' }} />
  
        <ul style={{ listStyle: 'none', padding: 0, flex: 1, margin: 0 }}>
          {links.map((link) => (
            <li key={link.path} style={{ marginBottom: '12px' }}>
              <NavLink 
                to={link.path} 
                style={({ isActive }) => ({
                  color: isActive ? '#3B82F6' : '#CBD5E1', 
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : 'normal',
                  fontSize: '0.95rem',
                  display: 'block',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? '#1E293B' : 'transparent'
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Botón de Cerrar Sesión */}
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#EF4444', border: '1px solid #EF4444', padding: '10px', cursor: 'pointer', borderRadius: '4px', fontWeight: '500' }}>
          Cerrar Sesión
        </button>
      </nav>
      
      {/* Contenedor principal con el fondo gris claro del login y sin márgenes */}
      <main style={{ flex: 1, padding: '30px', background: '#F8FAFC', overflowY: 'auto', boxSizing: 'border-box' }}>
        {authorized ? (
          <Outlet />
        ) : (
          /* Vista de Acceso Denegado (Estilo Genérico/Básico Coherente) */
          <div style={{ padding: '20px', border: '1px solid #B91C1C', backgroundColor: '#FEF2F2', color: '#991B1B', fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Acceso Denegado</h3>
            <p style={{ margin: 0 }}>
              No tienes los permisos requeridos para acceder a esta sección.
            </p>
          </div>
        )}
      </main>
      
    </div>
  );
};

export default MainLayout;