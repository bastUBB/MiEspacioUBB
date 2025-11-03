import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/protectedRoute'
import RedireccionRol from './components/redireccionRol.jsx'

// Layouts por rol
import EstudianteLayout from './layouts/estudianteLayout.jsx'
import AdminLayout from './layouts/adminLayout.jsx'
import DocenteLayout from './layouts/docenteLayout.jsx'
import AyudanteLayout from './layouts/ayudanteLayout.jsx'

// Páginas
import InicioPerfilAcademicoEstudiante from './pages/estudiante/perfilAcademicoEstudiante.jsx'
import SubirApunteForm from './pages/subirApunteForm.jsx'

import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from './context/userContextProvider.jsx'
import { RoleProtectedRoute, UnauthorizedPage } from './components/roleProtectedRoute.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5500' //Aqui deberia ir la ip + el puerto de Apache
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
      if (error.response?.data?.message?.includes('Token') ||
        error.response?.data?.message?.includes('inválido') ||
        error.response?.data?.message?.includes('expirado')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const location = useLocation()
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register"

  return (
    <div className="w-screen h-screen overflow-hidden">
      <UserContextProvider>
        {!hideNavbar}
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route path="/" element={
            <ProtectedRoute>
              <RedireccionRol />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleProtectedRoute>
          }>
            <Route index element={<div>Home Admin - Crear tu página aquí</div>} />
            {/* Agrega más rutas del admin aquí */}
          </Route>


          <Route path="/docente" element={
            <RoleProtectedRoute allowedRoles={['docente', 'admin']}>
              <DocenteLayout />
            </RoleProtectedRoute>
          }>
            <Route index element={<div>Home Docente - Crear tu página aquí</div>} />
          </Route>

          <Route path="/ayudante" element={
            <RoleProtectedRoute allowedRoles={['ayudante', 'admin']}>
              <AyudanteLayout />
            </RoleProtectedRoute>
          }>
            <Route index element={<div>Home Ayudante - Crear tu página aquí</div>} />
          </Route>

          <Route path="/estudiante" element={
            <RoleProtectedRoute allowedRoles={['estudiante', 'admin']}>
              <EstudianteLayout />
            </RoleProtectedRoute>
          }>
            <Route index element={<InicioPerfilAcademicoEstudiante />} />
            <Route path="perfil-academico" element={<InicioPerfilAcademicoEstudiante />} />
            <Route path="subir-apunte" element={<SubirApunteForm />} />
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContextProvider>
    </div>
  )
}

export default App