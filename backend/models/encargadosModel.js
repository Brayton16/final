const { getAuth } = require("firebase-admin/auth"); // SDK Admin para claims
const db = require("../services/firebase");

exports.getAllEncargados = async () => {
  const snapshot = await db.collection("encargados").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.getEncargadoById = async (id) => {
  const encargadoDoc = await db.collection("encargados").doc(id).get();
  if (!encargadoDoc.exists) throw new Error("Encargado no encontrado");
  return { id: encargadoDoc.id, ...encargadoDoc.data() };
};

exports.createEncargado = async (data) => {
  const { correo, password, nombre, apellido, telefono } = data;

  try {
    // Crear el usuario en Firebase Auth usando el SDK Admin
    const adminAuth = getAuth(); // Admin SDK
    const userRecord = await adminAuth.createUser({
      email: correo,
      password: password,
      displayName: `${nombre} ${apellido}`,
    });

    // Asignar custom claims para el rol "encargado"
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "encargado" });

    // Guardar el encargado en Firestore con el UID como ID del documento
    const encargadoRef = db.collection("encargados").doc(userRecord.uid);
    await encargadoRef.set({
      nombre,
      apellido,
      correo,
      telefono,
    });

    return { id: userRecord.uid, ...data };
  } catch (error) {
    console.error("Error al crear el encargado:", error.message);
    throw error;
  }
};

exports.updateEncargado = async (id, data) => {
  await db.collection("encargados").doc(id).update(data);
  return { id, ...data };
};

exports.deleteEncargado = async (encargadoId) => {
  try {
    // Obtén el documento del encargado desde Firestore
    const encargadoDoc = await db.collection("encargados").doc(encargadoId).get();

    if (!encargadoDoc.exists) {
      throw new Error("Encargado no encontrado");
    }

    const encargadoData = encargadoDoc.data();

    // Verifica si el correo existe en los datos del encargado
    if (encargadoData.correo) {
      const adminAuth = getAuth(); // Inicializa el Auth del Admin SDK
      
      try {
        // Busca al usuario por correo
        const userRecord = await adminAuth.getUserByEmail(encargadoData.correo);

        // Elimina al usuario del Auth si existe
        if (userRecord && userRecord.uid) {
          await adminAuth.deleteUser(userRecord.uid);
          console.log(`Usuario con correo ${encargadoData.correo} eliminado de Firebase Auth`);
        }
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          console.log(`El usuario con correo ${encargadoData.correo} no se encontró en Firebase Auth.`);
        } else {
          throw error; // Si es otro error, propágalo
        }
      }
    }

    // Elimina el documento del encargado de Firestore
    await db.collection("encargados").doc(encargadoId).delete();
    console.log(`Encargado con ID ${encargadoId} eliminado de Firestore`);

    return { message: "Encargado eliminado con éxito" };
  } catch (error) {
    console.error("Error al eliminar el encargado:", error.message);
    throw error;
  }
};