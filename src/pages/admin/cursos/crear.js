"use client";

import { useState } from "react";
import { createCurso } from "../../../services/cursosService";

const CrearCurso = () => {
  const [form, setForm] = useState({ nombre: "" });
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const handleChange = (e) => {
    setForm({ ...form, nombre: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nombre.trim() === "") {
      alert("Por favor, ingresa el nombre del curso.");
      return;
    }

    setLoading(true); // Inicia el estado de carga
    try {
      const nuevoCurso = await createCurso(form.nombre);
      console.log("Curso registrado:", nuevoCurso);
      alert(`Curso "${form.nombre}" registrado con éxito`);
      setForm({ nombre: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al registrar el curso:", error.message);
      alert("Ocurrió un error al registrar el curso.");
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Curso</h1>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del curso"
        value={form.nombre}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <button
        type="submit"
        className={`w-full p-2 text-white rounded ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrar Curso"}
      </button>
    </form>
  );
};

export default CrearCurso;
