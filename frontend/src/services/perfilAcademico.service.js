import axios from 'axios';

export async function poseePerfilAcademicoService(rutUser) {
    try {
        const response = await axios.get(`/api/perfilAcademico/poseePFA?rutUser=${rutUser}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function crearPerfilAcademicoService(dataPerfilAcademico) {
    try {
        const response = await axios.post('/api/perfilAcademico/', dataPerfilAcademico);
        return response.data;
    } catch (error) {
        console.error('❌ Error en crearPerfilAcademicoService:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        });
        return error.response?.data || { status: 'Error', message: 'Error de conexión' };
    }
}
