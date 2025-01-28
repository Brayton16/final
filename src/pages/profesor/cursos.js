// src/pages/profesor/cursos.js
import React, { useEffect, useState } from "react";
import { getCursos } from "../../services/cursosService";

const CursosProfesor = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await getCursos();
        setCursos(data);
      } catch (error) {
        setError("Hubo un problema al cargar los cursos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) return <p>Cargando cursos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Cursos Asignados</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow bg-white"
          >
            <h2 className="text-xl font-bold mb-2">{curso.nombre}</h2>
            <p className="text-gray-700">{curso.descripcion}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => alert(`Ver detalles de ${curso.nombre}`)}
            >
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CursosProfesor;
