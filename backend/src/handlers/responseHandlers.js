export function handleSuccess(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    status: "Success",
    message,
    data,
  });
}

export function handleErrorClient(res, statusCode, message, details = {}) {
  return res.status(statusCode).json({
    status: "Client error",
    message,
    details
  });
}

export function handleErrorServer(res, statusCode, message) {
  return res.status(statusCode).json({
    status: "Server error",
    message,
  });
}

export const handleMulterErrors = (err, req, res, next) => {
    if (err) {
        return handleMulterError(res, err);
    }
    next();
};

export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                const maxSizeMB = FILE_CONFIG.MAX_FILE_SIZE;
                return res.status(400).json({
                    status: "Client error",
                    message: `Archivo demasiado grande. Máximo permitido: ${maxSizeMB}MB`,
                    details: { 
                        code: "FILE_TOO_LARGE", 
                        maxSize: `${maxSizeMB}MB`,
                        receivedSize: err.field 
                    }
                });
            
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    status: "Client error",
                    message: `Demasiados archivos. Solo se permite ${FILE_CONFIG.MAX_FILE_REQUEST} archivo`,
                    details: { 
                        code: "TOO_MANY_FILES", 
                        maxFiles: FILE_CONFIG.MAX_FILE_REQUEST 
                    }
                });
            
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    status: "Client error",
                    message: "Campo de archivo inesperado",
                    details: { 
                        code: "UNEXPECTED_FILE", 
                        field: err.field,
                        expectedField: "archivo"
                    }
                });
            
            default:
                return res.status(400).json({
                    status: "Client error",
                    message: "Error procesando el archivo",
                    details: { code: "MULTER_ERROR", error: err.message }
                });
        }
    }
    
    if (err && err.message) {
        switch (err.message) {
            case 'INVALID_FIELD_NAME':
                return res.status(400).json({
                    status: "Client error",
                    message: "Campo de archivo incorrecto. Debe ser 'archivo'",
                    details: { code: "INVALID_FIELD_NAME", expectedField: "archivo" }
                });
            
            case 'EMPTY_FILENAME':
                return res.status(400).json({
                    status: "Client error",
                    message: "El nombre del archivo no puede estar vacío",
                    details: { code: "EMPTY_FILENAME" }
                });
            
            case 'FILENAME_TOO_LONG':
                return res.status(400).json({
                    status: "Client error",
                    message: "El nombre del archivo es demasiado largo (máximo 255 caracteres)",
                    details: { code: "FILENAME_TOO_LONG", maxLength: 255 }
                });
            
            case 'DANGEROUS_FILENAME':
                return res.status(400).json({
                    status: "Client error",
                    message: "El nombre del archivo contiene caracteres no permitidos",
                    details: { code: "DANGEROUS_FILENAME", forbiddenChars: ['<', '>', ':', '"', '/', '\\', '|', '?', '*'] }
                });
            
            case 'NON_ASCII_FILENAME':
                return res.status(400).json({
                    status: "Client error",
                    message: "El nombre del archivo debe contener solo caracteres ASCII",
                    details: { code: "NON_ASCII_FILENAME" }
                });
            
            case 'MULTIPLE_EXTENSIONS':
                return res.status(400).json({
                    status: "Client error",
                    message: "El archivo no puede tener múltiples extensiones",
                    details: { code: "MULTIPLE_EXTENSIONS" }
                });
            
            case 'FORBIDDEN_FILENAME':
                return res.status(400).json({
                    status: "Client error",
                    message: "El nombre del archivo contiene palabras prohibidas",
                    details: { code: "FORBIDDEN_FILENAME" }
                });
            
            case 'INVALID_FILE_EXTENSION':
                return res.status(400).json({
                    status: "Client error",
                    message: `Extensión no permitida. Solo se permiten: ${FILE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`,
                    details: { code: "INVALID_EXTENSION", allowedExtensions: FILE_CONFIG.ALLOWED_EXTENSIONS }
                });
            
            case 'INVALID_FILE_TYPE':
                return res.status(400).json({
                    status: "Client error",
                    message: "Tipo de archivo no permitido",
                    details: { code: "INVALID_FILE_TYPE", allowedTypes: FILE_CONFIG.ALLOWED_DOCUMENT_TYPES }
                });
            
            case 'MIME_EXTENSION_MISMATCH':
                return res.status(400).json({
                    status: "Client error",
                    message: "El tipo de archivo no coincide con su extensión. Archivo posiblemente corrupto",
                    details: { code: "MIME_EXTENSION_MISMATCH" }
                });
            
            default:
                break;
        }
    }
    
    return res.status(500).json({
        status: "Server error",
        message: "Error interno procesando el archivo"
    });
};
