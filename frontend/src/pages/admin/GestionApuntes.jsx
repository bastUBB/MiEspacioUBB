import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Eye, Trash2, X, Loader2, Download } from 'lucide-react';
import TablaGestion from '@components/tablaGestion.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { obtenerLinkDescargaApunteURLFirmadaService } from '../../services/apunte.service';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function GestionApuntes() {
    const navigate = useNavigate();
    const [apuntes, setApuntes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para el modal de visualización
    const [modalVisualizar, setModalVisualizar] = useState({ isOpen: false, apunte: null });
    const [pdfUrl, setPdfUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [pdfError, setPdfError] = useState(null);

    useEffect(() => {
        cargarApuntes();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha desconocida';
        try {
            // Intentar parsear formato DD-MM-YYYY
            if (dateString.includes('-')) {
                const parts = dateString.split('-');
                if (parts.length === 3) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    const date = new Date(year, month, day);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString('es-ES');
                    }
                }
            }
            // Intentar parsear como fecha estándar ISO
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('es-ES');
            }
            return dateString;
        } catch {
            return dateString;
        }
    };

    const cargarApuntes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/apuntes/');

            if (response?.data?.data) {
                const apuntesFormateados = response.data.data.map(apunte => ({
                    id: apunte._id,
                    nombre: apunte.nombre,
                    autor: apunte.autorSubida,
                    asignatura: apunte.asignatura,
                    fecha: formatDate(apunte.fechaSubida),
                    _raw: apunte
                }));
                setApuntes(apuntesFormateados);
            } else {
                setApuntes([]);
            }
        } catch (error) {
            console.error('Error cargando apuntes:', error);
            toast.error('Error al cargar los apuntes');
            setApuntes([]);
        } finally {
            setLoading(false);
        }
    };

    const eliminarApunte = async (apunte) => {
        if (!confirm(`¿Estás seguro de eliminar el apunte "${apunte.nombre}"? Esta acción es permanente.`)) {
            return;
        }

        try {
            const response = await axios.delete(`/api/apuntes/detail?apunteID=${apunte.id}`);

            if (response?.data?.status === 'Success') {
                toast.success('Apunte eliminado');
                cargarApuntes();
            } else {
                toast.error(response?.data?.details || 'Error al eliminar el apunte');
            }
        } catch (error) {
            console.error('Error eliminando apunte:', error);
            toast.error('Error al eliminar el apunte');
        }
    };

    const abrirModalVisualizar = async (apunte) => {
        setModalVisualizar({ isOpen: true, apunte: apunte });
        setLoadingPdf(true);
        setPdfError(null);
        setPdfUrl(null);
        setPageNumber(1);

        try {
            const response = await obtenerLinkDescargaApunteURLFirmadaService(apunte.id);
            if (response.status === 'Success' && response.data) {
                setPdfUrl(response.data.url);
            } else {
                setPdfError('No se pudo obtener el PDF');
                toast.error('Error al cargar el PDF');
            }
        } catch (error) {
            console.error('Error al obtener URL del PDF:', error);
            setPdfError('Error al cargar el PDF');
            toast.error('Error al cargar el PDF');
        } finally {
            setLoadingPdf(false);
        }
    };

    const cerrarModalVisualizar = () => {
        setModalVisualizar({ isOpen: false, apunte: null });
        setPdfUrl(null);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleProfileClick = () => {
        navigate('/admin/perfil');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // ==================== Configuración de la Tabla ====================

    const columns = [
        { key: 'nombre', title: 'Nombre', align: 'left' },
        { key: 'asignatura', title: 'Asignatura', align: 'left' },
        { key: 'autor', title: 'Autor', align: 'left' },
        { key: 'fecha', title: 'Fecha', align: 'center' }
    ];

    // Acciones personalizadas
    const accionesCustom = (apunte) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => abrirModalVisualizar(apunte)}
                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                title="Ver Apunte"
            >
                <Eye className="w-4 h-4" />
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando apuntes...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminHeader onProfileClick={handleProfileClick} onLogout={handleLogout} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/home')}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Apuntes</h1>
                            <p className="text-gray-600">Administra los apuntes subidos al sistema</p>
                        </div>
                    </div>

                    {/* Tabla */}
                    <TablaGestion
                        data={apuntes}
                        columns={columns}
                        title="Apuntes"
                        icon={<FileText className="w-5 h-5" />}
                        onDelete={eliminarApunte}
                        showCreateButton={false}
                        searchPlaceholder="Buscar por nombre, asignatura, autor..."
                        emptyMessage="No hay apuntes registrados"
                        customActions={accionesCustom}
                    />

                    {/* Modal Visualizar Apunte */}
                    {modalVisualizar.isOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                                {/* Header del Modal */}
                                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        <h2 className="text-lg font-bold truncate max-w-md">{modalVisualizar.apunte?.nombre}</h2>
                                    </div>
                                    <button
                                        onClick={cerrarModalVisualizar}
                                        className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Contenido del Modal (Visor PDF) */}
                                <div className="flex-1 overflow-y-auto bg-gray-100 p-4 flex justify-center">
                                    {loadingPdf ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                                            <p className="text-gray-600">Cargando documento...</p>
                                        </div>
                                    ) : pdfError ? (
                                        <div className="text-center py-20">
                                            <p className="text-red-500 mb-2">Error al cargar el documento</p>
                                            <p className="text-sm text-gray-500">{pdfError}</p>
                                        </div>
                                    ) : pdfUrl ? (
                                        <div className="shadow-lg">
                                            <Document
                                                file={pdfUrl}
                                                onLoadSuccess={onDocumentLoadSuccess}
                                                loading={
                                                    <div className="flex flex-col items-center justify-center py-10">
                                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                                    </div>
                                                }
                                                error={
                                                    <div className="text-center py-10 text-red-500">
                                                        Error al renderizar PDF
                                                    </div>
                                                }
                                            >
                                                <Page
                                                    pageNumber={pageNumber}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                    width={Math.min(window.innerWidth * 0.8, 800)}
                                                    className="bg-white"
                                                />
                                            </Document>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Footer del Modal (Controles de página) */}
                                {numPages && (
                                    <div className="bg-white border-t border-gray-200 p-3 flex justify-center items-center gap-4">
                                        <button
                                            disabled={pageNumber <= 1}
                                            onClick={() => setPageNumber(prev => prev - 1)}
                                            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
                                        >
                                            Anterior
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            Página {pageNumber} de {numPages}
                                        </span>
                                        <button
                                            disabled={pageNumber >= numPages}
                                            onClick={() => setPageNumber(prev => prev + 1)}
                                            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default GestionApuntes;
