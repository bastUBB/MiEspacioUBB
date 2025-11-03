import { Outlet } from 'react-router-dom';

export default function AyudanteLayout() {
  return (
    <div className="w-full h-full bg-gray-120 overflow-y-auto">
      <Outlet />
    </div>
  );
}
