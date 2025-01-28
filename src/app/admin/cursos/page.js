"use client";

import { useRouter } from "next/navigation";

import CrearCurso from "./crear";


export default function CursosPage() {
    return (
      <div>
        <h1>Gestión de Grupos</h1>
        <p>Esta página está dedicada a la creacion de cursos.</p>
     
        <CrearCurso />
      </div>
    );
  }
  