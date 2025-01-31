const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');

router.get('/', anunciosController.obtenerAnuncios);
router.get('/profesor/:idProfesor', anunciosController.obtenerAnunciosByProfesor);
router.get('/grupo/:idGrupo', anunciosController.obtenerAnunciosByGrupo);
router.get('/:id', anunciosController.obtenerAnunciosById);
router.post('/', anunciosController.crearAnuncio);

module.exports = router;