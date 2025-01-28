const db = require("../services/firebase");
const { getAuth } = require("firebase-admin/auth"); // SDK Admin para claims

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
  const { nombre, apellido, grado, correo, password } = data;

  try {
    // Crear el usuario en Firebase Auth usando el SDK Admin
    const adminAuth = getAuth(); // Admin SDK
    const userRecord = await adminAuth.createUser({
      email: correo,
      password: password,
      displayName: `${nombre} ${apellido}`,
    });


    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "estudiante" });

    // Guardar el encargado en Firestore
    const encargadoRef = await db.collection("estudiantes").add({
      nombre,
      apellido,
      grado,
      correo,
    });

    return { id: encargadoRef.id, ...data, authId: userRecord.uid };
  } catch (error) {
    console.error("Error al crear el encargado:", error.message);
    throw error;
  }
};

exports.updateEstudiante = async (id, data) => {
  await db.collection("estudiantes").doc(id).update(data);
  return { id, ...data };
};

exports.deleteEstudiante = async (id) => {
  await db.collection("estudiantes").doc(id).delete();
  return { message: "Estudiante eliminado", id };
};

exports.deleteEstudiante = async (id) => {
  try {
    const estudianteDoc = await db.collection("estudiantes").doc(id).get();

    if (!estudianteDoc.exists) {
      throw new Error("Estudiante no encontrado");
    }

    const estudianteData = estudianteDoc.data();

    // Verifica si el correo existe en los datos del estudiante
    if (estudianteData.correo) {
      const adminAuth = getAuth(); // Inicializa el Auth del Admin SDK
      
      try {
        // Busca al usuario por correo
        const userRecord = await adminAuth.getUserByEmail(estudianteData.correo);

        // Elimina al usuario del Auth si existe
        if (userRecord && userRecord.uid) {
          await adminAuth.deleteUser(userRecord.uid);
          console.log(`Usuario con correo ${estudianteData.correo} eliminado de Firebase Auth`);
        }
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          console.log(`El usuario con correo ${estudianteData.correo} no se encontró en Firebase Auth.`);
        } else {
          throw error; // Si es otro error, propágalo
        }
      }
    }

    // Elimina el documento del encargado de Firestore
    await db.collection("estudiantes").doc(id).delete();
    console.log(`Estudiante con ID ${id} eliminado de Firestore`);

    return { message: "Estudiante eliminado con éxito" };
  } catch (error) {
    console.error("Error al eliminar el estudiante:", error.message);
    throw error;
  }
};