import {
    createPerfilAcademicoService,
    getPerfilAcademicoService,
    updatePerfilAcademicoService,
    deletePerfilAcademicoService
} from "../services/perfilAcademico.service.js";
import {
    perfilAcademicoQueryValidation,
    perfilAcademicoCreateValidation,
    perfilAcademicoUpdateValidation
} from "../validations/perfilAcademico.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function createPerfilAcademicoController(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = perfilAcademicoCreateValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, "Error de validacion", errorCreate.message);

        const [newPerfilAcademico, errorNewPerfilAcademico] = await createPerfilAcademicoService(valueCreate);

        if (errorNewPerfilAcademico) return handleErrorServer(res, 400, "Error al crear el perfil academico", errorNewPerfilAcademico);

        return handleSuccess(res, 201, "Perfil academico registrado con éxito", newPerfilAcademico);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function getPerfilAcademicoController(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [perfilAcademico, errorPerfilAcademico] = await getPerfilAcademicoService(valueQuery);

        if (errorPerfilAcademico) return handleErrorServer(res, 400, "Error al obtener el perfil academico", errorPerfilAcademico);

        return handleSuccess(res, 200, "Perfil academico obtenido con éxito", perfilAcademico);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function updatePerfilAcademicoController(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const { value: valueUpdate, error: errorUpdate } = perfilAcademicoUpdateValidation.validate(req.body);

        if (errorUpdate) return handleErrorClient(res, 400, "Error de validacion", errorUpdate.message);

        const [perfilAcademicoUpdated, errorPerfilAcademicoUpdated] = await updatePerfilAcademicoService(valueQuery, valueUpdate);

        if (errorPerfilAcademicoUpdated) return handleErrorServer(res, 400, "Error al actualizar el perfil academico", errorPerfilAcademicoUpdated);

        return handleSuccess(res, 200, "Perfil academico actualizado con éxito", perfilAcademicoUpdated);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function deletePerfilAcademicoController(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [perfilAcademicoDeleted, errorPerfilAcademicoDeleted] = await deletePerfilAcademicoService(valueQuery);

        if (errorPerfilAcademicoDeleted) return handleErrorServer(res, 400, "Error al eliminar el perfil academico", errorPerfilAcademicoDeleted);

        return handleSuccess(res, 200, "Perfil academico eliminado con éxito", perfilAcademicoDeleted);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}