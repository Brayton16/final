const express = require('express');
const router = express.Router();
const asignacionesController = require('../controllers/asignacionesController');

router.get('/', asignacionesController.obtenerAsignaciones);
router.get('/grupo/:idGrupo', asignacionesController.obtenerAsignacionesByGrupo);
router.get('/profesor/:idProfesor', asignacionesController.obtenerAsignacionesByProfesor);
router.get('/:id', asignacionesController.obtenerAsignacionesById);
router.post('/', asignacionesController.crearAsignacion);
router.put('/:id', asignacionesController.actualizarAsignacion);
router.delete('/:id', asignacionesController.eliminarAsignacion);

module.exports = router;