import { 
    uploadFileService, 
    downloadFileService, 
    deleteFileService, 
    getSignedUrlService 
} from '../services/file.service.js';
import Apunte from '../models/apunte.model.js';
import { apunteCreateValidation } from '../validations/apunte.validation.js';
import { handleSuccess, handleErrorClient, handleErrorServer } from '../handlers/responseHandlers.js';
//TODO: Aqui deberia de llamar al controlador de MinIO y middleware de validacion de archivos

export async function createApunteController(req, res) {
    try {
        const { value: valueCreate, error: errorCreate } = apunteCreateValidation.validate(req.body);

        if (errorCreate) return handleErrorClient(res, 400, "Error de validacion", errorCreate.message);

        // const { archivo: archivoUploaded , error: errorArchivo } = 

        if (!req.file) return handleError(res, 400, 'Es necesario subir un archivo para el apunte');
        

        // Subir archivo a MinIO
        const [fileInfo, fileError] = await uploadFileService(req.file);
        if (fileError) {
            return handleError(res, 400, fileError);
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

        // Descargar archivo de MinIO
        const [fileData, fileError] = await downloadFileService(apunte.archivo.rutaCompleta);
        if (fileError) {
            return handleError(res, 404, fileError);
        }

        // Configurar headers para la descarga
        res.setHeader('Content-Type', fileData.metadata.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileData.metadata.originalName}"`);
        res.setHeader('Content-Length', fileData.metadata.size);

        // Enviar el stream del archivo
        fileData.stream.pipe(res);
        
        // Opcional: Incrementar contador de visualizaciones
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

        // Generar URL firmada
        const [signedUrl, urlError] = await getSignedUrlService(apunte.archivo.rutaCompleta);
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

        // Eliminar archivo de MinIO si existe
        if (apunte.archivo && apunte.archivo.rutaCompleta) {
            const [, fileError] = await deleteFileService(apunte.archivo.rutaCompleta);
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