"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la ruta actual

  const sidebarStyle = {
    height: "100vh",
    width: "180px", // Cambiado a 180px
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Asegura que el contenido y el botón estén separados
    padding: "1rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)", // Sombra más prominente
    position: "fixed",
    top: 0,
    left: 0,
    overflowY: "auto",
  };

  const linkStyle = {
    cursor: "pointer",
    padding: "0.5rem 1rem",
    display: "block",
    color: "#495057",
    textDecoration: "none",
    transition: "all 0.3s ease", // Animación suave
  };

  const linkActiveStyle = {
    ...linkStyle,
    backgroundColor: "#e9ecef",
    fontWeight: "bold",
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ width: "80px" }} />
        </div>
        <ul className="list-unstyled">
          {[
            { path: "/admin/dashboard", label: "Dashboard" },
            { path: "/admin/profesores", label: "Profesores" },
            { path: "/admin/estudiantes", label: "Estudiantes" },
            { path: "/admin/encargados", label: "Encargados" },
            { path: "/admin/cursos", label: "Cursos" },
            { path: "/admin/grupos", label: "Grupos" },
            { path: "/admin/secciones", label: "Secciones" },
          ].map((item) => (
            <li key={item.path}>
              <a
                style={
                  pathname === item.path
                    ? { ...linkStyle, ...linkActiveStyle }
                    : linkStyle
                }
                onMouseEnter={(e) =>
                  (e.target.style.transform = "translateX(5px)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "translateX(0)")
                }
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="btn btn-danger w-100"
        onClick={async () => {
          try {
            // Si estás usando Firebase, cierra sesión
            if (auth.currentUser) {
              await signOut(auth); // Cierra sesión del usuario
            }
            router.push("/"); // Redirige al login o página principal
          } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
          }
        }}
      >
        Logout
      </button>

    </div>
  );
};

export default AdminSidebar;
