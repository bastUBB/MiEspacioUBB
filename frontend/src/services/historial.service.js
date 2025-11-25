import axios from 'axios';

export async function getHistorialUsuarioService(rutUser) {
    try {
        const response = await axios.get('/api/historial/detail', {
            params: { rutUser }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener historial del usuario:", error);
        throw error;
    }
}
