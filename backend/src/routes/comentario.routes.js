import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { likeComentario, dislikeComentario } from "../controllers/comentario.controller.js";

const router = Router();

router.use(authenticateJWT);

router
    .post("/like/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), likeComentario)
    .post("/dislike/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), dislikeComentario);

export default router;