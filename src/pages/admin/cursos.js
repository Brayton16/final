import { useRouter } from "next/router";

import CrearCurso from "./cursos/crear";


export default function CursosPage() {

  const router = useRouter();

    return (
      <div>
        <button onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
        <h1>Gestión de Cursos</h1>
        <p>Esta página está dedicada a la creacion de cursos.</p>
     
        <CrearCurso />
      </div>
    );
  }
  