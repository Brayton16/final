"use client";

import { useState, useEffect } from "react";

const ModificarProfesor = () => {
  // Datos de prueba para modificar
  const profesorData = {
    nombre: "Juan",
    apellido: "Pérez",
  };

  const [form, setForm] = useState({ nombre: "", apellido: "" });

  useEffect(() => {
    setForm(profesorData);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Datos modificados:", form);
      alert("Profesor modificado con éxito");
    } catch (error) {
      console.error("Error al modificar el profesor:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Modificar Profesor</h1>
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
      <button type="submit">Modificar</button>
    </form>
  );
};

export default ModificarProfesor;
