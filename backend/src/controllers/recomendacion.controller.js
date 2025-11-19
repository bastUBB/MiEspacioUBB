import {
    generarRecomendacionPersonalizadaService,
    obtenerRecomendacionesGenericasService,
    obtenerRecomendacionesPorAsignaturaService
} from '../services/recomendacion.service.js';
import {
    recomendacionPersonalizadaValidation,
    recomendacionGenericaValidation,
    recomendacionPorAsignaturaValidation
} from '../validations/recomendacion.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

/**
 * Controlador para obtener recomendaciones personalizadas
 * GET /api/recomendaciones/personalizadas?rutUser=xx.xxx.xxx-x&limite=20
 */
export async function obtenerRecomendacionesPersonalizadas(req, res) {
    try {
        const { value, error } = recomendacionPersonalizadaValidation.validate(req.query);

        if (error) return handleErrorClient(res, 400, 'Parámetros de consulta inválidos', error.message);

        const { rutUser, limite } = value;

        const [recomendaciones, serviceError] = await generarRecomendacionPersonalizadaService(
            rutUser, 
            limite
        );

        if (serviceError) return handleErrorServer(res, 500, 'Error al generar recomendaciones', serviceError);

        if (!recomendaciones || recomendaciones.length === 0) {
            return handleSuccess(res, 200, 'No hay recomendaciones disponibles en este momento', []);
        }

        return handleSuccess(
            res, 
            200, 
            `Recomendaciones generadas exitosamente (${recomendaciones.length} apuntes)`, 
            recomendaciones
        );

    } catch (error) {
        console.error('Error en controlador de recomendaciones personalizadas:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

/**
 * Controlador para obtener recomendaciones genéricas (sin perfil académico)
 * GET /api/recomendaciones/genericas?limite=20
 */
export async function obtenerRecomendacionesGenericas(req, res) {
    try {
        const { value, error } = recomendacionGenericaValidation.validate(req.query);

        if (error) return handleErrorClient(res, 400, 'Parámetros de consulta inválidos', error.message);

        const { limite } = value;

        const [recomendaciones, serviceError] = await obtenerRecomendacionesGenericasService(limite);

        if (serviceError) return handleErrorServer(res, 500, 'Error al obtener recomendaciones', serviceError);

        if (!recomendaciones || recomendaciones.length === 0) {
            return handleSuccess(res, 200, 'No hay apuntes disponibles en este momento', []);
        }

        return handleSuccess(
            res,
            200,
            `Recomendaciones populares obtenidas exitosamente (${recomendaciones.length} apuntes)`,
            recomendaciones
        );

    } catch (error) {
        console.error('Error en controlador de recomendaciones genéricas:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

/**
 * Controlador para obtener recomendaciones por asignatura específica
 * GET /api/recomendaciones/por-asignatura?asignatura=Matematicas&rutUser=xx.xxx.xxx-x&limite=10
 */
export async function obtenerRecomendacionesPorAsignatura(req, res) {
    try {
        const { value, error } = recomendacionPorAsignaturaValidation.validate(req.query);

        if (error) return handleErrorClient(res, 400, 'Parámetros de consulta inválidos', error.message);

        const { rutUser, asignatura, limite } = value;

        const [recomendaciones, serviceError] = await obtenerRecomendacionesPorAsignaturaService(
            rutUser,
            asignatura,
            limite
        );

        if (serviceError) return handleErrorServer(res, 500, 'Error al obtener recomendaciones', serviceError);

        if (!recomendaciones || recomendaciones.length === 0) {
            return handleSuccess(
                res, 
                200, 
                `No hay apuntes disponibles para la asignatura "${asignatura}"`, 
                []
            );
        }

        return handleSuccess(
            res,
            200,
            `Recomendaciones para ${asignatura} obtenidas exitosamente (${recomendaciones.length} apuntes)`,
            recomendaciones
        );

    } catch (error) {
        console.error('Error en controlador de recomendaciones por asignatura:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}
