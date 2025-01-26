"use client";
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const GroupsPage = () => {
  const router = useRouter();
  const [profesor, setProfesor] = useState("3zbMujHDpJWAqoYc6RqO");
  // Dummy data for testing
  const [groups, setGroups] = useState([]);
  const [groupsTable, setGroupsTable] = useState([]);
  const [userRole, setuserRole] = useState("user");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/api/grupo-curso/grupos/" + profesor, requestOptions)
      .then((response) => response.json())
      .then((result) => { 
        console.log(result)
        const groupsTable = []
        result.forEach((group) => {
          groupsTable.push({
            materia: group.curso.nombre,
            id: group.idSeccion,
            group: group.secciones.nivel + " - " + group.secciones.grupo,
            idGrupoCurso: group.idGrupoCurso,
            idProfesor: group.idProfesor

          });
        });
        setGroups(result);
        setGroupsTable(groupsTable);
        console.log(groupsTable);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Validate if localStorage is available
    if (typeof window !== 'undefined' && !localStorage.getItem('groups')) {
      localStorage.setItem('groups', JSON.stringify(groups));
    }
  }, [groups]);

  const handleViewGroup = (group) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedGroup', JSON.stringify(group));
      router.push(`/groups/list`); // Replace with your desired route
    }
  };

  return (
    <div className={styles.container}>
      <h1  className= {styles.title}>{userRole === "Admin" ? "Listado de Grupos" : "Grupos Asignados"}</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Grupo</th>
            <th>Materia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groupsTable.map((group) => (
            <tr key={group.id}>
              <td>{group.group}</td>
              <td>{group.materia}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => handleViewGroup(group)}
                >
                  Ver Información
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupsPage;