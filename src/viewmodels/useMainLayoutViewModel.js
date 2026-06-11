import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { RecursosService } from '../service/RecursosService';
import { AuthService } from '../service/AuthService';

export const useMainLayoutViewModel = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Escuchar estado de autenticación en Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setUserRole('');
        setLoading(false);
        return;
      }

      try {
        const token = AuthService.getToken();
        if (!token) {
          setCurrentUser(null);
          setUserRole('');
          setLoading(false);
          return;
        }

        // 2. Traer el listado de usuarios de base de datos para buscar su rol
        const usuarios = await RecursosService.getUsuarios();
        
        // Buscamos coincidencia por Firebase UID o por Correo
        const match = usuarios.find(
          u => u.uidFirebase === firebaseUser.uid || u.email.toLowerCase() === firebaseUser.email.toLowerCase()
        );

        if (match) {
          setCurrentUser(match);
          // Normalizar el rol a minúsculas
          const normalizedRole = match.categoria?.categoria?.toLowerCase() || '';
          setUserRole(normalizedRole);
        } else {
          // Si no se encuentra en el listado, asignamos valores por correo si es admin (por fallback)
          if (firebaseUser.email.toLowerCase().includes('admin')) {
            setUserRole('admin');
            setCurrentUser({ nombre: 'Administrador Temporal', email: firebaseUser.email });
          } else {
            setUserRole('trabajador'); // Rol por defecto
            setCurrentUser({ nombre: firebaseUser.displayName || 'Colaborador', email: firebaseUser.email });
          }
        }
      } catch (err) {
        console.error("Error al obtener perfil en MainLayout:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Comprobar si una ruta está autorizada para el rol actual
  const isRouteAuthorized = (path) => {
    if (loading) return false;
    const role = userRole.toLowerCase();

    // Reglas de acceso
    if (role === 'admin') return true; // El admin puede ver y acceder a todo

    if (role === 'rrhh' || role === 'recursos humanos') {
      return ['/recursos', '/resumen-rrhh', '/monitoreo', '/metricas-historicas', '/perfil'].includes(path);
    }

    if (role === 'pm' || role === 'project manager' || role === 'lider de proyecto') {
      return ['/monitoreo', '/crear-proyecto', '/mi-proyecto', '/metricas-historicas', '/perfil'].includes(path);
    }

    if (role === 'trabajador' || role === 'colaborador') {
      return ['/monitoreo','/mi-proyecto', '/tablero-trabajo', '/perfil'].includes(path);
    }

    return false;
  };

  // Lista de enlaces completa para generar dinámicamente el Navbar
  const allNavLinks = [
    { path: '/recursos', label: 'Recursos (CRUD)', roles: ['admin', 'rrhh', 'recursos humanos'] },
    { path: '/resumen-rrhh', label: 'Resumen Personal (KPI)', roles: ['admin', 'rrhh', 'recursos humanos'] },
    { path: '/monitoreo', label: 'Monitoreo de Producción', roles: ['admin', 'rrhh', 'recursos humanos', 'pm', 'project manager', 'lider de proyecto'] },
    { path: '/crear-proyecto', label: 'Crear Proyecto (PM)', roles: ['admin', 'pm', 'project manager', 'lider de proyecto'] },
    { path: '/mi-proyecto', label: 'Mi Proyecto (KPI)', roles: ['admin', 'pm', 'project manager', 'lider de proyecto', 'trabajador', 'colaborador'] },
    { path: '/tablero-trabajo', label: 'Tablero de Tareas', roles: ['admin', 'trabajador', 'colaborador'] },
    { path: '/metricas-historicas', label: 'Metricas Historicas', roles: ['admin', 'rrhh', 'recursos humanos', 'pm', 'project manager', 'lider de proyecto'] },
    { path: '/perfil', label: 'Mi Perfil', roles: ['admin', 'rrhh', 'recursos humanos', 'pm', 'project manager', 'lider de proyecto', 'trabajador', 'colaborador'] }
  ];

  // Filtrar enlaces permitidos según el rol del usuario logueado
  const getNavLinks = () => {
    if (!userRole) return [];
    return allNavLinks.filter(link => 
      link.roles.includes(userRole) || 
      userRole === 'admin'
    );
  };

  return {
    currentUser,
    userRole,
    loading,
    isRouteAuthorized,
    getNavLinks
  };
};
