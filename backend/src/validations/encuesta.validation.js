import Joi from "joi";

export const encuestaCreateValidation = Joi.object({
    nombreEncuesta: Joi.string()
        .required()
        .min(3)
        .max(200)
        .messages({
            "string.empty": "El nombre de la encuesta no puede estar vacío.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre no puede exceder los 200 caracteres.",
            "any.required": "El nombre de la encuesta es obligatorio."
        }),
    descripcion: Joi.string()
        .required()
        .min(10)
        .max(1000)
        .messages({
            "string.empty": "La descripción no puede estar vacía.",
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción no puede exceder los 1000 caracteres.",
            "any.required": "La descripción es obligatoria."
        }),
    enlaceGoogleForm: Joi.string()
        .required()
        .uri()
        .messages({
            "string.empty": "El enlace del Google Form no puede estar vacío.",
            "string.uri": "Debe ser una URL válida.",
            "any.required": "El enlace del Google Form es obligatorio."
        })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});

export const encuestaQueryValidation = Joi.object({
    _id: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.empty": "El ID no puede estar vacío.",
            "string.pattern.base": "El formato del ID no es válido.",
            "any.required": "El ID es obligatorio."
        })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});

export const encuestaUpdateValidation = Joi.object({
    nombreEncuesta: Joi.string()
        .min(3)
        .max(200)
        .messages({
            "string.empty": "El nombre de la encuesta no puede estar vacío.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre no puede exceder los 200 caracteres."
        }),
    descripcion: Joi.string()
        .min(10)
        .max(1000)
        .messages({
            "string.empty": "La descripción no puede estar vacía.",
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción no puede exceder los 1000 caracteres."
        }),
    enlaceGoogleForm: Joi.string()
        .uri()
        .messages({
            "string.empty": "El enlace del Google Form no puede estar vacío.",
            "string.uri": "Debe ser una URL válida."
        }),
    estado: Joi.string()
        .valid("Activo", "Inactivo")
        .messages({
            "any.only": "El estado debe ser 'Activo' o 'Inactivo'."
        })
})
    .min(1)
    .messages({
        "object.min": "Debe proporcionar al menos un campo para actualizar.",
        "object.unknown": "No se permiten propiedades adicionales."
    });
