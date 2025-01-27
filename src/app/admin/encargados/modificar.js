"use client";

import { useState, useEffect } from "react";

const ModificarEncargado = () => {
  // Datos de prueba para modificar
  const encargadoData = {
    nombre: "Ana",
    apellido: "Gómez",
    correo: "ana.gomez@example.com",
  };

  // Estado para manejar el formulario
  const [form, setForm] = useState({ nombre: "", apellido: "", correo: "" });

  // Cargar datos iniciales del encargado
  useEffect(() => {
    setForm(encargadoData);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí enviarías los datos modificados al API
      console.log("Datos modificados:", form);
      alert("Encargado modificado con éxito");
      // Resetear el formulario o redirigir a otra página
    } catch (error) {
      console.error("Error al modificar el encargado:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Modificar Encargado</h1>
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
      <button type="submit">Modificar</button>
    </form>
  );
};

export default ModificarEncargado;
