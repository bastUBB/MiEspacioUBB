import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Eye, FileText, Save, X, GraduationCap, HelpCircle, Star, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import TablaGestion from '@components/tablaGestion.jsx';
import axios from 'axios';
import { getHistorialUsuarioService } from '../../services/historial.service.js';
import { getPerfilAcademicoService } from '../../services/perfilAcademico.service.js';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';

function GestionUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modales
    const [modalFormulario, setModalFormulario] = useState({ isOpen: false, modoEdicion: false });
    const [modalPerfil, setModalPerfil] = useState({ isOpen: false, perfil: null, loading: false });
    const [modalHistorial, setModalHistorial] = useState({ isOpen: false, historial: null, loading: false });
    const [modalConfirmacion, setModalConfirmacion] = useState({ isOpen: false, usuario: null, procesando: false });

    const [procesando, setProcesando] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        rut: '',
        nombreCompleto: '',
        email: '',
        password: '',
        role: 'estudiante'
    });

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users/');

            if (response?.data?.data) {
                const usuariosFormateados = response.data.data.map(usuario => ({
                    id: usuario.rut,
                    rut: usuario.rut,
                    nombre: usuario.nombreCompleto,
                    email: usuario.email,
                    rol: usuario.role,
                    _raw: usuario
                }));
                setUsuarios(usuariosFormateados);
            } else {
                setUsuarios([]);
            }
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            toast.error('Error al cargar los usuarios');
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    };

    // ==================== CRUD de Usuarios ====================

    const [editingUser, setEditingUser] = useState(null);

    const abrirModalCrear = () => {
        setModalFormulario({ isOpen: true, modoEdicion: false });
        setEditingUser(null);
        setFormData({
            rut: '',
            nombreCompleto: '',
            email: '',
            password: '',
            role: 'estudiante'
        });
    };

    const abrirModalEditar = (usuario) => {
        setModalFormulario({ isOpen: true, modoEdicion: true });
        setEditingUser(usuario);
        setFormData({
            rut: '',
            nombreCompleto: '',
            email: '',
            password: '',
            role: '' // Empty indicates "keep current"
        });
    };

    const cerrarModalFormulario = () => {
        setModalFormulario({ isOpen: false, modoEdicion: false });
        setEditingUser(null);
    };

    const guardarUsuario = async () => {
        // Validaciones para Creación
        if (!modalFormulario.modoEdicion) {
            if (!formData.rut || !formData.nombreCompleto || !formData.email || !formData.role || !formData.password) {
                toast.error('Completa todos los campos requeridos para crear un usuario');
                return;
            }
        }

        // Validaciones para Edición (al menos un campo si se quiere editar algo, aunque podría ser opcional)
        // En este caso, permitimos enviar solo lo que se haya llenado.

        try {
            setProcesando(true);

            let response;
            if (modalFormulario.modoEdicion) {
                // Actualizar usuario - Solo enviar campos modificados
                const body = {};
                if (formData.rut) body.rut = formData.rut;
                if (formData.nombreCompleto) body.nombreCompleto = formData.nombreCompleto;
                if (formData.email) body.email = formData.email;
                if (formData.password) body.password = formData.password;
                if (formData.role) body.role = formData.role;

                if (Object.keys(body).length === 0) {
                    toast.info('No se han realizado cambios');
                    return;
                }

                response = await axios.patch(`/api/users/detail?rut=${editingUser.rut}`, body);
            } else {
                // Crear nuevo usuario
                response = await axios.post('/api/users/', formData);
            }

            if (response?.data?.status === 'Success') {
                toast.success(modalFormulario.modoEdicion ? 'Usuario actualizado' : 'Usuario creado');
                cerrarModalFormulario();
                cargarUsuarios();
            } else {
                toast.error(response?.data?.details || 'Error al guardar el usuario');
            }
        } catch (error) {
            console.error('Error guardando usuario:', error);
            toast.error(error?.response?.data?.details || 'Error al guardar el usuario');
        } finally {
            setProcesando(false);
        }
    };

    const abrirModalConfirmacion = (usuario) => {
        setModalConfirmacion({ isOpen: true, usuario, procesando: false });
    };

    const cerrarModalConfirmacion = () => {
        setModalConfirmacion({ isOpen: false, usuario: null, procesando: false });
    };

    const confirmarEliminacion = async () => {
        const usuario = modalConfirmacion.usuario;
        if (!usuario) return;

        setModalConfirmacion(prev => ({ ...prev, procesando: true }));

        try {
            const response = await axios.delete(`/api/users/detail?rut=${usuario.rut}`);

            if (response?.data?.status === 'Success') {
                toast.success('Usuario eliminado correctamente');
                cerrarModalConfirmacion();
                cargarUsuarios();
            } else {
                toast.error(response?.data?.details || 'Error al eliminar el usuario');
                setModalConfirmacion(prev => ({ ...prev, procesando: false }));
            }
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            toast.error('Error al eliminar el usuario');
            setModalConfirmacion(prev => ({ ...prev, procesando: false }));
        }
    };

    // ==================== Ver Perfil Académico ====================

    const verPerfilAcademico = async (usuario) => {
        setModalPerfil({ isOpen: true, perfil: null, loading: true });

        try {
            const response = await getPerfilAcademicoService(usuario.rut);

            if (response?.data) {
                setModalPerfil({ isOpen: true, perfil: response.data, loading: false });
            } else {
                // Usuario sin perfil - no es un error, solo mostramos el modal vacío
                setModalPerfil({ isOpen: true, perfil: null, loading: false });
            }
        } catch (error) {
            console.error('Error cargando perfil:', error);
            setModalPerfil({ isOpen: true, perfil: null, loading: false });
            toast.error('Error al cargar el perfil académico');
        }
    };

    const cerrarModalPerfil = () => {
        setModalPerfil({ isOpen: false, perfil: null, loading: false });
    };

    // ==================== Ver Historial ====================

    const verHistorial = async (usuario) => {
        setModalHistorial({ isOpen: true, historial: null, loading: true });

        try {
            const response = await getHistorialUsuarioService(usuario.rut);

            if (response?.data) {
                setModalHistorial({ isOpen: true, historial: response.data, loading: false });
            } else {
                // Usuario sin historial - no es un error, solo mostramos el modal vacío
                setModalHistorial({ isOpen: true, historial: null, loading: false });
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
            setModalHistorial({ isOpen: true, historial: null, loading: false });
            toast.error('Error al cargar el historial');
        }
    };

    const cerrarModalHistorial = () => {
        setModalHistorial({ isOpen: false, historial: null, loading: false });
    };

    // ==================== Configuración de la Tabla ====================

    const columns = [
        { key: 'rut', title: 'RUT', align: 'left' },
        { key: 'nombre', title: 'Nombre Completo', align: 'left' },
        { key: 'email', title: 'Email', align: 'left' },
        {
            key: 'rol',
            title: 'Rol',
            align: 'center',
            render: (item) => {
                // Usar el rol directamente de _raw para evitar problemas de mapeo
                const rol = item._raw?.role || item.rol || 'estudiante';
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rol === 'admin' ? 'bg-red-100 text-red-800' :
                        rol === 'docente' ? 'bg-blue-100 text-blue-800' :
                            rol === 'ayudante' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                        }`}>
                        {rol.charAt(0).toUpperCase() + rol.slice(1)}
                    </span>
                );
            }
        }
    ];

    // Acciones personalizadas (además de edit y delete)
    const accionesCustom = (usuario) => (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => verPerfilAcademico(usuario)}
                className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                title="Ver Perfil Académico"
            >
                <GraduationCap className="w-4 h-4" />
            </button>
            <button
                onClick={() => verHistorial(usuario)}
                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                title="Ver Historial"
            >
                <Eye className="w-4 h-4" />
            </button>
        </div>
    );



    const handleProfileClick = () => {
        navigate('/admin/perfil');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando usuarios...</p>
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
                        <button
                            onClick={() => navigate('/admin/home')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white/70 hover:bg-white hover:text-purple-600 rounded-xl border border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Panel
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Gestión de Usuarios
                            </h1>
                            <div className="relative group">
                                <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                    Administra los usuarios del sistema, perfiles e historiales
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla con acciones personalizadas */}
                    <TablaGestion
                        data={usuarios}
                        columns={columns}
                        title="Usuarios"
                        icon={<Users className="w-5 h-5" />}
                        onEdit={abrirModalEditar}
                        onDelete={abrirModalConfirmacion}
                        onCreate={abrirModalCrear}
                        createButtonText="Nuevo Usuario"
                        showCreateButton={true}
                        searchPlaceholder="Buscar por RUT, nombre, email..."
                        emptyMessage="No hay usuarios registrados"
                        customActions={accionesCustom}
                    />

                    {/* Modal Crear/Editar Usuario */}
                    {modalFormulario.isOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-usuario" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModalFormulario}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente */}
                                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-6 border-b border-purple-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl shadow-lg">
                                                        <Users className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                                        {modalFormulario.modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
                                                    </h2>
                                                    <div className="relative group">
                                                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                                            {modalFormulario.modoEdicion ? 'Modifica la información del usuario seleccionado' : 'Completa los datos para crear un nuevo usuario en el sistema'}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={cerrarModalFormulario}
                                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                                aria-label="Cerrar modal"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contenido del formulario */}
                                    <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {/* Sección: Identificación */}
                                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-purple-600" />
                                                Identificación
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        RUT {modalFormulario.modoEdicion ? '(Opcional)' : '*'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.rut}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                                                        placeholder={modalFormulario.modoEdicion ? editingUser?.rut : "12345678-9"}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Rol {modalFormulario.modoEdicion ? '(Opcional)' : '*'}
                                                    </label>
                                                    <select
                                                        value={formData.role}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                                        disabled={procesando || (modalFormulario.modoEdicion && editingUser?._raw?.role === 'admin')}
                                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-500"
                                                        style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                            backgroundPosition: 'right 0.75rem center',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundSize: '1.5em 1.5em',
                                                            paddingRight: '2.5rem'
                                                        }}
                                                    >
                                                        {modalFormulario.modoEdicion && <option value="">Mantener actual ({editingUser?._raw?.role})</option>}
                                                        <option value="estudiante">Estudiante</option>
                                                        <option value="ayudante">Ayudante</option>
                                                        <option value="docente">Docente</option>
                                                        <option value="admin">Administrador</option>
                                                    </select>
                                                    {modalFormulario.modoEdicion && editingUser?._raw?.role === 'admin' && (
                                                        <p className="text-xs text-red-500 mt-1.5">No se puede cambiar el rol de un administrador.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sección: Información Personal */}
                                        <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Users className="w-5 h-5 text-violet-600" />
                                                Información Personal
                                            </h3>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Nombre Completo {modalFormulario.modoEdicion ? '(Opcional)' : '*'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.nombreCompleto}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                                                        placeholder={modalFormulario.modoEdicion ? editingUser?.nombre : "Juan Pérez González"}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email {modalFormulario.modoEdicion ? '(Opcional)' : '*'}
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                                                        placeholder={modalFormulario.modoEdicion ? editingUser?.email : "usuario@ubb.cl"}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sección: Seguridad */}
                                        <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Save className="w-5 h-5 text-cyan-600" />
                                                Seguridad
                                            </h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Contraseña {modalFormulario.modoEdicion ? '(Opcional)' : '*'}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                    disabled={procesando}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                                                    placeholder={modalFormulario.modoEdicion ? 'Dejar vacío para no cambiar' : 'Contraseña segura'}
                                                />
                                                {modalFormulario.modoEdicion && (
                                                    <p className="text-xs text-gray-500 mt-1.5">Dejar vacío para mantener la contraseña actual</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={cerrarModalFormulario}
                                                disabled={procesando}
                                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-colors font-medium disabled:opacity-50"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={guardarUsuario}
                                                disabled={procesando}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {procesando ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        {modalFormulario.modoEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Ver Perfil Académico */}
                    {modalPerfil.isOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-perfil" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModalPerfil}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente */}
                                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-6 border-b border-purple-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-500 rounded-xl shadow-lg">
                                                        <GraduationCap className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                                                        Perfil Académico
                                                    </h2>
                                                    <div className="relative group">
                                                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                                            Información académica detallada del usuario, incluyendo asignaturas y estadísticas
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={cerrarModalPerfil}
                                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                                aria-label="Cerrar modal"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {modalPerfil.loading ? (
                                            <div className="text-center py-12">
                                                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                                                <p className="mt-4 text-gray-600">Cargando perfil...</p>
                                            </div>
                                        ) : modalPerfil.perfil ? (
                                            <div className="space-y-6">
                                                {/* Popularidad */}
                                                <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Star className="w-5 h-5 text-purple-600" />
                                                        Popularidad
                                                    </h3>
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-gradient-to-r from-purple-600 to-violet-500 rounded-2xl p-6 text-center shadow-lg">
                                                            <p className="text-4xl font-bold text-white">{modalPerfil.perfil.popularidad || 0}</p>
                                                            <p className="text-purple-200 text-sm mt-1">puntos</p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-gray-600 text-sm">
                                                                La popularidad se calcula en base a las valoraciones recibidas en los apuntes, comentarios y descargas.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Asignaturas Cursantes */}
                                                {modalPerfil.perfil.asignaturasCursantes?.length > 0 && (
                                                    <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-6 shadow-sm">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                            <GraduationCap className="w-5 h-5 text-violet-600" />
                                                            Asignaturas Cursantes
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {modalPerfil.perfil.asignaturasCursantes.map((asig, idx) => (
                                                                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md">
                                                                    {asig}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Asignaturas de Interés */}
                                                {modalPerfil.perfil.asignaturasInteres?.length > 0 && (
                                                    <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl p-6 shadow-sm">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                            <Eye className="w-5 h-5 text-cyan-600" />
                                                            Asignaturas de Interés
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {modalPerfil.perfil.asignaturasInteres.map((asig, idx) => (
                                                                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-medium shadow-md">
                                                                    {asig}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Estadísticas de Apuntes */}
                                                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-green-600" />
                                                        Estadísticas de Apuntes
                                                    </h3>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="text-center p-4 bg-white rounded-xl border border-green-100 shadow-sm">
                                                            <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{modalPerfil.perfil.apuntesIDs?.length || 0}</p>
                                                            <p className="text-sm text-gray-600 mt-1">Apuntes Subidos</p>
                                                        </div>
                                                        <div className="text-center p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                                                            <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">{modalPerfil.perfil.apuntesValorados?.length || 0}</p>
                                                            <p className="text-sm text-gray-600 mt-1">Apuntes Valorados</p>
                                                        </div>
                                                        <div className="text-center p-4 bg-white rounded-xl border border-purple-100 shadow-sm">
                                                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">{modalPerfil.perfil.cantidadDescargas || 0}</p>
                                                            <p className="text-sm text-gray-600 mt-1">Descargas</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <GraduationCap className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600">El usuario no tiene perfil académico creado</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={cerrarModalPerfil}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all font-medium shadow-lg hover:shadow-xl"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Ver Historial */}
                    {modalHistorial.isOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-historial" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModalHistorial}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente */}
                                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-6 border-b border-purple-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg">
                                                        <Eye className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                                        Historial de Actividades
                                                    </h2>
                                                    <div className="relative group">
                                                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                                            Registro cronológico de todas las acciones realizadas por este usuario en la plataforma
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={cerrarModalHistorial}
                                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                                aria-label="Cerrar modal"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {modalHistorial.loading ? (
                                            <div className="text-center py-12">
                                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                                                <p className="mt-4 text-gray-600">Cargando historial...</p>
                                            </div>
                                        ) : modalHistorial.historial?.acciones?.length > 0 ? (
                                            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                    Actividades Recientes
                                                </h3>
                                                <div className="space-y-3">
                                                    {modalHistorial.historial.acciones.map((accion, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex gap-4 p-4 bg-white rounded-xl border border-blue-100 shadow-sm transition-all ${accion.apunteId ? 'hover:shadow-md hover:border-purple-300 cursor-pointer' : ''}`}
                                                            onClick={() => {
                                                                if (accion.apunteId) {
                                                                    // Abrir en nueva pestaña para que el admin no pierda contexto
                                                                    window.open(`/estudiante/apunte/${accion.apunteId}`, '_blank');
                                                                }
                                                            }}
                                                        >
                                                            <div className={`w-2 bg-gradient-to-b ${accion.apunteId ? 'from-purple-500 to-cyan-500' : 'from-gray-400 to-gray-500'} rounded-full`}></div>
                                                            <div className="flex-1">
                                                                <p className="text-gray-900 font-medium">{accion.tipoAccion}</p>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {new Date(accion.fechaAccion).toLocaleString('es-ES')}
                                                                </p>
                                                            </div>
                                                            {accion.apunteId && (
                                                                <div className="flex items-center">
                                                                    <ExternalLink className="w-4 h-4 text-purple-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Eye className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600">El usuario no tiene historial registrado</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={cerrarModalHistorial}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all font-medium shadow-lg hover:shadow-xl"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Confirmación de Eliminación */}
                    {modalConfirmacion.isOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-confirmacion" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModalConfirmacion}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente de advertencia */}
                                    <div className="relative bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 px-8 py-6 border-b border-red-100">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">
                                                <AlertTriangle className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    Confirmar Eliminación
                                                </h2>
                                                <p className="text-sm text-gray-600 mt-0.5">Esta acción no se puede deshacer</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-8">
                                        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
                                            <p className="text-gray-700 text-center">
                                                ¿Estás seguro de que deseas eliminar al usuario
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 text-center mt-2">
                                                "{modalConfirmacion.usuario?.nombre}"
                                            </p>
                                            <p className="text-sm text-red-600 text-center mt-3 font-medium">
                                                Se eliminarán todos sus datos permanentemente
                                            </p>
                                        </div>

                                        {/* Info del usuario */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">RUT:</span>
                                                <span className="font-medium text-gray-900">{modalConfirmacion.usuario?.rut}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Email:</span>
                                                <span className="font-medium text-gray-900 truncate ml-4">{modalConfirmacion.usuario?.email}</span>
                                            </div>
                                        </div>

                                        {/* Botones */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={cerrarModalConfirmacion}
                                                disabled={modalConfirmacion.procesando}
                                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-colors font-medium disabled:opacity-50"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={confirmarEliminacion}
                                                disabled={modalConfirmacion.procesando}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {modalConfirmacion.procesando ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Eliminando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-5 h-5" />
                                                        Eliminar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}

export default GestionUsuarios;
