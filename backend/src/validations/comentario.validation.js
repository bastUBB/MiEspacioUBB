import joi from 'joi';
import { diaActual, fechaActual } from '../helpers/ayudasVarias.helper.js';

export const comentarioQueryValidation = joi.object({
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

export const comentarioCreateValidation = joi.object({
    rutAutor: joi.string()
        .required()
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut del autor no puede estar vacío.",
            "string.base": "El rut del autor debe ser de tipo string.",
            "string.min": "El rut del autor debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del autor debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del autor inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut del autor es obligatorio.",
        }),
    comentario: joi.string()
        .required()
        .trim()
        .min(1)
        .max(200)
        .messages({
            "string.empty": "El comentario no puede estar vacío.",
            "string.base": "El comentario debe ser de tipo string.",
            "string.min": "El comentario debe tener como mínimo 1 caracter.",
            "string.max": "El comentario debe tener como máximo 200 caracteres.",
            "any.required": "El comentario es obligatorio.",
        }),
    fechaComentario: joi.string()
        .required()
        .pattern(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)
        .valid(diaActual)
        .messages({
            "string.empty": "La fecha no puede estar vacía.",
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",
            "any.only": `La fecha debe ser exactamente hoy: ${diaActual}.`,
            "any.required": "La fecha es obligatoria."
        })
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: rutAutor, comentario y fechaComentario',
    });

export const comentarioUpdateValidation = joi.object({
    rutAutor: joi.string()
        .trim()
        .strict()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.base": "El rut del autor debe ser de tipo string.",
            "string.min": "El rut del autor debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del autor debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del autor inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    comentario: joi.string()
        .trim()
        .strict()
        .min(1)
        .max(200)
        .messages({
            "string.base": "El comentario debe ser de tipo string.",
            "string.min": "El comentario debe tener como mínimo 1 caracter.",
            "string.max": "El comentario debe tener como máximo 200 caracteres.",
        }),
    fechaComentario: joi.string()
        .strict()
        .pattern(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)
        .valid(diaActual)
        .messages({
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",
            "any.only": `La fecha debe ser exactamente hoy: ${diaActual}.`,
        }),
    likes: joi.number()
        .min(0)
        .max(1)
        .integer()
        .messages({
            "number.base": "Los likes deben ser de tipo número.",
            "number.integer": "Los likes deben ser un número entero.",
            "number.min": "Los likes no pueden ser negativos.",
            "number.max": "Los likes no pueden ser mayores a 1.",
        }),
    dislikes: joi.number()
        .min(0)
        .max(1)
        .integer()
        .messages({
            "number.base": "Los dislikes deben ser de tipo número.",
            "number.integer": "Los dislikes deben ser un número entero.",
            "number.min": "Los dislikes no pueden ser negativos.",
            "number.max": "Los dislikes no pueden ser mayores a 1.",
        }),
    respuestas: joi.array()
        .items(
            joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .messages({
                    "string.base": "El ID del comentario debe ser de tipo string.",
                    "string.pattern.base": "El ID del comentario debe ser un ObjectId válido de MongoDB.",
                }),
        )
        .min(1)
        .max(1)
        .messages({
            "array.base": "Las respuestas deben ser un arreglo de IDs de comentarios.",
            "array.min": "Debe haber al menos una respuesta en el arreglo.",
            "array.max": "Solo se permite una respuesta en el arreglo.",
        }),
    reportes: joi.array()
        .items(
            joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .messages({
                    "string.base": "El ID del reporte debe ser de tipo string.",
                    "string.pattern.base": "El ID del reporte debe ser un ObjectId válido de MongoDB.",
                }),
        )
        .min(1)
        .max(1)
        .messages({
            "array.base": "Los reportes deben ser un arreglo de IDs de reportes.",
            "array.min": "Debe haber al menos un reporte en el arreglo.",
            "array.max": "Solo se permite un reporte en el arreglo.",
        }),
})  
    .or('rutAutor', 'comentario', 'fechaComentario', 'Likes', 'Dislikes', 'respuestas', 'reportes')
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar al menos uno de los campos: rutAutor, comentario, fechaComentario, Likes, Dislikes, respuestas o reportes',
    });

export const comentarioRespuestaValidation = joi.object({
    comentarioPadreID: joi.string()
        .required()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID del comentario padre debe ser de tipo string.",   
            "string.empty": "El ID del comentario padre no puede estar vacío.",
            "string.pattern.base": "El ID del comentario padre debe ser un ObjectId válido de MongoDB.",
            "any.required": "El ID del comentario padre es obligatorio.",
        }),
    rutAutor: joi.string()
        .required()
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut del autor no puede estar vacío.",
            "string.base": "El rut del autor debe ser de tipo string.",
            "string.min": "El rut del autor debe tener como mínimo 9 caracteres.",
            "string.max": "El rut del autor debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut del autor inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut del autor es obligatorio.",
        }),
    comentario: joi.string()
        .required()
        .trim()
        .min(1)
        .max(200)
        .messages({
            "string.empty": "El comentario no puede estar vacío.",
            "string.base": "El comentario debe ser de tipo string.",
            "string.min": "El comentario debe tener como mínimo 1 caracter.",
            "string.max": "El comentario debe tener como máximo 200 caracteres.",
            "any.required": "El comentario es obligatorio.",
        }),
    fechaComentario: joi.string()
        .required()
        .pattern(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)
        .valid(diaActual)
        .messages({
            "string.empty": "La fecha no puede estar vacía.",
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",
            "any.only": `La fecha debe ser exactamente hoy: ${diaActual}.`,
            "any.required": "La fecha es obligatoria."
        })
})
    .unknown(false)
