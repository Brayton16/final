"use client";

import { useState } from "react";

const RegistrarProfesor = () => {
  const [form, setForm] = useState({ nombre: "", apellido: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aca se llama el api
      console.log("Datos enviados:", form);
      alert("Profesor registrado con éxito");
      setForm({ nombre: "", apellido: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al registrar el profesor:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrar Profesor</h1>
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
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegistrarProfesor;
