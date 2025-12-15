import { useState, useContext, useEffect, useRef } from 'react';
import { Upload, FileText, X, Tag, Plus, PencilLine, Users, AlignLeft, BookOpen, FolderOpen, Search, ChevronDown, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { crearApunteService } from '../services/apunte.service';
import { poseePerfilAcademicoService } from '../services/perfilAcademico.service';
import { getAsignaturasService, sugerirEtiquetasAsignaturaService, agregarEtiquetasAsignaturaService } from '../services/asignatura.service';

export default function SubirApunteModal({ isOpen, onClose, onApunteCreated }) {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);

  const [_profileLoading, setProfileLoading] = useState(true);
  const hasCheckedProfile = useRef(false);

  const [formData, setFormData] = useState({
    name: '',
    authors: '',
    description: '',
    subject: '',
    subjectCode: '',
    noteType: '',
    file: null,
  });

  const [etiquetas, setEtiquetas] = useState([]);
  const [currentEtiqueta, setCurrentEtiqueta] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(true);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [etiquetasSugeridas, setEtiquetasSugeridas] = useState([]);
  const [loadingSugerencias, setLoadingSugerencias] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubjectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  useEffect(() => {
    const checkProfile = async () => {
      if (!userLoading && user && !hasCheckedProfile.current && isOpen) {
        hasCheckedProfile.current = true;

        try {
          const response = await poseePerfilAcademicoService(user.rut);

          if (!response.data || !response.data._id) {
            toast.error('Debes crear tu perfil académico antes de subir apuntes', {
              duration: 5000,
              icon: '📋'
            });
            onClose();
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
          onClose();
          navigate('/estudiante/perfil-academico', { replace: true });
        }
      } else if (!userLoading && !user && isOpen) {
        onClose();
        navigate('/login', { replace: true });
      }
    };

    if (isOpen) {
      checkProfile();
    }
  }, [user, userLoading, navigate, isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Permitir letras, números y espacios
      const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/;
      if (value && !namePattern.test(value)) {
        toast.error('El nombre del apunte solo puede contener letras, números y espacios', {
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }
      if (value.length > 50) {
        toast.error('El nombre del apunte no puede tener más de 50 caracteres', {
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }
    }

    if (name === 'authors') {
      const authorsPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,]*$/;
      if (value && !authorsPattern.test(value)) {
        toast.error('Los nombres de autores solo pueden contener letras, espacios y comas', {
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }
    }

    if (name === 'description') {
      if (value.length > 200) {
        toast.error('La descripción no puede tener más de 200 caracteres', {
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (!file.name || file.name.trim() === '') {
        toast.error('El nombre del archivo no puede estar vacío', { duration: 5000, icon: '⚠️' });
        return;
      }

      if (file.name.length > 255) {
        toast.error('El nombre del archivo es demasiado largo (máximo 255 caracteres)', { duration: 5000, icon: '⚠️' });
        return;
      }

      const dangerousChars = /[<>:"/\\|?*]/;
      if (dangerousChars.test(file.name)) {
        toast.error('El nombre del archivo contiene caracteres no permitidos (< > : " / \\ | ? *)', { duration: 5000, icon: '⚠️' });
        return;
      }

      // eslint-disable-next-line no-control-regex
      const nonAsciiPattern = /[^\x00-\x7F]/;
      if (nonAsciiPattern.test(file.name)) {
        toast.error('El nombre del archivo debe contener solo caracteres ASCII (sin acentos ni emojis)', { duration: 5000, icon: '⚠️' });
        return;
      }

      const parts = file.name.split('.');
      if (parts.length > 2) {
        toast.error('El archivo no puede tener múltiples extensiones', { duration: 5000, icon: '⚠️' });
        return;
      }

      const forbiddenWords = ['script', 'exec', 'cmd', 'bash', 'powershell', 'virus', 'malware'];
      const filename = file.name.toLowerCase();
      if (forbiddenWords.some(word => filename.includes(word))) {
        toast.error('El nombre del archivo contiene palabras prohibidas', { duration: 5000, icon: '⚠️' });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`, { duration: 5000, icon: '⚠️' });
        return;
      }

      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error(`Tipo de archivo no permitido. Solo se aceptan: ${allowedTypes.join(', ')}`, { duration: 5000, icon: '❌' });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
      toast.success(`Archivo "${file.name}" seleccionado correctamente`, { duration: 3000, icon: '📎' });
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
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
  };

  const agregarEtiqueta = () => {
    const etiquetaTrimmed = currentEtiqueta.trim();

    if (!etiquetaTrimmed) {
      toast.error('Escribe una etiqueta antes de agregar', { duration: 3000, icon: '⚠️' });
      return;
    }

    // Permitir letras, números y espacios en etiquetas
    const etiquetaPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
    if (!etiquetaPattern.test(etiquetaTrimmed)) {
      toast.error('La etiqueta solo puede contener letras, números y espacios', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (etiquetaTrimmed.length < 3) {
      toast.error('La etiqueta debe tener al menos 3 caracteres', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (etiquetaTrimmed.length > 30) {
      toast.error('La etiqueta no puede tener más de 30 caracteres', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (etiquetas.includes(etiquetaTrimmed.toLowerCase())) {
      toast.error('Esta etiqueta ya existe', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (etiquetas.length >= 5) {
      toast.error('Máximo 5 etiquetas permitidas', { duration: 3000, icon: '⚠️' });
      return;
    }

    setEtiquetas(prev => [...prev, etiquetaTrimmed]);
    setCurrentEtiqueta('');
    toast.success(`Etiqueta "${etiquetaTrimmed}" agregada`, { duration: 2000, icon: '✅' });
  };

  const eliminarEtiqueta = (etiquetaAEliminar) => {
    setEtiquetas(prev => prev.filter(et => et !== etiquetaAEliminar));
  };

  // Fetch tag suggestions when subject CODE changes
  useEffect(() => {
    const fetchSugerencias = async () => {
      const code = formData.subjectCode?.trim();

      // Validate that code exists and is 6 digits
      if (!code || !/^\d{6}$/.test(code)) {
        setEtiquetasSugeridas([]);
        setLoadingSugerencias(false);
        return;
      }

      setLoadingSugerencias(true);
      try {
        const response = await sugerirEtiquetasAsignaturaService(code);
        if (response.status === 'Success' && response.data) {
          setEtiquetasSugeridas(response.data || []);
        } else {
          setEtiquetasSugeridas([]);
        }
      } catch (error) {
        console.error('Error al cargar sugerencias:', error);
        setEtiquetasSugeridas([]);
      } finally {
        setLoadingSugerencias(false);
      }
    };

    fetchSugerencias();
  }, [formData.subjectCode]);

  const agregarEtiquetaSugerida = (etiqueta) => {
    if (etiquetas.includes(etiqueta.toLowerCase())) {
      toast.error('Esta etiqueta ya está agregada', { duration: 2000, icon: '⚠️' });
      return;
    }

    if (etiquetas.length >= 5) {
      toast.error('Máximo 5 etiquetas permitidas', { duration: 3000, icon: '⚠️' });
      return;
    }

    setEtiquetas(prev => [...prev, etiqueta]);
    toast.success(`Etiqueta "${etiqueta}" agregada`, { duration: 2000, icon: '✅' });
  };

  const handleKeyPressEtiqueta = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarEtiqueta();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      authors: '',
      description: '',
      subject: '',
      subjectCode: '',
      noteType: '',
      file: null,
    });
    setEtiquetas([]);
    setCurrentEtiqueta('');
    setEtiquetasSugeridas([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Debes iniciar sesión para subir apuntes', { duration: 4000, icon: '🔒' });
      onClose();
      navigate('/login');
      return;
    }

    if (!formData.name.trim() || formData.name.trim().length < 3 || formData.name.trim().length > 50) {
      toast.error('El nombre del apunte debe tener entre 3 y 50 caracteres', { duration: 3000, icon: '⚠️' });
      return;
    }

    // Permitir letras, números y espacios en nombre
    const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/;
    if (!namePattern.test(formData.name.trim())) {
      toast.error('El nombre del apunte solo puede contener letras, números y espacios', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (!formData.authors.trim()) {
      toast.error('Debes especificar al menos un autor', { duration: 3000, icon: '⚠️' });
      return;
    }

    const autoresArray = formData.authors.split(',').map(a => a.trim()).filter(a => a);

    if (autoresArray.length === 0 || autoresArray.length > 10) {
      toast.error('Debe haber entre 1 y 10 autores', { duration: 3000, icon: '⚠️' });
      return;
    }

    const authorPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    for (const autor of autoresArray) {
      if (autor.length < 5 || autor.length > 60 || !authorPattern.test(autor)) {
        toast.error(`El nombre del autor "${autor}" debe tener entre 5 y 60 caracteres (solo letras)`, { duration: 4000, icon: '⚠️' });
        return;
      }
    }

    if (!formData.description.trim() || formData.description.trim().length < 5 || formData.description.trim().length > 200) {
      toast.error('La descripción debe tener entre 5 y 200 caracteres', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (!formData.subject || !formData.subject.trim()) {
      toast.error('Debes seleccionar una asignatura', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (!formData.noteType) {
      toast.error('Debes seleccionar un tipo de apunte', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (!formData.file) {
      toast.error('Debes seleccionar un archivo para subir', { duration: 3000, icon: '📎' });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (formData.file.size > maxSize) {
      toast.error('El archivo excede el tamaño máximo de 10MB', { duration: 4000, icon: '📦' });
      return;
    }

    if (etiquetas.length === 0 || etiquetas.length > 5) {
      toast.error('Debes agregar entre 1 y 5 etiquetas', { duration: 3000, icon: '🏷️' });
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const fechaFormateada = `${day}-${month}-${year}`;

      const apunteData = {
        nombre: formData.name.trim(),
        descripcion: formData.description.trim(),
        asignatura: formData.subject.trim(),
        tipoApunte: formData.noteType,
        autorSubida: user.nombreCompleto,
        rutAutorSubida: user.rut,
        autores: autoresArray,
        etiquetas: etiquetas.map(e =>
          e
            .toLowerCase()
            .trim()
        ),
        fechaSubida: fechaFormateada
      };

      const response = await crearApunteService(apunteData, formData.file);

      if (response.status === 'Success') {
        // Save tags to the subject for future suggestions
        try {
          await agregarEtiquetasAsignaturaService(formData.subjectCode, etiquetas.map(e => e.toLowerCase().trim()));
        } catch (tagError) {
          console.error('Error al guardar etiquetas en la asignatura:', tagError);
          // Don't show error to user as the upload was successful
        }

        toast.success('¡Apunte subido exitosamente!', { duration: 4000, icon: '🎉' });
        resetForm();
        onClose();

        if (onApunteCreated) {
          onApunteCreated();
        }
      } else {
        toast.error(response.message || 'Error al subir el apunte');
      }
    } catch (error) {
      console.error('Error al subir apunte:', error);

      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = errorData.message || errorData.details;
        toast.error(errorMessage || 'Error al subir el apunte', { duration: 5000 });
      } else if (error.request) {
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión.', { duration: 5000 });
      } else {
        toast.error('Error inesperado. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isFormComplete = formData.name && formData.authors && formData.description &&
    formData.subject && formData.noteType && formData.file &&
    etiquetas.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-8 border-b border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl shadow-lg">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Compartir Apunte
                  </h2>
                  <div className="relative group">
                    <button className="text-gray-400 hover:text-purple-500 cursor-help transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                      Ayuda a otros estudiantes compartiendo tu conocimiento y materiales de estudio
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>

            {isFormComplete && (
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-purple-700 bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-200">
                <CheckCircle2 size={18} />
                <span>Formulario completo - listo para subir</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-purple-600" />
                  Información Básica
                </h3>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <PencilLine size={16} className="text-purple-600" />
                      Nombre del Apunte
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Ej: Resumen de Cálculo Integral"
                    />
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">
                      Letras, números y espacios • 3-50 caracteres
                    </p>
                  </div>

                  <div>
                    <label htmlFor="authors" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Users size={16} className="text-purple-600" />
                      Autores
                    </label>
                    <input
                      type="text"
                      id="authors"
                      name="authors"
                      value={formData.authors}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Ej: Juan Pérez, María García"
                    />
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">
                      Separa con comas • 5-60 caracteres por autor • Máximo 10 autores
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <AlignLeft size={16} className="text-purple-600" />
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                      placeholder="Describe el contenido del apunte..."
                    />
                    <div className="flex justify-between items-center mt-1.5 ml-1">
                      <p className="text-xs text-gray-500">5-200 caracteres</p>
                      <p className={`text-xs font-medium ${formData.description.length > 180 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {formData.description.length}/200
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag size={20} className="text-violet-600" />
                  Etiquetas y Clasificación
                </h3>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative" ref={dropdownRef}>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <BookOpen size={16} className="text-violet-600" />
                        Asignatura
                      </label>

                      <div
                        className="relative"
                        onClick={() => !loadingAsignaturas && setShowSubjectDropdown(!showSubjectDropdown)}
                      >
                        <div className={`w-full px-4 py-3 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${showSubjectDropdown ? 'border-violet-500 ring-2 ring-violet-200' : 'border-gray-300 hover:border-violet-400'}`}>
                          <span className={formData.subject ? 'text-gray-900' : 'text-gray-500'}>
                            {formData.subject || (loadingAsignaturas ? 'Cargando...' : 'Selecciona')}
                          </span>
                          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {showSubjectDropdown && (
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col">
                          <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <div className="relative">
                              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={subjectSearch}
                                onChange={(e) => setSubjectSearch(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="overflow-y-auto flex-1">
                            {asignaturas
                              .filter(asig => asig.nombre.toLowerCase().includes(subjectSearch.toLowerCase()))
                              .map((asignatura) => (
                                <button
                                  key={asignatura._id}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      subject: asignatura.nombre,
                                      subjectCode: asignatura.codigo
                                    }));
                                    setShowSubjectDropdown(false);
                                    setSubjectSearch('');
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-50 transition-colors ${formData.subject === asignatura.nombre ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700'}`}
                                >
                                  {asignatura.nombre}
                                </button>
                              ))
                            }
                            {asignaturas.filter(asig => asig.nombre.toLowerCase().includes(subjectSearch.toLowerCase())).length === 0 && (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No se encontraron asignaturas
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="noteType" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FolderOpen size={16} className="text-violet-600" />
                        Tipo de Apunte
                      </label>
                      <select
                        id="noteType"
                        name="noteType"
                        value={formData.noteType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 outline-none appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="" disabled>Selecciona un tipo</option>
                        <option value="Manuscrito">Manuscrito</option>
                        <option value="Documento tipeado">Documento tipeado</option>
                        <option value="Resumen conceptual">Resumen conceptual</option>
                        <option value="Mapa mental">Mapa mental</option>
                        <option value="Diagrama y/o esquema">Diagrama y/o esquema</option>
                        <option value="Resolucion de ejercicio(s)">Resolución de ejercicio(s)</option>
                        <option value="Flashcard">Flashcard</option>
                        <option value="Formulario">Formulario</option>
                        <option value="Presentacion">Presentación</option>
                        <option value="Guia de ejercicios">Guía de ejercicios</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Etiquetas
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentEtiqueta}
                        onChange={(e) => setCurrentEtiqueta(e.target.value)}
                        onKeyDown={handleKeyPressEtiqueta}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="Escribe una etiqueta"
                        maxLength={30}
                      />
                      <button
                        type="button"
                        onClick={agregarEtiqueta}
                        className="px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                      >
                        <Plus size={20} />
                        Agregar
                      </button>
                    </div>

                    {etiquetas.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {etiquetas.map((etiqueta, index) => (
                          <div
                            key={index}
                            className="group bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Tag size={14} />
                            <span>{etiqueta}</span>
                            <button
                              type="button"
                              onClick={() => eliminarEtiqueta(etiqueta)}
                              className="ml-1 hover:bg-white/25 rounded-full p-1 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2 ml-1">
                      {etiquetas.length}/5 etiquetas • Letras, números y espacios • 3-30 caracteres
                    </p>

                    {/* Sugerencias de etiquetas */}
                    {formData.subject && etiquetasSugeridas.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-violet-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-violet-600" />
                            Sugerencias basadas en "{formData.subject}"
                          </p>
                          <span className="text-xs text-gray-500">
                            {etiquetasSugeridas.length} {etiquetasSugeridas.length === 1 ? 'sugerencia' : 'sugerencias'}
                          </span>
                        </div>
                        <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                          <div className="flex flex-wrap gap-2">
                            {etiquetasSugeridas.map((etiqueta, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => agregarEtiquetaSugerida(etiqueta)}
                                disabled={etiquetas.includes(etiqueta.toLowerCase())}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 flex-shrink-0 ${etiquetas.includes(etiqueta.toLowerCase())
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300'
                                  }`}
                              >
                                {etiqueta}
                              </button>
                            ))}
                          </div>
                        </div>
                        {etiquetasSugeridas.length > 10 && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            💡 Usa scroll para ver más sugerencias
                          </p>
                        )}
                      </div>
                    )}

                    {loadingSugerencias && formData.subject && (
                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                        <div className="animate-spin h-3 w-3 border-2 border-violet-600 border-t-transparent rounded-full"></div>
                        Cargando sugerencias...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Upload size={20} className="text-cyan-600" />
                  Archivo del Apunte
                </h3>

                {!formData.file ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${dragActive
                      ? 'border-cyan-500 bg-cyan-100 scale-[1.02]'
                      : 'border-gray-300 hover:border-cyan-400 hover:bg-cyan-50'
                      }`}
                  >
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${dragActive ? 'bg-cyan-200 scale-110' : 'bg-cyan-100 group-hover:scale-110'}`}>
                        <Upload className="text-cyan-600" size={40} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 mb-1">
                          Arrastra tu archivo aquí
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          o haz clic para seleccionar
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
                          <FileText size={16} />
                          PDF, DOC, DOCX, TXT, PPT, PPTX
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Tamaño máximo: 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-cyan-200 rounded-2xl p-5 bg-gradient-to-br from-cyan-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-md">
                          <FileText className="text-white" size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{formData.file.name}</p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="ml-3 p-2.5 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200"
                        aria-label="Eliminar archivo"
                      >
                        <X size={22} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isFormComplete}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Subir Apunte</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
