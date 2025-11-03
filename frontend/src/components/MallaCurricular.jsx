import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { getAsignaturasService } from '../services/asignatura.service.js';

export default function MallaCurricular({ onAsignaturasSeleccionadas, asignaturasIniciales = [] }) {
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState(asignaturasIniciales);
  const [mallaCurricular, setMallaCurricular] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar asignaturas desde el servicio
  useEffect(() => {
    const cargarAsignaturas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAsignaturasService();
        
        if (response.status === 'Success' && response.data) {
          // Agrupar asignaturas por semestre
          const asignaturasPorSemestre = response.data.reduce((acc, asignatura) => {
            const semestre = asignatura.semestre; // Cambiar de semestreAsignatura a semestre
            if (!acc[semestre]) {
              acc[semestre] = [];
            }
            acc[semestre].push({
              codigo: asignatura.codigo, // Cambiar de codigoAsignatura a codigo
              nombre: asignatura.nombre, // Cambiar de nombreAsignatura a nombre
              creditos: asignatura.creditos || 0 // Cambiar de creditosAsignatura a creditos
            });
            return acc;
          }, {});
          
          setMallaCurricular(asignaturasPorSemestre);
          setError(null);
        } else {
          setError(response.message || 'No se pudieron cargar las asignaturas');
        }
      } catch (err) {
        console.error('Error al cargar asignaturas:', err);
        setError(`Error al cargar las asignaturas: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    cargarAsignaturas();
  }, []);

  const toggleAsignatura = (asignatura) => {
    const yaSeleccionada = asignaturasSeleccionadas.some(a => a.codigo === asignatura.codigo);
    
    let nuevasSeleccionadas;
    if (yaSeleccionada) {
      nuevasSeleccionadas = asignaturasSeleccionadas.filter(a => a.codigo !== asignatura.codigo);
    } else {
      nuevasSeleccionadas = [...asignaturasSeleccionadas, asignatura];
    }
    
    setAsignaturasSeleccionadas(nuevasSeleccionadas);
    onAsignaturasSeleccionadas(nuevasSeleccionadas);
  };

  const estaSeleccionada = (codigo) => {
    return asignaturasSeleccionadas.some(a => a.codigo === codigo);
  };

  return (
    <div className="space-y-4">
      {/* Header con información */}
      <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-purple-900">Malla Curricular Interactiva</h3>
            <p className="text-sm text-gray-600 mt-1">
              Haz clic en las asignaturas que estás cursando actualmente
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full">
              <Check className="w-4 h-4" />
              <span className="font-bold text-lg">{asignaturasSeleccionadas.length}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">seleccionadas</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Cargando malla curricular...</p>
          <p className="text-gray-400 text-sm mt-1">Esto puede tomar unos segundos</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 px-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-700 font-semibold mb-2">Error al cargar</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Malla Curricular - Vista de Semestres */}
      {!loading && !error && Object.keys(mallaCurricular).length > 0 && (
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Grid de semestres horizontal con scroll */}
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 p-6 min-w-full">
              {Object.entries(mallaCurricular)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([semestre, asignaturas]) => (
                  <div 
                    key={semestre} 
                    className="flex-shrink-0 w-90 bg-gradient-to-b from-purple-50 to-white rounded-xl border-2 border-purple-200 shadow-md overflow-hidden"
                  >
                    {/* Header del semestre */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg">Semestre {semestre}</h4>
                          <p className="text-xs text-purple-100">
                            {asignaturas.length} asignatura{asignaturas.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lista de asignaturas del semestre */}
                    <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
                      {asignaturas.map((asignatura) => {
                        const seleccionada = estaSeleccionada(asignatura.codigo);
                        return (
                          <button
                            key={asignatura.codigo}
                            onClick={() => toggleAsignatura(asignatura)}
                            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left transform hover:scale-105 ${
                              seleccionada
                                ? 'border-purple-500 bg-purple-100 shadow-lg ring-2 ring-purple-300'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                                    seleccionada 
                                      ? 'bg-purple-600 text-white' 
                                      : 'bg-gray-200 text-gray-700'
                                  }`}>
                                    {asignatura.codigo}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {asignatura.creditos} CR
                                  </span>
                                </div>
                                <p className={`text-sm font-semibold leading-tight ${
                                  seleccionada ? 'text-purple-900' : 'text-gray-800'
                                }`}>
                                  {asignatura.nombre}
                                </p>
                              </div>
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                seleccionada 
                                  ? 'bg-purple-600 scale-110' 
                                  : 'bg-gray-200 opacity-40'
                              }`}>
                                {seleccionada && <Check className="w-4 h-4 text-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Leyenda */}
          <div className="border-t-2 border-gray-200 bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-gray-300 bg-white"></div>
                  <span>No seleccionada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-100"></div>
                  <span>Seleccionada</span>
                </div>
              </div>
              <span className="text-gray-500">
                💡 Desplázate horizontalmente para ver todos los semestres
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && Object.keys(mallaCurricular).length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">📚</span>
          </div>
          <p className="text-gray-600 font-medium">No hay asignaturas disponibles</p>
          <p className="text-gray-500 text-sm mt-1">Contacta al administrador</p>
        </div>
      )}
    </div>
  );
}
