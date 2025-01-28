"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSecciones, deleteSeccion } from "@/services/seccionesService"; // Importar servicios necesarios
import SeccionIndividual from "./seccionIndividual"; // Componente para editar secciones
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Swal from "sweetalert2";
import { getSeccionesByProfesor } from "@/services/seccionesService"; // Asegurarse de usar este servicio

export default function ListarSecciones() {
  const [secciones, setSecciones] = useState([]);
  const [seccionAEditar, setSeccionAEditar] = useState(null); // Sección seleccionada para editar
  const [profesor, setProfesor] = useState("3zbMujHDpJWAqoYc6RqO");
  const [seccionView, setSeccionView] = useState(null);
  const fetchSecciones = async () => {
    try {
      const seccionesData = await getSeccionesByProfesor(profesor);
      console.log(seccionesData);
      setSecciones(seccionesData);
    } catch (error) {
      toast.error("Error al cargar la lista de secciones.");
      console.error("Error al obtener secciones:", error.message);
    }
  };


  useEffect(() => {
    fetchSecciones();
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

  const handleView = (cursoGroup) => { 
    setSeccionView(cursoGroup);
  }

  if (seccionView) {
    return (
      <SeccionIndividual cursoGroup={seccionView} />
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Lista de Secciones</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nivel</th>
            <th style={thStyle}>Grupo</th>
            <th style={thStyle}>Materia</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {secciones.map((seccion) => (
            <tr key={seccion.id}>
              <td style={tdStyle}>{seccion.secciones.nivel || "Sin nivel"}</td>
              <td style={tdStyle}>{seccion.secciones.grupo || "Sin grupo"}</td>
              <td style={tdStyle}>{seccion.curso.nombre}</td>
              <td style={tdStyle}>
                
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: "#8aabd1",
                    
                  }}
                  onClick={() => handleView(seccion)}
                >
                  <MdOutlineRemoveRedEye color="#fff" size= "1.5rem"/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
