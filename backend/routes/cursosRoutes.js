const express = require("express");
const router = express.Router();
const cursosController = require("../controllers/cursosController");


//CRUD
router.get("/", cursosController.getCursos); // Obtener todos los cursos
router.get("/:id", cursosController.getCurso); // Obtener un curso por ID
router.post("/", cursosController.createCurso); // Crear un curso
router.put("/:id", cursosController.updateCurso); // Actualizar un curso
router.delete("/:id", cursosController.deleteCurso); // Eliminar un curso

module.exports = router;
