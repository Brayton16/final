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