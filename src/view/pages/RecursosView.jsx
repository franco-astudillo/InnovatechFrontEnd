import React, { useEffect, useState } from 'react';
import { RecursosService } from '../../service/RecursosService';

const RecursosView = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await RecursosService.getUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div>
      <h2>Gestión de Recursos Humanos</h2>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={cardStyle}>
          <h4>Total Personal en la Empresa</h4>
          <p style={numeroStyle}>{cargando ? "..." : usuarios.length}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = { padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const numeroStyle = { fontSize: '32px', fontWeight: 'bold' };

export default RecursosView;