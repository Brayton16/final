const admin = require("firebase-admin");
//const serviceAccount = require("../config/serviceAccountKey.json");
const serviceAccountPath = "/etc/secrets/serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

const db = admin.firestore();
module.exports = db;
