const express = require('express');
const router = express.Router();
const administradoresController = require('../controllers/administradoresController');

router.post('/seccion', administradoresController.crearSeccion);
router.post('/grupoCurso', administradoresController.crearGrupoCurso);
router.post('/encargado', administradoresController.asignarEncargadoAEstudiante);