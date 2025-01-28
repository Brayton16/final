import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "@/components/navbar"; // Navbar exclusivo del admin

export const metadata = {
  title: "Admin Dashboard",
  description: "Panel administrativo",
};

export default function AdminLayout({ children }) {
  return (
      <div>
        <AdminNavbar /> {/* Navbar exclusivo para administradores */}
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
