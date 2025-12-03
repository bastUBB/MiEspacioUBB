import { useState, useContext, useEffect, useRef } from 'react';
import { FileText, X, AlignLeft, Link, ClipboardList } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { crearEncuesta } from '../services/encuesta.service';

export default function SubirEncuestaModal({ isOpen, onClose, onEncuestaCreated }) {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useContext(UserContext);

    const [isResizing, setIsResizing] = useState(false);
    const [modalWidth, setModalWidth] = useState(768); // Ancho inicial en px
    const modalRef = useRef(null);

    const [formData, setFormData] = useState({
        nombreEncuesta: '',
        descripcion: '',
        enlaceGoogleForm: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Manejar redimensionamiento del modal
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;

            const newWidth = e.clientX - (modalRef.current?.getBoundingClientRect().left || 0);
            // Limitar entre 640px (min) y 1200px (max)
            if (newWidth >= 640 && newWidth <= 1200) {
                setModalWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

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
        } catch (e) {
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
                rutUsuario: user.rut // Asumiendo que el backend necesita el rut del usuario
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

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div
                className="fixed inset-0 bg-gray-5 bg-opacity-40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div
                    ref={modalRef}
                    className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8"
                    style={{ width: `${modalWidth}px`, maxWidth: '95vw' }}
                >
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-6 relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <ClipboardList size={28} />
                                    Crear Encuesta
                                </h2>
                                <p className="text-pink-100 mt-2 text-sm">
                                    Comparte tu encuesta con la comunidad
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div
                            onMouseDown={handleMouseDown}
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 transition-colors"
                            title="Arrastra para redimensionar"
                        >
                            <div className="h-full w-1 bg-white/30 ml-auto"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="nombreEncuesta" className="block text-sm font-semibold text-rose-700 mb-2">
                                <FileText className="inline mr-1 mb-1" size={16} />
                                Nombre de la Encuesta
                            </label>
                            <input
                                type="text"
                                id="nombreEncuesta"
                                name="nombreEncuesta"
                                value={formData.nombreEncuesta}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:outline-none transition-colors"
                                placeholder="Ej: Encuesta sobre hábitos de estudio"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Mínimo 5 caracteres, máximo 100 caracteres
                            </p>
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-semibold text-rose-700 mb-2">
                                <AlignLeft className="inline mr-1 mb-1" size={16} />
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:outline-none transition-colors resize-none"
                                placeholder="Describe el propósito de tu encuesta..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Mínimo 10 caracteres, máximo 500 caracteres • {formData.descripcion.length}/500
                            </p>
                        </div>

                        <div>
                            <label htmlFor="enlaceGoogleForm" className="block text-sm font-semibold text-rose-700 mb-2">
                                <Link className="inline mr-1 mb-1" size={16} />
                                Enlace de Google Forms
                            </label>
                            <input
                                type="url"
                                id="enlaceGoogleForm"
                                name="enlaceGoogleForm"
                                value={formData.enlaceGoogleForm}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:outline-none transition-colors"
                                placeholder="https://docs.google.com/forms/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Debe ser un enlace válido de Google Forms
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creando encuesta...
                                    </span>
                                ) : (
                                    'Crear Encuesta'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
