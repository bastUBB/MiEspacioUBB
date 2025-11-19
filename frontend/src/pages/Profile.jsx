import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Shield, BookOpen, Edit2, Save, X } from 'lucide-react';
import Header from '../components/header';
import { getPerfilAcademicoService } from '../services/perfilAcademico.service';
import { getAsignaturasService } from '../services/asignatura.service';

function Profile() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();

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
    rol: ''
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
    if (user) {
      const data = {
        nombreCompleto: user.nombreCompleto || '',
        email: user.email || '',
        rut: user.rut || '',
        rol: user.rol || ''
      };
      setUserData(data);
      setTempUserData(data);
    }
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
      // Aquí llamarías al servicio para actualizar el usuario
      // await updateUserService(tempUserData);
      
      setUserData({ ...tempUserData });
      setIsEditingUser(false);
      toast.success('Datos de usuario actualizados correctamente');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      toast.error('Error al actualizar los datos');
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
      // Aquí llamarías al servicio para actualizar el perfil académico
      // await updatePerfilAcademicoService(user.rut, tempPerfilData);
      
      setPerfilData({ ...tempPerfilData });
      setIsEditingPerfil(false);
      toast.success('Perfil académico actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando perfil académico:', error);
      toast.error('Error al actualizar el perfil');
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
    setTempPerfilData({
      ...tempPerfilData,
      asignaturasCursantes: tempPerfilData.asignaturasCursantes.filter(a => a !== asignatura)
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

  if (userLoading || loadingPerfil) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleHomeClick = () => {
    navigate('/estudiante/home');
  };

  const handleProfileClick = () => {
    // Ya estamos en profile, no hacer nada o recargar
  };

  const handleExplorarClick = () => {
    navigate('/estudiante/explorar');
  };

  const handleMisApuntesClick = () => {
    navigate('/estudiante/mis-apuntes');
  };

  const handleEstadisticasClick = () => {
    navigate('/estudiante/estadisticas');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        notificationCount={0}
        notifications={[]}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onExplorarClick={handleExplorarClick}
        onMisApuntesClick={handleMisApuntesClick}
        onEstadisticasClick={handleEstadisticasClick}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de perfil */}
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{userData.nombreCompleto}</h1>
              <p className="text-purple-100 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {userData.email}
              </p>
              <p className="text-purple-100 flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4" />
                {userData.rol}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Datos del Usuario */}
          <div className="bg-gradient-to-br from-white via-purple-50/30 to-violet-50/30 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Datos del Usuario
              </h2>
              {!isEditingUser ? (
                <button
                  onClick={handleEditUser}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUser}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelUserEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                {isEditingUser ? (
                  <input
                    type="text"
                    value={tempUserData.nombreCompleto}
                    onChange={(e) => setTempUserData({ ...tempUserData, nombreCompleto: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.nombreCompleto}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditingUser ? (
                  <input
                    type="email"
                    value={tempUserData.email}
                    onChange={(e) => setTempUserData({ ...tempUserData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RUT
                </label>
                <p className="px-4 py-2 bg-gray-100 rounded-lg text-gray-500">
                  {userData.rut} (No editable)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <p className="px-4 py-2 bg-gray-100 rounded-lg text-gray-500">
                  {userData.rol} (No editable)
                </p>
              </div>
            </div>
          </div>

          {/* Perfil Académico */}
          <div className="bg-gradient-to-br from-white via-purple-50/30 to-violet-50/30 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Perfil Académico
              </h2>
              {!isEditingPerfil ? (
                <button
                  onClick={handleEditPerfil}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePerfil}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelPerfilEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Asignaturas Cursantes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignaturas Cursantes
                </label>
                {isEditingPerfil ? (
                  <div className="space-y-2">
                    <select
                      onChange={(e) => handleAddAsignaturaCursante(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      disabled={loadingAsignaturas}
                    >
                      <option value="">Agregar asignatura...</option>
                      {asignaturas.map((asig) => (
                        <option key={asig._id} value={asig.nombre}>
                          {asig.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                      {tempPerfilData.asignaturasCursantes.map((asig, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {asig}
                          <button
                            onClick={() => handleRemoveAsignaturaCursante(asig)}
                            className="hover:text-purple-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {perfilData.asignaturasCursantes.length > 0 ? (
                      perfilData.asignaturasCursantes.map((asig, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {asig}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No hay asignaturas cursantes</p>
                    )}
                  </div>
                )}
              </div>

              {/* Asignaturas de Interés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignaturas de Interés
                </label>
                {isEditingPerfil ? (
                  <div className="space-y-2">
                    <select
                      onChange={(e) => handleAddAsignaturaInteres(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      disabled={loadingAsignaturas}
                    >
                      <option value="">Agregar asignatura de interés...</option>
                      {asignaturas.map((asig) => (
                        <option key={asig._id} value={asig.nombre}>
                          {asig.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                      {tempPerfilData.asignaturasInteres.map((asig, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                        >
                          {asig}
                          <button
                            onClick={() => handleRemoveAsignaturaInteres(asig)}
                            className="hover:text-violet-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {perfilData.asignaturasInteres.length > 0 ? (
                      perfilData.asignaturasInteres.map((asig, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                        >
                          {asig}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No hay asignaturas de interés</p>
                    )}
                  </div>
                )}
              </div>

              {/* Métodos de Estudio Preferidos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Métodos de Estudio Preferidos
                </label>
                <div className="flex flex-wrap gap-2">
                  {perfilData.metodosEstudiosPreferidos.length > 0 ? (
                    perfilData.metodosEstudiosPreferidos.map((metodo, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {metodo}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No hay métodos de estudio registrados</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
