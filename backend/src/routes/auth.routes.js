import { Router } from 'express';
import { registerUser, loginUser, getProfile, verifyEmail, enviarVerificacionEmail } from '../controllers/auth.controller.js';
import { validateContent } from '../middlewares/contentFilter.middleware.js';

const router = Router();

router
    .post('/register', validateContent(['nombreCompleto', 'email']), registerUser)
    .post('/login', loginUser)
    .get('/profile', getProfile)
    .get('/verify-email/:token', verifyEmail)
    .post('/resend-verification', enviarVerificacionEmail)
    .post('/logout', (req, res) => { res.clearCookie('token').json({ message: 'Sesión cerrada' }) });

export default router;