import axios from 'axios';

export const poseePerfilAcademico = async (rutUser) => {
    try {
        const response = await axios.get(`/api/perfilAcademico/detail?rutUser=${rutUser}`);

        return !!(response.data && response.data.data);
    } catch {
        return false;
    }
};

