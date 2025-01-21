"use client";

import { useState } from "react";

const CrearNuevoGrupo = () => {
  // Estado para manejar los valores del formulario
  const [form, setForm] = useState({
    tipo: "", // "primaria" o "secundaria"
    nivel: "", // Nivel correspondiente (1-6 o 7-12)
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.tipo && form.nivel) {
      alert(`Grupo creado: Tipo: ${form.tipo}, Nivel: ${form.nivel}`);
      setForm({ tipo: "", nivel: "" }); // Limpiar el formulario
    } else {
      alert("Por favor, selecciona el tipo y el nivel antes de continuar.");
    }
  };

  // Generar opciones para los niveles según el tipo seleccionado
  const niveles = form.tipo === "primaria" 
    ? [1, 2, 3, 4, 5, 6] 
    : form.tipo === "secundaria" 
    ? [7, 8, 9, 10, 11, 12] 
    : [];

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear Nuevo Grupo</h1>

      {/* Selector para el tipo */}
      <label htmlFor="tipo">Seleccionar Tipo</label>
      <select
        name="tipo"
        id="tipo"
        value={form.tipo}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona un tipo</option>
        <option value="primaria">Primaria</option>
        <option value="secundaria">Secundaria</option>
      </select>

      {/* Mostrar el selector de niveles solo si se selecciona un tipo */}
      {form.tipo && (
        <>
          <label htmlFor="nivel">Seleccionar Nivel</label>
          <select
            name="nivel"
            id="nivel"
            value={form.nivel}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un nivel</option>
            {niveles.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Botón para crear el grupo */}
      <button type="submit">Crear Grupo</button>
    </form>
  );
};

export default CrearNuevoGrupo;
