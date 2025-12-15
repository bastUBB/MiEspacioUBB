import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    crearEncuesta,
    actualizarEncuesta,
    eliminarEncuesta,
    obtenerTodasEncuestasActivas,
    obtenerTodasEncuestas,
    obtenerEncuestaPorId,
    obtenerMisEncuestas,
    obtenerEncuestasPorRut
} from "../controllers/encuesta.controller.js";

const router = Router();

router.use(authenticateJWT);

router
    .post("/", authorizeRoles("admin", "docente", "ayudante", "estudiante"), crearEncuesta)
    .get("/encuestas-activas", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerTodasEncuestasActivas)
    .get("/all-encuestas", authorizeRoles("admin"), obtenerTodasEncuestas)
    .get("/detail", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerEncuestaPorId)
    .get("/mis-encuestas", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerMisEncuestas)
    .get("/por-rut", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerEncuestasPorRut)
    .put("/detail", authorizeRoles("admin"), actualizarEncuesta)
    .delete("/detail", authorizeRoles("admin"), eliminarEncuesta)

export default router;

