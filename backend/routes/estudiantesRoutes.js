const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/estudiantesController');

//CRUD
router.get('/', estudiantesController.getEstudiantes); // Obtener todos los estudiantes
router.get('/grado', estudiantesController.getEstudiantesByGrado); // Obtener estudiantes por grado
router.get('/encargado/:idEncargado', estudiantesController.getEstudiantesByEncargado); // Obtener estudiantes por encargado
router.get('/:id', estudiantesController.getEstudianteById); // Obtener un estudiante por ID
router.post('/', estudiantesController.createEstudiante); // Crear un estudiante
router.put('/:id', estudiantesController.updateEstudiante); // Actualizar un estudiante
router.delete('/:id', estudiantesController.deleteEstudiante); // Eliminar un estudiante

module.exports = router;