import { useState, useContext, useEffect, useRef } from 'react';
import { Upload, FileText, X, Tag, Plus, PencilLine, Users, AlignLeft, BookOpen, FolderOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { crearApunteService } from '../services/apunte.service';
import { poseePerfilAcademicoService } from '../services/perfilAcademico.service';
import { getAsignaturasService } from '../services/asignatura.service';

export default function SubirApunteForm() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);
  
  const [profileLoading, setProfileLoading] = useState(true);
  const hasCheckedProfile = useRef(false);

  const [formData, setFormData] = useState({
    name: '',
    authors: '',
    description: '',
    subject: '',
    noteType: '',
    file: null,
  });

  const [etiquetas, setEtiquetas] = useState([]);
  const [currentEtiqueta, setCurrentEtiqueta] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(true);

  // Cargar asignaturas al iniciar
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const response = await getAsignaturasService();
        
        if (response.status === 'Success' && response.data) {
          setAsignaturas(response.data);
        } else {
          toast.error('Error al cargar las asignaturas');
        }
      } catch (error) {
        console.error('Error cargando asignaturas:', error);
        toast.error('Error al cargar las asignaturas');
      } finally {
        setLoadingAsignaturas(false);
      }
    };

    fetchAsignaturas();
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (!userLoading && user && !hasCheckedProfile.current) {
        hasCheckedProfile.current = true;
        
        try {
          const response = await poseePerfilAcademicoService(user.rut);
          
          if (!response.data || !response.data._id) {
            // Usuario NO tiene perfil, redirigir a crearlo
            toast.error('Debes crear tu perfil académico antes de subir apuntes', {
              duration: 5000,
              icon: '📋'
            });
            navigate('/estudiante/perfil-academico', { replace: true });
            return;
          }
          
          setProfileLoading(false);
        } catch (error) {
          console.error('Error verificando perfil:', error);
          toast.error('Debes crear tu perfil académico antes de subir apuntes', {
            duration: 5000,
            icon: '📋'
          });
          navigate('/estudiante/perfil-academico', { replace: true });
        }
      } else if (!userLoading && !user) {
        navigate('/login', { replace: true });
      }
    };

    checkProfile();
  }, [user, userLoading, navigate]);

  // Mostrar loading mientras se verifica el perfil
  if (userLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validar nombre del archivo vacío
      if (!file.name || file.name.trim() === '') {
        toast.error('El nombre del archivo no puede estar vacío', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar longitud del nombre
      if (file.name.length > 255) {
        toast.error('El nombre del archivo es demasiado largo (máximo 255 caracteres)', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar caracteres peligrosos
      const dangerousChars = /[<>:"/\\|?*]/;
      if (dangerousChars.test(file.name)) {
        toast.error('El nombre del archivo contiene caracteres no permitidos (< > : " / \\ | ? *)', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar caracteres no ASCII (emojis, acentos especiales)
      // eslint-disable-next-line no-control-regex
      const nonAsciiPattern = /[^\x00-\x7F]/;
      if (nonAsciiPattern.test(file.name)) {
        toast.error('El nombre del archivo debe contener solo caracteres ASCII (sin acentos ni emojis)', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar extensiones múltiples
      const parts = file.name.split('.');
      if (parts.length > 2) {
        toast.error('El archivo no puede tener múltiples extensiones', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar palabras prohibidas
      const forbiddenWords = ['script', 'exec', 'cmd', 'bash', 'powershell', 'virus', 'malware'];
      const filename = file.name.toLowerCase();
      if (forbiddenWords.some(word => filename.includes(word))) {
        toast.error('El nombre del archivo contiene palabras prohibidas', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar tamaño
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`, {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar tipo de archivo
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error(`Tipo de archivo no permitido. Solo se aceptan: ${allowedTypes.join(', ')}`, {
          duration: 5000,
          icon: '❌'
        });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
      toast.success(`Archivo "${file.name}" seleccionado correctamente`, {
        duration: 3000,
        icon: '📎'
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validar nombre del archivo vacío
      if (!file.name || file.name.trim() === '') {
        toast.error('El nombre del archivo no puede estar vacío', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar longitud del nombre
      if (file.name.length > 255) {
        toast.error('El nombre del archivo es demasiado largo (máximo 255 caracteres)', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar caracteres peligrosos
      const dangerousChars = /[<>:"/\\|?*]/;
      if (dangerousChars.test(file.name)) {
        toast.error('El nombre del archivo contiene caracteres no permitidos (< > : " / \\ | ? *)', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar caracteres no ASCII (emojis, acentos especiales)
      // eslint-disable-next-line no-control-regex
      const nonAsciiPattern = /[^\x00-\x7F]/;
      if (nonAsciiPattern.test(file.name)) {
        toast.error('El nombre del archivo debe contener solo caracteres ASCII (sin acentos ni emojis)', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar extensiones múltiples
      const parts = file.name.split('.');
      if (parts.length > 2) {
        toast.error('El archivo no puede tener múltiples extensiones', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar palabras prohibidas
      const forbiddenWords = ['script', 'exec', 'cmd', 'bash', 'powershell', 'virus', 'malware'];
      const filename = file.name.toLowerCase();
      if (forbiddenWords.some(word => filename.includes(word))) {
        toast.error('El nombre del archivo contiene palabras prohibidas', {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar tamaño
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`, {
          duration: 5000,
          icon: '⚠️'
        });
        return;
      }

      // Validar tipo de archivo
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error(`Tipo de archivo no permitido. Solo se aceptan: ${allowedTypes.join(', ')}`, {
          duration: 5000,
          icon: '❌'
        });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
      toast.success(`Archivo "${file.name}" cargado correctamente`, {
        duration: 3000,
        icon: '📎'
      });
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
  };

  const agregarEtiqueta = () => {
    const etiquetaTrimmed = currentEtiqueta.trim();

    if (!etiquetaTrimmed) {
      toast.error('Escribe una etiqueta antes de agregar');
      return;
    }

    if (etiquetaTrimmed.length < 6) {
      toast.error('La etiqueta debe tener al menos 6 caracteres');
      return;
    }

    if (etiquetaTrimmed.length > 20) {
      toast.error('La etiqueta no puede tener más de 20 caracteres');
      return;
    }

    if (etiquetas.includes(etiquetaTrimmed)) {
      toast.error('Esta etiqueta ya existe');
      return;
    }

    if (etiquetas.length >= 5) {
      toast.error('Máximo 5 etiquetas permitidas');
      return;
    }

    setEtiquetas(prev => [...prev, etiquetaTrimmed]);
    setCurrentEtiqueta('');
  };

  const eliminarEtiqueta = (etiquetaAEliminar) => {
    setEtiquetas(prev => prev.filter(et => et !== etiquetaAEliminar));
  };

  const handleKeyPressEtiqueta = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarEtiqueta();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones previas
    if (!user) {
      toast.error('Debes iniciar sesión para subir apuntes');
      navigate('/login');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('El nombre del apunte es obligatorio');
      return;
    }

    if (!formData.authors.trim()) {
      toast.error('Debes especificar al menos un autor');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }

    if (!formData.subject || !formData.subject.trim()) {
      toast.error('Debes seleccionar una asignatura');
      return;
    }

    if (!formData.noteType) {
      toast.error('Debes seleccionar un tipo de apunte');
      return;
    }

    if (!formData.file) {
      toast.error('Debes seleccionar un archivo para subir');
      return;
    }

    // Validar etiquetas (mínimo 1, máximo 5)
    if (etiquetas.length === 0) {
      toast.error('Debes agregar al menos una etiqueta');
      return;
    }

    if (etiquetas.length > 5) {
      toast.error('Máximo 5 etiquetas permitidas');
      return;
    }

    // Validar tamaño del archivo (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (formData.file.size > maxSize) {
      toast.error('El archivo excede el tamaño máximo de 10MB');
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatear fecha a DD-MM-AAAA
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const fechaFormateada = `${day}-${month}-${year}`;

      // Preparar los datos según el backend espera
      const apunteData = {
        nombre: formData.name.trim(),
        descripcion: formData.description.trim(),
        asignatura: formData.subject.trim(),
        tipoApunte: formData.noteType,
        autorSubida: user.nombreCompleto,
        rutAutorSubida: user.rut,
        autores: formData.authors.split(',').map(a => a.trim()).filter(a => a),
        etiquetas: etiquetas.map(e =>
          e
            .normalize('NFD')                
            .replace(/[\u0300-\u036f]/g, '')  
            .toLowerCase()
            .trim()
        ),
        fechaSubida: fechaFormateada
      };

      const response = await crearApunteService(apunteData, formData.file);

      if (response.status === 'Success') {
        toast.success('¡Apunte subido exitosamente!', {
          duration: 4000,
          icon: '🎉'
        });

        // Limpiar formulario
        setFormData({
          name: '',
          authors: '',
          description: '',
          subject: '',
          noteType: '',
          file: null,
        });
        setEtiquetas([]);

        // Opcional: navegar a otra página
        // navigate('/estudiante/mis-apuntes');
      } else {
        toast.error(response.message || 'Error al subir el apunte');
      }
    } catch (error) {
      console.error('Error al subir apunte:', error);

      // Manejo detallado de errores
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = errorData.message || errorData.details;
        const errorCode = errorData.details?.code;

        // Manejar errores específicos de archivo según archivo.middleware.js
        if (errorCode || typeof errorData.details === 'object') {
          switch (errorCode) {
            case 'FILE_TOO_LARGE':
              toast.error(`📦 ${errorMessage}`, {
                duration: 5000
              });
              break;
            case 'TOO_MANY_FILES':
              toast.error(`📁 ${errorMessage}`);
              break;
            case 'UNEXPECTED_FILE':
            case 'INVALID_FIELD_NAME':
              toast.error(`⚠️ ${errorMessage}`);
              break;
            case 'EMPTY_FILENAME':
              toast.error('📝 El nombre del archivo no puede estar vacío');
              break;
            case 'FILENAME_TOO_LONG':
              toast.error('📝 El nombre del archivo es demasiado largo (máximo 255 caracteres)');
              break;
            case 'DANGEROUS_FILENAME':
              toast.error('⚠️ El nombre del archivo contiene caracteres no permitidos (< > : " / \\ | ? *)');
              break;
            case 'NON_ASCII_FILENAME':
              toast.error('⚠️ El nombre del archivo debe contener solo caracteres ASCII (sin acentos ni emojis)');
              break;
            case 'MULTIPLE_EXTENSIONS':
              toast.error('⚠️ El archivo no puede tener múltiples extensiones');
              break;
            case 'FORBIDDEN_FILENAME':
              toast.error('⚠️ El nombre del archivo contiene palabras prohibidas');
              break;
            case 'INVALID_EXTENSION':
              toast.error(`📎 ${errorMessage}`, {
                duration: 5000
              });
              break;
            case 'INVALID_FILE_TYPE':
              toast.error('📎 Tipo de archivo no permitido. Solo se aceptan documentos');
              break;
            case 'MIME_EXTENSION_MISMATCH':
              toast.error('⚠️ El tipo de archivo no coincide con su extensión. El archivo puede estar corrupto', {
                duration: 6000
              });
              break;
            default:
              // Error de contenido inapropiado u otros
              if (errorMessage && errorMessage.includes('contenido inapropiado')) {
                toast.error('⚠️ ' + errorMessage, {
                  duration: 6000
                });
              } else if (errorMessage) {
                toast.error(errorMessage, {
                  duration: 5000
                });
              } else {
                toast.error('Error al subir el apunte. Por favor, intenta nuevamente.');
              }
          }
        } else if (errorMessage) {
          // Error de contenido inapropiado u otros mensajes simples
          if (errorMessage.includes('contenido inapropiado')) {
            toast.error('⚠️ ' + errorMessage, {
              duration: 6000
            });
          } else {
            toast.error(errorMessage, {
              duration: 5000
            });
          }
        } else {
          toast.error('Error al subir el apunte. Por favor, intenta nuevamente.');
        }
      }
      // Error de red o servidor no responde
      else if (error.request) {
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión.', {
          duration: 5000
        });
      }
      // Error desconocido
      else {
        toast.error('Error inesperado. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-full p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6E52D9] to-[#5643A8] px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText size={28} />
              Subir Apunte
            </h2>
            <p className="text-[#CBCDFA] mt-4 text-sm">
              Completa la información para compartir tu apunte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#4D398A] mb-2">
                <PencilLine className="inline mr-1 mb-1" size={16} />
                Nombre del Apunte
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors"
                placeholder="Ej: Resumen de Álgebra Lineal"
              />
            </div>

            <div>
              <label htmlFor="authors" className="block text-sm font-semibold text-[#4D398A] mb-2">
                <Users className="inline mr-1 mb-1" size={16} />
                Autores 
              </label>
              <input
                type="text"
                id="authors"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors"
                placeholder="Ej: Juan Pérez, María García (separados por comas)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa múltiples autores con comas
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-[#4D398A] mb-2">
                <AlignLeft className="inline mr-1 mb-1" size={16} />
                Descripción Breve 
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors resize-none"
                placeholder="Describe brevemente el contenido del apunte..."
              />
            </div>

            {/* Campo de Etiquetas */}
            <div>
              <label className="block text-sm font-semibold text-[#4D398A] mb-2">
                <Tag className="inline mr-1 mb-1" size={16} />
                Etiquetas
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentEtiqueta}
                  onChange={(e) => setCurrentEtiqueta(e.target.value)}
                  onKeyDown={handleKeyPressEtiqueta}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors"
                  placeholder="Escribe una etiqueta y presiona + o Enter (ej: Resolución Certamen)"
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={agregarEtiqueta}
                  className="w-10 h-10 bg-gradient-to-r from-[#6E52D9] to-[#5643A8] text-white rounded-full hover:shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center flex-shrink-0 mt-1"
                  title="Agregar etiqueta"
                >
                  <Plus size={24} />
                </button>
              </div>

              {/* Mostrar etiquetas agregadas */}
              {etiquetas.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {etiquetas.map((etiqueta, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-r from-[#6E52D9] to-[#5643A8] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 animate-fadeIn"
                    >
                      <Tag size={14} />
                      <span>{etiqueta}</span>
                      <button
                        type="button"
                        onClick={() => eliminarEtiqueta(etiqueta)}
                        className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                {etiquetas.length}/10 etiquetas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-[#4D398A] mb-2">
                  <BookOpen className="inline mr-1 mb-1" size={16} />
                  Asignatura *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={loadingAsignaturas}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {loadingAsignaturas ? 'Cargando asignaturas...' : 'Selecciona una asignatura'}
                  </option>
                  {asignaturas.map((asignatura) => (
                    <option key={asignatura._id} value={asignatura.nombre}>
                      {asignatura.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="noteType" className="block text-sm font-semibold text-[#4D398A] mb-2">
                  <FolderOpen className="inline mr-1 mb-1" size={16} />
                  Tipo de Apunte 
                </label>
                <select
                  id="noteType"
                  name="noteType"
                  value={formData.noteType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors bg-white"
                >
                  <option value="" disabled>Selecciona un tipo</option>
                  <option value="Manuscrito">Manuscrito</option>
                  <option value="Documento tipeado">Documento tipeado</option>
                  <option value="Resumen conceptual">Resúmen conceptual</option>
                  <option value="Mapa mental">Mapa mental</option>
                  <option value="Diagrama y/o esquema">Diagrama y/o esquema</option>
                  <option value="Resolucion de ejercicio(s)">Resolución de ejercicio(s)</option>
                  <option value="Flashcard">Flashcard</option>
                  <option value="Formulario">Formulario</option>
                  <option value="Presentacion">Presentación</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4D398A] mb-2">
                <Upload className="inline mr-1 mb-1" size={16} />
                Archivo 
              </label>

              {!formData.file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive
                      ? 'border-[#6E52D9] bg-[#E2E4FD]'
                      : 'border-gray-300 hover:border-[#6E52D9] hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                  />
                  <p className="text-[#4D398A] font-semibold mb-1">
                    Arrastra tu archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, DOCX, TXT, PPT, PPTX (Máx. 10MB)
                  </p>
                </div>
              ) : (
                <div className={`border-2 rounded-lg p-4 ${formData.file.size > 10 * 1024 * 1024
                    ? 'border-red-500 bg-red-50'
                    : 'border-[#6E52D9] bg-[#F5F5FF]'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.file.size > 10 * 1024 * 1024
                          ? 'bg-red-500'
                          : 'bg-[#6E52D9]'
                        }`}>
                        <FileText className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#4D398A]">{formData.file.name}</p>
                        <p className={`text-sm ${formData.file.size > 10 * 1024 * 1024
                            ? 'text-red-600 font-semibold'
                            : 'text-gray-500'
                          }`}>
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                          {formData.file.size > 10 * 1024 * 1024 && ' - ⚠️ Excede 10MB'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X className="text-red-500" size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#6E52D9] to-[#5643A8] text-white font-semibold py-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subiendo apunte...
                </span>
              ) : (
                'Subir Apunte'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
