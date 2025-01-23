"use client";
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const GroupsPage = () => {
  const router = useRouter();
  const [profesor, setProfesor] = useState("3zbMujHDpJWAqoYc6RqO");
  // Dummy data for testing
  const [groups, setGroups] = useState([
    { id: 1, name: 'Grupo A', subject: 'Matemáticas' },
    { id: 2, name: 'Grupo B', subject: 'Física' },
    { id: 3, name: 'Grupo C', subject: 'Química' },
  ]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://localhost:3000/api/seccion", requestOptions)
      .then((response) => response.json())
      .then((result) => { 
        console.log(result)
      

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
      <h1  className= {styles.title}>Grupos Asignados</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Materia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>{group.id}</td>
              <td>{group.name}</td>
              <td>{group.subject}</td>
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