const e = require("express");
const db = require("../services/firebase");

exports.getAllSeccion = async () => {
  const snapshot = await db.collection("seccion").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.getSeccionByEstudiante = async (idEstudiante) => {
  try {
    const snapshot = await db.collection("seccion")
      .where("listaEstudiantes", "array-contains", idEstudiante)
      .get();

    if (snapshot.empty) {
      console.log("No se encontró la sección para este estudiante.");
      return null;
    }

    const seccion = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))[0]; // Tomamos la primera coincidencia
    const estudiantesRef = db.collection("estudiantes");
    const estudiantesPromises = seccion.listaEstudiantes.map(async (idEst) => {
      const estDoc = await estudiantesRef.doc(idEst).get();
      if (!estDoc.exists) return null;

      const estudianteData = estDoc.data();

      let encargadoNombre = "No asignado";
      if (estudianteData.encargado) {
        const encargadoDoc = await db.collection("encargados").doc(estudianteData.encargado).get();
        if (encargadoDoc.exists) {
          const encargadoData = encargadoDoc.data();
          encargadoNombre = `${encargadoData.nombre} ${encargadoData.apellido}`;
        }
      }

      return {
        id: idEst,
        nombre: estudianteData.nombre,
        apellido: estudianteData.apellido,
        correo: estudianteData.correo,
        encargado: encargadoNombre
      };
    });

    // Ejecutamos todas las promesas de estudiantes
    const estudiantes = await Promise.all(estudiantesPromises);

    return {
      idSeccion: seccion.id,
      grupo: seccion.grupo,
      nivel: seccion.nivel,
      estudiantes: estudiantes.filter(est => est !== null) // Filtrar si hay nulos
    };

  } catch (error) {
    console.error("Error obteniendo la sección del estudiante:", error);
    return null;
  }
};

exports.getCantidadEstudiantesPorSeccion = async () => {
  try {
    // Obtener todas las secciones desde la colección "seccion"
    const seccionesSnapshot = await db.collection("seccion").get();

    if (seccionesSnapshot.empty) {
      return {
        success: true,
        message: "No hay secciones registradas.",
        data: [],
      };
    }

    const resultado = [];

    // Recorrer cada documento de la colección "seccion"
    seccionesSnapshot.forEach((doc) => {
      const seccionData = doc.data();
      const nombreSeccion = `${seccionData.nivel} - ${seccionData.grupo}`;
      const cantidadEstudiantes = seccionData.listaEstudiantes
        ? seccionData.listaEstudiantes.length
        : 0;

      resultado.push({
        seccion: nombreSeccion,
        cantidad: cantidadEstudiantes,
      });
    });

    return {
      success: true,
      message: "Consulta exitosa",
      data: resultado,
    };
  } catch (error) {
    console.error("Error al obtener la cantidad de estudiantes por sección:", error);
    return {
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    };
  }
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
          correo: estudianteData.correo,
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
    console.log("Datos a guardar:", { grupo });
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

exports.getSeccionById = async (id) => {
  try {
    // Obtener el documento de la colección "seccion" por ID
    const seccionDoc = await db.collection("seccion").doc(id).get();
    if (!seccionDoc.exists) {
      throw new Error("La sección no existe.");
    }
    return { id: seccionDoc.id, ...seccionDoc.data() };
    }catch (error) {
      console.error("Error al obtener la sección:", error);
      throw error;
    }
  };
