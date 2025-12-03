import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { crearReporteApunteService } from '../services/apunte.service';

function ReportModal({ isOpen, onClose, apunteId, autorRut, userRut }) {
    const [motivo, setMotivo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const motivoOptions = [
        { value: 'Spam', label: 'Spam' },
        { value: 'Contenido inapropiado', label: 'Contenido inapropiado' },
        { value: 'Otro', label: 'Otro' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!motivo) {
            toast.error('Selecciona un motivo');
            return;
        }

        if (!descripcion || descripcion.trim().length < 5) {
            toast.error('La descripción debe tener al menos 5 caracteres');
            return;
        }

        if (descripcion.length > 500) {
            toast.error('La descripción no puede exceder 500 caracteres');
            return;
        }

        try {
            setIsSubmitting(true);

            // Obtener fecha actual en formato DD-MM-YYYY
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const fecha = `${day}-${month}-${year}`;

            const reporteData = {
                rutUsuarioReportado: autorRut,
                rutUsuarioReporte: userRut,
                motivo,
                descripcion: descripcion.trim(),
                fecha
            };

            const response = await crearReporteApunteService(apunteId, reporteData);

            if (response.status === 'Success') {
                toast.success('Reporte enviado correctamente');
                setMotivo('');
                setDescripcion('');
                onClose();
            } else {
                toast.error(response.message || 'Error al enviar el reporte');
            }
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el reporte';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setMotivo('');
            setDescripcion('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Reportar Apunte</h2>
                            <p className="text-sm text-gray-500">Ayúdanos a mantener la comunidad segura</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Motivo */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Motivo del reporte *
                        </label>
                        <select
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="">Selecciona un motivo</option>
                            {motivoOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Descripción *
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describe el problema con detalle..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                            rows="5"
                            minLength={5}
                            maxLength={500}
                            required
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">Mínimo 5 caracteres</p>
                            <p className={`text-xs ${descripcion.length > 500 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                {descripcion.length}/500
                            </p>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-sm text-amber-800">
                            <span className="font-semibold">Nota:</span> Los reportes falsos pueden resultar en la suspensión de tu cuenta.
                            Asegúrate de que el contenido realmente viole las políticas de la plataforma.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Reporte'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReportModal;
