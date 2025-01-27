import apiClient from "./apiClient";

//Obtener data de los profesores
export const getProfesores = async () => {
  try {
    const response = await apiClient.get("/profesores");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los profesores:", error);
    throw error;
  }
}


export const createProfesor = async (nombre, apellido) => {
    try {
      const response = await apiClient.post(`/profesores?nombre=${nombre}&apellido=${apellido}`);
      return response.data;
    } catch (error) {
      console.error("Error al crear el curso:", error);
      throw error;
    }
  };