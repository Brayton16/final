const grupoCursoModel = require("../models/grupoCursoModel");

exports.getGruposByProfesor = async (req, res) => {
  const { idProfesor } = req.params; // Se espera que el idProfesor sea pasado como parámetro en la URL.

  try {
    const grupos = await grupoCursoModel.getGruposByProfesor(idProfesor);

    if (grupos.length === 0) {
      return res.status(404).json({ message: "No se encontraron grupos para este profesor" });
    }

    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarIdProfesor = async (req, res) => {
  const { idGrupoCurso } = req.body; // Se espera que el idGrupoCurso sea pasado en el cuerpo de la solicitud.
  const { nuevoIdProfesor } = req.body; // Se espera que el nuevoIdProfesor también sea pasado en el cuerpo.

  try {
    const mensaje = await grupoCursoModel.actualizarIdProfesor(idGrupoCurso, nuevoIdProfesor);

    if (mensaje.includes("No se encontró")) {
      return res.status(404).json({ message: mensaje });
    }

    res.status(200).json({ message: mensaje });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
