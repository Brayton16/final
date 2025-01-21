import { useRouter } from "next/router";

import CrearNuevoGrupo from "./grupos/crear";


export default function CursosPage() {

  const router = useRouter();

    return (
      <div>
        <button onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
        <h1>Gestión de Grupos</h1>
        <p>Esta página está dedicada a la gestión de grupos.</p>
     
        <CrearNuevoGrupo />
      </div>
    );
  }
  