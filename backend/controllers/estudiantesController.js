const e = require("express");
const estudiantesModel = require("../models/estudiantesModel");

exports.getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await estudiantesModel.getAllEstudiantes();
        res.status(200).json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEstudianteById = async (req, res) => {
    try {
        const estudiante = await estudiantesModel.getEstudianteById(req.params.id);
        res.status(200).json(estudiante);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

//TODO: Cambiar a que reciba el grado por query
exports.getEstudiantesByGrado = async (req, res) => {
    const { grado } = req.query;
    try {
        const estudiantes = await estudiantesModel.getEstudiantesByGrado(grado);
        res.status(200).json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEstudiante = async (req, res) => {
    const { nombre, apellido, grado, correo } = req.query;
    try {
        if(!nombre){
            return res.status(400).json({ error: "El nombre del estudiante es requerido" });
        }else if(!apellido){
            return res.status(400).json({ error: "El apellido del estudiante es requerido" });
        }else if(!grado){
            return res.status(400).json({ error: "El grado del estudiante es requerido" });
        }else if(!correo){
            return res.status(400).json({ error: "El correo del estudiante es requerido" });
        }

        const estudiante = await estudiantesModel.createEstudiante({ nombre, apellido, grado, correo });
        res.status(201).json(estudiante);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEstudiante = async (req, res) => {
    const { nombre, apellido, grado, correo } = req.query;
    try {
        const id = req.params.id;

        const fieldsToUpdate = {};
        if (nombre) fieldsToUpdate.nombre = nombre;
        if (apellido) fieldsToUpdate.apellido = apellido;
        if (grado) fieldsToUpdate.grado = grado;
        if (correo) fieldsToUpdate.correo = correo;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        }

        const estudiante = await estudiantesModel.updateEstudiante(id, fieldsToUpdate);
        res.status(200).json(estudiante);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//TODO: Si estudiante está en una sección, no se puede eliminar

exports.deleteEstudiante = async (req, res) => {
    try {
        const estudiante = await estudiantesModel.deleteEstudiante(req.params.id);
        res.status(200).json(estudiante);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};