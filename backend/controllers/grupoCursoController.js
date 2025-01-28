const grupoCursoModel = require("../models/grupoCursoModel");

exports.getAllGrupos = async (req, res) => {
  try {
    const grupos = await grupoCursoModel.getAllGrupos();
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGruposByProfesor = async (req, res) => {
  const { idProfesor } = req.params; // Se espera que el idProfesor sea pasado como parámetro en la URL.

  try {
    const grupos = await grupoCursoModel.getGruposByProfesor(idProfesor);
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGruposBySecion = async (req, res) => {
  const { idSeccion } = req.params; // Se espera que el idSeccion sea pasado como parámetro en la URL.
  try {
    const grupos = await grupoCursoModel.getGruposBySeccion(idSeccion);
    if (grupos.length === 0) {
      return res.status(404).json({ message: "No se encontraron grupos para esta sección" });
    }
    res.status(200).json(grupos);
  }
  catch (error) {
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

exports.crearGrupoCurso = async (req, res) => {
  const grupo = req.body; // Se espera que el grupo sea pasado en el cuerpo de la solicitud.
  try {
    const nuevoGrupo = await grupoCursoModel.crearGrupoCurso(grupo);
    res.status(201).json(nuevoGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarGrupoCurso = async (req, res) => {
  const { idGrupoCurso } = req.params; // Se espera que el idGrupoCurso sea pasado como parámetro en la URL.
  try {
    const mensaje = await grupoCursoModel.eliminarGrupoCurso(idGrupoCurso);
    res.status(200).json({ message: mensaje });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarGrupoCurso = async (req, res) => {
  const grupo = req.body; // Se espera que el grupo sea pasado en el cuerpo de la solicitud.
  try {
    const mensaje = await grupoCursoModel.updateGrupoCurso(req.params.idGrupoCurso ,grupo);
    res.status(200).json({ message: mensaje });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGrupoCursoById = async (req, res) => {
  const { idGrupoCurso } = req.params; // Se espera que el idGrupoCurso sea pasado como parámetro en la URL.
  try {
    const grupo = await grupoCursoModel.getGrupoCursoById(idGrupoCurso);
    if (!grupo) {
      return res.status(404).json({ message: "No se encontró el grupo" });
    }
    res.status(200).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};