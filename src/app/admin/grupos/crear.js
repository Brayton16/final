"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfesores, getProfesorById } from "@/services/profesoresService";
import { getCursos } from "@/services/cursosService";
import { getSecciones } from "@/services/seccionesService";
import { getGruposByProfesor, getGruposBySeccion, crearGrupoCurso } from "@/services/grupoCursoService";
import FullCalendar from "@fullcalendar/react"; // Componente de FullCalendar
import timeGridPlugin from "@fullcalendar/timegrid"; // Plugin para el diseño de la grilla de horarios
import interactionPlugin from "@fullcalendar/interaction"; // Plugin para manejar la interacción con eventos

const CrearGrupo = () => {
  const [form, setForm] = useState({
    idProfesor: "",
    idSeccion: "",
    idCurso: "",
    horaInicio: "",
    horaFin: "",
  });

  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cronogramaProfesor, setCronogramaProfesor] = useState([]);
  const [cronogramaSeccion, setCronogramaSeccion] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [especialidad, setEspecialidad] = useState("");
  const [formHorario, setFormHorario] = useState({
    dia1: "", // Inicializamos con una cadena vacía
    dia2: "", // También inicializado como cadena vacía
    horaInicio: "", // Cadena vacía
    horaFin: "", // Cadena vacía
  });
  

  // Cargar Profesores al inicio
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const profesoresData = await getProfesores();
        setProfesores(profesoresData);
      } catch (error) {
        toast.error("Error al cargar profesores.");
        console.error(error.message);
      }
    };
    const fetchCursos = async () => {
      try {
        const cursosData = await getCursos();
        setCursos(cursosData);
      } catch (error) {
        toast.error("Error al cargar cursos.");
        console.error(error.message);
      }
    };
    const fetchSecciones = async () => {
      try {
        const seccionesData = await getSecciones();
        setSecciones(seccionesData);
      } catch (error) {
        toast.error("Error al cargar secciones.");
        console.error(error.message);
        };
    };
    fetchSecciones();
    fetchProfesores();
    fetchCursos();
  }, []);

  const handleProfesorChange = async (e) => {
    const idProfesor = e.target.value;
  
    // Reiniciar el formulario y cronograma al cambiar el profesor
    setForm({ ...form, idProfesor, idSeccion: "", idCurso: "", horaInicio: "", horaFin: "" });
  
    if (!idProfesor) return;
  
    try {
      const profesor = await getProfesorById(idProfesor);
      setEspecialidad(profesor.especialidad);
      const gruposProfesor = await getGruposByProfesor(idProfesor);

      if (gruposProfesor.length === 0) {
        toast.error("No se encontraron grupos para este profesor.");
      }
  
      // Mapear los días de la semana a índices (donde 0 es domingo, 1 es lunes, etc.)
      const diasSemana = {
        Lunes: 1,
        Martes: 2,
        Miércoles: 3,
        Jueves: 4,
        Viernes: 5,
        Sábado: 6,
        Domingo: 0,
      };
  
      // Día base (domingo de la semana actual)
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Domingo
  
      const eventosProfesor = gruposProfesor.flatMap((grupo) => {
        const [horaInicioH, horaInicioM] = grupo.horaInicio.split(":").map(Number);
        const [horaFinH, horaFinM] = grupo.horaFin.split(":").map(Number);
  
        // Obtener los días de la API
        const dias = [grupo.dia1, grupo.dia2].filter(Boolean); // Asegurarnos de que existan
  
        // Generar eventos para cada día
        return dias.map((dia) => {
          const diaSemana = diasSemana[dia];
          const fechaInicio = new Date(startOfWeek);
          fechaInicio.setDate(fechaInicio.getDate() + diaSemana); // Ajustar al día correspondiente
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
  
      setCronogramaProfesor(eventosProfesor);
    } catch (error) {
      toast.error("Error al obtener el cronograma del profesor.");
      console.error(error.message);
    }
  };
  
  


  // Cargar cronograma de la sección seleccionada
const handleSeccionChange = async (e) => {
  const idSeccion = e.target.value;
  setForm({ ...form, idSeccion, horaInicio: "", horaFin: "" });

  if (!idSeccion) return;

  try {
    const gruposSeccion = await getGruposBySeccion(idSeccion);

    // Mapear los días de la semana a índices (donde 0 es domingo, 1 es lunes, etc.)
    const diasSemana = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 0,
    };

    // Día base (domingo de la semana actual)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Domingo
    if (gruposSeccion.length === 0) {
      toast.error("No se encontraron grupos para esta sección.");
    }
    // Formatear los horarios para FullCalendar
    const eventosSeccion = gruposSeccion.flatMap((grupo) => {
      const [horaInicioH, horaInicioM] = grupo.horaInicio.split(":").map(Number);
      const [horaFinH, horaFinM] = grupo.horaFin.split(":").map(Number);

      // Obtener los días de la API
      const dias = [grupo.dia1, grupo.dia2].filter(Boolean); // Asegurarnos de que existan

      // Generar eventos para cada día
      return dias.map((dia) => {
        const diaSemana = diasSemana[dia];
        const fechaInicio = new Date(startOfWeek);
        fechaInicio.setDate(fechaInicio.getDate() + diaSemana); // Ajustar al día correspondiente
        fechaInicio.setHours(horaInicioH, horaInicioM);

        const fechaFin = new Date(fechaInicio);
        fechaFin.setHours(horaFinH, horaFinM);

        return {
          title: `Clase de ${grupo.curso.nombre}`,
          start: fechaInicio.toISOString(),
          end: fechaFin.toISOString(),
          backgroundColor: "#60a5fa", // Color para las clases de la sección
        };
      });
    });

    setCronogramaSeccion(eventosSeccion);

    // Calcular horarios disponibles basados en los cronogramas del profesor y la sección
    const horarios = calcularHorariosDisponibles(cronogramaProfesor, eventosSeccion);
    setHorariosDisponibles(horarios);
  } catch (error) {
    toast.error("Error al obtener datos de la sección.");
    console.error(error.message);
  }
};


  // Cálculo de horarios disponibles
  const calcularHorariosDisponibles = (cronogramaProfesor, cronogramaSeccion) => {
    // Aquí puedes implementar la lógica para comparar horarios del profesor y la sección
    // y devolver un arreglo de horarios disponibles.
    return ["08:00", "10:00", "12:00"]; // Ejemplo de horarios disponibles
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearGrupoCurso(form);
      toast.success("Grupo creado con éxito.");
      setForm({
        idProfesor: "",
        idSeccion: "",
        idCurso: "",
        horaInicio: "",
        horaFin: "",
      });
    } catch (error) {
      toast.error("Error al crear el grupo.");
      console.error("Error al crear el grupo:", error.message);
    }
  };

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
  };

  const formStyle = {
    width: "100%",
    borderRadius: "8px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  };

  const buttonStyle = {
    padding: "0.8rem",
    borderRadius: "6px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
    width: "100%",
    marginTop: "1rem",
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Crear Grupo</h2>
          <label>
          <p>Profesor: {especialidad}</p>
          <select
            name="idProfesor"
            value={form.idProfesor}
            onChange={handleProfesorChange}
            style={inputStyle}
            required
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.id} value={profesor.id}>
                {profesor.nombre} {profesor.apellido}
              </option>
            ))}
          </select>
          </label>

        {form.idProfesor && (
          <div>
            <h3>Cronograma del Profesor</h3>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              events={cronogramaProfesor}
              headerToolbar={false}
              height="auto"
              slotMinTime="07:00:00" // Inicio del rango de horas (7:00 AM)
              slotMaxTime="16:50:00" // Fin del rango de horas (4:50 PM)
            />
          </div>
        )}


        <label style={{ marginTop: "1rem" }}>
          <p>Curso:</p>
          <select
            name="idCurso"
            value={form.idCurso}
            onChange={(e) => setForm({ ...form, idCurso: e.target.value })}
            style={inputStyle}
            required
          >
            <option value="">Seleccione un curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          <p>Sección:</p>
          <select
            name="idSeccion"
            value={form.idSeccion}
            onChange={handleSeccionChange}
            style={inputStyle}
            required
          >
            <option value="">Seleccione una sección</option>
            {secciones.map((seccion) => (
              <option key={seccion.id} value={seccion.id}>
                Nivel: {seccion.nivel} - Grupo: {seccion.grupo}
              </option>
            ))}
          </select>
        </label>

        {form.idSeccion && (
          <div>
            <h3>Cronograma de la Sección</h3>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              events={cronogramaSeccion}
              headerToolbar={false}
              height="auto"
              slotMinTime="07:00:00" // Inicio del rango de horas (7:00 AM)
              slotMaxTime="16:50:00" // Fin del rango de horas (4:50 PM)
            />
          </div>
        )}

        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: "1 1 50%" }}>
            {/* Selector para Día 1 */}
            <label style={{ display: "block", width: "100%" }}>
              <p>Día 1:</p>
              <select
                name="dia1"
                value={form.dia1}
                onChange={(e) => {
                  const dia1 = e.target.value;
                  const diasSemana = {
                    Lunes: "Miércoles",
                    Martes: "Jueves",
                    Miércoles: "Viernes",
                    Jueves: "Lunes",
                    Viernes: "Martes",
                  };
                  const dia2 = diasSemana[dia1] || "";
                  setForm({ ...form, dia1, dia2 }); // Actualizar Día 1 y calcular Día 2
                }}
                style={inputStyle}
                required
              >
                <option value="">Seleccione un día</option>
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ flex: "1 1 50%" }}>
            {/* Día 2 (Calculado automáticamente) */}
            <label style={{ display: "block", width: "100%" }}>
              <p>Día 2:</p>
              <input
                type="text"
                name="dia2"
                value={form.dia2}
                readOnly
                style={inputStyle}
              />
            </label>
          </div>

          <div style={{ flex: "1 1 50%" }}>
            {/* Selector para Hora de Inicio */}
            <label style={{ display: "block", width: "100%" }}>
              <p>Hora Inicio:</p>
              <select
                name="horaInicio"
                value={form.horaInicio}
                onChange={(e) => {
                  const horaInicio = e.target.value;
                  const [hora, minutos] = horaInicio.split(":").map(Number);
                  const horaFin = new Date();
                  horaFin.setHours(hora);
                  horaFin.setMinutes(minutos + 110); // 1 hora y 50 minutos después
                  setForm({
                    ...form,
                    horaInicio,
                    horaFin: `${horaFin.getHours().toString().padStart(2, "0")}:${horaFin
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`,
                  });
                }}
                style={inputStyle}
                required
              >
                <option value="">Seleccione una hora</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const hora = `${(7 + i).toString().padStart(2, "0")}:00`;
                  return (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div style={{ flex: "1 1 50%" }}>
            {/* Hora Final (Calculada automáticamente) */}
            <label style={{ display: "block", width: "100%" }}>
              <p>Hora Fin:</p>
              <input
                type="text"
                name="horaFin"
                value={form.horaFin}
                readOnly
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        <button type="submit" style={buttonStyle}>
          Crear Grupo
        </button>
      </form>
    </div>
  );
};

export default CrearGrupo;
