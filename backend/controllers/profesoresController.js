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

exports.getProfesoresByEspecialidad = async (req, res) => {
  try {
    const profesores = await profesoresModel.getProfesoresByEspecialidad(req.params.especialidad);
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCantidadProfesoresPorEspecialidad = async (req, res) => {
  try {
    const profesoresPorEspecialidad = await profesoresModel.getCantidadProfesoresPorEspecialidad();
    res.status(200).json(profesoresPorEspecialidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createProfesor = async (req, res) => {
  const { nombre, apellido, correo, telefono, especialidad } = req.query;
  try {
    if (!nombre ) {
      return res.status(400).json({ error: "El nombre del profesor es requeridos" });
    }else if (!apellido) {
      return res.status(400).json({ error: "El apellido del profesor es requerido" });
    } else if (!correo) {
      return res.status(400).json({ error: "El correo del profesor es requerido" });
    } else if (!telefono) {
      return res.status(400).json({ error: "El teléfono del profesor es requerido" });
    } else if (!especialidad) {
      return res.status(400).json({ error: "La especialidad del profesor es requerida" });
    }
    const password = '123456'; // Contraseña predefinida (puedes personalizarla)
    const nuevoProfesor = await profesoresModel.createProfesor({ nombre, apellido, correo, telefono, especialidad, password });
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfesor = async (req, res) => {
  const { nombre, apellido, correo, telefono, especialidad } = req.query;
  try {
    const id = req.params.id;
    
    const fieldsToUpdate = {};
    if (nombre) fieldsToUpdate.nombre = nombre;
    if (apellido) fieldsToUpdate.apellido = apellido;
    if (correo) fieldsToUpdate.correo = correo;
    if (telefono) fieldsToUpdate.telefono = telefono;
    if (especialidad) fieldsToUpdate.especialidad = especialidad;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
    }

    const profesorActualizado = await profesoresModel.updateProfesor(id, fieldsToUpdate);
    res.status(200).json(profesorActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Todo: Si el profesor tiene un curso asignado, no se puede eliminar sin reemplazarlo

exports.deleteProfesor = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await profesoresModel.deleteProfesor(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

