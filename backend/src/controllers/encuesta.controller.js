import {
    crearEncuestaService,
    obtenerTodasEncuestasActivasService,
    obtenerTodasEncuestasService,
    obtenerEncuestaPorIdService,
    actualizarEncuestaService,
    eliminarEncuestaService,
    obtenerMisEncuestasService,
    obtenerEncuestasPorRutService
} from '../services/encuesta.service.js';
import {
    encuestaCreateValidation,
    encuestaQueryValidation,
    encuestaUpdateValidation,
    encuestaRutValidation,
    encuestaPerfilAcademicoIDValidation
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

export async function actualizarEncuesta(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = encuestaQueryValidation.validate(req.params);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación en Query", errorQuery.message);

        const { value: valueUpdate, error: errorUpdate } = encuestaUpdateValidation.validate(req.body);

        if (errorUpdate) return handleErrorClient(res, 400, "Error de validación en Body", errorUpdate.message);

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

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación en Query", errorQuery.message);

        const { value: valueRut, error: errorRut } = encuestaRutValidation.validate(req.params);

        if (errorRut) return handleErrorClient(res, 400, "Error de validación en Rut", errorRut.message);

        const [encuestaEliminada, errorEncuestaEliminada] = await eliminarEncuestaService(valueQuery._id, valueRut.rutUser);

        if (errorEncuestaEliminada) return handleErrorServer(res, 400, "Error al eliminar la encuesta", errorEncuestaEliminada);

        return handleSuccess(res, 200, "Encuesta eliminada con éxito", encuestaEliminada);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerTodasEncuestasActivas(req, res) {
    try {
        const [encuestasActivas, errorEncuestasActivas] = await obtenerTodasEncuestasActivasService();

        if (errorEncuestasActivas) return handleErrorServer(res, 400, "Error al obtener las encuestas activas", errorEncuestasActivas);

        return handleSuccess(res, 200, "Encuestas activas obtenidas con éxito", encuestasActivas);
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

export async function obtenerEncuestaPorId(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = encuestaQueryValidation.validate(req.params);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación en Query", errorQuery.message);

        const [encuesta, errorEncuesta] = await obtenerEncuestaPorIdService(valueQuery._id);

        if (errorEncuesta) return handleErrorServer(res, 400, "Error al obtener la encuesta", errorEncuesta);

        return handleSuccess(res, 200, "Encuesta obtenida con éxito", encuesta);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerMisEncuestas(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = encuestaPerfilAcademicoIDValidation.validate(req.params);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación en Query", errorQuery.message);

        const [encuestas, errorEncuestas] = await obtenerMisEncuestasService(valueQuery.perfilAcademicoID);

        if (errorEncuestas) return handleErrorServer(res, 400, "Error al obtener las encuestas", errorEncuestas);

        return handleSuccess(res, 200, "Encuestas obtenidas con éxito", encuestas);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerEncuestasPorRut(req, res) {
    try {
        const { rutAutor } = req.query;

        if (!rutAutor) return handleErrorClient(res, 400, "Error de validación", "El rut del autor es obligatorio");

        const [encuestas, errorEncuestas] = await obtenerEncuestasPorRutService(rutAutor);

        if (errorEncuestas) return handleErrorServer(res, 400, "Error al obtener las encuestas", errorEncuestas);

        return handleSuccess(res, 200, "Encuestas obtenidas con éxito", encuestas);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
