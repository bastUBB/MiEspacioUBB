import { 
    createApunteService,
    updateApunteService,
    deleteApunteService,
    getAllApuntesService,
    obtenerMisApuntesByRutService,
    sumarVisualizacionInvitadoApunteService,
    sumarVisualizacionUsuariosApunteService,
    crearComentarioApunteService,
    crearRespuestaComentarioApunteService,
    realizarValoracionApunteService,
    crearReporteApunteService,
    obtenerApuntesMasValoradosService,
    apuntesMasVisualizadosService,
    obtenerAsignaturasConMasApuntesService
} from '../services/apunte.service.js';
import { comentarioCreateValidation } from '../validations/comentario.validation.js';
import { apunteQueryValidation, apunteCreateValidation, apunteUpdateValidation, visualizacionValidation,
    valoracionValidation } from '../validations/apunte.validation.js';
import { reporteCreateValidation } from '../validations/reporte.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer, handleMulterError } from '../handlers/responseHandlers.js';

export async function createApunte(req, res) {
    try {
        const { value: valueBody, error: errorBody } = apunteCreateValidation.validate(req.body);

        if (errorBody) return handleErrorClient(res, 400, 'Datos de entrada inválidos', errorBody.message);

        if (!req.file) return handleErrorClient(res, 400, 'No se proporcionó ningún archivo');
                
        const [nuevoApunte, createError] = await createApunteService(valueBody, req.file);

        if (createError) return handleErrorServer(res, 500, 'Error al crear apunte', createError);
    
        return handleSuccess(res, 201, 'Apunte creado exitosamente', nuevoApunte);
    } catch (error) {
        console.error('Error al crear apunte:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function updateApunte(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = apunteQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, 'ID de apunte inválido', errorQuery.message);

        const { value: valueBody, error: errorBody } = apunteUpdateValidation.validate(req.body);

        if (errorBody) return handleErrorClient(res, 400, 'Datos de entrada inválidos', errorBody.message);

        const [apunteActualizado, updateError] = await updateApunteService(valueQuery, valueBody);

        if (updateError) return handleErrorServer(res, 500, 'Error al actualizar apunte', updateError);

        return handleSuccess(res, 200, 'Apunte actualizado exitosamente', apunteActualizado);
    } catch (error) {
        console.error('Error al actualizar apunte:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function deleteApunte(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = apunteQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, 'ID de apunte inválido', errorQuery.message);

        const [apunteEliminado, deleteError] = await deleteApunteService(valueQuery.apunteID);

        if (deleteError) return handleErrorServer(res, 500, 'Error al eliminar apunte', deleteError);

        return handleSuccess(res, 200, 'Apunte eliminado exitosamente', apunteEliminado);
    } catch (error) {
        console.error('Error al eliminar apunte:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerMisApuntesByRut(req, res) {
    try {
        const { value: valueQuery, error: errorQuery } = apunteQueryValidation.validate(req.query);

        if (errorQuery) return handleErrorClient(res, 400, 'RUT de usuario inválido', errorQuery.message);

        const [misApuntes, misApuntesError] = await obtenerMisApuntesByRutService(valueQuery.rutAutorSubida);    

        if (misApuntes.length === 0) return handleSuccess(res, 200, 'No tienes apuntes subidos', []);

        if (misApuntesError) return handleErrorServer(res, 500, 'Error al obtener mis apuntes', misApuntesError);

        return handleSuccess(res, 200, 'Mis apuntes obtenidos exitosamente', misApuntes);
    } catch (error) {
        console.error('Error al obtener mis apuntes:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function getAllApuntes(req, res) {
    try {
        const [apuntes, apuntesError] = await getAllApuntesService();

        if (apuntesError) return handleErrorServer(res, 500, 'Error al obtener todos los apuntes', apuntesError);

        return handleSuccess(res, 200, 'Todos los apuntes obtenidos exitosamente', apuntes);
    } catch (error) {
        console.error('Error al obtener todos los apuntes:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function sumarVisualizacionInvitadoApunte(req, res) {
    try {
        const { value: valueBody, error: errorBody } = visualizacionValidation.validate(req.body);

        if (errorBody) return handleErrorClient(res, 400, 'Datos de entrada inválidos', errorBody.message);

        const [apunteActualizado, updateError] = await sumarVisualizacionInvitadoApunteService(valueBody._id);

        if (updateError) return handleErrorServer(res, 500, 'Error al actualizar visualizaciones', updateError);

        return handleSuccess(res, 200, 'Visualización de invitado sumada exitosamente', apunteActualizado);
    }
    catch (error) {
        console.error('Error al sumar visualización de invitado:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function sumarVisualizacionUsuariosApunte(req, res) {
    try {
        const { value: valueBody, error: errorBody } = visualizacionValidation.validate(req.body);

        if (errorBody) return handleErrorClient(res, 400, 'Datos de entrada inválidos', errorBody.message);

        const [apunteActualizado, updateError] = await sumarVisualizacionUsuariosApunteService(valueBody._id, valueBody.rutDueñoApunte);

        if (updateError) return handleErrorServer(res, 500, 'Error al actualizar visualizaciones', updateError);

        return handleSuccess(res, 200, 'Visualización de usuario sumada exitosamente', apunteActualizado);
    }
    catch (error) {
        console.error('Error al sumar visualización de usuario:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function crearComentarioApunte(req, res) {
    try {
        const { value: valueID, error: errorID } = apunteQueryValidation.validate(req.query);

        if (errorID) return handleErrorClient(res, 400, 'ID de apunte inválido', errorID.message);

        const { value: valueCreate, error: errorCreate } = comentarioCreateValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, 'Datos de comentario inválidos', errorCreate.message);

        const [nuevoComentario, createError] = await crearComentarioApunteService(valueID.apunteID, valueCreate);

        if (createError) return handleErrorServer(res, 500, 'Error al crear comentario', createError);

        return handleSuccess(res, 201, 'Comentario creado exitosamente', nuevoComentario);
    } catch (error) {
        console.error('Error al crear comentario:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function crearRespuestaComentarioApunte(req, res) {
    try {
        const { value: valueID, error: errorID } = apunteQueryValidation.validate(req.query);

        if (errorID) return handleErrorClient(res, 400, 'ID de apunte inválido', errorID.message);

        const { value: valueCreate, error: errorCreate } = comentarioCreateValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, 'Datos de respuesta inválidos', errorCreate.message);

        const [nuevaRespuesta, createError] = await crearRespuestaComentarioApunteService(valueID.apunteID, valueCreate.comentarioPadreID, valueCreate);

        if (createError) return handleErrorServer(res, 500, 'Error al crear respuesta', createError);

        return handleSuccess(res, 201, 'Respuesta creada exitosamente', nuevaRespuesta);
    } catch (error) {
        console.error('Error al crear respuesta:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function realizarValoracionApunte(req, res) {
    try {
        const { value: valueID, error: errorID } = apunteQueryValidation.validate(req.query);

        if (errorID) return handleErrorClient(res, 400, 'ID de apunte inválido', errorID.message);

        const { value: valueValoracion, error: errorValoracion } = valoracionValidation.validate(req.body);

        if (errorValoracion) return handleErrorClient(res, 400, 'Datos de valoración inválidos', errorValoracion.message);

        const [apunteActualizado, valoracionError] = await realizarValoracionApunteService(valueID.apunteID, valueValoracion.rutUsuarioValoracion, valueValoracion.valoracion);

        if (valoracionError) return handleErrorServer(res, 500, 'Error al realizar valoración', valoracionError);

        return handleSuccess(res, 200, 'Valoración realizada exitosamente', apunteActualizado);
    } catch (error) {
        console.error('Error al realizar valoración:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function crearReporteApunte(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = apunteQueryValidation.validate(req.query);

        if (errorCreate) return handleErrorClient(res, 400, 'ID de apunte inválido', errorCreate.message);

        const { value: valueReporte, error: errorReporte } = reporteCreateValidation.validate(req.body);

        if (errorReporte) return handleErrorClient(res, 400, 'Datos de reporte inválidos', errorReporte.message);

        const [nuevoReporte, createError] = await crearReporteApunteService(valueCreate.apunteID, valueReporte);

        if (createError) return handleErrorServer(res, 500, 'Error al crear reporte', createError);

        return handleSuccess(res, 201, 'Reporte creado exitosamente', nuevoReporte);
    } catch (error) {
        console.error('Error al crear reporte:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerApuntesMasValorados(req, res) {
    try {
        const [apuntes, apuntesError] = await obtenerApuntesMasValoradosService();

        if (apuntes.length === 0) return handleSuccess(res, 200, 'No hay apuntes disponibles', []); 

        if (apuntesError) return handleErrorServer(res, 500, 'Error al obtener apuntes más valorados', apuntesError);

        return handleSuccess(res, 200, 'Apuntes más valorados obtenidos exitosamente', apuntes);

    } catch (error) {
        console.error('Error al obtener apuntes más valorados:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerApuntesMasVisualizados(req, res) {
    try {
        const [apuntes, apuntesError] = await apuntesMasVisualizadosService();

        if (apuntes.length === 0) return handleSuccess(res, 200, 'No hay apuntes disponibles', []); 

        if (apuntesError) return handleErrorServer(res, 500, 'Error al obtener apuntes más visualizados', apuntesError);

        return handleSuccess(res, 200, 'Apuntes más visualizados obtenidos exitosamente', apuntes);
    } catch (error) {
        console.error('Error al obtener apuntes más visualizados:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }
}

export async function obtenerAsignaturasConMasApuntes(req, res) {
    try {
        const [asignaturas, asignaturasError] = await obtenerAsignaturasConMasApuntesService();

        if (asignaturas.length === 0) return handleSuccess(res, 200, 'No hay asignaturas disponibles', []);

        if (asignaturasError) return handleErrorServer(res, 500, 'Error al obtener asignaturas con más apuntes', asignaturasError);

        return handleSuccess(res, 200, 'Asignaturas con más apuntes obtenidas exitosamente', asignaturas);
    } catch (error) {   
        console.error('Error al obtener asignaturas con más apuntes:', error);
        return handleErrorServer(res, 500, 'Error interno del servidor');
    }   
}