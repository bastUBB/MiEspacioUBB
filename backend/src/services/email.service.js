import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD, FRONTEND_URL } from '../config/configEnv.js';

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER, 
            pass: EMAIL_PASSWORD
        }
    });
};

export async function enviarEmailVerificacionService(email, verificationToken) {
    try {
        const transporter = createTransporter();
        
        const verificationUrl = `${FRONTEND_URL}/verify-email/${verificationToken}`;

        const mailOptions = {
            from: `"MiEspacio UBB" <${EMAIL_USER}>`,
            to: email,
            subject: 'Verifica tu cuenta - MiEspacio UBB',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; }
                        .button { 
                            display: inline-block; 
                            padding: 12px 30px; 
                            background-color: #4F46E5; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>¡Bienvenido a MiEspacio UBB!</h1>
                        </div>
                        <div class="content">
                            <h2>Verifica tu correo electrónico</h2>
                            <p>Gracias por registrarte en MiEspacio UBB. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
                            
                            <center>
                                <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
                            </center>
                            
                            <p>O copia y pega el siguiente enlace en tu navegador:</p>
                            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
                            
                            <p><strong>Este enlace expirará en 24 horas.</strong></p>
                            
                            <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} MiEspacio UBB - Universidad del Bío-Bío</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        return [true, null];
    } catch (error) {
        console.error('Error al enviar correo de verificación:', error);
        return [false, error.message];
    }
}

export async function enviarEmailBienvenidaService(email, nombreCompleto) {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"MiEspacio UBB" <${EMAIL_USER}>`,
            to: email,
            subject: '¡Cuenta verificada con éxito!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; }
                        .button { 
                            display: inline-block; 
                            padding: 12px 30px; 
                            background-color: #10B981; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✓ ¡Cuenta verificada!</h1>
                        </div>
                        <div class="content">
                            <h2>Hola ${nombreCompleto},</h2>
                            <p>Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todas las funcionalidades de MiEspacio UBB.</p>
                            
                            <center>
                                <a href="${FRONTEND_URL}/login" class="button">Iniciar Sesión</a>
                            </center>
                            
                            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} MiEspacio UBB - Universidad del Bío-Bío</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        return [true, null];
    } catch (error) {
        console.error('Error al enviar correo de bienvenida:', error);
        return [false, error.message];
    }
}
