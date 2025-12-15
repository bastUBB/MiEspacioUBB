import axios from 'axios';

export async function crearEncuesta(encuesta) {
    try {
        const response = await axios.post("/api/encuestas", encuesta);

        return response.data;
    } catch (error) {
        console.error('Error al crear la encuesta:', error);
        throw error;
    }
}

export async function obtenerTodasEncuestasActivas() {
    try {
        const response = await axios.get("/api/encuestas/encuestas-activas");

        return response.data;
    } catch (error) {
        console.error('Error al obtener las encuestas activas:', error);
        throw error;
    }
}

export async function obtenerTodasEncuestas() {
    try {
        const response = await axios.get("/api/encuestas/all-encuestas");
        return response.data;
    } catch (error) {
        console.error('Error al obtener todas las encuestas:', error);
        throw error;
    }
}

export async function obtenerEncuestaPorId(id) {
    try {
        const response = await axios.get(`/api/encuestas/detail`, {
            params: { encuestaID: id }
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener la encuesta:', error);
        throw error;
    }
}

export async function actualizarEncuesta(id, encuesta) {
    try {
        const response = await axios.put(`/api/encuestas/detail`, encuesta, {
            params: { encuestaID: id }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
        throw error;
    }
}

export async function eliminarEncuesta(id) {
    try {
        const response = await axios.delete(`/api/encuestas/detail`, {
            params: { encuestaID: id }
        });

        return response.data;
    } catch (error) {
        console.error('Error al eliminar la encuesta:', error);
        throw error;
    }
}

export async function obtenerEncuestasUsuarioService(rutAutor) {
    try {
        const response = await axios.get(`/api/encuestas/por-rut`, {
            params: { rutAutor }
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener encuestas del usuario:', error);
        throw error;
    }
}
