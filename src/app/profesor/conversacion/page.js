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
    const interval = setInterval(fetchConversacion, 3000);

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
        <h2 style={chatTitleStyle}>{receptorNombre}</h2>
      </div>

      <div style={chatMessagesStyle} ref={messagesEndRef}>
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
