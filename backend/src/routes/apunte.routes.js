import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { uploadSingle } from '../middlewares/archivo.middleware.js';
import { handleMulterError } from '../handlers/responseHandlers.js';
import { validateContent } from '../middlewares/contentFilter.middleware.js';
import {
    createApunte
} from '../controllers/apunte.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .post('/',
        authorizeRoles('admin', 'docente', 'estudiante', 'ayudante'),
        uploadSingle, 
        validateContent(['nombre', 'descripcion', 'autores', 'etiquetas', 'autorSubida']),
        createApunte
    );

router.use(handleMulterError);

export default router;