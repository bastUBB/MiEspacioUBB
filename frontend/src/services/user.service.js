import axios from 'axios';

export async function obtenerAñoIngresoService(rut) {
    try {
        const response = await axios.get('/api/users/year-entry', {
            params: { rut }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener el año de ingreso del usuario:", error);
        throw error;
    }
}

export async function actualizarUsuarioService(rut, userData) {
    try {
        const response = await axios.patch('/api/users/detail', userData, {
            params: { rut }
        });

        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
}