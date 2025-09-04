import joi from 'joi';
import moment from "moment";

const hoy = moment().format("DD-MM-YYYY");

//TODO: Se considerán parámetros por los cuales el usuario puede buscar apuntes (verificar en un futuro)
export const apunteQueryValidation = joi.object({
    nombre: joi.string()
        .required()
        .min(3)
        .max(50)
        .strict()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            'string.empty': 'El nombre del apunte no puede estar vacío',
            'string.base': 'El nombre del apunte debe ser una cadena de texto',
            'string.min': 'El nombre del apunte debe tener al menos 3 caracteres',
            'string.max': 'El nombre del apunte no puede tener más de 50 caracteres',
            'string.pattern.base': 'El nombre del apunte solo puede contener letras y espacios',
            'any.required': 'El nombre del apunte es obligatorio',
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: nombre',
    });

export const apunteCreateValidation = joi.object({
    nombre: joi.string()
        .required()
        .min(3)
        .max(50)
        .strict()
        .trim()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            'string.empty': 'El nombre del apunte no puede estar vacío',
            'string.base': 'El nombre del apunte debe ser de tipo string',
            'string.min': 'El nombre del apunte debe tener al menos 3 caracteres',
            'string.max': 'El nombre del apunte no puede tener más de 50 caracteres',
            'string.pattern.base': 'El nombre del apunte solo puede contener letras y espacios',
            'any.required': 'El nombre del apunte es obligatorio',
        }),
    descripcion: joi.string()
        .required()
        .strict()
        .min(10)
        .max(200)
        .trim()
        .messages({
            'string.empty': 'El campo descripcion no puede estar vacío',
            'string.base': 'El campo descripcion debe ser de tipo string',
            'string.min': 'El campo descripcion debe tener al menos 10 caracteres',
            'string.max': 'El campo descripcion no puede tener más de 200 caracteres',
            'any.required': 'El campo descripcion es obligatorio',
        }),
    asignatura: joi.string()
        .required()
        .min(3)
        .max(50)
        .strict()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            'string.empty': 'El nombre de la asignatura no puede estar vacío',
            'string.base': 'El nombre de la asignatura debe ser de tipo string',
            'string.min': 'El nombre de la asignatura debe tener al menos 3 caracteres',
            'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
            'string.pattern.base': 'El nombre de la asignatura solo puede contener letras y espacios',
            'any.required': 'El nombre de la asignatura es obligatorio',
        }),
    fechaSubida: joi.string()
        .required()
        .strict()
        .pattern(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)
        .valid(hoy)
        .messages({
            "string.empty": "La fecha no puede estar vacía.",
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",
            "any.only": `La fecha debe ser exactamente hoy: ${hoy}.`,
            "any.required": "La fecha es obligatoria."
        }),
    tipoApunte: joi.string()
        .required()
        .valid("Manuscrito", "Texto", "Gráfico/Esquemático", "Mixto", "Otro")
        .messages({
            "string.empty": "El tipo de apunte no puede estar vacío.",
            "string.base": "El tipo de apunte debe ser de tipo string.",
            "any.only": "El tipo de apunte debe ser uno de los siguientes: Manuscrito, Texto, Gráfico/Esquemático, Mixto u Otro.",
            "any.required": "El tipo de apunte es obligatorio."
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos obligatorios: nombre, descripción, asignatura, fechaSubida y tipoApunte',
    });

export const apunteUpdateValidation = joi.object({
    nombre: joi.string()
        .min(3)
        .max(50)
        .strict()
        .trim()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            'string.base': 'El nombre del apunte debe ser de tipo string',
            'string.min': 'El nombre del apunte debe tener al menos 3 caracteres',
            'string.max': 'El nombre del apunte no puede tener más de 50 caracteres',
            'string.pattern.base': 'El nombre del apunte solo puede contener letras y espacios',
        }),
    descripcion: joi.string()
        .strict()
        .min(10)
        .max(200)
        .trim()
        .messages({
            'string.base': 'El campo descripcion debe ser de tipo string',
            'string.min': 'El campo descripcion debe tener al menos 10 caracteres',
            'string.max': 'El campo descripcion no puede tener más de 200 caracteres',
        }),
    asignatura: joi.string()
        .min(3)
        .max(50)
        .strict()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            'string.base': 'El nombre de la asignatura debe ser de tipo string',
            'string.min': 'El nombre de la asignatura debe tener al menos 3 caracteres',
            'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
            'string.pattern.base': 'El nombre de la asignatura solo puede contener letras y espacios',
        }),
    fechaSubida: joi.string()
        .strict()
        .pattern(/^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)
        .valid(hoy)
        .messages({
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",
            "any.only": `La fecha debe ser exactamente hoy: ${hoy}.`,
        }),
    tipoApunte: joi.string()
        .valid("Manuscrito", "Texto", "Gráfico/Esquemático", "Mixto", "Otro")
        .messages({
            "string.base": "El tipo de apunte debe ser de tipo string.",
            "any.only": "El tipo de apunte debe ser uno de los siguientes: Manuscrito, Texto, Gráfico/Esquemático, Mixto u Otro.",
        }),
    valorizacion: joi.number()
        .min(1)
        .max(7)
        .integer()
        .messages({
            'number.base': 'La valorización debe ser un número',
            'number.min': 'La valorización debe ser al menos 1',
            'number.max': 'La valorización no puede ser más de 7',
            'number.integer': 'La valorización debe ser un número entero',
        }),
    visualizaciones: joi.number()
        .min(1)
        .max(1)
        .integer()
        .messages({
            'number.base': 'La visualización debe ser un número',
            'number.min': 'La visualización debe ser al menos 1',
            'number.max': 'La visualización no puede ser más de 1',
            'number.integer': 'La visualización debe ser un número entero',
        }),
})
    .or("nombre", "descripcion", "asignatura", "fechaSubida", "tipoApunte", "valorizacion", "visualizaciones")
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar al menos uno de los campos: nombre, descripcion, asignatura, fechaSubida, tipoApunte, valorizacion o visualizaciones',
    });

