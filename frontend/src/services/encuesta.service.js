import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export const getEncuestas = async () => {
    try {
        const response = await axios.get(`${API_URL}/encuestas/activas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        throw error;
    }
};

export const getTodasEncuestas = async () => {
    try {
        const response = await axios.get(`${API_URL}/encuestas/todas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener todas las encuestas:', error);
        throw error;
    }
};

export const getEncuestaById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/encuestas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la encuesta:', error);
        throw error;
    }
};

export const createEncuesta = async (encuesta) => {
    try {
        const response = await axios.post(`${API_URL}/encuestas`, encuesta);
        return response.data;
    } catch (error) {
        console.error('Error al crear la encuesta:', error);
        throw error;
    }
};

export const updateEncuesta = async (id, encuesta) => {
    try {
        const response = await axios.put(`${API_URL}/encuestas/${id}`, encuesta);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
        throw error;
    }
};

export const deleteEncuesta = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/encuestas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la encuesta:', error);
        throw error;
    }
};
