const express = require("express");
const grupoCursoController = require("../controllers/grupoCursoController");
const router = express.Router();

router.get("/grupos/:idProfesor", grupoCursoController.getGruposByProfesor);
router.put("/grupos/actualizar-profesor", grupoCursoController.actualizarIdProfesor);

module.exports = router;
 