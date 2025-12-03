import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { TrendingUp, Award, FileText, Star, Download, Eye, Calendar, Trophy } from 'lucide-react';
import { obtenerMisApuntesByRutService, obtenerMejorApunteUserService } from '../services/apunte.service';
import { formatDateToLocal } from '../helpers/dateFormatter.helper';
import { toast } from 'react-hot-toast';

function HomeStatistics() {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalApuntes: 0,
        totalVisualizaciones: 0,
        totalDescargas: 0,
        promedioValoracion: 0,
        reputacion: 0,
        mejorApunte: null
    });
    const [misApuntes, setMisApuntes] = useState([]);

    useEffect(() => {
        const fetchEstadisticas = async () => {
            if (!user?.rut) return;

            try {
                setLoading(true);

                // Obtener mis apuntes
                const apuntesResponse = await obtenerMisApuntesByRutService(user.rut);
                let apuntes = [];

                if (apuntesResponse.status === 'Success' && apuntesResponse.data) {
                    apuntes = apuntesResponse.data;
                    setMisApuntes(apuntes);
                }

                // Obtener mejor apunte
                let mejorApunte = null;
                try {
                    const mejorApunteResponse = await obtenerMejorApunteUserService(user.rut);
                    if (mejorApunteResponse.status === 'Success') {
                        mejorApunte = mejorApunteResponse.data;
                    }
                } catch (error) {
                    console.error('Error obteniendo mejor apunte:', error);
                }

                // Calcular estadísticas
                const totalVisualizaciones = apuntes.reduce((sum, a) => sum + (a.visualizaciones || 0), 0);
                const totalDescargas = apuntes.reduce((sum, a) => sum + (a.descargas || 0), 0);
                const totalValoraciones = apuntes.reduce((sum, a) => sum + (a.valoracion?.cantidadValoraciones || 0), 0);

                const promedioValoracion = apuntes.length > 0
                    ? apuntes.reduce((sum, a) => sum + (a.valoracion?.promedioValoracion || 0), 0) / apuntes.length
                    : 0;

                // Calcular reputación: (Apuntes * 50) + (Valoraciones * 10)
                const reputacion = (apuntes.length * 50) + (totalValoraciones * 10);

                setStats({
                    totalApuntes: apuntes.length,
                    totalVisualizaciones,
                    totalDescargas,
                    promedioValoracion,
                    reputacion,
                    mejorApunte
                });

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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mb-8">

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-white to-green-50/50 rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="w-8 h-8 text-green-200" />
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Apuntes
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApuntes}</p>
                    <p className="text-xs text-gray-500">Subidos</p>
                </div>

                <div className="bg-gradient-to-br from-white to-violet-50/50 rounded-xl p-4 shadow-sm border border-violet-100 hover:shadow-md transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <Eye className="w-8 h-8 text-violet-200" />
                        <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                            Vistas
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalVisualizaciones}</p>
                    <p className="text-xs text-gray-500">Totales</p>
                </div>

                <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl p-4 shadow-sm border border-indigo-100 hover:shadow-md transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <Download className="w-8 h-8 text-indigo-200" />
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                            Descargas
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDescargas}</p>
                    <p className="text-xs text-gray-500">Totales</p>
                </div>

                <div className="bg-gradient-to-br from-white to-yellow-50/50 rounded-xl p-4 shadow-sm border border-yellow-100 hover:shadow-md transition-all hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <Star className="w-8 h-8 text-yellow-200" />
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                            Valoración
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.promedioValoracion.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Promedio</p>
                </div>

                <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-all hover:scale-105 col-span-2 md:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-8 h-8 text-orange-200" />
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            Reputación
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.reputacion}</p>
                    <p className="text-xs text-gray-500">Puntos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mejor Apunte */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-purple-100 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="w-32 h-32 text-purple-600" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                        <Award className="w-6 h-6 text-yellow-500" />
                        Tu Mejor Apunte
                    </h3>

                    {stats.mejorApunte ? (
                        <div className="relative z-10">
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">{stats.mejorApunte.nombre}</h4>
                            <p className="text-gray-600 mb-6 line-clamp-2">{stats.mejorApunte.descripcion}</p>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                                    <Star className="w-6 h-6 text-yellow-500 mb-1 fill-yellow-500" />
                                    <span className="text-xl font-bold text-gray-900">{stats.mejorApunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}</span>
                                    <span className="text-xs text-gray-500">Valoración</span>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                                    <Eye className="w-6 h-6 text-violet-600 mb-1" />
                                    <span className="text-xl font-bold text-gray-900">{stats.mejorApunte.visualizaciones || 0}</span>
                                    <span className="text-xs text-gray-500">Vistas</span>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                                    <Download className="w-6 h-6 text-indigo-600 mb-1" />
                                    <span className="text-xl font-bold text-gray-900">{stats.mejorApunte.descargas || 0}</span>
                                    <span className="text-xs text-gray-500">Descargas</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 relative z-10">
                            <p className="text-lg font-medium mb-2">Aún no tienes un apunte estrella</p>
                            <p className="text-sm">¡Sube más contenido de calidad para destacar!</p>
                        </div>
                    )}
                </div>

                {/* Actividad Reciente */}
                <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-sm border border-purple-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Tus apuntes recientes
                    </h3>

                    <div className="space-y-3">
                        {misApuntes.slice(0, 3).map((apunte) => (
                            <div key={apunte._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100 group">
                                <div className="min-w-0 flex-1 mr-4">
                                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors">{apunte.nombre}</p>
                                    <p className="text-xs text-gray-500 truncate">{apunte.asignatura}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <span>{formatDateToLocal(apunte.fechaSubida)}</span>
                                </div>
                            </div>
                        ))}
                        {misApuntes.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No hay actividad reciente
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeStatistics;
