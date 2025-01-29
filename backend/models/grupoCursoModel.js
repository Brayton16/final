const db = require("../services/firebase");

exports.getAllGrupos = async () => {
  try {
    const snapshot = await db.collection("GrupoCurso").get();
    const grupos = snapshot.docs.map((doc) => ({
      idGrupoCurso: doc.id,
      ...doc.data(),
    }));
    return grupos;
  } catch (error) {
    console.error("Error al obtener los grupos:", error);
    throw error;
  }
};

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

exports.getGruposByEstudiante = async (idEstudiante) => {
  try {
    // Buscar secciones donde el estudiante está inscrito
    const seccionesSnapshot = await db
      .collection("seccion")
      .where("listaEstudiantes", "array-contains", idEstudiante) // Filtrar donde el estudiante esté inscrito
      .get();
    if (seccionesSnapshot.empty) {
      return [];
    }

    // Obtener los IDs de las secciones en las que está inscrito el estudiante
    const secciones = seccionesSnapshot.docs.map((doc) => ({
      idSeccion: doc.id,
      ...doc.data(),
    }));
    const seccionIds = secciones.map((seccion) => seccion.idSeccion);

    // Buscar grupos en la colección GrupoCurso que correspondan a esas secciones
    const gruposSnapshot = await db
      .collection("GrupoCurso")
      .where("idSeccion", "in", seccionIds) // Filtrar grupos que pertenecen a estas secciones
      .get();

    if (gruposSnapshot.empty) {
      return [];
    }

    // Obtener los datos de los grupos
    const grupos = gruposSnapshot.docs.map((doc) => ({
      idGrupoCurso: doc.id,
      ...doc.data(),
    }));

    // Consultar cursos para obtener información adicional
    const cursosPromises = grupos.map((grupo) =>
      db.collection("cursos").doc(grupo.idCurso).get()
    );

    const cursosSnapshots = await Promise.all(cursosPromises);

    // Combinar información del grupo con la del curso
    const resultado = grupos.map((grupo, index) => {
      const curso = cursosSnapshots[index].exists
        ? cursosSnapshots[index].data()
        : null;

      return {
        ...grupo,
        curso: curso || {},
        seccion: secciones.find((sec) => sec.idSeccion === grupo.idSeccion) || {},
      };
    });

    return resultado;
  } catch (error) {
    console.error("Error obteniendo los grupos del estudiante:", error);
    throw new Error("Error al obtener los grupos del estudiante.");
  }
};



exports.getGruposBySeccion = async (idSeccion) => {
  try {
    // Consulta inicial a "GrupoCurso"
    const snapshot = await db
      .collection("GrupoCurso")
      .where("idSeccion", "==", idSeccion)
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
    }catch (error) {
      console.error("Error obteniendo los grupos:", error);
      throw new Error("Error al obtener los grupos de la sección.");
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

exports.crearGrupoCurso = async (grupo) => {
  try {
    const nuevoGrupo = await db.collection("GrupoCurso").add(grupo);
    return { idGrupoCurso: nuevoGrupo.id, ...grupo };
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    throw new Error("Ocurrió un error al intentar crear el grupo.");
  }
};

exports.eliminarGrupoCurso = async (idGrupoCurso) => {
  try {
    await db.collection("GrupoCurso").doc(idGrupoCurso).delete();
    return "Grupo eliminado correctamente.";
  } catch (error) {
    console.error("Error al eliminar el grupo:", error);
    throw new Error("Ocurrió un error al intentar eliminar el grupo.");
  }
};

exports.getGrupoCursoById = async (idGrupoCurso) => {
  try {
    const grupo = await db.collection("GrupoCurso").doc(idGrupoCurso).get();
    if (!grupo.exists) {
      throw new Error("No se encontró el grupo.");
    }
    return { idGrupoCurso: grupo.id, ...grupo.data() };
  } catch (error) {
    console.error("Error al obtener el grupo:", error);
    throw new Error("Ocurrió un error al intentar obtener el grupo.");
  }
};

exports.updateGrupoCurso = async (idGrupoCurso, data) => {
  try {
    await db.collection("GrupoCurso").doc(idGrupoCurso).update(data);
    return { idGrupoCurso, ...data };
  } catch (error) {
    console.error("Error al actualizar el grupo:", error);
    throw new Error("Ocurrió un error al intentar actualizar el grupo.");
  }
};