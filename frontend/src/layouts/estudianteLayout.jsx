import { Outlet } from 'react-router-dom';

export default function EstudianteLayout() {
  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{
        background: 'linear-gradient(to bottom, #e6e5e5ff, #ffffff 30%)'
      }}>
      <Outlet />
    </div>
  );
}




