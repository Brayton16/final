const db = require("../services/firebase");

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
    const receptorNombre = await obtenerNombrePorUserId(idReceptor);

    // Obtener el último mensaje de la conversación (si existe)
    const ultimoMensaje = conversacion.mensajes && conversacion.mensajes.length > 0
      ? conversacion.mensajes[conversacion.mensajes.length - 1].texto // Extraer el texto del último mensaje
      : "No hay mensajes";

    return {
      ...conversacion,
      receptorNombre: receptorNombre,
      ultimoMensaje: ultimoMensaje,
    };
  }));

  return conversaciones;
};

//todo: clean unused code
exports.getConversacionById = async (id) => {
  const conversacionDoc = await db.collection("conversaciones").doc(id).get();
  if (!conversacionDoc.exists) throw new Error("Conversación no encontrada");

  // Obtener los datos de la conversación
  const conversacionData = conversacionDoc.data();

  // Obtener el nombre del emisor

  const emisorDoc = await db.collection("administradores").doc(conversacionData.idEmisor).get();
  //const emisorNombre = emisorDoc.exists ? emisorDoc.data().nombre : "Usuario desconocido";
  const emisorNombre = await obtenerNombrePorUserId(conversacionData.idEmisor);

  // Obtener el nombre del receptor
  const receptorDoc = await db.collection("estudiantes").doc(conversacionData.idReceptor).get();
  //const receptorNombre = receptorDoc.exists ? receptorDoc.data().nombre : "Usuario desconocido";
  const receptorNombre = await obtenerNombrePorUserId(conversacionData.idReceptor);

  // Obtener los mensajes, si existen
  const mensajes = conversacionData.mensajes || [];

  return {
    id: conversacionDoc.id,
    ...conversacionData,
    emisorNombre,
    receptorNombre,
    mensajes,
  };
};


exports.sendMessage = async (id, mensaje) => {
  const conversacionRef = db.collection("conversaciones").doc(id);
  const conversacionDoc = await conversacionRef.get();

  if (!conversacionDoc.exists) throw new Error("Conversación no encontrada");

  // Obtener los mensajes existentes, si no existen inicializamos un array vacío
  const mensajes = conversacionDoc.data().mensajes || [];

  // Crear el nuevo mensaje
  const nuevoMensaje = {
    emisor: mensaje.enviadoPor, // El ID de quien envió el mensaje
    texto: mensaje.texto,   // El texto del mensaje
  };

  // Agregar el nuevo mensaje al array de mensajes
  await conversacionRef.update({
    mensajes: [...mensajes, nuevoMensaje],
  });

  // Retornar el nuevo mensaje agregado
  return nuevoMensaje;
};

exports.createConversacion = async (data) => {
  const { idEmisor, idReceptor } = data;

  // Buscar si ya existe una conversación entre los dos usuarios
  const query = db.collection("conversaciones")
    .where("idEmisor", "in", [idEmisor, idReceptor])
    .where("idReceptor", "in", [idEmisor, idReceptor]);

  const snapshot = await query.get();

  // Si la conversación ya existe, devolver su ID
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id };
  }

  // Si no existe, crear una nueva conversación
  const nuevaConversacion = {
    idEmisor,
    idReceptor,
    mensajes: [],
  };

  const conversacionRef = await db.collection("conversaciones").add(nuevaConversacion);
  
  return { id: conversacionRef.id };
};


const obtenerNombrePorUserId = async (userId) => {
  // Lista de colecciones a buscar
  const colecciones = [
    "administradores", // Primera colección
    "encargados",        // Segunda colección (puedes agregar más colecciones)
    "profesores",      // Tercera colección
    "estudiantes"
  ];

  // Buscar en cada colección hasta encontrar el nombre
  for (let coleccion of colecciones) {
    const doc = await db.collection(coleccion).doc(userId).get();
    
    if (doc.exists) {
      return `${doc.data().nombre} ${doc.data().apellido}`;
    }
  }

  // Si no se encontró en ninguna colección
  return "La funcion cromo (no encontro el nombre)"; 
};

{/*
exports.createConversacion = async (emisorId, receptorId) => {
  const q = query(
    collection(db, "conversaciones"),
    where("idEmisor", "in", [emisorId, receptorId]),
    where("idReceptor", "in", [emisorId, receptorId])
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].id; // Retorna solo el ID si ya existe
  }

  // Si no existe, crearla
  const nuevaConversacion = {
    idEmisor: emisorId,
    idReceptor: receptorId,
    mensajes: [],
  };

  const docRef = await addDoc(collection(db, "conversaciones"), nuevaConversacion);
  return docRef.id; // Retorna el ID de la nueva conversación
};
*/}