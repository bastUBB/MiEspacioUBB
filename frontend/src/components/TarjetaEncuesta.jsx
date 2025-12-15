import { Eye, ExternalLink, Edit, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

const TarjetaEncuesta = ({ encuesta, onEdit, onDelete, isAdmin = false }) => {
    const handleOpenEncuesta = () => {
        window.open(encuesta.enlaceGoogleForm, '_blank');
    };

    return (
        <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-purple-100 hover:border-purple-300">
            {/* Header con estado */}
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {encuesta.nombreEncuesta}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${encuesta.estado === 'Activo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                    }`}>
                    {encuesta.estado}
                </span>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {encuesta.descripcion}
            </p>

            {/* Visualizaciones */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <Eye className="w-4 h-4" />
                <span>{encuesta.visualizaciones} visualizaciones</span>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
                <button
                    onClick={handleOpenEncuesta}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-violet-700 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <ExternalLink className="w-4 h-4" />
                    Responder Encuesta
                </button>

                {isAdmin && (
                    <>
                        <button
                            onClick={() => onEdit(encuesta)}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                            title="Editar encuesta"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(encuesta._id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                            title="Eliminar encuesta"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

TarjetaEncuesta.propTypes = {
    encuesta: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombreEncuesta: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        enlaceGoogleForm: PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired,
        visualizaciones: PropTypes.number.isRequired,
    }).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    isAdmin: PropTypes.bool,
};

export default TarjetaEncuesta;
