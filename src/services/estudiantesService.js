import apiClient from "./apiClient";

export const getEstudiantes = async () => {
  try {
    const response = await apiClient.get("/estudiantes");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    throw error;
  }
}

export const getEstudianteByGrado = async (grado) => {
  try {
    const response = await apiClient.get(`/estudiantes/grado?grado=${grado}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    throw error;
  }
}

export const getEstudianteById = async (id) => {
  try {
    const response = await apiClient.get(`/estudiantes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estudiante:", error);
    throw error;
  }
}

export const createEstudiante = async (nombre, apellido, correo, grado) => {
  try {
    const response = await apiClient.post(`/estudiantes?nombre=${nombre}&apellido=${apellido}&correo=${correo}&grado=${grado}`);
    return response.data;
  } catch (error) {
    console.error("Error al crear el estudiante:", error);
    throw error;
  }
}

export const updateEstudiante = async (id, nombre, apellido, correo, grado, encargado) => {
  try {
    const response = await apiClient.put(`/estudiantes/${id}?nombre=${nombre}&apellido=${apellido}&correo=${correo}&grado=${grado}&encargado=${encargado}`);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estudiante:", error);
    throw error;
  }
}

export const deleteEstudiante = async (id) => {
  try {
    const response = await apiClient.delete(`/estudiantes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el estudiante:", error);
    throw error;
  }
}