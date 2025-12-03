import { useState } from 'react';
import { Sparkles, Brain, BookOpen, Clock, Star, TrendingUp, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { obtenerRecomendacionesPersonalizadasService } from '../services/recomendacion.service';
import { toast } from 'react-hot-toast';

const GeneradorRecomendaciones = ({ onNoteClick }) => {
    const [loading, setLoading] = useState(false);
    const [recomendaciones, setRecomendaciones] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleGenerar = async () => {
        setLoading(true);
        try {
            const response = await obtenerRecomendacionesPersonalizadasService();
            if (response.status === 'Success') {
                setRecomendaciones(response.data);
                console.log(response.data);
                toast.success('¡Recomendaciones generadas con éxito!');
            } else {
                console.log(response);
                toast.error('No se pudieron generar recomendaciones en este momento.');
            }
        } catch (error) {
            console.error('Error generando recomendaciones:', error);
            toast.error('Ocurrió un error al generar las recomendaciones.');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const AlgorithmFactor = ({ icon: Icon, title, description, color }) => (
        <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-gray-100 hover:bg-white transition-colors">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 mb-12">
            {/* Hero Section del Generador */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-900 opacity-20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left max-w-xl">
                            <h2 className="text-3xl font-bold mb-4 leading-tight">
                                Descubre apuntes ideales para apoyar tu aprendizaje académico
                            </h2>
                            <p className="text-purple-100 mb-8 text-lg">
                                Nuestro algoritmo analiza tu perfil, rendimiento y preferencias para encontrar el material de estudio perfecto para ti.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={handleGenerar}
                                    disabled={loading}
                                    className="group relative px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                                                Analizando...
                                            </>
                                        ) : (
                                            <>
                                                <Brain className="w-5 h-5" />
                                                Generar Recomendaciones
                                            </>
                                        )}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setShowExplanation(!showExplanation)}
                                    className="px-6 py-4 bg-purple-700/30 hover:bg-purple-700/50 text-white rounded-xl font-medium backdrop-blur-sm border border-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <Info className="w-5 h-5" />
                                    {showExplanation ? 'Ocultar detalles' : '¿Cómo funciona?'}
                                </button>
                            </div>
                        </div>

                        {/* Visual Decoration */}
                        <div className="hidden md:block relative">
                            <div className="relative w-64 h-64">
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                                <div className="absolute inset-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
                                    <Brain className="w-32 h-32 text-white/90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explanation Section (Expandable) */}
                <div className={`grid transition-all duration-500 ease-in-out ${showExplanation ? 'grid-rows-[1fr] opacity-100 mt-8 pt-8 border-t border-white/10' : 'grid-rows-[0fr] opacity-0 border-none'}`}>
                    <div className="overflow-hidden">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Brain className="w-6 h-6" />
                            Nuestro Motor de Recomendación
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-800">
                            <AlgorithmFactor
                                icon={BookOpen}
                                title="Relevancia Académica (35%)"
                                description="Priorizamos asignaturas que estás cursando actualmente o que son de tu interés declarado."
                                color="bg-blue-500"
                            />
                            <AlgorithmFactor
                                icon={TrendingUp}
                                title="Afinidad por Rendimiento (25%)"
                                description="Sugerimos material con la complejidad adecuada según tu historial de notas y rendimiento."
                                color="bg-green-500"
                            />
                            <AlgorithmFactor
                                icon={Brain}
                                title="Método de Estudio (20%)"
                                description="Buscamos formatos (resúmenes, mapas, ejercicios) que coincidan con tu estilo de aprendizaje."
                                color="bg-purple-500"
                            />
                            <AlgorithmFactor
                                icon={Star}
                                title="Calidad y Reputación (15%)"
                                description="Consideramos la valoración de la comunidad y la reputación del autor del apunte."
                                color="bg-yellow-500"
                            />
                            <AlgorithmFactor
                                icon={Clock}
                                title="Factor Temporal (5%)"
                                description="Destacamos contenido fresco y relevante para el momento actual del semestre."
                                color="bg-pink-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {recomendaciones && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            Tus Recomendaciones
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {recomendaciones.length} resultados encontrados
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recomendaciones.map((item) => (
                            <div
                                key={item.apunte._id}
                                onClick={() => onNoteClick(item.apunte)}
                                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Match Score Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-100">
                                        <TrendingUp className="w-3 h-3" />
                                        {(item.scoreRecomendacion * 100).toFixed(0)}% Match
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium mb-2">
                                        {item.apunte.asignatura}
                                    </span>
                                    <h4 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                        {item.apunte.nombre}
                                    </h4>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {item.apunte.descripcion}
                                </p>

                                {/* Reason for recommendation */}
                                <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-800 flex items-start gap-2">
                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        {item.razonRecomendacion}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                            {item.apunte.autorSubida?.charAt(0) || 'U'}
                                        </div>
                                        <span className="truncate max-w-[100px]">{item.apunte.autorSubida}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            {item.apunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ArrowRight className="w-3 h-3" />
                                            Ver
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {recomendaciones.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No encontramos recomendaciones exactas</h3>
                            <p className="text-gray-500">Intenta actualizar tu perfil académico o explorar manualmente.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeneradorRecomendaciones;
