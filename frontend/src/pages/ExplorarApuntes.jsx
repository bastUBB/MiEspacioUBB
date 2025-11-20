import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Filter, BookOpen, Star, Eye, Calendar, Tag } from 'lucide-react';
import Header from '../components/header';
import { obtenerApuntesMasValoradosService } from '../services/apunte.service';
import { parseCustomDate } from '../helpers/dateFormatter.helper';

function ExplorarApuntes() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apuntes, setApuntes] = useState([]);
  const [filteredApuntes, setFilteredApuntes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating'); // rating, downloads, recent

  const categories = [
    { id: 'all', name: 'Todos', color: 'purple' },
    { id: 'ingenieria', name: 'Ingeniería', color: 'blue' },
    { id: 'ciencias', name: 'Ciencias', color: 'green' },
    { id: 'humanidades', name: 'Humanidades', color: 'yellow' },
    { id: 'salud', name: 'Salud', color: 'red' }
  ];

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    const fetchApuntes = async () => {
      try {
        setLoading(true);
        const response = await obtenerApuntesMasValoradosService();
        
        if (response.status === 'Success' && response.data) {
          setApuntes(response.data);
          setFilteredApuntes(response.data);
        }
      } catch (error) {
        console.error('Error cargando apuntes:', error);
        toast.error('Error al cargar los apuntes');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApuntes();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...apuntes];

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(apunte => 
        apunte.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apunte.asignatura.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apunte.autorSubida.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apunte.etiquetas?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Ordenar
    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.valoracion?.promedioValoracion || 0) - (a.valoracion?.promedioValoracion || 0));
    } else if (sortBy === 'downloads') {
      filtered.sort((a, b) => (b.visualizaciones || 0) - (a.visualizaciones || 0));
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => parseCustomDate(b.fechaSubida) - parseCustomDate(a.fechaSubida));
    }

    setFilteredApuntes(filtered);
  }, [searchQuery, selectedCategory, sortBy, apuntes]);

  const handleHomeClick = () => navigate('/estudiante/home');
  const handleProfileClick = () => navigate('/estudiante/profile');
  const handleExplorarClick = () => {}; // Ya estamos aquí
  const handleMisApuntesClick = () => navigate('/estudiante/mis-apuntes');
  const handleEstadisticasClick = () => navigate('/estudiante/estadisticas');
  const handleConfigClick = () => navigate('/estudiante/configuracion');
  
  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('user');
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  };

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
        onLogout={handleLogout}
        onConfigClick={handleConfigClick}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explorar Apuntes</h1>
          <p className="text-gray-600">Descubre material académico compartido por la comunidad</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, asignatura, autor o etiquetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              <option value="rating">Mejor valorados</option>
              <option value="downloads">Más descargados</option>
              <option value="recent">Más recientes</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold">{filteredApuntes.length}</span> apuntes
          </p>
        </div>

        {/* Apuntes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApuntes.map((apunte) => (
            <div
              key={apunte._id}
              className="bg-gradient-to-br from-white to-purple-50/20 rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-105 cursor-pointer overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      {apunte.asignatura}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {apunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {apunte.nombre}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {apunte.descripcion || 'Sin descripción disponible'}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {apunte.etiquetas?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{apunte.visualizaciones || 0} vistas</span>
                  </div>
                  <span className="text-xs">Por {apunte.autorSubida}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApuntes.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron apuntes</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorarApuntes;
