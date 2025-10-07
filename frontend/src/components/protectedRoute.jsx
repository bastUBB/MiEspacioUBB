import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContextProvider } from "../context/userContextProvider.jsx";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(UserContextProvider);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    // Si terminó de cargar y no hay usuario, redirigir al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}