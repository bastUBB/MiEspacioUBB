import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContextProvider.jsx";

export function RoleProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/unauthorized" 
}) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  
  if (!user) return <Navigate to="/login" replace />;

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  const hasAccess = rolesArray.includes(user.role);

  if (!hasAccess) return <Navigate to={redirectTo} replace />;

  return children;
}

export function UnauthorizedPage() {
  const { user } = useContext(UserContext);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-2">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Tu rol actual: <span className="font-semibold text-purple-600">{user?.role}</span>
          </p>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleProtectedRoute;
