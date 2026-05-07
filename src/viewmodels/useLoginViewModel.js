import { useState } from "react";
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
      navigate("/recursos"); // Si es exitoso, entra a la app
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