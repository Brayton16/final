"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const GroupStudentsPage = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState(null);
  const [userRole, setuserRole] = useState("user");
  const [selectedProfesor, setSelectedProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [currentProfesor, setCurrentProfesor] = useState(
    ""
  );

  const handleProfesorChange = (e) => {
    // setSelectedProfesor(e.target.value);
    const oldProfesor = currentProfesor;
    if (confirm("¿Está seguro de cambiar el profesor a cargo?")) {
      setSelectedProfesor(e.target.value);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        idGrupoCurso: group.idGrupoCurso,
        nuevoIdProfesor: e.target.value,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "http://localhost:3000/api/grupo-curso/grupos/actualizar-profesor",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          alert(result.message);
        })
        .catch((error) => {
          console.error(error)
          setSelectedProfesor(oldProfesor);
          alert("Error al actualizar el profesor a cargo");
        });
    }
  };

  useEffect(() => {
    // Fetch all profesores
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:3000/api/profesores", requestOptions)
      .then((response) => response.json())
      .then((result) => setProfesores(result))
      .catch((error) => console.error(error));


  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Obtener el grupo seleccionado desde el localStorage
      const selectedGroup = JSON.parse(localStorage.getItem("selectedGroup"));

      if (selectedGroup) {
        setGroup(selectedGroup);
        console.log(currentProfesor)

      

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
        router.push("/groups");
      }
    }
  }, [router]);

  return (
    <div className={styles.container}>
      {group ? (
        <>
          <h1 className={styles.title}>
            Lista de Estudiantes {group.group} - {group.materia}
          </h1>

          <div className={styles.profesorContainer}>
            <label htmlFor="profesorSelect">
              {userRole === "Admin"
                ? "Modificar profesor a cargo"
                : "Profesor a cargo"}
            </label>
            <select
              id="profesorSelect"
              value={selectedProfesor || currentProfesor?.id || ""}
              onChange={handleProfesorChange}
              disabled={userRole !== "Admin"}
              className={styles.select}
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map((profesor) => (
                <option key={profesor.id} value={profesor.id}>
                  {profesor.nombre} {profesor.apellido}
                </option>
              ))}
            </select>
          </div>

          <table className={styles.table}>
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

          <button
            className={styles.button}
            onClick={() => router.push("/groups")}
          >
            Volver a Grupos
          </button>
        </>
      ) : (
        <p>Cargando información del grupo...</p>
      )}
    </div>
  );
};

export default GroupStudentsPage;
