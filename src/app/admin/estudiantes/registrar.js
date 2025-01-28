"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getEncargados } from "@/services/encargadosService"; // Para obtener encargados
import { createEstudiante } from "@/services/estudiantesService"; // Servicio para registrar estudiantes

const RegistrarEstudiante = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    grado: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEstudiante(form.nombre, form.apellido, form.correo, form.grado);
      toast.success("Estudiante registrado con éxito");
      setForm({ nombre: "", apellido: "", correo: "", grado: "", encargadoId: "" }); // Limpiar formulario
    } catch (error) {
      toast.error("Error al registrar el estudiante. Por favor, intente nuevamente.");
      console.error("Error al registrar el estudiante:", error.message);
    }
  };

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
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
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "#fff",
    cursor: "pointer",
  };

  const buttonStyle = {
    padding: "0.8rem",
    borderRadius: "6px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
    width: "100%", // Botón ancho
    marginTop: "1rem",
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Registrar Estudiante</h2>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>
          Complete los siguientes campos para registrar un estudiante.
        </p>

        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            placeholder="Ingrese el nombre"
            value={form.nombre}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>

        <label>
          Apellido
          <input
            type="text"
            name="apellido"
            placeholder="Ingrese el apellido"
            value={form.apellido}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>

        <label>
          Correo
          <input
            type="email"
            name="correo"
            placeholder="Ingrese el correo electrónico"
            value={form.correo}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>

        <label>
          Grado
          <input
            type="text"
            name="grado"
            placeholder="Ingrese el grado del estudiante (ej. 7-1)"
            value={form.grado}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Registrar Estudiante
        </button>
      </form>
    </div>
  );
};

export default RegistrarEstudiante;
