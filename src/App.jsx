import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; 
import LoginView from './view/pages/LoginView';
import MainLayout from './view/layouts/MainLayout';
import ProtectedRoute from './view/layouts/ProtectedRoute';

// Importación de las vistas (View) del sistema
import RecursosView from './view/pages/RecursosView';
import ResumenRrhhView from './view/pages/ResumenRrhhView';
import MonitoreoView from './view/pages/MonitoreoView';
import CrearProyectoView from './view/pages/CrearProyectoView';
import MiProyectoView from './view/pages/MiProyectoView';
import TableroTrabajoView from './view/pages/TableroTrabajoView';

function App() {
  return (
    // 2. Envolvemos la app con HashRouter
    <HashRouter> 
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LoginView />} />
        
        {/* Rutas Privadas Protegidas por Autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Rutas dinámicas según categoría */}
            <Route path="/recursos" element={<RecursosView />} />
            <Route path="/resumen-rrhh" element={<ResumenRrhhView />} />
            <Route path="/monitoreo" element={<MonitoreoView />} />
            <Route path="/crear-proyecto" element={<CrearProyectoView />} />
            <Route path="/mi-proyecto" element={<MiProyectoView />} />
            <Route path="/tablero-trabajo" element={<TableroTrabajoView />} />
          </Route>
        </Route>

        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Página no encontrada. Regrese a la <a href="#/">página de inicio</a>.</div>} />

      </Routes>
    </HashRouter>
  );
}

export default App;