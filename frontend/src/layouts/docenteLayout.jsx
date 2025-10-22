import { Outlet } from 'react-router-dom';

export default function DocenteLayout() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
