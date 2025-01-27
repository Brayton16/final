"use client";

import { useState } from "react";


const RegistrarEncargado = () => {
  const [form, setForm] = useState({ nombre: "", apellido: "", correo: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Api
      alert("Encargado registrado con éxito");
      setForm({ nombre: "", apellido: "", correo: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al registrar el encargado:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrar Encargado</h1>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={form.apellido}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="correo"
        placeholder="Correo"
        value={form.correo}
        onChange={handleChange}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegistrarEncargado;
