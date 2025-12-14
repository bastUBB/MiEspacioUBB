import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft, X, HelpCircle, Link, FileText, ExternalLink } from 'lucide-react';
import TablaGestion from '@components/tablaGestion.jsx';
import { obtenerTodasEncuestas, eliminarEncuesta, actualizarEncuesta, crearEncuesta } from '@services/encuesta.service.js';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';

function GestionEncuestas() {
    const navigate = useNavigate();
    const [encuestas, setEncuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [encuestaActual, setEncuestaActual] = useState(null);
    const [procesando, setProcesando] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nombreEncuesta: '',
        descripcion: '',
        enlaceGoogleForm: '',
        estado: 'Activo'
    });

    useEffect(() => {
        cargarEncuestas();
    }, []);

    const cargarEncuestas = async () => {
        try {
            setLoading(true);
            const response = await obtenerTodasEncuestas();

            if (response?.data) {
                const encuestasFormateadas = response.data.map(enc => ({
                    id: enc._id,
                    nombre: enc.nombreEncuesta,
                    descripcion: enc.descripcion?.length > 50
                        ? enc.descripcion.substring(0, 50) + '...'
                        : enc.descripcion,
                    estado: enc.estado,
                    fechaCreacion: new Date(enc.createdAt || enc.fechaCreacion).toLocaleDateString('es-ES'),
                    _raw: enc
                }));
                setEncuestas(encuestasFormateadas);
            } else {
                setEncuestas([]);
            }
        } catch (error) {
            console.error('Error cargando encuestas:', error);
            toast.error('Error al cargar las encuestas');
            setEncuestas([]);
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCrear = () => {
        setModoEdicion(false);
        setEncuestaActual(null);
        setFormData({
            nombreEncuesta: '',
            descripcion: '',
            enlaceGoogleForm: '',
            estado: 'Activo'
        });
        setModalOpen(true);
    };

    const abrirModalEditar = (encuesta) => {
        setModoEdicion(true);
        setEncuestaActual(encuesta);
        setFormData({
            nombreEncuesta: encuesta._raw.nombreEncuesta,
            descripcion: encuesta._raw.descripcion,
            enlaceGoogleForm: encuesta._raw.enlaceGoogleForm,
            estado: encuesta._raw.estado
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setModoEdicion(false);
        setEncuestaActual(null);
        setFormData({
            nombreEncuesta: '',
            descripcion: '',
            enlaceGoogleForm: '',
            estado: 'Activo'
        });
    };

    const guardarEncuesta = async () => {
        // Validaciones
        if (!formData.nombreEncuesta.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        if (formData.nombreEncuesta.length < 3) {
            toast.error('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (!formData.descripcion.trim()) {
            toast.error('La descripción es obligatoria');
            return;
        }

        if (formData.descripcion.length < 10) {
            toast.error('La descripción debe tener al menos 10 caracteres');
            return;
        }

        if (!formData.enlaceGoogleForm.trim()) {
            toast.error('El enlace de Google Form es obligatorio');
            return;
        }

        try {
            setProcesando(true);

            if (modoEdicion) {
                await actualizarEncuesta(encuestaActual.id, {
                    nombreEncuesta: formData.nombreEncuesta,
                    descripcion: formData.descripcion,
                    enlaceGoogleForm: formData.enlaceGoogleForm,
                    estado: formData.estado
                });
                toast.success('Encuesta actualizada exitosamente');
            } else {
                await crearEncuesta({
                    nombreEncuesta: formData.nombreEncuesta,
                    descripcion: formData.descripcion,
                    enlaceGoogleForm: formData.enlaceGoogleForm
                });
                toast.success('Encuesta creada exitosamente');
            }

            cerrarModal();
            cargarEncuestas();
        } catch (error) {
            console.error('Error guardando encuesta:', error);
            toast.error(error.response?.data?.message || 'Error al guardar la encuesta');
        } finally {
            setProcesando(false);
        }
    };

    const eliminarEncuestaHandler = async (encuesta) => {
        if (!confirm(`¿Estás seguro de eliminar la encuesta "${encuesta.nombre}"?`)) {
            return;
        }

        try {
            await eliminarEncuesta(encuesta.id);
            toast.success('Encuesta eliminada');
            cargarEncuestas();
        } catch (error) {
            console.error('Error eliminando encuesta:', error);
            toast.error('Error al eliminar la encuesta');
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
        { key: 'nombre', title: 'Nombre', align: 'left' },
        { key: 'descripcion', title: 'Descripción', align: 'left' },
        {
            key: 'estado',
            title: 'Estado',
            align: 'center',
            render: (item) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {item.estado}
                </span>
            )
        },
        { key: 'fechaCreacion', title: 'Fecha Creación', align: 'center' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando encuestas...</p>
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
                                Gestión de Encuestas
                            </h1>
                            <div className="relative group">
                                <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                    Administra las encuestas del sistema
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <TablaGestion
                        data={encuestas}
                        columns={columns}
                        title="Encuestas"
                        icon={<ClipboardList className="w-5 h-5" />}
                        onEdit={abrirModalEditar}
                        onDelete={eliminarEncuestaHandler}
                        onCreate={abrirModalCrear}
                        createButtonText="Nueva Encuesta"
                        showCreateButton={true}
                        searchPlaceholder="Buscar por nombre, descripción..."
                        emptyMessage="No hay encuestas registradas"
                    />

                    {/* Modal Crear/Editar */}
                    {modalOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-encuesta" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModal}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente */}
                                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-6 border-b border-purple-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl shadow-lg">
                                                        <ClipboardList className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                                        {modoEdicion ? 'Editar Encuesta' : 'Nueva Encuesta'}
                                                    </h2>
                                                    <div className="relative group">
                                                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                                            {modoEdicion ? 'Modifica los datos de la encuesta' : 'Completa los datos para crear una nueva encuesta'}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                        </div>
                                                    </div>
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

                                    {/* Contenido */}
                                    <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {/* Información de la Encuesta */}
                                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-purple-600" />
                                                Información de la Encuesta
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Nombre * <span className="text-xs text-gray-400">(mín. 3 caracteres)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.nombreEncuesta}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, nombreEncuesta: e.target.value }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                        placeholder="Ej: Encuesta de satisfacción 2024"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Descripción * <span className="text-xs text-gray-400">(mín. 10 caracteres)</span>
                                                    </label>
                                                    <textarea
                                                        value={formData.descripcion}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                                        disabled={procesando}
                                                        rows={4}
                                                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                                                        placeholder="Describe el propósito de la encuesta..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enlace y Estado */}
                                        <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Link className="w-5 h-5 text-cyan-600" />
                                                Configuración
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Enlace de Google Form *
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="url"
                                                            value={formData.enlaceGoogleForm}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, enlaceGoogleForm: e.target.value }))}
                                                            disabled={procesando}
                                                            className="flex-1 px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                                            placeholder="https://forms.gle/..."
                                                        />
                                                        {formData.enlaceGoogleForm && (
                                                            <a
                                                                href={formData.enlaceGoogleForm}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-4 py-3 bg-cyan-100 text-cyan-700 rounded-xl hover:bg-cyan-200 transition-all"
                                                            >
                                                                <ExternalLink className="w-5 h-5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                {modoEdicion && (
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                            Estado
                                                        </label>
                                                        <select
                                                            value={formData.estado}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                                                            disabled={procesando}
                                                            className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
                                                        >
                                                            <option value="Activo">Activo</option>
                                                            <option value="Inactivo">Inactivo</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botones */}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={guardarEncuesta}
                                                disabled={procesando}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                                            >
                                                {procesando ? 'Guardando...' : (modoEdicion ? 'Guardar Cambios' : 'Crear Encuesta')}
                                            </button>
                                            <button
                                                onClick={cerrarModal}
                                                disabled={procesando}
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

export default GestionEncuestas;
