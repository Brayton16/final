"use client";

import { useState } from "react";
import ListarGrupos from "./listar";
import ListarAnuncios from "./anuncios";

// Importar el Hook de verificación de roles
import useCheckPermissions from "@/hooks/useCheckPermissions";

export default function GrupoPage() {
  // Llama al Hook de verificación de roles
  useCheckPermissions(["profesor"]);

  const [activeTab, setActiveTab] = useState("listar"); // Iniciar en la pestaña de listar

  const pageStyle = {
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
    borderBottom: "3px solid #f00", // Resalta la pestaña activa
  };

  const contentStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "0",
  };

  return (
    <div style={pageStyle}>
      <div style={tabsContainerStyle}>
        <div
          style={activeTab === "listar" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("listar")}
        >
          Lista de grupos
        </div>
        <div
          style={activeTab === "anuncios" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("anuncios")}
        >
          Anuncios
        </div>
      </div>

      <div style={contentStyle}>
        {activeTab === "listar" && <ListarGrupos />}
        {activeTab === "anuncios" && <ListarAnuncios />}
      </div>
    </div>
  );
}
