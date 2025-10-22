import { Outlet } from 'react-router-dom';

export default function EstudianteLayout() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
