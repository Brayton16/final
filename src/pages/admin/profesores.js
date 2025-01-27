import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getProfesores} from "../../services/profesoresService";
import RegistrarProfesor from "./profesores/registrar";
import ModificarProfesor from "./profesores/modificar";

export default function ProfesoresPage() {
  const router = useRouter();

  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar los profesores
  const fetchProfesores = async () => {
    try {
      const data = await getProfesores();
      setProfesores(data);
    } catch (error) {
      setError("Hubo un problema al cargar los profesores.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar la lista al montar el componente
  useEffect(() => {
    fetchProfesores();
  }, []);

  if (loading) return <p>Cargando profesores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Volver al Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Gestión de Profesores</h1>
      <p className="mb-4">Esta página está dedicada a la gestión de profesores.</p>

      {/* Componentes para registrar y modificar */}
      <RegistrarProfesor onRefresh={fetchProfesores} />
      <ModificarProfesor onRefresh={fetchProfesores} />

      {/* Lista de profesores */}
      <h2 className="text-xl font-semibold mt-6">Lista de Profesores</h2>
      <ul className="mt-4">
        {profesores.map((profesor) => (
          <li
            key={profesor.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{`${profesor.nombre} ${profesor.apellido}`}</span>

            <button
              onClick={() => router.push(`/admin/profesores/asignar/${profesor.id}`)}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Asignar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
