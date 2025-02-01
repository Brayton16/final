"use client";

import { useState, useEffect } from "react";
import { obtenerAsignacionesByGrupo } from "@/services/asignacionesService";
import { getEntregasByEstudiante } from "@/services/entregasService";
import { getCursoById } from "@/services/cursosService";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

export default function VerNotasEstudiante({ estudiante, grupo, onCancel }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [curso, setCurso] = useState(null);
  const [notas, setNotas] = useState([]);
  const [detallesVisibles, setDetallesVisibles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const asignacionesData = await obtenerAsignacionesByGrupo(grupo.idGrupoCurso);
        const entregasData = await getEntregasByEstudiante(estudiante.id, grupo.idGrupoCurso);
        const cursoData = await getCursoById(grupo.idCurso);

        setAsignaciones(asignacionesData);
        setEntregas(entregasData);
        setCurso(cursoData);

        calcularNotas(asignacionesData, entregasData, cursoData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [estudiante.id, grupo.idGrupoCurso]);

  
  const calcularNotas = (asignaciones, entregas, curso) => {
    if (!curso) return;

    const tiposAsignacion = [
      { key: "tareas", nombre: "Tarea" },
      { key: "proyecto", nombre: "Proyecto" },
      { key: "examen", nombre: "Examen" },
      { key: "asistencia", nombre: "Asistencia" }
    ];

    const resultados = tiposAsignacion.map(({ key, nombre }) => {
      const porcentaje = curso[key] || 0;
      const asignacionesTipo = asignaciones.filter((a) => a.tipo === nombre);
      const entregasTipo = entregas.filter((e) => asignacionesTipo.some((a) => a.id === e.idAsignacion));

      let obtenido = 0;

      if (asignacionesTipo.length > 0) {
        const calificaciones = asignacionesTipo.map((asignacion) => {
          const entrega = entregasTipo.find((e) => e.idAsignacion === asignacion.id);
          return entrega ? entrega.calificacion : 0;
        });

        const sumaCalificaciones = calificaciones.reduce((sum, val) => sum + val, 0);
        const promedio = sumaCalificaciones / asignacionesTipo.length;

        obtenido = (promedio * porcentaje) / 100;
      }

      return { 
        tipo: nombre, 
        obtenido, 
        total: porcentaje, 
        asignaciones: asignacionesTipo, 
        entregas: entregasTipo 
      };
    });

    setNotas(resultados);
};


  const calcularNotaFinal = () => {
    return notas.reduce((sum, nota) => sum + nota.obtenido, 0).toFixed(2);
  };

  const toggleDetalle = (tipo) => {
    setDetallesVisibles((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>{estudiante.estudianteNombre}</h2>
        <h3 style={notaFinalStyle}>{calcularNotaFinal()} / 100</h3>
      </div>

      {notas.map((nota) => (
        <div key={nota.tipo} style={notaItemContainerStyle}>
            {/* Fila principal con la barra y el icono */}
            <div style={notaItemStyle}>
            <span style={{ flex: 1 }}>{nota.tipo}</span>
            <div style={progressBarStyle}></div>
            <span style={{ flex: 1, textAlign: "right" }}>{nota.obtenido.toFixed(1)} / {nota.total}</span>
            <button style={iconButtonStyle} onClick={() => toggleDetalle(nota.tipo)}>
                {detallesVisibles[nota.tipo] ? <FaMinusCircle color="#007bff" /> : <FaPlusCircle color="#007bff" />}
            </button>
            </div>

            {/* Contenedor de detalles que aparece debajo */}
            {detallesVisibles[nota.tipo] && (
            <div style={detalleContainerStyle}>
                {nota.asignaciones.length > 0 ? (
                nota.asignaciones.map((asignacion) => {
                    const entrega = nota.entregas.find((e) => e.idAsignacion === asignacion.id);
                    return (
                    <div key={asignacion.id} style={detalleItemStyle}>
                        <strong>{asignacion.titulo}:</strong> {entrega ? `${entrega.calificacion}/100` : "No entregado"}
                    </div>
                    );
                })
                ) : (
                <p style={detalleItemStyle}>No hay asignaciones de este tipo.</p>
                )}
            </div>
            )}
        </div>
        ))}

        <hr style={hrStyle}/>
      <h2 style={notaFinalTituloStyle}>
        <strong>Nota final</strong>
        <br />
        <span style={{ fontSize: "1.5rem", color: "#007bff" }}>{Math.round(calcularNotaFinal())} / 100</span>
      </h2>

      <button onClick={onCancel} style={buttonStyle}>
        Volver
      </button>
    </div>
  );
}

const notaItemContainerStyle = {
    display: "flex",
    flexDirection: "column", // Hace que el detalle aparezca abajo
    marginBottom: "1rem",
    width: "100%",
  };
  
  const notaItemStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    position: "relative",
  };
  
  const progressBarStyle = {
    flex: 12,
    borderBottom: "3px solid #007bff",
  };
  
  const iconButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginLeft: "10px",
  };
  
  const detalleContainerStyle = {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: "0.5rem",
    borderRadius: "5px",
    marginTop: "0.3rem",
    borderLeft: "4px solid #007bff",
    borderRight: "4px solid rgb(255, 0, 0)",
    paddingLeft: "10px",
  };
  
  const detalleItemStyle = {
    padding: "0.3rem 0",
  };
  

const notaFinalStyle = {
  color: "#555",
};


const notaTotalStyle = {
  textAlign: "right",
  marginTop: "1rem",
  color: "#555",
};

const notaFinalTituloStyle = {
    display: "flex",
    justifyContent: "space-between",
  textAlign: "center",
  marginTop: "1rem",
  color: "#000",
};

const containerStyle = {
  padding: "2rem",
  margin: "auto",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const hrStyle = {
    border: "3px solid #007bff", // Grosor y color de la línea
    margin: "1rem 0", // Espaciado superior e inferior
    width: "100%", // Que ocupe todo el ancho
};
  

const headerStyle = {
  textAlign: "center",
  marginBottom: "1rem",
  display: "flex",
  justifyContent: "space-between",
};

const scoreStyle = {
  color: "#555",
};

const notaRowStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "0.5rem",
  width: "100%",
};

const notaTextStyle = {
  flex: 1,
};

const notaLineStyle = {
  flex: 12,
  borderBottom: "2px solid #007bff",
};

const notaValueStyle = {
  flex: 1,
  textAlign: "right",
};

const iconStyle = {
  marginLeft: "10px",
  cursor: "pointer",
  color: "#007bff",
};


const finalScoreContainer = {
  textAlign: "right",
  marginTop: "1rem",
  justifyContent: "space-between",
  display: "flex",
  color: "#000",
};

const finalScoreStyle = {
  fontSize: "1.5rem",
  color: "#007bff",
};

const buttonStyle = {
  width: "100%",
  marginTop: "1rem",
  padding: "10px",
  backgroundColor: "#007bff",
  color: "#fff",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
};

