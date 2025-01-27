"use client";

import { useRouter } from "next/navigation";

import RegistrarEstudiante from "./registrar";


export default function EstudiantesPage() {

  const router = useRouter();

    return (
      <div>
        <button onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
        <h1>Gestión de Estudiantes</h1>
        <p>Esta página está dedicada a la gestión de estudiantes.</p>
        <RegistrarEstudiante />
      </div>
    );
  }
  