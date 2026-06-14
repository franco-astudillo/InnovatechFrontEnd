// src/components/validaciones.js

export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') return "El nombre es obligatorio.";
  if (nombre.length > 80) return "El nombre no puede superar los 80 caracteres.";
  // Expresión regular que solo permite letras (mayúsculas, minúsculas, acentos, ñ) y espacios.
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!regex.test(nombre)) return "El nombre no debe contener números ni caracteres especiales.";
  return null; // Retorna null si no hay errores
};

export const validarEmail = (email) => {
  if (!email || email.trim() === '') return "El correo es obligatorio.";
  // Expresión regular: mínimo 4 caracteres antes del @, mínimo 4 después, un punto y extensión (com, cl, etc.)
  const regex = /^[^@\s]{4,}@[^@\s]{4,}\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return "El correo debe tener mínimo 4 caracteres antes y después del '@', e incluir un dominio válido (ej. .com, .cl).";
  return null;
};

export const validarPassword = (password) => {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 6 ) return "La contraseña debe tener al menos 6 caracteres.";
  return null;
};

export const validarSueldo = (sueldo) => {
  if (!sueldo) return "El sueldo es obligatorio.";
  if (Number(sueldo) < 539000) return "El sueldo ingresado no puede ser menor al sueldo mínimo legal en Chile ($539.000).";
  return null;
};

// Validación genérica para las Categorías y los Cargos
export const validarTextoCorto = (texto, nombreCampo) => {
  if (!texto || texto.trim().length < 2) return `El campo ${nombreCampo} debe tener al menos 2 caracteres.`;
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!regex.test(texto)) return `El campo ${nombreCampo} solo debe contener letras.`;
  return null;
};