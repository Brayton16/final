const db = require("../services/firebase");

// Obtener todos los cursos
exports.getAllCursos = async () => {
  const snapshot = await db.collection("cursos").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Obtener un curso por ID
exports.getCursoById = async (id) => {
  const cursoDoc = await db.collection("cursos").doc(id).get();
  if (!cursoDoc.exists) throw new Error("Curso no encontrado");
  return { id: cursoDoc.id, ...cursoDoc.data() };
};

// Crear un nuevo curso
exports.createCurso = async (data) => {
  const cursoRef = await db.collection("cursos").add(data);
  return { id: cursoRef.id, ...data };
};

// Actualizar un curso por ID
exports.updateCurso = async (id, data) => {
  await db.collection("cursos").doc(id).update(data);
  return { id, ...data };
};



// Eliminar un curso por ID
exports.deleteCurso = async (id) => {
  await db.collection("cursos").doc(id).delete();
  return { message: "Curso eliminado", id };
};
