const db = require("../services/firebase");

exports.getAllProfesores = async () => {
  const snapshot = await db.collection("profesores").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.getProfesorById = async (id) => {
  const profesorDoc = await db.collection("profesores").doc(id).get();
  if (!profesorDoc.exists) throw new Error("Profesor no encontrado");
  return { id: profesorDoc.id, ...profesorDoc.data() };
};

exports.createProfesor = async (data) => {
  const profesorRef = await db.collection("profesores").add(data);
  return { id: profesorRef.id, ...data };
};

exports.updateProfesor = async (id, data) => {
  await db.collection("profesores").doc(id).update(data);
  return { id, ...data };
};

exports.deleteProfesor = async (id) => {
  await db.collection("profesores").doc(id).delete();
  return { message: "Profesor eliminado", id };
};