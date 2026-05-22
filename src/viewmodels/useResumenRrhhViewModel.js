import { useState, useEffect } from 'react';
import { RecursosService } from '../service/RecursosService';
import { CategoriaService } from '../service/CategoriaService';
import { CargoService } from '../service/CargoService';

export const useResumenRrhhViewModel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);

  // KPIs Calculados
  const [kpis, setKpis] = useState({
    totalPersonal: 0,
    totalCategorias: 0,
    totalCargos: 0,
    sueldoPromedio: 0,
    distribucionCargos: [],
    distribucionCategorias: []
  });

  const fetchKpiData = async () => {
    setLoading(true);
    try {
      const [uData, catData, carData] = await Promise.all([
        RecursosService.getUsuarios(),
        CategoriaService.getAll(),
        CargoService.getAll()
      ]);

      const activeUsers = uData || [];
      const activeCats = catData || [];
      const activeCargos = carData || [];

      setUsuarios(activeUsers);
      setCategorias(activeCats);
      setCargos(activeCargos);

      // 1. Total Personal, Categorias, Cargos
      const totalPersonal = activeUsers.length;
      const totalCategorias = activeCats.length;
      const totalCargos = activeCargos.length;

      // 2. Sueldo Promedio
      const totalSueldo = activeUsers.reduce((sum, u) => sum + (u.sueldo || 0), 0);
      const sueldoPromedio = totalPersonal > 0 ? Math.round(totalSueldo / totalPersonal) : 0;

      // 3. Distribución por Cargo
      const cargoCounts = {};
      activeUsers.forEach(u => {
        const cargoName = u.cargo?.nombreCargo || 'Sin Cargo / Otro';
        cargoCounts[cargoName] = (cargoCounts[cargoName] || 0) + 1;
      });
      const distribucionCargos = Object.entries(cargoCounts).map(([nombreCargo, cantidad]) => ({
        nombreCargo,
        cantidad
      }));

      // 4. Distribución por Categoría
      const catCounts = {};
      activeUsers.forEach(u => {
        const catName = u.categoria?.categoria || 'Sin Categoría / Otro';
        catCounts[catName] = (catCounts[catName] || 0) + 1;
      });
      const distribucionCategorias = Object.entries(catCounts).map(([categoria, cantidad]) => ({
        categoria,
        cantidad
      }));

      setKpis({
        totalPersonal,
        totalCategorias,
        totalCargos,
        sueldoPromedio,
        distribucionCargos,
        distribucionCategorias
      });

    } catch (error) {
      console.error("Error al calcular KPIs de Recursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpiData();
  }, []);

  return {
    kpis,
    loading,
    refreshKpis: fetchKpiData
  };
};
