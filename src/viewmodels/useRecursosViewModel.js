import { useState, useEffect } from 'react';
import { RecursosService } from '../service/RecursosService';
import { CategoriaService } from '../service/CategoriaService';
import { CargoService } from '../service/CargoService';

export const useRecursosViewModel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uData, catData, carData] = await Promise.all([
        RecursosService.getUsuarios(),
        CategoriaService.getAll(),
        CargoService.getAll()
      ]);
      setUsuarios(uData || []);
      setCategorias(catData || []);
      setCargos(carData || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarCategoria = async (nombreInput) => {
    try {
      // Usamos nombre_categoria como está en tu modelo
      await CategoriaService.create({ categoria: nombreInput });
      fetchData(); 
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  const agregarCargo = async (nombreInput) => {
    try {
      // Usamos nombre_cargo como está en tu modelo Java
      await CargoService.create({ nombreCargo: nombreInput });
      fetchData();
    } catch (error) {
      console.error("Error al crear cargo:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { usuarios, categorias, cargos, loading, agregarCategoria, agregarCargo };
};