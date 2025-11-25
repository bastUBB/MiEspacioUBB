import Reporte from '../models/reporte.model.js';
import User from '../models/user.model.js';
import { notificacionNuevosReportesService, notificacionReporteResueltoService } from './notificacion.service.js';

export async function crearReporteUserService(dataReporte) {
    try {
        const { rutUsuarioReportado, rutUsuarioReporte } = dataReporte;

        const existUsuarioReportado = await User.findOne({ rut: rutUsuarioReportado });

        if (!existUsuarioReportado) return [null, 'El usuario reportado no existe'];

        const existUsuarioReporte = await User.findOne({ rut: rutUsuarioReporte });

        if (!existUsuarioReporte) return [null, 'El usuario que reporta no existe'];

        const nuevoReporte = new Reporte(dataReporte);

        await nuevoReporte.save();

        existUsuarioReportado.reportes.push(nuevoReporte._id);

        await existUsuarioReportado.save();

        return [nuevoReporte, null];
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        return [null, 'Error interno del servidor'];
    }
}

//para todos
export async function obtenerMisReportesService(rutUsuarioReporte) {
    try {
        const misReportes = await Reporte.find({ rutUsuarioReporte: rutUsuarioReporte });

        if (!misReportes || misReportes.length === 0) return [null, 'No tienes reportes realizados'];

        return [misReportes, null];
    } catch (error) {
        console.error('Error al obtener mis reportes:', error);
        return [null, 'Error interno del servidor'];
    }
}

//Para el admin
export async function getAllReportesPendientesPorFechaService() {
    try {
        const reportesPendientes = await Reporte.find({ estado: 'Pendiente' });

        if (!reportesPendientes || reportesPendientes.length === 0) return [null, 'No hay reportes pendientes'];

        reportesPendientes.sort((a, b) => {
            const [diaA, mesA, anioA] = a.fecha.split('-').map(Number);
            const [diaB, mesB, anioB] = b.fecha.split('-').map(Number);
            const fechaA = new Date(anioA, mesA - 1, diaA);
            const fechaB = new Date(anioB, mesB - 1, diaB);
            return fechaA - fechaB;
        });

        const [nuevaNotificacion, errorNotificacion] = await notificacionNuevosReportesService(reportesPendientes.length);

        if (errorNotificacion) return [null, errorNotificacion];

        return [reportesPendientes, null];
    } catch (error) {
        console.error('Error al obtener los reportes pendientes:', error);
        return [null, 'Error interno del servidor'];
    }
}

//Para el admin
export async function actualizarEstadoReporteService(reporteID, resolucion) {
    try {
        const reporteExist = await Reporte.findById(reporteID);

        if (!reporteExist) return [null, 'El reporte que desea actualizar no existe'];

        reporteExist.estado = "Resuelto";

        reporteExist.resolucion = resolucion;

        const reporteActualizado = await reporteExist.save();

        const [nuevaNotificacion, errorNotificacion] = await notificacionReporteResueltoService(reporteExist.rutUsuarioReporte, reporteID);

        if (errorNotificacion) return [null, errorNotificacion];

        return [reporteActualizado, null];
    }
    catch (error) {
        console.error('Error al actualizar el estado del reporte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerCantidadReportesPendientesService() {
    try {
        const cantidadReportesPendientes = await Reporte.find({ estado: 'Pendiente' });

        if (!cantidadReportesPendientes || cantidadReportesPendientes.length === 0) return [null, 'No hay reportes pendientes'];

        return [cantidadReportesPendientes.length, null];
    } catch (error) {
        console.error('Error al obtener la cantidad de reportes pendientes:', error);
        return [null, 'Error interno del servidor'];
    }
}


