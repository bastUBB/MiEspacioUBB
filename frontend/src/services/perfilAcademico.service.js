import axios from 'axios';

export async function poseePerfilAcademicoService(rutUser) {
    try {
        const response = await axios.get(`/api/perfilAcademico/poseePFA?rutUser=${rutUser}`);
        
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}