const express = require('express');
const router = express.Router();
const conversacionesController = require('../controllers/chatsController');

router.get('/', conversacionesController.getConversaciones);
router.get('/:id', conversacionesController.getConversacion);
router.post('/:id', conversacionesController.sendMessage);
router.post('/new', conversacionesController.createConversacion);

module.exports = router;
