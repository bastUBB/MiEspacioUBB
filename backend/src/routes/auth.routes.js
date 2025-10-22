import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
    .post('/register', registerUser)
    .post('/login', loginUser)
    .get('/profile', getProfile)
    .post('/logout', (req, res) => { res.clearCookie('token').json({ message: 'Sesión cerrada' }) });

export default router;