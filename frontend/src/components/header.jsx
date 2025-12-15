import { useState, useRef, useEffect, useContext } from 'react';
import { Bell, User, BookOpen, BarChart3, FileText, Home, Compass, Check, LogOut, ChevronDown, MessageSquare, Star, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { NotificationContext } from '../context/NotificationContext';
import { toast } from 'react-hot-toast';
import logoMiEspacioUBB from '../assets/logo_miespacioubb.svg';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { notifications, unreadCount, markAsRead, clearAll } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showExplorarMenu, setShowExplorarMenu] = useState(false);
  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  const explorarMenuRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (explorarMenuRef.current && !explorarMenuRef.current.contains(event.target)) {
        setShowExplorarMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detectar la sección actual desde la URL para mantener navegación consistente
  // Esto permite que el admin navegue correctamente en secciones de otros roles
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.startsWith('/estudiante')) return 'estudiante';
    if (path.startsWith('/docente')) return 'docente';
    if (path.startsWith('/ayudante')) return 'ayudante';
    if (path.startsWith('/admin')) return 'admin';
    return user?.role || 'estudiante';
  };
  const currentSection = getCurrentSection();

  // Handlers de navegación usando la sección actual
  const handleHomeClick = () => navigate(`/${currentSection}/home`);
  const handleProfileClick = () => navigate(`/${currentSection}/profile`);
  const handleExplorarClick = () => {
    setShowExplorarMenu(false);
    navigate(`/${currentSection}/explorar`);
  };
  const handleMisAportesClick = () => navigate(`/${currentSection}/mis-aportes`);
  const handleEstadisticasClick = () => navigate(`/${currentSection}/estadisticas`);
  const handleEncuestasClick = () => {
    setShowExplorarMenu(false);
    navigate(`/${currentSection}/encuestas`);
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('user');
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Fecha desconocida';
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = Math.floor((ahora - date) / 1000);

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'Nuevo comentario':
      case 'Respuesta a comentario':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'Nueva valoración apunte':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'Nuevo Like':
        return <ThumbsUp className="w-5 h-5 text-green-500" />;
      case 'Nuevo Dislike':
        return <ThumbsDown className="w-5 h-5 text-red-500" />;
      case 'Nuevo reporte':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Reporte resuelto':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center pl-4">
            <img src={logoMiEspacioUBB} alt="MiEspacioUBB Logo" className="h-32 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleHomeClick}
              className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${currentSection}/home`)
                ? 'text-purple-600 font-semibold'
                : 'text-gray-600 hover:text-purple-600 font-medium'
                }`}
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>

            {/* Dropdown de Explorar */}
            <div className="relative" ref={explorarMenuRef}>
              <button
                onClick={() => setShowExplorarMenu(!showExplorarMenu)}
                className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${currentSection}/explorar`) || location.pathname.includes(`/${currentSection}/encuestas`)
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-600 hover:text-purple-600 font-medium'
                  }`}
              >
                <Compass className="w-4 h-4" />
                <span>Explorar</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showExplorarMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Submenu desplegable */}
              {showExplorarMenu && (
                <div className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[200px]">
                  <button
                    onClick={handleExplorarClick}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Apuntes</span>
                  </button>
                  <button
                    onClick={handleEncuestasClick}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600"
                  >
                    <Compass className="w-4 h-4" />
                    <span className="font-medium">Encuestas</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleMisAportesClick}
              className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${currentSection}/mis-aportes`)
                ? 'text-purple-600 font-semibold'
                : 'text-gray-600 hover:text-purple-600 font-medium'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Mis Aportes</span>
            </button>
            <button
              onClick={handleEstadisticasClick}
              className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${currentSection}/estadisticas`)
                ? 'text-purple-600 font-semibold'
                : 'text-gray-600 hover:text-purple-600 font-medium'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Estadísticas</span>
            </button>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-gray-800 font-bold text-lg">Notificaciones</h3>
                        {unreadCount > 0 && (
                          <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="text-xs font-medium text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[32rem] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium">Sin notificaciones</p>
                        <p className="text-gray-400 text-xs mt-1">Te avisaremos cuando haya actividad</p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notif, index) => (
                          <div
                            key={notif._id}
                            className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-50 ${index === notifications.length - 1 ? 'border-b-0' : ''
                              } ${!notif.estadoLeido ? 'bg-purple-50/30' : ''}`}
                            onClick={() => {
                              if (notif.apunteId) {
                                setShowNotifications(false);
                                navigate(`/${currentSection}/apunte/${notif.apunteId}`);
                              }
                              if (!notif.estadoLeido) {
                                markAsRead(notif._id);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className={`w-10 h-10 ${notif.apunteId ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600'} rounded-full flex items-center justify-center text-xl`}>
                                  {getNotificationIcon(notif.tipoNotificacion)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-gray-800 mb-0.5">
                                    {notif.tipoNotificacion}
                                  </p>
                                  {notif.apunteId && (
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">Ver apunte</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                  {notif.mensaje}
                                </p>
                                <p className="text-xs text-gray-400 mt-1.5">
                                  {formatFecha(notif.createdAt)}
                                </p>
                              </div>
                              {!notif.estadoLeido && (
                                <div className="flex-shrink-0 self-center">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user?.nombreCompleto?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                </div>
                <span className="hidden md:block font-medium max-w-[100px] truncate">
                  {user?.nombreCompleto?.split(' ')[0] || 'Usuario'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.nombreCompleto}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleProfileClick();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleMisAportesClick();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Mis Aportes
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;