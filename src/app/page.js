"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const userUnauthorized = async (role) => {
    const result = await Swal.fire({
      title: "Acceso denegado",
      text: `Al ser ${role} no tienes acceso a esta página.`,
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ok",
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Obtén los custom claims del token del usuario
          const idTokenResult = await user.getIdTokenResult(true); // 'true' fuerza la actualización del token
          const role = idTokenResult.claims.role;
          console.log("Role:", role);
          if (!role) {
            router.push("admin/dashboard"); // Redirige al login si no hay un rol asignado
            return;
          }else{
            if (role === "admin") {
              router.push("/admin/dashboard");
            } else if (role === "encargado") {
              await signOut(auth);
              
            } else if (role === "profesor") {
              router.push("/dashboard/profesor");
            } else if (role === "estudiante") {
              await signOut(auth);
            } 
          }
        } catch (error) {
          console.error("Error al obtener los claims:", error.message);
          router.push("/"); // Redirige al login en caso de error
        }
      } else {
        router.push("/"); // Redirige al login si no hay un usuario autenticado
      }
    });

    return () => unsubscribe(); // Limpia el listener cuando el componente se desmonta
  }, [router]);

  const handleLogin = async () => {
    if (!email) {
      setError("Por favor, introduce un correo electrónico.");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, introduce un correo electrónico válido.");
      return;
    }

    if (!password) {
      setError("Por favor, introduce tu contraseña.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;
      console.log("Role:", role);
      if (!role) {
        router.push("admin/dashboard"); // Redirige al login si no hay un rol asignado
        return;
      }
      if (role === "encargado") {
        userUnauthorized(role);
        await signOut(auth);
      } else if (role === "profesor") {
        router.push("/dashboard/profesor");
      } else if (role === "estudiante") {
        userUnauthorized(role);
        await signOut(auth);
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Correo electrónico o contraseña incorrectos.");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  };

  const formStyle = {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Hover transition
  };

  const buttonHoverStyle = {
    backgroundColor: "#1d4ed8", // Color más oscuro para hover
  };

  const errorStyle = {
    color: "red",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h1 style={{ marginBottom: "1.5rem", color: "#333" }}>Iniciar Sesión</h1>
        {error && <p style={errorStyle}>{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={handleLogin}
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}