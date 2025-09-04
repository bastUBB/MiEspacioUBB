import joi from "joi";

export const perfilAcademicoQueryValidation = joi.object({
    rutUser: joi.string()
        .required()
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut que desea ingresar no puede estar vacío.",
            "string.base": "El rut que desea ingresar debe ser de tipo string.",
            "string.min": "El rut que desea ingresar debe tener como mínimo 9 caracteres.",
            "string.max": "El rut que desea ingresar debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut que desea ingresar inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut que desea ingresar es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: rut',
    });

export const perfilAcademicoCreateValidation = joi.object({
    rutUser: joi.string()
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
    asignaturasInteres: joi.array()
        .items(
            joi.string()
                .required()
                .min(10)
                .max(50)
                .strict()
                .trim()
                .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\.\-\d\,]+$/)
                .messages({
                    'string.empty': 'El nombre de la asignatura no puede estar vacío',
                    'string.base': 'El nombre de la asignatura debe ser una cadena de texto',
                    'string.min': 'El nombre de la asignatura debe tener al menos 10 caracteres',
                    'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
                    'string.pattern.base': 'El nombre de la asignatura solo puede contener letras, números, puntos, guiones, comas y espacios',
                }),
        )
        .required()
        .min(1)
        .max(55)
        .messages({
            'array.base': 'Las asignaturas de interés deben ser un arreglo',
            'array.min': 'Debe haber al menos una asignatura de interés',
            'array.max': 'No puede haber más de 55 asignaturas de interés',
            'array.required': 'Las asignaturas de interés son obligatorias',
        }),
    semestreActual: joi.number()
        .required()
        .min(1)
        .max(10)
        .messages({
            'number.base': 'El semestre actual debe ser un número',
            'number.empty': 'El semestre actual no puede estar vacío',
            'number.min': 'El semestre actual debe ser al menos 1',
            'number.max': 'El semestre actual no puede ser más de 10',
            'any.required': 'El semestre actual es obligatorio',
        }),
    tiposApuntesPreferido: joi.string()
        .required()
        .trim()
        .valid('Textual', 'Gráfico', 'Escrito', 'Sin preferencia')
        .messages({
            'string.empty': 'El tipo de apuntes preferido no puede estar vacío',
            'string.base': 'El tipo de apuntes preferido debe ser una cadena de texto',
            'any.only': 'El tipo de apuntes preferido debe ser "Textual", "Gráfico", "Escrito" o "Sin preferencia"',
            'any.required': 'El tipo de apuntes preferido es obligatorio',
        })
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: rutUser, asignaturasInteres, semestreActual y tiposApuntesPreferido',
    });

export const perfilAcademicoUpdateValidation = joi.object({
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
    asignaturasInteres: joi.array()
        .items(
            joi.string()
                .min(10)
                .max(50)
                .strict()
                .trim()
                .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\.\-\d\,]+$/)
                .messages({
                    'string.base': 'El nombre de la asignatura debe ser una cadena de texto',
                    'string.min': 'El nombre de la asignatura debe tener al menos 10 caracteres',
                    'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
                    'string.pattern.base': 'El nombre de la asignatura solo puede contener letras, números, puntos, guiones, comas y espacios',
                }),
        )
        .min(1)
        .max(55)
        .messages({
            'array.base': 'Las asignaturas de interés deben ser un arreglo',
            'array.min': 'Debe haber al menos una asignatura de interés',
            'array.max': 'No puede haber más de 55 asignaturas de interés',
        }),
    semestreActual: joi.number()
        .min(1)
        .max(10)
        .messages({
            'number.base': 'El semestre actual debe ser un número',
            'number.min': 'El semestre actual debe ser al menos 1',
            'number.max': 'El semestre actual no puede ser más de 10',
        }),
    tiposApuntesPreferido: joi.string()
        .valid('Textual', 'Gráfico', 'Escrito', 'Sin preferencia')
        .trim()
        .messages({
            'string.base': 'El tipo de apuntes preferido debe ser una cadena de texto',
            'any.only': 'El tipo de apuntes preferido debe ser "Textual", "Gráfico", "Escrito" o "Sin preferencia"',
        })
})
    .or("rutUser", "asignaturasInteres", "semestreActual", "tiposApuntesPreferido")
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar al menos uno de los campos: rutUser, asignaturasInteres, semestreActual o tiposApuntesPreferido',
    });
