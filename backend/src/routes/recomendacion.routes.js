import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    obtenerRecomendacionesPersonalizadas,
    obtenerRecomendacionesGenericas,
    obtenerRecomendacionesPorAsignatura
} from '../controllers/recomendacion.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .get('/genericas', obtenerRecomendacionesGenericas)
    .get('/personalizadas', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerRecomendacionesPersonalizadas)
    .get('/por-asignatura', authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'), obtenerRecomendacionesPorAsignatura);

export default router;
