const express = require("express");
const grupoCursoController = require("../controllers/grupoCursoController");
const router = express.Router();

router.get("/grupos/:idProfesor", grupoCursoController.getGruposByProfesor);

module.exports = router;
 