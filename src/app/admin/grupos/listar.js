"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getGrupos, deleteGrupoCurso, getGrupoCursoById } from "@/services/grupoCursoService"; // Servicios necesarios
import { getProfesorById } from "@/services/profesoresService";
import { getSeccionById } from "@/services/seccionesService";
import { getCursoById } from "@/services/cursosService";
import Swal from "sweetalert2";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import  ModificarGrupo  from "./modificar";

export default function ListarGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [grupoAEditar, setGrupoAEditar] = useState(null); // Grupo seleccionado para editar

  // Obtener todos los grupos y asociar información del profesor
  
  const fetchGrupos = async () => {
    try {
      const gruposData = await getGrupos();
  
      // Iterar sobre los grupos y obtener la información del profesor y la sección para cada uno
      const gruposConDetalles = await Promise.all(
        gruposData.map(async (grupo) => {
          try {
            const profesor = await getProfesorById(grupo.idProfesor); // Servicio para obtener el profesor por ID
            const seccion = await getSeccionById(grupo.idSeccion); // Servicio para obtener la sección por ID
            const curso = await getCursoById(grupo.idCurso); // Servicio para obtener el curso por ID
  
            return {
              ...grupo,
              profesorNombre: `${profesor.nombre} ${profesor.apellido}`, // Agregar nombre completo del profesor
              seccionDescripcion: `Nivel: ${seccion.nivel} - Grupo: ${seccion.grupo}`, // Agregar descripción de la sección
              cursoNombre: curso.nombre, // Agregar nombre del curso
            };
          } catch (error) {
            console.error(`Error al obtener los detalles para el grupo con ID: ${grupo.id}`, error.message);
            return {
              ...grupo,
              profesorNombre: grupo.idProfesor ? "Profesor no encontrado" : "Sin profesor",
              seccionDescripcion: grupo.idSeccion ? "Sección no encontrada" : "Sin sección",
              cursoNombre: grupo.idCurso ? "Curso no encontrado" : "Sin curso",
            };
          }
        })
      );
  
      setGrupos(gruposConDetalles);
    } catch (error) {
      toast.error("Error al cargar la lista de grupos.");
      console.error("Error al obtener grupos:", error.message);
    }
  };
  
  const handleEdit = async (id) => {
    try {
      // Obtener los detalles del grupo por ID
      const grupo = await getGrupoCursoById(id); // Este servicio debe traer el grupo por su ID
  
      // Establecer el grupo a editar (esto muestra el componente `ModificarGrupo`)
      setGrupoAEditar(grupo);
    } catch (error) {
      toast.error("Error al cargar los detalles del grupo.");
      console.error("Error al cargar el grupo para editar:", error.message);
    }
  };
  
  // Eliminar grupo
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
        await deleteGrupoCurso(id); // Eliminar el grupo por ID
        toast.success("Grupo eliminado con éxito");
        await fetchGrupos(); // Volver a cargar la lista de grupos desde la base de datos
      } catch (error) {
        toast.error("Error al eliminar el grupo.");
        console.error("Error al eliminar el grupo:", error.message);
      }
    }
  };
  

  const handleSave = () => {
    setGrupoAEditar(null);
    fetchGrupos(); // Actualizar la lista después de guardar cambios
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

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

  if (grupoAEditar) {
    return (
      <ModificarGrupo
        grupo={grupoAEditar} // Pasar el grupo seleccionado
        onCancel={() => setGrupoAEditar(null)} // Cancelar edición
        onSave={handleSave} // Llamar cuando se guarden los cambios
      />
    );
  }
  


  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa"}}>
      <h2 style={{ textAlign: "center" }}>Lista de Grupos</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Días</th>
            <th style={thStyle}>Horario</th>
            <th style={thStyle}>Profesor</th>
            <th style={thStyle}>Sección</th>
            <th style={thStyle}>Curso</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <tr key={grupo.idGrupoCurso}>
              <td style={tdStyle}>
                  {`${grupo.dia1 === "Martes" ? "K" : grupo.dia1[0]}-${grupo.dia2 === "Martes" ? "K" : grupo.dia2[0]}`}
              </td>
              <td style={tdStyle}>{`${grupo.horaInicio} - ${grupo.horaFin}`}</td>
              <td style={tdStyle}>{grupo.profesorNombre}</td>
              <td style={tdStyle}>{grupo.seccionDescripcion}</td>
              <td style={tdStyle}>{grupo.cursoNombre}</td>
              <td style={tdStyle}>
                <button
                  style={actionButtonStyle}
                  onClick={() => handleEdit(grupo.idGrupoCurso)} // Lógica de edición
                >
                  <FaPencilAlt color="#007bff" />
                </button>
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                  }}
                  onClick={() => handleDelete(grupo.idGrupoCurso)}
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
