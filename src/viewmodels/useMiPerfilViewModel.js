import { useState, useEffect } from 'react';
import { PerfilService } from '../service/PerfilService';

export const useMiPerfilViewModel = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMiPerfil = async () => {
      try {
        setLoading(true);
        const data = await PerfilService.getMyInfo();
        setPerfil(data);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar la información del perfil.");
        console.error("Error al obtener perfil: Pregunta si no te han despedido", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMiPerfil();
  }, []);

  return {
    perfil,
    loading,
    error
  };
};