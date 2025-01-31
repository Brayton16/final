"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { obtenerAsignacionById } from "@/services/asignacionesService";
import { getEntregasByAsignacion, calificarEntrega } from "@/services/entregasService";
import { FaSave } from "react-icons/fa";

const VerAsignacion = ({ asignacion, onCancel }) => {
  const [datosAsignacion, setDatosAsignacion] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [editando, setEditando] = useState({}); // Estado para rastrear ediciones

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerAsignacionById(asignacion.id);
        setDatosAsignacion(data);

        const entregasData = await getEntregasByAsignacion(asignacion.id);
        setEntregas(entregasData);
      } catch (error) {
        toast.error("Error al cargar la asignación o entregas.");
        console.error("Error:", error.message);
      }
    };

    if (asignacion.id) {
      fetchData();
    }
  }, [asignacion.id]);

  if (!datosAsignacion) {
    return <p>Cargando...</p>;
  }

  const handleEditar = (id, campo, valor) => {
    setEntregas((prevEntregas) =>
      prevEntregas.map((ent) =>
        ent.id === id && ent[campo] !== valor // Solo actualiza si el valor cambió
          ? { ...ent, [campo]: valor }
          : ent
      )
    );
  
    // Solo marca como editado si el valor realmente cambió
    setEditando((prev) => ({
      ...prev,
      [id]: entregas.find((ent) => ent.id === id)?.[campo] !== valor,
    }));
  };
  

  const handleGuardar = async (idEntrega) => {
    const entregaActualizada = entregas.find((ent) => ent.id === idEntrega);
    try {
      const calificacion = {
        calificacion: entregaActualizada.calificacion,
        retroalimentacion: entregaActualizada.retroalimentacion,
      };
      await calificarEntrega(idEntrega, calificacion);
      toast.success("Entrega calificada correctamente.");
      setEditando((prev) => ({ ...prev, [idEntrega]: false }));
    } catch (error) {
      toast.error("Error al calificar la entrega.");
      console.error("Error:", error.message);
    }
  };

  // Estilos
  const containerStyle = {
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    maxWidth: "900px",
    margin: "auto",
  };

  const sectionStyle = {
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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

  const inputStyle = {
    width: "100px",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    textAlign: "center",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
  };

  const renderRecursos = (recurso) => {
    try {
      const url = new URL(recurso);
      const extension = url.pathname.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        return <img src={recurso} alt="Imagen de recurso" style={{ maxWidth: "100%", borderRadius: "8px" }} />;
      }

      if (["mp4", "webm", "ogg"].includes(extension)) {
        return (
          <video controls style={{ maxWidth: "100%", borderRadius: "8px" }}>
            <source src={recurso} type={`video/${extension}`} />
            Tu navegador no soporta el video.
          </video>
        );
      }

      if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
        const videoId = url.searchParams.get("v") || url.pathname.split("/").pop();
        return (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }

      return (
        <div style={{ padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "8px", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${url.hostname}`}
            alt="Favicon"
            style={{ width: "20px", height: "20px" }}
          />
          <a href={recurso} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
            {url.hostname}
          </a>
        </div>
      );
    } catch (error) {
      console.error("Error procesando recurso:", recurso);
      return <p style={{ color: "red" }}>No se pudo cargar este recurso: {recurso}</p>;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Detalles de la Asignación</h2>

        <div style={sectionStyle}>
          <h3>Título</h3>
          <p>{datosAsignacion.titulo}</p>
        </div>

        <div style={sectionStyle}>
          <h3>Descripción</h3>
          <p>{datosAsignacion.descripcion}</p>
        </div>

        <div style={sectionStyle}>
          <h3>Fecha de Entrega</h3>
          <p>{new Date(datosAsignacion.fechaEntrega).toLocaleString()}</p>
        </div>

        <div style={sectionStyle}>
          <h3>Tipo de Asignación</h3>
          <p>{datosAsignacion.tipo}</p>
        </div>

        <div style={sectionStyle}>
          <h3>Recursos</h3>
          {datosAsignacion.recursos.length > 0 ? (
            datosAsignacion.recursos.map((recurso, index) => <div key={index}>{renderRecursos(recurso)}</div>)
          ) : (
            <p>No hay recursos disponibles.</p>
          )}
        </div>
      </div>
      <div style={sectionStyle}>
        <h3>Entregas de los Estudiantes</h3>
        {entregas.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Estudiante</th>
                <th style={thStyle}>Fecha de Entrega</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Archivo</th>
                <th style={thStyle}>Calificación</th>
                <th style={thStyle}>Retroalimentación</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map((entrega) => (
                <tr key={entrega.id}>
                  <td style={tdStyle}>{entrega.idEstudiante}</td>
                  <td style={tdStyle}>{new Date(entrega.fechaEntrega).toLocaleString()}</td>
                  <td style={tdStyle}>{entrega.estado}</td>
                  <td style={tdStyle}>
                    <a href={entrega.archivos} target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                  <td style={tdStyle}>
                  <input
                    type="text"
                    value={entrega.calificacion !== null && entrega.calificacion !== undefined ? String(entrega.calificacion) : ""}
                    pattern="[0-9]+(\.[0-9]{1,2})?" // Permite decimales con 1 o 2 cifras
                    style={inputStyle}
                    onChange={(e) => handleEditar(entrega.id, "calificacion", e.target.value)}
                  />

                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={entrega.retroalimentacion || ""}
                      style={{ ...inputStyle, width: "150px" }}
                      onChange={(e) => handleEditar(entrega.id, "retroalimentacion", e.target.value)}
                    />
                  </td>
                  <td style={tdStyle}>
                    {editando[entrega.id] && (
                      <button style={buttonStyle} onClick={() => handleGuardar(entrega.id)}>
                        <FaSave />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay entregas registradas.</p>
        )}
      </div>

      <button onClick={onCancel} style={buttonStyle}>
        Volver
      </button>
    </div>
  );
};

export default VerAsignacion;
