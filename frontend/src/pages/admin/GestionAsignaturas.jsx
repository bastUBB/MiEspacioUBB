const [modoEdicion, setModoEdicion] = useState(false);
const [asignaturaActual, setAsignaturaActual] = useState(null);
const [procesando, setProcesando] = useState(false);

// Form state
const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    semestre: 1,
    prerequisitos: [],
    unidadAprendizaje: []
});

const [nuevaUnidad, setNuevaUnidad] = useState({ numero: '', descripcion: '' });
const [nuevoPrerequisito, setNuevoPrerequisito] = useState('');

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
                semestre: asig.semestre,
                prerequisitos: asig.prerrequisitos?.join(', ') || 'Ninguno',
                unidades: asig.unidadAprendizaje?.length || 0,
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
        semestre: 1,
        prerequisitos: [],
        unidadAprendizaje: []
    });
    setModalOpen(true);
};

const abrirModalEditar = (asignatura) => {
    setModoEdicion(true);
    setAsignaturaActual(asignatura);
    setFormData({
        codigo: asignatura._raw.codigo,
        nombre: asignatura._raw.nombre,
        semestre: asignatura._raw.semestre,
        prerequisitos: asignatura._raw.prerrequisitos || [],
        unidadAprendizaje: asignatura._raw.unidadAprendizaje || []
    });
    setModalOpen(true);
};

const cerrarModal = () => {
    setModalOpen(false);
    setModoEdicion(false);
    setAsignaturaActual(null);
    setNuevaUnidad({ numero: '', descripcion: '' });
    setNuevoPrerequisito('');
};

const agregarUnidad = () => {
    if (!nuevaUnidad.numero || !nuevaUnidad.descripcion) {
        toast.error('Completa todos los campos de la unidad');
        return;
    }

    const unidad = {
        numeroUnidad: parseInt(nuevaUnidad.numero),
        descripcion: nuevaUnidad.descripcion
    };

    setFormData(prev => ({
        ...prev,
        unidadAprendizaje: [...prev.unidadAprendizaje, unidad]
    }));

    setNuevaUnidad({ numero: '', descripcion: '' });
};

const eliminarUnidad = (index) => {
    setFormData(prev => ({
        ...prev,
        unidadAprendizaje: prev.unidadAprendizaje.filter((_, i) => i !== index)
    }));
};

const agregarPrerequisito = () => {
    if (!nuevoPrerequisito.trim()) {
        toast.error('Ingresa un código de asignatura');
        return;
    }

    if (formData.prerequisitos.includes(nuevoPrerequisito)) {
        toast.error('Este prerrequisito ya está agregado');
        return;
    }

    setFormData(prev => ({
        ...prev,
        prerequisitos: [...prev.prerequisitos, nuevoPrerequisito.trim()]
    }));

    setNuevoPrerequisito('');
};

const eliminarPrerequisito = (index) => {
    setFormData(prev => ({
        ...prev,
        prerequisitos: prev.prerequisitos.filter((_, i) => i !== index)
    }));
};

const guardarAsignatura = async () => {
    // Validar campos requeridos
    if (!formData.codigo || !formData.nombre) {
        toast.error('Código y nombre son obligatorios');
        return;
    }

    if (formData.semestre < 1 || formData.semestre > 12) {
        toast.error('El semestre debe estar entre 1 y 12');
        return;
    }

    try {
        setProcesando(true);

        const dataToSend = {
            nombre: formData.nombre,
            semestre: formData.semestre,
            prerrequisitos: formData.prerequisitos,
            unidadAprendizaje: formData.unidadAprendizaje
        };

        let response;
        if (modoEdicion) {
            // Editar
            response = await updateAsignaturaService(formData.codigo, dataToSend);
        } else {
            // Crear - agregar código
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
            toast.error(response?.details || 'Error al guardar la asignatura');
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

const columns = [
    { key: 'codigo', title: 'Código', align: 'left' },
    { key: 'nombre', title: 'Nombre', align: 'left' },
    { key: 'semestre', title: 'Semestre', align: 'center' },
    { key: 'prerequisitos', title: 'Prerrequisitos', align: 'left' },
    { key: 'unidades', title: 'N° Unidades', align: 'center' }
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
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Asignaturas</h1>
                    <p className="text-gray-600">Administra el catálogo de asignaturas del sistema</p>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <BookOpen className="w-6 h-6" />
                                {modoEdicion ? 'Editar Asignatura' : 'Nueva Asignatura'}
                            </h2>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                            {/* Campos básicos */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Código *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.codigo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                                        disabled={modoEdicion || procesando}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="Ej: INFO101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Semestre *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="12"
                                        value={formData.semestre}
                                        onChange={(e) => setFormData(prev => ({ ...prev, semestre: parseInt(e.target.value) }))}
                                        disabled={procesando}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                    disabled={procesando}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Programación I"
                                />
                            </div>

                            {/* Prerrequisites */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Prerrequisitos
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={nuevoPrerequisito}
                                        onChange={(e) => setNuevoPrerequisito(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && agregarPrerequisito()}
                                        disabled={procesando}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Código de asignatura prerrequisito"
                                    />
                                    <button
                                        onClick={agregarPrerequisito}
                                        disabled={procesando}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.prerequisitos.map((prereq, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                                        >
                                            {prereq}
                                            <button
                                                onClick={() => eliminarPrerequisito(index)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Unidades */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Unidades de Aprendizaje
                                </label>
                                <div className="grid grid-cols-12 gap-2 mb-2">
                                    <input
                                        type="number"
                                        value={nuevaUnidad.numero}
                                        onChange={(e) => setNuevaUnidad(prev => ({ ...prev, numero: e.target.value }))}
                                        disabled={procesando}
                                        className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="N°"
                                    />
                                    <input
                                        type="text"
                                        value={nuevaUnidad.descripcion}
                                        onChange={(e) => setNuevaUnidad(prev => ({ ...prev, descripcion: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && agregarUnidad()}
                                        disabled={procesando}
                                        className="col-span-9 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descripción de la unidad"
                                    />
                                    <button
                                        onClick={agregarUnidad}
                                        disabled={procesando}
                                        className="col-span-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.unidadAprendizaje.map((unidad, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <span className="font-semibold text-gray-700">Unidad {unidad.numeroUnidad}:</span>
                                                <span className="ml-2 text-gray-600">{unidad.descripcion}</span>
                                            </div>
                                            <button
                                                onClick={() => eliminarUnidad(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={cerrarModal}
                                    disabled={procesando}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={guardarAsignatura}
                                    disabled={procesando}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-semibold disabled:opacity-50"
                                >
                                    {procesando ? 'Guardando...' : (modoEdicion ? 'Guardar Cambios' : 'Crear Asignatura')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);
}

export default GestionAsignaturas;
