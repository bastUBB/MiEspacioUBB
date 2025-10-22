import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { uploadSingle } from '../middlewares/archivo.middleware.js';
import { handleMulterErrors } from '../handlers/responseHandlers.js';
import {
    createApunte
} from '../controllers/apunte.controller.js';

const router = Router();

router.use(authenticateJWT);

router
    .post('/apuntes', uploadSingle, handleMulterErrors, createApunte);

export default router;