const db = require("../services/firebase");

exports.CrearSeccion = async (grupo, listaEstudiantes, nivel) => {
  const seccionRef = await db.collection("secciones").add({
    grupo,
    listaEstudiantes,
    nivel,
  });
  return { id: seccionRef.id, grupo, listaEstudiantes, nivel };
};

exports.CrearGrupoCurso = async (horaInicio, horaFin, idCurso, idProfesor, idSeccion) => {
  const grupoCursoRef = await db.collection("grupos_cursos").add({
    horaInicio,
    horaFin,
    idCurso,
    idProfesor,
    idSeccion,
  });
  return { id: grupoCursoRef.id, horaInicio, horaFin, idCurso, idProfesor, idSeccion };
};

exports.asginarEncargadoAEstudiante = async (idEstudiante, idEncargado) => {
    const estudianteRef = db.collection("estudiantes").add({
      idEncargado,
    });
    return { id: estudianteRef.id, idEncargado };
}