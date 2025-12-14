import { Router } from 'express';
import {
    obtenerTotalApuntesActivos,
    obtenerTotalUsuarios,
    obtenerUsuariosActivos,
    obtenerDescargasTotales,
    obtenerDistribucionTipos,
    obtenerTop5Asignaturas,
    obtenerAsignaturasMejorValoradas,
    obtenerApuntesPopularesSemana,
    obtenerTopContribuidoresSemana,
    obtenerValoracionPromedioSistema,
    obtenerContenidoPorSemestre,
    obtenerDescargas,
    obtenerApuntesMasComentados,
    obtenerCrecimientoMensual,
    obtenerApunteMasDescargado,
    obtenerDiaMasSemanaActivo,
    obtenerAsignaturasSinApuntes,
    obtenerReportesPendientes,
    obtenerUltimosReportes
} from '../controllers/estadisticas.controller.js';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);

router
    .get('/total-apuntes', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerTotalApuntesActivos)
    .get('/total-usuarios', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerTotalUsuarios)
    .get('/usuarios-activos', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerUsuariosActivos)
    .get('/descargas-totales', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerDescargasTotales)
    .get('/distribucion-tipos', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerDistribucionTipos)
    .get('/top-asignaturas', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerTop5Asignaturas)
    .get('/asignaturas-mejor-valoradas', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerAsignaturasMejorValoradas)
    .get('/contenido-por-semestre', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerContenidoPorSemestre)
    .get('/apuntes-populares-semana', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerApuntesPopularesSemana)
    .get('/top-contribuidores-semana', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerTopContribuidoresSemana)
    .get('/descargas-semana', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerDescargas)
    .get('/dia-mas-activo-semana', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerDiaMasSemanaActivo)
    .get('/valoracion-promedio', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerValoracionPromedioSistema)
    .get('/apuntes-mas-comentados', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerApuntesMasComentados)
    .get('/crecimiento-mensual', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerCrecimientoMensual)
    .get('/apunte-mas-descargado', authorizeRoles("admin", "estudiante", "docente", "ayudante"), obtenerApunteMasDescargado)
    .get('/asignaturas-sin-apuntes', authorizeRoles("admin"), obtenerAsignaturasSinApuntes)
    .get('/reportes-pendientes', authorizeRoles("admin"), obtenerReportesPendientes)
    .get('/ultimos-reportes', authorizeRoles("admin"), obtenerUltimosReportes);

export default router;
