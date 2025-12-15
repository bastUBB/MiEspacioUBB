import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle, X, HelpCircle, User, Calendar, FileText, ExternalLink } from 'lucide-react';
import TablaGestion from '@components/tablaGestion.jsx';
import { getAllReportesPendientesPorFechaService, actualizarEstadoReporteService, obtenerReportesService } from '@services/reporte.service.js';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';

function GestionReportes() {
    const navigate = useNavigate();
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalResolver, setModalResolver] = useState({ isOpen: false, reporte: null });
    const [resolucion, setResolucion] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [vistaActual, setVistaActual] = useState('pendientes'); // 'pendientes' | 'todos'

    useEffect(() => {
        cargarTodosReportes();
    }, []);

    const cargarReportesPendientes = async () => {
        try {
            setLoading(true);
            const response = await getAllReportesPendientesPorFechaService();

            if (response?.data) {
                const reportesFormateados = response.data.map(reporte => ({
                    id: reporte._id,
                    rutReportado: reporte.rutUsuarioReportado || 'N/A',
                    rutReportante: reporte.rutUsuarioReporte || 'N/A',
                    motivo: reporte.motivo || 'Sin motivo especificado',
                    fecha: reporte.fecha || 'Sin fecha',
                    estado: reporte.estado || 'Pendiente',
                    _raw: reporte
                }));

                setReportes(reportesFormateados);
            } else {
                setReportes([]);
            }
        } catch (error) {
            console.error('Error cargando reportes:', error);
            toast.error('Error al cargar los reportes');
            setReportes([]);
        } finally {
            setLoading(false);
        }
    };

    const cargarTodosReportes = async () => {
        try {
            setLoading(true);
            const response = await obtenerReportesService();

            if (response?.data) {
                const reportesFormateados = response.data.map(reporte => ({
                    id: reporte._id,
                    rutReportado: reporte.rutUsuarioReportado || 'N/A',
                    rutReportante: reporte.rutUsuarioReporte || 'N/A',
                    motivo: reporte.motivo || 'Sin motivo especificado',
                    fecha: reporte.fecha || 'Sin fecha',
                    estado: reporte.estado || 'Pendiente',
                    _raw: reporte
                }));

                setReportes(reportesFormateados);
            } else {
                setReportes([]);
            }
        } catch (error) {
            console.error('Error cargando todos los reportes:', error);
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
                vistaActual === 'pendientes' ? cargarReportesPendientes() : cargarTodosReportes();
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

    const handleProfileClick = () => {
        navigate('/admin/perfil');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const columns = [
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
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
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
        <>
            <AdminHeader onProfileClick={handleProfileClick} onLogout={handleLogout} />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/admin/home')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white/70 hover:bg-white hover:text-purple-600 rounded-xl border border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Panel
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Gestión de Reportes
                            </h1>
                            <div className="relative group">
                                <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                    Administra y resuelve los reportes pendientes del sistema
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros por Estado */}
                    <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'todos', label: 'Todos', icon: FileText },
                                { key: 'pendientes', label: 'Pendientes', icon: AlertTriangle },
                                { key: 'resueltos', label: 'Resueltos', icon: CheckCircle }
                            ].map(({ key, label, icon: Icon }) => {
                                const count = key === 'todos'
                                    ? reportes.length
                                    : reportes.filter(r => {
                                        if (key === 'pendientes') return r.estado === 'Pendiente';
                                        if (key === 'resueltos') return r.estado === 'Resuelto';
                                        return true;
                                    }).length;
                                const isActive = vistaActual === key;

                                const colorClasses = {
                                    'todos': isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                                    'pendientes': isActive ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100',
                                    'resueltos': isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
                                };

                                return (
                                    <button
                                        key={key}
                                        onClick={() => setVistaActual(key)}
                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${colorClasses[key]}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-black/10'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tabla de Reportes */}
                    <TablaGestion
                        data={vistaActual === 'todos'
                            ? reportes
                            : vistaActual === 'pendientes'
                                ? reportes.filter(r => r.estado === 'Pendiente')
                                : reportes.filter(r => r.estado === 'Resuelto')
                        }
                        columns={columns}
                        title={vistaActual === 'todos' ? 'Todos los Reportes' : vistaActual === 'pendientes' ? 'Reportes Pendientes' : 'Reportes Resueltos'}
                        icon={<AlertTriangle className="w-5 h-5" />}
                        onEdit={handleEditAction}
                        onDelete={null}
                        onCreate={null}
                        showCreateButton={false}
                        searchPlaceholder="Buscar por RUT, motivo, fecha..."
                        emptyMessage={`No hay reportes ${vistaActual === 'todos' ? '' : vistaActual}`}
                    />

                    {/* Modal Resolver Reporte */}
                    {modalResolver.isOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-reporte" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModal}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente */}
                                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-6 border-b border-purple-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                                                        <AlertTriangle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                                        {modalResolver.reporte?.estado === 'Pendiente' ? 'Resolver Reporte' : 'Detalles del Reporte'}
                                                    </h2>
                                                    {modalResolver.reporte?.estado === 'Pendiente' && (
                                                        <div className="relative group">
                                                            <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                                                Revisa la información y proporciona una resolución
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={cerrarModal}
                                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                                aria-label="Cerrar modal"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contenido del Modal */}
                                    <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {/* Información del Reporte */}
                                        <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                                Información del Reporte
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white rounded-xl p-4 border border-orange-100">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="w-4 h-4 text-orange-600" />
                                                        <span className="text-sm font-medium text-gray-500">Motivo</span>
                                                    </div>
                                                    <p className="text-gray-900 font-medium">{modalResolver.reporte?.motivo}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 border border-orange-100">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="w-4 h-4 text-orange-600" />
                                                        <span className="text-sm font-medium text-gray-500">Fecha</span>
                                                    </div>
                                                    <p className="text-gray-900 font-medium">{modalResolver.reporte?.fecha}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 border border-orange-100">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User className="w-4 h-4 text-orange-600" />
                                                        <span className="text-sm font-medium text-gray-500">Usuario Reportado</span>
                                                    </div>
                                                    <p className="text-gray-900 font-medium">{modalResolver.reporte?.rutReportado}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 border border-orange-100">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User className="w-4 h-4 text-orange-600" />
                                                        <span className="text-sm font-medium text-gray-500">Reportante</span>
                                                    </div>
                                                    <p className="text-gray-900 font-medium">{modalResolver.reporte?.rutReportante}</p>
                                                </div>
                                            </div>
                                            {/* Descripción del Reporte */}
                                            <div className="mt-4 bg-white rounded-xl p-4 border border-orange-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText className="w-4 h-4 text-orange-600" />
                                                    <span className="text-sm font-medium text-gray-500">Descripción del Reporte</span>
                                                </div>
                                                <p className="text-gray-900">{modalResolver.reporte?._raw?.descripcion || 'Sin descripción'}</p>
                                            </div>
                                            {/* Link al Apunte si existe */}
                                            {modalResolver.reporte?._raw?.apunteId && (
                                                <div className="mt-4">
                                                    <a
                                                        href={`/estudiante/apunte/${modalResolver.reporte._raw.apunteId._id || modalResolver.reporte._raw.apunteId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        // className con el mismo formato anaranjado que los anteriores
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Ver Apunte Reportado
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Campo de Resolución - Solo para reportes pendientes */}
                                        {modalResolver.reporte?.estado === 'Pendiente' ? (
                                            <>
                                                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                        Resolución
                                                    </h3>
                                                    <textarea
                                                        value={resolucion}
                                                        onChange={(e) => setResolucion(e.target.value)}
                                                        placeholder="Describe la resolución o acción tomada respecto a este reporte..."
                                                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[120px] resize-none transition-all"
                                                        disabled={procesando}
                                                    />
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Esta información quedará registrada permanentemente
                                                    </p>
                                                </div>

                                                {/* Botones de Acción */}
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={confirmarResolucion}
                                                        disabled={procesando || !resolucion.trim()}
                                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                        {procesando ? 'Procesando...' : 'Resolver Reporte'}
                                                    </button>
                                                    <button
                                                        onClick={cerrarModal}
                                                        disabled={procesando}
                                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Mostrar resolución existente para reportes resueltos */}
                                                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                        Resolución Aplicada
                                                    </h3>
                                                    <div className="bg-white rounded-xl p-4 border border-green-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${modalResolver.reporte?.estado === 'Resuelto'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {modalResolver.reporte?.estado}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-900">
                                                            {modalResolver.reporte?._raw?.resolucion || 'Sin información de resolución registrada'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Botón Cerrar */}
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={cerrarModal}
                                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                                                    >
                                                        Cerrar
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default GestionReportes;
