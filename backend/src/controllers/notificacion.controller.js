import { obtenerTodasMisNotificacionesService, actualizarEstadoLeidoService, borrarNotificacionesLeidasService } from '../services/notificacion.service.js';
import { notificacionQueryValidation, notificacionRutUsuarioValidation } from '../validations/notificacion.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function obtenerTodasMisNotificaciones(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = notificacionRutUsuarioValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [misNotificaciones, errorMisNotificaciones] = await obtenerTodasMisNotificacionesService(valueQuery.rutUsuario);

        if (misNotificaciones.length === 0) return handleSuccess(res, 200, "No tienes notificaciones pendientes", []);
        
        if (errorMisNotificaciones) return handleErrorServer(res, 400, "Error al obtener las notificaciones", errorMisNotificaciones);

        return handleSuccess(res, 200, "Notificaciones obtenidas con éxito", misNotificaciones);
    }
    catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function actualizarEstadoLeido(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = notificacionQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message); 

        const [notificacionLeida, errorNotificacionLeida] = await actualizarEstadoLeidoService(valueQuery._id);

        if (errorNotificacionLeida) return handleErrorServer(res, 400, "Error al marcar la notificación como leída", errorNotificacionLeida);

        return handleSuccess(res, 200, "Notificación marcada como leída con éxito", notificacionLeida);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function borrarNotificacionesLeidas(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = notificacionRutUsuarioValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [resultadoBorrado, errorBorrado] = await borrarNotificacionesLeidasService(valueQuery.rutUsuario);

        if (errorBorrado) return handleErrorServer(res, 400, "Error al borrar las notificaciones leídas", errorBorrado);

        return handleSuccess(res, 200, "Notificaciones leídas borradas con éxito", { cantidadBorrada: resultadoBorrado });
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}