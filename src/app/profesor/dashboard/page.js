"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../../../services/firebase";
import AdminNavbar from "@/components/navbar";

// Importar el Hook de verificación de roles
import useCheckPermissions from "@/hooks/useCheckPermissions";

export default function AdminDashboard() {
  // Llama al Hook de verificación de roles
  useCheckPermissions(["profesor"]);

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Obtén el token y verifica su expiración
        const tokenResult = await getIdTokenResult(currentUser);
        const now = Date.now() / 1000; // Tiempo actual en segundos

        if (tokenResult.expirationTime < now) {
          // Si el token ha expirado
          auth.signOut(); // Cierra sesión
          router.push("/"); // Redirige al login
        } else {
          // Si el token es válido
          setUser(currentUser); // Guarda el usuario en el estado
        }
      } else {
        router.push("/"); // Redirige al login si no hay sesión
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <button onClick={() => router.push("/admin/profesores")}>Profesores</button>
        <button onClick={() => router.push("/admin/encargados")}>Encargados</button>
        <button onClick={() => router.push("/admin/estudiantes")}>Estudiantes</button>
        <button onClick={() => router.push("/admin/grupos")}>Grupos</button>
        <button onClick={() => router.push("/admin/cursos")}>Cursos</button>
      </div>
    </div>
  );
}
