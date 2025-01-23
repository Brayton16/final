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
