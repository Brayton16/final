import { useRouter } from "next/router";

import RegistrarEncargado from "./encargados/registrar";
import ModificarEncargado from "./encargados/modificar";


export default function EncargadosPage() {

  const router = useRouter();

    return (
      <div>
        <button onClick={() => router.push("/admin/dashboard")}>Encargados</button>
        <h1>Gestión de Encargados</h1>
        <p>Esta página está dedicada a la gestión de encargados.</p>
      <RegistrarEncargado />
      <ModificarEncargado />
      </div>
    );
  }
  