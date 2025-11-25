import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, Users, AlertTriangle, GraduationCap, UserCheck, Briefcase, BarChart3, ClipboardList } from 'lucide-react';
import { obtenerCantidadUsuariosService } from '../../services/user.service';
import { obtenerCantidadApuntesService } from '../../services/apunte.service';
import { obtenerCantidadReportesPendientesService } from '../../services/reporte.service';
import { obtenerCantidadAsignaturasService } from '../../services/asignatura.service';
import AdminHeader from '../../components/AdminHeader';

function HomeAdmin() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        reportes: 0,
        asignaturas: 0,
        usuarios: 0,
        apuntes: 0,
        loading: true
    });

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const [reportesRes, asignaturasRes, usuariosRes, apuntesRes] = await Promise.all([
                obtenerCantidadReportesPendientesService(),
                obtenerCantidadAsignaturasService(),
                obtenerCantidadUsuariosService(),
                obtenerCantidadApuntesService()
            ]);

            setStats({
                reportes: reportesRes?.data || 0,
                asignaturas: asignaturasRes?.data || 0,
                usuarios: usuariosRes?.data?.cantidadUsuarios || 0,
                apuntes: apuntesRes?.data || 0,
                loading: false
            });
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const handleProfileClick = () => {
        navigate('/admin/perfil');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const moduleCards = [
        {
            title: 'Gestión de Reportes',
            description: 'Administrar reportes pendientes',
            icon: <AlertTriangle className="w-12 h-12" />,
            count: stats.reportes,
            countLabel: 'reportes pendientes',
            gradient: 'from-red-500 to-orange-500',
            path: '/admin/reportes',
            bgIcon: 'bg-red-100',
            iconColor: 'text-red-600'
        },
        {
            title: 'Gestión de Asignaturas',
            description: 'Administrar asignaturas del sistema',
            icon: <BookOpen className="w-12 h-12" />,
            count: stats.asignaturas,
            countLabel: 'asignaturas registradas',
            gradient: 'from-blue-500 to-cyan-500',
            path: '/admin/asignaturas',
            bgIcon: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Gestión de Usuarios',
            description: 'Administrar usuarios del sistema',
            icon: <Users className="w-12 h-12" />,
            count: stats.usuarios,
            countLabel: 'usuarios registrados',
            gradient: 'from-purple-500 to-pink-500',
            path: '/admin/usuarios',
            bgIcon: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Gestión de Apuntes',
            description: 'Administrar apuntes del sistema',
            icon: <FileText className="w-12 h-12" />,
            count: stats.apuntes,
            countLabel: 'apuntes registrados',
            gradient: 'from-green-500 to-teal-500',
            path: '/admin/apuntes',
            bgIcon: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Gestión de Encuestas',
            description: 'Administrar encuestas del sistema',
            icon: <ClipboardList className="w-12 h-12" />,
            count: null,
            countLabel: null,
            gradient: 'from-teal-500 to-emerald-500',
            path: '/admin/encuestas',
            bgIcon: 'bg-teal-100',
            iconColor: 'text-teal-600'
        },
        {
            title: 'Funciones Estudiante',
            description: 'Gestionar funciones de estudiantes',
            icon: <GraduationCap className="w-12 h-12" />,
            count: null,
            countLabel: null,
            gradient: 'from-indigo-500 to-blue-500',
            path: '/admin/funciones-estudiante',
            bgIcon: 'bg-indigo-100',
            iconColor: 'text-indigo-600'
        },
        {
            title: 'Funciones Docente',
            description: 'Gestionar funciones de docentes',
            icon: <Briefcase className="w-12 h-12" />,
            count: null,
            countLabel: null,
            gradient: 'from-amber-500 to-yellow-500',
            path: '/admin/funciones-docente',
            bgIcon: 'bg-amber-100',
            iconColor: 'text-amber-600'
        },
        {
            title: 'Funciones Ayudante',
            description: 'Gestionar funciones de ayudantes',
            icon: <UserCheck className="w-12 h-12" />,
            count: null,
            countLabel: null,
            gradient: 'from-emerald-500 to-green-500',
            path: '/admin/funciones-ayudante',
            bgIcon: 'bg-emerald-100',
            iconColor: 'text-emerald-600'
        },
        {
            title: 'Estadísticas',
            description: 'Ver métricas y estadísticas del sistema',
            icon: <BarChart3 className="w-12 h-12" />,
            count: null,
            countLabel: null,
            gradient: 'from-violet-500 to-purple-500',
            path: '/admin/estadisticas',
            bgIcon: 'bg-violet-100',
            iconColor: 'text-violet-600'
        }
    ];

    if (stats.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
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
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Panel de Administración
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Gestión de MiEspacioUBB
                        </p>
                    </div>

                    {/* Module Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moduleCards.map((module, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(module.path)}
                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-transparent"
                            >
                                {/* Gradient background on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                <div className="relative p-6 sm:p-8">
                                    {/* Icon */}
                                    <div className={`${module.bgIcon} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <div className={module.iconColor}>
                                            {module.icon}
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                                        {module.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {module.description}
                                    </p>

                                    {/* Stats */}
                                    {module.count !== null && module.countLabel !== null && (
                                        <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${module.gradient} text-white font-semibold shadow-md`}>
                                            <span className="text-2xl mr-2">{module.count}</span>
                                            <span className="text-sm opacity-90">{module.countLabel}</span>
                                        </div>
                                    )}

                                    {/* Arrow icon */}
                                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg
                                            className="w-6 h-6 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Info */}
                    <div className="mt-12 bg-white rounded-xl shadow-md p-6 border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Información del Sistema
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-3xl font-bold text-green-600">0</p>
                                <p className="text-sm text-gray-600 mt-1">Usuarios Conectados</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-3xl font-bold text-blue-600">0</p>
                                <p className="text-sm text-gray-600 mt-1">Sugerencias Recibidas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeAdmin;
