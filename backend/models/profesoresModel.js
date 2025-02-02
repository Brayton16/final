const db = require("../services/firebase");
const { getAuth } = require("firebase-admin/auth"); // SDK Admin para claims
exports.getAllProfesores = async () => {
  const snapshot = await db.collection("profesores").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.getProfesorById = async (id) => {
  const profesorDoc = await db.collection("profesores").doc(id).get();
  if (!profesorDoc.exists) throw new Error("Profesor no encontrado");
  return { id: profesorDoc.id, ...profesorDoc.data() };
};

exports.getProfesoresByEspecialidad = async (especialidad) => {
  const snapshot = await db.collection("profesores").where("especialidad", "==", especialidad).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


exports.getCantidadProfesoresPorEspecialidad = async () => {
  try {
    const profesoresSnapshot = await db.collection("profesores").get();

    if (profesoresSnapshot.empty) {
      return {
        success: false,
        message: "No hay profesores registrados",
        data: [],
      };
    }

    const especialidadesMap = {};

    profesoresSnapshot.forEach((doc) => {
      const { especialidad } = doc.data();
      if (especialidad) {
        especialidadesMap[especialidad] = (especialidadesMap[especialidad] || 0) + 1;
      }
    });

    const resultado = Object.keys(especialidadesMap).map((especialidad) => ({
      especialidad,
      cantidad: especialidadesMap[especialidad],
    }));

    return {
      success: true,
      message: "Consulta exitosa",
      data: resultado,
    };
  } catch (error) {
    console.error("Error al obtener profesores por especialidad:", error.message);
    return {
      success: false,
      message: "Error en la consulta",
      data: [],
    };
  }
};

exports.createProfesor = async (data) => {
  const { nombre, apellido, correo, telefono, especialidad, password } = data;

  try {
    // Crear el usuario en Firebase Auth usando el SDK Admin
    const adminAuth = getAuth(); // Admin SDK
    const userRecord = await adminAuth.createUser({
      email: correo,
      password: password,
      displayName: `${nombre} ${apellido}`,
    });

    // Asignar custom claims para el rol "profesor"
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "profesor" });

    // Guardar el profesor en Firestore con el UID como ID del documento
    const profesorRef = db.collection("profesores").doc(userRecord.uid);
    await profesorRef.set({
      nombre,
      apellido,
      correo,
      telefono,
      especialidad,
    });

    return { id: userRecord.uid, ...data };
  } catch (error) {
    console.error("Error al crear el profesor:", error.message);
    throw error;
  }
};


exports.updateProfesor = async (id, data) => {
  await db.collection("profesores").doc(id).update(data);
  return { id, ...data };
};

exports.deleteProfesor = async (id) => {
  await db.collection("profesores").doc(id).delete();
  return { message: "Profesor eliminado", id };
};

exports.deleteProfesor = async (id) => {
  try {
    const profesorDoc = await db.collection("profesores").doc(id).get();

    if (!profesorDoc.exists) {
      throw new Error("Profesor no encontrado");
    }

    const profesorData = profesorDoc.data();

    // Verifica si el correo existe en los datos del profesor
    if (profesorData.correo) {
      const adminAuth = getAuth(); // Inicializa el Auth del Admin SDK
      
      try {
        // Busca al usuario por correo
        const userRecord = await adminAuth.getUserByEmail(profesorData.correo);

        // Elimina al usuario del Auth si existe
        if (userRecord && userRecord.uid) {
          await adminAuth.deleteUser(userRecord.uid);
          console.log(`Usuario con correo ${profesorData.correo} eliminado de Firebase Auth`);
        }
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          console.log(`El usuario con correo ${profesorData.correo} no se encontró en Firebase Auth.`);
        } else {
          throw error; // Si es otro error, propágalo
        }
      }
    }

    // Elimina el documento del profesor de Firestore
    await db.collection("profesores").doc(id).delete();
    console.log(`Profesor con ID ${id} eliminado de Firestore`);

    return { message: "Profesor eliminado con éxito" };
  } catch (error) {
    console.error("Error al eliminar el profesor:", error.message);
    throw error;
  }
};
