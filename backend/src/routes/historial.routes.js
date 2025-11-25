import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getHistorialUsuario } from '../controllers/historial.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .get("/detail", authorizeRoles("admin"), getHistorialUsuario);

export default router;
