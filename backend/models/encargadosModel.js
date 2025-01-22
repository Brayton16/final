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
  const encargadoRef = await db.collection("encargados").add(data);
  return { id: encargadoRef.id, ...data };
};

exports.updateEncargado = async (id, data) => {
  await db.collection("encargados").doc(id).update(data);
  return { id, ...data };
};

exports.deleteEncargado = async (id) => {
  await db.collection("encargados").doc(id).delete();
  return { message: "Encargado eliminado", id };
};