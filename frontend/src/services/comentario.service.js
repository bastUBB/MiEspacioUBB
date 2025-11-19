import axios from 'axios';

export async function darLikeComentarioService(comentarioID) {
    try {
        const response = await axios.post('/api/comentarios/like/detail', null, {
            params: { _id: comentarioID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al dar like al comentario:", error);
        throw error;
    }
}

export async function darDislikeComentarioService(comentarioID) {
    try {
        const response = await axios.post('/api/comentarios/dislike/detail', null, {
            params: { _id: comentarioID }
        });

        return response.data;
    } catch (error) {
        console.error("Error al dar dislike al comentario:", error);
        throw error;
    }
}
