"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../../../services/firebase";
import { getGruposByProfesor } from "@/services/grupoCursoService";
import { getEntregasByProfesor } from "@/services/entregasService";
import AdminNavbar from "@/components/navbar";
import useCheckPermissions from "@/hooks/useCheckPermissions";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AdminDashboard() {
  useCheckPermissions(["profesor"]);
  const router = useRouter();

  const [user, setUser] = useState(null);


  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });
  

  useEffect(() => {
    
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
  }, []);



  const fetchStudentData = async () => {
    /* const data = {
      "Sección A": 30,
      "Sección B": 25,
      "Sección C": 28,
      "Sección D": 20,
    }; */
    if (!user || !user.uid) return;

    const results = await getGruposByProfesor(user.uid);
    console.log("results", results);
    const data = {};
    results.forEach(result => {
      const seccion = result.secciones.nivel + " - " + result.secciones.grupo || "";
      const listaEstudiantes = result.secciones.listaEstudiantes || [];
      const cantidadEstudiantes = listaEstudiantes.length;
      data[seccion] = cantidadEstudiantes;

    });


      // Datos para los gráficos
        const chartData = {
          labels: Object.keys(data),
          datasets: [{
            label: "Número de estudiantes",
            data: Object.values(data),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          }],
        };
        setChartData(chartData);
        console.log("chartData", chartData);

  };

  const fetchEntregasData = async () => {
    // Datos para los gráficos
    /* const chartData = {
      labels: Object.keys(data),
      datasets: [{
        label: "Número de estudiantes",
        data: Object.values(data),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      }],
    }; */
    
    // Pie: Son el porcentaje de entregas con condiciones, las cuales son Excelente, Bueno, Regular, Malo
    // Labels: Excelente, Bueno, Regular, Malo
    // Data: Cantidad de entregas con cada condición
    
    // Bar: Son las entregas que tiene cada asignación
    // Labels: Títulos de las asignaciones
    // Data: Cantidad de entregas por asignación
    const response = await getEntregasByProfesor(user.uid);
    console.log("response", response);
    const dataBar = {};
    const dataPie = {
      "Excelente": 0,
      "Bueno": 0,
      "Regular": 0,
      "Malo": 0,
    };
    response.forEach(asignacion => {
      const titulo = asignacion.titulo;
      asignacion.entregas.forEach(entrega => {
        const estado = entrega.estado;
        dataPie[estado]++;
      });
      dataBar[titulo] = asignacion.entregas.length;
    }
    )

    const pieChartData = {
      labels: Object.keys(dataPie),
      datasets: [{
        label: "Estado de las entregas",
        data: Object.values(dataPie),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF5733"],
      }],
    };
    setPieChartData(pieChartData);

    const barChartData = {
      labels: Object.keys(dataBar),
      datasets: [{
        label: "Número de entregas",
        data: Object.values(dataBar),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      }],
    };

    setBarChartData(barChartData);

  };

  useEffect(() => {
    if (user) {
      fetchStudentData();
      fetchEntregasData();
    }
  }, [user]);


  if (!chartData.labels.length || !pieChartData.labels.length || !barChartData.labels.length) { 
    return <div>Cargando...</div>;
  }
  

  return (
    <div>
      <h1>Profesor Dashboard</h1>
     
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "2rem" }}>
        <div style={{ flex: "1 1 45%", maxWidth: "800px", minWidth: "300px" }}>
          <h2>Estudiantes por Sección</h2>
          <Bar data={chartData} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "2rem"}}>
        <div style={{ flex: "1 1 45%", maxWidth: "600px", minWidth: "300px" }}>
          <h2>Distribución de Calificaciones</h2>
          <Pie data={pieChartData} />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "2rem" }}>
        <div style={{ flex: "1 1 45%", maxWidth: "800px", minWidth: "300px" }}>
          <h2>Entregas por Asignación</h2>
          <Bar data={barChartData} />
        </div>
      </div>
        
    </div>
  );
}
  