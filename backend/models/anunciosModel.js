const db = require("../services/firebase");

exports.obtenerAnuncios = async () => {
    const snapshot = await db.collection("anuncios").get();
    const anuncios = [];
    snapshot.forEach((doc) => {
        anuncios.push({ id: doc.id, ...doc.data() });
    });
    return anuncios;
};

exports.obtenerAnuncioById = async (id) => {
    const doc = await db.collection("anuncios").doc(id).get();
    if (!doc.exists) {
        throw new Error("Anuncio no encontrado");
    }
    return { id: doc.id, ...doc.data() };
};

exports.obtenerAnunciosByGrupo = async (idGrupo) => {
    const snapshot = await db.collection("anuncios").where("idGrupoCurso", "==", idGrupo).get();
    const anuncios = [];
    snapshot.forEach((doc) => {
        anuncios.push({ id: doc.id, ...doc.data() });
    });
    return anuncios;
};

exports.obtenerAnunciosByProfesor = async (idProfesor) => {
    const snapshot = await db.collection("anuncios").where("idProfesor", "==", idProfesor).get();
    const anuncios = [];
    snapshot.forEach((doc) => {
        anuncios.push({ id: doc.id, ...doc.data() });
    });
    return anuncios;
};

exports.crearAnuncio = async (idGrupoCurso, titulo, mensaje, fechaPublicacion, auto, importancia) => {
    const docRef = await db.collection("anuncios").add({
        idGrupoCurso,
        titulo,
        mensaje,
        fechaPublicacion,
        auto,
        importancia,
    });
    return { id: docRef.id, idGrupoCurso, titulo, mensaje, fechaPublicacion, auto, importancia };
};