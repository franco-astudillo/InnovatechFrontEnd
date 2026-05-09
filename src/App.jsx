import React from 'react';
// 1. Cambiamos BrowserRouter por HashRouter
import { HashRouter, Routes, Route } from 'react-router-dom'; 
import LoginView from './view/pages/LoginView';
import MainLayout from './view/layouts/MainLayout';
import RecursosView from './view/pages/RecursosView';

function App() {
  return (
    // 2. Envolvemos la app con HashRouter
    <HashRouter> 
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LoginView />} />
        
        {/* Rutas privadas (Dentro del Layout con Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/recursos" element={<RecursosView />} />
          <Route path="/proyectos" element={<div>Módulo de Proyectos en construcción...</div>} />
          <Route path="/monitoreo" element={<div>Módulo de Monitoreo en construcción...</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;