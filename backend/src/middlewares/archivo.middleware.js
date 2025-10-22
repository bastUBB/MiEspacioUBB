import multer from 'multer';
import { FILE_CONFIG } from '../config/configMinio.js';

function validateFileType(mimetype) {
    return FILE_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(mimetype);
}

function validateFileExtension(filename) {
    const extension = '.' + filename.toLowerCase().split('.').pop();
    return FILE_CONFIG.ALLOWED_EXTENSIONS.includes(extension);
}

function validateMimeExtensionMatch(mimetype, filename) {
    const extension = '.' + filename.toLowerCase().split('.').pop();
    const expectedMime = FILE_CONFIG.EXTENSION_TO_MIME[extension];
    return expectedMime === mimetype;
}

const fileFilter = (req, file, cb) => {
    // 1. Validar que el fieldname sea correcto
    if (file.fieldname !== 'archivo') {
        console.log('[FILE-VALIDATION] Campo incorrecto:', file.fieldname);
        cb(new Error('INVALID_FIELD_NAME'), false);
        return;
    }

    // 2. Validar nombre del archivo
    if (!file.originalname || file.originalname.trim() === '') {
        console.log('[FILE-VALIDATION] Nombre de archivo vacío');
        cb(new Error('EMPTY_FILENAME'), false);
        return;
    }

    // 3. Validar longitud del nombre de archivo
    if (file.originalname.length > 255) {
        console.log('[FILE-VALIDATION] Nombre de archivo demasiado largo:', file.originalname.length);
        cb(new Error('FILENAME_TOO_LONG'), false);
        return;
    }

    // 4. Validar caracteres peligrosos en el nombre
    const dangerousChars = /[<>:"/\\|?*]/;
    if (dangerousChars.test(file.originalname)) {
        console.log('[FILE-VALIDATION] Caracteres peligrosos en nombre:', file.originalname);
        cb(new Error('DANGEROUS_FILENAME'), false);
        return;
    }

    // 5. Validar caracteres no ASCII (emojis, acentos especiales)
    const nonAsciiPattern = /[^\x00-\x7F]/;
    if (nonAsciiPattern.test(file.originalname)) {
        console.log('[FILE-VALIDATION] Caracteres no ASCII en nombre:', file.originalname);
        cb(new Error('NON_ASCII_FILENAME'), false);
        return;
    }

    // 6. Validar extensiones dobles (prevenir ataques)
    const parts = file.originalname.split('.');
    if (parts.length > 2) {
        console.log('[FILE-VALIDATION] Múltiples extensiones detectadas:', file.originalname);
        cb(new Error('MULTIPLE_EXTENSIONS'), false);
        return;
    }

    // 7. Validar palabras prohibidas en el nombre
    const forbiddenWords = ['script', 'exec', 'cmd', 'bash', 'powershell', 'virus', 'malware'];
    const filename = file.originalname.toLowerCase();
    if (forbiddenWords.some(word => filename.includes(word))) {
        console.log('[FILE-VALIDATION] Palabra prohibida en nombre:', file.originalname);
        cb(new Error('FORBIDDEN_FILENAME'), false);
        return;
    }

    // 8. Validar extensión del archivo
    if (!validateFileExtension(file.originalname)) {
        console.log('[FILE-VALIDATION] Extensión no permitida:', file.originalname);
        cb(new Error('INVALID_FILE_EXTENSION'), false);
        return;
    }

    // 9. Validar tipo MIME
    if (!validateFileType(file.mimetype)) {
        console.log('[FILE-VALIDATION] Tipo MIME no permitido:', file.mimetype);
        cb(new Error('INVALID_FILE_TYPE'), false);
        return;
    }

    // 10. Validación cruzada: verificar que MIME type y extensión coincidan
    if (!validateMimeExtensionMatch(file.mimetype, file.originalname)) {
        console.log('[FILE-VALIDATION] MIME type y extensión no coinciden:', {
            mimetype: file.mimetype,
            filename: file.originalname
        });
        cb(new Error('MIME_EXTENSION_MISMATCH'), false);
        return;
    }

    console.log('[FILE-VALIDATION] Archivo validado correctamente:', file.originalname);
    cb(null, true);
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: FILE_CONFIG.MAX_FILE_SIZE,
        files: FILE_CONFIG.MAX_FILE_REQUEST
    },
    fileFilter: fileFilter
});

export const uploadSingle = upload.single('archivo');