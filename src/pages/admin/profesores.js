import { useRouter } from "next/router";

import RegistrarProfesor from "./profesores/registrar";
import ModificarProfesor from "./profesores/modificar";


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
  