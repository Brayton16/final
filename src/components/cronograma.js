"use client";

import React from "react";

const Cronograma = ({ horarios }) => {
  // Estructura de días y horas
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const horas = Array.from({ length: 12 }, (_, i) => `${7 + i}:00`);

  // Función para verificar si un horario está ocupado
  const esHorarioOcupado = (dia, hora) => {
    return horarios.some(
      (horario) =>
        horario.dia === dia &&
        horario.horaInicio <= hora &&
        horario.horaFin > hora
    );
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  };

  const thStyle = {
    padding: "8px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    textAlign: "center",
    fontWeight: "bold",
  };

  const tdStyle = {
    padding: "8px",
    border: "1px solid #ddd",
    textAlign: "center",
  };

  const ocupadoStyle = {
    ...tdStyle,
    backgroundColor: "#ffcccc",
    color: "#cc0000",
    fontWeight: "bold",
  };

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Cronograma de Disponibilidad
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Horas</th>
            {dias.map((dia) => (
              <th key={dia} style={thStyle}>
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora) => (
            <tr key={hora}>
              <td style={thStyle}>{hora}</td>
              {dias.map((dia) => (
                <td
                  key={`${dia}-${hora}`}
                  style={
                    esHorarioOcupado(dia, hora) ? ocupadoStyle : tdStyle
                  }
                >
                  {esHorarioOcupado(dia, hora) ? "Ocupado" : "Disponible"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cronograma;
