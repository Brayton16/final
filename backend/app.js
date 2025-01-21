require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Rutas
const cursosRoutes = require("./routes/cursos");
const estudiantesRoutes = require("./routes/estudiantes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas de la API
app.use("/api/cursos", cursosRoutes);
app.use("/api/estudiantes", estudiantesRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
