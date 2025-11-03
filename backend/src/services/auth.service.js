import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { enviarEmailVerificacionService, enviarEmailBienvenidaService } from "./email.service.js";

const toSafeUser = (u) => {
  const o = u.toObject?.() ?? JSON.parse(JSON.stringify(u));
  delete o.password;
  delete o.verificationToken;
  return o;
};

export async function registerUserService(dataUser) {
  try {
    const { rut, email, password } = dataUser;

    const existeRut = await User.findOne({ rut });

    if (existeRut) return [null, "El RUT ya está registrado"];

    const existeEmail = await User.findOne({ email });

    if (existeEmail) return [null, "El correo electrónico ya está registrado"];

    const hashed = await hashPassword(password);

    // Generar token de verificación único
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // El token expirará en 24 horas
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      ...dataUser,
      password: hashed,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });

    const [emailSent, emailError] = await enviarEmailVerificacionService(email, verificationToken);

    if (!emailSent) {
      console.error('Error al enviar correo de verificación:', emailError);
      // await User.findByIdAndDelete(user._id);
      // return [null, "Error al enviar el correo de verificación"];
    }

    return [toSafeUser(user), null];
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return [null, 'Error interno del servidor'];
  }
}

export async function loginUserService(dataUser) {
  try {
    const { email, password } = dataUser;

    const user = await User.findOne({ email });

    if (!user) return [null, "Usuario o contraseña inválidos"];

    if (!user.isVerified) {
      return [null, "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada."];
    }

    const ok = await comparePassword(password, user.password);

    if (!ok) return [null, "Usuario o contraseña inválidos"];

    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT_SECRET no configurado");

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "1d" });

    const userResponse = toSafeUser(user);

    return [{ user: userResponse, token }, null];

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return [null, 'Error interno del servidor'];
  }
}

export async function getProfileService(userId) {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) return [null, "Usuario no encontrado"];

    return [user, null];

  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    return [null, 'Error interno del servidor'];
  }
}

export async function verifyEmailService(token) {
  try {
    const userWithToken = await User.findOne({ verificationToken: token });

    if (!userWithToken) {
      const recentlyVerified = await User.findOne({
        isVerified: true,
        updatedAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }
      });

      if (recentlyVerified) {
        return [toSafeUser(recentlyVerified), null];
      }

      return [null, "Token inválido o expirado. Por favor, solicita un nuevo correo de verificación."];
    }

    if (userWithToken.isVerified) {
      return [toSafeUser(userWithToken), null];
    }

    if (userWithToken.verificationTokenExpires < new Date()) {
      return [null, "Token expirado. Por favor, solicita un nuevo correo de verificación."];
    }

    userWithToken.isVerified = true;
    userWithToken.verificationToken = undefined;
    userWithToken.verificationTokenExpires = undefined;
    await userWithToken.save();

    // Enviar correo de bienvenida (no esperar a que termine)
    enviarEmailBienvenidaService(userWithToken.email, userWithToken.nombreCompleto)

    return [toSafeUser(userWithToken), null];

  } catch (error) {
    console.error('Error al verificar el email:', error);
    return [null, 'Error interno del servidor'];
  }
}

export async function resendVerificationEmailService(email) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return [null, "No existe un usuario con ese correo electrónico."];
    }

    if (user.isVerified) {
      return [null, "Este correo electrónico ya ha sido verificado."];
    }

    // Generar nuevo token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Enviar correo
    const [emailSent, emailError] = await enviarEmailVerificacionService(email, verificationToken);

    if (!emailSent) {
      console.error('Error al reenviar correo de verificación:', emailError);
      return [null, "Error al enviar el correo de verificación"];
    }

    return [true, null];

  } catch (error) {
    console.error('Error al reenviar correo de verificación:', error);
    return [null, 'Error interno del servidor'];
  }
}
