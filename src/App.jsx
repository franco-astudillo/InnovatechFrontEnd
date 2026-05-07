import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './view/pages/LoginView';
import MainLayout from './view/layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LoginView />} />
        
        {/* Rutas privadas (Dentro del Layout con Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/recursos" element={<div>Módulo de Recursos en construcción...</div>} />
          <Route path="/proyectos" element={<div>Módulo de Proyectos en construcción...</div>} />
          <Route path="/monitoreo" element={<div>Módulo de Monitoreo en construcción...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;