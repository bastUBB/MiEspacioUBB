import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { interaccionComentario, likeComentario, dislikeComentario } from "../controllers/comentario.controller.js";

const router = Router();

router.use(authenticateJWT);

router
    // Ruta unificada para interacciones (recomendada)
    .post("/interaccion/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), interaccionComentario)
    // Rutas legacy (mantener para compatibilidad)
    .post("/like/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), likeComentario)
    .post("/dislike/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), dislikeComentario);

export default router;