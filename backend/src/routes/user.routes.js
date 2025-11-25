import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createUser,
    getUserByRut,
    getAllUsers,
    updateUser,
    deleteUser,
    obtenerAñoIngresoAplicacion,
    obtenerCantidadUsuarios,
} from '../controllers/user.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .post("/", createUser)
    .get("/detail", authorizeRoles("admin", "docente"), getUserByRut)
    .get("/", authorizeRoles("admin"), getAllUsers)
    .patch("/detail", authorizeRoles("admin", "docente", "estudiante", "ayudante"), updateUser)
    .delete("/detail", authorizeRoles("admin"), deleteUser)
    .get("/year-entry", authorizeRoles("admin", "docente", "estudiante", "ayudante"), obtenerAñoIngresoAplicacion)
    .get("/cantidad-usuarios", authorizeRoles("admin"), obtenerCantidadUsuarios);

export default router;