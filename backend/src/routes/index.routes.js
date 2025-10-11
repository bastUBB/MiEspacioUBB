import { Router } from 'express';
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js"
import asignaturaRoutes from "./asignatura.routes.js"
import perfilAcademicoRoutes from "./perfilAcademico.routes.js"
import apunteRoutes from "./apunte.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/users", userRoutes)
    .use("/asignaturas", asignaturaRoutes)
    .use("/perfilAcademico", perfilAcademicoRoutes)
    .use("/apuntes", apunteRoutes);

export default router;