"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProfesorById } from "@/services/profesoresService";
import { getCursos } from "@/services/cursosService";
import { getSecciones } from "@/services/seccionesService";
import { getGruposByProfesor, getGruposBySeccion } from "@/services/grupoCursoService";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const VerGrupo = ({ grupo, onCancel }) => {
  const [especialidad, setEspecialidad] = useState("");
  const [cronogramaSeccion, setCronogramaSeccion] = useState([]);
  const [cursoNombre, setCursoNombre] = useState("");
  const [seccionDescripcion, setSeccionDescripcion] = useState("");
  const [nombreProfesor, setNombreProfesor] = useState(null);
  const [apellidoProfesor, setApellidoProfesor] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (grupo.idProfesor) {
          const profesor = await getProfesorById(grupo.idProfesor);
          setEspecialidad(profesor.especialidad);
          setNombreProfesor(profesor.nombre);
          setApellidoProfesor(profesor.apellido);
        }

        if (grupo.idCurso) {
          const cursosData = await getCursos();
          const cursoEncontrado = cursosData.find((curso) => curso.id === grupo.idCurso);
          setCursoNombre(cursoEncontrado ? cursoEncontrado.nombre : "Curso no encontrado");
        }

        if (grupo.idSeccion) {
          const seccionesData = await getSecciones();
          const seccionEncontrada = seccionesData.find((seccion) => seccion.id === grupo.idSeccion);
          setSeccionDescripcion(
            seccionEncontrada ? `Nivel: ${seccionEncontrada.nivel} - Grupo: ${seccionEncontrada.grupo}` : "Sección no encontrada"
          );

          const gruposSeccion = await getGruposBySeccion(grupo.idSeccion);
          setCronogramaSeccion(formatCronograma(gruposSeccion));
        }
      } catch (error) {
        toast.error("Error al cargar datos del grupo.");
        console.error("Error:", error.message);
      }
    };

    fetchInitialData();
  }, [grupo.idProfesor, grupo.idSeccion, grupo.idCurso]);

  const formatCronograma = (grupos) => {
    const diasSemana = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 0,
    };

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    return grupos.flatMap((grupo) => {
      const [horaInicioH, horaInicioM] = grupo.horaInicio.split(":").map(Number);
      const [horaFinH, horaFinM] = grupo.horaFin.split(":").map(Number);
      const dias = [grupo.dia1, grupo.dia2].filter(Boolean);

      return dias.map((dia) => {
        const diaSemana = diasSemana[dia];
        const fechaInicio = new Date(startOfWeek);
        fechaInicio.setDate(fechaInicio.getDate() + diaSemana);
        fechaInicio.setHours(horaInicioH, horaInicioM);

        const fechaFin = new Date(fechaInicio);
        fechaFin.setHours(horaFinH, horaFinM);
        return {
          title: `Clase de ${grupo.curso.nombre}`,
          start: fechaInicio.toISOString(),
          end: fechaFin.toISOString(),
          backgroundColor: "#f87171",
        };
      });
    });
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Detalles del Grupo</h2>

      <div>
        <h3>Profesor</h3>
        <p><strong>Nombre:</strong> {nombreProfesor} {apellidoProfesor}</p>
        <p><strong>Especialidad:</strong> {especialidad}</p>
      </div>
      
      <div>
        <h3>Curso</h3>
        <p><strong>Nombre:</strong> {cursoNombre}</p>
      </div>

      <div>
        <h3>Sección</h3>
        <p><strong>Descripción:</strong> {seccionDescripcion}</p>
      </div>

      <div>
        <h3>Horario</h3>
        <p><strong>Días:</strong> {grupo.dia1} - {grupo.dia2}</p>
        <p><strong>Horario:</strong> {grupo.horaInicio} - {grupo.horaFin}</p>
      </div>

      {cronogramaSeccion.length > 0 && (
        <div>
          <h3>Cronograma de la Sección</h3>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={cronogramaSeccion}
            headerToolbar={false}
            height="auto"
            slotMinTime="07:00:00"
            slotMaxTime="16:50:00"
          />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <button
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
          onClick={onCancel}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default VerGrupo;
