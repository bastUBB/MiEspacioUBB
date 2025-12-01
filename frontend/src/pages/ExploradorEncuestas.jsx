import { useState, useEffect, useContext } from 'react';
import { Search, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { obtenerTodasEncuestasActivas, obtenerEncuestaPorId } from '../services/encuesta.service.js';
import { obtenerTodasMisNotificacionesService, actualizarEstadoLeidoService, borrarNotificacionesLeidasService } from '../services/notificacion.service';
import Header from '../components/header';
import TarjetaEncuesta from '../components/TarjetaEncuesta.jsx';
import toast from 'react-hot-toast';

// Datos de ejemplo (mock data) para visualización
const MOCK_ENCUESTAS = [
    {
        _id: 'mock1',
        nombreEncuesta: 'Encuesta de Satisfacción Académica 2024',
        descripcion: 'Ayúdanos a mejorar la calidad de la educación compartiendo tu experiencia académica en este semestre. Tu opinión es fundamental para implementar mejoras en los próximos períodos.',
        enlaceGoogleForm: 'https://forms.gle/ejemplo1',
        estado: 'Activo',
        visualizaciones: 245
    },
    {
        _id: 'mock2',
        nombreEncuesta: 'Evaluación de Infraestructura Campus',
        descripcion: 'Queremos conocer tu opinión sobre las instalaciones, espacios de estudio, laboratorios y áreas comunes del campus. Tus sugerencias servirán para futuras mejoras.',
        enlaceGoogleForm: 'https://forms.gle/ejemplo2',
        estado: 'Activo',
        visualizaciones: 189
    },
    {
        _id: 'mock3',
        nombreEncuesta: 'Feedback sobre Plataforma MiEspacioUBB',
        descripcion: 'Tu experiencia usando MiEspacioUBB es muy valiosa. Comparte tus comentarios sobre la plataforma, funcionalidades que te gustaría ver y mejoras que podríamos implementar.',
        enlaceGoogleForm: 'https://forms.gle/ejemplo3',
        estado: 'Activo',
        visualizaciones: 312
    }
];

const ExploradorEncuestas = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [encuestas, setEncuestas] = useState(MOCK_ENCUESTAS);
    const [encuestasFiltradas, setEncuestasFiltradas] = useState(MOCK_ENCUESTAS);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        cargarEncuestas();
    }, []);

    useEffect(() => {
        filtrarEncuestas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, encuestas]);

    // Cargar notificaciones
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.rut) return;

            try {
                const response = await obtenerTodasMisNotificacionesService(user.rut);
                if (response.status === 'Success' && response.data) {
                    const notifArray = Array.isArray(response.data) ? response.data : [];
                    setNotifications(notifArray);
                    setNotificationCount(notifArray.length);
                }
            } catch (error) {
                console.error('Error cargando notificaciones:', error);
            }
        };

        fetchNotifications();
    }, [user]);

    const cargarEncuestas = async () => {
        try {
            setLoading(true);
            const response = await obtenerTodasEncuestasActivas();
            const encuestasReales = response.data || [];
            // Si hay datos reales del backend, usarlos; de lo contrario, usar ejemplos
            const todasEncuestas = encuestasReales.length > 0 ? encuestasReales : MOCK_ENCUESTAS;
            setEncuestas(todasEncuestas);
            setEncuestasFiltradas(todasEncuestas);
        } catch (error) {
            console.error('Error al cargar encuestas:', error);
            // En caso de error, usar solo los datos de ejemplo
            setEncuestas(MOCK_ENCUESTAS);
            setEncuestasFiltradas(MOCK_ENCUESTAS);
        } finally {
            setLoading(false);
        }
    };

    const filtrarEncuestas = () => {
        if (!searchTerm.trim()) {
            setEncuestasFiltradas(encuestas);
            return;
        }

        const filtered = encuestas.filter(encuesta =>
            encuesta.nombreEncuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
            encuesta.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setEncuestasFiltradas(filtered);
    };

    const handleClickEncuesta = async (encuesta) => {
        try {
            // Solo incrementar si no es un mock
            if (!encuesta._id.startsWith('mock')) {
                await obtenerEncuestaPorId(encuesta._id);
            }
        } catch (error) {
            console.error('Error al registrar visualización:', error);
        }
    };

    // Handlers para el header
    const handleHomeClick = () => {
        const role = user?.rol || 'estudiante';
        navigate(`/${role}/home`);
    };

    const handleProfileClick = () => {
        const role = user?.rol || 'estudiante';
        navigate(`/${role}/profile`);
    };

    const handleExplorarClick = () => {
        const role = user?.rol || 'estudiante';
        navigate(`/${role}/explorar`);
    };

    const handleMisApuntesClick = () => {
        const role = user?.rol || 'estudiante';
        navigate(`/${role}/mis-apuntes`);
    };

    const handleEstadisticasClick = () => {
        const role = user?.rol || 'estudiante';
        navigate(`/${role}/estadisticas`);
    };

    const handleEncuestasClick = () => {
        const role = user?.rol || 'estudiante';
        navigate(`/${role}/encuestas`);
    };

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('user');
        toast.success('Sesión cerrada exitosamente');
        navigate('/login');
    };

    const handleNotificationClick = async (notification) => {
        try {
            await actualizarEstadoLeidoService(notification._id);
            setNotifications(prev => prev.filter(n => n._id !== notification._id));
            setNotificationCount(prev => Math.max(0, prev - 1));
            toast.success('Notificación marcada como leída');
        } catch (error) {
            console.error('Error al marcar notificación:', error);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await actualizarEstadoLeidoService(notificationId);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            setNotificationCount(prev => Math.max(0, prev - 1));
            toast.success('Notificación marcada como leída');
        } catch (error) {
            console.error('Error al marcar notificación:', error);
        }
    };

    const handleClearAll = async () => {
        if (!user?.rut) return;

        try {
            const markPromises = notifications.map(n => actualizarEstadoLeidoService(n._id));
            await Promise.all(markPromises);
            await borrarNotificacionesLeidasService(user.rut);
            setNotifications([]);
            setNotificationCount(0);
            toast.success('Todas las notificaciones han sido marcadas como leídas');
        } catch (error) {
            console.error('Error al limpiar notificaciones:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                notificationCount={notificationCount}
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
                onProfileClick={handleProfileClick}
                onHomeClick={handleHomeClick}
                onExplorarClick={handleExplorarClick}
                onMisApuntesClick={handleMisApuntesClick}
                onEstadisticasClick={handleEstadisticasClick}
                onEncuestasClick={handleEncuestasClick}
                onLogout={handleLogout}
            />

            <div className="bg-gradient-to-br from-purple-50 via-white to-violet-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header de página */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                            Explorar Encuestas
                        </h1>
                        <p className="text-gray-600">
                            Participa en encuestas y ayuda a mejorar nuestra comunidad
                        </p>
                    </div>

                    {/* Buscador */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar encuestas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Grid de encuestas */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : encuestasFiltradas.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm ? 'No se encontraron encuestas que coincidan con tu búsqueda' : 'No hay encuestas disponibles en este momento'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {encuestasFiltradas.map(encuesta => (
                                <div key={encuesta._id} onClick={() => handleClickEncuesta(encuesta)}>
                                    <TarjetaEncuesta encuesta={encuesta} isAdmin={false} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExploradorEncuestas;
