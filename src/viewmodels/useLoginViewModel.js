// Importamos 'useState' de React, un Hook que nos permite crear variables reactivas. 
// Cuando estas variables cambian, React actualiza automáticamente la pantalla.
import { useState } from "react";
// Importamos 'useNavigate' de React Router para poder cambiar de página mediante código (redirección automática).
import { useNavigate } from "react-router-dom";
import { AuthService } from "../service/AuthService";

export const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.login(email, password);
      navigate('/monitoreo'); // Si es exitoso, entra a la app
    } catch (err) {
      setError("Credenciales incorrectas. Verifica tu usuario y contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    email, setEmail, 
    password, setPassword, 
    error, isLoading, 
    handleLogin 
  };
};