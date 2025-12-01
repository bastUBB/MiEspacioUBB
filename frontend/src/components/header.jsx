import { useState, useRef, useEffect, useContext } from 'react';
import { Bell, User, BookOpen, BarChart3, FileText, Home, Compass, Check, LogOut, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { toast } from 'react-hot-toast';
import logoMiEspacioUBB from '../assets/logo_miespacioubb.svg';

const Header = ({ notificationCount = 0, notifications = [], onNotificationClick, onMarkAsRead, onClearAll }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
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

  // Handlers de navegación
  const role = user?.rol || 'estudiante';

  const handleHomeClick = () => navigate(`/${role}/home`);
  const handleProfileClick = () => navigate(`/${role}/profile`);
  const handleExplorarClick = () => {
    setShowExplorarMenu(false);
    navigate(`/${role}/explorar`);
  };
  const handleMisAportesClick = () => navigate(`/${role}/mis-aportes`);
  const handleEstadisticasClick = () => navigate(`/${role}/estadisticas`);
  const handleEncuestasClick = () => {
    setShowExplorarMenu(false);
    navigate(`/${role}/encuestas`);
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
        return '💬';
      case 'Nueva valoración apunte':
        return '⭐';
      case 'Nuevo Like':
        return '👍';
      case 'Nuevo Dislike':
        return '👎';
      case 'Nuevo reporte':
        return '🚨';
      case 'Reporte resuelto':
        return '✅';
      default:
        return '🔔';
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
              className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${role}/home`)
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
                className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${role}/explorar`) || location.pathname.includes(`/${role}/encuestas`)
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
              className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${role}/mis-aportes`)
                ? 'text-purple-600 font-semibold'
                : 'text-gray-600 hover:text-purple-600 font-medium'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Mis Aportes</span>
            </button>
            <button
              onClick={handleEstadisticasClick}
              className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname.includes(`/${role}/estadisticas`)
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
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-4 py-3 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notificaciones</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearAll}
                        className="text-white hover:bg-white/20 rounded px-2 py-1 text-xs transition-colors"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No tienes notificaciones nuevas</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() => onNotificationClick && onNotificationClick(notif)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 text-2xl">
                                {getNotificationIcon(notif.tipoNotificacion)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                  {notif.tipoNotificacion}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notif.mensaje}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatFecha(notif.createdAt)}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead && onMarkAsRead(notif._id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-100 rounded-full transition-all"
                                  title="Marcar como leída"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="transition-transform hover:scale-110"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center cursor-pointer">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              {/* Dropdown de perfil */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleProfileClick();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Mi Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 hover:text-red-700 border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
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