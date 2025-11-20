import { useState, useEffect } from 'react';
import { Edit3, Plus, X, TrendingUp, GripVertical } from 'lucide-react';
import PopupEvaluaciones from './PopupEvaluaciones';

const InformeCurricularEditor = ({ 
  informeCurricular = [], 
  asignaturasCursantes = [],
  onUpdate,
  isEditing = false
}) => {
  const [popupAbierto, setPopupAbierto] = useState(false);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [arrastrando, setArrastrando] = useState(null);
  
  // Detectar modo automáticamente basado en los datos existentes
  const [modo, setModo] = useState(() => {
    // Si hay alguna asignatura con evaluaciones, modo = 'evaluaciones'
    const tieneEvaluaciones = informeCurricular.some(
      item => item.evaluaciones && item.evaluaciones.length > 0
    );
    return tieneEvaluaciones ? 'evaluaciones' : 'complejidad';
  });

  // Sincronizar modo cuando cambian los datos
  useEffect(() => {
    if (informeCurricular.length > 0) {
      const tieneEvaluaciones = informeCurricular.some(
        item => item.evaluaciones && item.evaluaciones.length > 0
      );
      if (tieneEvaluaciones) {
        setModo('evaluaciones');
      }
    }
  }, [informeCurricular]);

  const handleAbrirPopup = (asignatura, index) => {
    setAsignaturaSeleccionada(asignatura);
    setSelectedIndex(index);
    setPopupAbierto(true);
  };

  const handleGuardarEvaluaciones = (evaluaciones) => {
    const updatedInforme = [...informeCurricular];
    updatedInforme[selectedIndex] = {
      ...updatedInforme[selectedIndex],
      evaluaciones: evaluaciones
    };
    onUpdate(updatedInforme);
    setPopupAbierto(false);
    // Si agrega evaluaciones, cambiar a modo evaluaciones
    if (evaluaciones.length > 0) {
      setModo('evaluaciones');
    }
  };

  const handleModoChange = (nuevoModo) => {
    setModo(nuevoModo);
    
    // Si cambia a modo complejidad, limpiar evaluaciones y recalcular ordenComplejidad
    if (nuevoModo === 'complejidad') {
      const total = informeCurricular.length;
      const updatedInforme = informeCurricular.map((item, idx) => ({
        ...item,
        evaluaciones: [],
        ordenComplejidad: total - idx // Primera = N, última = 1
      }));
      onUpdate(updatedInforme);
    }
  };

  // Funciones de drag & drop para ordenar por complejidad
  const handleDragStart = (e, index) => {
    setArrastrando(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (arrastrando === null || arrastrando === index) return;

    const nuevasAsignaturas = [...informeSincronizado];
    const itemArrastrado = nuevasAsignaturas[arrastrando];
    nuevasAsignaturas.splice(arrastrando, 1);
    nuevasAsignaturas.splice(index, 0, itemArrastrado);

    // Recalcular ordenComplejidad basado en la nueva posición
    const updatedInforme = nuevasAsignaturas.map((item, idx) => ({
      ...item,
      ordenComplejidad: nuevasAsignaturas.length - idx
    }));

    onUpdate(updatedInforme);
    setArrastrando(index);
  };

  const handleDragEnd = () => {
    setArrastrando(null);
  };

  const handleRemove = (index) => {
    const updatedInforme = informeCurricular.filter((_, i) => i !== index);
    onUpdate(updatedInforme);
  };

  const handleAddAsignatura = (nombreAsignatura) => {
    if (!nombreAsignatura) return;
    
    // Verificar si ya existe
    const existe = informeCurricular.find(item => item.asignatura === nombreAsignatura);
    if (existe) return;

    const nuevoItem = {
      asignatura: nombreAsignatura,
      ordenComplejidad: 1, // Se agrega al final (menor complejidad)
      evaluaciones: []
    };

    onUpdate([...informeCurricular, nuevoItem]);
  };

  // Sincronizar informe curricular con asignaturas cursantes
  const informeSincronizado = informeCurricular.filter(item => 
    asignaturasCursantes.includes(item.asignatura)
  );

  // Asignaturas cursantes que no están en el informe
  const asignaturasDisponibles = asignaturasCursantes.filter(asig => 
    !informeSincronizado.find(item => item.asignatura === asig)
  );

  return (
    <div>
      {/* Selector de Modo - Solo en edición */}
      {isEditing && (
        <div className="mb-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => handleModoChange('complejidad')}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                modo === 'complejidad'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Por complejidad
            </button>
            <button
              onClick={() => handleModoChange('evaluaciones')}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                modo === 'evaluaciones'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Por evaluaciones
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            {modo === 'complejidad' 
              ? '💡 Arrastra las asignaturas para ordenarlas: arriba = más complejo, abajo = menos complejo'
              : '💡 Agrega las evaluaciones y notas de cada asignatura'
            }
          </p>
        </div>
      )}

      {isEditing && asignaturasDisponibles.length > 0 && (
        <div className="mb-4">
          <select
            onChange={(e) => {
              handleAddAsignatura(e.target.value);
              e.target.value = '';
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          >
            <option value="">+ Agregar asignatura al informe...</option>
            {asignaturasDisponibles.map((asig, idx) => (
              <option key={idx} value={asig}>{asig}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {informeSincronizado.map((item, index) => {
          // Calcular nota final si hay evaluaciones
          const tieneEvaluaciones = item.evaluaciones && item.evaluaciones.length > 0;
          const notaFinal = tieneEvaluaciones
            ? item.evaluaciones.reduce((sum, ev) => sum + (parseFloat(ev.nota) * parseFloat(ev.porcentaje) / 100), 0)
            : null;

          // Determinar color según complejidad relativa (solo para modo complejidad)
          const totalAsignaturas = informeSincronizado.length;
          const complejidadRelativa = item.ordenComplejidad / totalAsignaturas;
          
          let colorClase;
          if (modo === 'complejidad') {
            if (complejidadRelativa > 0.66) { // Top 33% más complejo
              colorClase = 'bg-red-100 text-red-700 border-red-200';
            } else if (complejidadRelativa > 0.33) { // 33-66% medio
              colorClase = 'bg-yellow-100 text-yellow-700 border-yellow-200';
            } else { // Bottom 33% menos complejo
              colorClase = 'bg-green-100 text-green-700 border-green-200';
            }
          } else {
            // Modo evaluaciones: color neutral
            colorClase = 'bg-purple-100 text-purple-700 border-purple-200';
          }

          return (
            <div 
              key={index}
              draggable={isEditing && modo === 'complejidad'}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 bg-white rounded-lg border-2 transition-all ${
                arrastrando === index
                  ? 'border-purple-500 shadow-lg opacity-50'
                  : 'border-gray-200 hover:border-purple-300'
              } ${isEditing && modo === 'complejidad' ? 'cursor-move' : ''}`}
            >
              {/* Ícono de arrastrar - solo en modo complejidad */}
              {isEditing && modo === 'complejidad' && (
                <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Número de orden / complejidad - Solo en modo complejidad */}
                {modo === 'complejidad' && (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 ${colorClase}`}>
                    {index + 1}
                  </div>
                )}
                
                {/* Información de la asignatura */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.asignatura}
                  </p>
                  
                  {/* Mostrar evaluaciones o nivel de complejidad */}
                  {tieneEvaluaciones ? (
                    <p className="text-xs text-purple-600 mt-0.5">
                      {item.evaluaciones.length} evaluación{item.evaluaciones.length > 1 ? 'es' : ''} • Nota: {notaFinal.toFixed(2)}
                    </p>
                  ) : modo === 'complejidad' ? (
                    <p className="text-xs text-gray-500">
                      Nivel {item.ordenComplejidad} de {informeSincronizado.length}
                    </p>
                  ) : null}
                </div>
              </div>
              
              {/* Controles de edición o visualización */}
              {isEditing ? (
                <div className="flex items-center gap-2">
                  {/* Modo Evaluaciones: Botón para agregar/editar */}
                  {modo === 'evaluaciones' && (
                    <button
                      onClick={() => handleAbrirPopup(item.asignatura, index)}
                      className={`p-2 rounded-lg font-medium text-xs transition-colors ${
                        tieneEvaluaciones
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700'
                      }`}
                      title={tieneEvaluaciones ? 'Editar evaluaciones' : 'Agregar evaluaciones'}
                    >
                      {tieneEvaluaciones ? <Edit3 size={14} /> : <Plus size={14} />}
                    </button>
                  )}
                  
                  {/* Botón eliminar */}
                  <button 
                    onClick={() => handleRemove(index)} 
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Eliminar del informe"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  {/* Barra de complejidad visual */}
                  <div className="flex items-center gap-1">
                    {[...Array(informeSincronizado.length)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-3 rounded-sm ${
                          i < item.ordenComplejidad
                            ? complejidadRelativa > 0.66 ? 'bg-red-500' : 
                              complejidadRelativa > 0.33 ? 'bg-yellow-500' : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {notaFinal !== null && (
                    <span className={`text-xs font-semibold ${
                      notaFinal >= 5.5 ? 'text-green-600' :
                      notaFinal >= 4.0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {notaFinal.toFixed(1)}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {informeSincronizado.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              {isEditing 
                ? 'Agrega asignaturas cursantes para crear tu informe curricular'
                : 'No hay asignaturas en el informe curricular'
              }
            </p>
          </div>
        )}
      </div>

      {/* Popup de Evaluaciones */}
      {popupAbierto && asignaturaSeleccionada && (
        <PopupEvaluaciones
          asignatura={{ nombre: asignaturaSeleccionada }}
          evaluacionesIniciales={informeCurricular[selectedIndex]?.evaluaciones || []}
          onGuardar={handleGuardarEvaluaciones}
          onCerrar={() => setPopupAbierto(false)}
        />
      )}
    </div>
  );
};

export default InformeCurricularEditor;
