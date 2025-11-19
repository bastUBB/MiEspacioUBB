import { Router } from 'express';
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js"
import asignaturaRoutes from "./asignatura.routes.js"
import perfilAcademicoRoutes from "./perfilAcademico.routes.js"
import apunteRoutes from "./apunte.routes.js"
import reporteRoutes from "./reporte.routes.js"
import comentarioRoutes from "./comentario.routes.js"
import notificacionRoutes from "./notificacion.routes.js"
import recomendacionRoutes from "./recomendacion.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/users", userRoutes)
    .use("/asignaturas", asignaturaRoutes)
    .use("/perfilAcademico", perfilAcademicoRoutes)
    .use("/apuntes", apunteRoutes)
    .use("/reportes", reporteRoutes)
    .use("/comentarios", comentarioRoutes)
    .use("/notificaciones", notificacionRoutes)
    .use("/recomendaciones", recomendacionRoutes);
    
export default router;