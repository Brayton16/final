"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSecciones, deleteSeccion } from "@/services/seccionesService"; // Importar servicios necesarios
import EditarSeccion from "./modificar"; // Componente para editar secciones
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { getEstudianteByGrado } from "@/services/estudiantesService"; // Asegurarse de usar este servicio

export default function ListarSecciones() {
  const [secciones, setSecciones] = useState([]);
  const [seccionAEditar, setSeccionAEditar] = useState(null); // Sección seleccionada para editar

  // Obtener todas las secciones
  const fetchSecciones = async () => {
    try {
      const seccionesData = await getSecciones();
      setSecciones(seccionesData);
    } catch (error) {
      toast.error("Error al cargar la lista de secciones.");
      console.error("Error al obtener secciones:", error.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteSeccion(id);
        setSecciones(secciones.filter((seccion) => seccion.id !== id));
        toast.success("Sección eliminada con éxito");
      } catch (error) {
        toast.error("Error al eliminar la sección.");
        console.error("Error al eliminar la sección:", error.message);
      }
    }
  };

  // Editar sección
  const handleEdit = async (seccion) => {
    try {
      const nivel = seccion.nivel || null; // Asegurarse de que el nivel esté definido
      const listaEstudiantes = seccion.listaEstudiantes || []; // Asegurarse de que exista la lista de estudiantes

      if (!nivel) {
        toast.error("Nivel de la sección no definido.");
        return;
      }

      const estudiantesGenerales = await getEstudianteByGrado(nivel); // Filtrar estudiantes por nivel

      const estudiantesDisponibles = estudiantesGenerales.filter(
        (e) => !listaEstudiantes.includes(e.id) // Excluir estudiantes ya asignados a la sección
      );

      setSeccionAEditar({
        ...seccion,
        listaEstudiantes,
        estudiantesGenerales: estudiantesDisponibles,
      });
    } catch (error) {
      toast.error("Error al obtener la lista de estudiantes para editar.");
      console.error("Error al obtener estudiantes:", error.message);
    }
  };

  // Guardar cambios y actualizar lista
  const handleSave = () => {
    setSeccionAEditar(null);
    fetchSecciones(); // Actualizar lista después de guardar cambios
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  // Mostrar formulario de edición si hay una sección seleccionada
  if (seccionAEditar) {
    return (
      <EditarSeccion
        seccion={seccionAEditar}
        estudiantesGenerales={seccionAEditar.estudiantesGenerales || []}
        onCancel={() => setSeccionAEditar(null)}
        onSave={handleSave}
      />
    );
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "2rem",
  };

  const thStyle = {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderBottom: "2px solid #ddd",
  };

  const tdStyle = {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  };

  const actionButtonStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginRight: "5px",
    cursor: "pointer",
    padding: "5px 10px",
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Lista de Secciones</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nivel</th>
            <th style={thStyle}>Grupo</th>
            <th style={thStyle}>Cantidad de Estudiantes</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {secciones.map((seccion) => (
            <tr key={seccion.id}>
              <td style={tdStyle}>{seccion.nivel || "Sin nivel"}</td>
              <td style={tdStyle}>{seccion.grupo || "Sin grupo"}</td>
              <td style={tdStyle}>{seccion.listaEstudiantes?.length || 0}</td>
              <td style={tdStyle}>
                <button
                  style={actionButtonStyle}
                  onClick={() => handleEdit(seccion)}
                >
                  <FaPencilAlt color="#007bff" />
                </button>
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                  }}
                  onClick={() => handleDelete(seccion.id)}
                >
                  <FaTrash color="#dc3545" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
