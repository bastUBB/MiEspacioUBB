import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../../components/header';
import WelcomeSection from '../../components/seccionBienvenido';
import HomeStatistics from '../../components/HomeStatistics';
import GeneradorRecomendaciones from '../../components/GeneradorRecomendaciones';
import Sidebar from '../../components/sidebar';
import FloatingActionButton from '../../components/botonAccionFlotante';
import SubirApunteModal from '../../components/SubirApunteModal';
import SubirEncuestaModal from '../../components/SubirEncuestaModal';
import { obtenerApuntesMasValoradosService, obtenerApuntesMasVisualizadosService, obtenerAsignaturasConMasApuntesService } from '../../services/apunte.service';
import { obtenerMisApuntesByRutService } from '../../services/apunte.service';
import { numeroApuntesUserService, obtenerMayoresContribuidoresService } from '../../services/perfilAcademico.service';

function Home() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEncuestaModalOpen, setIsEncuestaModalOpen] = useState(false);

  // Estados para datos del backend
  const [apuntes, setApuntes] = useState([]);

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

  const handleUploadClick = () => {
    setIsModalOpen(true);
  };

  const handleCreateSurveyClick = () => {
    setIsEncuestaModalOpen(true);
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

  const handleEncuestaModalClose = () => {
    setIsEncuestaModalOpen(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <WelcomeSection
              userName={user?.nombreCompleto || 'Usuario'}
            />
            <HomeStatistics />

            <GeneradorRecomendaciones onNoteClick={handleNoteClick} />
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

      {/* Modal para subir apuntes */}
      <SubirApunteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onApunteCreated={handleApunteCreated}
      />

      {/* Modal para crear encuestas */}
      <SubirEncuestaModal
        isOpen={isEncuestaModalOpen}
        onClose={handleEncuestaModalClose}
        onEncuestaCreated={() => {
          // Opcional: Recargar algo si es necesario
        }}
      />
    </div>
  );
}

export default Home;
