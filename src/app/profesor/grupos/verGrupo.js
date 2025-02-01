"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSeccionById } from "@/services/seccionesService";
import { getEncargadoById } from "@/services/encargadosService";
import { getEstudianteById } from "@/services/estudiantesService";
import {createConversacion} from '../../../services/chatService';
import { useRouter } from "next/navigation"; 

import VerNotasEstudiante from "./verNotasEstudiante"; // Importa la vista de notas

export default function VerGrupo({ grupo, onCancel }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const seccionData = await getSeccionById(grupo.idSeccion);

        if (!seccionData || !seccionData.listaEstudiantes) {
          toast.error("No hay estudiantes en esta sección.");
          return;
        }

        // Obtener información de los estudiantes y sus encargados
        const estudiantesConEncargados = await Promise.all(
          seccionData.listaEstudiantes.map(async (idEstudiante) => {
            try {
              const estudianteData = await getEstudianteById(idEstudiante);
              const encargadoData = estudianteData.encargado
                ? await getEncargadoById(estudianteData.encargado)
                : null;

              return {
                id: idEstudiante,
                estudianteNombre: `${estudianteData.nombre} ${estudianteData.apellido}`,
                estudianteCorreo: estudianteData.correo,
                encargadoNombre: encargadoData ? `${encargadoData.nombre} ${encargadoData.apellido}` : "Sin encargado",
                encargadoCorreo: encargadoData ? encargadoData.correo : null,
                encargadoId: encargadoData ? encargadoData.id : null,
              };
            } catch (error) {
              console.error("Error obteniendo estudiante:", error);
              return { id: idEstudiante, estudianteNombre: "No disponible", estudianteCorreo: "N/A", encargadoNombre: "Error", encargadoCorreo: null };
            }
          })
        );
        console.log("Estudiantes con encargados:", estudiantesConEncargados);
        setEstudiantes(estudiantesConEncargados);
      } catch (error) {
        toast.error("Error al cargar los estudiantes del grupo.");
        console.error("Error al obtener estudiantes:", error.message);
      }
    };

    fetchEstudiantes();
  }, [grupo.idSeccion]);

  if (estudianteSeleccionado) {
    return <VerNotasEstudiante estudiante={estudianteSeleccionado} grupo={grupo} onCancel={() => setEstudianteSeleccionado(null)} />;
  }

  const sendMessage = async (encargadoId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("No se encontró el usuario actual.");
      return;
    }

    if (!encargadoId) {
      toast.error("No se encontró el ID del encargado.");
      return;
    }
    
    try  {
      console.log("Creando conversación entre:", userId, encargadoId);
      const conversacion = await createConversacion(userId, encargadoId);
      console.log("Conversación creada:", conversacion);
      router.push(`/chats/conversacion?id=${conversacion.id}`);
    }
    catch (error) {
      toast.error("Error al cargar la conversación.");
      console.error("Error al cargar la conversación:", error.message);
    }
  };

  const containerStyle = {
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    margin: "auto",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
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

  const buttonStyle = {
    padding: "0.8rem",
    borderRadius: "6px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
    width: "100%",
    marginTop: "1rem",
  };

  const actionButtonStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "5px 10px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Detalles del Grupo</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre del Estudiante</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Encargado</th>
            <th style={thStyle}>Correo del Encargado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.length > 0 ? (
            estudiantes.map((estudiante) => (
              <tr key={estudiante.id}>
                <td style={tdStyle}>{estudiante.estudianteNombre}</td>
                <td style={tdStyle}>{estudiante.estudianteCorreo}</td>
                <td style={tdStyle}>{estudiante.encargadoNombre}</td>
                <td style={tdStyle}>
                {estudiante.encargadoCorreo ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      sendMessage(estudiante.encargadoId);
                    }}
                    title="Enviar mensaje al encargado" // Esto muestra el texto al pasar el mouse
                    style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
                  >
                    {estudiante.encargadoCorreo}
                  </a>
                ) : (
                  "No disponible"
                )}
                </td>
                <td style={tdStyle}>
                  <button style={actionButtonStyle} onClick={() => setEstudianteSeleccionado(estudiante)}>
                    Ver Notas
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                No hay estudiantes en esta sección.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={onCancel} style={buttonStyle}>
        Volver
      </button>
    </div>
  );
}
