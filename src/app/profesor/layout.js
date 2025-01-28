import "bootstrap/dist/css/bootstrap.min.css";
import ProfesorNavbar from "@/components/profesorNavbar"; // Navbar exclusivo del admin

export const metadata = {
  title: "Admin Dashboard",
  description: "Panel administrativo",
};

export default function AdminLayout({ children }) {
  return (
      <div>
        <ProfesorNavbar /> {/* Navbar exclusivo para administradores */}
        <div
          style={{
            paddingLeft: "180px", // Espacio para el sidebar, si es necesario
            marginTop: "20px",
          }}
        >
          {children} {/* Aquí se renderizan las páginas bajo /admin */}
        </div>
      </div>
  );
}
