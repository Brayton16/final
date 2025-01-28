"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getEstudiantes, deleteEstudiante, getEstudianteByGrado } from "@/services/estudiantesService"; // Importar servicios necesarios
import { getEncargadoById } from "@/services/encargadosService";
import EditarEstudiante from "./modificar"; // Componente para editar estudiantes
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
export default function ListarEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteAEditar, setEstudianteAEditar] = useState(null); // Estudiante seleccionado para editar
  const [filtroGrado, setFiltroGrado] = useState(null); // Almacena el grado para el filtro

  // Traer todos los estudiantes
  const fetchEstudiantes = async () => {
    try {
      const estudiantesData = await getEstudiantes();

      // Asociar los encargados
      const estudiantesConEncargados = await Promise.all(
        estudiantesData.map(async (estudiante) => {
          if (estudiante.encargadoId) {
            try {
              const encargado = await getEncargadoById(estudiante.encargadoId);
              estudiante.encargado = `${encargado.nombre} ${encargado.apellido}`;
            } catch {
              estudiante.encargado = "Encargado no encontrado";
            }
          } else {
            estudiante.encargado = "Sin encargado asignado";
          }
          return estudiante;
        })
      );

      setEstudiantes(estudiantesConEncargados);
    } catch (error) {
      toast.error("Error al cargar la lista de estudiantes.");
      console.error("Error al obtener estudiantes:", error.message);
    }
  };

  // Filtrar estudiantes por grado
  const fetchEstudiantesPorGrado = async (grado) => {
    try {
      const estudiantesFiltrados = await getEstudianteByGrado(grado);
      setEstudiantes(estudiantesFiltrados);
      setFiltroGrado(grado);
      toast.info(`Filtrado por grado: ${grado}`);
    } catch (error) {
      toast.error("Error al filtrar por grado.");
      console.error("Error al filtrar estudiantes por grado:", error.message);
    }
  };

  // Volver a la lista completa
  const resetFiltro = () => {
    setFiltroGrado(null);
    fetchEstudiantes();
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
        await deleteEstudiante(id);
        setEstudiantes(estudiantes.filter((estudiante) => estudiante.id !== id));
        toast.success("Estudiante eliminado con éxito");
      } catch (error) {
        toast.error("Error al eliminar el estudiante.");
        console.error("Error al eliminar el estudiante:", error.message);
      }
    }
  };

  // Editar estudiante
  const handleEdit = (estudiante) => {
    setEstudianteAEditar(estudiante); // Seleccionar el estudiante para editar
  };

  // Guardar cambios y volver a la lista
  const handleSave = () => {
    setEstudianteAEditar(null);
    fetchEstudiantes(); // Actualizar la lista después de guardar cambios
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  if (estudianteAEditar) {
    return (
      <EditarEstudiante
        estudiante={estudianteAEditar}
        onCancel={() => setEstudianteAEditar(null)}
        onSave={handleSave}
      />
    );
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#f8f9fa",
  };

  const tdStyle = {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    cursor: "pointer", // Apunta que es clickeable
    color: filtroGrado ? "#007bff" : "#495057", // Color diferente si está filtrado
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Lista de Estudiantes</h2>
      {filtroGrado && (
        <p>
          Mostrando estudiantes del grado <b>{filtroGrado}</b>.{" "}
          <span
            style={{ cursor: "pointer", color: "#007bff" }}
            onClick={resetFiltro}
          >
            Quitar filtro
          </span>
        </p>
      )}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Grado</th>
            <th style={thStyle}>Encargado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td style={tdStyle}>{estudiante.nombre} {estudiante.apellido}</td>
              <td style={tdStyle}>{estudiante.correo}</td>
              <td
                style={{ ...tdStyle, textDecoration: "underline" }}
                onClick={() => fetchEstudiantesPorGrado(estudiante.grado)} // Filtrar por grado al hacer clic
              >
                {estudiante.grado}
              </td>
              <td style={tdStyle}>{estudiante.encargado}</td>
              <td style={tdStyle}>
                <button
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginRight: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(estudiante)}
                >
                  <FaPencilAlt color="#007bff" />
                </button>
                <button
                  style={{
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(estudiante.id)}
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
