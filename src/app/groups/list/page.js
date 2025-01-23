"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const GroupStudentsPage = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Obtener el grupo seleccionado desde el localStorage
      const selectedGroup = JSON.parse(localStorage.getItem("selectedGroup"));

      if (selectedGroup) {
        setGroup(selectedGroup);

        // Datos de prueba de estudiantes asociados al grupo
        const dummyStudents = [
          { id: 1, name: "Juan Pérez", age: 20 },
          { id: 2, name: "María López", age: 19 },
          { id: 3, name: "Carlos Ramírez", age: 21 },
          { id: 4, name: "Ana García", age: 20 },
        ];
        setStudents(dummyStudents);
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
            Lista de Estudiantes - {group.name} ({group.subject})
          </h1>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Edad</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
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
