import {
    realizarInteraccionComentarioService,
} from '../services/comentario.service.js';
import { comentarioQueryValidation } from '../validations/comentario.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

/**
 * Controlador central para manejar interacciones con comentarios
 */
export async function interaccionComentario(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = comentarioQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const { tipoAccion } = req.body;

        if (!tipoAccion || !['like', 'dislike'].includes(tipoAccion)) {
            return handleErrorClient(res, 400, "Tipo de acción inválido", "tipoAccion debe ser 'like' o 'dislike'");
        }

        const rutUsuario = req.user.rut;
        const [resultado, error] = await realizarInteraccionComentarioService(valueQuery._id, rutUsuario, tipoAccion);

        if (error) return handleErrorClient(res, 400, `Error al procesar ${tipoAccion}`, error);

        const mensaje = tipoAccion === 'like' ? 'Like agregado exitosamente' : 'Dislike agregado exitosamente';
        return handleSuccess(res, 200, mensaje, resultado);

    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

// Mantener endpoints legacy para compatibilidad
export async function likeComentario(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = comentarioQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const rutUsuario = req.user.rut;
        const [comentarioLike, errorComentarioLike] = await realizarInteraccionComentarioService(valueQuery._id, rutUsuario, 'like');

        if (errorComentarioLike) return handleErrorClient(res, 400, "Error al dar like al comentario", errorComentarioLike);

        return handleSuccess(res, 200, "Like al comentario realizado con éxito", comentarioLike);

    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function dislikeComentario(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = comentarioQueryValidation.validate(req.query); 

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const rutUsuario = req.user.rut;
        const [comentarioDislike, errorComentarioDislike] = await realizarInteraccionComentarioService(valueQuery._id, rutUsuario, 'dislike');

        if (errorComentarioDislike) return handleErrorClient(res, 400, "Error al dar dislike al comentario", errorComentarioDislike);

        return handleSuccess(res, 200, "Dislike al comentario realizado con éxito", comentarioDislike);

    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
