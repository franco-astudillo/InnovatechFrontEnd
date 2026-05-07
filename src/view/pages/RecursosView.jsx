import React, { useEffect, useState } from 'react';
import { RecursosService } from '../../service/RecursosService';

const RecursosView = () => {
  const [cargos, setCargos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const data = await RecursosService.getAllCargos();
        setCargos(data);
      } catch (err) {
        setError("No se pudieron cargar los cargos.");
        console.error(err);
      }
    };

    fetchCargos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listado de Cargos</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {cargos.map((cargo) => (
          <li key={cargo.id} className="p-3 bg-white shadow rounded">
            {cargo.nombreCargo} - {cargo.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecursosView;