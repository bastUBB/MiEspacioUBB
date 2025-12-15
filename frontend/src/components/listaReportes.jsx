import { useEffect, useState, useCallback } from 'react';
import { AlertCircle, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerMisReportesService } from '../services/reporte.service';

function ListaReportes({ rutUser }) {
    const navigate = useNavigate();
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarReportes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await obtenerMisReportesService(rutUser);

            if (response.status === 'Success' && response.data) {
                setReportes(response.data);
            } else {
                setReportes([]);
            }
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            setReportes([]);
        } finally {
            setLoading(false);
        }
    }, [rutUser]);

    useEffect(() => {
        if (rutUser) {
            cargarReportes();
        }
    }, [rutUser, cargarReportes]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        // Si ya está en formato DD-MM-AAAA, retornar tal cual
        if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
            return dateString;
        }
        // Si es un objeto Date o timestamp, formatear a DD-MM-AAAA
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleNavigateToApunte = (apunteId) => {
        if (apunteId) {
            navigate(`/estudiante/apunte/${apunteId}`);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Pendiente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Resuelto':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEstadoIcon = (estado) => {
        switch (estado) {
            case 'Pendiente':
                return <Clock className="w-4 h-4" />;
            case 'Resuelto':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (reportes.length === 0) {
        return (
            <div className="text-center py-12 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No has realizado reportes</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Cuando reportes contenido inapropiado, aparecerá aquí.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
                Mostrando <span className="font-semibold">{reportes.length}</span> reporte{reportes.length !== 1 ? 's' : ''}
            </div>

            <div className="grid gap-4">
                {reportes.map((reporte) => (
                    <div
                        key={reporte._id}
                        className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-lg border border-purple-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(reporte.estado)}`}>
                                        {getEstadoIcon(reporte.estado)}
                                        {reporte.estado}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(reporte.fecha)}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {reporte.motivo}
                                </h3>

                                <p className="text-sm text-gray-600 mb-3">
                                    {reporte.descripcion}
                                </p>
                            </div>
                        </div>

                        {/* Apunte Reportado */}
                        {reporte.apunteId ? (
                            <div
                                onClick={() => handleNavigateToApunte(reporte.apunteId._id)}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            Apunte reportado (click para ver):
                                        </p>
                                        <p className="text-sm text-gray-700 font-semibold group-hover:text-purple-700 transition-colors">
                                            {reporte.apunteId.nombre}
                                        </p>
                                        {reporte.apunteId.descripcion && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                {reporte.apunteId.descripcion}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                {reporte.apunteId.asignatura}
                                            </span>
                                            {reporte.apunteId.estado && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${reporte.apunteId.estado === 'Activo'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {reporte.apunteId.estado}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-500 italic">
                                    Apunte no disponible o eliminado
                                </p>
                            </div>
                        )}

                        {/* Resolución */}
                        {reporte.estado === 'Resuelto' && reporte.resolucion && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                    Resolución:
                                </p>
                                <p className="text-sm text-gray-600">
                                    {reporte.resolucion}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListaReportes;
