import apiClient from "./apiClient";

export const getEncargados = async () => {
  try {
    const response = await apiClient.get("/encargados");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los encargados:", error);
    throw error;
  }
}

export const getEncargadoById = async (id) => {
  try {
    const response = await apiClient.get(`/encargados/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el encargado:", error);
    throw error;
  }
}

export const createEncargado = async (nombre, apellido, correo, telefono) => {
  try {
    const response = await apiClient.post(`/encargados?nombre=${nombre}&apellido=${apellido}&correo=${correo}&telefono=${telefono}`);
    return response.data;
  } catch (error) {
    console.error("Error al crear el encargado:", error);
    throw error;
  }
}

export const updateEncargado = async (id, nombre, apellido, correo, telefono) => {
  try {
    const response = await apiClient.put(`/encargados/${id}?nombre=${nombre}&apellido=${apellido}&correo=${correo}&telefono=${telefono}`);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el encargado:", error);
    throw error;
  }
}

export const deleteEncargado = async (id) => {
  try {
    const response = await apiClient.delete(`/encargados/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el encargado:", error);
    throw error;
  }
}