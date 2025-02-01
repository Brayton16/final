"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getConversaciones } from "@/services/chatService";
import { FaArrowLeft } from "react-icons/fa";
export default function Chats() {
  const [userId, setUserId] = useState(null);
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchConversaciones = async () => {
        try {
          const data = await getConversaciones(userId);
          setConversaciones(data);
        } catch (error) {
          setError("Error al cargar las conversaciones");
        } finally {
          setLoading(false);
        }
      };

      fetchConversaciones();
    }
  }, [userId]);

  if (loading) {
    return <div style={loadingStyle}><p>Cargando conversaciones...</p></div>;
  }

  if (error) {
    return <div style={errorStyle}><p>{error}</p></div>;
  }

  if (!conversaciones.length) {
    return (
      <div style={noConversacionesStyle}>
        <button onClick={() => router.back()} style={buttonStyle}>
          Regresar
        </button>
        <p>No tienes conversaciones aún.</p>
      </div>
    );
  }

  const handleConversacionClick = (id, receptorNombre) => {
    router.push(`/profesor/conversacion`, {
      state: { idConversacion: id, receptorNombre }
    });
  };
  

  return (
    <div style={chatsContainerStyle}>
      <div style={chatHeaderStyle}>
        <button onClick={() => router.back()} style={backButtonStyle}>
          <FaArrowLeft size={20} />
        </button>
        <h1 style={chatTitleStyle}>Conversaciones</h1>
      </div>

      <div style={chatListContainerStyle}>
        {conversaciones.map((conversacion) => (
          <div 
            key={conversacion.id} 
            style={chatItemStyle} 
            onClick={() => handleConversacionClick(conversacion.id)}
          >
            <div style={avatarStyle}>
              <span style={avatarTextStyle}>{conversacion.receptorNombre[0]}</span>
            </div>
            <div style={chatInfoStyle}>
              <strong style={chatNameStyle}>{conversacion.receptorNombre}</strong>
              <p style={lastMessageStyle}>
                {conversacion.ultimoMensaje || "No hay mensajes"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 Estilos en objetos

const chatsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  width: "calc(100%)",
  backgroundColor: "#fff",
  overflow: "hidden",
  borderRight: "1px solid #ddd",
};

const chatHeaderStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const backButtonStyle = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const chatTitleStyle = {
  flex: 1,
  margin: 10,
  fontSize: "1.2rem",
};

const chatListContainerStyle = {
  flex: 1,
  overflowY: "auto",
};

const chatItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "15px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  transition: "background 0.2s",
};

chatItemStyle["&:hover"] = {
  backgroundColor: "#f1f1f1",
};

const avatarStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "#007bff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  marginRight: "15px",
};

const avatarTextStyle = {
  fontWeight: "bold",
  fontSize: "18px",
};

const chatInfoStyle = {
  flex: 1,
};

const chatNameStyle = {
  fontSize: "1rem",
};

const lastMessageStyle = {
  fontSize: "0.9rem",
  color: "#666",
};

const loadingStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  fontSize: "1.2rem",
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  padding: "20px",
};

const noConversacionesStyle = {
  textAlign: "center",
  padding: "20px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};
