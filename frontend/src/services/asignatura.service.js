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

// Funciones CRUD para gestión de asignaturas
export async function getAllAsignaturasService() {
    try {
        const response = await axios.get('/api/asignaturas/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener todas las asignaturas:", error);
        return error.response?.data || { status: 'Error', message: 'Error al obtener asignaturas' };
    }
}

export async function createAsignaturaService(asignaturaData) {
    try {
        const response = await axios.post('/api/asignaturas/', asignaturaData);
        return response.data;
    } catch (error) {
        console.error("Error al crear asignatura:", error);
        return error.response?.data || { status: 'Error', message: 'Error al crear asignatura' };
    }
}

export async function updateAsignaturaService(codigo, asignaturaData) {
    try {
        const response = await axios.put('/api/asignaturas/detail', asignaturaData, {
            params: { codigo }
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar asignatura:", error);
        return error.response?.data || { status: 'Error', message: 'Error al actualizar asignatura' };
    }
}

export async function deleteAsignaturaService(codigo) {
    try {
        const response = await axios.delete('/api/asignaturas/detail', {
            params: { codigo }
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar asignatura:", error);
        return error.response?.data || { status: 'Error', message: 'Error al eliminar asignatura' };
    }
}