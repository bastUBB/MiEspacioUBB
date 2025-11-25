import {
    createAsignaturaService,
    getAsignaturaService,
    getAllAsignaturasService,
    updateAsignaturaService,
    deleteAsignaturaService,
    getUnidadesAsignaturaService,
    getAsignaturasSemestreActualService,
    obtenerCantidadAsignaturasService
} from "../services/asignatura.service.js";
import {
    asignaturaQueryValidation, asignaturaCreateValidation, asignaturaUpdateValidation,
    asignaturaSemestreActualValidation
} from "../validations/asignatura.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function createAsignatura(req, res) {
    try {
        const asignatura = req.body;

        const { value: valueQuery, error: errorQuery } = asignaturaCreateValidation.validate(asignatura);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [newAsignatura, errorNewAsignatura] = await createAsignaturaService(valueQuery);

        if (errorNewAsignatura) return handleErrorClient(res, 400, "Error registrando la asignatura", errorNewAsignatura);

        handleSuccess(res, 201, "Asignatura registrada con éxito", newAsignatura);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsignatura(req, res) {
    try {

        const { value: valueQuery, error: errorQuery } = asignaturaQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [asignatura, errorAsignatura] = await getAsignaturaService(valueQuery);

        if (errorAsignatura) return handleErrorClient(res, 404, "Asignatura no encontrada", errorAsignatura);

        handleSuccess(res, 200, "Asignatura encontrada", asignatura);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function obtenerCantidadAsignaturas(req, res) {
    try {
        const [cantidadAsignaturas, errorCantidadAsignaturas] = await obtenerCantidadAsignaturasService();

        if (errorCantidadAsignaturas) return handleErrorClient(res, 404, "No hay asignaturas registradas", errorCantidadAsignaturas);

        handleSuccess(res, 200, "Cantidad de asignaturas encontrada", cantidadAsignaturas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAllAsignaturas(req, res) {
    try {
        const [asignaturas, errorAsignaturas] = await getAllAsignaturasService();

        if (errorAsignaturas) return handleErrorClient(res, 404, "No hay asignaturas registradas", errorAsignaturas);

        handleSuccess(res, 200, "Asignaturas encontradas", asignaturas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateAsignatura(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = asignaturaQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const { value: valueBody, error: errorBody } = asignaturaUpdateValidation.validate(req.body);

        if (errorBody) return handleErrorClient(res, 400, "Error de validación en el body", errorBody.message);

        const [updatedAsignatura, errorUpdatedAsignatura] = await updateAsignaturaService(valueQuery, valueBody);

        if (errorUpdatedAsignatura) return handleErrorClient(res, 404, "Asignatura no encontrada", errorUpdatedAsignatura);

        handleSuccess(res, 200, "Asignatura actualizada con éxito", updatedAsignatura);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteAsignatura(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = asignaturaQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [deletedAsignatura, errorDeletedAsignatura] = await deleteAsignaturaService(valueQuery);

        if (errorDeletedAsignatura) return handleErrorClient(res, 404, "Asignatura no encontrada", errorDeletedAsignatura);

        handleSuccess(res, 200, "Asignatura eliminada con éxito", deletedAsignatura);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getUnidadesAsignatura(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = asignaturaQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [unidades, errorUnidades] = await getUnidadesAsignaturaService(valueQuery);

        if (errorUnidades) return handleErrorClient(res, 404, "Asignatura no encontrada", errorUnidades);

        handleSuccess(res, 200, "Unidades encontradas", unidades);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsignaturasSemestreActual(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = asignaturaSemestreActualValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validación", errorQuery.message);

        const [asignaturas, errorAsignaturas] = await getAsignaturasSemestreActualService(valueQuery);

        if (errorAsignaturas) return handleErrorClient(res, 404, "No hay asignaturas para el semestre actual", errorAsignaturas);

        handleSuccess(res, 200, "Asignaturas encontradas", asignaturas);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}