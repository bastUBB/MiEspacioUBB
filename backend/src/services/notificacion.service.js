import Notificacion from "../models/notificacion.model.js";
import User from "../models/user.model.js";

/*.valid('Nuevo comentario', 'Respuesta a comentario' 'Nuevo reporte', 'Apunte compartido (solo si implemento un modulo especifico)', 
'Reporte resuelto', 'Nueva valoración apunte', 'Nuevo Like', 'Nuevo Dislike', ) */

export async function actualizarEstadoLeidoService(idNotificacion) {
    try {
        const notificacionActualizada = await Notificacion.findByIdAndUpdate(
            idNotificacion,
            { estadoLeido: true },
            { new: true }
        );
        return [notificacionActualizada, null];
    } catch (error) {
        console.error('Error al actualizar el estado de leído de la notificación:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function notificacionNuevoComentarioApunteService(rutUsuarioComentario, rutUsuarioDestinatario, apunteID) {
    try {
        const userComentario = await User.findOne({ rut: rutUsuarioComentario });

        if (!userComentario) return [null, 'No se encontró el usuario con el RUT proporcionado'];

        const nuevaNotificacion = new Notificacion({
            tipoNotificacion: 'Nuevo comentario',
            mensaje: `${userComentario.nombreCompleto} ha comentado en tu apunte.`
        });

        await nuevaNotificacion.save();

        const usuarioDestinatario = await User.findOne({ rut: rutUsuarioDestinatario });

        if (!usuarioDestinatario) return [null, 'No se encontró el usuario destinatario con el RUT proporcionado'];

        usuarioDestinatario.notificaciones.push(nuevaNotificacion._id);

        await usuarioDestinatario.save();

        return [nuevaNotificacion, apunteID, null];
    } catch (error) {
        console.error('Error al crear la notificación:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function notificacionRespuestaComentarioService(rutUsuarioRespuesta, rutUsuarioDestinatario, apunteID) {
    try {
        const userRespuesta = await User.findOne({ rut: rutUsuarioRespuesta });

        if (!userRespuesta) return [null, 'No se encontró el usuario con el RUT proporcionado'];

        const nuevaNotificacion = new Notificacion({
            tipoNotificacion: 'Respuesta a comentario',
            mensaje: `${userRespuesta.nombreCompleto} ha respondido a tu comentario.`
        });

        await nuevaNotificacion.save();

        const usuarioDestinatario = await User.findOne({ rut: rutUsuarioDestinatario });

        if (!usuarioDestinatario) return [null, 'No se encontró el usuario destinatario con el RUT proporcionado'];

        usuarioDestinatario.notificaciones.push(nuevaNotificacion._id);

        await usuarioDestinatario.save();

        return [nuevaNotificacion, apunteID, null];
    } catch (error) {
        console.error('Error al crear la notificación:', error);
        return [null, 'Error interno del servidor'];
    }
}

//para el admin
export async function notificacionNuevosReportesService(cantidadReportesPendientes) {
    try {
        const nuevaNotificacion = new Notificacion({
            tipoNotificacion: 'Nuevo reporte',
            mensaje: `Tienes ${cantidadReportesPendientes} reportes pendientes por revisar.`
        });

        await nuevaNotificacion.save();

        //agregar la notificacion a todos los usuarios administradores

        const admins = await User.find({ rol: 'Administrador' });

        if (!admins || admins.length === 0) return [null, 'No se encontraron usuarios administradores'];

        for (const admin of admins) {
            admin.notificaciones.push(nuevaNotificacion._id);
            await admin.save();
        }
        return [nuevaNotificacion, null];
    } catch (error) {
        console.error('Error al crear la notificación de nuevo reporte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function notificacionReporteResueltoService(rutUsuarioDestinatario, reporteID) {
    try {
        const nuevaNotificacion = new Notificacion({
            tipoNotificacion: 'Reporte resuelto',
            mensaje: `Tu reporte ha sido resuelto por el equipo de administración.`
        });

        await nuevaNotificacion.save();

        const usuarioDestinatario = await User.findOne({ rut: rutUsuarioDestinatario });

        if (!usuarioDestinatario) return [null, 'No se encontró el usuario destinatario con el RUT proporcionado'];

        usuarioDestinatario.notificaciones.push(nuevaNotificacion._id);

        await usuarioDestinatario.save();

        return [nuevaNotificacion, reporteID, null];
    } catch (error) {
        console.error('Error al crear la notificación de reporte resuelto:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function notificacionNuevaValoracionApunteService(rutAutorApunte, rutUserValoracion, apunteID) {
    try {
        const nuevaNotificacion = new Notificacion({
            tipoNotificacion: 'Nueva valoración apunte',
            mensaje: `${rutUserValoracion} ha valorado tu apunte.`
        });

        await nuevaNotificacion.save();

        const usuarioDestinatario = await User.findOne({ rut: rutAutorApunte });

        if (!usuarioDestinatario) return [null, 'No se encontró el usuario destinatario con el RUT proporcionado'];

        usuarioDestinatario.notificaciones.push(nuevaNotificacion._id);

        await usuarioDestinatario.save();

        return [nuevaNotificacion, apunteID, null];
    } catch (error) {
        console.error('Error al crear la notificación de nueva valoración de apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function notificacionLikeComentarioService(rutAutorComentario, rutUserLike, comentarioID) {
    try {
        const nuevaNotificacion = new Notificacion({
            tipoNotificacion: 'Nuevo Like',
            mensaje: `${rutUserLike} ha dado Like a tu comentario.`
        });

        await nuevaNotificacion.save();

        const usuarioDestinatario = await User.findOne({ rut: rutAutorComentario });

        if (!usuarioDestinatario) return [null, 'No se encontró el usuario destinatario con el RUT proporcionado'];

        usuarioDestinatario.notificaciones.push(nuevaNotificacion._id);

        await usuarioDestinatario.save();

        return [nuevaNotificacion, comentarioID, null];
    } catch (error) {
        console.error('Error al crear la notificación de nuevo Like en comentario:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function notificacionDislikeComentarioService(rutAutorComentario, rutUserDislike, comentarioID) {
    try {
        const nuevaNotificacion = new Notificacion({
            tipoNotificacion: 'Nuevo Dislike',
            mensaje: `${rutUserDislike} ha dado Dislike a tu comentario.`
        });

        await nuevaNotificacion.save();

        const usuarioDestinatario = await User.findOne({ rut: rutAutorComentario });

        if (!usuarioDestinatario) return [null, 'No se encontró el usuario destinatario con el RUT proporcionado'];

        usuarioDestinatario.notificaciones.push(nuevaNotificacion._id);

        await usuarioDestinatario.save();

        return [nuevaNotificacion, comentarioID, null];
    } catch (error) {
        console.error('Error al crear la notificación de nuevo Dislike en comentario:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerTodasMisNotificacionesService(rutUsuario) {
    try {
        const usuario = await User.findOne({ rut: rutUsuario });

        if (!usuario) return [null, 'No se encontró el usuario con el RUT proporcionado'];

        const notificaciones = await Notificacion.find({ _id: { $in: usuario.notificaciones }, estadoLeido: false }).sort({ createdAt: -1 });

        if (!notificaciones || notificaciones.length === 0) return [[], null];
        
        return [notificaciones, null];

    } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function borrarNotificacionesLeidasService(rutUsuario) {
    try {
        const usuario = await User.findOne({ rut: rutUsuario });

        if (!usuario) return [null, 'No se encontró el usuario con el RUT proporcionado'];

        const notificacionesLeidas = await Notificacion.find({ _id: { $in: usuario.notificaciones }, estadoLeido: true });

        const idsNotificacionesLeidas = notificacionesLeidas.map(notif => notif._id.toString());

        const resultado = await Notificacion.deleteMany({ _id: { $in: usuario.notificaciones }, estadoLeido: true });

        //Eliminar las notificaciones leídas del arreglo de notificaciones del usuario
        usuario.notificaciones = usuario.notificaciones.filter(notificacionID => {
            return !idsNotificacionesLeidas.includes(notificacionID.toString());
        });

        await usuario.save();

        return [resultado.deletedCount, null];
    } catch (error) {
        console.error('Error al borrar las notificaciones leídas:', error);
        return [null, 'Error interno del servidor'];
    }
}