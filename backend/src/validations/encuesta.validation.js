import joi from "joi";
import { googleFormsUrlValidator } from "../helpers/ayudasVarias.helper.js";

export const encuestaQueryValidation = joi.object({
    encuestaID: joi.string()
        .required()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID de la encuesta debe ser de tipo string.",
            "string.empty": "El ID de la encuesta no puede estar vacío.",
            "string.pattern.base": "El ID de la encuesta debe ser un ObjectId válido de MongoDB.",
            "any.required": "El ID de la encuesta es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: encuestaID',
    });

export const encuestaCreateValidation = joi.object({
    rutAutor: joi.string()
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
    nombreEncuesta: joi.string()
        .required()
        .trim()
        .min(3)
        .max(55)
        .messages({
            "string.empty": "El nombre de la encuesta no puede estar vacío.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre no puede exceder los 200 caracteres.",
            "any.required": "El nombre de la encuesta es obligatorio."
        }),
    descripcion: joi.string()
        .required()
        .trim()
        .min(10)
        .max(200)
        .messages({
            "string.empty": "La descripción no puede estar vacía.",
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción no puede exceder los 200 caracteres.",
            "any.required": "La descripción es obligatoria."
        }),

    enlaceGoogleForm: joi.string()
        .required()
        .trim()
        .uri({ scheme: ["http", "https"] })
        .custom(googleFormsUrlValidator)
        .messages({
            "string.empty": "El enlace del Google Form no puede estar vacío.",
            "string.uri": "Debe ser una URL válida.",
            "any.invalid": "El enlace debe corresponder a un formulario válido de Google Forms.",
            "any.required": "El enlace del Google Form es obligatorio."
        })
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debe proporcionar todos los campos obligatorios: nombreEncuesta, descripcion y enlaceGoogleForm."
    });

export const encuestaUpdateValidation = joi.object({
    rutAutor: joi.string()
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
    nombreEncuesta: joi.string()
        .trim()
        .min(3)
        .max(55)
        .messages({
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre no puede exceder los 200 caracteres.",
        }),
    descripcion: joi.string()
        .trim()
        .min(10)
        .max(200)
        .messages({
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción no puede exceder los 200 caracteres.",
        }),

    enlaceGoogleForm: joi.string()
        .trim()
        .uri({ scheme: ["http", "https"] })
        .custom(googleFormsUrlValidator)
        .messages({
            "string.uri": "Debe ser una URL válida.",
            "any.invalid": "El enlace debe corresponder a un formulario válido de Google Forms."
        })
})
    .or("nombreEncuesta", "descripcion", "enlaceGoogleForm")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debe proporcionar el campo obligatorio rutAutor junto a los campos opcionales nombreEncuesta, descripcion o enlaceGoogleForm."
    });

export const encuestaRutValidation = joi.object({
    rutAutor: joi.string()
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
        })
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debe proporcionar el campo obligatorio rutAutor.",
    });

export const encuestaPerfilAcademicoIDValidation = joi.object({
    perfilAcademicoID: joi.string()
        .required()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID del perfil académico debe ser de tipo string.",
            "string.empty": "El ID del perfil académico no puede estar vacío.",
            "string.pattern.base": "El ID del perfil académico debe ser un ObjectId válido de MongoDB.",
            "any.required": "El ID del perfil académico es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: perfilAcademicoID',
    });
