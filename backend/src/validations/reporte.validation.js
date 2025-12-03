import joi from 'joi';
import { diaActual } from '../helpers/ayudasVarias.helper.js';

export const reporteQueryValidation = joi.object({
    _id: joi.string()
        .required()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID del reporte debe ser de tipo string.",
            "string.empty": "El ID del reporte no puede estar vacío.",
            "string.pattern.base": "El ID del reporte debe ser un ObjectId válido de MongoDB.",
            "any.required": "El ID del reporte es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: _id',
    });

export const consultaReportesValidation = joi.object({
    rutUsuarioReporte: joi.string()
        .required()
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut del usuario no puede estar vacío.",
            "string.base": "El rut del usuario debe ser de tipo string.",
            "string.min": "El rut del usuario debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del usuario debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del usuario inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut del usuario es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: rutUsuarioReporte',
    });

export const reporteCreateValidation = joi.object({
    rutUsuarioReportado: joi.string()
        .required()
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut del usuario reportado no puede estar vacío.",
            "string.base": "El rut del usuario reportado debe ser de tipo string.",
            "string.min": "El rut del usuario reportado debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del usuario reportado debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del usuario reportado inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut del usuario reportado es obligatorio.",
        }),
    rutUsuarioReporte: joi.string()
        .required()
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut del usuario que reporta no puede estar vacío.",
            "string.base": "El rut del usuario que reporta debe ser de tipo string.",
            "string.min": "El rut del usuario que reporta debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del usuario que reporta debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del usuario que reporta inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut del usuario que reporta es obligatorio.",
        }),
    motivo: joi.string()
        .required()
        .valid("Spam", "Contenido inapropiado", "Otro")
        .trim()
        .messages({
            "string.empty": "El motivo del reporte no puede estar vacío.",
            "string.base": "El motivo del reporte debe ser de tipo string.",
            "any.only": "El motivo del reporte debe ser uno de los siguientes: Spam, Contenido inapropiado, Otro.",
            "any.required": "El motivo del reporte es obligatorio.",
        }),
    descripcion: joi.string()
        .required()
        .trim()
        .min(5)
        .max(500)
        .messages({
            "string.empty": "La descripción del reporte no puede estar vacía.",
            "string.base": "La descripción del reporte debe ser de tipo string.",
            "string.min": "La descripción del reporte debe tener como mínimo 5 caracteres.",
            "string.max": "La descripción del reporte debe tener como máximo 500 caracteres.",
            "any.required": "La descripción del reporte es obligatoria.",
        }),
    fecha: joi.string()
        .required()
        .strict()
        .pattern(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)
        .valid(diaActual)
        .messages({
            "string.empty": "La fecha no puede estar vacía.",
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",
            "any.only": `La fecha debe ser exactamente hoy: ${diaActual}.`,
            "any.required": "La fecha es obligatoria."
        }),
    apunteId: joi.string()
        .optional()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID del apunte debe ser de tipo string.",
            "string.pattern.base": "El ID del apunte debe ser un ObjectId válido de MongoDB.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos obligatorios: rutUsuarioReportado, rutUsuarioReporte, motivo, descripcion y fecha ',
    });

export const reporteUpdateValidation = joi.object({
    rutUsuarioReportado: joi.string()
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.base": "El rut del usuario reportado debe ser de tipo string.",
            "string.min": "El rut del usuario reportado debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del usuario reportado debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del usuario reportado inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    rutUsuarioReporte: joi.string()
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.base": "El rut del usuario que reporta debe ser de tipo string.",
            "string.min": "El rut del usuario que reporta debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del usuario que reporta debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del usuario que reporta inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    motivo: joi.string()
        .valid("Spam", "Contenido inapropiado", "Otro")
        .trim()
        .messages({
            "string.base": "El motivo del reporte debe ser de tipo string.",
            "any.only": "El motivo del reporte debe ser uno de los siguientes: Spam, Contenido inapropiado, Otro.",
        }),
    descripcion: joi.string()
        .trim()
        .min(5)
        .max(500)
        .messages({
            "string.base": "La descripción del reporte debe ser de tipo string.",
            "string.min": "La descripción del reporte debe tener como mínimo 5 caracteres.",
            "string.max": "La descripción del reporte debe tener como máximo 500 caracteres.",
        }),
    fecha: joi.string()
        .strict()
        .pattern(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)
        .valid(diaActual)
        .messages({
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",
            "any.only": `La fecha debe ser exactamente hoy: ${diaActual}.`,
        }),
    estado: joi.string()
        .trim()
        .valid("Pendiente", "Resuelto", "Rechazado")
        .messages({
            "string.base": "El estado del reporte debe ser de tipo string.",
            "any.only": "El estado del reporte debe ser uno de los siguientes: Pendiente, Resuelto, Rechazado.",
        }),
    resolucion: joi.string()
        .trim()
        .min(5)
        .max(500)
        .messages({
            "string.base": "La resolución del reporte debe ser de tipo string.",
            "string.min": "La resolución del reporte debe tener como mínimo 5 caracteres.",
            "string.max": "La resolución del reporte debe tener como máximo 500 caracteres.",
        }),
})
    .or('rutUsuarioReportado', 'rutUsuarioReporte', 'motivo', 'descripcion', 'fecha', 'estado', 'resolucion')
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar al menos uno de los campos para actualizar: rutUsuarioReportado, rutUsuarioReporte, motivo, descripcion, fecha, estado o resolucion',
    });