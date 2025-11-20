import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Shield, BookOpen, Edit2, Save, X, 
  GraduationCap, Calendar, MapPin, Award, Settings, 
  Activity, ChevronRight, Hash, Layers, Zap, BarChart3, TrendingUp
} from 'lucide-react';
import Header from '../components/header';
import InformeCurricularEditor from '../components/InformeCurricularEditor';
import { getPerfilAcademicoService, actualizarPerfilAcademicoService } from '../services/perfilAcademico.service';
import { getAsignaturasService } from '../services/asignatura.service';
import { obtenerAñoIngresoService, actualizarUsuarioService } from '../services/user.service';

function Profile() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal'); // personal, academic, settings
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingPerfil, setIsEditingPerfil] = useState(false);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(true);

  // Datos del usuario
  const [userData, setUserData] = useState({
    nombreCompleto: '',
    email: '',
    rut: '',
    rol: '',
    anioIngreso: ''
  });

  // Datos del perfil académico
  const [perfilData, setPerfilData] = useState({
    asignaturasCursantes: [],
    asignaturasInteres: [],
    metodosEstudiosPreferidos: [],
    informeCurricular: []
  });

  // Estados temporales para edición
  const [tempUserData, setTempUserData] = useState({});
  const [tempPerfilData, setTempPerfilData] = useState({});

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const formatRole = (r) => {
          if (!r) return '';
          if (r === 'alumno') return 'Estudiante';
          if (r === 'docente') return 'Docente';
          if (r === 'admin') return 'Administrador';
          return r.charAt(0).toUpperCase() + r.slice(1);
        };

        let anio = '';
        if (user.rut) {
          try {
            const response = await obtenerAñoIngresoService(user.rut);
            if (response.status === 'Success') {
              anio = response.data.añoIngreso;
            }
          } catch (error) {
            console.error('Error cargando año de ingreso:', error);
          }
        }

        const data = {
          nombreCompleto: user.nombreCompleto || '',
          email: user.email || '',
          rut: user.rut || '',
          rol: formatRole(user.role || user.rol),
          anioIngreso: anio
        };
        setUserData(data);
        setTempUserData(data);
      }
    };

    loadUserData();
  }, [user]);

  // Cargar asignaturas disponibles
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const response = await getAsignaturasService();
        if (response.status === 'Success' && response.data) {
          setAsignaturas(response.data);
        }
      } catch (error) {
        console.error('Error cargando asignaturas:', error);
      } finally {
        setLoadingAsignaturas(false);
      }
    };

    fetchAsignaturas();
  }, []);

  // Cargar perfil académico
  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user?.rut) return;

      try {
        const response = await getPerfilAcademicoService(user.rut);
        
        if (response.status === 'Success' && response.data) {
          const data = {
            asignaturasCursantes: response.data.asignaturasCursantes || [],
            asignaturasInteres: response.data.asignaturasInteres || [],
            metodosEstudiosPreferidos: response.data.metodosEstudiosPreferidos || [],
            informeCurricular: response.data.informeCurricular || []
          };
          setPerfilData(data);
          setTempPerfilData(data);
        }
      } catch (error) {
        console.error('Error cargando perfil académico:', error);
      } finally {
        setLoadingPerfil(false);
      }
    };

    if (user) {
      fetchPerfil();
    }
  }, [user]);

  const handleEditUser = () => {
    setIsEditingUser(true);
    setTempUserData({ ...userData });
  };

  const handleCancelUserEdit = () => {
    setIsEditingUser(false);
    setTempUserData({ ...userData });
  };

  const handleSaveUser = async () => {
    try {
      if (!user?.rut) {
        toast.error('No se pudo identificar el usuario');
        return;
      }

      const dataToUpdate = {
        nombreCompleto: tempUserData.nombreCompleto,
        email: tempUserData.email
      };

      const response = await actualizarUsuarioService(user.rut, dataToUpdate);
      
      if (response.status === 'Success') {
        setUserData({ ...tempUserData });
        setIsEditingUser(false);
        toast.success('Datos de usuario actualizados correctamente');
      } else {
        toast.error(response.message || 'Error al actualizar los datos');
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      const errorMsg = error.response?.data?.message || 'Error al actualizar los datos';
      toast.error(errorMsg);
    }
  };

  const handleEditPerfil = () => {
    setIsEditingPerfil(true);
    setTempPerfilData({ ...perfilData });
  };

  const handleCancelPerfilEdit = () => {
    setIsEditingPerfil(false);
    setTempPerfilData({ ...perfilData });
  };

  const handleSavePerfil = async () => {
    try {
      if (!user?.rut) {
        toast.error('No se pudo identificar el usuario');
        return;
      }

      // Limpiar informeCurricular de campos no deseados (_id, __v, etc.)
      // XOR: Solo incluir evaluaciones O ordenComplejidad, nunca ambos
      const informeCurricularLimpio = tempPerfilData.informeCurricular.map(item => {
        const tieneEvaluaciones = item.evaluaciones && item.evaluaciones.length > 0;
        
        if (tieneEvaluaciones) {
          // Modo evaluaciones: solo enviar evaluaciones
          return {
            asignatura: item.asignatura,
            evaluaciones: item.evaluaciones.map(ev => ({
              tipoEvaluacion: ev.tipoEvaluacion,
              nota: ev.nota,
              porcentaje: ev.porcentaje
            }))
          };
        } else {
          // Modo complejidad: solo enviar ordenComplejidad
          return {
            asignatura: item.asignatura,
            ordenComplejidad: item.ordenComplejidad
          };
        }
      });

      // Solo enviar los campos editables por el usuario
      const dataToUpdate = {
        asignaturasCursantes: tempPerfilData.asignaturasCursantes,
        asignaturasInteres: tempPerfilData.asignaturasInteres,
        metodosEstudiosPreferidos: tempPerfilData.metodosEstudiosPreferidos,
        informeCurricular: informeCurricularLimpio
      };

      const response = await actualizarPerfilAcademicoService(user.rut, dataToUpdate);
      
      if (response.status === 'Success') {
        setPerfilData({ ...tempPerfilData });
        setIsEditingPerfil(false);
        toast.success('Perfil académico actualizado correctamente');
      } else {
        toast.error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error actualizando perfil académico:', error);
      const errorMsg = error.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(errorMsg);
    }
  };

  const handleAddAsignaturaCursante = (asignatura) => {
    if (!tempPerfilData.asignaturasCursantes.includes(asignatura)) {
      setTempPerfilData({
        ...tempPerfilData,
        asignaturasCursantes: [...tempPerfilData.asignaturasCursantes, asignatura]
      });
    }
  };

  const handleRemoveAsignaturaCursante = (asignatura) => {
    // También remover del informe curricular si existe
    const updatedInforme = tempPerfilData.informeCurricular.filter(
      item => item.asignatura !== asignatura
    );
    
    setTempPerfilData({
      ...tempPerfilData,
      asignaturasCursantes: tempPerfilData.asignaturasCursantes.filter(a => a !== asignatura),
      informeCurricular: updatedInforme
    });
  };

  const handleAddAsignaturaInteres = (asignatura) => {
    if (!tempPerfilData.asignaturasInteres.includes(asignatura)) {
      setTempPerfilData({
        ...tempPerfilData,
        asignaturasInteres: [...tempPerfilData.asignaturasInteres, asignatura]
      });
    }
  };

  const handleRemoveAsignaturaInteres = (asignatura) => {
    setTempPerfilData({
      ...tempPerfilData,
      asignaturasInteres: tempPerfilData.asignaturasInteres.filter(a => a !== asignatura)
    });
  };

  const handleAddMetodoEstudio = (metodo) => {
    if (metodo && !tempPerfilData.metodosEstudiosPreferidos.includes(metodo)) {
      setTempPerfilData({
        ...tempPerfilData,
        metodosEstudiosPreferidos: [...tempPerfilData.metodosEstudiosPreferidos, metodo]
      });
    }
  };

  const handleRemoveMetodoEstudio = (metodo) => {
    setTempPerfilData({
      ...tempPerfilData,
      metodosEstudiosPreferidos: tempPerfilData.metodosEstudiosPreferidos.filter(m => m !== metodo)
    });
  };

  const handleUpdateInformeCurricular = (updatedInforme) => {
    setTempPerfilData({
      ...tempPerfilData,
      informeCurricular: updatedInforme
    });
  };

  const handleHomeClick = () => navigate('/estudiante/home');
  const handleProfileClick = () => {};
  const handleExplorarClick = () => navigate('/estudiante/explorar');
  const handleMisApuntesClick = () => navigate('/estudiante/mis-apuntes');
  const handleEstadisticasClick = () => navigate('/estudiante/estadisticas');

  if (userLoading || loadingPerfil) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-purple-600 font-medium text-sm">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header 
        notificationCount={0}
        notifications={[]}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onExplorarClick={handleExplorarClick}
        onMisApuntesClick={handleMisApuntesClick}
        onEstadisticasClick={handleEstadisticasClick}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-60 bg-gradient-to-r from-purple-400 to-purple-400"></div>
          
          <div className="relative px-8 pb-8 pt-16">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg ring-4 ring-white/50">
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-purple-600">
                    <User className="w-14 h-14" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Online"></div>
              </div>
              
              <div className="flex-1 mb-2">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white tracking-tight">{userData.nombreCompleto}</h1>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-100 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {userData.rol}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    Concepción, Chile
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Unido en {userData.anioIngreso}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'personal'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4" />
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'academic'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Perfil Académico
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            Actividad Reciente
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'personal' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Datos Personales</h2>
                    <p className="text-sm text-gray-500">Información básica de tu cuenta</p>
                  </div>
                  {!isEditingUser ? (
                    <button 
                      onClick={handleEditUser}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveUser} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"><Save className="w-5 h-5" /></button>
                      <button onClick={handleCancelUserEdit} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"><X className="w-5 h-5" /></button>
                    </div>
                  )}
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre Completo</label>
                    {isEditingUser ? (
                      <input
                        type="text"
                        value={tempUserData.nombreCompleto}
                        onChange={(e) => setTempUserData({ ...tempUserData, nombreCompleto: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg text-gray-900 font-medium">
                        {userData.nombreCompleto}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                    {isEditingUser ? (
                      <input
                        type="email"
                        value={tempUserData.email}
                        onChange={(e) => setTempUserData({ ...tempUserData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg text-gray-900 font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {userData.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RUT</label>
                    <div className="px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg text-gray-500 font-medium flex items-center gap-2 cursor-not-allowed">
                      <Hash className="w-4 h-4 text-gray-400" />
                      {userData.rut}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol de Usuario</label>
                    <div className="px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg text-gray-500 font-medium flex items-center gap-2 cursor-not-allowed">
                      <Shield className="w-4 h-4 text-gray-400" />
                      {userData.rol}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Asignaturas Cursantes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-600" />
                        Asignaturas en Curso
                      </h2>
                      <p className="text-sm text-gray-500">Materias que estás cursando este semestre</p>
                    </div>
                    {!isEditingPerfil ? (
                      <button 
                        onClick={handleEditPerfil}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSavePerfil} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"><Save className="w-5 h-5" /></button>
                        <button onClick={handleCancelPerfilEdit} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {isEditingPerfil && (
                      <div className="mb-4">
                        <select
                          defaultValue={""}
                          onChange={(e) => handleAddAsignaturaCursante(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          disabled={loadingAsignaturas}
                        >
                          <option value="" disabled>+ Agregar asignatura en curso...</option>
                          {asignaturas.map((asig) => (
                            <option key={asig._id} value={asig.nombre}>{asig.nombre}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(isEditingPerfil ? tempPerfilData.asignaturasCursantes : perfilData.asignaturasCursantes).map((asig, index) => (
                        <div key={index} className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-purple-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{asig}</h3>
                                <p className="text-xs text-gray-500">En curso</p>
                              </div>
                            </div>
                            {isEditingPerfil && (
                              <button onClick={() => handleRemoveAsignaturaCursante(asig)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {(isEditingPerfil ? tempPerfilData.asignaturasCursantes : perfilData.asignaturasCursantes).length === 0 && (
                        <div className="col-span-2 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                          <p className="text-gray-500">No tienes asignaturas registradas</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Intereses y Métodos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Intereses
                    </h3>
                    {isEditingPerfil && (
                      <select
                        defaultValue={""}
                        onChange={(e) => handleAddAsignaturaInteres(e.target.value)}
                        className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-lg"
                      >
                        <option value="" disabled>+ Agregar interés...</option>
                        {asignaturas.map((asig) => (
                          <option key={asig._id} value={asig.nombre}>{asig.nombre}</option>
                        ))}
                      </select>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(isEditingPerfil ? tempPerfilData.asignaturasInteres : perfilData.asignaturasInteres).map((asig, index) => (
                        <span key={index} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium border border-yellow-100 flex items-center gap-1">
                          {asig}
                          {isEditingPerfil && (
                            <button onClick={() => handleRemoveAsignaturaInteres(asig)} className="hover:text-yellow-900 ml-1"><X className="w-3 h-3" /></button>
                          )}
                        </span>
                      ))}
                      {(isEditingPerfil ? tempPerfilData.asignaturasInteres : perfilData.asignaturasInteres).length === 0 && (
                        <p className="text-sm text-gray-400 italic">Sin intereses registrados</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-500" />
                      Métodos de Estudio
                    </h3>
                    {isEditingPerfil && (
                      <div className="mb-4">
                        <select
                          defaultValue={""}
                          onChange={(e) => {
                            handleAddMetodoEstudio(e.target.value);
                            e.target.value = '';
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        >
                          <option value="" disabled>+ Agregar método...</option>
                          <option value="Manuscritos">Manuscritos</option>
                          <option value="Documentos tipeados">Documentos tipeados</option>
                          <option value="Resúmenes conceptuales">Resúmenes conceptuales</option>
                          <option value="Mapas mentales">Mapas mentales</option>
                          <option value="Diagramas y esquemas">Diagramas y esquemas</option>
                          <option value="Resolución de ejercicios">Resolución de ejercicios</option>
                          <option value="Flashcards">Flashcards</option>
                          <option value="Formularios">Formularios</option>
                          <option value="Presentaciones">Presentaciones</option>
                          <option value="Ninguno">Ninguno</option>
                          <option value="Otros">Otros</option>
                        </select>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(isEditingPerfil ? tempPerfilData.metodosEstudiosPreferidos : perfilData.metodosEstudiosPreferidos).map((metodo, index) => (
                        <span key={index} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 flex items-center gap-1">
                          {metodo}
                          {isEditingPerfil && (
                            <button onClick={() => handleRemoveMetodoEstudio(metodo)} className="hover:text-indigo-900 ml-1">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                      {(isEditingPerfil ? tempPerfilData.metodosEstudiosPreferidos : perfilData.metodosEstudiosPreferidos).length === 0 && (
                        <p className="text-sm text-gray-400 italic">Sin métodos registrados</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informe Curricular */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Informe Curricular
                      </h2>
                      <p className="text-sm text-gray-500">
                        {isEditingPerfil 
                          ? 'Edita la complejidad o agrega evaluaciones de tus asignaturas'
                          : 'Rendimiento académico de tus asignaturas cursantes'
                        }
                      </p>
                    </div>
                    {!isEditingPerfil ? (
                      <button 
                        onClick={handleEditPerfil}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSavePerfil} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"><Save className="w-5 h-5" /></button>
                        <button onClick={handleCancelPerfilEdit} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <InformeCurricularEditor
                      informeCurricular={isEditingPerfil ? tempPerfilData.informeCurricular : perfilData.informeCurricular}
                      asignaturasCursantes={isEditingPerfil ? tempPerfilData.asignaturasCursantes : perfilData.asignaturasCursantes}
                      onUpdate={handleUpdateInformeCurricular}
                      isEditing={isEditingPerfil}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Actividad Reciente</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Aquí podrás ver un historial detallado de tus interacciones, descargas y contribuciones a la comunidad.
                </p>
                <div className="mt-8 space-y-4 text-left max-w-lg mx-auto">
                  {/* Placeholder items */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Actualizaste tu perfil académico</p>
                        <p className="text-xs text-gray-500">Hace {i} días</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Accesos Rápidos</h3>
              <div className="space-y-2">
                <button onClick={handleMisApuntesClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-purple-600 transition-all group">
                  <span className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    Mis Apuntes
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={handleEstadisticasClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-purple-600 transition-all group">
                  <span className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    Estadísticas
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
