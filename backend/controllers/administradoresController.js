const administradoresModel = require("../models/administradoresModel"); 

exports.crearSeccion = async (req, res) => {
    const { grupo, listaEstudiantes, nivel } = req.body;
    try {
        if (!grupo) {
            return res.status(400).json({ error: "El grupo es requerido" });
        } else if (!listaEstudiantes) {
            return res.status(400).json({ error: "La lista de estudiantes es requerida" });
        } else if (!nivel) {
            return res.status(400).json({ error: "El nivel es requerido" });
        }
        const seccion = await administradoresModel.CrearSeccion(grupo, listaEstudiantes, nivel);
        res.status(201).json(seccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearGrupoCurso = async (req, res) => {
    const { horaInicio, horaFin, idCurso, idProfesor, idSeccion } = req.query;
    try {
        if (!horaInicio) {
            return res.status(400).json({ error: "La hora de inicio es requerida" });
        } else if (!horaFin) {
            return res.status(400).json({ error: "La hora de fin es requerida" });
        } else if (!idCurso) {
            return res.status(400).json({ error: "El ID del curso es requerido" });
        } else if (!idProfesor) {
            return res.status(400).json({ error: "El ID del profesor es requerido" });
        } else if (!idSeccion) {
            return res.status(400).json({ error: "El ID de la sección es requerido" });
        }
        const grupoCurso = await administradoresModel.CrearGrupoCurso(horaInicio, horaFin, idCurso, idProfesor, idSeccion);
        res.status(201).json(grupoCurso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.asignarEncargadoAEstudiante = async (req, res) => {
    const { idEstudiante, idEncargado } = req.query;
    try {
        if (!idEstudiante) {
            return res.status(400).json({ error: "El ID del estudiante es requerido" });
        } else if (!idEncargado) {
            return res.status(400).json({ error: "El ID del encargado es requerido" });
        }
        const estudiante = await administradoresModel.asignarEncargadoAEstudiante(idEstudiante, idEncargado);
        res.status(201).json(estudiante);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};