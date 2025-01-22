const db = require("../services/firebase");

exports.CrearSeccion = async (grupo, listaEstudiantes, nivel) => {
  const seccionRef = await db.collection("seccion").add({
    grupo,
    listaEstudiantes,
    nivel,
  });
  return { id: seccionRef.id, grupo, listaEstudiantes, nivel };
};

exports.CrearGrupoCurso = async (horaInicio, horaFin, idCurso, idProfesor, idSeccion) => {
  const grupoCursoRef = await db.collection("GrupoCurso").add({
    horaInicio,
    horaFin,
    idCurso,
    idProfesor,
    idSeccion,
  });
  return { id: grupoCursoRef.id, horaInicio, horaFin, idCurso, idProfesor, idSeccion };
};

exports.asignarEncargadoAEstudiante = async (idEstudiante, idEncargado) => {
  try {
    // Referencia al estudiante
    const estudianteRef = db.collection("estudiantes").doc(idEstudiante);

    // Actualizar el campo 'encargado' con el id del encargado
    await estudianteRef.update({
      encargado: idEncargado,
    });

    return { idEstudiante, idEncargado, message: "Encargado asignado correctamente" };
  } catch (error) {
    console.error("Error al asignar encargado al estudiante:", error.message);
    throw new Error("No se pudo asignar el encargado al estudiante.");
  }
};
