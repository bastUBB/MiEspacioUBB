import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FileText, Star, Eye, Download, Edit2, Trash2, Filter, Calendar } from 'lucide-react';
import Header from '../components/header';
import { obtenerMisApuntesByRutService } from '../services/apunte.service';
import { parseCustomDate, formatDateToLocal } from '../helpers/dateFormatter.helper';

function MisApuntes() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [apuntes, setApuntes] = useState([]);
  const [filteredApuntes, setFilteredApuntes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    const fetchMisApuntes = async () => {
      if (!user?.rut) return;

      try {
        setLoading(true);
        const response = await obtenerMisApuntesByRutService(user.rut);
        
        if (response.status === 'Success' && response.data) {
          setApuntes(response.data);
          setFilteredApuntes(response.data);
        }
      } catch (error) {
        console.error('Error cargando mis apuntes:', error);
        toast.error('Error al cargar tus apuntes');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMisApuntes();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...apuntes];

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apunte => 
        filterStatus === 'active' ? apunte.estado === 'Activo' : apunte.estado !== 'Activo'
      );
    }

    // Ordenar
    if (sortBy === 'recent') {
      filtered.sort((a, b) => parseCustomDate(b.fechaSubida) - parseCustomDate(a.fechaSubida));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.valoracion?.promedioValoracion || 0) - (a.valoracion?.promedioValoracion || 0));
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => (b.visualizaciones || 0) - (a.visualizaciones || 0));
    }

    setFilteredApuntes(filtered);
  }, [filterStatus, sortBy, apuntes]);

  const handleHomeClick = () => navigate('/estudiante/home');
  const handleProfileClick = () => navigate('/estudiante/profile');
  const handleExplorarClick = () => navigate('/estudiante/explorar');
  const handleMisApuntesClick = () => {}; // Ya estamos aquí
  const handleEstadisticasClick = () => navigate('/estudiante/estadisticas');

  const getTotalStats = () => {
    const total = apuntes.length;
    const totalViews = apuntes.reduce((sum, a) => sum + (a.visualizaciones || 0), 0);
    const totalDownloads = apuntes.reduce((sum, a) => sum + (a.descargas || 0), 0);
    const avgRating = apuntes.length > 0 
      ? apuntes.reduce((sum, a) => sum + (a.valoracion?.promedioValoracion || 0), 0) / apuntes.length 
      : 0;

    return { total, totalViews, totalDownloads, avgRating };
  };

  const stats = getTotalStats();

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        notificationCount={0}
        notifications={[]}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onExplorarClick={handleExplorarClick}
        onMisApuntesClick={handleMisApuntesClick}
        onEstadisticasClick={handleEstadisticasClick}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Apuntes</h1>
          <p className="text-gray-600">Gestiona y revisa todos tus apuntes compartidos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Apuntes</p>
                <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
              </div>
              <FileText className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Visualizaciones</p>
                <p className="text-3xl font-bold text-violet-600">{stats.totalViews}</p>
              </div>
              <Eye className="w-12 h-12 text-violet-600 opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Descargas</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalDownloads}</p>
              </div>
              <Download className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Valoración Promedio</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'active'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'inactive'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inactivos
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="rating">Mejor valorados</option>
              <option value="views">Más vistos</option>
            </select>
          </div>
        </div>

        {/* Apuntes List */}
        <div className="space-y-4">
          {filteredApuntes.map((apunte) => (
            <div
              key={apunte._id}
              className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{apunte.nombre}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apunte.estado === 'Activo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {apunte.estado}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{apunte.descripcion}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{apunte.asignatura}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateToLocal(apunte.fechaSubida)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{apunte.visualizaciones || 0} vistas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{apunte.descargas || 0} descargas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{apunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApuntes.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes apuntes</h3>
            <p className="text-gray-500 mb-4">Comienza a compartir tu conocimiento con la comunidad</p>
            <button
              onClick={() => navigate('/estudiante/home')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Subir mi primer apunte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MisApuntes;
