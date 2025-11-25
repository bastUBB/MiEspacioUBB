import {
    crearReporteUserService,
    obtenerMisReportesService,
    getAllReportesPendientesPorFechaService,
    actualizarEstadoReporteService,
    obtenerCantidadReportesPendientesService
} from '../services/reporte.service.js';
import { reporteQueryValidation, reporteCreateValidation, reporteUpdateValidation, consultaReportesValidation } from '../validations/reporte.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';

export async function createReporteUser(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = reporteCreateValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, "Error de validacion", errorCreate.message);

        const [newReporte, errorNewReporte] = await crearReporteUserService(valueCreate);

        if (errorNewReporte) return handleErrorServer(res, 400, "Error al crear el reporte", errorNewReporte);

        return handleSuccess(res, 201, "Reporte registrado con éxito", newReporte);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerMisReportes(req, res) {
    try {
        const { value: valueConsulta, error: erroConsulta } = consultaReportesValidation.validate(req.query);

        if (erroConsulta) return handleErrorClient(res, 400, "Error de validacion", erroConsulta.message);

        const [misReportes, errorMisReportes] = await obtenerMisReportesService(valueConsulta.rutUsuarioReporte);

        if (errorMisReportes) return handleErrorServer(res, 400, "Error al obtener los reportes", errorMisReportes);

        return handleSuccess(res, 200, "Reportes obtenidos con éxito", misReportes);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function getAllReportesPendientesPorFecha(req, res) {
    try {
        const [reportesPendientes, errorReportesPendientes] = await getAllReportesPendientesPorFechaService();

        if (errorReportesPendientes) return handleErrorServer(res, 400, "Error al obtener los reportes pendientes", errorReportesPendientes);

        return handleSuccess(res, 200, "Reportes pendientes obtenidos con éxito", reportesPendientes);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function actualizarEstadoReporte(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = reporteQueryValidation.validate(req.params);

        if (errorQuery) return handleErrorClient(res, 400, "Error de validacion", errorQuery.message);

        const { value: valueUpdate, error: errorUpdate } = reporteUpdateValidation.validate(req.body);

        if (errorUpdate) return handleErrorClient(res, 400, "Error de validacion", errorUpdate.message);

        const [reporteActualizado, errorReporteActualizado] = await actualizarEstadoReporteService(valueQuery._id, valueUpdate.resolucion);

        if (errorReporteActualizado) return handleErrorServer(res, 400, "Error al actualizar el estado del reporte", errorReporteActualizado);

        return handleSuccess(res, 200, "Estado del reporte actualizado con éxito", reporteActualizado);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function obtenerCantidadReportesPendientes(req, res) {
    try {
        const [cantidadReportesPendientes, errorCantidadReportesPendientes] = await obtenerCantidadReportesPendientesService();

        if (errorCantidadReportesPendientes) return handleErrorServer(res, 400, "Error al obtener la cantidad de reportes pendientes", errorCantidadReportesPendientes);

        return handleSuccess(res, 200, "Cantidad de reportes pendientes obtenida con éxito", cantidadReportesPendientes);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}
