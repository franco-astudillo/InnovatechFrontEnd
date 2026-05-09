import { useState, useEffect } from 'react';
import { RecursosService } from '../service/RecursosService';
import { CategoriaService } from '../service/CategoriaService';
import { CargoService } from '../service/CargoService';

// Nuevas importaciones para manejar la app secundaria de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

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
      await CategoriaService.create({ categoria: nombreInput });
      fetchData(); 
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  const agregarCargo = async (nombreInput) => {
    try {
      await CargoService.create({ nombreCargo: nombreInput });
      fetchData();
    } catch (error) {
      console.error("Error al crear cargo:", error);
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await CategoriaService.delete(id);
      fetchData(); 
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const eliminarCargo = async (id) => {
    try {
      await CargoService.delete(id);
      fetchData(); 
    } catch (error) {
      console.error("Error al eliminar cargo:", error);
    }
  };

  const agregarTrabajador = async (datosFormulario) => {
    try {
      // 1. Crear una "App Secundaria" usando la misma configuración de tu auth original.
      // Esto evita que Firebase te cierre la sesión a ti como administrador.
      const secondaryApp = initializeApp(auth.app.options, "SecondaryApp" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Crear usuario en Firebase Authentication usando la app secundaria
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        datosFormulario.email, 
        datosFormulario.password
      );
      
      const uid = userCredential.user.uid;

      // 3. Cerrar la sesión de la app secundaria para dejarla limpia
      await signOut(secondaryAuth);

      // 4. Preparar el objeto DTO para tu Backend
      const nuevoUsuario = {
        nombre: datosFormulario.nombre,
        email: datosFormulario.email,
        sueldo: datosFormulario.sueldo ? parseInt(datosFormulario.sueldo) : 0,
        uidFirebase: uid, 
        categoriaId: parseInt(datosFormulario.categoriaId), 
        cargoId: parseInt(datosFormulario.cargoId)          
      };

      // 5. Guardar en tu Microservicio
      await RecursosService.createUsuario(nuevoUsuario);
      
      await fetchData(); // Refrescar lista
      return { success: true };
    } catch (error) {
      console.error("Error en registro dual:", error);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { usuarios, categorias, cargos, loading, agregarCategoria, agregarCargo, eliminarCategoria, eliminarCargo, agregarTrabajador };
};