import axios from 'axios';

export async function getAsignaturasService() {
    try {
        const response = await axios.get('/api/asignaturas/');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getAsignaturasSemestreActualService(semestreActual) {
    try {
        const response = await axios.get(`/api/asignaturas/semestreActual/detail?semestreActual=${semestreActual}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function obtenerCantidadAsignaturasService() {
    try {
        const response = await axios.get('/api/asignaturas/cantidad-total');
        return response.data;
    } catch (error) {
        console.error("Error al obtener la cantidad de asignaturas:", error);
        throw error;
    }
}


export async function sugerirEtiquetasAsignaturaService(codigoAsignatura) {
    try {
        const response = await axios.get('/api/asignaturas/sugerir-etiquetas', {
            params: { codigo: codigoAsignatura }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener sugerencias de etiquetas:", error);
        return error.response?.data || { status: 'Error', message: 'Error al obtener sugerencias' };
    }
}

export async function agregarEtiquetasAsignaturaService(codigoAsignatura, etiquetas) {
    try {
        const response = await axios.post('/api/asignaturas/agregar-etiquetas',
            { etiquetas },
            { params: { codigo: codigoAsignatura } }
        );
        return response.data;
    } catch (error) {
        console.error("Error al agregar etiquetas a la asignatura:", error);
        return error.response?.data || { status: 'Error', message: 'Error al agregar etiquetas' };
    }
}