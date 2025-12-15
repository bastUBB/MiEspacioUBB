import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
    BarChart3,
    Users,
    FileText,
    AlertTriangle,
    Activity,
    TrendingUp,
    Download,
    Star,
    AlertCircle,
    FileWarning,
    ArrowLeft
} from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import {
    obtenerTotalApuntesActivosService,
    obtenerTotalUsuariosService,
    obtenerUsuariosActivosService,
    obtenerReportesPendientesService,
    obtenerAsignaturasSinApuntesService,
    obtenerUltimosReportesService,
    obtenerTop5AsignaturasService,
    obtenerTopContribuidoresSemanaService,
    obtenerDistribucionTiposService,
    obtenerValoracionPromedioSistemaService
} from '../../services/estadisticas.service';

// Función para formatear fechas de forma segura
const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
        // Intentar parsear formato DD-MM-YYYY
        if (typeof dateString === 'string' && dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3 && parts[0].length <= 2) {
                // Formato DD-MM-YYYY
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('es-ES');
                }
            }
        }
        // Intentar parsear como fecha ISO estándar
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('es-ES');
        }
        return 'Sin fecha';
    } catch {
        return 'Sin fecha';
    }
};

function EstadisticasAdmin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        totalApuntes: 0,
        reportesPendientes: 0,
        usuariosActivos: 0,
        asignaturasSinApuntes: [],
        ultimosReportes: [],
        topAsignaturas: [],
        topContribuidores: [],
        distribucionTipos: [],
        valoracionPromedio: 0
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [
                usuariosRes,
                apuntesRes,
                reportesRes,
                activosRes,
                sinApuntesRes,
                ultimosReportesRes,
                topAsignaturasRes,
                topContribuidoresRes,
                distribucionRes,
                valoracionRes
            ] = await Promise.all([
                obtenerTotalUsuariosService(),
                obtenerTotalApuntesActivosService(),
                obtenerReportesPendientesService(),
                obtenerUsuariosActivosService(),
                obtenerAsignaturasSinApuntesService(),
                obtenerUltimosReportesService(),
                obtenerTop5AsignaturasService(),
                obtenerTopContribuidoresSemanaService(),
                obtenerDistribucionTiposService(),
                obtenerValoracionPromedioSistemaService()
            ]);

            setStats({
                totalUsuarios: usuariosRes?.data?.total || 0,
                totalApuntes: apuntesRes?.data?.total || 0,
                reportesPendientes: reportesRes?.data?.total || 0,
                usuariosActivos: activosRes?.data?.total || 0,
                asignaturasSinApuntes: sinApuntesRes?.data || [],
                ultimosReportes: ultimosReportesRes?.data || [],
                topAsignaturas: topAsignaturasRes?.data || [],
                topContribuidores: topContribuidoresRes?.data || [],
                distribucionTipos: distribucionRes?.data || [],
                valoracionPromedio: valoracionRes?.data?.promedio || 0
            });
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = () => navigate('/admin/perfil');
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Función para generar PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPos = 20;

        // Título
        doc.setFontSize(20);
        doc.setTextColor(88, 28, 135); // Purple
        doc.text('Dashboard de Estadísticas - MiEspacioUBB', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Fecha de generación
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado el ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // KPIs principales
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 30);
        doc.text('Métricas Principales', 14, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text(`• Usuarios Totales: ${stats.totalUsuarios}`, 20, yPos);
        yPos += 6;
        doc.text(`• Apuntes Activos: ${stats.totalApuntes}`, 20, yPos);
        yPos += 6;
        doc.text(`• Reportes Pendientes: ${stats.reportesPendientes}`, 20, yPos);
        yPos += 6;
        doc.text(`• Usuarios Online: ${stats.usuariosActivos}`, 20, yPos);
        yPos += 6;
        doc.text(`• Valoración Promedio: ${stats.valoracionPromedio?.toFixed(1) || '0.0'} / 5`, 20, yPos);
        yPos += 12;

        // Top Asignaturas
        if (stats.topAsignaturas.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(30, 30, 30);
            doc.text('Asignaturas Más Populares', 14, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            stats.topAsignaturas.forEach((asig, idx) => {
                doc.text(`${idx + 1}. ${asig.nombre}: ${asig.cantidad} apuntes`, 20, yPos);
                yPos += 5;
            });
            yPos += 7;
        }

        // Top Contribuidores
        if (stats.topContribuidores.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(30, 30, 30);
            doc.text('Top Contribuidores', 14, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            stats.topContribuidores.forEach((user, idx) => {
                doc.text(`${idx + 1}. ${user.nombre} - ${user.cantidadApuntes} apuntes`, 20, yPos);
                yPos += 5;
            });
            yPos += 7;
        }

        // Distribución de tipos
        if (stats.distribucionTipos.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(30, 30, 30);
            doc.text('Distribución por Tipo de Archivo', 14, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            stats.distribucionTipos.forEach(tipo => {
                const porcentaje = ((tipo.cantidad / stats.totalApuntes) * 100).toFixed(1);
                doc.text(`• ${tipo.tipo}: ${tipo.cantidad} (${porcentaje}%)`, 20, yPos);
                yPos += 5;
            });
            yPos += 7;
        }

        // Asignaturas sin contenido (si hay)
        if (stats.asignaturasSinApuntes.length > 0) {
            // Nueva página si es necesario
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(180, 80, 0); // Orange
            doc.text(`Asignaturas Sin Contenido (${stats.asignaturasSinApuntes.length})`, 14, yPos);
            yPos += 8;

            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            stats.asignaturasSinApuntes.slice(0, 15).forEach(asig => {
                doc.text(`• ${asig.codigo} - ${asig.nombre}`, 20, yPos);
                yPos += 4;
            });
            if (stats.asignaturasSinApuntes.length > 15) {
                doc.text(`... y ${stats.asignaturasSinApuntes.length - 15} más`, 20, yPos);
            }
        }

        // Descargar
        doc.save(`estadisticas_miespacioubb_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando métricas del sistema...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminHeader onProfileClick={handleProfileClick} onLogout={handleLogout} />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <button
                            onClick={() => navigate('/admin')}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
                            <p className="text-gray-600">Visión general del rendimiento y salud de la plataforma</p>
                        </div>
                        <button
                            onClick={generarPDF}
                            className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-xl hover:from-blue-600 hover:to-sky-500 transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            <Download className="w-5 h-5" />
                            Exportar PDF
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KPICard
                            title="Usuarios Totales"
                            value={stats.totalUsuarios}
                            icon={<Users className="w-8 h-8 text-blue-600" />}
                            bg="bg-blue-100"
                        />
                        <KPICard
                            title="Apuntes Activos"
                            value={stats.totalApuntes}
                            icon={<FileText className="w-8 h-8 text-green-600" />}
                            bg="bg-green-100"
                        />
                        <KPICard
                            title="Reportes Pendientes"
                            value={stats.reportesPendientes}
                            icon={<AlertTriangle className="w-8 h-8 text-red-600" />}
                            bg="bg-red-100"
                            alert={stats.reportesPendientes > 0}
                        />
                        <KPICard
                            title="Usuarios Online"
                            value={stats.usuariosActivos}
                            icon={<Activity className="w-8 h-8 text-purple-600" />}
                            bg="bg-purple-100"
                            subtext="En tiempo real"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Left Column (2/3) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Top Asignaturas */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                                        Asignaturas Más Populares
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                                                <th className="pb-3">Asignatura</th>
                                                <th className="pb-3 text-right">Apuntes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {stats.topAsignaturas.map((asig, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="py-3 text-sm text-gray-900 font-medium">{asig.nombre}</td>
                                                    <td className="py-3 text-sm text-gray-600 text-right">{asig.cantidad}</td>
                                                </tr>
                                            ))}
                                            {stats.topAsignaturas.length === 0 && (
                                                <tr>
                                                    <td colSpan="2" className="py-4 text-center text-gray-500">No hay datos disponibles</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Asignaturas Sin Contenido (Alert) */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <FileWarning className="w-5 h-5 mr-2 text-orange-500" />
                                        Asignaturas Sin Contenido
                                    </h3>
                                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {stats.asignaturasSinApuntes.length} asignaturas
                                    </span>
                                </div>
                                <div className="max-h-64 overflow-y-auto pr-2">
                                    {stats.asignaturasSinApuntes.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {stats.asignaturasSinApuntes.slice(0, 10).map((asig, idx) => (
                                                <div key={idx} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {asig.nombre}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {asig.codigo}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {stats.asignaturasSinApuntes.length > 10 && (
                                                <div className="flex items-center justify-center p-3 text-sm text-gray-500">
                                                    + {stats.asignaturasSinApuntes.length - 10} más...
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">¡Excelente! Todas las asignaturas tienen contenido.</p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Sidebar - Right Column (1/3) */}
                        <div className="space-y-8">

                            {/* Últimos Reportes */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                                    Últimos Reportes
                                </h3>
                                <div className="space-y-4">
                                    {stats.ultimosReportes.map((reporte, idx) => (
                                        <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-100">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-0.5 rounded">
                                                    {reporte.motivo}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(reporte.fecha)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-800 mt-2 line-clamp-2">
                                                {reporte.descripcion}
                                            </p>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Estado: <span className="font-medium">{reporte.estado}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {stats.ultimosReportes.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">No hay reportes recientes.</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => navigate('/admin/reportes')}
                                    className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Ver todos los reportes
                                </button>
                            </div>

                            {/* Top Contribuidores */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                                    Top Contribuidores
                                </h3>
                                <div className="space-y-4">
                                    {stats.topContribuidores.map((user, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    idx === 1 ? 'bg-gray-100 text-gray-700' :
                                                        'bg-orange-50 text-orange-700'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
                                                    <p className="text-xs text-gray-500">{user.rut}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-blue-600">
                                                {user.cantidadApuntes} <span className="text-xs font-normal text-gray-500">apuntes</span>
                                            </span>
                                        </div>
                                    ))}
                                    {stats.topContribuidores.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">No hay datos suficientes.</p>
                                    )}
                                </div>
                            </div>

                            {/* Distribución de Archivos */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <Download className="w-5 h-5 mr-2 text-gray-500" />
                                    Tipos de Archivo
                                </h3>
                                <div className="space-y-3">
                                    {stats.distribucionTipos.map((tipo, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{tipo.tipo}</span>
                                                <span className="text-gray-500">{tipo.cantidad}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(tipo.cantidad / stats.totalApuntes) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function KPICard({ title, value, icon, bg, subtext, alert }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 border ${alert ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`${bg} p-3 rounded-lg`}>
                    {icon}
                </div>
                {alert && (
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
            <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {subtext && <span className="ml-2 text-sm text-gray-500">{subtext}</span>}
            </div>
        </div>
    );
}

export default EstadisticasAdmin;
