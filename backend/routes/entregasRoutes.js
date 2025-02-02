const express = require('express');
const router = express.Router();
const entregasController = require('../controllers/entregasController');

router.get('/', entregasController.obtenerEntregas);
router.get('/asignacion/:idAsignacion', entregasController.obtenerEntregasByAsignacion);
router.get('/estudiante/:idEstudiante', entregasController.obtenerEntregasByEstudiante);
router.get('/profesor/:idProfesor', entregasController.getEntregasPorProfesor); // Nueva ruta
router.get('/:id', entregasController.obtenerEntregaById);
router.post('/', entregasController.crearEntrega);
router.put('/:id', entregasController.actualizarEntrega);
router.put('/calificar/:id', entregasController.calificarEntrega);

module.exports = router;