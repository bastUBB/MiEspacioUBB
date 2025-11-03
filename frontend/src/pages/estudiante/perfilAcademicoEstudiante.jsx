import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { GraduationCap, ArrowRight, ArrowLeft, Check, BookOpen, Star, Clock, Sparkles } from 'lucide-react';
import { UserContext } from '../../context/userContextProvider.jsx';
import MallaCurricular from '../../components/MallaCurricular.jsx';
import CalificacionComplejidad from '../../components/CalificacionComplejidad';
import { crearPerfilAcademicoService, poseePerfilAcademicoService } from '../../services/perfilAcademico.service';

function InicioPerfilAcademico() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);
  
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [_profileError] = useState(null);
  
  const hasCheckedProfile = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    asignaturasCursantes: [],
    datosCalificacionComplejidad: {
      modo: 'calificaciones',
      calificaciones: {},
      ordenComplejidad: []
    },
    asignaturasInteres: [],
    metodosEstudiosPreferidos: [],
    frecuenciaEstudio: ''
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!userLoading && user && !hasCheckedProfile.current) {
        hasCheckedProfile.current = true;
        
        try {
          const response = await poseePerfilAcademicoService(user.rut);
          
          if (response.data && response.data._id) {
            // Usuario ya tiene perfil, redirigir inmediatamente
            setProfileLoading(false);
            navigate('/estudiante/subir-apunte', { replace: true });
            return;
          } else {
            setHasProfile(false);
          }
        } catch (error) {
          console.error('Error verificando perfil:', error);
          setHasProfile(false);
        } finally {
          setProfileLoading(false);
        }
      } else if (!userLoading && !user) {
        navigate('/login');
      }
    };

    checkProfile();
  }, [user, userLoading, navigate]);

  const createProfile = async () => {
    try {
      const informeCurricular = [];
      
      const { modo, calificaciones, pesosComplejidad } = formData.datosCalificacionComplejidad;
      
      formData.asignaturasCursantes.forEach((asignatura) => {
        const informeAsignatura = {
          asignatura: asignatura.nombre 
        };

        if (modo === 'calificaciones') {
          if (calificaciones[asignatura.codigo] && calificaciones[asignatura.codigo].length > 0) {
            informeAsignatura.evaluaciones = calificaciones[asignatura.codigo];
            informeCurricular.push(informeAsignatura);
          }
        } else if (modo === 'complejidad') {
          if (pesosComplejidad[asignatura.codigo]) {
            const peso = Math.min(10, Math.max(1, pesosComplejidad[asignatura.codigo]));
            informeAsignatura.ordenComplejidad = peso;
            informeCurricular.push(informeAsignatura);
          }
        }
      });

      if (informeCurricular.length === 0) {
        toast.error('Debes completar al menos las notas o la complejidad de una asignatura');
        return;
      }

      if (!formData.metodosEstudiosPreferidos || formData.metodosEstudiosPreferidos.length === 0) {
        toast.error('Debes seleccionar al menos un método de estudio preferido');
        return;
      }

      const profileData = {
        rutUser: user.rut,
        asignaturasCursantes: formData.asignaturasCursantes.map(a => a.nombre),
        informeCurricular: informeCurricular,
        asignaturasInteres: formData.asignaturasInteres.length > 0 
          ? formData.asignaturasInteres.map(a => a.nombre) 
          : [],
        metodosEstudiosPreferidos: formData.metodosEstudiosPreferidos
      };

      const response = await crearPerfilAcademicoService(profileData);
      
      if (response.status === 'Success') {
        toast.success('¡Perfil académico creado exitosamente!');
        setIsComplete(true);
        setTimeout(() => {
          navigate('/estudiante/subir-apunte');
        }, 1500);
      } else {
        console.error('Error del servidor:', response);
        toast.error(response.details || response.message || 'Error al crear el perfil académico');
      }
    } catch (error) {
      console.error('Error creando perfil académico:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = errorData.details || errorData.message || 'Error al crear el perfil académico';
        toast.error(errorMessage);
      } else {
        toast.error('Error al crear el perfil académico');
      }
    }
  };

  const steps = [
    { title: 'Asignaturas Cursantes', icon: BookOpen },
    { title: 'Notas/Complejidad', icon: Star },
    { title: 'Asignaturas de Interés', icon: GraduationCap },
    { title: 'Preferencias de Estudio', icon: Clock }
  ];

  const noteTypes = [
    'Manuscritos',
    'Documentos tipeados',
    'Resúmenes conceptuales',
    'Mapas mentales',
    'Diagramas y esquemas',
    'Resolución de ejercicios',
    'Flashcards',
    'Formularios',
    'Presentaciones',
    'Ninguno',
    'Otros'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      createProfile();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleNoteType = (noteType) => {
    const isSelected = formData.metodosEstudiosPreferidos.includes(noteType);
    if (isSelected) {
      setFormData({
        ...formData,
        metodosEstudiosPreferidos: formData.metodosEstudiosPreferidos.filter(type => type !== noteType)
      });
    } else {
      setFormData({
        ...formData,
        metodosEstudiosPreferidos: [...formData.metodosEstudiosPreferidos, noteType]
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.asignaturasCursantes.length > 0;
      case 1: {
        const { modo, calificaciones, pesosComplejidad } = formData.datosCalificacionComplejidad;
        if (modo === 'calificaciones') {
          return Object.values(calificaciones).some(evals => evals && evals.length > 0);
        } else if (modo === 'complejidad') {
          return Object.keys(pesosComplejidad).length > 0;
        }
        return false;
      }
      case 2: return true; 
      case 3: return formData.metodosEstudiosPreferidos.length > 0;
      default: return false;
    }
  };

  // Loading states
  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base px-4">Verificando tu perfil académico...</p>
        </div>
      </div>
    );
  }

  if (hasProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-sm sm:max-w-md w-full text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              ¡Perfil académico encontrado! 🎉
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Redirigiendo a subir apuntes
            </p>
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-sm sm:max-w-md w-full text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center animate-bounce">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              ¡Perfil académico creado! 🎉
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Preparando tu espacio para subir apuntes...
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto py-4 sm:py-6 px-2 sm:px-4 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Bienvenido a MiEspacioUBB!!</h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-center mb-2 sm:mb-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? <Check className="w-3 h-3 sm:w-5 sm:h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded transition-all duration-300 ${
                    index < currentStep ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            {React.createElement(steps[currentStep].icon, {
              className: "w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0"
            })}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              {steps[currentStep].title}
            </h3>
          </div>

          {/* Step Content */}
          <div className="mb-4 sm:mb-8">
            {/* Step 0: Asignaturas Cursantes */}
            {currentStep === 0 && (
              <MallaCurricular
                onAsignaturasSeleccionadas={(asignaturas) => 
                  setFormData({...formData, asignaturasCursantes: asignaturas})
                }
                asignaturasIniciales={formData.asignaturasCursantes}
              />
            )}

            {/* Step 1: Notas/Complejidad */}
            {currentStep === 1 && (
              <div>
                {formData.asignaturasCursantes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-2">Primero debes seleccionar tus asignaturas cursantes</p>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="text-purple-600 hover:text-purple-700 font-semibold underline"
                    >
                      Volver al paso anterior
                    </button>
                  </div>
                ) : (
                  <CalificacionComplejidad
                    asignaturas={formData.asignaturasCursantes}
                    onGuardarDatos={(datos) =>
                      setFormData({...formData, datosCalificacionComplejidad: datos})
                    }
                    datosIniciales={formData.datosCalificacionComplejidad}
                  />
                )}
              </div>
            )}

            {/* Step 2: Asignaturas de Interés */}
            {currentStep === 2 && (
              <div>
                <MallaCurricular
                  onAsignaturasSeleccionadas={(asignaturas) =>
                    setFormData({...formData, asignaturasInteres: asignaturas})
                  }
                  asignaturasIniciales={formData.asignaturasInteres}
                />
              </div>
            )}

            {/* Step 3: Preferencias de Estudio */}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Métodos de estudio preferidos
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {noteTypes.map(noteType => (
                      <button
                        key={noteType}
                        onClick={() => toggleNoteType(noteType)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.metodosEstudiosPreferidos.includes(noteType)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <div className="font-medium text-sm sm:text-base">{noteType}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base order-2 sm:order-1 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base order-1 sm:order-2 ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Crear Perfil' : 'Siguiente'}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        {/* Espacio adicional para asegurar scroll completo */}
        <div className="h-4 sm:h-8"></div>
      </div>
    </div>
  );
}

export default InicioPerfilAcademico;