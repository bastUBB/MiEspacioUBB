import { 
    handleFileNotProvided, 
    handleInvalidFileType, 
    handleFileTooLarge, 
    handleTooManyFiles 
} from '../handlers/responseHandlers.js';
import { FILE_CONFIG } from '../config/configMinio.js';

function validateFileType(mimetype) {
    return FILE_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(mimetype);
}

function validateFileSize(size) {
    return size <= FILE_CONFIG.MAX_FILE_SIZE;
}

export const validateFileMiddleware = (req, res, next) => {
    // 1. Validar que existe el archivo
    if (!req.file) return handleFileNotProvided(res);
    
    // 2. Validar tipo de archivo
    if (!validateFileType(req.file.mimetype)) return handleInvalidFileType(res);

    // 3. Validar tamaño del archivo
    if (!validateFileSize(req.file.size)) {
        const maxSizeMB = FILE_CONFIG.MAX_FILE_SIZE / (1024 * 1024);
        return handleFileTooLarge(res, maxSizeMB);
    }

    // 4. Validar cantidad (solo un archivo por request)
    if (req.files && Array.isArray(req.files) && req.files.length > 1) return handleTooManyFiles(res);
    
    // next();
};

export default validateFileMiddleware;

