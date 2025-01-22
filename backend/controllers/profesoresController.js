const profesoresModel = require("../models/profesoresModel");

exports.getProfesores = async (req, res) => {
  try {
    const profesores = await profesoresModel.getAllProfesores();
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfesor = async (req, res) => {
  try {
    const profesor = await profesoresModel.getProfesorById(req.params.id);
    res.status(200).json(profesor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createProfesor = async (req, res) => {
  const { nombre, apellido } = req.query;
  try {
    if (!nombre ) {
      return res.status(400).json({ error: "El nombre del profesor es requeridos" });
    }else if (!apellido) {
      return res.status(400).json({ error: "El apellido del profesor es requerido" });
    }
    const nuevoProfesor = await profesoresModel.createProfesor({ nombre, apellido });
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfesor = async (req, res) => {
  const { nombre, apellido } = req.query;
  try {
    const id = req.params.id;
    
    const fieldsToUpdate = {};
    if (nombre) fieldsToUpdate.nombre = nombre;
    if (apellido) fieldsToUpdate.apellido = apellido;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
    }

    const profesorActualizado = await profesoresModel.updateProfesor(id, fieldsToUpdate);
    res.status(200).json(profesorActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProfesor = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await profesoresModel.deleteProfesor(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};