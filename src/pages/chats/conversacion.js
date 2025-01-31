"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getConversacionById, sendMessage } from "../../services/chatService";
import "./conversacion.css";

export default function Conversacion() {
  const [conversacion, setConversacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversacionId = searchParams.get("id");
  const [userId, setUserId] = useState(null);
  

  // Cargar la conversación por ID
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
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
  
    if (mensaje.trim() === "") return;
  
    try {
  
      await sendMessage(conversacionId, mensaje, userId); 
  
      setMensaje("");
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
        <button onClick={() => router.back()}>Volver atrás</button>
      </div>
    );
  }

  return (
    <div className="conversacion-container">
      <button onClick={() => router.push("/chats/chats")} className="regresar-btn">
        Regresar a chats
      </button>
      <button onClick={() => router.back()}>Volver atrás</button>
      <h1>{conversacion.receptorNombre}</h1>
      <ul className="mensajes-list">
        {conversacion.mensajes.map((mensaje, index) => (
          <li key={index} className="mensaje-item">
            <p>
              {/*<strong>{mensaje.emisor === conversacion.idEmisor ? conversacion.emisorNombre : conversacion.receptorNombre}:</strong> {mensaje.texto}*/}
              <strong>{mensaje.emisor === conversacion.idEmisor ? "Tu" : conversacion.receptorNombre}:</strong> {mensaje.texto} 
            </p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleEnviarMensaje} className="mensaje-form">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="mensaje-input"
        />
        <button type="submit" className="mensaje-enviar-btn">Enviar</button>
      </form>
    </div>
  );
}