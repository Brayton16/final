const cursosModel = require("../models/cursosModel");

// Obtener todos los cursos
exports.getCursos = async (req, res) => {
  try {
    const cursos = await cursosModel.getAllCursos();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un curso por ID
exports.getCurso = async (req, res) => {
  try {
    const curso = await cursosModel.getCursoById(req.params.id);
    res.status(200).json(curso);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Crear un nuevo curso
exports.createCurso = async (req, res) => {
  const { nombre } = req.query;
  try {
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del curso es requerido" });
    }
    const nuevoCurso = await cursosModel.createCurso({ nombre });
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un curso por ID
exports.updateCurso = async (req, res) => {
  const { nombre } = req.query;
  try {
    const id = req.params.id;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del curso es requerido" });
    }
    const cursoActualizado = await cursosModel.updateCurso(id, { nombre });
    res.status(200).json(cursoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un curso por ID
exports.deleteCurso = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await cursosModel.deleteCurso(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
