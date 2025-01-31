"use client";

import { useState } from "react";
import CrearAsignacion from "./crear";
import ListarAsignaciones from "./listar";

export default function AsignacionesPage() {
  const [activeTab, setActiveTab] = useState("crear");

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
    borderBottom: "3px solid #f00",
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
          style={activeTab === "crear" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("crear")}
        >
          Crear Asignación
        </div>
        <div
          style={activeTab === "listar" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("listar")}
        >
          Lista de Asignaciones
        </div>
      </div>

      <div style={contentStyle}>
        {activeTab === "crear" && <CrearAsignacion />}
        {activeTab === "listar" && <ListarAsignaciones />}
      </div>
    </div>
  );
}
