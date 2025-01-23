const seccionModel = require("../models/seccionModel");

exports.getSeccion = async (req, res) => {
  try {
    const seccion = await seccionModel.getAllSeccion();
    res.status(200).json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
