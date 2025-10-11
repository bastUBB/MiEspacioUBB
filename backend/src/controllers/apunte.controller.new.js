import { 
    uploadToMinIOService, 
    downloadFromMinIOService, 
    deleteFromMinIOService, 
    getSignedUrlFromMinIOService 
} from '../services/minio.service.js';
import { 
    validateAndProcessFileHandler,
    formatFileResponseHandler 
} from '../handlers/file.handler.js';
import Apunte from '../models/apunte.model.js';
import { handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';
import { apunteCreateValidation } from '../validations/apunte.validation.js';

/**
 * Crear un nuevo apunte con archivo
 */
export async function createApunteController(req, res) {
    try {
        // Validar datos del formulario
        const { error, value } = apunteCreateValidation.validate(req.body);
        if (error) {
            return handleError(res, 400, error.details[0].message);
        }

        // Validar y procesar archivo usando el handler
        const [processedFile, fileError] = validateAndProcessFileHandler(req.file);
        if (fileError) {
            return handleError(res, 400, fileError);
        }

        const { fileInfo, minioData } = processedFile;

        // Subir archivo a MinIO usando el servicio
        const [uploadSuccess, uploadError] = await uploadToMinIOService(
            minioData.filePath,
            minioData.buffer,
            minioData.size,
            minioData.metadata
        );

        if (uploadError) {
            return handleError(res, 500, uploadError);
        }

        // Crear el apunte con la información del archivo
        const nuevoApunte = new Apunte({
            ...value,
            archivo: fileInfo
        });

        // Guardar en la base de datos
        await nuevoApunte.save();

        return handleSuccess(res, 201, 'Apunte creado exitosamente', nuevoApunte);
    } catch (error) {
        console.error('Error al crear apunte:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Obtener todos los apuntes
 */
export async function getApuntesController(req, res) {
    try {
        const apuntes = await Apunte.find();
        return handleSuccess(res, 200, 'Apuntes obtenidos exitosamente', apuntes);
    } catch (error) {
        console.error('Error al obtener apuntes:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Obtener un apunte por ID
 */
export async function getApunteByIdController(req, res) {
    try {
        const { id } = req.params;
        
        const apunte = await Apunte.findById(id);
        if (!apunte) {
            return handleError(res, 404, 'Apunte no encontrado');
        }

        return handleSuccess(res, 200, 'Apunte obtenido exitosamente', apunte);
    } catch (error) {
        console.error('Error al obtener apunte:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Descargar archivo de un apunte
 */
export async function downloadApunteFileController(req, res) {
    try {
        const { id } = req.params;
        
        // Buscar el apunte
        const apunte = await Apunte.findById(id);
        if (!apunte) {
            return handleError(res, 404, 'Apunte no encontrado');
        }

        // Verificar que el apunte tiene archivo
        if (!apunte.archivo || !apunte.archivo.rutaCompleta) {
            return handleError(res, 404, 'El apunte no tiene archivo asociado');
        }

        // Descargar archivo de MinIO usando el servicio
        const [fileData, fileError] = await downloadFromMinIOService(apunte.archivo.rutaCompleta);
        if (fileError) {
            return handleError(res, 404, fileError);
        }

        // Configurar headers para la descarga
        res.setHeader('Content-Type', fileData.metadata.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileData.metadata.originalName}"`);
        res.setHeader('Content-Length', fileData.metadata.size);

        // Enviar el stream del archivo
        fileData.stream.pipe(res);
        
        // Incrementar contador de visualizaciones
        await Apunte.findByIdAndUpdate(id, { 
            $inc: { visualizaciones: 1 } 
        });

    } catch (error) {
        console.error('Error al descargar archivo:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Obtener URL firmada para descarga directa
 */
export async function getApunteDownloadUrlController(req, res) {
    try {
        const { id } = req.params;
        
        // Buscar el apunte
        const apunte = await Apunte.findById(id);
        if (!apunte) {
            return handleError(res, 404, 'Apunte no encontrado');
        }

        // Verificar que el apunte tiene archivo
        if (!apunte.archivo || !apunte.archivo.rutaCompleta) {
            return handleError(res, 404, 'El apunte no tiene archivo asociado');
        }

        // Generar URL firmada usando el servicio
        const [signedUrl, urlError] = await getSignedUrlFromMinIOService(apunte.archivo.rutaCompleta);
        if (urlError) {
            return handleError(res, 404, urlError);
        }

        return handleSuccess(res, 200, 'URL de descarga generada', {
            downloadUrl: signedUrl,
            expiresIn: '1 hora',
            fileName: apunte.archivo.nombreOriginal
        });
    } catch (error) {
        console.error('Error al generar URL de descarga:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Actualizar un apunte (sin cambiar el archivo)
 */
export async function updateApunteController(req, res) {
    try {
        const { id } = req.params;
        
        // Buscar el apunte
        const apunte = await Apunte.findById(id);
        if (!apunte) {
            return handleError(res, 404, 'Apunte no encontrado');
        }

        // Actualizar solo los campos permitidos (no el archivo)
        const { nombre, descripcion, asignatura, tipoApunte } = req.body;
        
        const apunteActualizado = await Apunte.findByIdAndUpdate(
            id,
            { nombre, descripcion, asignatura, tipoApunte },
            { new: true }
        );

        return handleSuccess(res, 200, 'Apunte actualizado exitosamente', apunteActualizado);
    } catch (error) {
        console.error('Error al actualizar apunte:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Eliminar un apunte y su archivo
 */
export async function deleteApunteController(req, res) {
    try {
        const { id } = req.params;
        
        // Buscar el apunte
        const apunte = await Apunte.findById(id);
        if (!apunte) {
            return handleError(res, 404, 'Apunte no encontrado');
        }

        // Eliminar archivo de MinIO si existe usando el servicio
        if (apunte.archivo && apunte.archivo.rutaCompleta) {
            const [, fileError] = await deleteFromMinIOService(apunte.archivo.rutaCompleta);
            if (fileError) {
                console.warn('Advertencia: No se pudo eliminar el archivo de MinIO:', fileError);
                // Continúa con la eliminación del registro aunque falle la eliminación del archivo
            }
        }

        // Eliminar el apunte de la base de datos
        await Apunte.findByIdAndDelete(id);

        return handleSuccess(res, 200, 'Apunte eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar apunte:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Buscar apuntes por asignatura
 */
export async function getApuntesByAsignaturaController(req, res) {
    try {
        const { asignatura } = req.params;
        
        const apuntes = await Apunte.find({ 
            asignatura: new RegExp(asignatura, 'i') // Búsqueda case-insensitive
        });

        return handleSuccess(res, 200, 'Apuntes encontrados', apuntes);
    } catch (error) {
        console.error('Error al buscar apuntes por asignatura:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Buscar apuntes por tipo
 */
export async function getApuntesByTipoController(req, res) {
    try {
        const { tipo } = req.params;
        
        const apuntes = await Apunte.find({ tipoApunte: tipo });

        return handleSuccess(res, 200, 'Apuntes encontrados', apuntes);
    } catch (error) {
        console.error('Error al buscar apuntes por tipo:', error);
        return handleError(res, 500, 'Error interno del servidor');
    }
}