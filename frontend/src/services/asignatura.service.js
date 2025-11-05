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