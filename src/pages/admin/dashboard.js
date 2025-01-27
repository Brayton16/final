import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/"); // Redirige al login si no hay sesión
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <button onClick={() => router.push("/admin/profesores")}>Profesores</button>
        <button onClick={() => router.push("/admin/encargados")}>Encargados</button>
        <button onClick={() => router.push("/admin/estudiantes")}>Estudiantes</button>
        <button onClick={() => router.push("/admin/grupos")}>Grupos</button>
        <button onClick={() => router.push("/admin/cursos")}>Cursos</button>
        <button onClick={() => router.push("/profesor/cursos")}>Cursos(Vista Profesor)</button>
      </div>
    </div>
  );
}
