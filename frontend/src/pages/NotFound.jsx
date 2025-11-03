import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContextProvider.jsx";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const handleGoHome = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Página No Encontrada
          </h2>
          <p className="text-gray-600 mb-2">
            La página que estás buscando no existe o fue movida.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Por favor verifica la URL e intenta nuevamente.
          </p>
          <div className="space-y-3">
            <button 
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
            >
              {user ? 'Ir al Inicio' : 'Ir al Login'}
            </button>
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
