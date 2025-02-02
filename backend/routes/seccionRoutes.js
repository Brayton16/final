const express = require('express');
const router = express.Router();
const seccionController = require('../controllers/seccionController');


router.get("/", seccionController.getSeccion);
router.get('/estudiantes-por-seccion', seccionController.getCantidadEstudiantesPorSeccion);
router.get("/:id", seccionController.getSeccionById);
router.get("/estudiantes/:id", seccionController.getEstudiantesBySeccion);
router.get("/seccion/:idEstudiante", seccionController.getSeccionByEstudiante);
router.post("/", seccionController.createSeccion);
router.put("/:id", seccionController.updateSeccion);
router.delete("/:id", seccionController.deleteSeccion);

module.exports = router;