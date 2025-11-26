import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../components/header';
import WelcomeSection from '../components/seccionBienvenido';
import SearchSection from '../components/seccionBusqueda';
import RecommendationsSection from '../components/seccionRecomendacion';
import Sidebar from '../components/sidebar';
import FloatingActionButton from '../components/botonAccionFlotante';
import SubirApunteModal from '../components/SubirApunteModal';
import { obtenerApuntesMasValoradosService, obtenerApuntesMasVisualizadosService, obtenerAsignaturasConMasApuntesService } from '../services/apunte.service';
import { obtenerMisApuntesByRutService } from '../services/apunte.service';
import { obtenerTodasMisNotificacionesService, actualizarEstadoLeidoService, borrarNotificacionesLeidasService } from '../services/notificacion.service';
import { numeroApuntesUserService, obtenerMayoresContribuidoresService } from '../services/perfilAcademico.service';

function Home() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para datos del backend
  const [apuntes, setApuntes] = useState([]);
  const [loadingApuntes, setLoadingApuntes] = useState(true);
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
        setLoadingApuntes(true);
        const response = await obtenerApuntesMasValoradosService();

        if (response.status === 'Success' && response.data) {
          setApuntes(response.data);
        }
      } catch (error) {
        console.error('Error cargando apuntes más valorados:', error);
        toast.error('Error al cargar los apuntes');
      } finally {
        setLoadingApuntes(false);
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
        // Cargar datos en paralelo
        const [
          misApuntesResponse,
          numApuntesResponse
        ] = await Promise.allSettled([
          obtenerMisApuntesByRutService(user.rut),
          numeroApuntesUserService(user.rut)
        ]);

        if (!isMounted) return;

        // Procesar mis apuntes
        let misApuntesArray = [];
        if (misApuntesResponse.status === 'fulfilled' && misApuntesResponse.value?.status === 'Success') {
          misApuntesArray = Array.isArray(misApuntesResponse.value.data) ? misApuntesResponse.value.data : [];
        }

        // Obtener número de apuntes subidos (asegurarse que sea un número)
        let notesUploaded = 0;
        if (numApuntesResponse.status === 'fulfilled' && numApuntesResponse.value?.status === 'Success') {
          const data = numApuntesResponse.value.data;
          notesUploaded = typeof data === 'number' ? data : (typeof data === 'string' ? parseInt(data) : 0);
        }

        // Calcular estadísticas adicionales desde mis apuntes
        let totalRatings = 0;
        if (misApuntesArray.length > 0) {
          totalRatings = misApuntesArray.reduce(
            (sum, apunte) => sum + (apunte.valoracion?.cantidadValoraciones || 0),
            0
          );
        }

        // Actualizar estados (asegurándose que todos son números)
        setUserStats({
          notesUploaded: Number(notesUploaded) || 0,
          ratingsReceived: Number(totalRatings) || 0,
          reputation: Math.floor((Number(notesUploaded) || 0) * 50 + (Number(totalRatings) || 0) * 10)
        });

      } catch (error) {
        if (!isMounted) return;

        console.error('Error cargando estadísticas:', error);
        // Establecer valores por defecto en caso de error
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

          // Transformar datos para el componente Sidebar
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

          // Transformar datos para el componente Sidebar
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

          // Transformar datos para el componente Sidebar
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

        // Si hay error, limpiar estado
        setNotifications([]);
        setNotificationCount(0);

        console.error('Error cargando notificaciones:', error);
      }
    };

    if (user && user.rut) {
      fetchNotifications();

      // Recargar notificaciones cada 30 segundos
      interval = setInterval(fetchNotifications, 30000);
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [user]);

  // Transformar apuntes del backend al formato del frontend
  const transformApuntesForDisplay = (apuntesData) => {
    return apuntesData.map(apunte => ({
      id: apunte._id,
      title: apunte.nombre,
      author: apunte.autorSubida,
      subject: apunte.asignatura,
      rating: apunte.valoracion?.promedioValoracion || 0,
      downloads: apunte.visualizaciones || 0,
      preview: apunte.descripcion,
      tags: apunte.etiquetas || [],
      fullData: apunte // Guardar todos los datos para vista detallada
    }));
  };

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



  const handleHomeClick = () => {
    navigate('/estudiante/home');
  };

  const handleProfileClick = () => {
    navigate('/estudiante/profile');
  };

  const handleExplorarClick = () => {
    navigate('/estudiante/explorar');
  };

  const handleMisApuntesClick = () => {
    navigate('/estudiante/mis-apuntes');
  };

  const handleEstadisticasClick = () => {
    navigate('/estudiante/estadisticas');
  };

  const handleConfigClick = () => {
    navigate('/estudiante/configuracion');
  };

  const handleEncuestasClick = () => {
    navigate('/estudiante/encuestas');
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

  const handleNoteClick = (note) => {
    const apunteId = note.id || note._id;

    if (!apunteId) {
      toast.error('Error: ID de apunte no encontrado');
      return;
    }

    navigate(`/estudiante/apunte/${apunteId}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleApunteCreated = async () => {
    // Recargar apuntes más valorados después de crear uno nuevo
    try {
      const response = await obtenerApuntesMasValoradosService();
      if (response.status === 'Success' && response.data) {
        setApuntes(response.data);
      }

      // Recargar mis apuntes y estadísticas
      if (user?.rut) {
        // Note: misApuntes is not used elsewhere, so no need to set state
        await obtenerMisApuntesByRutService(user.rut);
      }
    } catch (error) {
      console.error('Error al recargar apuntes:', error);
      toast.error('Error al actualizar los apuntes');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Marcar como leída al hacer clic
    try {
      await actualizarEstadoLeidoService(notification._id);

      // Actualizar el estado local
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

      // Actualizar el estado local
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
      // Primero marcar todas como leídas
      const markPromises = notifications.map(n => actualizarEstadoLeidoService(n._id));
      await Promise.all(markPromises);

      // Luego borrar todas las leídas
      await borrarNotificacionesLeidasService(user.rut);

      // Actualizar el estado local
      setNotifications([]);
      setNotificationCount(0);

      toast.success('Todas las notificaciones han sido marcadas como leídas');
    } catch (error) {
      console.error('Error al limpiar notificaciones:', error);
      toast.error('Error al limpiar las notificaciones');
    }
  };

  // Mostrar loading mientras carga
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Vista principal del dashboard
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
        onConfigClick={handleConfigClick}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <WelcomeSection
              userName={user?.nombreCompleto || 'Usuario'}
            />
            <SearchSection />

            {loadingApuntes ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <RecommendationsSection
                notes={transformApuntesForDisplay(apuntes)}
                onNoteClick={handleNoteClick}
              />
            )}
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

      <FloatingActionButton onClick={handleUploadClick} />

      {/* Modal para subir apuntes */}
      <SubirApunteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onApunteCreated={handleApunteCreated}
      />
    </div>
  );
}

export default Home;
