const db = require("../services/firebase");

exports.getAllSeccion = async () => {
  const snapshot = await db.collection("seccion").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.getEstudiantesBySeccion = async (idSeccion) => {
  try {
    // Obtener el documento de la colección "seccion" por ID
    const seccionDoc = await db.collection("seccion").doc(idSeccion).get();

    if (!seccionDoc.exists) {
      throw new Error("La sección no existe.");
    }

    // Obtener la lista de IDs de estudiantes desde el documento
    const estudiantesIds = seccionDoc.data().listaEstudiantes || [];

    if (estudiantesIds.length === 0) {
      return []; // No hay estudiantes en esta sección
    }

    // Realizar consultas a la colección "estudiantes" para cada ID
    const estudiantePromises = estudiantesIds.map(async (id) => {
      const estudianteDoc = await db.collection("estudiantes").doc(id).get();
      if (estudianteDoc.exists) {
        const estudianteData = estudianteDoc.data();
        return {
          _id: estudianteDoc.id,
          nombre: estudianteData.nombre,
          apellido: estudianteData.apellido,
        };
      }
      return null; // Manejar el caso en que un documento no exista
    });

    // Esperar a que se completen todas las consultas
    const estudiantes = await Promise.all(estudiantePromises);

    // Filtrar los valores nulos en caso de documentos inexistentes
    return estudiantes.filter((estudiante) => estudiante !== null);
  } catch (error) {
    console.error("Error al obtener los estudiantes por sección:", error);
    throw error;
  }
};

exports.createSeccion = async (grupo, nivel, listaEstudiantes) => {
  try {
    // Crear un nuevo documento en la colección "seccion"
    const seccionRef = await db.collection("seccion").add({
      grupo,
      nivel,
      listaEstudiantes,
    });

    return { id: seccionRef.id, grupo, nivel, listaEstudiantes };
  } catch (error) {
    console.error("Error al crear la sección:", error);
    throw error;
  }
};

exports.updateSeccion = async (id, grupo, nivel, listaEstudiantes) => {
  try {
    // Crear un objeto con los campos a actualizar
    const data = {};
    if (grupo) data.grupo = grupo;
    if (nivel) data.nivel = nivel;
    if (listaEstudiantes) data.listaEstudiantes = listaEstudiantes;

    // Actualizar el documento en la colección "seccion"
    await db.collection("seccion").doc(id).update(data);

    return { id, ...data };
  } catch (error) {
    console.error("Error al actualizar la sección:", error);
    throw error;
  }
};

exports.deleteSeccion = async (id) => {
  try {
    // Eliminar el documento de la colección "seccion"
    await db.collection("seccion").doc(id).delete();
  } catch (error) {
    console.error("Error al eliminar la sección:", error);
    throw error;
  }
};
