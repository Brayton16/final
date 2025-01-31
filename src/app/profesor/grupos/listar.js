"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getGruposByProfesor, getGrupoCursoById } from "@/services/grupoCursoService";
import { getProfesorById } from "@/services/profesoresService";
import { crearAnuncio } from "@/services/anunciosService"; // Servicio para crear anuncios
import VerGrupo from "./verGrupo";
import { FaEye, FaBullhorn } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ListarGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [grupoAVer, setGrupoAVer] = useState(null);
  const [profesorId, setProfesorId] = useState("");
  const [profesor, setProfesor] = useState(null);  
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          toast.error("No se encontró un ID de usuario en LocalStorage.");
          return;
        }
        setProfesorId(storedUserId);
        const profesorData = await getProfesorById(storedUserId);
        const gruposData = await getGruposByProfesor(storedUserId);
        setProfesor(profesorData)
        setGrupos(gruposData);
      } catch (error) {
        toast.error("Error al cargar los grupos.");
        console.error("Error al obtener grupos:", error.message);
      }
    };

    fetchGrupos();
  }, []);

  const handleView = async (id) => {
    try {
      const grupo = await getGrupoCursoById(id);
      setGrupoAVer(grupo);
    } catch (error) {
      toast.error("Error al cargar los detalles del grupo.");
      console.error("Error al cargar el grupo:", error.message);
    }
  };

  const handleAnuncio = async (grupo) => {
    const { value: formValues } = await Swal.fire({
      title: "📢 Crear Anuncio",
      html: `
        <input id="titulo" class="swal2-input" placeholder="Título del anuncio">
        <textarea id="mensaje" class="swal2-textarea" placeholder="Mensaje del anuncio"></textarea>
        <select id="importancia" class="swal2-select">
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Publicar 📢",
      preConfirm: () => {
        return {
          titulo: document.getElementById("titulo").value,
          mensaje: document.getElementById("mensaje").value,
          importancia: document.getElementById("importancia").value,
        };
      },
    });

    if (formValues) {
      try {
        const nuevoAnuncio = {
          idGrupoCurso: grupo.idGrupoCurso,
          idProfesor: profesor.idProfesor,
          titulo: formValues.titulo,
          mensaje: formValues.mensaje,
          fechaPublicacion: new Date().toISOString(),
          autor: `${profesor.nombre} ${profesor.apellido}`,
          importancia: formValues.importancia,
        };
        await crearAnuncio(nuevoAnuncio);
        toast.success("Anuncio publicado con éxito!");
      } catch (error) {
        toast.error("Error al publicar el anuncio.");
        console.error("Error al crear anuncio:", error.message);
      }
    }
  };

  if (grupoAVer) {
    return <VerGrupo grupo={grupoAVer} onCancel={() => setGrupoAVer(null)} />;
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Mis Grupos</h2>
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
                <button style={iconButtonStyle} onClick={() => handleView(grupo.idGrupoCurso)}>
                  <FaEye color="#007bff" />
                </button>
                <button style={iconButtonStyle} onClick={() => handleAnuncio(grupo)}>
                  <FaBullhorn color="#28a745" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* 📌 Estilos */
const containerStyle = {
  padding: "2rem",
  backgroundColor: "#f8f9fa",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "1.8rem",
  marginBottom: "1rem",
};

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

const iconButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1.2rem",
  marginLeft: "10px",
};
