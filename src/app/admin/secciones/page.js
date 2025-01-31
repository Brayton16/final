"use client";

import { useState } from "react";
import CrearSeccion from "./crear";
import ListarSecciones from "./listar";

// Importar el Hook de verificación de roles
import useCheckPermissions from "@/hooks/useCheckPermissions";

export default function SeccionesPage() {
  // Llama al Hook de verificación de roles
  useCheckPermissions(["admin"]); 

  const [activeTab, setActiveTab] = useState("registrar"); // Controlar las tabs

  const pageStyle = {
    height: "100vh", // Ocupa toda la altura de la ventana
    width: "100%", // Ocupa todo el ancho
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
  };

  const tabsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    borderBottom: "2px solid #ccc",
    backgroundColor: "#fff",
    padding: "1rem 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const tabStyle = {
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    borderBottom: "3px solid transparent",
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: "3px solid #f00", // Resalta la tab activa
  };

  const contentStyle = {
    flex: 1, // Ocupa todo el espacio disponible debajo de las tabs
    overflowY: "auto",
    padding: "0",
  };

  return (
    <div style={pageStyle}>
      <div style={tabsContainerStyle}>
        <div
          style={activeTab === "registrar" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("registrar")}
        >
          Crear Sección
        </div>
        <div
          style={activeTab === "listar" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("listar")}
        >
          Lista de Secciones
        </div>
      </div>

      <div style={contentStyle}>
        {activeTab === "registrar" && <CrearSeccion />}
        {activeTab === "listar" && <ListarSecciones />}
      </div>
    </div>
  );
}
