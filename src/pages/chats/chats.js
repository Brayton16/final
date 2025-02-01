"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getConversaciones } from "../../services/chatService";
import "./chat.css";

export default function Chats() {
  const [userId, setUserId] = useState(null);
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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
          console.log(data);
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
              <button onClick={() => router.back()} className="regresar-btn"> {/* router.back() te lleva a la última página visitada antes de esta*/}
        Regresar 
      </button>
        <p>No tienes conversaciones aún.</p>
      </div>
    );
  }

  const handleConversacionClick = (id) => {
    router.push(`/chats/conversacion?id=${id}`); // Redirigir a la página de la conversación pasando el ID por la URL
  };

  return (
    <div className="chats-container">
      <button onClick={() => router.back()} className="regresar-btn"> {/* Se debe modificar para que retorne al dashboard actual */}
        Regresar 
      </button>
      <h1>Conversaciones</h1>
      <ul className="conversaciones-list">
        {conversaciones.map((conversacion) => (
          <li key={conversacion.id} className="conversacion-item" onClick={() => handleConversacionClick(conversacion.id)}>
            <div className="conversacion-header">
              <strong>{conversacion.receptorNombre}</strong>
            </div>
            <div className="conversacion-message">
              <p>
                Último mensaje:{" "}
                {conversacion.ultimoMensaje || "No hay mensajes"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
