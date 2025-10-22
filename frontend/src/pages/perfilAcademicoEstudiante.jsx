import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/userContextProvider';
import { getAsignaturasSemestreActualService } from '../services/asignatura.service';
import { poseePerfilAcademicoService } from '../services/perfilAcademico.service';
import { GraduationCap, ArrowRight, ArrowLeft, Check, Calendar, BookOpen, Star, Clock, Plus, X, Sparkles, Target } from 'lucide-react';

function InicioPerfilAcademico() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);
  
  // Estados para verificación de perfil
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  
  // Ref para evitar múltiples ejecuciones
  const hasCheckedProfile = useRef(false);

  // Estados del formulario (mantienen la lógica original)
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    semester: '',
    subjectsOfInterest: [],
    recentGrades: {},
    preferredNoteTypes: [],
    studyFrequency: ''
  });
  const [newSubject, setNewSubject] = useState('');
  const [isComplete] = useState(false);
  
  // Estados para asignaturas dinámicas del semestre
  const [currentSemesterSubjects, setCurrentSemesterSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Inicialización automática SOLO una vez
  useEffect(() => {
    if (!userLoading && user && !hasCheckedProfile.current) {
      // Solo marcar que ya se ejecutó, NO hacer la petición aquí
      hasCheckedProfile.current = true;
      setProfileLoading(false);
      setHasProfile(false); // Por defecto asumir que no tiene perfil

    } else if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  // Efecto para cargar asignaturas cuando se selecciona un semestre
  useEffect(() => {
    if (formData.semester) {
      obtenerAsignaturasSemestre(formData.semester);
    }
  }, [formData.semester]);

  // Función manual para verificar perfil usando el servicio
  const verificarPerfil = async () => {
    try {
      setProfileLoading(true);
      
      const result = await poseePerfilAcademicoService(user.rut);
      
      if (result.status === 'Success' && result.data) {
        setHasProfile(true);
        toast.success('Perfil académico encontrado. Redirigiendo a subida de apuntes');
        setTimeout(() => {
          navigate('/estudiante');
        }, 1500);
      } else {
        setHasProfile(false);
        toast('No tienes perfil académico. Puedes crear uno aquí.');
      }
    } catch {
      setHasProfile(false);
      toast('Vamos a crear tu perfil académico');
    } finally {
      setProfileLoading(false);
    }
  };

  // Función para obtener asignaturas del semestre seleccionado
  const obtenerAsignaturasSemestre = async (semestre) => {
    try {
      setLoadingSubjects(true);
      
      // Convertir formato de semestre (ej: "I Semestre" -> "1")
      const numeroRomano = semestre.split(' ')[0];
      const romanToNumber = { 
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 
        'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10 };
      const semestreNumero = romanToNumber[numeroRomano];
      
      console.log('Semestre seleccionado:', semestre);
      console.log('Número romano:', numeroRomano);
      console.log('Número convertido:', semestreNumero);
      
      const result = await getAsignaturasSemestreActualService(semestreNumero);

      console.log('Resultado de asignaturas del semestre:', result);
      
      if (result.status === 'Success' && result.data) {
        setCurrentSemesterSubjects(result.data);
        toast.success(`Se encontraron ${result.data.length} asignaturas`);
      } else {
        setCurrentSemesterSubjects([]);
        toast('No se encontraron asignaturas para este semestre.');
      }
    } catch (error) {
      console.error('Error obteniendo asignaturas:', error);
      setCurrentSemesterSubjects([]);
      toast.error('Error al obtener las asignaturas');
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Función para crear el perfil académico
  const createProfile = async () => {
    try {
      const profileData = {
        semester: formData.semester,
        subjectsOfInterest: formData.subjectsOfInterest,
        recentGrades: formData.recentGrades,
        preferredNoteTypes: formData.preferredNoteTypes,
        studyFrequency: formData.studyFrequency,
        userId: user.id
      };

      const response = await axios.post('/api/perfil-academico', profileData);
      
      if (response.data) {
        toast.success('¡Perfil académico creado exitosamente!');
        // Redirigir al dashboard después de crear el perfil
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creando perfil académico:', error);
      toast.error('Error al crear el perfil académico');
    }
  };

  const steps = [
    { title: 'Semestre Actual', icon: Calendar },
    { title: 'Notas Recientes', icon: Star },
    { title: 'Asignaturas de Interés', icon: Target },
    { title: 'Preferencias de Estudio', icon: BookOpen }
  ];

  const semesters = [
    'I Semestre', 'II Semestre', 'III Semestre', 'IV Semestre',
    'V Semestre', 'VI Semestre', 'VII Semestre', 'VIII Semestre',
    'IX Semestre', 'X Semestre'
  ];



  const noteTypes = [
    'Resúmenes Conceptuales',
    'Mapas Mentales',
    'Ejercicios Resueltos',
    'Formularios y Fórmulas',
    'Casos Prácticos',
    'Diagramas y Esquemas'
  ];

  const studyFrequencies = [
    'Diario (1-2 horas)',
    'Interdiario (3-4 veces por semana)',
    'Fines de semana',
    'Antes de exámenes',
    'Según disponibilidad'
  ];

  const grades = ['A', 'B', 'C', 'D', 'E'];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // En lugar de setIsComplete, llamar a createProfile
      createProfile();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addSubjectOfInterest = () => {
    if (newSubject.trim() && !formData.subjectsOfInterest.includes(newSubject.trim())) {
      setFormData({
        ...formData,
        subjectsOfInterest: [...formData.subjectsOfInterest, newSubject.trim()]
      });
      setNewSubject('');
    }
  };

  const removeSubjectOfInterest = (subject) => {
    setFormData({
      ...formData,
      subjectsOfInterest: formData.subjectsOfInterest.filter(s => s !== subject)
    });
  };

  const updateGrade = (subject, grade) => {
    setFormData({
      ...formData,
      recentGrades: {
        ...formData.recentGrades,
        [subject]: grade
      }
    });
  };

  const toggleNoteType = (noteType) => {
    const isSelected = formData.preferredNoteTypes.includes(noteType);
    if (isSelected) {
      setFormData({
        ...formData,
        preferredNoteTypes: formData.preferredNoteTypes.filter(type => type !== noteType)
      });
    } else {
      setFormData({
        ...formData,
        preferredNoteTypes: [...formData.preferredNoteTypes, noteType]
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.semester !== '';
      case 1: return Object.keys(formData.recentGrades).length > 0;
      case 2: return true; // Optional step
      case 3: return formData.preferredNoteTypes.length > 0 && formData.studyFrequency !== '';
      default: return false;
    }
  };

  const getCurrentSemesterSubjects = () => {
    return currentSemesterSubjects.map(asignatura => asignatura.nombre) || [];
  };

  // Loading states
  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base px-4">Verificando tu perfil académico...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-sm sm:max-w-md w-full text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <X className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Error al cargar
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              {profileError}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 text-sm sm:text-base"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si ya tiene perfil, mostrar mensaje de redirección
  if (hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-sm sm:max-w-md w-full text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              ¡Perfil académico encontrado! 🎉
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Redirigiendo al dashboard...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Si ya completó el perfil
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-sm sm:max-w-md w-full text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              ¡Perfil académico creado! 🎉
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Redirigiendo al dashboard...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-cyan-50">
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
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
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
            {currentStep === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿En qué semestre te encuentras actualmente?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {semesters.map(semester => (
                    <button
                      key={semester}
                      onClick={() => setFormData({...formData, semester})}
                      className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base ${
                        formData.semester === semester
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {semester}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comparte tus notas recientes de las asignaturas de tu semestre
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Esto nos ayudará a recomendarte apuntes más relevantes
                </p>
                
                {loadingSubjects ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Cargando asignaturas del semestre...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4">
                      {getCurrentSemesterSubjects().map(subject => (
                        <div key={subject} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl gap-3 sm:gap-0">
                          <span className="font-medium text-gray-700 text-sm sm:text-base">{subject}</span>
                          <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end">
                            {grades.map(grade => (
                              <button
                                key={grade}
                                onClick={() => updateGrade(subject, grade)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                                  formData.recentGrades[subject] === grade
                                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                                }`}
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {getCurrentSemesterSubjects().length === 0 && (
                      <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                        Selecciona tu semestre en el paso anterior para ver las asignaturas
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Asignaturas de interés adicionales (opcional)
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Agrega asignaturas que no están en tu semestre actual pero te interesan
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Ej: Programación Web, Marketing Digital..."
                    className="flex-1 p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && addSubjectOfInterest()}
                  />
                  <button
                    onClick={addSubjectOfInterest}
                    className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 self-stretch sm:self-auto"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                  </button>
                </div>
                {formData.subjectsOfInterest.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.subjectsOfInterest.map(subject => (
                      <span
                        key={subject}
                        className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                      >
                        <span className="break-words">{subject}</span>
                        <button
                          onClick={() => removeSubjectOfInterest(subject)}
                          className="hover:bg-purple-200 rounded-full p-1 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {formData.subjectsOfInterest.length === 0 && (
                  <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base">
                    No hay asignaturas adicionales agregadas
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de apuntes preferidos
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {noteTypes.map(noteType => (
                      <button
                        key={noteType}
                        onClick={() => toggleNoteType(noteType)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.preferredNoteTypes.includes(noteType)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <div className="font-medium text-sm sm:text-base">{noteType}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Frecuencia de estudio
                  </label>
                  <div className="space-y-2">
                    {studyFrequencies.map(frequency => (
                      <button
                        key={frequency}
                        onClick={() => setFormData({...formData, studyFrequency: frequency})}
                        className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-2 sm:gap-3 ${
                          formData.studyFrequency === frequency
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">{frequency}</span>
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
      </div>
    </div>
  );
}

export default InicioPerfilAcademico;