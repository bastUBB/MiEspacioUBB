import joi from 'joi';

export const recomendacionPersonalizadaValidation = joi.object({
    rutUser: joi.string()
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
        }),
    limite: joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(20)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede ser más de 50',
        })
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
    });

export const recomendacionPorAsignaturaValidation = joi.object({
    rutUser: joi.string()
        .min(9)
        .max(12)
        .trim()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    asignatura: joi.string()
        .required()
        .min(3)
        .max(50)
        .trim()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            'string.empty': 'El nombre de la asignatura no puede estar vacío',
            'string.base': 'El nombre de la asignatura debe ser de tipo string',
            'string.min': 'El nombre de la asignatura debe tener al menos 3 caracteres',
            'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
            'string.pattern.base': 'El nombre de la asignatura solo puede contener letras y espacios',
            'any.required': 'El nombre de la asignatura es obligatorio',
        }),
    limite: joi.number()
        .integer()
        .min(1)
        .max(30)
        .default(10)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede ser más de 30',
        })
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
    });

export const recomendacionGenericaValidation = joi.object({
    limite: joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(20)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede ser más de 50',
        })
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
    });
