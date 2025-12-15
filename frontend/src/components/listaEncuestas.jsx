import { useEffect, useState } from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { obtenerEncuestasUsuarioService } from '../services/encuesta.service';

function ListaEncuestas({ rutUser }) {
    const [encuestas, setEncuestas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEncuestas = async () => {
            try {
                setLoading(true);
                const response = await obtenerEncuestasUsuarioService(rutUser);
                if (response?.data) {
                    setEncuestas(response.data);
                }
            } catch (error) {
                console.error('Error cargando encuestas:', error);
                // Si no existe el servicio, mostrar array vacío
                setEncuestas([]);
            } finally {
                setLoading(false);
            }
        };

        if (rutUser) {
            fetchEncuestas();
        }
    }, [rutUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (encuestas.length === 0) {
        return (
            <div className="text-center py-16 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No has creado encuestas aún</h3>
                <p className="text-gray-500">Crea encuestas para recopilar opiniones de la comunidad</p>
            </div>
        );
    }

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'activa':
            case 'Activa':
                return 'bg-green-100 text-green-700';
            case 'inactiva':
            case 'Inactiva':
                return 'bg-gray-100 text-gray-700';
            case 'cerrada':
            case 'Cerrada':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="space-y-4">
            {encuestas.map((encuesta) => (
                <div
                    key={encuesta._id}
                    className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => window.open(encuesta.enlaceGoogleForm, '_blank')}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900">{encuesta.nombreEncuesta}</h3>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {encuesta.descripcion || 'Sin descripción'}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {(() => {
                                            // Intentar usar createdAt, sino extraer fecha del ObjectId
                                            let fecha = encuesta.createdAt;
                                            if (!fecha && encuesta._id && encuesta._id.length === 24) {
                                                // Extraer timestamp del ObjectId (primeros 8 caracteres hex)
                                                const timestamp = parseInt(encuesta._id.substring(0, 8), 16) * 1000;
                                                fecha = new Date(timestamp);
                                            }
                                            return fecha
                                                ? new Date(fecha).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : 'Fecha desconocida';
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(encuesta.estado)}`}>
                                {encuesta.estado || 'Activo'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListaEncuestas;
