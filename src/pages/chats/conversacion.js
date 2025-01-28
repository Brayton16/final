"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Usamos useRouter para acceder al estado

export default function Conversacion() {
  const router = useRouter();
  const [conversacion, setConversacion] = useState(null);

  // Obtenemos la data pasada desde la página anterior
  useEffect(() => {
    const { conversacion } = router.state || {}; // Accedemos al estado pasado
    if (conversacion) {
      setConversacion(conversacion);
    }
  }, [router.state]);

  if (!conversacion) {
    return <div>No se encontró la conversación.</div>;
  }

  return (
    <div>
      <h1>Conversación con {conversacion.receptorNombre}</h1>
      <div>
        {conversacion.mensajes.map((mensaje, index) => (
          <div key={index}>
            <p><strong>{mensaje.enviadoPor}</strong>: {mensaje.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
