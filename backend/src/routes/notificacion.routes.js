import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    obtenerTodasMisNotificaciones,
    actualizarEstadoLeido,
    borrarNotificacionesLeidas
} from '../controllers/notificacion.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .get("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerTodasMisNotificaciones)
    .patch("/act-estado/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), actualizarEstadoLeido)
    .delete("/borrar-leidas/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), borrarNotificacionesLeidas);

export default router;