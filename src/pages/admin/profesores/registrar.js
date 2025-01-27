"use client";

import { useState } from "react";
import { createProfesor } from "../../../services/profesoresService"; // Importa tu función de servicios

const RegistrarProfesor = ({ onRefresh }) => {
  const [form, setForm] = useState({ nombre: "", apellido: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Llama a la API para registrar el profesor
      await createProfesor(form.nombre, form.apellido);
      alert("Profesor registrado con éxito");

      // Limpia el formulario
      setForm({ nombre: "", apellido: "" });

      // Llama a la función `onRefresh` si está definida
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error al registrar el profesor:", error.message);
      alert("Hubo un error al registrar el profesor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Registrar Profesor</h1>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={form.apellido}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        className={`w-full py-2 text-white rounded ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrar"}
      </button>
    </form>
  );
};

export default RegistrarProfesor;
