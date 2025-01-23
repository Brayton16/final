const db = require("../services/firebase");

exports.getAllSeccion = async () => {
  const snapshot = await db.collection("seccion").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

