import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createPerfilAcademico,
    getPerfilAcademico,
    updatePerfilAcademico,
    deletePerfilAcademico,
    poseePerfilAcademico
} from '../controllers/perfilAcademico.controller.js';

const router = Router();

router.use(authenticateJWT);

//TODO: Asegurarme que solo se puedan efectuar peticiones a sus propios perfiles

router
    .post("/", authorizeRoles("admin", "docente", "ayudante", "estudiante"), createPerfilAcademico)
    .get("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), getPerfilAcademico)
    .get("/poseePFA", authorizeRoles("admin", "docente", "ayudante", "estudiante"), poseePerfilAcademico)
    .patch("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), updatePerfilAcademico)
    .delete("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), deletePerfilAcademico);

export default router;
