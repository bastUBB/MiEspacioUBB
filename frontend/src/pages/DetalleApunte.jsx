import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { toast } from 'react-hot-toast';
import {
  BookOpen, Download, Star, Eye, Calendar, Tag, User, MessageSquare,
  ThumbsUp, Share2, Bookmark, Clock, Award, TrendingUp, Send,
  ChevronRight, FileText, Heart, MoreVertical, Flag, Users, Loader2, ChevronLeft
} from 'lucide-react';
import Header from '../components/header';
import ReportModal from '../components/ReportModal';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  sumarVisualizacionUsuariosApunteService,
  realizarValoracionApunteService,
  obtenerValoracionUsuarioApunteService,
  actualizarValoracionApunteService,
  crearComentarioApunteService,
  obtenerApuntePorIdService,
  busquedaApuntesMismoAutorService,
  busquedaApuntesMismaAsignaturaService,
  obtenerLinkDescargaApunteURLFirmadaService,
  darLikeComentarioService,
  darDislikeComentarioService,
  crearRespuestaComentarioApunteService,
  registrarDescargaApunteService
} from '../services/apunte.service';

// Configurar worker de PDF.js usando CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function DetalleApunte() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apunte, setApunte] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [otrosApuntesAutor, setOtrosApuntesAutor] = useState([]);
  const [apuntesRelacionados, setApuntesRelacionados] = useState([]);
  const visualizacionRegistrada = useRef(false);
  const [respuestaActiva, setRespuestaActiva] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [userLikesMap, setUserLikesMap] = useState({});
  const [userDislikesMap, setUserDislikesMap] = useState({});

  // Estados para el visor PDF
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    // Validar que el ID existe y no está undefined
    if (!id || id === 'undefined') {
      console.error('ID de apunte inválido:', id);
      toast.error('ID de apunte inválido');
      navigate('/estudiante/home');
      return;
    }

    // Resetear el flag de visualización cuando cambia el apunte
    visualizacionRegistrada.current = false;

    // Cargar apunte cuando cambia el ID
    loadApunte();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadApunte = async () => {
    try {
      setLoading(true);

      // Obtener apunte por ID
      const responseApunte = await obtenerApuntePorIdService(id);

      // El backend devuelve 'status' no 'state'
      if (responseApunte.status === 'Success' && responseApunte.data) {
        const apunteData = responseApunte.data;
        setApunte(apunteData);

        // Cargar comentarios del apunte (ya vienen desde el backend)
        if (apunteData.comentarios && apunteData.comentarios.length > 0) {
          setComentarios(apunteData.comentarios);

          // Crear mapa de likes/dislikes del usuario
          if (user && user.rut) {
            const likesMap = {};
            const dislikesMap = {};
            apunteData.comentarios.forEach(com => {
              if (com.usuariosLikes && com.usuariosLikes.includes(user.rut)) {
                likesMap[com._id] = true;
              }
              if (com.usuariosDislikes && com.usuariosDislikes.includes(user.rut)) {
                dislikesMap[com._id] = true;
              }
            });
            setUserLikesMap(likesMap);
            setUserDislikesMap(dislikesMap);
          }
        } else {
          setComentarios([]);
        }

        // Cargar valoración del usuario si está logueado
        if (user && user.rut) {
          try {
            const responseValoracion = await obtenerValoracionUsuarioApunteService(id, user.rut);
            if (responseValoracion.status === 'Success' && responseValoracion.data) {
              setUserRating(responseValoracion.data.valoracion);
            } else {
              setUserRating(0);
            }
          } catch {
            // El usuario no ha valorado aún
            setUserRating(0);
          }
        } else {
          setUserRating(0);
        }

        // Registrar visualización solo una vez y si el usuario está logueado
        if (user && user.rut && !visualizacionRegistrada.current) {
          try {
            await sumarVisualizacionUsuariosApunteService(id, user.rut);
            visualizacionRegistrada.current = true;
          } catch {
            console.log('No se pudo registrar la visualización');
          }
        }

        // Buscar otros apuntes del mismo autor (solo si no están cargados)
        if (otrosApuntesAutor.length === 0 && user?.rut) {
          try {
            const responseOtrosAutor = await busquedaApuntesMismoAutorService(
              user.rut,
              apunteData.asignatura
            );
            if (responseOtrosAutor.status === 'Success' && responseOtrosAutor.data) {
              setOtrosApuntesAutor(responseOtrosAutor.data);
            }
          } catch {
            console.log('No se pudieron cargar otros apuntes del autor');
          }
        }

        // Buscar apuntes de la misma asignatura (solo si no están cargados)
        if (apuntesRelacionados.length === 0 && user?.rut) {
          try {
            const responseRelacionados = await busquedaApuntesMismaAsignaturaService(
              user.rut,
              apunteData.asignatura
            );
            if (responseRelacionados.status === 'Success' && responseRelacionados.data) {
              setApuntesRelacionados(responseRelacionados.data);
            }
          } catch {
            console.log('No se pudieron cargar apuntes relacionados');
          }
        }

        // Cargar URL del PDF para visualización
        loadPdfUrl();
      } else {
        console.error('Respuesta sin éxito:', responseApunte);
        toast.error(`No se pudo cargar el apunte: ${responseApunte.message || 'Error desconocido'}`);
        navigate('/estudiante/home');
      }
    } catch (error) {
      console.error('Error al cargar apunte:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
      toast.error(`Error al cargar el apunte: ${errorMsg}`);
      navigate('/estudiante/home');
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para recargar solo los comentarios
  const loadComentarios = async () => {
    try {
      // Obtener apunte por ID para actualizar comentarios
      const responseApunte = await obtenerApuntePorIdService(id);

      if (responseApunte.status === 'Success' && responseApunte.data) {
        const apunteData = responseApunte.data;

        // Actualizar solo comentarios
        if (apunteData.comentarios && apunteData.comentarios.length > 0) {
          setComentarios(apunteData.comentarios);

          // Actualizar mapa de likes/dislikes del usuario
          if (user && user.rut) {
            const likesMap = {};
            const dislikesMap = {};
            apunteData.comentarios.forEach(com => {
              if (com.usuariosLikes && com.usuariosLikes.includes(user.rut)) {
                likesMap[com._id] = true;
              }
              if (com.usuariosDislikes && com.usuariosDislikes.includes(user.rut)) {
                dislikesMap[com._id] = true;
              }
            });
            setUserLikesMap(likesMap);
            setUserDislikesMap(dislikesMap);
          }
        } else {
          setComentarios([]);
        }

        // Actualizar también el objeto apunte para reflejar cambios en contadores
        setApunte(prevApunte => ({
          ...prevApunte,
          comentarios: apunteData.comentarios
        }));
      }
    } catch (error) {
      console.error('Error al recargar comentarios:', error);
      // No mostrar error al usuario, es una actualización en segundo plano
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      toast.error('Debes iniciar sesión para valorar');
      return;
    }

    // Validar que no sea el autor del apunte
    if (apunte && user.rut === apunte.rutAutorSubida) {
      toast.error('No puedes valorar tu propio apunte');
      return;
    }

    try {
      let response;

      // Si ya tiene valoración, actualizar; si no, crear nueva
      if (userRating > 0) {
        response = await actualizarValoracionApunteService(id, user.rut, rating);
      } else {
        response = await realizarValoracionApunteService(id, user.rut, rating);
      }

      // Verificar el status de la respuesta
      if (response.status === 'Success') {
        // Actualizar el rating del usuario primero
        setUserRating(rating);

        // Actualizar la valoración en el estado del apunte inmediatamente
        if (response.data && response.data.valoracion) {
          setApunte(prev => ({
            ...prev,
            valoracion: response.data.valoracion
          }));
        }

        // Mostrar mensaje de éxito
        const mensaje = userRating > 0 ? 'Valoración actualizada exitosamente' : 'Valoración registrada exitosamente';
        toast.success(mensaje);
      } else {
        toast.error(response.message || 'Error al procesar valoración');
      }
    } catch (err) {
      console.error('Error en valoración:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.details || err.message || 'Error al procesar valoración';

      // Si el error indica que ya valoró pero tiene status Client error, es un mensaje informativo
      if (errorMessage.includes('ya valoró') || errorMessage.includes('ya has valorado')) {
        // Actualizar el rating del usuario
        setUserRating(rating);
        toast.success(userRating > 0 ? 'Valoración actualizada exitosamente' : 'Valoración registrada exitosamente');
      } else if (errorMessage.includes('propio apunte')) {
        toast.error('No puedes valorar tu propio apunte');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDownload = async () => {
    try {
      if (!downloadUrl) {
        toast.error('URL de descarga no disponible');
        return;
      }

      const toastId = toast.loading('Preparando descarga...');

      // Fetch el archivo y crear un blob para descarga directa
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Error al obtener el archivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal y hacer click para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = apunte.archivo?.nombreOriginal || 'apunte.pdf';
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Registrar la descarga en el backend
      if (user && user.rut) {
        await registrarDescargaApunteService(id);
        // Recargar el apunte para actualizar el contador de descargas
        loadComentarios();
      }

      toast.success('Descarga iniciada', { id: toastId });
    } catch (error) {
      console.error('Error al descargar:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  const loadPdfUrl = async () => {
    try {
      setLoadingPdf(true);
      setPdfError(null);

      const response = await obtenerLinkDescargaApunteURLFirmadaService(id);

      if (response.status === 'Success' && response.data) {
        setPdfUrl(response.data.url);
        setDownloadUrl(response.data.url);
      } else {
        setPdfError('No se pudo obtener el PDF');
        toast.error('Error al cargar el PDF');
      }
    } catch (error) {
      console.error('Error al obtener URL del PDF:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      setPdfError(error.response?.data?.message || 'Error al cargar el PDF');
      toast.error('Error al cargar el PDF');
    } finally {
      setLoadingPdf(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error al cargar documento PDF:', error);
    setPdfError('Error al renderizar el PDF');
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado al portapapeles');
    } catch (error) {
      console.error('Error al copiar enlace:', error);
      toast.error('No se pudo copiar el enlace');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando apunte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!apunte) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600">No se encontró el apunte</p>
          </div>
        </div>
      </div>
    );
  }

  const handleHomeClick = () => navigate('/estudiante/home');
  const handleProfileClick = () => navigate('/estudiante/profile');
  const handleExplorarClick = () => navigate('/estudiante/explorar');
  const handleMisApuntesClick = () => navigate('/estudiante/mis-aportes');
  const handleEstadisticasClick = () => navigate('/estudiante/estadisticas');
  const handleConfigClick = () => navigate('/estudiante/configuracion');

  const handleLogout = () => {
    // Limpiar token y datos del usuario
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('user');
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  };

  const handleNavigateToProfile = (rut) => {
    navigate(`/estudiante/profile/${rut}`);
  };

  const handleComentario = async () => {
    if (!comentario.trim()) {
      toast.error('Escribe un comentario');
      return;
    }

    try {
      // Obtener fecha actual en formato DD-MM-YYYY
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const fechaComentario = `${day}-${month}-${year}`;

      const comentarioData = {
        rutAutor: user.rut,
        comentario: comentario,
        fechaComentario: fechaComentario
      };
      const response = await crearComentarioApunteService(id, comentarioData);

      if (response.status === 'Success') {
        setComentario('');
        toast.success('Comentario publicado');
        loadComentarios();
      } else {
        toast.error(response.message || 'Error al publicar comentario');
      }
    } catch (error) {
      console.error('Error al publicar comentario:', error);
      const errorMessage = error.response?.data?.details || error.response?.data?.message || error.message || 'Error al publicar comentario';
      toast.error(errorMessage);
    }
  };

  const handleLike = async (comentarioId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para dar like');
      return;
    }

    // Verificar si ya dio like ANTES de hacer la petición
    if (userLikesMap[comentarioId]) {
      toast.error('Ya has dado like a este comentario');
      return;
    }

    try {
      const response = await darLikeComentarioService(comentarioId);
      if (response.status === 'Success') {
        // Actualizar mapas locales PRIMERO para feedback visual inmediato
        setUserLikesMap(prev => ({ ...prev, [comentarioId]: true }));
        setUserDislikesMap(prev => {
          const newMap = { ...prev };
          delete newMap[comentarioId];
          return newMap;
        });

        // Actualizar el contador localmente para feedback visual inmediato
        setComentarios(prev => prev.map(com => {
          if (com._id === comentarioId) {
            const yaTenieDislike = userDislikesMap[comentarioId];
            return {
              ...com,
              Likes: (com.Likes || 0) + 1,
              Dislikes: yaTenieDislike ? Math.max(0, (com.Dislikes || 0) - 1) : (com.Dislikes || 0),
              usuariosLikes: [...(com.usuariosLikes || []), user.rut],
              usuariosDislikes: yaTenieDislike ? (com.usuariosDislikes || []).filter(rut => rut !== user.rut) : (com.usuariosDislikes || [])
            };
          }
          return com;
        }));

        toast.success('Like agregado');
      } else if (response.status === 'Client error') {
        toast.error(response.details || response.message || 'Ya has dado like a este comentario');
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.message || error.message || 'Error al dar like';
      // Si el mensaje contiene "ya has dado like" o es un ID, mostrar mensaje amigable
      if (/^[a-f0-9]{24}$/i.test(errorMsg) || errorMsg.includes('ya has dado like') || errorMsg.includes('Ya has dado like')) {
        toast.error('Ya has dado like a este comentario');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleDislike = async (comentarioId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para dar dislike');
      return;
    }

    // Verificar si ya dio dislike ANTES de hacer la petición
    if (userDislikesMap[comentarioId]) {
      toast.error('Ya has dado dislike a este comentario');
      return;
    }

    try {
      const response = await darDislikeComentarioService(comentarioId);
      if (response.status === 'Success') {
        // Actualizar mapas locales PRIMERO para feedback visual inmediato
        setUserDislikesMap(prev => ({ ...prev, [comentarioId]: true }));
        setUserLikesMap(prev => {
          const newMap = { ...prev };
          delete newMap[comentarioId];
          return newMap;
        });

        // Actualizar el contador localmente para feedback visual inmediato
        setComentarios(prev => prev.map(com => {
          if (com._id === comentarioId) {
            const yaTenieLike = userLikesMap[comentarioId];
            return {
              ...com,
              Dislikes: (com.Dislikes || 0) + 1,
              Likes: yaTenieLike ? Math.max(0, (com.Likes || 0) - 1) : (com.Likes || 0),
              usuariosDislikes: [...(com.usuariosDislikes || []), user.rut],
              usuariosLikes: yaTenieLike ? (com.usuariosLikes || []).filter(rut => rut !== user.rut) : (com.usuariosLikes || [])
            };
          }
          return com;
        }));

        toast.success('Dislike agregado');
      } else if (response.status === 'Client error') {
        toast.error(response.details || response.message || 'Ya has dado dislike a este comentario');
      }
    } catch (error) {
      console.error('Error al dar dislike:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.message || error.message || 'Error al dar dislike';
      // Si el mensaje contiene "ya has dado dislike" o es un ID, mostrar mensaje amigable
      if (/^[a-f0-9]{24}$/i.test(errorMsg) || errorMsg.includes('ya has dado dislike') || errorMsg.includes('Ya has dado dislike')) {
        toast.error('Ya has dado dislike a este comentario');
      } else if (errorMsg.includes('propio comentario')) {
        toast.error('No puedes dar dislike a tu propio comentario');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleResponder = (comentarioId) => {
    setRespuestaActiva(comentarioId);
  };

  const handleCancelarRespuesta = () => {
    setRespuestaActiva(null);
    setTextoRespuesta('');
  };

  const handleEnviarRespuesta = async (comentarioId) => {
    if (!textoRespuesta.trim()) {
      toast.error('Escribe una respuesta');
      return;
    }

    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const fechaComentario = `${day}-${month}-${year}`;

      const respuestaData = {
        comentarioPadreID: comentarioId,
        rutAutor: user.rut,
        comentario: textoRespuesta,
        fechaComentario: fechaComentario
      };

      const response = await crearRespuestaComentarioApunteService(id, respuestaData);

      if (response.status === 'Success') {
        setTextoRespuesta('');
        setRespuestaActiva(null);
        toast.success('Respuesta publicada');
        loadComentarios();
      } else {
        toast.error(response.message || 'Error al publicar respuesta');
      }
    } catch (error) {
      console.error('Error al publicar respuesta:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al publicar respuesta';
      toast.error(errorMessage);
    }
  };



  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
        onLogout={handleLogout}
        onConfigClick={handleConfigClick}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>

          <div className="relative px-8 pb-8 pt-20">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-xl ring-4 ring-white">
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-purple-600">
                    <BookOpen className="w-12 h-12" />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white tracking-tight">{apunte.nombre}</h1>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {apunte.tipoApunte}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-semibold">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {apunte.asignatura}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {apunte.autorSubida}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {(() => {
                      if (!apunte.fechaSubida) return 'Fecha desconocida';
                      try {
                        // Intentar parsear formato DD-MM-YYYY
                        if (apunte.fechaSubida.includes('-')) {
                          const parts = apunte.fechaSubida.split('-');
                          if (parts.length === 3) {
                            // Asumir DD-MM-YYYY
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1;
                            const year = parseInt(parts[2], 10);
                            const date = new Date(year, month, day);
                            if (!isNaN(date.getTime())) {
                              return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                            }
                          }
                        }
                        // Intentar parsear como fecha estándar
                        const date = new Date(apunte.fechaSubida);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                        }
                        return apunte.fechaSubida;
                      } catch {
                        return apunte.fechaSubida;
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Descripción y Contenido */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 leading-relaxed text-base mb-6">
                  {apunte.descripcion}
                </p>

                {/* Autores */}
                {apunte.autores && apunte.autores.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Autores del Contenido
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {apunte.autores.map((autor, index) => (
                        <span key={index} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                          {autor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etiquetas */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {apunte.etiquetas.map((etiqueta, index) => (
                      <span key={index} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer">
                        #{etiqueta}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Área de Lectura del Documento */}
              <div className="border-t border-gray-100 bg-gray-50 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Vista Previa del Documento
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{formatBytes(apunte.archivo.tamano)}</span>
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow-md group"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all group"
                      title="Compartir"
                    >
                      <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Visor de PDF */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  {loadingPdf && (
                    <div className="flex flex-col items-center justify-center p-12">
                      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                      <p className="text-gray-600">Cargando documento PDF...</p>
                    </div>
                  )}

                  {pdfError && !loadingPdf && (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <FileText className="w-16 h-16 text-red-300 mx-auto mb-4" />
                      <p className="text-red-600 mb-2 font-medium">Error al cargar el documento</p>
                      <p className="text-sm text-gray-500">{pdfError}</p>
                      <button
                        onClick={loadPdfUrl}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}

                  {!loadingPdf && !pdfError && pdfUrl && (
                    <>
                      <div className="flex items-center justify-center bg-gray-100 p-4 overflow-x-auto">
                        <Document
                          file={pdfUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={onDocumentLoadError}
                          loading={
                            <div className="flex flex-col items-center justify-center p-12">
                              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                              <span className="text-gray-600">Cargando PDF...</span>
                            </div>
                          }
                          error={
                            <div className="text-center p-8">
                              <FileText className="w-12 h-12 text-red-300 mx-auto mb-3" />
                              <p className="text-red-600 font-medium mb-2">Error al cargar el PDF</p>
                              <p className="text-sm text-gray-500">Verifica que el archivo existe y es un PDF válido</p>
                            </div>
                          }
                        >
                          <Page
                            pageNumber={pageNumber}
                            width={Math.min(window.innerWidth * 0.55, 750)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={
                              <div className="flex items-center justify-center p-12">
                                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                              </div>
                            }
                          />
                        </Document>
                      </div>

                      {/* Controles de navegación del PDF */}
                      {numPages && numPages > 1 && (
                        <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-t border-gray-200">
                          <button
                            onClick={previousPage}
                            disabled={pageNumber <= 1}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                          </button>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Página</span>
                            <input
                              type="number"
                              min="1"
                              max={numPages}
                              value={pageNumber}
                              onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= numPages) {
                                  setPageNumber(page);
                                }
                              }}
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <span className="text-gray-600">de {numPages}</span>
                          </div>

                          <button
                            onClick={nextPage}
                            disabled={pageNumber >= numPages}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center">
                          {apunte.archivo.nombreOriginal}
                        </p>
                      </div>
                    </>
                  )}

                  {!loadingPdf && !pdfError && !pdfUrl && (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No se pudo cargar la vista previa</p>
                      <p className="text-sm text-gray-400">{apunte.archivo.nombreOriginal}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de Comentarios */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Comentarios ({comentarios.length + comentarios.reduce((acc, com) => acc + (com.respuestas ? com.respuestas.length : 0), 0)})
                </h2>
                <p className="text-sm text-gray-500 mt-1">Comparte tu opinión sobre este apunte</p>
              </div>

              <div className="p-6">
                {/* Escribir Comentario */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {user?.nombreCompleto?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                        rows="3"
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={handleComentario}
                          className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                        >
                          <Send className="w-4 h-4" />
                          Publicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de Comentarios */}
                <div className="space-y-4">
                  {comentarios.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Aún no hay comentarios</p>
                      <p className="text-sm text-gray-400 mt-1">Sé el primero en comentar este apunte</p>
                    </div>
                  ) : (
                    comentarios.map((com) => (
                      <div key={com._id} className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all border border-transparent hover:border-purple-100">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {com.autorNombre ? com.autorNombre.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{com.autorNombre || 'Usuario desconocido'}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {(() => {
                                  if (!com.fechaComentario) return 'Fecha desconocida';
                                  try {
                                    // Intentar parsear formato DD-MM-YYYY
                                    if (com.fechaComentario.includes('-')) {
                                      const parts = com.fechaComentario.split('-');
                                      if (parts.length === 3) {
                                        // Asumir DD-MM-YYYY
                                        const day = parseInt(parts[0], 10);
                                        const month = parseInt(parts[1], 10) - 1;
                                        const year = parseInt(parts[2], 10);
                                        const date = new Date(year, month, day);
                                        if (!isNaN(date.getTime())) {
                                          return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                                        }
                                      }
                                    }
                                    // Intentar parsear como fecha estándar
                                    const date = new Date(com.fechaComentario);
                                    if (!isNaN(date.getTime())) {
                                      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                                    }
                                    return com.fechaComentario;
                                  } catch {
                                    return com.fechaComentario;
                                  }
                                })()}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-2">{com.comentario}</p>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLike(com._id)}
                                className={`flex items-center gap-1 text-xs transition-all ${userLikesMap[com._id]
                                  ? 'text-green-600 font-semibold scale-110'
                                  : 'text-gray-500 hover:text-green-600 hover:scale-105'
                                  }`}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${userLikesMap[com._id] ? 'fill-green-600' : ''
                                  }`} />
                                <span>{com.Likes || 0}</span>
                              </button>
                              <button
                                onClick={() => handleDislike(com._id)}
                                className={`flex items-center gap-1 text-xs transition-all ${userDislikesMap[com._id]
                                  ? 'text-red-600 font-semibold scale-110'
                                  : 'text-gray-500 hover:text-red-600 hover:scale-105'
                                  }`}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 rotate-180 ${userDislikesMap[com._id] ? 'fill-red-600' : ''
                                  }`} />
                                <span>{com.Dislikes || 0}</span>
                              </button>
                              <button
                                onClick={() => handleResponder(com._id)}
                                className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
                              >
                                Responder
                              </button>
                            </div>

                            {/* Formulario de respuesta */}
                            {respuestaActiva === com._id && (
                              <div className="mt-3 ml-4 border-l-2 border-purple-200 pl-4">
                                <textarea
                                  value={textoRespuesta}
                                  onChange={(e) => setTextoRespuesta(e.target.value)}
                                  placeholder="Escribe tu respuesta..."
                                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                  rows="2"
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleEnviarRespuesta(com._id)}
                                    className="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                  >
                                    Enviar
                                  </button>
                                  <button
                                    onClick={handleCancelarRespuesta}
                                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Lista de Respuestas */}
                            {com.respuestas && com.respuestas.length > 0 && (
                              <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
                                {com.respuestas.map((resp) => (
                                  <div key={resp._id} className="bg-white rounded-lg p-3 border border-gray-100">
                                    <div className="flex gap-2">
                                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                        {resp.autorNombre ? resp.autorNombre.charAt(0).toUpperCase() : 'U'}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-gray-900 text-sm">{resp.autorNombre || 'Usuario desconocido'}</span>
                                          <span className="text-xs text-gray-400">•</span>
                                          <span className="text-xs text-gray-500">
                                            {(() => {
                                              if (!resp.fechaComentario) return 'Fecha desconocida';
                                              try {
                                                // Intentar parsear formato DD-MM-YYYY
                                                if (resp.fechaComentario.includes('-')) {
                                                  const parts = resp.fechaComentario.split('-');
                                                  if (parts.length === 3) {
                                                    // Asumir DD-MM-YYYY
                                                    const day = parseInt(parts[0], 10);
                                                    const month = parseInt(parts[1], 10) - 1;
                                                    const year = parseInt(parts[2], 10);
                                                    const date = new Date(year, month, day);
                                                    if (!isNaN(date.getTime())) {
                                                      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                                                    }
                                                  }
                                                }
                                                // Intentar parsear como fecha estándar
                                                const date = new Date(resp.fechaComentario);
                                                if (!isNaN(date.getTime())) {
                                                  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                                                }
                                                return resp.fechaComentario;
                                              } catch {
                                                return resp.fechaComentario;
                                              }
                                            })()}
                                          </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{resp.comentario}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          < div className="sticky top-8 space-y-6" >

            {/* Sistema de Valoración */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Valoración
              </h3>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {apunte.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(apunte.valoracion?.promedioValoracion || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {apunte.valoracion?.cantidadValoraciones || 0} valoraciones
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm font-medium text-gray-700 mb-3 text-center">Tu valoración</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRating(star)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${star <= (hoverRating || userRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Visualizaciones</span>
                  </div>
                  <span className="font-bold text-gray-900">{apunte.visualizaciones?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Descargas</span>
                  </div>
                  <span className="font-bold text-gray-900">{apunte.descargas?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Comentarios</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {comentarios.length + comentarios.reduce((acc, com) => acc + (com.respuestas ? com.respuestas.length : 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del Autor */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-purple-100 p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 opacity-10 rounded-full -mr-16 -mt-16"></div>

              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                <Award className="w-4 h-4 text-purple-600" />
                Autor del Apunte
              </h3>

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {apunte.autorInfo.nombreCompleto.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <h4 className="font-bold text-gray-900">{apunte.autorInfo.nombreCompleto}</h4>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{apunte.autorInfo.reputacion}</span>
                      <span className="text-xs text-gray-500">({apunte.autorInfo.totalValoraciones} valoraciones)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">{apunte.autorInfo.totalApuntes}</div>
                    <div className="text-xs text-gray-600">Apuntes subidos</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">{apunte.autorInfo.totalValoraciones}</div>
                    <div className="text-xs text-gray-600">Valoraciones</div>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigateToProfile(apunte.rutAutorSubida)}
                  className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-sm flex items-center justify-center gap-2 group"
                >
                  Ver Perfil
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Reportar */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100 font-medium text-sm"
            >
              <Flag className="w-4 h-4" />
              Reportar Apunte
            </button>

          </div>
        </div>

        {/* Otros Apuntes del Autor */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Otros apuntes de {apunte.autorSubida.split(' ')[0]}</h2>
              <p className="text-sm text-gray-500 mt-1">Más contenido del mismo autor</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 group">
              Ver todos
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otrosApuntesAutor.map((apunteItem) => (
              <div
                key={apunteItem._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/estudiante/apunte/${apunteItem._id}`)}
              >
                <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {apunteItem.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{apunteItem.asignatura}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{apunteItem.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{apunteItem.visualizaciones}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apuntes Relacionados */}
        <div className="mt-12 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apuntes Relacionados</h2>
              <p className="text-sm text-gray-500 mt-1">Contenido similiar de la misma asignatura</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 group">
              Ver más
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apuntesRelacionados.map((apunteItem) => (
              <div
                key={apunteItem._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/estudiante/apunte/${apunteItem._id}`)}
              >
                <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {apunteItem.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{apunteItem.asignatura}</p>
                  <p className="text-xs text-gray-500 mb-4">por {apunteItem.autor}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{apunteItem.valoracion?.promedioValoracion?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{apunteItem.visualizaciones}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        apunteId={id}
        autorRut={apunte?.rutAutorSubida}
        userRut={user?.rut}
      />
    </div>
  );
}

export default DetalleApunte;
