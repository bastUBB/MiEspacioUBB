import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createPerfilAcademico,
    getPerfilAcademicoByUser,
    updatePerfilAcademico,
    deletePerfilAcademico
} from '../controllers/perfilAcademico.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .post("/", authorizeRoles("admin", "docente", "ayudante", "estudiante"), createPerfilAcademico)
    .get("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), getPerfilAcademicoByUser)
    .patch("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), updatePerfilAcademico)
    .delete("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), deletePerfilAcademico);

export default router;
