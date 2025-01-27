"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateEncargado } from "@/services/encargadosService";

const EditarEncargado = ({ encargado, onCancel, onSave }) => {
  const [form, setForm] = useState(encargado);

  useEffect(() => {
    setForm(encargado);
  }, [encargado]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEncargado(encargado.id, form.nombre, form.apellido, form.correo, form.telefono);
      toast.success("Encargado actualizado con éxito");
      onSave(); // Llama a la función para actualizar la lista
    } catch (error) {
      toast.error("Error al actualizar el encargado. Por favor, intente nuevamente.");
      console.error("Error al actualizar el encargado:", error.message);
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
    marginRight: "1rem",
    marginLeft: "1rem",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#e0e0e0",
    color: "#000",
  };

  return (
    <div style={{marginTop: "2rem"}}>
      <h2 style={{ textAlign: "center" }}>Editar Encargado</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
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
            value={form.telefono}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" style={buttonStyle}>
            Guardar Cambios
          </button>
          <button type="button" style={cancelButtonStyle} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarEncargado;
