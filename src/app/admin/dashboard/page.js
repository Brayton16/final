"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useCheckPermissions from "@/hooks/useCheckPermissions";
import { getCantidadProfesoresPorEspecialidad } from "@/services/profesoresService";
import { getCantidadEstudiantesPorSeccion } from "@/services/seccionesService";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  useCheckPermissions(["admin"]);
  const router = useRouter();

  const [profesoresPorEspecialidad, setProfesoresPorEspecialidad] = useState({});
  const [estudiantesPorSeccion, setEstudiantesPorSeccion] = useState({});

  useEffect(() => {
    fetchProfesoresPorEspecialidad();
    fetchEstudiantesPorSeccion();
  }, []);

  // Obtener cantidad de profesores por especialidad
  const fetchProfesoresPorEspecialidad = async () => {
    try {
      const response = await getCantidadProfesoresPorEspecialidad();
      const { success, data } = response;

      if (success) {
        const especialidades = data.reduce((acc, item) => {
          acc[item.especialidad] = item.cantidad;
          return acc;
        }, {});
        setProfesoresPorEspecialidad(especialidades);
      }
    } catch (error) {
      console.error("Error obteniendo datos de profesores:", error);
    }
  };

  // Obtener cantidad de estudiantes por sección
  const fetchEstudiantesPorSeccion = async () => {
    try {
      const response = await getCantidadEstudiantesPorSeccion();
      const { success, data } = response;

      if (success) {
        const secciones = data.reduce((acc, item) => {
          acc[item.seccion] = item.cantidad;
          return acc;
        }, {});
        setEstudiantesPorSeccion(secciones);
      }
    } catch (error) {
      console.error("Error obteniendo datos de estudiantes:", error);
    }
  };

  if (
    !Object.keys(profesoresPorEspecialidad).length ||
    !Object.keys(estudiantesPorSeccion).length
  ) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Gráfico: Profesores por Especialidad */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "2rem" }}>
      <div style={{ flex: "1 1 45%", maxWidth: "800px", minWidth: "300px" }}>
        <h2>Profesores por Especialidad</h2>
        <Bar
          data={{
            labels: Object.keys(profesoresPorEspecialidad),
            datasets: [
              {
                label: "Cantidad de Profesores",
                data: Object.values(profesoresPorEspecialidad),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Profesores por Especialidad" },
            },
          }}
        />
      </div>
      </div>

      {/* 🆕 Gráfico: Estudiantes por Sección */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "2rem" }}>
      <div style={{ flex: "1 1 45%", maxWidth: "800px", minWidth: "300px", marginTop: "30px" }}>
        <h2>Estudiantes por Sección</h2>
        <Bar
          data={{
            labels: Object.keys(estudiantesPorSeccion),
            datasets: [
              {
                label: "Cantidad de Estudiantes",
                data: Object.values(estudiantesPorSeccion),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: "Estudiantes por Sección" },
            },
          }}
        />
      </div>
      </div>
    </div>
  );
}