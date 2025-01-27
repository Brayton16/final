"use client";

import { useRouter } from "next/navigation";

import RegistrarProfesor from "./registrar";
import ModificarProfesor from "./modificar";


export default function ProfesoresPage() {

  const router = useRouter();

    return (
      <div>
        <button onClick={() => router.push("/admin/dashboard")}>dashboard</button>
        <h1>Gestión de Profesores</h1>
        <p>Esta página está dedicada a la gestión de profesores.</p>
        <RegistrarProfesor />
        <ModificarProfesor />
      </div>
    );
  }
  