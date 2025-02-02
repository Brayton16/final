const db = require("../services/firebase");

exports.obtenerEntregas = async () => {
    const entregasSnapshot = await db.collection("entregas").get();
    const entregas = entregasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return entregas;
};

exports.obtenerEntregasByAsignacion = async (idAsignacion) => {
    const entregasSnapshot = await db.collection("entregas").where("idAsignacion", "==", idAsignacion).get();
    const entregas = entregasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return entregas;
};

exports.obtenerEntregasByEstudiante = async (idEstudiante) => {
    const entregasSnapshot = await db.collection("entregas").where("idEstudiante", "==", idEstudiante).get();
    const entregas = entregasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return entregas;
};

exports.obtenerEntregaById = async (id) => {
    const entregaSnapshot = await db.collection("entregas").doc(id).get();
    if (!entregaSnapshot.exists) {
        throw new Error("Entrega no encontrada");
    }
    return { id: entregaSnapshot.id, ...entregaSnapshot.data() };
};

exports.crearEntrega = async (idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo) => {
    const entregaRef = await db.collection("entregas").add({
        idAsignacion,
        idEstudiante,
        fechaEntrega,
        estado,
        calificacion,
        observaciones,
        archivo,
    });
    return { id: entregaRef.id, idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo };
};

exports.actualizarEntrega = async (id, idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo) => {
    await db.collection("entregas").doc(id).update({
        idAsignacion,
        idEstudiante,
        fechaEntrega,
        estado,
        calificacion,
        observaciones,
        archivo,
    });
    return { id, idAsignacion, idEstudiante, fechaEntrega, estado, calificacion, observaciones, archivo };
};

exports.calificarEntrega = async (id, nuevaCalificacion, retroalimentacion) => {
    console.log("Calificando entrega con ID:", id);
    console.log("Calificación:", nuevaCalificacion);
    await db.collection("entregas").doc(id).update({
        calificacion: nuevaCalificacion,
        retroalimentacion,
    });
    return { id, nuevaCalificacion, retroalimentacion };
};


exports.getEntregasPorProfesor = async (idProfesor) => {
    try {
      // Obtener asignaciones del profesor
      const asignacionesSnapshot = await db.collection("asignaciones").where("idProfesor", "==", idProfesor).get();
      if (asignacionesSnapshot.empty) return [];
  
      let resultado = [];
  
      for (const asignacionDoc of asignacionesSnapshot.docs) {
        const idAsignacion = asignacionDoc.id;
        const titulo = asignacionDoc.data().titulo;
  
        // Obtener entregas de la asignación
        const entregasSnapshot = await db.collection("entregas").where("idAsignacion", "==", idAsignacion).get();
        let entregas = [];
  
        for (const entregaDoc of entregasSnapshot.docs) {
          const { calificacion } = entregaDoc.data();
          const calificacionNum = Number(calificacion); // Convertir a número
  
          // Determinar estado
          let estado = "Malo";
          if (calificacionNum > 95) estado = "Excelente";
          else if (calificacionNum > 80) estado = "Bueno";
          else if (calificacionNum > 65) estado = "Regular";
  
          entregas.push({
            idEntrega: entregaDoc.id,
            calificacion: calificacionNum,
            estado,
          });
        }
  
        resultado.push({ idAsignacion, titulo, entregas });
      }
  
      return resultado;
    } catch (error) {
      console.error("Error al obtener entregas por profesor:", error);
      throw error;
    }
  };