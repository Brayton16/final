"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getEstudiantes, updateEstudiante } from "@/services/estudiantesService";

export default function AsignarEncargado({ encargado, onCancel, onSave }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        console.log(encargado)
        const data = await getEstudiantes();
        setEstudiantes(data);
      } catch (error) {
        toast.error("Error al cargar la lista de estudiantes.");
        console.error("Error al obtener estudiantes:", error.message);
      }
    };

    if (encargado.id) {
      fetchEstudiantes();
    }
  }, [encargado.id]);

  const handleSeleccionarEstudiante = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
  };

  const handleAsignarEncargado = async () => {
    if (!estudianteSeleccionado) {
      toast.warning("Debe seleccionar un estudiante");
      return;
    }
    try {
      await updateEstudiante(estudianteSeleccionado.id, "", "", "", "", encargado.id);
      toast.success("Encargado asignado con éxito");
      setEstudianteSeleccionado(null);
      onSave && onSave();
    } catch (error) {
      toast.error("Error al asignar el encargado");
      console.error("Error al asignar encargado:", error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa" }}>
      <h2 style={{ textAlign: "center" }}>Asignar Encargado</h2>

      {encargado && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Encargado</h3>
          <p><strong>Nombre:</strong> {encargado.nombre} {encargado.apellido}</p>
          <p><strong>Correo:</strong> {encargado.correo}</p>
          <p><strong>Teléfono:</strong> {encargado.telefono}</p>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label>
          <p>Buscar estudiante:</p>
        </label>
          <input
            type="text"
            placeholder="Ingrese nombre o apellido"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px", backgroundColor: "#f8f9fa" }}>Nombre</th>
            <th style={{ textAlign: "left", padding: "10px", backgroundColor: "#f8f9fa" }}>Correo</th>
            <th style={{ textAlign: "left", padding: "10px", backgroundColor: "#f8f9fa" }}>Grado</th>
            <th style={{ textAlign: "left", padding: "10px", backgroundColor: "#f8f9fa" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes
            .filter((est) =>
              est.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
              est.apellido.toLowerCase().includes(filtro.toLowerCase())
            )
            .map((estudiante) => (
              <tr key={estudiante.id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{estudiante.nombre} {estudiante.apellido}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{estudiante.correo}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{estudiante.grado}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  <button
                    style={{ backgroundColor: "#DC3545", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer", color: "#ffffff", padding: "0.4rem" }}
                    onClick={() => handleSeleccionarEstudiante(estudiante)}
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {estudianteSeleccionado && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Estudiante Seleccionado</h3>
          <p><strong>Nombre:</strong> {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}</p>
          <p><strong>Correo:</strong> {estudianteSeleccionado.correo}</p>
          <p><strong>Grado:</strong> {estudianteSeleccionado.grado}</p>
          <button
            style={{ padding: "0.8rem", borderRadius: "6px", backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}
            onClick={handleAsignarEncargado}
          >
            Asignar Encargado
          </button>
        </div>
      )}
    </div>
  );
}
