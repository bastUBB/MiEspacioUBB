import axios from 'axios';

export async function obtenerRecomendacionesPersonalizadasService() {
    try {
        const response = await axios.get('api/recomendaciones/personalizadas');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function obtenerRecomendacionesGenericasService() {
    try {
        const response = await axios.get('api/recomendaciones/genericas');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
