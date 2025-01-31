import apiClient from "./apiClient";

export const getGruposByProfesor = async (id) => {
  try {
    const response = await apiClient.get(`/grupo-curso/grupos/profesor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los grupos del profesor:", error);
    throw error;
  }
}

export const getGruposBySeccion = async (id) => {
  try {
    const response = await apiClient.get(`/grupo-curso/grupos/seccion/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los grupos de la sección:", error);
    throw error;
  }
}

export const getGrupoCursoById = async (id) => {
  try {
    const response = await apiClient.get(`/grupo-curso/grupos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el grupo:", error);
    throw error;
  }
}

export const getGrupos = async () => {
  try {
    const response = await apiClient.get("/grupo-curso/grupos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los grupos:", error);
    throw error;
  }
}

export const crearGrupoCurso = async (grupo) => {
  try {
    const response = await apiClient.post("/grupo-curso/grupos", grupo);
    return response.data;
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    throw error;
  }
}

export const updateGrupoCurso = async (id, grupo) => {
  try {
    const response = await apiClient.put(`/grupo-curso/grupos/${id}`, grupo);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el grupo:", error);
    throw error;
  }
}
export const deleteGrupoCurso = async (id) => {
  try {
    const response = await apiClient.delete(`/grupo-curso/grupos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el grupo:", error);
    throw error;
  }
}