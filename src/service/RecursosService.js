const GATEWAY_URL = "http://localhost:8080"; // URL de tu gateinnovatech

export const RecursosService = {
  getAllCargos: async () => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${GATEWAY_URL}/api/v1/cargos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Requerido por el AuthenticationFilter del Gateway
      },
    });

    if (!response.ok) throw new Error("Error al obtener los datos del servidor");
    return await response.json();
  }
};