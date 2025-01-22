const db = require("../services/firebase");

exports.getAllEstudiantes = async () => {
  const snapshot = await db.collection("estudiantes").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.getEstudianteById = async (id) => {
  const estudianteDoc = await db.collection("estudiantes").doc(id).get();
  if (!estudianteDoc.exists) throw new Error("Estudiante no encontrado");
  return { id: estudianteDoc.id, ...estudianteDoc.data() };
};

exports.getEstudiantesByGrado = async (grado) => {
  const snapshot = await db.collection("estudiantes").where("grado", "==", grado).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.createEstudiante = async (data) => {
  const estudianteRef = await db.collection("estudiantes").add(data);
  return { id: estudianteRef.id, ...data };
};

exports.updateEstudiante = async (id, data) => {
  await db.collection("estudiantes").doc(id).update(data);
  return { id, ...data };
};

exports.deleteEstudiante = async (id) => {
  await db.collection("estudiantes").doc(id).delete();
  return { message: "Estudiante eliminado", id };
};