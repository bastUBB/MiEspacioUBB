import Comentario from "../models/comentario.model.js";
import User from "../models/user.model.js";
import { notificacionLikeComentarioService, notificacionDislikeComentarioService } from "./notificacion.service.js";

export async function realizarComentarioService(dataComentario) {
    try {
        const { rutAutor } = dataComentario;

        const existRutAutor = await User.findOne({ rut: rutAutor });

        if (!existRutAutor) return [null, 'El usuario autor del comentario no existe'];

        const nuevoComentario = new Comentario(dataComentario);

        await nuevoComentario.save();

        return [nuevoComentario, null];
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function realizarComentarioRespuestaService(comentarioPadreID, dataRespuestaComentario) {
    try {
        const { rutAutor } = dataRespuestaComentario;

        const existRutAutor = await User.findOne({ rut: rutAutor });

        if (!existRutAutor) return [null, null, 'El usuario autor de la respuesta no existe'];

        const comentarioPadre = await Comentario.findById(comentarioPadreID);

        if (!comentarioPadre) return [null, null, 'El comentario al que se desea responder no existe'];

        const nuevoComentarioRespuesta = new Comentario(dataRespuestaComentario);

        await nuevoComentarioRespuesta.save();

        comentarioPadre.respuestas.push(nuevoComentarioRespuesta._id);

        await comentarioPadre.save();

        const rutAutorPadre = comentarioPadre.rutAutor;

        return [nuevoComentarioRespuesta, rutAutorPadre, null];

    } catch (error) {
        console.error('Error al crear la respuesta del comentario:', error);
        return [null, null, 'Error interno del servidor'];
    }
}

/**
 * Función central para manejar todas las interacciones con comentarios
 * @param {string} comentarioID - ID del comentario
 * @param {string} rutUsuario - RUT del usuario que interactúa
 * @param {string} tipoAccion - Tipo de acción: 'like', 'dislike'
 * @returns {Promise<[object|null, string|null]>} - [resultado, error]
 */
export async function realizarInteraccionComentarioService(comentarioID, rutUsuario, tipoAccion) {
    try {
        const comentarioExist = await Comentario.findById(comentarioID);

        if (!comentarioExist) return [null, 'El comentario no existe'];

        // Inicializar arrays si no existen
        if (!comentarioExist.usuariosLikes) comentarioExist.usuariosLikes = [];
        if (!comentarioExist.usuariosDislikes) comentarioExist.usuariosDislikes = [];

        switch (tipoAccion) {
            case 'like':
                // Verificar si ya dio like
                if (comentarioExist.usuariosLikes.includes(rutUsuario)) {
                    return [null, 'Ya has dado like a este comentario'];
                }

                // Si había dado dislike, removerlo
                if (comentarioExist.usuariosDislikes.includes(rutUsuario)) {
                    comentarioExist.usuariosDislikes = comentarioExist.usuariosDislikes.filter(rut => rut !== rutUsuario);
                    comentarioExist.Dislikes = Math.max(0, comentarioExist.Dislikes - 1);
                }

                // Agregar like
                comentarioExist.usuariosLikes.push(rutUsuario);
                comentarioExist.Likes += 1;

                await comentarioExist.save();

                // Crear notificación
                const [notifLike, errorNotifLike] = await notificacionLikeComentarioService(
                    comentarioExist.rutAutor, rutUsuario, comentarioID
                );

                if (errorNotifLike) return [null, errorNotifLike];

                return [comentarioExist, null];

            case 'dislike':
                // Verificar si ya dio dislike
                if (comentarioExist.usuariosDislikes.includes(rutUsuario)) {
                    return [null, 'Ya has dado dislike a este comentario'];
                }

                // Si había dado like, removerlo
                if (comentarioExist.usuariosLikes.includes(rutUsuario)) {
                    comentarioExist.usuariosLikes = comentarioExist.usuariosLikes.filter(rut => rut !== rutUsuario);
                    comentarioExist.Likes = Math.max(0, comentarioExist.Likes - 1);
                }

                // Agregar dislike
                comentarioExist.usuariosDislikes.push(rutUsuario);
                comentarioExist.Dislikes += 1;

                await comentarioExist.save();

                // Crear notificación
                const [notifDislike, errorNotifDislike] = await notificacionDislikeComentarioService(
                    comentarioExist.rutAutor, rutUsuario, comentarioID
                );

                if (errorNotifDislike) return [null, errorNotifDislike];

                return [comentarioExist, null];

            default:
                return [null, 'Tipo de acción no válida'];
        }
    } catch (error) {
        console.error('Error al realizar interacción con comentario:', error);
        return [null, 'Error interno del servidor'];
    }
}

// Mantener funciones legacy para compatibilidad temporal
export async function darLikeComentarioService(comentarioID, rutUsuario) {
    return await realizarInteraccionComentarioService(comentarioID, rutUsuario, 'like');
}

export async function darDislikeComentarioService(comentarioID, rutUsuario) {
    return await realizarInteraccionComentarioService(comentarioID, rutUsuario, 'dislike');
}