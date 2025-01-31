"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";

const ProfesorSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const sidebarStyle = {
    height: "100vh",
    width: "180px",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "1rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
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
    transition: "all 0.3s ease",
  };

  const linkActiveStyle = {
    ...linkStyle,
    backgroundColor: "#e9ecef",
    fontWeight: "bold",
  };

  const menuItems = [
    { path: "/profesor/dashboard", label: "Dashboard" },
    { path: "/profesor/grupos", label: "Grupos" },
    { path: "/profesor/asignaciones", label: "Asignaciones" },
    { path: "/profesor/chats", label: "Chats" },
  ];

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
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                style={pathname === item.path ? linkActiveStyle : linkStyle}
                onMouseEnter={(e) => (e.target.style.transform = "translateX(5px)")}
                onMouseLeave={(e) => (e.target.style.transform = "translateX(0)")}
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
            if (auth.currentUser) {
              await signOut(auth);
            }
            router.push("/");
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

export default ProfesorSidebar;
