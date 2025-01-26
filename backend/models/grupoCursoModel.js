const db = require("../services/firebase");

exports.getGruposByProfesor = async (idProfesor) => {
  try {
    // Consulta inicial a "GrupoCurso"
    const snapshot = await db
      .collection("GrupoCurso")
      .where("idProfesor", "==", idProfesor)
      .get();

    if (snapshot.empty) {
      return [];
    }

    // Extraer los datos básicos de "GrupoCurso"
    const grupos = snapshot.docs.map((doc) => ({
      idGrupoCurso: doc.id,
      ...doc.data(),
    }));

    // Consultar las colecciones "cursos" y "seccion" para obtener información adicional
    const cursosPromises = grupos.map((grupo) =>
      db.collection("cursos").doc(grupo.idCurso).get()
    );
    const seccionesPromises = grupos.map((grupo) =>
      db.collection("seccion").doc(grupo.idSeccion).get()
    );

    const [cursosSnapshots, seccionesSnapshots] = await Promise.all([
      Promise.all(cursosPromises),
      Promise.all(seccionesPromises),
    ]);

    // Combinar la información obtenida
    const resultado = grupos.map((grupo, index) => {
      const curso = cursosSnapshots[index].exists
        ? cursosSnapshots[index].data()
        : null;
      const seccion = seccionesSnapshots[index].exists
        ? seccionesSnapshots[index].data()
        : null;

      return {
        ...grupo,
        curso: curso || {},
        secciones: seccion || {},
      };
    });

    return resultado;
  } catch (error) {
    console.error("Error obteniendo los grupos:", error);
    throw new Error("Error al obtener los grupos del profesor.");
  }
};

exports.actualizarIdProfesor = async (idGrupoCurso, nuevoIdProfesor) => {
  try {
  

    // Actualizar el campo idProfesor en el documento
    await db.collection("GrupoCurso").doc(idGrupoCurso).update({
      idProfesor: nuevoIdProfesor,
    });

    return "El campo idProfesor se actualizó correctamente.";
  } catch (error) {
    console.error("Error al actualizar el idProfesor:", error);
    throw new Error("Ocurrió un error al intentar actualizar el idProfesor.");
  }
};