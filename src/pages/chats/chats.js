"use client";

import { useState, useEffect } from "react";
import { getConversaciones } from "../../services/chatService";
import "./chat.css";

export default function Chats() {
  const [userId, setUserId] = useState(null);
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar el userId desde localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  // Cargar las conversaciones cuando se tiene el userId
  useEffect(() => {
    if (userId) {
      const fetchConversaciones = async () => {
        try {
          const data = await getConversaciones(userId); 
          setConversaciones(data);
          //console.log(data);
        } catch (error) {
          setError("Error al cargar las conversaciones");
        } finally {
          setLoading(false);
        }
      };

      fetchConversaciones();
    }
  }, [userId]);

  // Mostrar mensaje de carga o error
  if (loading) {
    return (
      <div className="loading">
        <p>Cargando conversaciones...</p>
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

  if (!conversaciones.length) {
    return (
      <div className="no-conversaciones">
        <p>No tienes conversaciones aún.</p>
      </div>
    );
  }

  return (
    <div className="chats-container">
      <h1>Conversaciones</h1>
      <ul className="conversaciones-list">
        {conversaciones.map((conversacion) => (
          <li key={conversacion.id} className="conversacion-item">
            <div className="conversacion-header">
              <strong>{conversacion.receptorNombre}</strong>
            </div>
            <div className="conversacion-message">
              <p>
                Último mensaje:{" "}
                {conversacion.mensajes[conversacion.mensajes.length - 1] ||
                  "No hay mensajes"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
