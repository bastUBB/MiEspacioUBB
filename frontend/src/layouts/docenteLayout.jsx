import { Outlet } from 'react-router-dom';

export default function DocenteLayout() {
  return (
    <div className="page-container">
      {/* Fondo fijo con color sólido */}
      <div className="fixed-background bg-gray-120" />

      {/* Contenido con scroll */}
      <div className="page-content overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
