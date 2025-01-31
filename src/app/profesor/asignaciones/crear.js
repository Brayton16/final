"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getGruposByProfesor } from "@/services/grupoCursoService";
import { hacerAsignacion } from "@/services/asignacionesService";
import { getProfesorById } from "@/services/profesoresService";
import { getSeccionById } from "@/services/seccionesService";

const CrearAsignacion = () => {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    idGrupoCurso: "",
    idCurso: "",
    fechaEntrega: "",
    recursos: [""], // Array para múltiples recursos
    tipo: "Tarea", // Valor por defecto
  });

  const [grupos, setGrupos] = useState([]);
  const [profesor, setProfesor] = useState(null);
  const [idProfesor, setIdProfesor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("userId"); // Obtiene el ID almacenado
        if (!storedUserId) {
          toast.error("No se encontró un ID de usuario en LocalStorage.");
          return;
        }
  
        setIdProfesor(storedUserId); // Guarda el ID en el estado
  
        // Obtener datos del profesor
        const profesorData = await getProfesorById(storedUserId);
        setProfesor(profesorData);
  
        // Obtener los grupos del profesor
        const gruposData = await getGruposByProfesor(storedUserId);
        setGrupos(gruposData);
  
        if (gruposData.length === 0) {
          toast.warning("El profesor no tiene grupos asignados.");
          return;
        }
  
        // Obtener la información de todas las secciones asociadas a los grupos
        const seccionesPromises = gruposData.map((grupo) => getSeccionById(grupo.idSeccion));
        const seccionesData = await Promise.all(seccionesPromises);
  
        // Agregar la información de la sección a cada grupo
        const gruposConSecciones = gruposData.map((grupo, index) => ({
          ...grupo,
          seccion: seccionesData[index], // Agrega la sección correspondiente
        }));
  
        setGrupos(gruposConSecciones);
      } catch (error) {
        toast.error("Error al cargar los datos.");
        console.error(error.message);
      }
    };
  
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGrupoChange = (e) => {
    const selectedGrupoId = e.target.value;
    const selectedGrupo = grupos.find((grupo) => grupo.idGrupoCurso === selectedGrupoId);

    setForm({
      ...form,
      idGrupoCurso: selectedGrupoId,
      idCurso: selectedGrupo ? selectedGrupo.idCurso : "", // Obtiene el idCurso del grupo seleccionado
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.idGrupoCurso || !form.fechaEntrega) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const nuevaAsignacion = {
        ...form,
        idProfesor,
        recursos: form.recursos.filter((r) => r.trim() !== ""), // Filtra recursos vacíos
        fechaCreacion: new Date().toISOString(),
      };

      await hacerAsignacion(nuevaAsignacion);
      toast.success("Asignación creada con éxito.");
      setForm({
        titulo: "",
        descripcion: "",
        idGrupoCurso: "",
        idCurso: "",
        fechaEntrega: "",
        recursos: [""],
        tipo: "Tarea",
      });
    } catch (error) {
      toast.error("Error al crear la asignación.");
      console.error("Error:", error.message);
    }
  };

  const handleRecursoChange = (index, value) => {
    const nuevosRecursos = [...form.recursos];
    nuevosRecursos[index] = value;
    setForm({ ...form, recursos: nuevosRecursos });
  };

  const agregarRecurso = () => {
    setForm({ ...form, recursos: [...form.recursos, ""] });
  };

  const eliminarRecurso = (index) => {
    const nuevosRecursos = form.recursos.filter((_, i) => i !== index);
    setForm({ ...form, recursos: nuevosRecursos.length ? nuevosRecursos : [""] });
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Crear Asignación</h2>

        {profesor && (
          <div style={infoProfesorStyle}>
            <h3>Profesor: {profesor.nombre} {profesor.apellido}</h3>
            <p><strong>Especialidad:</strong> {profesor.especialidad}</p>
            <p><strong>Correo:</strong> {profesor.correo}</p>
          </div>
        )}

        <label>
          <p>Título:</p>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>

        <label>
          <p>Descripción:</p>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            style={{ ...inputStyle, height: "100px" }}
            required
          />
        </label>

        <label>
          <p>Grupo:</p>
          <select
            name="idGrupoCurso"
            value={form.idGrupoCurso}
            onChange={handleGrupoChange}
            style={inputStyle}
            required
          >
            <option value="">Seleccione un grupo</option>
            {grupos.map((grupo) => (
              <option key={grupo.idGrupoCurso} value={grupo.idGrupoCurso}>
                Sección: {grupo.secciones.nivel} - {grupo.secciones.grupo}
              </option>
            ))}
          </select>
        </label>

        <label>
          <p>Fecha de Entrega:</p>
          <input
            type="datetime-local"
            name="fechaEntrega"
            value={form.fechaEntrega}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>

        <label>
          <p>Tipo:</p>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="Tarea">Tarea</option>
            <option value="Proyecto">Proyecto</option>
            <option value="Examen">Examen</option>
            <option value="Asistencia">Asistencia</option>
            <option value="Trabajo en clase">Trabajo en clase</option>
          </select>
        </label>

        <label>
          <p>Recursos:</p>
          {form.recursos.map((recurso, index) => (
            <div key={index} style={recursoContainerStyle}>
              <input
                type="text"
                value={recurso}
                onChange={(e) => handleRecursoChange(index, e.target.value)}
                placeholder="Ingrese URL del recurso"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => eliminarRecurso(index)}
                style={eliminarButtonStyle}
              >
                −
              </button>
            </div>
          ))}
          <button type="button" onClick={agregarRecurso} style={agregarButtonStyle}>+ Agregar Recurso</button>
        </label>

        <button type="submit" style={buttonStyle}>
          Crear Asignación
        </button>
      </form>
    </div>
  );
};



// Estilos
const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
};

const formStyle = {
  width: "100%",
  borderRadius: "8px",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "0.8rem",
  borderRadius: "6px",
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#2563eb",
  color: "#fff",
  width: "100%",
  marginTop: "1rem",
};

const infoProfesorStyle = {
  backgroundColor: "#f8f9fa",
  borderRadius: "6px",
  marginBottom: "1rem",
};

const recursoContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const agregarButtonStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#22c55e",
  color: "#fff",
  width: "100%",
  marginBottom: "1rem",
};

const eliminarButtonStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  fontSize: "1.2rem",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#ef4444",
  color: "#fff",
};

export default CrearAsignacion;
