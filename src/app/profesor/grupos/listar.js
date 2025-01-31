"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getGruposByProfesor, getGrupoCursoById } from "@/services/grupoCursoService";
import VerGrupo from "./verGrupo";
import { FaEye } from "react-icons/fa";

export default function ListarGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [grupoAVer, setGrupoAVer] = useState(null); // Grupo seleccionado para ver

  // Obtener los grupos del profesor desde LocalStorage
  const fetchGrupos = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        toast.error("No se encontró un ID de usuario en LocalStorage.");
        return;
      }

      const gruposData = await getGruposByProfesor(storedUserId);
      setGrupos(gruposData);
    } catch (error) {
      toast.error("Error al cargar los grupos.");
      console.error("Error al obtener grupos:", error.message);
    }
  };

  const handleView = async (id) => {
    try {
      const grupo = await getGrupoCursoById(id);
      setGrupoAVer(grupo);
    } catch (error) {
      toast.error("Error al cargar los detalles del grupo.");
      console.error("Error al cargar el grupo:", error.message);
    }
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
    cursor: "pointer",
    padding: "5px 10px",
  };

  if (grupoAVer) {
    return <VerGrupo grupo={grupoAVer} onCancel={() => setGrupoAVer(null)} />;
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa" }}>
      <h2 style={{ textAlign: "center" }}>Mis Grupos</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Días</th>
            <th style={thStyle}>Horario</th>
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
              <td style={tdStyle}>{`${grupo.secciones.nivel} - ${grupo.secciones.grupo}`}</td>
              <td style={tdStyle}>{grupo.curso.nombre}</td>
              <td style={tdStyle}>
                <button
                  style={actionButtonStyle}
                  onClick={() => handleView(grupo.idGrupoCurso)}
                >
                  <FaEye color="#007bff" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
