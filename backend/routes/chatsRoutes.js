const express = require('express');
const router = express.Router();
const conversacionesController = require('../controllers/chatsController');

router.get('/', conversacionesController.getConversaciones);
router.get('/:id', conversacionesController.getConversacion);
router.post('/:id/mensajes', conversacionesController.sendMessage);
router.post('/', conversacionesController.createConversacion);

module.exports = router;
