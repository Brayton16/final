"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { obtenerAsignacionesByProfesor, deleteAsignacion } from "@/services/asignacionesService";
import { getProfesorById } from "@/services/profesoresService";
import { getGruposByProfesor } from "@/services/grupoCursoService";
import { FaPencilAlt, FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import ModificarAsignacion from "./modificar";
import VerAsignacion from "./verAsingacion";
import { getEntregasByAsignacion } from "@/services/entregasService";

export default function ListarAsignaciones() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionAEditar, setAsignacionAEditar] = useState(null);
  const [asignacionAEntregas, setAsignacionAEntregas] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [filtroSeccion, setFiltroSeccion] = useState("");

  const fetchData = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        toast.error("No se encontró un ID de usuario en LocalStorage.");
        return;
      }

      const profesorData = await getProfesorById(storedUserId);
      if (!profesorData) {
        toast.error("No se encontró un profesor con ese ID.");
        return;
      }

      const asignacionesData = await obtenerAsignacionesByProfesor(storedUserId);
      const gruposData = await getGruposByProfesor(storedUserId);

      const entregasPromises = asignacionesData.map(async (asignacion) => {
        const entregas = await getEntregasByAsignacion(asignacion.id);
        return { ...asignacion, cantidadEntregas: entregas.length };
      });
      
      const asignacionesConEntregas = await Promise.all(entregasPromises);

      // Extraer las secciones únicas desde los grupos del profesor
      const seccionesUnicas = Array.from(
        new Set(gruposData.map((grupo) => JSON.stringify({ id: grupo.idSeccion, nivel: grupo.secciones.nivel, grupo: grupo.secciones.grupo })))
      ).map((seccion) => JSON.parse(seccion));

      setAsignaciones(asignacionesConEntregas);
      setGrupos(gruposData);
      setSecciones(seccionesUnicas);
    } catch (error) {
      toast.error("Error al cargar los datos.");
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (asignacion) => {
    setAsignacionAEditar(asignacion);
  };

  const handleViewEntregas = (asignacion) => {
    setAsignacionAEntregas(asignacion);
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
        await deleteAsignacion(id);
        setAsignaciones(asignaciones.filter((asignacion) => asignacion.id !== id));
        toast.success("Asignación eliminada con éxito");
      } catch (error) {
        toast.error("Error al eliminar la asignación.");
        console.error("Error al eliminar la asignación:", error.message);
      }
    }
  };

  const handleSave = async () => {
    setAsignacionAEditar(null);
    setAsignacionAEntregas(null);
    await fetchData(); // Vuelve a cargar la lista después de modificar
  };

  if (asignacionAEditar) {
    return <ModificarAsignacion asignacion={asignacionAEditar} onCancel={() => setAsignacionAEditar(null)} onSave={handleSave} />;
  }

  if (asignacionAEntregas) {
    return <VerAsignacion asignacion={asignacionAEntregas} onCancel={() => setAsignacionAEntregas(null)} />;
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
    overflow: "hidden",
    maxWidth: "500px",
    textOverflow: "ellipsis",
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
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa" }}>
      <h2 style={{ textAlign: "center" }}>Lista de Asignaciones</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          <p>Filtrar por Sección:</p>
          <select
            value={filtroSeccion}
            onChange={(e) => setFiltroSeccion(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Todas las secciones</option>
            {secciones.map((seccion) => (
              <option key={seccion.id} value={seccion.id}>
                {seccion.nivel} - {seccion.grupo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Título</th>
            <th style={thStyle}>Descripción</th>
            <th style={thStyle}>Fecha de Entrega</th>
            <th style={thStyle}>Entregas</th>
            <th style={thStyle}>Grupo</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody> 
            {asignaciones
                .filter((asignacion) => {
                const grupo = grupos.find((g) => g.idGrupoCurso === asignacion.idGrupoCurso);
                return filtroSeccion ? grupo?.idSeccion === filtroSeccion : true;
                })
                .map((asignacion) => {
                const grupo = grupos.find((g) => g.idGrupoCurso === asignacion.idGrupoCurso);
                const seccion = grupo ? secciones.find((sec) => sec.id === grupo.idSeccion) : null;

                return (
                    <tr key={asignacion.id}>
                    <td style={tdStyle}>{asignacion.titulo}</td>
                    <td style={tdStyle} title={asignacion.descripcion}>{asignacion.descripcion}</td>
                    <td style={tdStyle}>{new Date(asignacion.fechaEntrega).toLocaleString()}</td>
                    <td style={tdStyle}>{asignacion.cantidadEntregas || 0}</td>
                    <td style={tdStyle}>
                        {seccion ? `${seccion.nivel} - ${seccion.grupo}` : "Sin sección"}
                    </td>
                    <td style={tdStyle}>
                        <button style={actionButtonStyle} onClick={() => handleViewEntregas(asignacion)}>
                        <FaEye color="#007bff" />
                        </button>
                        <button style={actionButtonStyle} onClick={() => handleEdit(asignacion)}>
                        <FaPencilAlt color="#007bff" />
                        </button>
                        <button
                        style={{ ...actionButtonStyle, backgroundColor: "#f8d7da", border: "1px solid #f5c6cb" }}
                        onClick={() => handleDelete(asignacion.id)}
                        >
                        <FaTrash color="#dc3545" />
                        </button>
                    </td>
                    </tr>
                );
                })}
            </tbody>
      </table>
    </div>
  );
}
