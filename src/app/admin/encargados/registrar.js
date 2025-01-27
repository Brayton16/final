"use client";

import { useState } from "react";
import { createEncargado } from "@/services/encargadosService"; // Importa el servicio para registrar encargados
import { toast } from "react-toastify";
const RegistrarEncargado = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEncargado(
        form.nombre,
        form.apellido,
        form.correo,
        form.telefono
      );
      toast.success("Encargado registrado con éxito");
      setForm({ nombre: "", apellido: "", correo: "", telefono: "" }); // Limpiar el formulario
    } catch (error) {
      toast.error("Error al registrar el encargado. Por favor, intente nuevamente.");
      console.error("Error al registrar el encargado:", error.message);
    }
  };

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column", // Alinea los inputs en columna
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
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Registrar Encargado</h2>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>
          Complete los siguientes campos para registrar un encargado.
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

        <button type="submit" style={buttonStyle}>
          Registrar Encargado
        </button>
      </form>
    </div>
  );
};

export default RegistrarEncargado;
