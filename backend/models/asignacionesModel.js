const db = require("../services/firebase");

exports.obtenerAsignaciones = async () => {
    const asignacionesSnapshot = await db.collection("asignaciones").get();
    const asignaciones = asignacionesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return asignaciones;
};

exports.obtenerAsignacionById = async (id) => {
    const asignacionSnapshot = await db.collection("asignaciones").doc(id).get();
    if (!asignacionSnapshot.exists) {
        throw new Error("Asignación no encontrada");
    }
    return { id: asignacionSnapshot.id, ...asignacionSnapshot.data() };
};

exports.obtenerAsignacionesByGrupo = async (idGrupo) => {
    const asignacionesSnapshot = await db.collection("asignaciones").where("idGrupoCurso", "==", idGrupo).get();
    const asignaciones = asignacionesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return asignaciones;
};

exports.obtenerAsignacionesByProfesor = async (idProfesor) => {
    const asignacionesSnapshot = await db.collection("asignaciones").where("idProfesor", "==", idProfesor).get();
    const asignaciones = asignacionesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return asignaciones;
};

exports.crearAsignacion = async (titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo) => {
    const asignacionRef = await db.collection("asignaciones").add({
        titulo,
        descripcion,
        idProfesor,
        idCurso,
        idGrupoCurso,
        fechaEntrega,
        recursos,
        tipo,
    });
    return { id: asignacionRef.id, titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo };
};

exports.actualizarAsignacion = async (id, titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo) => {
    await db.collection("asignaciones").doc(id).update({
        titulo,
        descripcion,
        idProfesor,
        idCurso,
        idGrupoCurso,
        fechaEntrega,
        recursos,
        tipo,
    });
    return { id, titulo, descripcion, idProfesor, idCurso, idGrupoCurso, fechaEntrega, recursos, tipo };
};

exports.eliminarAsignacion = async (id) => {
    await db.collection("asignaciones").doc(id).delete();
    return { id };
};