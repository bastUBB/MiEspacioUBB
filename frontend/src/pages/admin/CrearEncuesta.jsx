import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { crearEncuesta } from '../../services/encuesta.service.js';
import toast from 'react-hot-toast';

const CrearEncuesta = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombreEncuesta: '',
        descripcion: '',
        enlaceGoogleForm: ''
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.nombreEncuesta.trim()) {
            toast.error('El nombre de la encuesta es obligatorio');
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
            toast.error('El enlace del Google Form es obligatorio');
            return;
        }

        try {
            setSaving(true);
            await crearEncuesta(formData);
            toast.success('Encuesta creada exitosamente');
            navigate('/admin/encuestas');
        } catch (error) {
            console.error('Error al crear encuesta:', error);
            const errorMessage = error.response?.data?.message || 'Error al crear la encuesta';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/encuestas')}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Mis Encuestas
                    </button>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                        Crear Nueva Encuesta
                    </h1>
                    <p className="text-gray-600">
                        Completa los datos para crear una nueva encuesta
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Encuesta *
                            </label>
                            <input
                                type="text"
                                name="nombreEncuesta"
                                value={formData.nombreEncuesta}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Ej: Encuesta de satisfacción 2024"
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Mínimo 3 caracteres, máximo 200
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción *
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe el propósito de la encuesta y la información que se recopilará..."
                                maxLength={1000}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Mínimo 10 caracteres, máximo 1000. {formData.descripcion.length}/1000
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enlace de Google Form *
                            </label>
                            <input
                                type="url"
                                name="enlaceGoogleForm"
                                value={formData.enlaceGoogleForm}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="https://forms.gle/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Debe ser una URL válida (comienza con http:// o https://)
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Usa un título claro y descriptivo</li>
                                <li>• Explica el objetivo de la encuesta en la descripción</li>
                                <li>• Asegúrate de que el enlace de Google Form sea público</li>
                                <li>• La encuesta se creará en estado "Activo" por defecto</li>
                            </ul>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Crear Encuesta
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/encuestas')}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearEncuesta;
