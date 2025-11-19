import axios from 'axios';

export async function obtenerTodasMisNotificacionesService(rutUsuario) {
    try {
        const response = await axios.get('/api/notificaciones/detail', { params: { rutUsuario } });

        return response.data;
    } catch (error) {
        console.error("Error al obtener notificaciones:", error.response?.data || error.message);
        throw error;
    }
}

export async function actualizarEstadoLeidoService(notificacionID) {
    try {
        const response = await axios.patch('/api/notificaciones/act-estado/detail', null, {
            params: { _id: notificacionID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado de notificación:", error);
        throw error;
    }
}

export async function borrarNotificacionesLeidasService(rutUsuario) {
    try {
        const response = await axios.delete('/api/notificaciones/borrar-leidas/detail', {
            params: { rutUsuario }
        });

        return response.data;
    } catch (error) {
        console.error("Error al borrar notificaciones leídas:", error);
        throw error;
    }
}
