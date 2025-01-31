"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { obtenerAnunciosByProfesor } from "@/services/anunciosService";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ListarAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [profesorId, setProfesorId] = useState("");

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          toast.error("No se encontró un ID de usuario en LocalStorage.");
          return;
        }
        setProfesorId(storedUserId);
        const anunciosData = await obtenerAnunciosByProfesor(storedUserId);
        setAnuncios(anunciosData.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)));
      } catch (error) {
        toast.error("Error al cargar los anuncios.");
        console.error("Error al obtener anuncios:", error.message);
      }
    };

    fetchAnuncios();
  }, []);


  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Mis Anuncios</h2>

      {anuncios.length > 0 ? (
        anuncios.map((anuncio) => (
          <div key={anuncio.idAnuncio} style={anuncioCardStyle}>
            <div style={headerStyle}>
              <h3 style={anuncioTitleStyle}>{anuncio.titulo}</h3>
              <span style={importanciaStyle(anuncio.importancia)}>
                {anuncio.importancia.charAt(0).toUpperCase() + anuncio.importancia.slice(1)}
              </span>
            </div>
            <p style={mensajeStyle}>{anuncio.mensaje}</p>
            <div style={footerStyle}>
              <span style={fechaStyle}>📅 {new Date(anuncio.fechaPublicacion).toLocaleString()}</span>
            </div>
          </div>
        ))
      ) : (
        <p style={emptyMessageStyle}>No has publicado anuncios aún.</p>
      )}
    </div>
  );
}

/* 📌 Estilos */
const containerStyle = {
  padding: "2rem",
  backgroundColor: "#f8f9fa",
  maxWidth: "700px",
  margin: "auto",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "1.8rem",
  marginBottom: "1rem",
};

const crearAnuncioButton = {
  width: "100%",
  padding: "10px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  marginBottom: "1rem",
};

const anuncioCardStyle = {
  backgroundColor: "#fff",
  padding: "1rem",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  marginBottom: "1rem",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const anuncioTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  margin: "0",
};

const importanciaStyle = (nivel) => ({
  padding: "5px 10px",
  borderRadius: "6px",
  fontSize: "0.9rem",
  fontWeight: "bold",
  backgroundColor: nivel === "alta" ? "#ff4d4d" : nivel === "media" ? "#ffcc00" : "#4caf50",
  color: "#fff",
});

const mensajeStyle = {
  fontSize: "1rem",
  marginTop: "0.5rem",
};

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "1rem",
};

const fechaStyle = {
  fontSize: "0.9rem",
  color: "#666",
};

const iconButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};

const emptyMessageStyle = {
  textAlign: "center",
  fontSize: "1rem",
  color: "#777",
  marginTop: "1rem",
};
