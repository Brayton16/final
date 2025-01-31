const asignacionesModel = require("../models/asignacionesModel");

exports.obtenerAsignaciones = async (req, res) => {
    try {
        const asignaciones = await asignacionesModel.obtenerAsignaciones();
        res.status(200).json(asignaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerAsignacionesById = async (req, res) => {
    try {
        const asignacion = await asignacionesModel.obtenerAsignacionById(req.params.id);
        res.status(200).json(asignacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerAsignacionesByGrupo = async (req, res) => {
    try {
        const asignaciones = await asignacionesModel.obtenerAsignacionesByGrupo(req.params.idGrupo);
        res.status(200).json(asignaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerAsignacionesByProfesor = async (req, res) => {
    try {
        const asignaciones = await asignacionesModel.obtenerAsignacionesByProfesor(req.params.idProfesor);
        res.status(200).json(asignaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearAsignacion = async (req, res) => {
    const { titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo } = req.body;
    try {
        if (!titulo) {
            return res.status(400).json({ error: "El título es requerido" });
        } else if (!descripcion) {
            return res.status(400).json({ error: "La descripción es requerida" });
        } else if (!idProfesor) {
            return res.status(400).json({ error: "El ID del profesor es requerido" });
        } else if (!idCurso) {
            return res.status(400).json({ error: "El ID del curso es requerido" });
        } else if (!idGrupoCurso) {
            return res.status(400).json({ error: "El ID del grupo de curso es requerido" });
        } else if (!fechaEntrega) {
            return res.status(400).json({ error: "El campo de fecha de entrega es requerido" });
        } else if (!recursos) {
            return res.status(400).json({ error: "Los recursos son requeridos" });
        } else if (!tipo) {
            return res.status(400).json({ error: "El tipo de asignación es requerido" });
        }
        const asignacion = await asignacionesModel.crearAsignacion(titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo);
        res.status(201).json(asignacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarAsignacion = async (req, res) => {
    const { titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo } = req.body;
    try {
        if (!titulo) {
            return res.status(400).json({ error: "El título es requerido" });
        } else if (!descripcion) {
            return res.status(400).json({ error: "La descripción es requerida" });
        } else if (!idProfesor) {
            return res.status(400).json({ error: "El ID del profesor es requerido" });
        } else if (!idCurso) {
            return res.status(400).json({ error: "El ID del curso es requerido" });
        } else if (!idGrupoCurso) {
            return res.status(400).json({ error: "El ID del grupo de curso es requerido" });
        } else if (!fechaEntrega) {
            return res.status(400).json({ error: "El campo de fecha de entrega es requerido" });
        } else if (!recursos) {
            return res.status(400).json({ error: "Los recursos son requeridos" });
        } else if (!tipo) {
            return res.status(400).json({ error: "El tipo de asignación es requerido" });
        }
        const asignacion = await asignacionesModel.actualizarAsignacion(req.params.id, titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo);
        res.status(200).json(asignacion);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarAsignacion = async (req, res) => {
    try {
        await asignacionesModel.eliminarAsignacion(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};



