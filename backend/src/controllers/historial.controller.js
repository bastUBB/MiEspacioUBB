import { getHistorialUsuarioService, obtenerMiHistorialService } from "../services/historial.service.js";
import { historialQueryValidation } from "../validations/historial.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function getHistorialUsuario(req, res) {
    try {
        const { error: errorQuery, value: valueQuery } = historialQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [historial, errorHistorial] = await getHistorialUsuarioService(valueQuery.rutUser);

        if (errorHistorial) return handleErrorServer(res, 400, "Error al obtener el historial", errorHistorial);

        return handleSuccess(res, 200, "Historial obtenido con éxito", historial);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerMiHistorial(req, res) {
    try {
        console.log("req.query", req.query);
        const { error: errorQuery, value: valueQuery } = historialQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        console.log("valueQuery", valueQuery);

        const [historial, errorHistorial] = await obtenerMiHistorialService(valueQuery.rutUser);

        if (errorHistorial) return handleErrorServer(res, 400, "Error al obtener el historial", errorHistorial);

        return handleSuccess(res, 200, "Historial obtenido con éxito", historial);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
