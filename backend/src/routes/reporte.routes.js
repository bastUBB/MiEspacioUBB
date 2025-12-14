import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createReporteUser,
    obtenerMisReportes,
    getAllReportesPendientesPorFecha,
    actualizarEstadoReporte,
    obtenerCantidadReportesPendientes,
    obtenerReportes
} from "../controllers/reporte.controller.js";

const router = Router();

router.use(authenticateJWT);

router
    .post("/user", authorizeRoles("admin", "docente", "ayudante", "estudiante"), createReporteUser)
    .get("/mis-reportes/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerMisReportes)
    .get("/pendientes", authorizeRoles("admin"), getAllReportesPendientesPorFecha)
    .get("/all-reportes", authorizeRoles("admin"), obtenerReportes)
    .get("/cantidad-pendientes", authorizeRoles("admin"), obtenerCantidadReportesPendientes)
    .put("/actualizarEstado/detail", authorizeRoles("admin"), actualizarEstadoReporte);

export default router;