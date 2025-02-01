"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getConversacionById, sendMessage } from "@/services/chatService";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

export default function Conversacion({ params }) {
  const router = useRouter();
  const { id } = params; // Extrae el ID desde los parámetros de la URL
  const receptorNombre = decodeURIComponent(router.query?.nombre || "Chat");

  const [conversacion, setConversacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const userAtBottomRef = useRef(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchConversacion = async () => {
      try {
        const data = await getConversacionById(id);
        setConversacion(data);
        if (userAtBottomRef.current) {
          hacerScrollAbajo();
        }
      } catch (error) {
        setError("Error al cargar la conversación");
      } finally {
        setLoading(false);
      }
    };

    fetchConversacion();
    const interval = setInterval(fetchConversacion, 10000);

    return () => clearInterval(interval);
  }, [id]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (mensaje.trim() === "") return;

    try {
      await sendMessage(id, mensaje, userId);
      setMensaje("");
      if (userAtBottomRef.current) {
        hacerScrollAbajo();
      }
    } catch (error) {
      console.error(error);
      setError("Error al enviar el mensaje");
    }
  };

  const hacerScrollAbajo = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <div style={loadingStyle}><p>Cargando conversación...</p></div>;
  }

  if (error) {
    return <div style={errorStyle}><p>{error}</p></div>;
  }

  if (!conversacion) {
    return (
      <div style={noConversacionStyle}>
        <p>La conversación no existe.</p>
        <button onClick={() => router.back()} style={buttonStyle}>Volver atrás</button>
      </div>
    );
  }

  return (
    <div style={chatContainerStyle}>
      <div style={chatHeaderStyle}>
        <button onClick={() => router.push("/profesor/chats")} style={backButtonStyle}>
          <FaArrowLeft size={20} />
        </button>
        <h2 style={chatTitleStyle}>{conversacion.receptorNombre}</h2>
      </div>

      <div style={chatMessagesStyle} ref={chatContainerRef} onScroll={handleScroll}>
        {conversacion.mensajes.map((mensaje, index) => (
          <div
            key={index}
            style={mensaje.emisor === userId ? mensajeEnviadoStyle : mensajeRecibidoStyle}
          >
            <p style={mensajeTextoStyle}>{mensaje.texto}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleEnviarMensaje} style={chatInputStyle}>
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={mensajeInputStyle}
        />
        <button type="submit" style={sendButtonStyle}>
          <FaPaperPlane size={20} />
        </button>
      </form>
    </div>
  );
}

// 🎨 **Estilos**

const chatContainerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "#f3f3f3",
  overflow: "hidden",
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
  cursor: "pointer",
};

const chatTitleStyle = {
  flex: 1,
  margin: 10,
  fontSize: "1.2rem",
};

const chatMessagesStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  paddingBottom: "70px",
};

const mensajeEnviadoStyle = {
  alignSelf: "flex-end",
  backgroundColor: "#007bff",
  color: "white",
  padding: "12px",
  borderRadius: "15px 15px 0 15px",
  maxWidth: "70%",
  wordWrap: "break-word",
  marginBottom: "8px",
};

const mensajeRecibidoStyle = {
  alignSelf: "flex-start",
  backgroundColor: "#e5e5e5",
  color: "black",
  padding: "12px",
  borderRadius: "15px 15px 15px 0",
  maxWidth: "70%",
  wordWrap: "break-word",
  marginBottom: "8px",
};

const mensajeTextoStyle = {
  margin: 0,
};

const chatInputStyle = {
  position: "fixed",
  bottom: 0,
  left: "180px",
  width: "calc(100% - 180px)",
  display: "flex",
  alignItems: "center",
  padding: "10px",
  backgroundColor: "white",
  boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
};

const mensajeInputStyle = {
  flex: 1,
  padding: "12px",
  border: "none",
  borderRadius: "25px",
  backgroundColor: "#f3f3f3",
  fontSize: "1rem",
  outline: "none",
  width: "100%",
};

const sendButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "10px 12px",
  borderRadius: "50%",
  cursor: "pointer",
  marginLeft: "10px",
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

const noConversacionStyle = {
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
