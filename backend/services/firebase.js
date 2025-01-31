const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");
//const serviceAccount = "/etc/secrets/serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
