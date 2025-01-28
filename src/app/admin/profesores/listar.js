"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfesores, deleteProfesor } from "@/services/profesoresService"; // Importar servicios necesarios
import EditarProfesor from "./modificar"; // Componente para editar profesores
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ListarProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [profesorAEditar, setProfesorAEditar] = useState(null); // Profesor seleccionado para editar

  // Obtener todos los profesores
  const fetchProfesores = async () => {
    try {
      const profesoresData = await getProfesores();
      setProfesores(profesoresData);
    } catch (error) {
      toast.error("Error al cargar la lista de profesores.");
      console.error("Error al obtener profesores:", error.message);
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
        await deleteProfesor(id);
        setProfesores(profesores.filter((profesor) => profesor.id !== id));
        toast.success("Profesor eliminado con éxito");
      } catch (error) {
        toast.error("Error al eliminar el profesor.");
        console.error("Error al eliminar el profesor:", error.message);
      }
    }
  };

  // Editar profesor
  const handleEdit = (profesor) => {
    setProfesorAEditar(profesor); // Seleccionar el profesor para editar
  };

  // Guardar cambios y actualizar lista
  const handleSave = () => {
    setProfesorAEditar(null);
    fetchProfesores(); // Actualizar lista después de guardar cambios
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  // Mostrar formulario de edición si hay un profesor seleccionado
  if (profesorAEditar) {
    return (
      <EditarProfesor
        profesor={profesorAEditar}
        onCancel={() => setProfesorAEditar(null)}
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
      <h2 style={{ textAlign: "center" }}>Lista de Profesores</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Apellido</th>
            <th style={thStyle}>Especialidad</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor) => (
            <tr key={profesor.id}>
              <td style={tdStyle}>{profesor.nombre}</td>
              <td style={tdStyle}>{profesor.apellido}</td>
              <td style={tdStyle}>{profesor.especialidad || "Sin asignar"}</td>
              <td style={tdStyle}>{profesor.correo}</td>
              <td style={tdStyle}>{profesor.telefono}</td>
              <td style={tdStyle}>
                <button
                  style={actionButtonStyle}
                  onClick={() => handleEdit(profesor)}
                >
                  <FaPencilAlt color="#007bff" />
                </button>
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                  }}
                  onClick={() => handleDelete(profesor.id)}
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
