import { Router } from 'express';
import {
    createApunteController,
    getApuntesController,
    getApunteByIdController,
    downloadApunteFileController,
    getApunteDownloadUrlController,
    updateApunteController,
    deleteApunteController,
    getApuntesByAsignaturaController,
    getApuntesByTipoController
} from '../controllers/apunte.controller.new.js';
import { uploadSingle, handleMulterError } from '../middlewares/archivo.middleware.js';

//TODO: Refactorizar todo el código a lo estructurado anteriormente

const router = Router();

// Rutas para CRUD de apuntes
/**
 * @route POST /api/apuntes
 * @desc Crear un nuevo apunte con archivo
 * @access Público (ajustar según autenticación)
 */
router.post('/', 
    uploadSingle,
    handleMulterError,
    createApunteController
);

/**
 * @route GET /api/apuntes
 * @desc Obtener todos los apuntes
 * @access Público
 */
router.get('/', getApuntesController);

/**
 * @route GET /api/apuntes/:id
 * @desc Obtener un apunte específico por ID
 * @access Público
 */
router.get('/:id', getApunteByIdController);

/**
 * @route PUT /api/apuntes/:id
 * @desc Actualizar información de un apunte (sin cambiar archivo)
 * @access Público (ajustar según autenticación)
 */
router.put('/:id', updateApunteController);

/**
 * @route DELETE /api/apuntes/:id
 * @desc Eliminar un apunte y su archivo
 * @access Público (ajustar según autenticación)
 */
router.delete('/:id', deleteApunteController);

// Rutas para manejo de archivos
/**
 * @route GET /api/apuntes/:id/download
 * @desc Descargar el archivo de un apunte directamente
 * @access Público
 */
router.get('/:id/download', downloadApunteFileController);

/**
 * @route GET /api/apuntes/:id/download-url
 * @desc Obtener URL firmada para descarga directa del archivo
 * @access Público
 */
router.get('/:id/download-url', getApunteDownloadUrlController);

// Rutas para búsqueda y filtrado
/**
 * @route GET /api/apuntes/asignatura/:asignatura
 * @desc Buscar apuntes por asignatura
 * @access Público
 */
router.get('/asignatura/:asignatura', getApuntesByAsignaturaController);

/**
 * @route GET /api/apuntes/tipo/:tipo
 * @desc Buscar apuntes por tipo
 * @access Público
 */
router.get('/tipo/:tipo', getApuntesByTipoController);

export default router;