import apiClient from "./apiClient";

export const getProfesores = async () => {
  try {
    const response = await apiClient.get("/profesores");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los profesores:", error);
    throw error;
  }
};

export const getProfesorById = async (id) => {
  try {
    const response = await apiClient.get(`/profesores/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el profesor:", error);
    throw error;
  }
};

export const createProfesor = async (nombre, apellido, email) => {  
  try {
    const response = await apiClient.post(`/profesores?nombre=${nombre}&apellido=${apellido}&email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error al crear el profesor:", error);
    throw error;
  }
};

export const updateProfesor = async (id, nombre, apellido, email) => {
  try {
    const response = await apiClient.put(`/profesores/${id}?nombre=${nombre}&apellido=${apellido}&email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el profesor:", error);
    throw error;
  }
};

export const deleteProfesor = async (id) => {
  try {
    const response = await apiClient.delete(`/profesores/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el profesor:", error);
    throw error;
  }
};