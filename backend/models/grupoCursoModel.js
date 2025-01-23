const db = require("../services/firebase");

exports.getGruposByProfesor = async (idProfesor) => {
  const snapshot = await db
    .collection("GrupoCurso")
    .where("idProfesor", "==", idProfesor)
    .get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
