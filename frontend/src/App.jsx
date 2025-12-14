import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import NotFound from './pages/NotFound.jsx'
import Bienvenida from './pages/Bienvenida.jsx'
import ProtectedRoute from './components/protectedRoute'
import RedireccionRol from './components/redireccionRol.jsx'

// Layouts por rol
import EstudianteLayout from './layouts/estudianteLayout.jsx'
import AdminLayout from './layouts/adminLayout.jsx'
import DocenteLayout from './layouts/docenteLayout.jsx'
import AyudanteLayout from './layouts/ayudanteLayout.jsx'
import GeneralLayout from './layouts/generalLayout.jsx'

// Páginas
import InicioPerfilAcademicoEstudiante from './pages/estudiante/perfilAcademicoEstudiante.jsx'
import InicioPerfilAcademicoDocente from './pages/docente/perfilAcademicoDocente.jsx'
import InicioPerfilAcademicoAyudante from './pages/ayudante/perfilAcademicoAyudante.jsx'

import Home from './pages/estudiante/HomeEstudiante.jsx'
import HomeAdmin from './pages/admin/HomeAdmin.jsx'
import HomeDocente from './pages/docente/HomeDocente.jsx'
import HomeAyudante from './pages/ayudante/HomeAyudante.jsx'

import Profile from './pages/Profile.jsx'
import GestionUsuarios from './pages/admin/GestionUsuarios.jsx'
import GestionApuntes from './pages/admin/GestionApuntes.jsx'
import GestionAsignaturas from './pages/admin/GestionAsignaturas.jsx'
import GestionReportes from './pages/admin/GestionReportes.jsx'
import EstadisticasAdmin from './pages/admin/EstadisticasAdmin.jsx'
import ExplorarApuntes from './pages/ExplorarApuntes.jsx'
import MisAportes from './pages/MisAportes.jsx'
import MisApuntes from './pages/MisApuntes.jsx'
import Estadisticas from './pages/Estadisticas.jsx'
import DetalleApunte from './pages/DetalleApunte.jsx'
import ExploradorEncuestas from './pages/ExploradorEncuestas.jsx'
import MisEncuestas from './pages/admin/MisEncuestas.jsx'

import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from './context/userContextProvider.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { RoleProtectedRoute, UnauthorizedPage } from './components/roleProtectedRoute.jsx'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_BASE_URL;
// console.log("API URL:", API_URL);
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
    <div className="w-screen h-screen overflow-y-auto">
      <UserContextProvider>
        <SocketProvider>
          {!hideNavbar}
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RedireccionRol />
              </ProtectedRoute>
            } />

            {/* Redirigir raíz al dashboard (maneja autenticación y rol) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Página de bienvenida (todos los roles autenticados) */}
            <Route path="/bienvenida" element={
              <ProtectedRoute>
                <Bienvenida />
              </ProtectedRoute>
            } />

            {/* Rutas admin*/}
            <Route path="/admin" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleProtectedRoute>
            }>
              <Route index element={<HomeAdmin />} />
              <Route path="home" element={<HomeAdmin />} />
              <Route path="encuestas" element={<MisEncuestas />} />
              <Route path="usuarios" element={<GestionUsuarios />} />
              <Route path="apuntes" element={<GestionApuntes />} />
              <Route path="asignaturas" element={<GestionAsignaturas />} />
              <Route path="reportes" element={<GestionReportes />} />
              <Route path="estadisticas" element={<EstadisticasAdmin />} />
            </Route>

            {/* Rutas docente*/}
            <Route path="/docente" element={
              <RoleProtectedRoute allowedRoles={['docente', 'admin']}>
                <DocenteLayout />
              </RoleProtectedRoute>
            }>
              <Route index element={<InicioPerfilAcademicoDocente />} />
              <Route path="perfil-academico" element={<InicioPerfilAcademicoDocente />} />
              <Route path="home" element={<HomeDocente />} />
              <Route path="profile" element={<Profile />} />
              <Route path="explorar" element={<ExplorarApuntes />} />
              <Route path="mis-aportes" element={<MisApuntes />} />
              <Route path="estadisticas" element={<Estadisticas />} />
              <Route path="encuestas" element={<ExploradorEncuestas />} />
              <Route path="apunte/:id" element={<DetalleApunte />} />
            </Route>

            {/* Rutas ayudante*/}
            <Route path="/ayudante" element={
              <RoleProtectedRoute allowedRoles={['ayudante', 'admin']}>
                <AyudanteLayout />
              </RoleProtectedRoute>
            }>
              <Route index element={<InicioPerfilAcademicoAyudante />} />
              <Route path="perfil-academico" element={<InicioPerfilAcademicoAyudante />} />
              <Route path="home" element={<HomeAyudante />} />
              <Route path="profile" element={<Profile />} />
              <Route path="explorar" element={<ExplorarApuntes />} />
              <Route path="mis-aportes" element={<MisApuntes />} />
              <Route path="estadisticas" element={<Estadisticas />} />
              <Route path="encuestas" element={<ExploradorEncuestas />} />
              <Route path="apunte/:id" element={<DetalleApunte />} />
            </Route>

            {/* Rutas estudiante*/}
            <Route path="/estudiante" element={
              <RoleProtectedRoute allowedRoles={['estudiante', 'admin']}>
                <EstudianteLayout />
              </RoleProtectedRoute>
            }>
              <Route index element={<InicioPerfilAcademicoEstudiante />} />
              <Route path="perfil-academico" element={<InicioPerfilAcademicoEstudiante />} />
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="explorar" element={<ExplorarApuntes />} />
              <Route path="mis-aportes" element={<MisAportes />} />
              <Route path="estadisticas" element={<Estadisticas />} />
              <Route path="encuestas" element={<ExploradorEncuestas />} />
              <Route path="apunte/:id" element={<DetalleApunte />} />
            </Route>

            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </UserContextProvider>
    </div>
  )
}

export default App