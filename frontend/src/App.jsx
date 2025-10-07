import axios from 'axios'
import Login from './pages/Login'
import ProtectedRoute from './components/protectedRoute'
import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from './context/userContextProvider.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5500'
axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  // const location = useLocation()
  // const hideNavbar = location.pathname === "/login" || location.pathname === "/register"

  return (
    <div className="w-screen h-screen overflow-hidden">
      <UserContextProvider>
        {/* TODO: Import Navbar component */}
        {/* {!hideNavbar && <Navbar />} */}
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          {/* Ruta principal redirige a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Rutas login */}
          <Route path="/login" element={<Login />} />
          {/* Ruta de prueba temporal */}
          {/* Catch-all route para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </UserContextProvider>
    </div>
  )
}

export default App