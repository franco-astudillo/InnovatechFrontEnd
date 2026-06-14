import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../../service/AuthService';

const ProtectedRoute = () => {
  const isAuth = AuthService.isAuthenticated();

  if (!isAuth) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, permite ver la ruta solicitada
  return <Outlet />;
};

export default ProtectedRoute;