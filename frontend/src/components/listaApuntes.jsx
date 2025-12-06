import { useEffect, useState } from 'react';
import { BookOpen, Star, Eye, Calendar, Download, Edit2, Trash2 } from 'lucide-react';
import { obtenerMisApuntesByRutService } from '../services/apunte.service';
import { useNavigate } from 'react-router-dom';

function ListaApuntes({ rutUser }) {
    const [apuntes, setApuntes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApuntes = async () => {
            try {
                setLoading(true);
                const response = await obtenerMisApuntesByRutService(rutUser);
                if (response?.data) {
                    setApuntes(response.data);
                }
            } catch (error) {
                console.error('Error cargando apuntes:', error);
            } finally {
                setLoading(false);
            }
        };

        if (rutUser) {
            fetchApuntes();
        }
    }, [rutUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (apuntes.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No has subido apuntes aún</h3>
                <p className="text-gray-500">Comienza a compartir tus apuntes con la comunidad</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {apuntes.map((apunte) => (
                <div
                    key={apunte._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/estudiante/apunte/${apunte._id}`)}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                    {apunte.asignatura}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {apunte.tipoApunte}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{apunte.nombre}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {apunte.descripcion || 'Sin descripción'}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span>{apunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}</span>
                                    <span className="text-xs">({apunte.valoracion?.cantidadValoraciones || 0})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{apunte.visualizaciones || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                    <span>{apunte.descargas || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{(() => {
                                        if (!apunte.fechaSubida) return 'Fecha desconocida';
                                        try {
                                            if (apunte.fechaSubida.includes('-')) {
                                                const parts = apunte.fechaSubida.split('-');
                                                if (parts.length === 3) {
                                                    const day = parseInt(parts[0], 10);
                                                    const month = parseInt(parts[1], 10) - 1;
                                                    const year = parseInt(parts[2], 10);
                                                    const date = new Date(year, month, day);
                                                    if (!isNaN(date.getTime())) {
                                                        return date.toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        });
                                                    }
                                                }
                                            }
                                            return apunte.fechaSubida;
                                        } catch {
                                            return apunte.fechaSubida;
                                        }
                                    })()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${apunte.estado === 'Activo'
                                ? 'bg-green-100 text-green-700'
                                : apunte.estado === 'Bajo Revisión'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {apunte.estado}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListaApuntes;
