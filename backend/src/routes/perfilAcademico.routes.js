import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createPerfilAcademicoEstudiante,
    createPerfilAcademicoDocente,
    createPerfilAcademicoAyudante,
    getPerfilAcademico,
    updatePerfilAcademico,
    deletePerfilAcademico,
    poseePerfilAcademico,
    numeroApuntesUser,
    busquedaApuntesMismoAutor,
    busquedaApuntesMismaAsignatura,
    obtenerValoracionPromedioApuntes,
    obtenerNumeroDescargasApuntes,
    obtenerMayoresContribuidores
} from '../controllers/perfilAcademico.controller.js';

const router = Router();

router.use(authenticateJWT);

//TODO: Asegurarme que solo se puedan efectuar peticiones a sus propios perfiles

router
    .post("/", authorizeRoles("estudiante", "admin"), createPerfilAcademicoEstudiante)
    .post("/docente", authorizeRoles("docente", "admin"), createPerfilAcademicoDocente)
    .post("/ayudante", authorizeRoles("ayudante", "admin"), createPerfilAcademicoAyudante)
    .get("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), getPerfilAcademico)
    .get("/poseePFA", authorizeRoles("admin", "docente", "ayudante", "estudiante"), poseePerfilAcademico)
    .get("/numero-apuntes/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), numeroApuntesUser)
    .get("/valoracion-promedio/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerValoracionPromedioApuntes)
    .get("/numero-descargas/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerNumeroDescargasApuntes)
    .get("/mayores-contribuidores", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerMayoresContribuidores)
    .post("/busquedaMismoAutor", authorizeRoles("admin", "docente", "ayudante", "estudiante"), busquedaApuntesMismoAutor)
    .post("/busquedaMismaAsignatura", authorizeRoles("admin", "docente", "ayudante", "estudiante"), busquedaApuntesMismaAsignatura)
    .patch("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), updatePerfilAcademico)
    .delete("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), deletePerfilAcademico);

export default router;
