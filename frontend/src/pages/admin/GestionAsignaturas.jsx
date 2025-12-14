import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, X, HelpCircle, Search, ChevronDown } from 'lucide-react';
import TablaGestion from '@components/tablaGestion.jsx';
import {
    getAllAsignaturasService,
    createAsignaturaService,
    updateAsignaturaService,
    deleteAsignaturaService
} from '@services/asignatura.service.js';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';

// Opciones para los selects
const AMBITOS = [
    'Ámbito Competencias Genéricas',
    'Ámbito Ciencias Básicas y de la Ingeniería',
    'Ámbito Ingeniería Aplicada'
];

const AREAS = [
    'Área Form. Integral Profesional',
    'Área Ciencias Básicas',
    'Área Ciencias de la Ingeniería',
    'Área Ingeniería de Software y Base de Datos',
    'Área de Sistemas Computacionales',
    'Área de Gestión Informática'
];

function GestionAsignaturas() {
    const navigate = useNavigate();
    const [asignaturas, setAsignaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [, setAsignaturaActual] = useState(null);
    const [procesando, setProcesando] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        creditos: 4,
        semestre: 1,
        ambito: '',
        area: '',
        prerrequisitos: []
    });

    const [showPrereqDropdown, setShowPrereqDropdown] = useState(false);
    const [prereqSearch, setPrereqSearch] = useState('');
    const prereqDropdownRef = useRef(null);

    // Click outside handler para cerrar dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (prereqDropdownRef.current && !prereqDropdownRef.current.contains(event.target)) {
                setShowPrereqDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        cargarAsignaturas();
    }, []);

    const cargarAsignaturas = async () => {
        try {
            setLoading(true);
            const response = await getAllAsignaturasService();

            if (response?.data) {
                const asignaturasFormateadas = response.data.map(asig => ({
                    id: asig.codigo || asig._id,
                    codigo: asig.codigo,
                    nombre: asig.nombre,
                    creditos: asig.creditos,
                    semestre: asig.semestre,
                    ambito: asig.ambito,
                    area: asig.area,
                    prerrequisitos: asig.prerrequisitos?.join(', ') || 'Ninguno',
                    unidades: asig.unidades?.length || 0,
                    _raw: asig
                }));
                setAsignaturas(asignaturasFormateadas);
            } else {
                setAsignaturas([]);
            }
        } catch (error) {
            console.error('Error cargando asignaturas:', error);
            toast.error('Error al cargar las asignaturas');
            setAsignaturas([]);
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCrear = () => {
        setModoEdicion(false);
        setAsignaturaActual(null);
        setFormData({
            codigo: '',
            nombre: '',
            creditos: 4,
            semestre: 1,
            ambito: '',
            area: '',
            prerrequisitos: [],
            unidades: []
        });
        setModalOpen(true);
    };

    const abrirModalEditar = (asignatura) => {
        setModoEdicion(true);
        setAsignaturaActual(asignatura);
        setFormData({
            codigo: asignatura._raw.codigo,
            nombre: asignatura._raw.nombre,
            creditos: asignatura._raw.creditos || 4,
            semestre: asignatura._raw.semestre,
            ambito: asignatura._raw.ambito || '',
            area: asignatura._raw.area || '',
            prerrequisitos: asignatura._raw.prerrequisitos || [],
            unidades: asignatura._raw.unidades || []
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setModoEdicion(false);
        setAsignaturaActual(null);
        setShowPrereqDropdown(false);
        setPrereqSearch('');
    };

    const seleccionarPrerequisito = (asignatura) => {
        if (formData.prerrequisitos.includes(asignatura.nombre)) {
            toast.error('Este prerrequisito ya está agregado');
            return;
        }

        if (formData.prerrequisitos.length >= 3) {
            toast.error('Máximo 3 prerrequisitos');
            return;
        }

        // No permitir agregar la misma asignatura que se está editando
        if (asignatura.codigo === formData.codigo) {
            toast.error('Una asignatura no puede ser prerrequisito de sí misma');
            return;
        }

        setFormData(prev => ({
            ...prev,
            prerrequisitos: [...prev.prerrequisitos, asignatura.nombre]
        }));

        setShowPrereqDropdown(false);
        setPrereqSearch('');
    };

    const eliminarPrerequisito = (index) => {
        setFormData(prev => ({
            ...prev,
            prerrequisitos: prev.prerrequisitos.filter((_, i) => i !== index)
        }));
    };

    const guardarAsignatura = async () => {
        // Validaciones
        if (!formData.codigo || formData.codigo.length !== 6) {
            toast.error('El código debe tener exactamente 6 dígitos');
            return;
        }

        if (!/^\d{6}$/.test(formData.codigo)) {
            toast.error('El código debe contener solo números');
            return;
        }

        if (!formData.nombre || formData.nombre.length < 3) {
            toast.error('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (!formData.creditos || formData.creditos < 1 || formData.creditos > 10) {
            toast.error('Los créditos deben estar entre 1 y 10');
            return;
        }

        if (!formData.semestre || formData.semestre < 1 || formData.semestre > 10) {
            toast.error('El semestre debe estar entre 1 y 10');
            return;
        }

        if (!formData.ambito) {
            toast.error('Debes seleccionar un ámbito');
            return;
        }

        if (!formData.area) {
            toast.error('Debes seleccionar un área');
            return;
        }

        try {
            setProcesando(true);

            const dataToSend = {
                nombre: formData.nombre,
                creditos: parseInt(formData.creditos),
                semestre: parseInt(formData.semestre),
                ambito: formData.ambito,
                area: formData.area,
                prerrequisitos: formData.prerrequisitos
            };

            let response;
            if (modoEdicion) {
                response = await updateAsignaturaService(formData.codigo, dataToSend);
            } else {
                response = await createAsignaturaService({
                    codigo: formData.codigo,
                    ...dataToSend
                });
            }

            if (response?.status === 'Success') {
                toast.success(modoEdicion ? 'Asignatura actualizada' : 'Asignatura creada');
                cerrarModal();
                cargarAsignaturas();
            } else {
                toast.error(response?.details || response?.message || 'Error al guardar la asignatura');
            }
        } catch (error) {
            console.error('Error guardando asignatura:', error);
            toast.error('Error al guardar la asignatura');
        } finally {
            setProcesando(false);
        }
    };

    const eliminarAsignatura = async (asignatura) => {
        if (!confirm(`¿Estás seguro de eliminar la asignatura "${asignatura.nombre}"?`)) {
            return;
        }

        try {
            const response = await deleteAsignaturaService(asignatura.codigo);

            if (response?.status === 'Success') {
                toast.success('Asignatura eliminada');
                cargarAsignaturas();
            } else {
                toast.error(response?.details || 'Error al eliminar la asignatura');
            }
        } catch (error) {
            console.error('Error eliminando asignatura:', error);
            toast.error('Error al eliminar la asignatura');
        }
    };

    const handleProfileClick = () => {
        navigate('/admin/perfil');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const columns = [
        { key: 'codigo', title: 'Código', align: 'left' },
        { key: 'nombre', title: 'Nombre', align: 'left' },
        { key: 'creditos', title: 'Créditos', align: 'center' },
        { key: 'semestre', title: 'Semestre', align: 'center' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando asignaturas...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminHeader onProfileClick={handleProfileClick} onLogout={handleLogout} />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-4 sm:p-6 lg:p-8">
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
                                Gestión de Asignaturas
                            </h1>
                            <div className="relative group">
                                <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                    Administra el catálogo de asignaturas del sistema
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <TablaGestion
                        data={asignaturas}
                        columns={columns}
                        title="Asignaturas"
                        icon={<BookOpen className="w-5 h-5" />}
                        onEdit={abrirModalEditar}
                        onDelete={eliminarAsignatura}
                        onCreate={abrirModalCrear}
                        createButtonText="Nueva Asignatura"
                        showCreateButton={true}
                        searchPlaceholder="Buscar por código, nombre..."
                        emptyMessage="No hay asignaturas registradas"
                    />

                    {/* Modal Crear/Editar */}
                    {modalOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-asignatura" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-all" onClick={cerrarModal}></div>

                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
                                    {/* Header con gradiente */}
                                    <div className="relative bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-8 py-6 border-b border-purple-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl shadow-lg">
                                                        <BookOpen className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                                        {modoEdicion ? 'Editar Asignatura' : 'Nueva Asignatura'}
                                                    </h2>
                                                    <div className="relative group">
                                                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-help transition-colors" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                                            {modoEdicion ? 'Modifica los datos de la asignatura' : 'Completa todos los campos requeridos'}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={cerrarModal}
                                                className="ml-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                                                aria-label="Cerrar modal"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                        {/* Información Básica */}
                                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-purple-600" />
                                                Información Básica
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Código * <span className="text-xs text-gray-400">(6 dígitos)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.codigo}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                                                        disabled={modoEdicion || procesando}
                                                        maxLength={6}
                                                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                                                        placeholder="220140"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Créditos *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={formData.creditos}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, creditos: parseInt(e.target.value) }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Semestre *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={formData.semestre}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, semestre: parseInt(e.target.value) }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Nombre *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.nombre}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                                    disabled={procesando}
                                                    maxLength={50}
                                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                    placeholder="Bioinformática y Biología Computacional"
                                                />
                                            </div>
                                        </div>

                                        {/* Ámbito y Área */}
                                        <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Clasificación
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Ámbito *
                                                    </label>
                                                    <select
                                                        value={formData.ambito}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, ambito: e.target.value }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                                                    >
                                                        <option value="">Selecciona un ámbito</option>
                                                        {AMBITOS.map((ambito, idx) => (
                                                            <option key={idx} value={ambito}>{ambito}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Área *
                                                    </label>
                                                    <select
                                                        value={formData.area}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                                                        disabled={procesando}
                                                        className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                                                    >
                                                        <option value="">Selecciona un área</option>
                                                        {AREAS.map((area, idx) => (
                                                            <option key={idx} value={area}>{area}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Prerrequisitos */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Prerrequisitos <span className="text-sm font-normal text-gray-500">(opcional, máx. 3)</span>
                                            </h3>

                                            {/* Dropdown selector de asignaturas */}
                                            <div className="relative mb-3" ref={prereqDropdownRef}>
                                                <div
                                                    className="relative"
                                                    onClick={() => formData.prerrequisitos.length < 3 && setShowPrereqDropdown(!showPrereqDropdown)}
                                                >
                                                    <div className={`w-full px-4 py-3 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${showPrereqDropdown ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-indigo-200 hover:border-indigo-400'} ${formData.prerrequisitos.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                        <span className="text-gray-500">
                                                            {formData.prerrequisitos.length >= 3 ? 'Máximo alcanzado' : 'Selecciona una asignatura'}
                                                        </span>
                                                        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${showPrereqDropdown ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>

                                                {showPrereqDropdown && (
                                                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col">
                                                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                                                            <div className="relative">
                                                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                                <input
                                                                    type="text"
                                                                    value={prereqSearch}
                                                                    onChange={(e) => setPrereqSearch(e.target.value)}
                                                                    placeholder="Buscar asignatura..."
                                                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                                    autoFocus
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="overflow-y-auto flex-1">
                                                            {asignaturas
                                                                .filter(asig =>
                                                                    (asig.nombre.toLowerCase().includes(prereqSearch.toLowerCase()) ||
                                                                        asig.codigo.includes(prereqSearch)) &&
                                                                    asig.codigo !== formData.codigo &&
                                                                    !formData.prerrequisitos.includes(asig.nombre)
                                                                )
                                                                .map((asignatura) => (
                                                                    <button
                                                                        key={asignatura._id || asignatura.codigo}
                                                                        type="button"
                                                                        onClick={() => seleccionarPrerequisito(asignatura)}
                                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 transition-colors text-gray-700"
                                                                    >
                                                                        <span className="font-medium text-indigo-600">{asignatura.codigo}</span>
                                                                        <span className="mx-2">-</span>
                                                                        <span>{asignatura.nombre}</span>
                                                                    </button>
                                                                ))
                                                            }
                                                            {asignaturas.filter(asig =>
                                                                (asig.nombre.toLowerCase().includes(prereqSearch.toLowerCase()) ||
                                                                    asig.codigo.includes(prereqSearch)) &&
                                                                asig.codigo !== formData.codigo &&
                                                                !formData.prerrequisitos.includes(asig.nombre)
                                                            ).length === 0 && (
                                                                    <div className="p-4 text-center text-sm text-gray-500">
                                                                        No se encontraron asignaturas
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Lista de prerrequisitos seleccionados */}
                                            <div className="flex flex-wrap gap-2">
                                                {formData.prerrequisitos.map((prereq, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200 flex items-center gap-2"
                                                    >
                                                        {prereq}
                                                        <button
                                                            onClick={() => eliminarPrerequisito(index)}
                                                            className="text-purple-600 hover:text-purple-800"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </span>
                                                ))}
                                                {formData.prerrequisitos.length === 0 && (
                                                    <span className="text-gray-400 text-sm">Sin prerrequisitos</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botones */}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={guardarAsignatura}
                                                disabled={procesando}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-xl hover:from-purple-700 hover:to-violet-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                                            >
                                                {procesando ? 'Guardando...' : (modoEdicion ? 'Guardar Cambios' : 'Crear Asignatura')}
                                            </button>
                                            <button
                                                onClick={cerrarModal}
                                                disabled={procesando}
                                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
                                            >
                                                Cancelar
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

export default GestionAsignaturas;
