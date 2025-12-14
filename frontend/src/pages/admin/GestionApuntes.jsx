import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Eye, X, Loader2, Download, ExternalLink, User, Calendar, BookOpen, Tag, BarChart3, MessageSquare, Star, HelpCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import TablaGestion from '@components/tablaGestion.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';
import { obtenerLinkDescargaApunteURLFirmadaService, cambiarEstadoApunteService } from '../../services/apunte.service';

function GestionApuntes() {
    const navigate = useNavigate();
    const [apuntes, setApuntes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para el modal de visualización
    const [modalVisualizar, setModalVisualizar] = useState({ isOpen: false, apunte: null, loading: false });

    // Estados para el modal de cambiar estado
    const [modalRevision, setModalRevision] = useState({ isOpen: false, apunte: null });
    const [motivoRevision, setMotivoRevision] = useState('');
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [procesandoRevision, setProcesandoRevision] = useState(false);

    useEffect(() => {
        cargarApuntes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha desconocida';
        try {
            // Intentar parsear formato DD-MM-YYYY
            if (dateString.includes('-')) {
                const parts = dateString.split('-');
                if (parts.length === 3) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    const date = new Date(year, month, day);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString('es-ES');
                    }
                }
            }
            // Intentar parsear como fecha estándar ISO
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('es-ES');
            }
            return dateString;
        } catch {
            return dateString;
        }
    };

    const cargarApuntes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/apuntes/');

            if (response?.data?.data) {
                const apuntesFormateados = response.data.data.map(apunte => ({
                    id: apunte._id,
                    nombre: apunte.nombre,
                    autor: apunte.autorSubida,
                    asignatura: apunte.asignatura,
                    estado: apunte.estado || 'Activo',
                    fecha: formatDate(apunte.fechaSubida),
                    _raw: apunte
                }));
                setApuntes(apuntesFormateados);
            } else {
                setApuntes([]);
            }
        } catch (error) {
            console.error('Error cargando apuntes:', error);
            toast.error('Error al cargar los apuntes');
            setApuntes([]);
        } finally {
            setLoading(false);
        }
    };

    const eliminarApunte = async (apunte) => {
        if (!confirm(`¿Estás seguro de eliminar el apunte "${apunte.nombre}"? Esta acción es permanente.`)) {
            return;
        }

        try {
            const response = await axios.delete(`/api/apuntes/detail?apunteID=${apunte.id}`);

            if (response?.data?.status === 'Success') {
                toast.success('Apunte eliminado');
                cargarApuntes();
            } else {
                toast.error(response?.data?.details || 'Error al eliminar el apunte');
            }
        } catch (error) {
            console.error('Error eliminando apunte:', error);
            toast.error('Error al eliminar el apunte');
        }
    };

    const abrirModalVisualizar = (apunte) => {
        setModalVisualizar({ isOpen: true, apunte: apunte, loading: false });
    };

    const cerrarModalVisualizar = () => {
        setModalVisualizar({ isOpen: false, apunte: null, loading: false });
    };

    const descargarApunte = async (apunteId) => {
        try {
            const response = await obtenerLinkDescargaApunteURLFirmadaService(apunteId);
            if (response.status === 'Success' && response.data) {
                window.open(response.data.url, '_blank');
            } else {
                toast.error('Error al obtener el enlace de descarga');
            }
        } catch (error) {
            console.error('Error al descargar:', error);
            toast.error('Error al descargar el apunte');
        }
    };

    const navegarAlApunte = (apunteId) => {
        window.open(`/estudiante/apunte/${apunteId}`, '_blank');
    };

    const handleProfileClick = () => {
        navigate('/admin/perfil');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Funciones para cambiar estado
    const abrirModalRevision = (apunte) => {
        setModalRevision({ isOpen: true, apunte });
        setMotivoRevision('');
        // Establecer el siguiente estado lógico como default
        const estadosSiguientes = {
            'Activo': 'Bajo Revisión',
            'Bajo Revisión': 'Suspendido',
            'Suspendido': 'Activo'
        };
        setNuevoEstado(estadosSiguientes[apunte.estado] || 'Bajo Revisión');
    };

    const cerrarModalRevision = () => {
        setModalRevision({ isOpen: false, apunte: null });
        setMotivoRevision('');
        setNuevoEstado('');
    };

    const confirmarCambioEstado = async () => {
        if (motivoRevision.length < 10) {
            toast.error('El motivo debe tener al menos 10 caracteres');
            return;
        }

        if (!nuevoEstado) {
            toast.error('Selecciona un estado');
            return;
        }

        try {
            setProcesandoRevision(true);
            await cambiarEstadoApunteService(modalRevision.apunte.id, nuevoEstado, motivoRevision);
            toast.success(`Estado cambiado a ${nuevoEstado}`);
            cerrarModalRevision();
            cargarApuntes();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            toast.error(error.response?.data?.details || 'Error al cambiar estado');
        } finally {
            setProcesandoRevision(false);
        }
    };

    // ==================== Configuración de la Tabla ====================

    const columns = [
        { key: 'nombre', title: 'Nombre', align: 'left' },
        { key: 'asignatura', title: 'Asignatura', align: 'left' },
        { key: 'autor', title: 'Autor', align: 'left' },
        {
            key: 'estado',
            title: 'Estado',
            align: 'center',
            render: (item) => {
                const estadoClases = {
                    'Activo': 'bg-green-100 text-green-800',
                    'Bajo Revisión': 'bg-amber-100 text-amber-800',
                    'Suspendido': 'bg-red-100 text-red-800'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoClases[item.estado] || 'bg-gray-100 text-gray-800'}`}>
                        {item.estado}
                    </span>
                );
            }
        },
        { key: 'fecha', title: 'Fecha', align: 'center' }
    ];

    // Acciones personalizadas
    const accionesCustom = (apunte) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => abrirModalVisualizar(apunte)}
                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                title="Ver Apunte"
            >
                <Eye className="w-4 h-4" />
            </button>
            <button
                onClick={() => abrirModalRevision(apunte)}
                className="text-amber-600 hover:text-amber-800 p-1 rounded transition-colors"
                title="Cambiar Estado"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando apuntes...</p>
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
                                Gestión de Apuntes
                            </h1>
                            <div className="relative group">
                                <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors mt-1" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                    Administra y supervisa todos los apuntes subidos al sistema
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <TablaGestion
                        data={apuntes}
                        columns={columns}
                        title="Apuntes"
                        icon={<FileText className="w-5 h-5" />}
                        onDelete={eliminarApunte}
                        showCreateButton={false}
                        searchPlaceholder="Buscar por nombre, asignatura, autor..."
                        emptyMessage="No hay apuntes registrados"
                        customActions={accionesCustom}
                    />

                    {/* Modal Ver Información del Apunte */}
                    {modalVisualizar.isOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-apunte" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModalVisualizar}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente */}
                                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-6 border-b border-purple-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl shadow-lg">
                                                        <FileText className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                                        Detalles del Apunte
                                                    </h2>
                                                    <div className="relative group">
                                                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                                            Información completa del apunte y estadísticas de uso
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={cerrarModalVisualizar}
                                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                                aria-label="Cerrar modal"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {/* Información General */}
                                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-purple-600" />
                                                Información General
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Nombre</span>
                                                    <p className="text-lg font-semibold text-gray-900 mt-1">{modalVisualizar.apunte?._raw?.nombre || modalVisualizar.apunte?.nombre}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <User className="w-4 h-4 text-purple-600" />
                                                            <span className="text-sm font-medium text-gray-500">Autor</span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium">{modalVisualizar.apunte?._raw?.autorSubida || modalVisualizar.apunte?.autor}</p>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <BookOpen className="w-4 h-4 text-purple-600" />
                                                            <span className="text-sm font-medium text-gray-500">Asignatura</span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium">{modalVisualizar.apunte?._raw?.asignatura || modalVisualizar.apunte?.asignatura}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Calendar className="w-4 h-4 text-purple-600" />
                                                            <span className="text-sm font-medium text-gray-500">Fecha de Subida</span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium">{modalVisualizar.apunte?._raw?.fechaSubida || modalVisualizar.apunte?.fecha}</p>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Tag className="w-4 h-4 text-purple-600" />
                                                            <span className="text-sm font-medium text-gray-500">Tipo</span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium">{modalVisualizar.apunte?._raw?.tipoApunte || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                {modalVisualizar.apunte?._raw?.descripcion && (
                                                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                                                        <span className="text-sm font-medium text-gray-500">Descripción</span>
                                                        <p className="text-gray-700 mt-1">{modalVisualizar.apunte._raw.descripcion}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Estadísticas */}
                                        <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-violet-600" />
                                                Estadísticas
                                            </h3>
                                            <div className="grid grid-cols-4 gap-4">
                                                <div className="bg-gradient-to-br from-white to-violet-50/50 rounded-xl p-4 shadow-sm border border-violet-100 hover:shadow-md transition-all text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Eye className="w-8 h-8 text-violet-200" />
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{modalVisualizar.apunte?._raw?.visualizaciones || 0}</p>
                                                    <p className="text-xs text-gray-500">Vistas</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl p-4 shadow-sm border border-indigo-100 hover:shadow-md transition-all text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Download className="w-8 h-8 text-indigo-200" />
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{modalVisualizar.apunte?._raw?.descargas || 0}</p>
                                                    <p className="text-xs text-gray-500">Descargas</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-white to-yellow-50/50 rounded-xl p-4 shadow-sm border border-yellow-100 hover:shadow-md transition-all text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Star className="w-8 h-8 text-yellow-200" />
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{modalVisualizar.apunte?._raw?.valoracion?.promedio?.toFixed(1) || '0.0'}</p>
                                                    <p className="text-xs text-gray-500">Valoración</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-white to-green-50/50 rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-all text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <MessageSquare className="w-8 h-8 text-green-200" />
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{modalVisualizar.apunte?._raw?.comentarios?.length || 0}</p>
                                                    <p className="text-xs text-gray-500">Comentarios</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Etiquetas */}
                                        {modalVisualizar.apunte?._raw?.etiquetas?.length > 0 && (
                                            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Tag className="w-5 h-5 text-purple-600" />
                                                    Etiquetas
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {modalVisualizar.apunte._raw.etiquetas.map((etiqueta, idx) => (
                                                        <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                                                            {etiqueta}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Botones de Acción */}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => navegarAlApunte(modalVisualizar.apunte?.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                                Navegar al Apunte
                                            </button>
                                            <button
                                                onClick={() => descargarApunte(modalVisualizar.apunte?.id)}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <Download className="w-5 h-5" />
                                                Descargar
                                            </button>
                                            <button
                                                onClick={cerrarModalVisualizar}
                                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Poner en Revisión */}
                    {modalRevision.isOpen && modalRevision.apunte && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-revision" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModalRevision}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header */}
                                    <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-8 py-6 border-b border-amber-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                                                        <AlertTriangle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                                                        Cambiar Estado
                                                    </h2>
                                                </div>
                                            </div>
                                            <button
                                                onClick={cerrarModalRevision}
                                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-8 space-y-6">
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <p className="text-sm text-amber-800">
                                                <strong>Apunte:</strong> {modalRevision.apunte.nombre}
                                            </p>
                                            <p className="text-sm text-amber-800 mt-1">
                                                <strong>Autor:</strong> {modalRevision.apunte.autor}
                                            </p>
                                            <p className="text-sm text-amber-800 mt-1">
                                                <strong>Estado actual:</strong> {modalRevision.apunte.estado}
                                            </p>
                                        </div>

                                        {/* Selector de nuevo estado */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Nuevo estado *
                                            </label>
                                            <select
                                                value={nuevoEstado}
                                                onChange={(e) => setNuevoEstado(e.target.value)}
                                                disabled={procesandoRevision}
                                                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                                            >
                                                <option value="Activo">Activo</option>
                                                <option value="Bajo Revisión">Bajo Revisión</option>
                                                <option value="Suspendido">Suspendido</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Motivo del cambio de estado *
                                            </label>
                                            <textarea
                                                value={motivoRevision}
                                                onChange={(e) => setMotivoRevision(e.target.value)}
                                                disabled={procesandoRevision}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all"
                                                placeholder="Describe la razón del cambio de estado (mín. 10 caracteres)..."
                                            />
                                            <p className={`text-xs mt-1 ${motivoRevision.length < 10 ? 'text-gray-500' : 'text-green-600'}`}>
                                                {motivoRevision.length}/10 caracteres mínimos
                                            </p>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={confirmarCambioEstado}
                                                disabled={procesandoRevision || motivoRevision.length < 10}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                                            >
                                                {procesandoRevision ? 'Procesando...' : 'Confirmar'}
                                            </button>
                                            <button
                                                onClick={cerrarModalRevision}
                                                disabled={procesandoRevision}
                                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
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

export default GestionApuntes;
