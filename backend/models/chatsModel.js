const db = require("../services/firebase");

// Cargar todas las conversaciones (incluyendo el nombre del interlocutor y el último mensaje)
exports.getAllConversaciones = async (userId) => {
  // Obtener conversaciones donde el usuario es el emisor
  const emisorSnapshot = await db
    .collection("conversaciones")
    .where("idEmisor", "==", userId)
    .get();

  // Obtener conversaciones donde el usuario es el receptor
  const receptorSnapshot = await db
    .collection("conversaciones")
    .where("idReceptor", "==", userId)
    .get();

  // Combinar ambos resultados (emisor y receptor)
  const todasLasConversaciones = [
    ...emisorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ...receptorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  ];

  // Eliminar duplicados si hay conversaciones en las que el usuario es tanto emisor como receptor
  const conversacionesUnicas = Array.from(new Set(todasLasConversaciones.map(c => c.id)))
    .map(id => todasLasConversaciones.find(c => c.id === id));

  // Obtener los nombres de los receptores de las conversaciones y el último mensaje
  const conversaciones = await Promise.all(conversacionesUnicas.map(async (conversacion) => {
    const idReceptor = conversacion.idEmisor === userId ? conversacion.idReceptor : conversacion.idEmisor;
    const receptorSnapshot = await db.collection("administradores").doc(idReceptor).get();
    const receptor = receptorSnapshot.exists ? receptorSnapshot.data() : { nombre: "Usuario desconocido" };

    // Obtener el último mensaje de la conversación (si existe)
    const ultimoMensaje = conversacion.mensajes && conversacion.mensajes.length > 0
      ? conversacion.mensajes[conversacion.mensajes.length - 1] // Suponemos que solo quieres el texto del último mensaje
      : "No hay mensajes";

    return {
      ...conversacion,
      receptorNombre: receptor.nombre,
      ultimoMensaje: ultimoMensaje,
    };
  }));

  return conversaciones;
};

// Ver una conversación específica (devolver todos los mensajes)
exports.getConversacionById = async (id) => {
  const conversacionDoc = await db.collection("conversaciones").doc(id).get();
  if (!conversacionDoc.exists) throw new Error("Conversación no encontrada");

  // Obtener los mensajes, si existen
  const conversacionData = conversacionDoc.data();
  const mensajes = conversacionData.mensajes || [];

  return { id: conversacionDoc.id, ...conversacionData, mensajes };
};


// Enviar un mensaje dentro de un chat existente
exports.sendMessage = async (id, mensaje) => {
  const conversacionRef = db.collection("conversaciones").doc(id);
  const conversacionDoc = await conversacionRef.get();

  if (!conversacionDoc.exists) throw new Error("Conversación no encontrada");

  // Obtener los mensajes existentes, si no existen inicializamos un array vacío
  const mensajes = conversacionDoc.data().mensajes || [];

  // Crear el nuevo mensaje
  const nuevoMensaje = {
    texto: mensaje.texto,       // El texto del mensaje
    enviadoPor: mensaje.enviadoPor  // El ID de quien envió el mensaje
  };

  // Agregar el nuevo mensaje al array de mensajes
  await conversacionRef.update({
    mensajes: [...mensajes, nuevoMensaje],
  });

  // Retornar el nuevo mensaje agregado
  return nuevoMensaje;
};


// Crear un nuevo chat
exports.createConversacion = async (data) => {
  const { idEmisor, idReceptor, primerMensaje } = data;

  const nuevaConversacion = {
    idEmisor,
    idReceptor,
    mensajes: [
      {
        texto: primerMensaje,
        enviadoPor: idEmisor,
      },
    ],
  };

  const conversacionRef = await db.collection("conversaciones").add(nuevaConversacion);
  return { id: conversacionRef.id, ...nuevaConversacion };
};
