"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getEncargados, deleteEncargado } from "@/services/encargadosService";
import EditarEncargado from "./modificar";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
export default function ListarEncargados() {
  const [encargados, setEncargados] = useState([]);
  const [encargadoAEditar, setEncargadoAEditar] = useState(null);

  const fetchEncargados = async () => {
    try {
      const data = await getEncargados();
      setEncargados(data);
    } catch (error) {
      toast.error("Error al cargar la lista de encargados.");
      console.error("Error al obtener encargados:", error.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteEncargado(id);
        setEncargados(encargados.filter((encargado) => encargado.id !== id));
        toast.success("Encargado eliminado con éxito");
      } catch (error) {
        toast.error("Error al eliminar el encargado.");
        console.error("Error al eliminar el encargado:", error.message);
      }
    }
  };

  const handleEdit = (encargado) => {
    setEncargadoAEditar(encargado); // Carga los datos en el formulario de edición
  };

  const handleSave = () => {
    setEncargadoAEditar(null); // Vuelve a la lista
    fetchEncargados(); // Refresca la lista
  };

  useEffect(() => {
    fetchEncargados();
  }, []);

  if (encargadoAEditar) {
    return (
      <EditarEncargado
        encargado={encargadoAEditar}
        onCancel={() => setEncargadoAEditar(null)}
        onSave={handleSave}
      />
    );
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#f8f9fa",
  };

  const tdStyle = {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Lista de Encargados</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Teléfono</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {encargados.map((encargado) => (
            <tr key={encargado.id}>
              <td style={tdStyle}>{encargado.nombre} {encargado.apellido}</td>
              <td style={tdStyle}>{encargado.correo}</td>
              <td style={tdStyle}>{encargado.telefono}</td>
              <td style={tdStyle}>
                <button
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginRight: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEdit(encargado)}
                    >
                      <FaPencilAlt color="#007bff" />
                    </button>
                    <button
                      style={{
                        backgroundColor: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(encargado.id)}
                    >
                      <FaTrash color="#dc3545" />
                    </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
