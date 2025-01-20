export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>Mi Proyecto</title>
        <meta name="description" content="Herramienta de comunicación para administradores y profesores" />
      </head>
      <body>
        {/* Aquí puedes añadir un diseño general */}
        <div className="container">
          {children} {/* Este es el contenido dinámico de cada página */}
        </div>
      </body>
    </html>
  );
}
