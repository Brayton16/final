const express = require("express");
const router = express.Router();
const profesoresController = require("../controllers/profesoresController");


//CRUD
router.get("/", profesoresController.getProfesores); // Obtener todos los profesores
router.get("/especialidades", profesoresController.getCantidadProfesoresPorEspecialidad); // Obtener profesores por especialidad

router.get("/:id", profesoresController.getProfesor); // Obtener un profesor por ID
router.post("/", profesoresController.createProfesor); // Crear un profesor
router.put("/:id", profesoresController.updateProfesor); // Actualizar un profesor
router.delete("/:id", profesoresController.deleteProfesor); // Eliminar un profesor


module.exports = router;