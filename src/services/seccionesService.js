import apiClient from "./apiClient";

export const getSecciones = async () => {
  try {
    const response = await apiClient.get("/seccion");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las secciones:", error);
    throw error;
  }
}

export const getSeccionById = async (id) => {
  try {
    const response = await apiClient.get(`/seccion/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la sección:", error);
    throw error;
  }
}

export const createSeccion = async (seccion) => {
    try {
      const response = await apiClient.post(`/seccion`, seccion);
      return response.data;
    } catch (error) {
      console.error("Error al crear la sección:", error);
      throw error;
    }
}
  

export const updateSeccion = async (id, seccion) => {
  try {
    const response = await apiClient.put(`/seccion/${id}`, seccion);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la sección:", error);
    throw error;
  }
}

export const deleteSeccion = async (id) => {
  try {
    const response = await apiClient.delete(`/seccion/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la sección:", error);
    throw error;
  }
}

