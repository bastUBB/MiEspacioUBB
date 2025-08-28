import { Router } from 'express';
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js"
import asignaturaRoutes from "./asignatura.routes.js"
import perfilAcademicoRoutes from "./perfilAcademico.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/users", userRoutes)
    .use("/asignaturas", asignaturaRoutes)
    .use("/perfilAcademico", perfilAcademicoRoutes);

export default router;