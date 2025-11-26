import {
    crearEncuestaService,
    obtenerTodasEncuestasActivasService,
    obtenerTodasEncuestasService,
    obtenerEncuestaPorIdService,
    actualizarEncuestaService,
    eliminarEncuestaService,
    obtenerCantidadEncuestasService
} from '../services/encuesta.service.js';
import {
    encuestaCreateValidation,
    encuestaQueryValidation,
    encuestaUpdateValidation
} from '../validations/encuesta.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function crearEncuesta(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = encuestaCreateValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, "Error de validación", errorCreate.message);

        const [nuevaEncuesta, errorNuevaEncuesta] = await crearEncuestaService(valueCreate);

        if (errorNuevaEncuesta) return handleErrorServer(res, 400, "Error al crear la encuesta", errorNuevaEncuesta);

        return handleSuccess(res, 201, "Encuesta creada con éxito", nuevaEncuesta);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerTodasEncuestasActivas(req, res) {
    try {
        const [encuestasActivas, errorEncuestasActivas] = await obtenerTodasEncuestasActivasService();

        if (errorEncuestasActivas) return handleErrorServer(res, 400, "Error al obtener las encuestas", errorEncuestasActivas);

        return handleSuccess(res, 200, "Encuestas obtenidas con éxito", encuestasActivas);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerTodasEncuestas(req, res) {
    try {
        const [encuestas, errorEncuestas] = await obtenerTodasEncuestasService();

        if (errorEncuestas) return handleErrorServer(res, 400, "Error al obtener las encuestas", errorEncuestas);

        return handleSuccess(res, 200, "Encuestas obtenidas con éxito", encuestas);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerEncuesta(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = encuestaQueryValidation.validate(req.params);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [encuesta, errorEncuesta] = await obtenerEncuestaPorIdService(valueQuery._id);

        if (errorEncuesta) return handleErrorServer(res, 400, "Error al obtener la encuesta", errorEncuesta);

        return handleSuccess(res, 200, "Encuesta obtenida con éxito", encuesta);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function actualizarEncuesta(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = encuestaQueryValidation.validate(req.params);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const { value: valueUpdate, error: errorUpdate } = encuestaUpdateValidation.validate(req.body);

        if (errorUpdate) return handleErrorClient(res, 400, "Error de validación", errorUpdate.message);

        const [encuestaActualizada, errorEncuestaActualizada] = await actualizarEncuestaService(valueQuery._id, valueUpdate);

        if (errorEncuestaActualizada) return handleErrorServer(res, 400, "Error al actualizar la encuesta", errorEncuestaActualizada);

        return handleSuccess(res, 200, "Encuesta actualizada con éxito", encuestaActualizada);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function eliminarEncuesta(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = encuestaQueryValidation.validate(req.params);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [resultado, errorResultado] = await eliminarEncuestaService(valueQuery._id);

        if (errorResultado) return handleErrorServer(res, 400, "Error al eliminar la encuesta", errorResultado);

        return handleSuccess(res, 200, "Encuesta eliminada con éxito", resultado);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerCantidadEncuestas(req, res) {
    try {
        const [cantidad, errorCantidad] = await obtenerCantidadEncuestasService();

        if (errorCantidad) return handleErrorServer(res, 400, "Error al obtener la cantidad de encuestas", errorCantidad);

        return handleSuccess(res, 200, "Cantidad de encuestas obtenida con éxito", cantidad);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
