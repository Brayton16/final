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
        const anuncios = await anunciosModel.obtenerAnunciosByGrupo(req.params.idGrupo);
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
    const { idGrupoCurso, idProfesor, titulo, mensaje, fechaPublicacion, autor, importancia } = req.body;
    try {
        if(!idGrupoCurso || !idProfesor || !titulo || !mensaje || !fechaPublicacion || !autor || !importancia) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        const anuncio = await anunciosModel.crearAnuncio(idGrupoCurso, idProfesor, titulo, mensaje, fechaPublicacion, autor, importancia);
        res.status(201).json(anuncio);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};
