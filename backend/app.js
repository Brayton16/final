require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// // Rutas
// const cursosRoutes = require("./routes/cursos");
// const estudiantesRoutes = require("./routes/estudiantes");
const cursosRoutes = require("../backend/routes/cursosRoutes");
const encargadosRoutes = require("../backend/routes/encargadosRoutes");
const profesoresRoutes = require("../backend/routes/profesorRoutes");
const estudiantesRoutes = require("../backend/routes/estudiantesRoutes");
const administradoresRoutes = require("../backend/routes/administradoresRoutes");
const seccionRoutes = require("../backend/routes/seccionRoutes");
const grupoCursoRoutes = require("../backend/routes/grupoCursoRoutes");

const app = express();
app.use(cors(
  {
    origin: '*'
  }
));
app.use(bodyParser.json());

// // Rutas de la API
// app.use("/api/cursos", cursosRoutes);
// app.use("/api/estudiantes", estudiantesRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/encargados", encargadosRoutes);
app.use("/api/profesores", profesoresRoutes);
app.use("/api/estudiantes", estudiantesRoutes);
app.use("/api/administradores", administradoresRoutes);
app.use("/api/seccion", seccionRoutes);
app.use("/api/grupo-curso", grupoCursoRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
