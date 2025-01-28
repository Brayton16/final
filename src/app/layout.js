import "bootstrap/dist/css/bootstrap.min.css";
import AddBootstrap from "@/app/addBootstrap";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "EducationTEC",
  description: "Diseño de software verano 2024",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AddBootstrap /> {/* Bootstrap adicional si es necesario */}
        <ToastContainer position="top-right" autoClose={3000} />
        <main>
          {children} {/* Aquí se renderizan las páginas fuera de /admin */}
        </main>
      </body>
    </html>
  );
}
