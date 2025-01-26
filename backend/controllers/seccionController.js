const seccionModel = require("../models/seccionModel");

exports.getSeccion = async (req, res) => {
  try {
    const seccion = await seccionModel.getAllSeccion();
    res.status(200).json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEstudiantesBySeccion = async (req, res) => {
  try {
    // Obtener el ID de la sección desde los parámetros de la URL
    const { id } = req.params;
    console.log("hola ", id);
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