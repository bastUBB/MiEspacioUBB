import { useState, useEffect } from 'react';
import { Plus, Loader, X, Save } from 'lucide-react';
import { obtenerTodasEncuestasActivas, eliminarEncuesta, actualizarEncuesta } from '../../services/encuesta.service.js';
import { useNavigate } from 'react-router-dom';
import TarjetaEncuesta from '../../components/TarjetaEncuesta.jsx';
import toast from 'react-hot-toast';

const MisEncuestas = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [encuestaEditando, setEncuestaEditando] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        cargarEncuestas();
    }, []);

    const cargarEncuestas = async () => {
        try {
            setLoading(true);
            const response = await obtenerTodasEncuestasActivas();
            setEncuestas(response.data || []);
        } catch (error) {
            console.error('Error al cargar encuestas:', error);
            toast.error('Error al cargar las encuestas');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (encuesta) => {
        setEncuestaEditando({
            ...encuesta,
            nombreEncuesta: encuesta.nombreEncuesta,
            descripcion: encuesta.descripcion,
            enlaceGoogleForm: encuesta.enlaceGoogleForm,
            estado: encuesta.estado
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!encuestaEditando.nombreEncuesta.trim() || !encuestaEditando.descripcion.trim() || !encuestaEditando.enlaceGoogleForm.trim()) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        try {
            await actualizarEncuesta(encuestaEditando._id, {
                nombreEncuesta: encuestaEditando.nombreEncuesta,
                descripcion: encuestaEditando.descripcion,
                enlaceGoogleForm: encuestaEditando.enlaceGoogleForm,
                estado: encuestaEditando.estado
            });
            toast.success('Encuesta actualizada exitosamente');
            setShowEditModal(false);
            setEncuestaEditando(null);
            cargarEncuestas();
        } catch (error) {
            console.error('Error al actualizar encuesta:', error);
            toast.error(error.response?.data?.message || 'Error al actualizar la encuesta');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta encuesta?')) {
            return;
        }

        try {
            await eliminarEncuesta(id);
            toast.success('Encuesta eliminada exitosamente');
            cargarEncuestas();
        } catch (error) {
            console.error('Error al eliminar encuesta:', error);
            toast.error('Error al eliminar la encuesta');
        }
    };

    const handleCreate = () => {
        navigate('/admin/encuestas/crear');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                            Gestión de Encuestas
                        </h1>
                        <p className="text-gray-600">
                            Administra todas las encuestas del sistema
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2 font-medium shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Encuesta
                    </button>
                </div>

                {/* Grid de encuestas */}
                {encuestas.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500 text-lg mb-4">No hay encuestas creadas</p>
                        <button
                            onClick={handleCreate}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Crear primera encuesta
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {encuestas.map(encuesta => (
                            <TarjetaEncuesta
                                key={encuesta._id}
                                encuesta={encuesta}
                                isAdmin={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de edición */}
            {showEditModal && encuestaEditando && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Editar Encuesta</h2>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEncuestaEditando(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la Encuesta *
                                    </label>
                                    <input
                                        type="text"
                                        value={encuestaEditando.nombreEncuesta}
                                        onChange={(e) => setEncuestaEditando({ ...encuestaEditando, nombreEncuesta: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ej: Encuesta de satisfacción 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        value={encuestaEditando.descripcion}
                                        onChange={(e) => setEncuestaEditando({ ...encuestaEditando, descripcion: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe el propósito de la encuesta"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enlace de Google Form *
                                    </label>
                                    <input
                                        type="url"
                                        value={encuestaEditando.enlaceGoogleForm}
                                        onChange={(e) => setEncuestaEditando({ ...encuestaEditando, enlaceGoogleForm: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://forms.gle/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado
                                    </label>
                                    <select
                                        value={encuestaEditando.estado}
                                        onChange={(e) => setEncuestaEditando({ ...encuestaEditando, estado: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEncuestaEditando(null);
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisEncuestas;
