import path from 'path';
import { minioClient, BUCKETS } from '../config/configMinio.js';

export async function uploadToMinIOService(bucketName, objectName, buffer, size, metadata = {}) {
    try {
        await minioClient.putObject(bucketName, objectName, buffer, size, metadata);
        return [true, null];
    } catch (error) {
        console.error('Error subiendo archivo a MinIO:', error);
        return [null, 'Error interno al subir el archivo'];
    }
}

export async function uploadFileService(bucketName, objectName, buffer, metadata = {}) {
    try {
        const [success, uploadError] = await uploadToMinIOService(
            bucketName,
            objectName,
            buffer,
            buffer.length,
            metadata
        );

        if (uploadError) return [null, uploadError];

        return [{
            bucket: bucketName,
            objectName: objectName,
            size: buffer.length,
            filePath: `${bucketName}/${objectName}`
        }, null];
    } catch (error) {
        console.error('Error subiendo archivo:', error);
        return [null, 'Error interno al subir archivo'];
    }
}

export async function generarUrlFirmadaService(filePath, expiresIn = 7200) {
    try {
        const stats = await minioClient.statObject(BUCKETS.APUNTES, filePath);

        const signedUrl = await minioClient.presignedGetObject(
            BUCKETS.APUNTES,
            filePath,
            expiresIn  // 2 horas por defecto para dar tiempo a previsualizar y descargar
        );

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