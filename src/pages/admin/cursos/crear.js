"use client";

import { useState } from "react";

const CrearCurso = () => {
  // Estado para manejar el nombre del curso
  const [form, setForm] = useState({ nombre: "" });

  // Manejar cambios en el campo de texto
  const handleChange = (e) => {
    setForm({ ...form, nombre: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.nombre.trim() === "") {
      alert("Por favor, ingresa el nombre del curso.");
      return;
    }
    try {
      console.log("Curso registrado:", form.nombre);
      alert(`Curso "${form.nombre}" registrado con éxito`);
      setForm({ nombre: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al registrar el curso:", error.message);
      alert("Ocurrió un error al registrar el curso.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrar Curso</h1>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del curso"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <button type="submit">Registrar Curso</button>
    </form>
  );
};

export default CrearCurso;
