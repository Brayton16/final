"use client";

import { useState } from "react";
import { toast } from "react-toastify"; // Importar toast para las notificaciones
import { createProfesor } from "@/services/profesoresService"; // Importar servicio para registrar profesores

const RegistrarProfesor = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
    correo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamada al servicio para registrar un profesor
      await createProfesor(
        form.nombre,
        form.apellido,
        form.correo,
        form.telefono,
        form.especialidad
      );
      toast.success("Profesor registrado con éxito");
      setForm({ nombre: "", apellido: "", especialidad: "", telefono: "", correo: "" }); // Limpiar el formulario
    } catch (error) {
      toast.error("Error al registrar el profesor. Por favor, intente nuevamente.");
      console.error("Error al registrar el profesor:", error.message);
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
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
    marginTop: "1rem",
    width: "100%",
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Registrar Profesor</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
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
          Especialidad
          <input
            type="text"
            name="especialidad"
            placeholder="Ej: Matemáticas, Historia"
            value={form.especialidad}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>
        <label>
          Teléfono
          <input
            type="text"
            name="telefono"
            placeholder="Ingrese el número de teléfono"
            value={form.telefono}
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
        <button type="submit" style={buttonStyle}>
          Registrar Profesor
        </button>
      </form>
    </div>
  );
};

export default RegistrarProfesor;
