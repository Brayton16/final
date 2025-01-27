const encargadosModel = require("../models/encargadosModel");

exports.getAllEncargados = async (req, res) => {
  try {
    const encargados = await encargadosModel.getAllEncargados();
    res.status(200).json(encargados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEncargadoById = async (req, res) => {
  try {
    const encargado = await encargadosModel.getEncargadoById(req.params.id);
    res.status(200).json(encargado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createEncargado = async (req, res) => {
  const { nombre, apellido, correo, telefono } = req.query;
  try {
    // Validación de datos
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del encargado es requerido" });
    }
    if (!apellido) {
      return res.status(400).json({ error: "El apellido del encargado es requerido" });
    }
    if (!correo) {
      return res.status(400).json({ error: "El email del encargado es requerido" });
    }
    if (!telefono) {
      return res.status(400).json({ error: "El teléfono del encargado es requerido" });
    }

    // Generar una contraseña preestablecida
    const password = `123456`; // Contraseña predefinida (puedes personalizarla)

    // Crear el encargado en Firebase Auth y Firestore
    const nuevoEncargado = await encargadosModel.createEncargado({
      nombre,
      apellido,
      correo,
      telefono,
      password,
    });

    res.status(201).json(nuevoEncargado);
  } catch (error) {
    console.error("Error al crear el encargado:", error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.updateEncargado = async (req, res) => {
    const { nombre, apellido, correo, telefono } = req.query;
  
    try {
      const id = req.params.id;
  
      // Construir un objeto solo con los campos presentes en la query
      const fieldsToUpdate = {};
      if (nombre) fieldsToUpdate.nombre = nombre;
      if (apellido) fieldsToUpdate.apellido = apellido;
      if (correo) fieldsToUpdate.email = email;
      if (telefono) fieldsToUpdate.telefono = telefono;
  
      // Validar que al menos un campo está presente
      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
      }
  
      // Actualizar solo los campos enviados
      const encargadoActualizado = await encargadosModel.updateEncargado(id, fieldsToUpdate);
  
      res.status(200).json(encargadoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//TODO: No se puede eliminar un encargado si tiene estudiantes asignados

exports.deleteEncargado = async (req, res) => {
    try {
        const id = req.params.id;
        const encargadoEliminado = await encargadosModel.deleteEncargado(id);
        res.status(200).json(encargadoEliminado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  