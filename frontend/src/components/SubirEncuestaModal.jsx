import { useState, useContext } from 'react';
import { FileText, X, AlignLeft, Link, ClipboardList, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { crearEncuesta } from '../services/encuesta.service';

export default function SubirEncuestaModal({ isOpen, onClose, onEncuestaCreated }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState({
        nombreEncuesta: '',
        descripcion: '',
        enlaceGoogleForm: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'nombreEncuesta') {
            if (value.length > 100) {
                toast.error('El nombre de la encuesta no puede tener más de 100 caracteres', {
                    duration: 3000,
                    icon: '⚠️'
                });
                return;
            }
        }

        if (name === 'descripcion') {
            if (value.length > 500) {
                toast.error('La descripción no puede tener más de 500 caracteres', {
                    duration: 3000,
                    icon: '⚠️'
                });
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            nombreEncuesta: '',
            descripcion: '',
            enlaceGoogleForm: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Debes iniciar sesión para crear encuestas', { duration: 4000, icon: '🔒' });
            onClose();
            navigate('/login');
            return;
        }

        // Validaciones
        if (!formData.nombreEncuesta.trim() || formData.nombreEncuesta.trim().length < 5) {
            toast.error('El nombre de la encuesta debe tener al menos 5 caracteres', { duration: 3000, icon: '⚠️' });
            return;
        }

        if (!formData.descripcion.trim() || formData.descripcion.trim().length < 10) {
            toast.error('La descripción debe tener al menos 10 caracteres', { duration: 3000, icon: '⚠️' });
            return;
        }

        if (!formData.enlaceGoogleForm.trim()) {
            toast.error('Debes proporcionar el enlace de Google Forms', { duration: 3000, icon: '⚠️' });
            return;
        }

        // Validación básica de URL
        try {
            new URL(formData.enlaceGoogleForm);
        } catch (error) {
            console.error('Error al validar URL:', error);
            toast.error('El enlace proporcionado no es una URL válida', { duration: 3000, icon: '⚠️' });
            return;
        }

        if (!formData.enlaceGoogleForm.includes('docs.google.com/forms') && !formData.enlaceGoogleForm.includes('forms.gle')) {
            toast.error('El enlace debe ser de Google Forms', { duration: 3000, icon: '⚠️' });
            return;
        }

        setIsSubmitting(true);

        try {
            const encuestaData = {
                nombreEncuesta: formData.nombreEncuesta.trim(),
                descripcion: formData.descripcion.trim(),
                enlaceGoogleForm: formData.enlaceGoogleForm.trim(),
                rutUsuario: user.rut
            };

            const response = await crearEncuesta(encuestaData);

            if (response.status === 'Success' || response.data) {
                toast.success('¡Encuesta creada exitosamente!', { duration: 4000, icon: '🎉' });
                resetForm();
                onClose();

                if (onEncuestaCreated) {
                    onEncuestaCreated();
                }
            } else {
                toast.error('Error al crear la encuesta');
            }
        } catch (error) {
            console.error('Error al crear encuesta:', error);
            toast.error(error.response?.data?.message || 'Error al crear la encuesta', { duration: 5000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isFormComplete = formData.nombreEncuesta && formData.descripcion && formData.enlaceGoogleForm;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all"
                onClick={onClose}
            ></div>

            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div
                    className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-8 border-b border-purple-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl shadow-lg">
                                        <Sparkles className="text-white" size={24} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Crear Encuesta
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-sm ml-14">
                                    Comparte una encuesta con la comunidad
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                aria-label="Cerrar modal"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {isFormComplete && (
                            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-purple-700 bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-200">
                                <CheckCircle2 size={18} />
                                <span>Formulario completo - listo para crear</span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ClipboardList size={20} className="text-purple-600" />
                                Información de la Encuesta
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="nombreEncuesta" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FileText size={16} className="text-purple-600" />
                                        Nombre de la Encuesta
                                    </label>
                                    <input
                                        type="text"
                                        id="nombreEncuesta"
                                        name="nombreEncuesta"
                                        value={formData.nombreEncuesta}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                                        placeholder="Ej: Encuesta sobre hábitos de estudio"
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5 ml-1">
                                        5-100 caracteres
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <AlignLeft size={16} className="text-purple-600" />
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                                        placeholder="Describe el propósito de tu encuesta..."
                                    />
                                    <div className="flex justify-between items-center mt-1.5 ml-1">
                                        <p className="text-xs text-gray-500">10-500 caracteres</p>
                                        <p className={`text-xs font-medium ${formData.descripcion.length > 480 ? 'text-orange-600' : 'text-gray-500'}`}>
                                            {formData.descripcion.length}/500
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="enlaceGoogleForm" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Link size={16} className="text-purple-600" />
                                        Enlace de Google Forms
                                    </label>
                                    <input
                                        type="url"
                                        id="enlaceGoogleForm"
                                        name="enlaceGoogleForm"
                                        value={formData.enlaceGoogleForm}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                                        placeholder="https://docs.google.com/forms/..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5 ml-1">
                                        Debe ser un enlace válido de Google Forms
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !isFormComplete}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Creando...</span>
                                    </>
                                ) : (
                                    <>
                                        <ClipboardList size={20} />
                                        <span>Crear Encuesta</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
