import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createPerfilAcademico,
    getPerfilAcademico,
    updatePerfilAcademico,
    deletePerfilAcademico,
    poseePerfilAcademico,
    numeroApuntesUser, 
    busquedaApuntesMismoAutor,
    busquedaApuntesMismaAsignatura,
    obtenerValoracionPerfilAcademico,
    obtenerNumeroDescargasApuntes,
    obtenerMayoresContribuidores
} from '../controllers/perfilAcademico.controller.js';

const router = Router();

router.use(authenticateJWT);

//TODO: Asegurarme que solo se puedan efectuar peticiones a sus propios perfiles

router
    .post("/", authorizeRoles("admin", "docente", "ayudante", "estudiante"), createPerfilAcademico)
    .get("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), getPerfilAcademico)
    .get("/poseePFA", authorizeRoles("admin", "docente", "ayudante", "estudiante"), poseePerfilAcademico)
    .get("/numero-apuntes/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), numeroApuntesUser)
    .get("/valoracion/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerValoracionPerfilAcademico)
    .get("/numero-descargas/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerNumeroDescargasApuntes)
    .get("/mayores-contribuidores", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerMayoresContribuidores)
    .post("/busquedaMismoAutor", authorizeRoles("admin", "docente", "ayudante", "estudiante"), busquedaApuntesMismoAutor)
    .post("/busquedaMismaAsignatura", authorizeRoles("admin", "docente", "ayudante", "estudiante"), busquedaApuntesMismaAsignatura)
    .patch("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), updatePerfilAcademico)
    .delete("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), deletePerfilAcademico);

export default router;
