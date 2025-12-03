import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Eye, FileText, Save, X, GraduationCap } from 'lucide-react';
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

    const [procesando, setProcesando] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        rut: '',
        nombreCompleto: '',
        email: '',
        password: '',
        rol: 'estudiante'
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
            rol: 'estudiante'
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
            rol: '' // Empty indicates "keep current"
        });
    };

    const cerrarModalFormulario = () => {
        setModalFormulario({ isOpen: false, modoEdicion: false });
        setEditingUser(null);
    };

    const guardarUsuario = async () => {
        // Validaciones para Creación
        if (!modalFormulario.modoEdicion) {
            if (!formData.rut || !formData.nombreCompleto || !formData.email || !formData.rol || !formData.password) {
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
                if (formData.rol) body.rol = formData.rol;

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

    const eliminarUsuario = async (usuario) => {
        if (!confirm(`¿Estás seguro de eliminar al usuario "${usuario.nombre}"? Esta acción es permanente.`)) {
            return;
        }

        try {
            const response = await axios.delete(`/api/users/detail?rut=${usuario.rut}`);

            if (response?.data?.status === 'Success') {
                toast.success('Usuario eliminado');
                cargarUsuarios();
            } else {
                toast.error(response?.data?.details || 'Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            toast.error('Error al eliminar el usuario');
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
                setModalPerfil({ isOpen: true, perfil: null, loading: false });
                toast.error('Usuario sin perfil académico');
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
                setModalHistorial({ isOpen: true, historial: null, loading: false });
                toast.error('Usuario sin historial');
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
                const rol = item._raw?.rol || item.rol || 'estudiante';
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
                    <div className="mb-6 flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/home')}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                            <p className="text-gray-600">Administra los usuarios del sistema, perfiles e historiales</p>
                        </div>
                    </div>

                    {/* Tabla con acciones personalizadas */}
                    <TablaGestion
                        data={usuarios}
                        columns={columns}
                        title="Usuarios"
                        icon={<Users className="w-5 h-5" />}
                        onEdit={abrirModalEditar}
                        onDelete={eliminarUsuario}
                        onCreate={abrirModalCrear}
                        createButtonText="Nuevo Usuario"
                        showCreateButton={true}
                        searchPlaceholder="Buscar por RUT, nombre, email..."
                        emptyMessage="No hay usuarios registrados"
                        customActions={accionesCustom}
                    />

                    {/* Modal Crear/Editar Usuario */}
                    {modalFormulario.isOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                                {/* Botón cerrar */}
                                <button
                                    onClick={cerrarModalFormulario}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Users className="w-6 h-6" />
                                        {modalFormulario.modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
                                    </h2>
                                    <p className="text-blue-100 text-sm mt-1">
                                        {modalFormulario.modoEdicion ? 'Modifica la información del usuario' : 'Completa los datos del nuevo usuario'}
                                    </p>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">RUT {modalFormulario.modoEdicion ? '(Opcional)' : '*'}</label>
                                            <input
                                                type="text"
                                                value={formData.rut}
                                                onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                                                disabled={procesando}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                                                placeholder={modalFormulario.modoEdicion ? editingUser?.rut : "12345678-9"}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Rol {modalFormulario.modoEdicion ? '(Opcional)' : '*'}</label>
                                            <select
                                                value={formData.rol}
                                                onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value }))}
                                                disabled={procesando || (modalFormulario.modoEdicion && editingUser?.rol === 'admin')}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                                            >
                                                {modalFormulario.modoEdicion && <option value="">Mantener actual ({editingUser?.rol})</option>}
                                                <option value="estudiante">Estudiante</option>
                                                <option value="ayudante">Ayudante</option>
                                                <option value="docente">Docente</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                            {modalFormulario.modoEdicion && editingUser?.rol === 'admin' && (
                                                <p className="text-xs text-red-500 mt-1">No se puede cambiar el rol de un administrador.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Nombre Completo {modalFormulario.modoEdicion ? '(Opcional)' : '*'}</label>
                                        <input
                                            type="text"
                                            value={formData.nombreCompleto}
                                            onChange={(e) => setFormData(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                                            disabled={procesando}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder={modalFormulario.modoEdicion ? editingUser?.nombre : "Juan Pérez González"}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Email {modalFormulario.modoEdicion ? '(Opcional)' : '*'}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={procesando}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder={modalFormulario.modoEdicion ? editingUser?.email : "usuario@ubb.cl"}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Contraseña {modalFormulario.modoEdicion ? '(Opcional)' : '*'}
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            disabled={procesando}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder={modalFormulario.modoEdicion ? 'Dejar vacío para no cambiar' : 'Contraseña'}
                                        />
                                        {modalFormulario.modoEdicion && (
                                            <p className="text-sm text-gray-500 mt-1">Dejar vacío para mantener la contraseña actual</p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={cerrarModalFormulario}
                                            disabled={procesando}
                                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={guardarUsuario}
                                            disabled={procesando}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                                        >
                                            <Save className="w-5 h-5 inline mr-2" />
                                            {procesando ? 'Guardando...' : (modalFormulario.modoEdicion ? 'Guardar Cambios' : 'Crear Usuario')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Ver Perfil Académico */}
                    {modalPerfil.isOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                                {/* Botón cerrar */}
                                <button
                                    onClick={cerrarModalPerfil}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <GraduationCap className="w-6 h-6" />
                                        Perfil Académico
                                    </h2>
                                    <p className="text-purple-100 text-sm mt-1">Información académica del usuario</p>
                                </div>

                                <div className="p-6">
                                    {modalPerfil.loading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="mt-4 text-gray-600">Cargando perfil...</p>
                                        </div>
                                    ) : modalPerfil.perfil ? (
                                        <div className="space-y-6">
                                            {/* Información básica */}
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-blue-900 mb-3">Información General</h3>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-700">Nivel:</span>
                                                        <p className="text-gray-900">{modalPerfil.perfil.nivel || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Reputación:</span>
                                                        <p className="text-gray-900">{modalPerfil.perfil.reputacion || 0}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Asignaturas */}
                                            {modalPerfil.perfil.asignaturasCursantes?.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-2">Asignaturas Cursantes</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {modalPerfil.perfil.asignaturasCursantes.map((asig, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                                {asig}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {modalPerfil.perfil.asignaturasInteres?.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-2">Asignaturas de Interés</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {modalPerfil.perfil.asignaturasInteres.map((asig, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                                {asig}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Apuntes */}
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Estadísticas de Apuntes</h3>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                                        <p className="text-2xl font-bold text-green-600">{modalPerfil.perfil.apuntesIDs?.length || 0}</p>
                                                        <p className="text-sm text-gray-600">Apuntes Subidos</p>
                                                    </div>
                                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                        <p className="text-2xl font-bold text-blue-600">{modalPerfil.perfil.apuntesValorados?.length || 0}</p>
                                                        <p className="text-sm text-gray-600">Apuntes Valorados</p>
                                                    </div>
                                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                        <p className="text-2xl font-bold text-purple-600">{modalPerfil.perfil.cantidadDescargas || 0}</p>
                                                        <p className="text-sm text-gray-600">Descargas</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-600">El usuario no tiene perfil académico creado</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={cerrarModalPerfil}
                                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Ver Historial */}
                    {modalHistorial.isOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                                {/* Botón cerrar */}
                                <button
                                    onClick={cerrarModalHistorial}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Eye className="w-6 h-6" />
                                        Historial de Actividades
                                    </h2>
                                    <p className="text-blue-100 text-sm mt-1">Registro de acciones del usuario</p>
                                </div>

                                <div className="p-6">
                                    {modalHistorial.loading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                                            <p className="mt-4 text-gray-600">Cargando historial...</p>
                                        </div>
                                    ) : modalHistorial.historial?.acciones?.length > 0 ? (
                                        <div className="space-y-3">
                                            {modalHistorial.historial.acciones.map((accion, idx) => (
                                                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                                                    <div className="flex-1">
                                                        <p className="text-gray-900">{accion.tipoAccion}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(accion.fechaAccion).toLocaleString('es-ES')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-600">El usuario no tiene historial registrado</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={cerrarModalHistorial}
                                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        Cerrar
                                    </button>
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
