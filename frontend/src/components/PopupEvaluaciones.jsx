import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PopupEvaluaciones = ({ asignatura, evaluacionesIniciales = [], onGuardar, onCerrar }) => {
  const [evaluaciones, setEvaluaciones] = useState(evaluacionesIniciales);
  const [nuevaEvaluacion, setNuevaEvaluacion] = useState({
    tipoEvaluacion: '',
    nota: '',
    porcentaje: ''
  });

  const tiposEvaluacion = [
    'Prueba',
    'Control',
    'Certamen',
    'Examen',
    'Trabajo',
    'Proyecto',
    'Laboratorio',
    'Tarea',
    'Presentación',
    'Otro'
  ];

  const handleAgregarEvaluacion = () => {
    // Validar que se haya seleccionado un tipo de evaluación
    if (!nuevaEvaluacion.tipoEvaluacion) {
      toast.error('Debes seleccionar un tipo de evaluación');
      return;
    }

    // Validar que se haya ingresado una nota
    if (!nuevaEvaluacion.nota || nuevaEvaluacion.nota.trim() === '') {
      toast.error('Debes ingresar una nota');
      return;
    }

    // Validar que se haya ingresado un porcentaje
    if (!nuevaEvaluacion.porcentaje || nuevaEvaluacion.porcentaje.trim() === '') {
      toast.error('Debes ingresar un porcentaje');
      return;
    }

    const nota = parseFloat(nuevaEvaluacion.nota);
    const porcentaje = parseFloat(nuevaEvaluacion.porcentaje);

    // Validar que la nota sea un número válido
    if (isNaN(nota)) {
      toast.error('La nota debe ser un número válido');
      return;
    }

    // Validar rango de la nota
    if (nota < 1.0 || nota > 7.0) {
      toast.error('La nota debe estar entre 1.0 y 7.0');
      return;
    }

    // Validar que el porcentaje sea un número válido
    if (isNaN(porcentaje)) {
      toast.error('El porcentaje debe ser un número válido');
      return;
    }

    // Validar rango del porcentaje
    if (porcentaje <= 0 || porcentaje > 100) {
      toast.error('El porcentaje debe estar entre 1 y 100');
      return;
    }

    // Validar que el porcentaje sea un número entero
    if (!Number.isInteger(porcentaje)) {
      toast.error('El porcentaje debe ser un número entero');
      return;
    }

    // Calcular el porcentaje total actual
    const porcentajeTotal = evaluaciones.reduce((sum, evaluacion) => sum + parseFloat(evaluacion.porcentaje), 0);
    
    // Validar que no se exceda el 100%
    if (porcentajeTotal + porcentaje > 100) {
      toast.error(`El porcentaje total no puede superar 100%. Actualmente tienes ${porcentajeTotal}% asignado`);
      return;
    }

    setEvaluaciones([...evaluaciones, { ...nuevaEvaluacion, nota, porcentaje }]);
    setNuevaEvaluacion({ tipoEvaluacion: '', nota: '', porcentaje: '' });
    toast.success('Evaluación agregada correctamente');
  };

  const handleEliminarEvaluacion = (index) => {
    setEvaluaciones(evaluaciones.filter((_, i) => i !== index));
    toast.success('Evaluación eliminada');
  };

  const handleGuardar = () => {
    if (evaluaciones.length === 0) {
      toast.error('Debes agregar al menos una evaluación');
      return;
    }

    // Calcular el porcentaje total
    const porcentajeTotal = evaluaciones.reduce((sum, evaluacion) => sum + parseFloat(evaluacion.porcentaje), 0);
    
    // Advertir si el porcentaje total no es 100%
    if (porcentajeTotal !== 100) {
      toast.error(`El porcentaje total debe ser 100%. Actualmente tienes ${porcentajeTotal}%`, {
        duration: 5000
      });
      return;
    }

    onGuardar(evaluaciones);
    onCerrar();
    toast.success('Evaluaciones guardadas correctamente');
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{asignatura.nombre}</h2>
            <p className="text-purple-100 text-sm">{asignatura.codigo}</p>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Agregar nueva evaluación */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plus size={20} className="text-purple-600" />
              Agregar Evaluación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evaluación
                </label>
                <select
                  value={nuevaEvaluacion.tipoEvaluacion}
                  onChange={(e) => setNuevaEvaluacion({ ...nuevaEvaluacion, tipoEvaluacion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Seleccionar...</option>
                  {tiposEvaluacion.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nota (1.0 - 7.0)
                </label>
                <input
                  type="number"
                  min="1.0"
                  max="7.0"
                  step="0.1"
                  value={nuevaEvaluacion.nota}
                  onChange={(e) => setNuevaEvaluacion({ ...nuevaEvaluacion, nota: e.target.value })}
                  placeholder="Ej: 5.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={nuevaEvaluacion.porcentaje}
                  onChange={(e) => setNuevaEvaluacion({ ...nuevaEvaluacion, porcentaje: e.target.value })}
                  placeholder="Ej: 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <button
              onClick={handleAgregarEvaluacion}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Agregar Evaluación
            </button>
          </div>

          {/* Lista de evaluaciones */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Evaluaciones Agregadas ({evaluaciones.length})
            </h3>
            {evaluaciones.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay evaluaciones agregadas. Agrega al menos una evaluación.
              </p>
            ) : (
              <div className="space-y-2">
                {evaluaciones.map((evaluacion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Tipo</p>
                        <p className="font-medium text-gray-900">{evaluacion.tipoEvaluacion}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nota</p>
                        <p className="font-medium text-gray-900">{parseFloat(evaluacion.nota).toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Porcentaje</p>
                        <p className="font-medium text-gray-900">{evaluacion.porcentaje}%</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEliminarEvaluacion(index)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex gap-3 bg-gray-50">
          <button
            onClick={onCerrar}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={evaluaciones.length === 0}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Evaluaciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupEvaluaciones;