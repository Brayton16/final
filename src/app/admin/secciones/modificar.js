"use client";

import { useState, useEffect } from "react";
import { getEstudianteByGrado } from "@/services/estudiantesService"; // Servicio para obtener estudiantes por grado
import { updateSeccion } from "@/services/seccionesService"; // Servicio para actualizar secciones
import { toast } from "react-toastify";

const EditarSeccion = ({ seccion, onSave, onCancel }) => {
  const [grupo, setGrupo] = useState(seccion.grupo || "");
  const [nivel, setNivel] = useState(seccion.nivel || "");
  const [estudiantesGenerales, setEstudiantesGenerales] = useState([]);
  const [estudiantesSeccion, setEstudiantesSeccion] = useState(seccion.listaEstudiantes || []);

  // Manejar el cambio de nivel y obtener estudiantes por nivel
  useEffect(() => {
    const fetchEstudiantes = async () => {
      if (nivel) {
        try {
          const estudiantes = await getEstudianteByGrado(nivel);

          // Separar los estudiantes que ya están en la sección
          const estudiantesEnSeccion = estudiantes.filter((e) =>
            seccion.listaEstudiantes.includes(e.id)
          );

          // Obtener los estudiantes disponibles que no están en la sección
          const estudiantesDisponibles = estudiantes.filter(
            (e) => !seccion.listaEstudiantes.includes(e.id)
          );

          setEstudiantesSeccion(estudiantesEnSeccion); // Estudiantes asignados a la sección
          setEstudiantesGenerales(estudiantesDisponibles); // Estudiantes disponibles
        } catch (error) {
          toast.error("Error al obtener estudiantes para el nivel seleccionado.");
          console.error(error.message);
        }
      } else {
        setEstudiantesGenerales([]);
        setEstudiantesSeccion([]);
      }
    };

    fetchEstudiantes();
  }, [nivel, seccion.listaEstudiantes]);

  // Agregar estudiante a la lista de la sección
  const agregarEstudiante = (idEstudiante) => {
    if (estudiantesSeccion.length >= 30) {
      toast.warning("Solo se permiten hasta 30 estudiantes por sección.");
      return;
    }
    const estudiante = estudiantesGenerales.find((e) => e.id === idEstudiante);
    setEstudiantesSeccion([...estudiantesSeccion, estudiante]);
    setEstudiantesGenerales(estudiantesGenerales.filter((e) => e.id !== idEstudiante));
  };

  // Quitar estudiante de la lista de la sección
  const quitarEstudiante = (idEstudiante) => {
    const estudiante = estudiantesSeccion.find((e) => e.id === idEstudiante);
    setEstudiantesGenerales([...estudiantesGenerales, estudiante]);
    setEstudiantesSeccion(estudiantesSeccion.filter((e) => e.id !== idEstudiante));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grupo || !nivel || estudiantesSeccion.length === 0) {
      toast.error("Por favor, completa todos los campos y selecciona al menos un estudiante.");
      return;
    }

    // Lógica para actualizar la sección
    const seccionActualizada = {
      grupo: grupo,
      nivel: nivel,
      listaEstudiantes: estudiantesSeccion.map((e) => e.id),
    };

    try {
      await updateSeccion(seccion.id, seccionActualizada);
      toast.success("Sección actualizada con éxito.");
      onSave(); // Indica que se guardó correctamente
    } catch (error) {
      toast.error("Error al actualizar la sección.");
      console.error("Error al actualizar la sección:", error.message);
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem",
    margin: "0 auto",
    borderRadius: "8px",
  };

  const selectStyle = {
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  };

  const buttonStyle = {
    padding: "0.8rem",
    borderRadius: "6px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
    marginTop: "1rem",
    width: "100%",
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2>Editar Sección</h2>
        <label>
          <p>Grupo:</p>
          <input
            type="number"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            placeholder="Ejemplo: 1"
            style={selectStyle}
            required
          />
        </label>

        <label>
          <p>Nivel:</p>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)} style={selectStyle} required>
            <option value="">Selecciona un nivel</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "space-between", width: "100%" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ textAlign: "center" }}>Estudiantes Generales</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nombre</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Apellido</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesGenerales.map((e) => (
                  <tr key={e.id || e.uid}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{e.nombre}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{e.apellido}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => agregarEstudiante(e.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ textAlign: "center" }}>Estudiantes de la Sección</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nombre</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Apellido</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesSeccion.map((e) => (
                  <tr key={e.id || e.uid}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{e.nombre}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{e.apellido}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => quitarEstudiante(e.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" style={buttonStyle}>
            Guardar Cambios
          </button>
          <button
            type="button"
            style={{
              ...buttonStyle,
              backgroundColor: "#6c757d",
              color: "#fff",
            }}
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarSeccion;
