import { useState, useRef, useEffect } from 'react';
import { User, Home, LogOut, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminHeader = ({ onProfileClick, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleHomeClick = () => {
        navigate('/admin/home');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                MiEspacioUBB
                            </span>
                            <span className="text-xs text-gray-500 font-medium">Panel de Administración</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-8">
                        <button
                            onClick={handleHomeClick}
                            className={`flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer ${location.pathname === '/admin/home'
                                ? 'text-blue-600 font-semibold'
                                : 'text-gray-600 hover:text-blue-600 font-medium'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            <span>Inicio</span>
                        </button>
                    </nav>

                    {/* User Profile */}
                    <div className="flex items-center">
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="transition-transform hover:scale-110"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </button>

                            {/* Dropdown de perfil */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            onProfileClick && onProfileClick();
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-blue-600"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">Mi Perfil</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            onLogout && onLogout();
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

export default AdminHeader;
