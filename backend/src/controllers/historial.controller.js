import { getHistorialUsuarioService } from "../services/historial.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function getHistorialUsuario(req, res) {
    try {
        const { rutUser } = req.query;

        if (!rutUser) return handleErrorClient(res, 400, "Error de validación", "El RUT del usuario es requerido");

        const [historial, errorHistorial] = await getHistorialUsuarioService(rutUser);

        if (errorHistorial) return handleErrorServer(res, 400, "Error al obtener el historial", errorHistorial);

        return handleSuccess(res, 200, "Historial obtenido con éxito", historial);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
