import {
    darLikeComentarioService,
    darDislikeComentarioService,
} from '../services/comentario.service.js';
import { comentarioQueryValidation } from '../validations/comentario.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function likeComentario(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = comentarioQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [comentarioLike, errorComentarioLike] = await darLikeComentarioService(valueQuery._id);

        if (errorComentarioLike) return handleErrorServer(res, 400, "Error al dar like al comentario", errorComentarioLike);

        return handleSuccess(res, 200, "Like al comentario realizado con éxito", comentarioLike);

    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function dislikeComentario(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = comentarioQueryValidation.validate(req.query); 

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [comentarioDislike, errorComentarioDislike] = await darDislikeComentarioService(valueQuery._id);

        if (errorComentarioDislike) return handleErrorServer(res, 400, "Error al dar dislike al comentario", errorComentarioDislike);

        return handleSuccess(res, 200, "Dislike al comentario realizado con éxito", comentarioDislike);

    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
