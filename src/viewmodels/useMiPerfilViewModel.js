import { useState, useEffect } from 'react';
import { PerfilService } from '../service/PerfilService';

export const useMiPerfilViewModel = () => {
  const [perfil, setPerfil] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatosCompletos = async () => {
      try {
        setLoading(true);
        // Hacemos las 3 llamadas en paralelo
        const [perfilData, proyectosData, tareasData] = await Promise.all([
          PerfilService.getMyInfo(),
          PerfilService.getMyProyectos(),
          PerfilService.getMyTareas()
        ]);
        
        setPerfil(perfilData);
        setProyectos(proyectosData);
        setTareas(tareasData);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar la información completa del perfil.");
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosCompletos();
  }, []);

  return { perfil, proyectos, tareas, loading, error };
};