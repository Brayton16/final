const anunciosModel = require("../models/anunciosModel");

exports.obtenerAnuncios = async (req, res) => {
    try {
        const anuncios = await anunciosModel.obtenerAnuncios();
        res.status(200).json(anuncios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerAnunciosById = async (req, res) => {
    try {
        const anuncio = await anunciosModel.obtenerAnuncioById(req.params.id);
        res.status(200).json(anuncio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerAnunciosByGrupo = async (req, res) => {
    try {
        const anuncios = await anunciosModel.obtenerAnunciosByGrupo(req.params.idCurso);
        res.status(200).json(anuncios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerAnunciosByProfesor = async (req, res) => {
    try {
        const anuncios = await anunciosModel.obtenerAnunciosByProfesor(req.params.idProfesor);
        res.status(200).json(anuncios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearAnuncio = async (req, res) => {
    const { idGrupoCurso, titulo, mensaje, fechaPublicacion, auto, importancia } = req.body;
    try {
        if(!idGrupoCurso || !titulo || !mensaje || !fechaPublicacion || !auto || !importancia) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        const anuncio = await anunciosModel.crearAnuncio(idGrupoCurso, titulo, mensaje, fechaPublicacion, auto, importancia);
        res.status(201).json(anuncio);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};
