import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { minioClient, BUCKETS, FILE_CONFIG } from '../config/configMinio.js';

//TODO: Voy a necesitar que el servicio maneje metadata adicional, como usuario que sube, asignatura, tipo de apunte, etc.

// Función para validar tipo y tamaño de archivo
function validateFile(file) {
    return FILE_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(file.mimetype) && file.size <= FILE_CONFIG.MAX_FILE_SIZE;
}

// Función para generar nombre único de archivo
function generateUniqueFileName(originalName) {
    const fileExtension = path.extname(originalName);

    const baseName = path.basename(originalName, fileExtension);

    const timestamp = Date.now();

    //formatear la fecha a DD-MM-AAAA/HH:MM
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(timestamp);

    const uuid = uuidv4().split('-')[0]; // Solo primeros 8 caracteres

    return `apunte_${formattedDate}_${uuid}_${baseName}${fileExtension}`;
}

// Función para generar ruta completa del archivo
function generateFilePath(fileName) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    return `apuntes/${year}/${month}/${fileName}`;
}

/**
 * Subir archivo a MinIO
 */
export async function uploadFileService(fileData) {
    try {
        const { buffer, originalname, mimetype, size } = fileData;

        // Validar archivo
        if (!validateFile(fileData)) {
            return [null, 'Tipo de archivo no permitido o tamaño excede el límite'];
        }

        // Generar nombres únicos
        const uniqueFileName = generateUniqueFileName(originalname);
        const filePath = generateFilePath(uniqueFileName);

        // Subir archivo a MinIO
        await minioClient.putObject(
            BUCKETS.APUNTES,
            filePath,
            buffer,
            size,
            {
                'Content-Type': mimetype,
                'X-Original-Name': originalname,
                'X-Upload-Date': new Date().toISOString()
            }
        );

        // Retornar información del archivo
        const fileInfo = {
            nombreOriginal: originalname,
            nombreMinIO: uniqueFileName,
            rutaCompleta: filePath,
            tipoArchivo: mimetype,
            tamaño: size,
            bucket: BUCKETS.APUNTES
        };

        return [fileInfo, null];
    } catch (error) {
        console.error('Error subiendo archivo a MinIO:', error);
        return [null, 'Error interno al subir el archivo'];
    }
}

/**
 * Descargar archivo de MinIO
 */
export async function downloadFileService(filePath) {
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

/**
 * Eliminar archivo de MinIO
 */
export async function deleteFileService(filePath) {
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

/**
 * Obtener URL firmada para descarga directa
 */
export async function getSignedUrlService(filePath, expiresIn = FILE_CONFIG.SIGNED_URL_EXPIRY) {
    try {
        // Verificar que el archivo existe
        await minioClient.statObject(BUCKETS.APUNTES, filePath);
        
        // Generar URL firmada
        const signedUrl = await minioClient.presignedGetObject(
            BUCKETS.APUNTES,
            filePath,
            expiresIn
        );
        
        return [signedUrl, null];
    } catch (error) {
        console.error('Error generando URL firmada:', error);
        
        if (error.code === 'NoSuchKey') {
            return [null, 'Archivo no encontrado'];
        }
        
        return [null, 'Error interno al generar URL de descarga'];
    }
}

/**
 * Listar archivos de un usuario o carpeta específica
 */
export async function listFilesService(prefix = 'apuntes/') {
    try {
        const files = [];
        
        const objectsStream = minioClient.listObjects(BUCKETS.APUNTES, prefix, true);
        
        for await (const obj of objectsStream) {
            files.push({
                name: obj.name,
                size: obj.size,
                lastModified: obj.lastModified,
                etag: obj.etag
            });
        }
        
        return [files, null];
    } catch (error) {
        console.error('Error listando archivos de MinIO:', error);
        return [null, 'Error interno al listar archivos'];
    }
}

/**
 * Verificar si un archivo existe
 */
export async function fileExistsService(filePath) {
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