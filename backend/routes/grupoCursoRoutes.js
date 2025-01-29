const express = require("express");
const grupoCursoController = require("../controllers/grupoCursoController");
const router = express.Router();

router.get("/grupos", grupoCursoController.getAllGrupos);
router.get("/grupos/seccion/:idSeccion", grupoCursoController.getGruposBySecion);
router.get("/grupos/profesor/:idProfesor", grupoCursoController.getGruposByProfesor);
router.get("/grupos/estudiante/:idEstudiante", grupoCursoController.getGruposByEstudiante);
router.get("/grupos/:idGrupoCurso", grupoCursoController.getGrupoCursoById);
router.put("/grupos/actualizar-profesor", grupoCursoController.actualizarIdProfesor);
router.put("/grupos/:idGrupoCurso", grupoCursoController.actualizarGrupoCurso);
router.post("/grupos", grupoCursoController.crearGrupoCurso);
router.delete("/grupos/:idGrupoCurso", grupoCursoController.eliminarGrupoCurso);

module.exports = router;
 