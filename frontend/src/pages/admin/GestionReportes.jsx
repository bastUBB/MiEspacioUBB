import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import TablaGestion from '@components/tablaGestion.jsx';
import { getAllReportesPendientesPorFechaService, actualizarEstadoReporteService } from '@services/reporte.service.js';
import toast from 'react-hot-toast';

function GestionReportes() {
    const navigate = useNavigate();
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalResolver, setModalResolver] = useState({ isOpen: false, reporte: null });
    const [resolucion, setResolucion] = useState('');
    const [procesando, setProcesando] = useState(false);

    useEffect(() => {
        cargarReportes();
    }, []);

    const cargarReportes = async () => {
        try {
            setLoading(true);
            const response = await getAllReportesPendientesPorFechaService();

            if (response?.data) {
                // Formatear los datos para la tabla
                const reportesFormateados = response.data.map(reporte => ({
                    id: reporte._id,
                    tipo: reporte.tipo || 'General',
                    rutReportado: reporte.rutUsuarioReportado || 'N/A',
                    rutReportante: reporte.rutUsuarioReporte || 'N/A',
                    motivo: reporte.motivo || 'Sin motivo especificado',
                    fecha: new Date(reporte.fechaReporte).toLocaleDateString('es-ES'),
                    estado: reporte.estado || 'Pendiente',
                    _raw: reporte
                }));

                setReportes(reportesFormateados);
            } else {
                setReportes([]);
                toast.error('No se pudieron cargar los reportes');
            }
        } catch (error) {
            console.error('Error cargando reportes:', error);
            toast.error('Error al cargar los reportes');
            setReportes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResolver = (reporte) => {
        setModalResolver({ isOpen: true, reporte });
        setResolucion('');
    };

    const cerrarModal = () => {
        setModalResolver({ isOpen: false, reporte: null });
        setResolucion('');
    };

    const confirmarResolucion = async () => {
        if (!resolucion.trim()) {
            toast.error('Debes ingresar una resolución');
            return;
        }

        try {
            setProcesando(true);
            const response = await actualizarEstadoReporteService(modalResolver.reporte.id, resolucion);

            if (response?.status === 'Success') {
                toast.success('Reporte resuelto exitosamente');
                cerrarModal();
                cargarReportes(); // Recargar la lista
            } else {
                toast.error(response?.details || 'Error al resolver el reporte');
            }
        } catch (error) {
            console.error('Error resolviendo reporte:', error);
            toast.error('Error al resolver el reporte');
        } finally {
            setProcesando(false);
        }
    };

    const columns = [
        {
            key: 'tipo',
            title: 'Tipo',
            align: 'left'
        },
        {
            key: 'rutReportado',
            title: 'Usuario Reportado',
            align: 'left'
        },
        {
            key: 'rutReportante',
            title: 'Reportado Por',
            align: 'left'
        },
        {
            key: 'motivo',
            title: 'Motivo',
            align: 'left',
            render: (item) => (
                <div className="max-w-xs truncate" title={item.motivo}>
                    {item.motivo}
                </div>
            )
        },
        {
            key: 'fecha',
            title: 'Fecha',
            align: 'center'
        },
        {
            key: 'estado',
            title: 'Estado',
            align: 'center',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        item.estado === 'Resuelto' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {item.estado}
                </span>
            )
        }
    ];

    const handleEditAction = (reporte) => {
        handleResolver(reporte);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando reportes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/home')}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reportes</h1>
                        <p className="text-gray-600">Administra y resuelve los reportes pendientes del sistema</p>
                    </div>
                </div>

                {/* Tabla de Reportes */}
                <TablaGestion
                    data={reportes}
                    columns={columns}
                    title="Reportes Pendientes"
                    icon={<AlertTriangle className="w-5 h-5" />}
                    onEdit={handleEditAction}
                    onDelete={null}
                    onCreate={null}
                    showCreateButton={false}
                    searchPlaceholder="Buscar por RUT, motivo, tipo..."
                    emptyMessage="No hay reportes pendientes"
                />

                {/* Modal Resolver Reporte */}
                {modalResolver.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header del Modal */}
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6" />
                                    Resolver Reporte
                                </h2>
                            </div>

                            {/* Contenido del Modal */}
                            <div className="p-6">
                                {/* Información del Reporte */}
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <h3 className="font-semibold text-blue-900 mb-3">Información del Reporte</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Tipo:</span>
                                            <p className="text-gray-900">{modalResolver.reporte?.tipo}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Fecha:</span>
                                            <p className="text-gray-900">{modalResolver.reporte?.fecha}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Reportado:</span>
                                            <p className="text-gray-900">{modalResolver.reporte?.rutReportado}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Reportante:</span>
                                            <p className="text-gray-900">{modalResolver.reporte?.rutReportante}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium text-gray-700">Motivo:</span>
                                            <p className="text-gray-900 mt-1">{modalResolver.reporte?.motivo}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Campo de Resolución */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Resolución del Reporte *
                                    </label>
                                    <textarea
                                        value={resolucion}
                                        onChange={(e) => setResolucion(e.target.value)}
                                        placeholder="Describe la resolución o acción tomada respecto a este reporte..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
                                        disabled={procesando}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Esta información quedará registrada permanentemente
                                    </p>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={cerrarModal}
                                        disabled={procesando}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <XCircle className="w-5 h-5 inline mr-2" />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmarResolucion}
                                        disabled={procesando || !resolucion.trim()}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle className="w-5 h-5 inline mr-2" />
                                        {procesando ? 'Procesando...' : 'Resolver Reporte'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionReportes;
