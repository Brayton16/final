const express = require('express');
const router = express.Router();
const seccionController = require('../controllers/seccionController');


router.get("/", seccionController.getSeccion);
router.get("/:id", seccionController.getEstudiantesBySeccion);
router.post("/", seccionController.createSeccion);
router.put("/:id", seccionController.updateSeccion);
router.delete("/:id", seccionController.deleteSeccion);

module.exports = router;