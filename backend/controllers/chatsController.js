const conversacionesModel = require("../models/chatsModel");

// Cargar todas las conversaciones
exports.getConversaciones = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "El ID del usuario es requerido" });
    }

    const conversaciones = await conversacionesModel.getAllConversaciones(userId);
    res.status(200).json(conversaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver una conversación específica
exports.getConversacion = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "El ID de la conversación es requerido" });
    }

    const conversacion = await conversacionesModel.getConversacionById(id);
    res.status(200).json(conversacion);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    console.log("Body recibido:", req.body); // 🔍 Ver qué datos llegan al servidor

    const { id, texto, enviadoPor } = req.body;
    console.log("ID:", id, "Texto:", texto, "Enviado por:", enviadoPor);
    if (!id) {
      return res.status(400).json({ error: "El ID de la conversación es requerido" });
    }
    if (!texto) {
      return res.status(400).json({ error: "El texto del mensaje es requerido" });
    }
    if (!enviadoPor) {
      return res.status(400).json({ error: "El ID del emisor es requerido" });
    }

    const nuevoMensaje = await conversacionesModel.sendMessage(id, { texto, enviadoPor });
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Crear un nuevo chat
exports.createConversacion = async (req, res) => {
  try {
    console.log("Cuerpo de la solicitud:", req.body);
    const { idEmisor, idReceptor } = req.body;
    console.log("Emisor:", idEmisor, "Receptor:", idReceptor, "En createConversacion");
    if (!idEmisor || !idReceptor) {
      return res.status(400).json({ error: "El ID del emisor y el receptor son requeridos" });
    }

    const data = {
      idEmisor,
      idReceptor,}

    const nuevaConversacion = await conversacionesModel.createConversacion(data);
    res.status(201).json(nuevaConversacion);
  } catch (error) {
    res.status(500).json({ "Sitio":"createConversacion controller" , error: error.message });
  }
};
