const express = require("express"); 
const router = express.Router();
const encargadosController = require("../controllers/encargadosController");

//CRUD
router.get("/", encargadosController.getAllEncargados); // Obtener todos los encargados
router.get("/:id", encargadosController.getEncargadoById); // Obtener un encargado por ID
router.post("/", encargadosController.createEncargado); // Crear un encargado
router.put("/:id", encargadosController.updateEncargado); // Actualizar un encargado
//router.delete("/:id", encargadosController.deleteEncargado); // Eliminar un encargado

module.exports = router;