import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    crearEncuesta,
    obtenerTodasEncuestasActivas,
    obtenerTodasEncuestas,
    obtenerEncuesta,
    actualizarEncuesta,
    eliminarEncuesta,
    obtenerCantidadEncuestas
} from "../controllers/encuesta.controller.js";

const router = Router();

router.use(authenticateJWT);

router
    .post("/", authorizeRoles("admin"), crearEncuesta)
    .get("/activas", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerTodasEncuestasActivas)
    .get("/todas", authorizeRoles("admin"), obtenerTodasEncuestas)
    .get("/cantidad", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerCantidadEncuestas)
    .get("/:_id", authorizeRoles("admin", "docente", "ayudante", "estudiante"), obtenerEncuesta)
    .put("/:_id", authorizeRoles("admin"), actualizarEncuesta)
    .delete("/:_id", authorizeRoles("admin"), eliminarEncuesta);

export default router;
