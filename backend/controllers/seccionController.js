const seccionModel = require("../models/seccionModel");

exports.getSeccion = async (req, res) => {
  try {
    const seccion = await seccionModel.getAllSeccion();
    res.status(200).json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSeccionById = async (req, res) => {
  try {
    const seccion = await seccionModel.getSeccionById(req.params.id);
    res.status(200).json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCantidadEstudiantesPorSeccion = async (req, res) => {
  try {
    const resultado = await seccionModel.getCantidadEstudiantesPorSeccion();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSeccionByEstudiante = async (req, res) => {
  try {
    const seccion = await seccionModel.getSeccionByEstudiante(req.params.idEstudiante);
    res.status(200).json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEstudiantesBySeccion = async (req, res) => {
  try {
    // Obtener el ID de la sección desde los parámetros de la URL
    const { id } = req.params;
    // Validar que el ID no esté vacío
    if (!id) {
      return res.status(400).json({ error: "El ID de la sección es requerido." });
    }

    // Llamar a la función del modelo para obtener los estudiantes
    const estudiantes = await seccionModel.getEstudiantesBySeccion(id);

    // Responder con los datos obtenidos
    res.status(200).json(estudiantes);
  } catch (error) {
    // Manejar errores y enviar una respuesta de error
    console.error("Error al obtener los estudiantes por sección:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createSeccion = async (req, res) => {
  const { grupo, nivel, listaEstudiantes } = req.body;
  try {
    if (!grupo) {
      return res.status(400).json({ error: "El grupo es requerido" });
    } else if (!nivel) {
      return res.status(400).json({ error: "El nivel es requerido" });
    } else if (!listaEstudiantes) {
      return res.status(400).json({ error: "La lista de estudiantes es requerida" });
    }
    console.log(grupo, nivel, listaEstudiantes);
    const seccion = await seccionModel.createSeccion(grupo, nivel, listaEstudiantes);
    res.status(201).json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSeccion = async (req, res) => {
  const { grupo, nivel, listaEstudiantes } = req.body;
  try {
    const id = req.params.id;
    if (!grupo && !nivel && !listaEstudiantes) {
      return res.status(400).json({ error: "Al menos un campo es requerido" });
    }
    const seccion = await seccionModel.updateSeccion(id, grupo, nivel, listaEstudiantes);
    res.status(200).json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSeccion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "El ID de la sección es requerido" });
    }
    await seccionModel.deleteSeccion(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};