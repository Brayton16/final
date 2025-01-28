"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListarSecciones from "./listar";
const SeccionIndividual = ({ cursoGroup }) => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [selectedProfesor, setSelectedProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [currentProfesor, setCurrentProfesor] = useState(cursoGroup.idProfesor);
  const [group, setGroup] = useState(null);
  const [seccionView, setSeccionView] = useState(null);
  const styles = {
    container: {
      padding: "2rem",
      fontFamily: "'Arial', sans-serif",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "1rem",
    },
    profesorContainer: {
      marginBottom: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    select: {
      padding: "0.5rem",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "5px",
      backgroundColor: "#fff",
      cursor: "pointer",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "2rem",
    },
    th: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#e9ecef",
      borderBottom: "2px solid #ccc",
      fontWeight: "bold",
    },
    td: {
      textAlign: "left",
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: "0.5rem 1rem",
      cursor: "pointer",
      fontSize: "1rem",
      marginTop: "1.5rem",
    },
  };




  useEffect(() => {
    if (typeof window !== "undefined") {
      // Obtener el grupo seleccionado desde el localStorage
      const selectedGroup = {
        id: cursoGroup.idSeccion,
        idGrupoCurso: cursoGroup.idGrupoCurso,
        idProfesor: cursoGroup.idProfesor,
        materia: cursoGroup.curso.nombre,
      };

      if (selectedGroup) {
        setGroup(selectedGroup);
        console.log(currentProfesor);

        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        fetch(
            `http://localhost:3000/api/profesores/${selectedGroup.idProfesor}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => setCurrentProfesor(result))
            .catch((error) => console.error(error));

        fetch(
          "http://localhost:3000/api/seccion/" + selectedGroup.id,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            setStudents(result);
          })
          .catch((error) => console.error(error));
      } else {
        // Redirigir a la página de grupos si no hay información del grupo
        router.push("/profesor/secciones");
      }
    }
  }, [router]);

  const handleView = () => {
    setSeccionView(true);
  };

    if (seccionView) {
    return (
      <ListarSecciones />
    );} 

  return (
    <div style={styles.container}>
      {group ? (
        <>
          <h1 style={styles.title}>
            Lista de Estudiantes {group.group} - {group.materia}
          </h1>

          <div style={styles.profesorContainer}>
            <label htmlFor="profesorSelect">Profesor a cargo</label>
            <input type="text" value={currentProfesor.nombre +  " " + currentProfesor.apellido} readOnly disabled /> 
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.nombre}</td>
                  <td>{student.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button style={styles.button} onClick={() => handleView()}>
            Volver a Grupos
          </button>
        </>
      ) : (
        <p>Cargando información del grupo...</p>
      )}
    </div>
  );
};

export default SeccionIndividual;
