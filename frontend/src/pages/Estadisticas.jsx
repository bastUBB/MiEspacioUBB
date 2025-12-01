import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BarChart3, TrendingUp, Award, FileText, Star, Download, Eye, Calendar, Users } from 'lucide-react';
import Header from '../components/header';
import { obtenerMayoresContribuidoresService } from '../services/perfilAcademico.service';
import { obtenerMisApuntesByRutService } from '../services/apunte.service';
import { formatDateToLocal } from '../helpers/dateFormatter.helper';

function Estadisticas() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApuntes: 0,
    totalVisualizaciones: 0,
    totalDescargas: 0,
    promedioValoracion: 0,
    mejorApunte: null,
    apuntesPorMes: []
  });
  const [topContributors, setTopContributors] = useState([]);
  const [misApuntes, setMisApuntes] = useState([]);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      if (!user?.rut) return;

      try {
        setLoading(true);

        // Obtener mis apuntes
        const apuntesResponse = await obtenerMisApuntesByRutService(user.rut);

        if (apuntesResponse.status === 'Success' && apuntesResponse.data) {
          const apuntes = apuntesResponse.data;
          setMisApuntes(apuntes);

          // Calcular estadísticas
          const totalVisualizaciones = apuntes.reduce((sum, a) => sum + (a.visualizaciones || 0), 0);
          const totalDescargas = apuntes.reduce((sum, a) => sum + (a.descargas || 0), 0);
          const promedioValoracion = apuntes.length > 0
            ? apuntes.reduce((sum, a) => sum + (a.valoracion?.promedioValoracion || 0), 0) / apuntes.length
            : 0;

          const mejorApunte = apuntes.length > 0
            ? apuntes.reduce((best, current) =>
              (current.valoracion?.promedioValoracion || 0) > (best.valoracion?.promedioValoracion || 0)
                ? current
                : best
            )
            : null;

          setStats({
            totalApuntes: apuntes.length,
            totalVisualizaciones,
            totalDescargas,
            promedioValoracion,
            mejorApunte
          });
        }

        // Obtener top contribuidores
        const contributorsResponse = await obtenerMayoresContribuidoresService();
        if (contributorsResponse.status === 'Success' && contributorsResponse.data) {
          setTopContributors(contributorsResponse.data);
        }

      } catch (error) {
        console.error('Error cargando estadísticas:', error);
        toast.error('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEstadisticas();
    }
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
          </div>
          <p className="text-gray-600">Analiza tu rendimiento y contribución a la comunidad</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-12 h-12 text-purple-600 opacity-20" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Apuntes Subidos</p>
            <p className="text-4xl font-bold text-purple-600">{stats.totalApuntes}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-12 h-12 text-violet-600 opacity-20" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Visualizaciones</p>
            <p className="text-4xl font-bold text-violet-600">{stats.totalVisualizaciones}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Download className="w-12 h-12 text-indigo-600 opacity-20" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Descargas</p>
            <p className="text-4xl font-bold text-indigo-600">{stats.totalDescargas}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-12 h-12 text-yellow-600 opacity-20" />
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Valoración Promedio</p>
            <p className="text-4xl font-bold text-yellow-600">{stats.promedioValoracion.toFixed(1)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mejor Apunte */}
          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Tu Mejor Apunte
            </h2>

            {stats.mejorApunte ? (
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{stats.mejorApunte.nombre}</h3>
                <p className="text-sm text-gray-600 mb-3">{stats.mejorApunte.descripcion}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-600">
                      {stats.mejorApunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}
                      ({stats.mejorApunte.valoracion?.cantidadValoraciones || 0} votos)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-violet-600" />
                    <span className="text-gray-600">{stats.mejorApunte.visualizaciones || 0} vistas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-600">{stats.mejorApunte.descargas || 0} descargas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">
                      {formatDateToLocal(stats.mejorApunte.fechaSubida)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aún no tienes apuntes subidos</p>
            )}
          </div>

          {/* Top Contribuidores */}
          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Ranking de Contribuidores
            </h2>

            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl ${contributor.nombreCompleto === user?.nombreCompleto
                    ? 'bg-purple-100 border-2 border-purple-300'
                    : 'bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-purple-100 text-purple-600'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {contributor.nombreCompleto}
                        {contributor.nombreCompleto === user?.nombreCompleto && (
                          <span className="ml-2 text-xs text-purple-600">(Tú)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{contributor.apuntesSubidos} apuntes</p>
                    </div>
                  </div>

                  {index < 3 && (
                    <Award className={`w-6 h-6 ${index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                        'text-orange-500'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Tus Apuntes Recientes
          </h2>

          <div className="space-y-3">
            {misApuntes.slice(0, 5).map((apunte) => (
              <div key={apunte._id} className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{apunte.nombre}</h3>
                  <p className="text-sm text-gray-500">{apunte.asignatura}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{apunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{apunte.visualizaciones || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{apunte.descargas || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;
