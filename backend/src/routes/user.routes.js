import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createUser,
    getUserByRut,
    getAllUsers,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .post("/", createUser)
    .get("/detail", authorizeRoles("admin", "docente"), getUserByRut)
    .get("/", authorizeRoles("admin"), getAllUsers)
    .patch("/detail", authorizeRoles("admin"), updateUser)
    .delete("/detail", authorizeRoles("admin"), deleteUser);

export default router;

/*
TODO
- Pensar en como los usuarios podrán buscar (qué parámetros utilizará en la búsqueda) a otros usuarios
- Pensar en cómo administrar permisos de autorización correctamente
*/