import { useState, useContext, useEffect, useRef } from 'react';
import { Upload, FileText, X, Tag, Plus, PencilLine, Users, AlignLeft, BookOpen, FolderOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { crearApunteService } from '../services/apunte.service';
import { poseePerfilAcademicoService } from '../services/perfilAcademico.service';
import { getAsignaturasService } from '../services/asignatura.service';

export default function SubirApunteModal({ isOpen, onClose, onApunteCreated }) {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);
  
  const [_profileLoading, setProfileLoading] = useState(true);
  const hasCheckedProfile = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const [modalWidth, setModalWidth] = useState(768); // Ancho inicial en px (equivalente a max-w-3xl)
  const modalRef = useRef(null);

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

  // Cargar asignaturas al abrir el modal
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

  // Verificar perfil académico
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

  // Manejar redimensionamiento del modal
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX - (modalRef.current?.getBoundingClientRect().left || 0);
      // Limitar entre 640px (min) y 1200px (max)
      if (newWidth >= 640 && newWidth <= 1200) {
        setModalWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
      if (value && !namePattern.test(value)) {
        toast.error('El nombre del apunte solo puede contener letras y espacios', {
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
      // Usar la misma validación que handleFileChange
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

    const etiquetaPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!etiquetaPattern.test(etiquetaTrimmed)) {
      toast.error('La etiqueta solo puede contener letras y espacios', { duration: 3000, icon: '⚠️' });
      return;
    }

    if (etiquetaTrimmed.length < 6) {
      toast.error('La etiqueta debe tener al menos 6 caracteres', { duration: 3000, icon: '⚠️' });
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
      noteType: '',
      file: null,
    });
    setEtiquetas([]);
    setCurrentEtiqueta('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Debes iniciar sesión para subir apuntes', { duration: 4000, icon: '🔒' });
      onClose();
      navigate('/login');
      return;
    }

    // Validaciones
    if (!formData.name.trim() || formData.name.trim().length < 3 || formData.name.trim().length > 50) {
      toast.error('El nombre del apunte debe tener entre 3 y 50 caracteres', { duration: 3000, icon: '⚠️' });
      return;
    }

    const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!namePattern.test(formData.name.trim())) {
      toast.error('El nombre del apunte solo puede contener letras y espacios', { duration: 3000, icon: '⚠️' });
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
      if (autor.length < 15 || autor.length > 50 || !authorPattern.test(autor)) {
        toast.error(`El nombre del autor "${autor}" debe tener entre 15 y 50 caracteres (solo letras)`, { duration: 4000, icon: '⚠️' });
        return;
      }
    }

    if (!formData.description.trim() || formData.description.trim().length < 10 || formData.description.trim().length > 200) {
      toast.error('La descripción debe tener entre 10 y 200 caracteres', { duration: 3000, icon: '⚠️' });
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
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
        ),
        fechaSubida: fechaFormateada
      };

      const response = await crearApunteService(apunteData, formData.file);

      if (response.status === 'Success') {
        toast.success('¡Apunte subido exitosamente!', { duration: 4000, icon: '🎉' });
        resetForm();
        onClose();
        
        // Notificar al componente padre para que recargue los apuntes
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop - Ajusta bg-opacity-40 para cambiar transparencia (valores: 10, 20, 30, 40, 50, 60, etc.) */}
      <div 
        className="fixed inset-0 bg-gray-5 bg-opacity-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          ref={modalRef}
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8"
          style={{ width: `${modalWidth}px`, maxWidth: '95vw' }}
        >
          <div className="bg-gradient-to-r from-[#6E52D9] to-[#5643A8] px-8 py-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FileText size={28} />
                  Subir Apunte
                </h2>
                <p className="text-[#CBCDFA] mt-2 text-sm">
                  Completa la información para compartir tu apunte
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 transition-colors"
              title="Arrastra para redimensionar"
            >
              <div className="h-full w-1 bg-white/30 ml-auto"></div>
            </div>
          </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
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
                    <p className="text-xs text-gray-500 mt-1">
                      Solo letras y espacios • Mínimo 3 caracteres, máximo 50 caracteres
                    </p>
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
                      placeholder="Ej: Juan Pérez González, María García López"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separa múltiples autores con comas • Mínimo 15 caracteres por autor, máximo 50 • Máximo 10 autores
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
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 10 caracteres, máximo 200 caracteres • {formData.description.length}/200
                    </p>
                  </div>

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
                        placeholder="Escribe una etiqueta y presiona + o Enter"
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

                    {etiquetas.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {etiquetas.map((etiqueta, index) => (
                          <div
                            key={index}
                            className="group relative bg-gradient-to-r from-[#6E52D9] to-[#5643A8] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
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
                      {etiquetas.length}/5 etiquetas • Mínimo 6 caracteres, máximo 30 caracteres por etiqueta
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
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                          dragActive
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
                      <div className="border-2 rounded-lg p-4 border-[#6E52D9] bg-[#F5F5FF]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#6E52D9]">
                              <FileText className="text-white" size={24} />
                            </div>
                            <div>
                              <p className="font-semibold text-[#4D398A]">{formData.file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB
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

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-[#6E52D9] to-[#5643A8] text-white font-semibold py-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                  </div>
                </form>
        </div>
      </div>
    </div>
  );
}
