import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createAsignatura,
    getAsignatura,
    getAllAsignaturas,
    getUnidadesAsignatura,
    updateAsignatura,
    deleteAsignatura
} from "../controllers/asignatura.controller.js";   
    
const router = Router();

router.use(authenticateJWT);

router
    .post("/", authorizeRoles("admin", "docente"), createAsignatura)
    .get("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), getAsignatura)
    .get("/", authorizeRoles("admin", "docente", "ayudante", "estudiante"), getAllAsignaturas)
    .get("/unidades/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), getUnidadesAsignatura)
    .put("/detail", authorizeRoles("admin", "docente"), updateAsignatura)
    .delete("/detail", authorizeRoles("admin", "docente"), deleteAsignatura);

export default router;
