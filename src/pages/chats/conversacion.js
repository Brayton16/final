"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getConversacionById, sendMessage } from "../../services/chatService"; // Asegúrate de tener esta función
import "./chat.css";

export default function Conversacion() {
  const [conversacion, setConversacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(""); // Estado para el mensaje a enviar
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversacionId = searchParams.get("id"); // Obtener el ID de la conversación desde la URL

  // Cargar la conversación por ID
  useEffect(() => {
    if (conversacionId) {
      const fetchConversacion = async () => {
        try {
          const data = await getConversacionById(conversacionId);
          setConversacion(data);
        } catch (error) {
          setError("Error al cargar la conversación");
        } finally {
          setLoading(false);
        }
      };

      fetchConversacion();
    }
  }, [conversacionId]);

  // Manejar el envío de un nuevo mensaje
  const handleEnviarMensaje = async (e) => {
    e.preventDefault();

    if (mensaje.trim() === "") {
      return;
    }

    try {
      // Llamar a la función que maneja el envío del mensaje
      await sendMessage(conversacionId, mensaje);
      setMensaje(""); // Limpiar el campo de mensaje
      // Re-cargar la conversación para mostrar el nuevo mensaje
      const updatedConversacion = await getConversacionById(conversacionId);
      setConversacion(updatedConversacion);
    } catch (error) {
      console.error(error);
      setError("Error al enviar el mensaje");
    }
  };

  // Mostrar mensaje de carga o error
  if (loading) {
    return (
      <div className="loading">
        <p>Cargando conversación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  if (!conversacion) {
    return (
      <div className="no-conversacion">
        <p>La conversación no existe.</p>
      </div>
    );
  }

  return (
    <div className="conversacion-container">
      <h1>Conversación con {conversacion.idEmisor === conversacion.idReceptor ? "Yo" : conversacion.idReceptor}</h1>
      <ul className="mensajes-list">
        {conversacion.mensajes.map((mensaje, index) => (
          <li key={index} className="mensaje-item">
            <p>{mensaje}</p>
          </li>
        ))}
      </ul>

      {/* 
      <form onSubmit={handleEnviarMensaje} className="mensaje-form">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="mensaje-input"
        />
        <button type="submit" className="mensaje-enviar-btn">Enviar</button>
      </form>*/}
    </div>
  );
}
