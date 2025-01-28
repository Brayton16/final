const { auth } = require("../services/firebase"); // Configuración de Firebase
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
    // Crear el usuario en Firebase Auth
    const userRecord = await auth.createUserWithEmailAndPassword(correo, password);

    // Asignar custom claims para el rol "encargado"
    const adminAuth = getAuth(); // Admin SDK
    await adminAuth.setCustomUserClaims(userRecord.user.uid, { role: "encargado" });

    // Guardar el encargado en Firestore
    const encargadoRef = await db.collection("encargados").add({
      authId: userRecord.user.uid, // Relaciona Firestore con Firebase Auth
      nombre,
      apellido,
      correo,
      telefono,
    });

    return { id: encargadoRef.id, ...data, authId: userRecord.user.uid };
  } catch (error) {
    console.error("Error al crear el encargado:", error.message);
    throw error;
  }
};


exports.updateEncargado = async (id, data) => {
  await db.collection("encargados").doc(id).update(data);
  return { id, ...data };
};

exports.deleteEncargado = async (id) => {
  await db.collection("encargados").doc(id).delete();
  return { message: "Encargado eliminado", id };
};