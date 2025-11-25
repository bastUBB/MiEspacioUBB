import {
    createPerfilAcademicoService,
    getPerfilAcademicoService,
    updatePerfilAcademicoService,
    deletePerfilAcademicoService,
    poseePerfilAcademicoService,
    numeroApuntesUserService,
    busquedaApuntesMismoAutorService,
    busquedaApuntesMismaAsignaturaService,
    obtenerValoracionPromedioApuntesService,
    obtenerNumeroDescargasApuntesService,
    createPerfilAcademicoDocenteService,
    createPerfilAcademicoAyudanteService,
    obtenerMayoresContribuidoresService
} from "../services/perfilAcademico.service.js";
import {
    perfilAcademicoQueryValidation,
    perfilAcademicoCreateEstudianteValidation,
    perfilAcademicoUpdateValidation,
    busquedaApuntesValidation,
    perfilAcademicoCreateDocenteValidation,
    perfilAcademicoCreateAyudanteValidation
} from "../validations/perfilAcademico.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function createPerfilAcademicoEstudiante(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = perfilAcademicoCreateEstudianteValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, "Error de validacion", errorCreate.message);

        const [newPerfilAcademico, errorNewPerfilAcademico] = await createPerfilAcademicoService(valueCreate);

        if (errorNewPerfilAcademico) return handleErrorServer(res, 400, "Error al crear el perfil academico", errorNewPerfilAcademico);

        return handleSuccess(res, 201, "Perfil academico registrado con éxito", newPerfilAcademico);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function createPerfilAcademicoDocente(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = perfilAcademicoCreateDocenteValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, "Error de validacion", errorCreate.message);

        const [newPerfilAcademico, errorNewPerfilAcademico] = await createPerfilAcademicoDocenteService(valueCreate);

        if (errorNewPerfilAcademico) return handleErrorServer(res, 400, "Error al crear el perfil academico", errorNewPerfilAcademico);

        return handleSuccess(res, 201, "Perfil academico registrado con éxito", newPerfilAcademico);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function createPerfilAcademicoAyudante(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = perfilAcademicoCreateAyudanteValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, "Error de validacion", errorCreate.message);

        const [newPerfilAcademico, errorNewPerfilAcademico] = await createPerfilAcademicoAyudanteService(valueCreate);

        if (errorNewPerfilAcademico) return handleErrorServer(res, 400, "Error al crear el perfil academico", errorNewPerfilAcademico);

        return handleSuccess(res, 201, "Perfil academico registrado con éxito", newPerfilAcademico);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function getPerfilAcademico(req, res) {
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

export async function updatePerfilAcademico(req, res) {
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

export async function deletePerfilAcademico(req, res) {
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

export async function poseePerfilAcademico(req, res) {
    try {

        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [perfilAcademico, errorPerfilAcademico] = await poseePerfilAcademicoService(valueQuery.rutUser);

        if (errorPerfilAcademico) return handleErrorServer(res, 400, "Error al obtener el perfil academico", errorPerfilAcademico);

        return handleSuccess(res, 200, "Perfil academico obtenido con éxito", perfilAcademico);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function numeroApuntesUser(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [numApuntes, errorNumApuntes] = await numeroApuntesUserService(valueQuery.rutUser);

        if (numApuntes === 0) return handleSuccess(res, 200, "El usuario no tiene apuntes", 0);

        if (errorNumApuntes) return handleErrorServer(res, 400, "Error al obtener el número de apuntes del usuario", errorNumApuntes);

        return handleSuccess(res, 200, "Número de apuntes obtenido con éxito", numApuntes);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function busquedaApuntesMismoAutor(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const { value: valueBusqueda, error: errorBusqueda } = busquedaApuntesValidation.validate(req.body);

        if (errorBusqueda) return handleErrorClient(res, 400, "Error de validacion", errorBusqueda.message);

        const [apuntes, errorApuntes] = await busquedaApuntesMismoAutorService(valueQuery.rutUser, valueBusqueda.asignaturaApunteActual);

        if (errorApuntes) return handleErrorServer(res, 400, "Error al buscar apuntes del mismo autor", errorApuntes);

        return handleSuccess(res, 200, "Apuntes del mismo autor obtenidos con éxito", apuntes);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function busquedaApuntesMismaAsignatura(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const { value: valueBusqueda, error: errorBusqueda } = busquedaApuntesValidation.validate(req.body);

        if (errorBusqueda) return handleErrorClient(res, 400, "Error de validacion", errorBusqueda.message);

        const [apuntes, errorApuntes] = await busquedaApuntesMismaAsignaturaService(valueQuery.rutUser, valueBusqueda.asignaturaApunteActual);

        if (errorApuntes) return handleErrorServer(res, 400, "Error al buscar apuntes de la misma asignatura", errorApuntes);

        return handleSuccess(res, 200, "Apuntes de la misma asignatura obtenidos con éxito", apuntes);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerValoracionPromedioApuntes(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [valoracion, errorValoracion] = await obtenerValoracionPromedioApuntesService(valueQuery.rutUser);

        if (errorValoracion) return handleErrorServer(res, 400, "Error al obtener la valoración del perfil academico", errorValoracion);

        return handleSuccess(res, 200, "Valoración del perfil academico obtenida con éxito", valoracion);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerNumeroDescargasApuntes(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = perfilAcademicoQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const [numDescargas, errorNumDescargas] = await obtenerNumeroDescargasApuntesService(valueQuery.rutUser);

        if (errorNumDescargas) return handleErrorServer(res, 400, "Error al obtener el número de descargas de apuntes del usuario", errorNumDescargas);

        return handleSuccess(res, 200, "Número de descargas de apuntes obtenido con éxito", numDescargas);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerMayoresContribuidores(req, res) {
    try {
        const [contribuidores, errorContribuidores] = await obtenerMayoresContribuidoresService();

        if (contribuidores.length === 0) return handleSuccess(res, 200, "No hay contribuidores disponibles", []);

        if (errorContribuidores) return handleErrorServer(res, 400, "Error al obtener los mayores contribuidores", errorContribuidores);

        return handleSuccess(res, 200, "Mayores contribuidores obtenidos con éxito", contribuidores);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}