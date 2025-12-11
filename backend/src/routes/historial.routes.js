import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getHistorialUsuario, obtenerMiHistorial } from '../controllers/historial.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .get("/detail", authorizeRoles("admin"), getHistorialUsuario)
    .get("/mi-historial", authorizeRoles("admin", "docente", "estudiante", "ayudante"), obtenerMiHistorial);

export default router;
