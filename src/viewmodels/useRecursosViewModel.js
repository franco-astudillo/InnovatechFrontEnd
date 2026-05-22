import { useState, useEffect } from 'react';
import { RecursosService } from '../service/RecursosService';
import { CategoriaService } from '../service/CategoriaService';
import { CargoService } from '../service/CargoService';

// Nuevas importaciones para manejar la app secundaria de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export const useRecursosViewModel = () => {
  // ESTADOS LOCALES (Variables reactivas):
  // Arreglos vacíos iniciales para guardar la información que llegue de la base de datos (PostgreSQL).
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargos, setCargos] = useState([]);
  // Estado para controlar la pantalla de carga. Inicia en 'true' porque al entrar a la página
  // inmediatamente empezaremos a descargar los datos.
  const [loading, setLoading] = useState(true);

  // FUNCIÓN DE LECTURA (READ):
  const fetchData = async () => {
    setLoading(true);
    try {
      const [uData, catData, carData] = await Promise.all([
        RecursosService.getUsuarios(),
        CategoriaService.getAll(),
        CargoService.getAll()
      ]);

      // Guardamos los datos que llegaron del servidor en nuestros estados locales.
      // El "|| []" es un salvavidas: si la API falla y devuelve undefined, guardamos un arreglo vacío
      // para evitar que la página crashee al intentar hacer un .map() más adelante.
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

  // ACTUALIZAR TRABAJADOR (solo nombre, sueldo, cargoId, categoriaId - NO email ni password):
  const editarTrabajador = async (id, datosFormulario) => {
    try {
      const datosActualizados = {
        nombre: datosFormulario.nombre,
        sueldo: datosFormulario.sueldo ? parseInt(datosFormulario.sueldo) : 0,
        cargoId: parseInt(datosFormulario.cargoId),
        categoriaId: parseInt(datosFormulario.categoriaId)
      };
      await RecursosService.updateUsuario(id, datosActualizados);
      await fetchData();
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar trabajador:", error);
      return { success: false, message: error.message };
    }
  };

  // ELIMINAR TRABAJADOR de la base de datos PostgreSQL:
  const eliminarTrabajador = async (id) => {
    try {
      await RecursosService.deleteUsuario(id);
      await fetchData();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar trabajador:", error);
      return { success: false, message: error.message };
    }
  };

  // ESTADOS Y MÉTODOS PARA BUSCAR USUARIO POR ID:
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [buscarLoading, setBuscarLoading] = useState(false);
  const [buscarError, setBuscarError] = useState(null);

  const buscarUsuarioPorId = async (id) => {
    if (!id) {
      setBuscarError("Por favor, ingrese un ID válido.");
      setUsuarioEncontrado(null);
      return;
    }
    setBuscarLoading(true);
    setBuscarError(null);
    try {
      const uData = await RecursosService.getUsuarioById(id);
      if (uData) {
        setUsuarioEncontrado(uData);
      } else {
        setUsuarioEncontrado(null);
        setBuscarError("No se encontró ningún colaborador con ese ID.");
      }
    } catch (error) {
      console.error("Error al buscar usuario por ID:", error);
      setUsuarioEncontrado(null);
      setBuscarError("Error al buscar colaborador. Verifique que el ID existe y es correcto.");
    } finally {
      setBuscarLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setUsuarioEncontrado(null);
    setBuscarError(null);
  };

  useEffect(() => { fetchData(); }, []);

  return { 
    usuarios, 
    categorias, 
    cargos, 
    loading, 
    agregarCategoria, 
    agregarCargo, 
    eliminarCategoria, 
    eliminarCargo, 
    agregarTrabajador,
    editarTrabajador,
    eliminarTrabajador,
    usuarioEncontrado,
    buscarLoading,
    buscarError,
    buscarUsuarioPorId,
    limpiarBusqueda
  };
};