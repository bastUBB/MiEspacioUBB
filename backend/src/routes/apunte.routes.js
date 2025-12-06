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
    getApunteById,
    realizarValoracionApunte,
    actualizarValoracionApunte,
    crearReporteApunte,
    obtenerApuntesMasValorados,
    obtenerApuntesMasVisualizados,
    obtenerAsignaturasConMasApuntes,
    obtenerCantidadApuntes,
    busquedaApuntesMismoAutor,
    busquedaApuntesMismaAsignatura,
    obtenerValoracionApunte,
    obtenerLinkDescargaApunte,
    registrarDescargaApunte,
    obtenerMejorApunteUser,
    obtenerApuntesRandom
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
    .get('/apuntes-aleatorios', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerApuntesRandom)
    .get('/mejor-apunte-user', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerMejorApunteUser)
    .get('/valoracion/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerValoracionApunte)
    .get('/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), getApunteById)
    .get('/cantidad-apuntes/', authorizeRoles('admin'), obtenerCantidadApuntes)
    .get('/url-descarga/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerLinkDescargaApunte)
    .get('/mas-valorados/', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerApuntesMasValorados)
    .get('/mas-visualizados/', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerApuntesMasVisualizados)
    .get('/asignaturas-mas-apuntes/', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerAsignaturasConMasApuntes)
    .post('/busqueda-mismo-autor', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), busquedaApuntesMismoAutor)
    .post('/busqueda-misma-asignatura', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), busquedaApuntesMismaAsignatura)
    .post('/visualizacion-invitado/detail', sumarVisualizacionInvitadoApunte)
    .post('/visualizacion-usuario/detail', authenticateJWT, sumarVisualizacionUsuariosApunte)
    .post('/descarga/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), registrarDescargaApunte)
    .post('/crear-comentario/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), crearComentarioApunte)
    .post('/respuesta-comentario/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), crearRespuestaComentarioApunte)
    .post('/valoracion/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), realizarValoracionApunte)
    .put('/valoracion/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), actualizarValoracionApunte)
    .post('/reporte/detail', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), crearReporteApunte);

router.use(handleMulterError);

export default router;