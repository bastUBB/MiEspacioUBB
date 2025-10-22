import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
