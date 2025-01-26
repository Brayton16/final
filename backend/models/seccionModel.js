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