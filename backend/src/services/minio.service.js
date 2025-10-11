import { validateFileMiddleware } from '../middlewares/archivo.middleware.js';
import { minioClient, BUCKETS } from '../config/configMinio.js';
import { fechaActual, generarNombreArchivoForMinIO } from '../helpers/ayudasVarias.helper.js';

export async function uploadToMinIOService(filePath, buffer, size, metadata = {}) {
    try {
        await minioClient.putObject(
            BUCKETS.APUNTES,
            filePath,
            buffer,
            size,
            metadata
        );

        return [true, null];
    } catch (error) {
        console.error('Error subiendo archivo a MinIO:', error);
        return [null, 'Error interno al subir el archivo'];
    }
}

export async function downloadFromMinIOService(filePath) {
    try {
        // Verificar que el archivo existe
        const stats = await minioClient.statObject(BUCKETS.APUNTES, filePath);

        if (!stats) {
            return [null, 'Archivo no encontrado'];
        }

        // Obtener el stream del archivo
        const fileStream = await minioClient.getObject(BUCKETS.APUNTES, filePath);

        // Obtener metadatos
        const metadata = {
            size: stats.size,
            contentType: stats.metaData['content-type'] || 'application/octet-stream',
            lastModified: stats.lastModified,
            originalName: stats.metaData['x-original-name'] || path.basename(filePath)
        };

        return [{ stream: fileStream, metadata }, null];
    } catch (error) {
        console.error('Error descargando archivo de MinIO:', error);

        if (error.code === 'NoSuchKey') {
            return [null, 'Archivo no encontrado'];
        }

        return [null, 'Error interno al descargar el archivo'];
    }
}

export async function deleteFromMinIOService(filePath) {
    try {
        // Verificar que el archivo existe antes de eliminarlo
        await minioClient.statObject(BUCKETS.APUNTES, filePath);

        // Eliminar el archivo
        await minioClient.removeObject(BUCKETS.APUNTES, filePath);

        return [true, null];
    } catch (error) {
        console.error('Error eliminando archivo de MinIO:', error);

        if (error.code === 'NoSuchKey') {
            return [null, 'Archivo no encontrado'];
        }

        return [null, 'Error interno al eliminar el archivo'];
    }
}

export async function generarUrlFirmadaService(filePath, expiresIn = 7200) {
    try {
        // Verificar que el archivo existe y obtener metadatos
        const stats = await minioClient.statObject(BUCKETS.APUNTES, filePath);

        // Generar URL firmada con tiempo extendido para previsualización
        const signedUrl = await minioClient.presignedGetObject(
            BUCKETS.APUNTES,
            filePath,
            expiresIn  // 2 horas por defecto para dar tiempo a previsualizar y descargar
        );

        // Retornar URL y metadatos útiles para el frontend
        const fileInfo = {
            url: signedUrl,
            metadata: {
                size: stats.size,
                contentType: stats.metaData['content-type'] || 'application/octet-stream',
                originalName: stats.metaData['x-original-name'] || path.basename(filePath),
                lastModified: stats.lastModified,
                expiresAt: new Date(Date.now() + (expiresIn * 1000)).toISOString()
            }
        };

        return [fileInfo, null];
    } catch (error) {
        console.error('Error generando URL de previsualización:', error);

        if (error.code === 'NoSuchKey') {
            return [null, 'Archivo no encontrado'];
        }

        return [null, 'Error interno al generar URL de previsualización'];
    }
}

export async function fileExistsInMinIOService(filePath) {
    try {
        await minioClient.statObject(BUCKETS.APUNTES, filePath);
        return [true, null];
    } catch (error) {
        if (error.code === 'NoSuchKey') {
            return [false, null];
        }

        console.error('Error verificando existencia del archivo:', error);
        return [null, 'Error interno al verificar el archivo'];
    }
}

function processFileForUploadHandler(file) {
    try {
        // Generar nombres únicos
        const uniqueFileName = generateUniqueFileName(file.originalname);
        const filePath = generateFilePath(uniqueFileName);

        // Preparar metadatos
        const metadata = {
            'Content-Type': file.mimetype,
            'X-Original-Name': file.originalname,
            'X-Upload-Date': new Date().toISOString()
        };

        // Preparar información del archivo para la BD
        const fileInfo = {
            nombreOriginal: file.originalname,
            nombreMinIO: uniqueFileName,
            rutaCompleta: filePath,
            tipoArchivo: file.mimetype,
            tamaño: file.size,
            bucket: BUCKETS.APUNTES
        };

        // Preparar datos para MinIO
        const minioData = {
            filePath,
            buffer: file.buffer,
            size: file.size,
            metadata
        };

        return [{ fileInfo, minioData }, null];
    } catch (error) {
        console.error('Error procesando archivo:', error);
        return [null, 'Error interno al procesar el archivo'];
    }
}

export async function subirArchivoToMinioService(filePath, buffer, size, metadata = {}) { }
