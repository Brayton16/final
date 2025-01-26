const express = require('express');
const router = express.Router();
const seccionController = require('../controllers/seccionController');


router.get("/", seccionController.getSeccion);
router.get("/:id", seccionController.getEstudiantesBySeccion);

module.exports = router;