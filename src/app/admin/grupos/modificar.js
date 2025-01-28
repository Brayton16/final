"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfesorById, getProfesores } from "@/services/profesoresService";
import { getCursos } from "@/services/cursosService";
import { getSecciones } from "@/services/seccionesService";
import { updateGrupoCurso, getGruposByProfesor, getGruposBySeccion } from "@/services/grupoCursoService";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const ModificarGrupo = ({ grupo, onSave, onCancel }) => {
  const [form, setForm] = useState({
    idProfesor: grupo.idProfesor || "",
    idSeccion: grupo.idSeccion || "",
    idCurso: grupo.idCurso || "",
    dia1: grupo.dia1 || "",
    dia2: grupo.dia2 || "",
    horaInicio: grupo.horaInicio || "",
    horaFin: grupo.horaFin || "",
  });

  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cronogramaProfesor, setCronogramaProfesor] = useState([]);
  const [cronogramaSeccion, setCronogramaSeccion] = useState([]);
  const [especialidad, setEspecialidad] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profesoresData, cursosData, seccionesData] = await Promise.all([
          getProfesores(),
          getCursos(),
          getSecciones(),
        ]);
        setProfesores(profesoresData);
        setCursos(cursosData);
        setSecciones(seccionesData);
      } catch (error) {
        toast.error("Error al cargar datos iniciales.");
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchInitialCronogramas = async () => {
      try {
        // Cargar el cronograma del profesor
        if (grupo.idProfesor) {
          const profesor = await getProfesorById(grupo.idProfesor);
          setEspecialidad(profesor.especialidad);
  
          const gruposProfesor = await getGruposByProfesor(grupo.idProfesor);
  
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
  
          const eventosProfesor = gruposProfesor.flatMap((grupo) => {
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
  
          setCronogramaProfesor(eventosProfesor);
        }
  
        // Cargar el cronograma de la sección
        if (grupo.idSeccion) {
          const gruposSeccion = await getGruposBySeccion(grupo.idSeccion);
  
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
  
          const eventosSeccion = gruposSeccion.flatMap((grupo) => {
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
                backgroundColor: "#60a5fa",
              };
            });
          });
  
          setCronogramaSeccion(eventosSeccion);
        }
      } catch (error) {
        toast.error("Error al cargar los cronogramas iniciales.");
        console.error("Error al cargar cronogramas:", error.message);
      }
    };
  
    fetchInitialCronogramas();
  }, [grupo.idProfesor, grupo.idSeccion]);
  

  const handleProfesorChange = async (e) => {
    const idProfesor = e.target.value;
    setForm({ ...form, idProfesor, idCurso: "", dia1: "", dia2: "", horaInicio: "", horaFin: "" });

    if (!idProfesor) return;

    try {
      const profesor = await getProfesorById(idProfesor);
      setEspecialidad(profesor.especialidad);

      const gruposProfesor = await getGruposByProfesor(idProfesor);

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

      const eventosProfesor = gruposProfesor.flatMap((grupo) => {
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

      setCronogramaProfesor(eventosProfesor);
    } catch (error) {
      toast.error("Error al obtener el cronograma del profesor.");
      console.error(error.message);
    }
  };

  const handleSeccionChange = async (e) => {
    const idSeccion = e.target.value;
    setForm({ ...form, idSeccion, dia1: "", dia2: "", horaInicio: "", horaFin: "" });

    if (!idSeccion) return;

    try {
      const gruposSeccion = await getGruposBySeccion(idSeccion);

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

      const eventosSeccion = gruposSeccion.flatMap((grupo) => {
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
            backgroundColor: "#60a5fa",
          };
        });
      });

      setCronogramaSeccion(eventosSeccion);
    } catch (error) {
      toast.error("Error al obtener el cronograma de la sección.");
      console.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGrupoCurso(grupo.idGrupoCurso, form);
      toast.success("Grupo actualizado con éxito.");
      onSave();
    } catch (error) {
      toast.error("Error al actualizar el grupo.");
      console.error("Error al actualizar el grupo:", error.message);
    }
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

  const formStyle = {
    width: "100%",
    borderRadius: "8px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
  };

  const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Modificar Grupo</h2>
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
              slotMinTime="07:00:00"
              slotMaxTime="16:50:00"
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
              slotMinTime="07:00:00"
              slotMaxTime="16:50:00"
            />
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <label style={{ flex: 1 }}>
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
                setForm({ ...form, dia1, dia2 });
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

          <label style={{ flex: 1 }}>
            <p>Día 2:</p>
            <input type="text" name="dia2" value={form.dia2} readOnly style={inputStyle} />
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ flex: 1 }}>
            <p>Hora Inicio:</p>
            <select
              name="horaInicio"
              value={form.horaInicio}
              onChange={(e) => {
                const horaInicio = e.target.value;
                const [hora, minutos] = horaInicio.split(":").map(Number);
                const horaFin = new Date();
                horaFin.setHours(hora);
                horaFin.setMinutes(minutos + 110);
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

          <label style={{ flex: 1 }}>
            <p>Hora Fin:</p>
            <input type="text" name="horaFin" value={form.horaFin} readOnly style={inputStyle} />
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" style={buttonStyle}>
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModificarGrupo;
