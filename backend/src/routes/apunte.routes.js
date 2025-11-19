import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { uploadSingle } from '../middlewares/archivo.middleware.js';
import { handleMulterError } from '../handlers/responseHandlers.js';
import { validateContent } from '../middlewares/contentFilter.middleware.js';
import {
    createApunte,
    updateApunte,
    deleteApunte,
    obtenerMisApuntesByRut,
    getAllApuntes,
    sumarVisualizacionInvitadoApunte,
    sumarVisualizacionUsuariosApunte,
    crearComentarioApunte,
    crearRespuestaComentarioApunte,
    realizarValoracionApunte,
    crearReporteApunte,
    obtenerApuntesMasValorados,
    obtenerApuntesMasVisualizados,
    obtenerAsignaturasConMasApuntes
} from '../controllers/apunte.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .post('/',
        authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'),
        uploadSingle,
        validateContent(['nombre', 'descripcion', 'autores', 'etiquetas', 'autorSubida']),
        createApunte)
    .put('/detail',
        validateContent(['nombre', 'descripcion', 'autores', 'etiquetas']),
        authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'),
        updateApunte)
    .delete('/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), deleteApunte)
    .get('/apuntes-rut/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerMisApuntesByRut)
    .get('/', authorizeRoles('admin'), getAllApuntes)
    .get('/mas-valorados/', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerApuntesMasValorados)
    .get('/mas-visualizados/', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerApuntesMasVisualizados)
    .get('/asignaturas-mas-apuntes/', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerAsignaturasConMasApuntes)
    .post('/visualizacion-invitado/detail', sumarVisualizacionInvitadoApunte)
    .post('/visualizacion-usuario/detail', authenticateJWT, sumarVisualizacionUsuariosApunte)
    .post('/crear-comentario/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), crearComentarioApunte)
    .post('/respuesta-comentario/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), crearRespuestaComentarioApunte)
    .post('/valoracion/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), realizarValoracionApunte)
    .post('/reporte/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), crearReporteApunte);
    
router.use(handleMulterError);

export default router;