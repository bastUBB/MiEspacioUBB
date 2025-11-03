import { useState } from 'react';
import { GripVertical, Edit3, Plus } from 'lucide-react';
import PopupEvaluaciones from './PopupEvaluaciones';

const CalificacionComplejidad = ({ asignaturas = [], onGuardarDatos, datosIniciales = { modo: 'calificaciones', calificaciones: {}, pesosComplejidad: {} } }) => {
  const [modo, setModo] = useState(datosIniciales.modo || 'calificaciones');
  const [calificaciones, setCalificaciones] = useState(datosIniciales.calificaciones || {});
  const [pesosComplejidad, setPesosComplejidad] = useState(datosIniciales.pesosComplejidad || {});
  const [ordenComplejidad, setOrdenComplejidad] = useState(
    datosIniciales.ordenComplejidad && datosIniciales.ordenComplejidad.length > 0 
      ? datosIniciales.ordenComplejidad 
      : [...asignaturas]
  );
  const [arrastrando, setArrastrando] = useState(null);
  const [popupAbierto, setPopupAbierto] = useState(false);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

  const handleAbrirPopup = (asignatura) => {
    setAsignaturaSeleccionada(asignatura);
    setPopupAbierto(true);
  };

  const handleGuardarEvaluaciones = (evaluaciones) => {
    const nuevasCalificaciones = {
      ...calificaciones,
      [asignaturaSeleccionada.codigo]: evaluaciones
    };
    setCalificaciones(nuevasCalificaciones);
    onGuardarDatos({ modo, calificaciones: nuevasCalificaciones, pesosComplejidad, ordenComplejidad });
  };

  const calcularPesos = (asignaturas) => {
    const pesos = {};
    const total = asignaturas.length;
    asignaturas.forEach((asignatura, index) => {
      // La primera asignatura (mayor complejidad) tiene el peso más alto
      pesos[asignatura.codigo] = total - index;
    });
    return pesos;
  };

  const handleDragStart = (e, index) => {
    setArrastrando(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (arrastrando === null || arrastrando === index) return;

    const nuevasAsignaturas = [...ordenComplejidad];
    const itemArrastrado = nuevasAsignaturas[arrastrando];
    nuevasAsignaturas.splice(arrastrando, 1);
    nuevasAsignaturas.splice(index, 0, itemArrastrado);

    setOrdenComplejidad(nuevasAsignaturas);
    setArrastrando(index);
  };

  const handleDragEnd = () => {
    setArrastrando(null);
    // Calcular pesos automáticamente según el orden
    const nuevosPesos = calcularPesos(ordenComplejidad);
    setPesosComplejidad(nuevosPesos);
    onGuardarDatos({ modo, calificaciones, pesosComplejidad: nuevosPesos, ordenComplejidad });
  };

  const handleModoChange = (nuevoModo) => {
    setModo(nuevoModo);
    onGuardarDatos({ modo: nuevoModo, calificaciones, pesosComplejidad, ordenComplejidad });
  };

  return (
    <div className="space-y-6">
      {/* Selector de Modo */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => handleModoChange('calificaciones')}
          className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
            modo === 'calificaciones'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Por Calificaciones
        </button>
        <button
          onClick={() => handleModoChange('complejidad')}
          className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
            modo === 'complejidad'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Por Complejidad
        </button>
      </div>

      {/* Modo: Calificaciones */}
      {modo === 'calificaciones' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center mb-4">
            Agrega las evaluaciones y sus correspondientes notas para cada asignatura hasta ahora.
          </p>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {asignaturas.map((asignatura) => {
              const evaluaciones = calificaciones[asignatura.codigo] || [];
              const tieneEvaluaciones = evaluaciones.length > 0;
              const notaFinal = tieneEvaluaciones
                ? evaluaciones.reduce((sum, ev) => sum + (parseFloat(ev.nota) * parseFloat(ev.porcentaje) / 100), 0)
                : 0;

              return (
                <div
                  key={asignatura.codigo}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {asignatura.nombre}
                    </p>
                    <p className="text-xs text-gray-500">{asignatura.codigo}</p>
                    {tieneEvaluaciones && (
                      <p className="text-xs text-purple-600 mt-1">
                        {evaluaciones.length} evaluación{evaluaciones.length > 1 ? 'es' : ''} • Nota: {notaFinal.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAbrirPopup(asignatura)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      tieneEvaluaciones
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700'
                    }`}
                  >
                    {tieneEvaluaciones ? (
                      <>
                        <Edit3 size={16} />
                        Editar
                      </>
                    ) : (
                      <Plus size={18} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modo: Ordenar por Complejidad */}
      {modo === 'complejidad' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center mb-4">
            Arrastra las asignaturas para ordenarlas de mayor a menor complejidad.
          </p>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {ordenComplejidad.map((asignatura, index) => {
              const peso = pesosComplejidad[asignatura.codigo] || ordenComplejidad.length - index;
              const total = ordenComplejidad.length;
              
              // Determinar color según posición relativa
              let colorClase;
              if (peso > total * 0.66) {
                colorClase = 'bg-red-100 text-red-700 border-red-200';
              } else if (peso > total * 0.33) {
                colorClase = 'bg-yellow-100 text-yellow-700 border-yellow-200';
              } else {
                colorClase = 'bg-green-100 text-green-700 border-green-200';
              }

              return (
                <div
                  key={asignatura.codigo}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 bg-white rounded-lg border-2 cursor-move transition-all ${
                    arrastrando === index
                      ? 'border-purple-500 shadow-lg opacity-50'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${colorClase}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {asignatura.nombre}
                      </p>
                      <p className="text-xs text-gray-500">{asignatura.codigo}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popup de Evaluaciones */}
      {popupAbierto && asignaturaSeleccionada && (
        <PopupEvaluaciones
          asignatura={asignaturaSeleccionada}
          evaluacionesIniciales={calificaciones[asignaturaSeleccionada.codigo] || []}
          onGuardar={handleGuardarEvaluaciones}
          onCerrar={() => setPopupAbierto(false)}
        />
      )}
    </div>
  );
};

export default CalificacionComplejidad;
