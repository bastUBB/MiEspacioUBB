import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    obtenerRecomendacionesPersonalizadas,
    obtenerRecomendacionesGenericas,
    obtenerRecomendacionesPorAsignatura
} from '../controllers/recomendacion.controller.js';

const router = Router();

// Ruta pública para recomendaciones genéricas (sin autenticación)
router.get('/genericas', obtenerRecomendacionesGenericas);

// Rutas protegidas que requieren autenticación
router.use(authenticateJWT);

router
    .get('/personalizadas',
        authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'),
        obtenerRecomendacionesPersonalizadas)
    .get('/por-asignatura',
        authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'),
        obtenerRecomendacionesPorAsignatura);

export default router;
