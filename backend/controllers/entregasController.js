const entregasModel = require("../models/entregasModel");  

exports.obtenerEntregas = async (req, res) => {
    try {
        const entregas = await entregasModel.obtenerEntregas();
        res.status(200).json(entregas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerEntregasByAsignacion = async (req, res) => {
    try {
        const entregas = await entregasModel.obtenerEntregasByAsignacion(req.params.idAsignacion);
        res.status(200).json(entregas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerEntregasByEstudiante = async (req, res) => {
    try {
        const entregas = await entregasModel.obtenerEntregasByEstudiante(req.params.idEstudiante);
        res.status(200).json(entregas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerEntregaById = async (req, res) => {
    try {
        const entrega = await entregasModel.obtenerEntregaById(req.params.id);
        res.status(200).json(entrega);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEntregasPorProfesor = async (req, res) => {
    try {
      const resultado = await entregasModel.getEntregasPorProfesor(req.params.idProfesor);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.crearEntrega = async (req, res) => {
    const { idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo } = req.body;
    try {
        if (!idAsignacion) {
            return res.status(400).json({ error: "El ID de la asignación es requerido" });
        } else if (!idEstudiante) {
            return res.status(400).json({ error: "El ID del estudiante es requerido" });
        } else if (!fechaEntrega) {
            return res.status(400).json({ error: "La fecha de entrega es requerida" });
        } else if (!estado) {
            return res.status(400).json({ error: "El estado es requerido" });
        } else if (!archivo) {
            return res.status(400).json({ error: "El archivo es requerido" });
        }else {
            const nuevaEntrega = await entregasModel.crearEntrega(idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo);
            res.status(201).json(nuevaEntrega);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarEntrega = async (req, res) => {
    const { id } = req.params;
    const { idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo } = req.body;
    try {
        const entrega = await entregasModel.obtenerEntregaById(id);
        if (!entrega) {
            return res.status(404).json({ error: "La entrega no existe" });
        } else {
            const entregaActualizada = await entregasModel.actualizarEntrega(id, idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo);
            res.status(200).json(entregaActualizada);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.calificarEntrega = async (req, res) => {
    const { calificacion, retroalimentacion } = req.body;
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ error: "El ID de la entrega es requerido" });
        } else if (!calificacion) {
            return res.status(400).json({ error: "La calificación es requerida" });
        } else if (!retroalimentacion) {
            return res.status(400).json({ error: "La retroalimentación es requerida" });
        }
        const entrega = await entregasModel.calificarEntrega(id, calificacion, retroalimentacion);
        res.status(200).json(entrega);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

