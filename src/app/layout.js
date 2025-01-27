//layout.js
import  "bootstrap/dist/css/bootstrap.min.css"
import AddBootstrap from "@/app/addBootstrap";
import AdminNavbar from "@/components/navbar";

export const metadata = {
  title: "EducationTEC",
  description: "Diseño de software verano 2024",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <AddBootstrap/>
        <AdminNavbar/>
        <div style={{ paddingLeft: "300px", width: "100%", marginTop: "20px" }}>
          {children}
        </div>
        </body>
    </html>
  );
}
