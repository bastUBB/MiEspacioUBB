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

export async function darLikeComentarioService(comentarioID, rutUsuario) {
    try {
        const comentarioExist = await Comentario.findById(comentarioID);

        if (!comentarioExist) return [null, 'El comentario al que desea dar like no existe'];

        // Verificar si el usuario ya dio like
        if (comentarioExist.usuariosLikes && comentarioExist.usuariosLikes.includes(rutUsuario)) return [null, 'Ya has dado like a este comentario'];

        // Si el usuario había dado dislike, removerlo
        if (comentarioExist.usuariosDislikes && comentarioExist.usuariosDislikes.includes(rutUsuario)) {
            comentarioExist.usuariosDislikes = comentarioExist.usuariosDislikes.filter(rut => rut !== rutUsuario);
            comentarioExist.Dislikes = Math.max(0, comentarioExist.Dislikes - 1);
        }

        // Agregar like
        if (!comentarioExist.usuariosLikes) comentarioExist.usuariosLikes = [];
        comentarioExist.usuariosLikes.push(rutUsuario);
        comentarioExist.Likes += 1;

        await comentarioExist.save();

        const [notificacionUserCreada, errorNotificacion] = await notificacionLikeComentarioService(
            comentarioExist.rutAutor, rutUsuario, comentarioID
        );

        if (errorNotificacion) return [null, errorNotificacion];

        return [comentarioExist, null];
    } catch (error) {
        console.error('Error al dar like al comentario:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function darDislikeComentarioService(comentarioID, rutUsuario) {
    try {
        const comentarioExist = await Comentario.findById(comentarioID);

        if (!comentarioExist) return [null, 'El comentario al que desea dar dislike no existe'];

        // Verificar si el usuario ya dio dislike
        if (comentarioExist.usuariosDislikes && comentarioExist.usuariosDislikes.includes(rutUsuario)) {
            return [null, 'Ya has dado dislike a este comentario'];
        }

        // Si el usuario había dado like, removerlo
        if (comentarioExist.usuariosLikes && comentarioExist.usuariosLikes.includes(rutUsuario)) {
            comentarioExist.usuariosLikes = comentarioExist.usuariosLikes.filter(rut => rut !== rutUsuario);
            comentarioExist.Likes = Math.max(0, comentarioExist.Likes - 1);
        }

        // Agregar dislike
        if (!comentarioExist.usuariosDislikes) comentarioExist.usuariosDislikes = [];
        comentarioExist.usuariosDislikes.push(rutUsuario);
        comentarioExist.Dislikes += 1;

        const comentarioActualizado = await comentarioExist.save();

        const [notificacionUserCreada, errorNotificacion] = await notificacionDislikeComentarioService(
            comentarioExist.rutAutor, rutUsuario, comentarioID
        );

        if (errorNotificacion) return [null, errorNotificacion];

        return [comentarioActualizado, null];
    } catch (error) {
        console.error('Error al dar dislike al comentario:', error);
        return [null, 'Error interno del servidor'];
    }
}