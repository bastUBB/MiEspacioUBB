import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FILE_CONFIG, BUCKETS } from '../config/configMinio.js';

function validateFileType(mimetype) {
    return FILE_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(mimetype);
}

function validateFileSize(size) {
    return size <= FILE_CONFIG.MAX_FILE_SIZE;
}

function generateUniqueFileName(originalName) {
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const timestamp = Date.now();
    
    // Formatear la fecha a DD-MM-AAAA/HH:MM
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

function generateFilePath(fileName) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    return `apuntes/${year}/${month}/${fileName}`;
}

/**
 * Validar archivo completo (tipo y tamaño)
 * @param {object} file - Objeto file de multer
 */
export function validateFileHandler(file) {
    if (!file) {
        return [null, 'No se ha proporcionado ningún archivo'];
    }

    // Validar tipo de archivo
    if (!validateFileType(file.mimetype)) {
        return [null, 'Tipo de archivo no permitido. Solo se permiten PDF, DOCX y TXT'];
    }

    // Validar tamaño de archivo
    if (!validateFileSize(file.size)) {
        return [null, `Archivo demasiado grande. Máximo permitido: ${FILE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`];
    }

    return [true, null];
}

/**
 * Procesar archivo para prepararlo para MinIO
 * @param {object} file - Objeto file de multer
 */
export function processFileForUploadHandler(file) {
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

/**
 * Validar y procesar archivo (función combinada)
 * @param {object} file - Objeto file de multer
 */
export function validateAndProcessFileHandler(file) {
    // Validar archivo
    const [isValid, validationError] = validateFileHandler(file);
    if (validationError) {
        return [null, validationError];
    }

    // Procesar archivo
    const [processedData, processError] = processFileForUploadHandler(file);
    if (processError) {
        return [null, processError];
    }

    return [processedData, null];
}

/**
 * Obtener información de extensión de archivo
 * @param {string} filename - Nombre del archivo
 */
export function getFileExtensionInfoHandler(filename) {
    const extension = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, extension);
    
    const extensionInfo = {
        extension,
        baseName,
        isAllowed: ['.pdf', '.docx', '.txt'].includes(extension)
    };
    
    return extensionInfo;
}

/**
 * Formatear información de archivo para respuesta
 * @param {object} fileInfo - Información del archivo
 */
export function formatFileResponseHandler(fileInfo) {
    return {
        id: fileInfo._id,
        nombreOriginal: fileInfo.nombreOriginal,
        tamaño: fileInfo.tamaño,
        tipoArchivo: fileInfo.tipoArchivo,
        fechaSubida: fileInfo.createdAt || new Date().toISOString(),
        esDescargar: true
    };
}