import { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import { getEncuestas, getEncuestaById } from '../services/encuesta.service.js';
import TarjetaEncuesta from '../components/TarjetaEncuesta.jsx';
import toast from 'react-hot-toast';

const ExploradorEncuestas = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [encuestasFiltradas, setEncuestasFiltradas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarEncuestas();
    }, []);

    useEffect(() => {
        filtrarEncuestas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, encuestas]);

    const cargarEncuestas = async () => {
        try {
            setLoading(true);
            const response = await getEncuestas();
            setEncuestas(response.data || []);
        } catch (error) {
            console.error('Error al cargar encuestas:', error);
            toast.error('Error al cargar las encuestas');
        } finally {
            setLoading(false);
        }
    };

    const filtrarEncuestas = () => {
        if (!searchTerm.trim()) {
            setEncuestasFiltradas(encuestas);
            return;
        }

        const filtered = encuestas.filter(encuesta =>
            encuesta.nombreEncuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
            encuesta.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setEncuestasFiltradas(filtered);
    };

    const handleClickEncuesta = async (encuesta) => {
        try {
            // Incrementar visualizaciones al hacer click
            await getEncuestaById(encuesta._id);
            // El enlace se abre desde el componente TarjetaEncuesta
        } catch (error) {
            console.error('Error al registrar visualización:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                        Explorar Encuestas
                    </h1>
                    <p className="text-gray-600">
                        Participa en encuestas y ayuda a mejorar nuestra comunidad
                    </p>
                </div>

                {/* Buscador */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar encuestas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Grid de encuestas */}
                {encuestasFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchTerm ? 'No se encontraron encuestas que coincidan con tu búsqueda' : 'No hay encuestas disponibles en este momento'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {encuestasFiltradas.map(encuesta => (
                            <div key={encuesta._id} onClick={() => handleClickEncuesta(encuesta)}>
                                <TarjetaEncuesta encuesta={encuesta} isAdmin={false} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExploradorEncuestas;
