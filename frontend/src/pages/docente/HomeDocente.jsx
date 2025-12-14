import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../../components/header';
import WelcomeSection from '../../components/seccionBienvenido';
import HomeStatistics from '../../components/HomeStatistics';
import Sidebar from '../../components/sidebar';
import FloatingActionButton from '../../components/botonAccionFlotante';
import SubirApunteModal from '../../components/SubirApunteModal';
import SubirEncuestaModal from '../../components/SubirEncuestaModal';
import { obtenerApuntesMasValoradosService, obtenerApuntesMasVisualizadosService, obtenerAsignaturasConMasApuntesService } from '../../services/apunte.service';
import { obtenerMisApuntesByRutService } from '../../services/apunte.service';
import { obtenerTodasMisNotificacionesService, actualizarEstadoLeidoService, borrarNotificacionesLeidasService } from '../../services/notificacion.service';
import { numeroApuntesUserService, obtenerMayoresContribuidoresService } from '../../services/perfilAcademico.service';

function HomeDocente() {
    const { user, loading: userLoading } = useContext(UserContext);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEncuestaModalOpen, setIsEncuestaModalOpen] = useState(false);

    // Estados para datos del backend
    const [apuntes, setApuntes] = useState([]);

    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [userStats, setUserStats] = useState({
        notesUploaded: 0,
        ratingsReceived: 0,
        reputation: 0
    });
    const [topContributors, setTopContributors] = useState([]);
    const [topMostViewedNotes, setTopMostViewedNotes] = useState([]);
    const [topSubjects, setTopSubjects] = useState([]);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    // Cargar apuntes más valorados
    useEffect(() => {
        const fetchApuntes = async () => {
            try {
                const response = await obtenerApuntesMasValoradosService();

                if (response.status === 'Success' && response.data) {
                    setApuntes(response.data);
                }
            } catch (error) {
                console.error('Error cargando apuntes más valorados:', error);
                toast.error('Error al cargar los apuntes');
            }
        };

        if (user) {
            fetchApuntes();
        }
    }, [user]);

    // Cargar estadísticas del perfil académico
    useEffect(() => {
        let isMounted = true;

        const fetchEstadisticas = async () => {
            if (!user?.rut) {
                return;
            }

            try {
                const [
                    misApuntesResponse,
                    numApuntesResponse
                ] = await Promise.allSettled([
                    obtenerMisApuntesByRutService(user.rut),
                    numeroApuntesUserService(user.rut)
                ]);

                if (!isMounted) return;

                let misApuntesArray = [];
                if (misApuntesResponse.status === 'fulfilled' && misApuntesResponse.value?.status === 'Success') {
                    misApuntesArray = Array.isArray(misApuntesResponse.value.data) ? misApuntesResponse.value.data : [];
                }

                let notesUploaded = 0;
                if (numApuntesResponse.status === 'fulfilled' && numApuntesResponse.value?.status === 'Success') {
                    const data = numApuntesResponse.value.data;
                    notesUploaded = typeof data === 'number' ? data : (typeof data === 'string' ? parseInt(data) : 0);
                }

                let totalRatings = 0;
                if (misApuntesArray.length > 0) {
                    totalRatings = misApuntesArray.reduce(
                        (sum, apunte) => sum + (apunte.valoracion?.cantidadValoraciones || 0),
                        0
                    );
                }

                setUserStats({
                    notesUploaded: Number(notesUploaded) || 0,
                    ratingsReceived: Number(totalRatings) || 0,
                    reputation: Math.floor((Number(notesUploaded) || 0) * 50 + (Number(totalRatings) || 0) * 10)
                });

            } catch (error) {
                if (!isMounted) return;

                console.error('Error cargando estadísticas:', error);
                setUserStats({
                    notesUploaded: 0,
                    ratingsReceived: 0,
                    reputation: 0
                });
            }
        };

        if (user && user.rut) {
            fetchEstadisticas();
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Cargar top contribuidores
    useEffect(() => {
        let isMounted = true;

        const fetchContribuidores = async () => {
            try {
                const response = await obtenerMayoresContribuidoresService();

                if (!isMounted) return;

                if (response.status === 'Success' && response.data) {
                    const contribuidoresArray = Array.isArray(response.data) ? response.data : [];

                    const contribuidoresTransformados = contribuidoresArray.map(contrib => ({
                        name: contrib.nombreCompleto,
                        contributions: contrib.apuntesSubidos
                    }));

                    setTopContributors(contribuidoresTransformados);
                } else {
                    setTopContributors([]);
                }
            } catch (error) {
                if (!isMounted) return;

                console.error('Error cargando contribuidores:', error);
                setTopContributors([]);
            }
        };

        if (user) {
            fetchContribuidores();
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Cargar apuntes más visualizados
    useEffect(() => {
        let isMounted = true;

        const fetchApuntesMasVisualizados = async () => {
            try {
                const response = await obtenerApuntesMasVisualizadosService();

                if (!isMounted) return;

                if (response.status === 'Success' && response.data) {
                    const apuntesArray = Array.isArray(response.data) ? response.data : [];

                    const apuntesTransformados = apuntesArray.map(apunte => ({
                        title: apunte.nombre,
                        author: apunte.autorSubida,
                        subject: apunte.asignatura,
                        views: apunte.visualizaciones
                    }));

                    setTopMostViewedNotes(apuntesTransformados);
                } else {
                    setTopMostViewedNotes([]);
                }
            } catch (error) {
                if (!isMounted) return;

                console.error('Error cargando apuntes más visualizados:', error);
                setTopMostViewedNotes([]);
            }
        };

        if (user) {
            fetchApuntesMasVisualizados();
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Cargar asignaturas con más apuntes
    useEffect(() => {
        let isMounted = true;

        const fetchAsignaturasConMasApuntes = async () => {
            try {
                const response = await obtenerAsignaturasConMasApuntesService();

                if (!isMounted) return;

                if (response.status === 'Success' && response.data) {
                    const asignaturasArray = Array.isArray(response.data) ? response.data : [];

                    const asignaturasTransformadas = asignaturasArray.map(asignatura => ({
                        name: asignatura._id,
                        count: asignatura.totalApuntes
                    }));

                    setTopSubjects(asignaturasTransformadas);
                } else {
                    setTopSubjects([]);
                }
            } catch (error) {
                if (!isMounted) return;

                console.error('Error cargando asignaturas con más apuntes:', error);
                setTopSubjects([]);
            }
        };

        if (user) {
            fetchAsignaturasConMasApuntes();
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Cargar notificaciones
    useEffect(() => {
        let isMounted = true;
        let interval;

        const fetchNotifications = async () => {
            if (!user?.rut) {
                return;
            }

            try {
                const response = await obtenerTodasMisNotificacionesService(user.rut);

                if (!isMounted) return;

                if (response.status === 'Success' && response.data) {
                    const notifArray = Array.isArray(response.data) ? response.data : [];
                    setNotifications(notifArray);
                    setNotificationCount(notifArray.length);
                } else {
                    setNotifications([]);
                    setNotificationCount(0);
                }
            } catch (error) {
                if (!isMounted) return;

                setNotifications([]);
                setNotificationCount(0);

                console.error('Error cargando notificaciones:', error);
            }
        };

        if (user && user.rut) {
            fetchNotifications();

            interval = setInterval(fetchNotifications, 30000);
        }

        return () => {
            isMounted = false;
            if (interval) clearInterval(interval);
        };
    }, [user]);

    // Obtener top apuntes por valoración
    const getTopApuntes = () => {
        const sortedApuntes = [...apuntes].sort((a, b) => {
            const ratingA = a.valoracion?.promedioValoracion || 0;
            const ratingB = b.valoracion?.promedioValoracion || 0;
            return ratingB - ratingA;
        });

        return sortedApuntes.slice(0, 3).map(apunte => ({
            title: apunte.nombre,
            rating: apunte.valoracion?.promedioValoracion || 0,
            author: apunte.autorSubida
        }));
    };

    // Navegación específica para Docente
    const handleHomeClick = () => {
        navigate('/docente/home');
    };

    const handleProfileClick = () => {
        navigate('/docente/profile');
    };

    const handleExplorarClick = () => {
        navigate('/docente/explorar');
    };

    const handleMisApuntesClick = () => {
        navigate('/docente/mis-aportes');
    };

    const handleEstadisticasClick = () => {
        navigate('/docente/estadisticas');
    };

    const handleConfigClick = () => {
        navigate('/docente/configuracion');
    };

    const handleEncuestasClick = () => {
        navigate('/docente/encuestas');
    };

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('user');
        toast.success('Sesión cerrada exitosamente');
        navigate('/login');
    };

    const handleUploadClick = () => {
        setIsModalOpen(true);
    };

    const handleCreateSurveyClick = () => {
        setIsEncuestaModalOpen(true);
    };



    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleEncuestaModalClose = () => {
        setIsEncuestaModalOpen(false);
    };

    const handleApunteCreated = async () => {
        try {
            const response = await obtenerApuntesMasValoradosService();
            if (response.status === 'Success' && response.data) {
                setApuntes(response.data);
            }

            if (user?.rut) {
                await obtenerMisApuntesByRutService(user.rut);
            }
        } catch (error) {
            console.error('Error al recargar apuntes:', error);
            toast.error('Error al actualizar los apuntes');
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            await actualizarEstadoLeidoService(notification._id);

            setNotifications(prev => prev.filter(n => n._id !== notification._id));
            setNotificationCount(prev => Math.max(0, prev - 1));

            toast.success('Notificación marcada como leída');
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            toast.error('Error al marcar la notificación');
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await actualizarEstadoLeidoService(notificationId);

            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            setNotificationCount(prev => Math.max(0, prev - 1));

            toast.success('Notificación marcada como leída');
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            toast.error('Error al marcar la notificación');
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
            toast.error('Error al limpiar las notificaciones');
        }
    };

    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
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
                onConfigClick={handleConfigClick}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <WelcomeSection
                            userName={user?.nombreCompleto || 'Docente'}
                        />
                        <HomeStatistics />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar
                            userStats={userStats}
                            topContributors={topContributors}
                            topNotes={getTopApuntes()}
                            topMostViewedNotes={topMostViewedNotes}
                            topSubjects={topSubjects}
                        />
                    </div>
                </div>
            </div>

            <FloatingActionButton
                onUploadClick={handleUploadClick}
                onCreateSurveyClick={handleCreateSurveyClick}
            />

            <SubirApunteModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onApunteCreated={handleApunteCreated}
            />

            <SubirEncuestaModal
                isOpen={isEncuestaModalOpen}
                onClose={handleEncuestaModalClose}
                onEncuestaCreated={() => { }}
            />
        </div>
    );
}

export default HomeDocente;
