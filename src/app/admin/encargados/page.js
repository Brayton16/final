"use client";

import { useRouter } from "next/navigation";

import RegistrarEncargado from "./registrar";
import ModificarEncargado from "./modificar";


export default function EncargadosPage() {

  const router = useRouter();

    return (
      <div>
        <h1>Gestión de Encargados</h1>
        <p>Esta página está dedicada a la gestión de encargados.</p>
      <RegistrarEncargado />
      <ModificarEncargado />
      </div>
    );
  }
  