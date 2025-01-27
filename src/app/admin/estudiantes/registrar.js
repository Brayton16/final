"use client";

import { useState, useEffect } from "react";

const RegistrarEstudiante = () => {
  const [form, setForm] = useState({ nombre: "", apellido: "", encargados: [] });
  const [encargadosList, setEncargadosList] = useState([]);

  useEffect(() => {
    const fetchEncargados = async () => {
      // Data falsa solo para pruebas
      const data = [
        { id: "1", nombre: "Juan Pérez" },
        { id: "2", nombre: "María Gómez" },
      ]; // Datos simulados
      setEncargadosList(data);
    };

    fetchEncargados();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectEncargado = (e) => {
    const selectedId = e.target.value;
    setForm((prev) => {
      const alreadySelected = prev.encargados.includes(selectedId);
      if (alreadySelected) {
        return {
          ...prev,
          encargados: prev.encargados.filter((id) => id !== selectedId),
        };
      } else {
        return { ...prev, encargados: [...prev.encargados, selectedId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí llamarías al API para registrar al estudiante
      console.log("Datos enviados:", form);
      alert("Estudiante registrado con éxito");
      setForm({ nombre: "", apellido: "", encargados: [] }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al registrar el estudiante:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrar Estudiante</h1>
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
      <fieldset>
        <legend>Encargados</legend>
        {encargadosList.map((encargado) => (
          <label key={encargado.id}>
            <input
              type="checkbox"
              value={encargado.id}
              checked={form.encargados.includes(encargado.id)}
              onChange={handleSelectEncargado}
            />
            {encargado.nombre}
          </label>
        ))}
      </fieldset>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegistrarEstudiante;
