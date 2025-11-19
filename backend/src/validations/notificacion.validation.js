import joi from 'joi';

export const notificacionQueryValidation = joi.object({
    _id: joi.string()
        .required()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID del comentario debe ser de tipo string.",
            "string.empty": "El ID del comentario no puede estar vacío.",
            "string.pattern.base": "El ID del comentario debe ser un ObjectId válido de MongoDB.",
            "any.required": "El ID del comentario es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: _id',
    });

export const notificacionRutUsuarioValidation = joi.object({
    rutUsuario: joi.string()
        .required()
        .min(9)
        .max(12)
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.base": "El rut debe ser de tipo string.",
            "string.empty": "El rut no puede estar vacío.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: rutUsuario',
    });

export const notificacionCreateValidation = joi.object({
    tipoNotificacion: joi.string()
        .required()
        .trim()
        //Nuevo reporte -> solo para administradores
        .valid('Nuevo comentario', 'Nuevo reporte', 'Apunte compartido', 'Reporte resuelto', 'Nueva valoración apunte',
            'Nuevo Like', 'Nuevo Dislike', "Respuesta a comentario")
        .messages({
            "string.empty": "El tipo de notificación no puede estar vacío.",
            "string.base": "El tipo de notificación debe ser de tipo string.",
            "any.only": "El tipo de notificación debe ser uno de los valores permitidos: Nuevo comentario, Nuevo reporte, Apunte compartido, Reporte resuelto, Nueva valoración apunte, Nuevo Like, Nuevo Dislike, Respuesta a comentario.",
            "any.required": "El tipo de notificación es obligatorio.",
        }),
    mensaje: joi.string()
        .required()
        .trim()
        .valid("Tu apunte ha recibido un nuevo comentario.",
            "Nuevo reporte de apunte recibido.",
            "Un usuario ha compartido tu apunte.",
            "Tu reporte ha sido resuelto por el equipo de administración.",
            "Tu apunte ha recibido una nueva valoración.",
            "Tu comentario ha recibido un nuevo Like.",
            "Tu comentario ha recibido un nuevo Dislike.",
            "Tu comentario ha recibido una nueva respuesta."
        )
        .messages({
            "string.empty": "El mensaje de la notificación no puede estar vacío.",
            "string.base": "El mensaje de la notificación debe ser de tipo string.",
            "any.only": "El mensaje de la notificación debe ser uno de los valores permitidos: Tu apunte ha recibido un nuevo comentario., Nuevo reporte de apunte recibido., Un usuario ha compartido tu apunte., Tu reporte ha sido resuelto por el equipo de administración., Tu apunte ha recibido una nueva valoración., Tu comentario ha recibido un nuevo Like., Tu comentario ha recibido un nuevo Dislike., Tu comentario ha recibido una nueva respuesta.",
            "any.required": "El mensaje de la notificación es obligatorio.",
        }),
})  
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: tipoNotificacion y mensaje',
    });

export const notificacionUpdateValidation = joi.object({
    tipoNotificacion: joi.string()
        .trim()
        //Nuevo reporte -> solo para administradores
        .valid('Nuevo comentario', 'Nuevo reporte', 'Apunte compartido', 'Reporte resuelto', 'Nueva valoración apunte',
            'Nuevo Like', 'Nuevo Dislike', "Respuesta a comentario")
        .messages({
            "string.base": "El tipo de notificación debe ser de tipo string.",
            "any.only": "El tipo de notificación debe ser uno de los valores permitidos: Nuevo comentario, Nuevo reporte, Apunte compartido, Reporte resuelto, Nueva valoración apunte, Nuevo Like, Nuevo Dislike, Respuesta a comentario.",
        }),
    mensaje: joi.string()
        .trim()
        .valid("Tu apunte ha recibido un nuevo comentario.",
            "Nuevo reporte de apunte recibido.",
            "Un usuario ha compartido tu apunte.",
            "Tu reporte ha sido resuelto por el equipo de administración.",
            "Tu apunte ha recibido una nueva valoración.",
            "Tu comentario ha recibido un nuevo Like.",
            "Tu comentario ha recibido un nuevo Dislike.",
            "Tu comentario ha recibido una nueva respuesta."
        )
        .messages({
            "string.base": "El mensaje de la notificación debe ser de tipo string.",
            "any.only": "El mensaje de la notificación debe ser uno de los valores permitidos: Tu apunte ha recibido un nuevo comentario., Nuevo reporte de apunte recibido., Un usuario ha compartido tu apunte., Tu reporte ha sido resuelto por el equipo de administración., Tu apunte ha recibido una nueva valoración., Tu comentario ha recibido un nuevo Like., Tu comentario ha recibido un nuevo Dislike., Tu comentario ha recibido una nueva respuesta.",
        }),
    estadoLeido: joi.boolean()
        .messages({
            "boolean.base": "El estado de leído debe ser de tipo booleano.",
        }),
})  .or('tipoNotificacion', 'mensaje', 'estadoLeido')
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: tipoNotificacion, mensaje o estadoLeido',
    });