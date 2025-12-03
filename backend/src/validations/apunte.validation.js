import joi from 'joi';
import { obtenerDiaActual } from '../helpers/ayudasVarias.helper.js';

export const apunteQueryValidation = joi.object({
    apunteID: joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID del apunte debe ser de tipo string.",
            "string.empty": "El ID del apunte no puede estar vacío.",
            "string.pattern.base": "El ID del apunte debe ser un ObjectId válido de MongoDB.",
        }),
    rutAutorSubida: joi.string()
        .trim()
        .min(9)
        .max(12)
        .pattern(/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/)
        .messages({
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x.",
        }),
    rutUser: joi.string()
        .trim()
        .min(9)
        .max(12)
        .pattern(/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/)
        .messages({
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x.",
        }),
})
    .or("apunteID", "rutAutorSubida", "rutUser")
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar al menos uno de los campos: apunteID, rutAutorSubida o rutUser',
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
    autorSubida: joi.string()
        .required()
        .min(15)
        .max(50)
        .trim()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            "string.base": "El nombre completo debe ser de tipo string.",
            "string.empty": "El nombre completo no puede estar vacío.",
            "string.min": "El nombre completo debe tener como mínimo 15 caracteres.",
            "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
            "string.pattern.base": "El nombre completo solo puede contener letras y espacios.",
            "any.required": "El nombre completo es obligatorio.",
        }),
    rutAutorSubida: joi.string()
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
    autores: joi.array()
        .required()
        .items(
            joi.string()
                .min(15)
                .max(50)
                .trim()
                .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
                .messages({
                    "string.base": "El nombre completo debe ser de tipo string.",
                    "string.empty": "El nombre completo no puede estar vacío.",
                    "string.min": "El nombre completo debe tener como mínimo 15 caracteres.",
                    "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
                    "string.pattern.base": "El nombre completo solo puede contener letras y espacios.",
                    "any.required": "El nombre completo es obligatorio.",
                }),
        )
        .min(1)
        .max(10)
        .messages({
            'array.empty': 'El campo autores no puede estar vacío',
            'array.base': 'Los autores deben ser un arreglo',
            'array.min': 'Debe haber al menos un autor',
            'array.max': 'Debe haber como máximo 10 autores',
            'any.required': 'El campo autores es obligatorio',
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
        .trim()
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
        .custom((value, helpers) => {
            const diaActual = obtenerDiaActual();
            if (value !== diaActual) {
                return helpers.message(`La fecha debe ser exactamente hoy: ${diaActual}.`);
            }
            return value;
        })
        .messages({
            "string.empty": "La fecha no puede estar vacía.",
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",

            "any.required": "La fecha es obligatoria."
        }),
    tipoApunte: joi.string()
        .required()
        .trim()
        .valid('Manuscrito', 'Documento tipeado', 'Resumen conceptual', 'Mapa mental', 'Diagrama y/o esquema',
            'Resolucion de ejercicio(s)', 'Flashcard', 'Formulario', 'Presentacion', 'Guia de ejercicios', 'Otro')
        .messages({
            "string.empty": "El tipo de apunte no puede estar vacío.",
            "string.base": "El tipo de apunte debe ser de tipo string.",
            "any.only": "El tipo de apunte debe ser uno de los siguientes: Manuscrito, Documento tipeado, Resumen conceptual, Mapa mental, Diagrama y/o esquema, Resolucion de ejercicios, Flashcard, Formulario, Presentacion, Guia de ejercicios u Otro.",
            "any.required": "El tipo de apunte es obligatorio."
        }),
    etiquetas: joi.array()
        .required()
        .items(
            joi.string()
                .lowercase()
                .min(6)
                .max(30)
                .trim()
                .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
                .messages({
                    "string.base": "La etiqueta debe ser de tipo string.",
                    "string.empty": "La etiqueta no puede estar vacía.",
                    "string.min": "La etiqueta debe tener como mínimo 6 caracteres.",
                    "string.max": "La etiqueta debe tener como máximo 30 caracteres.",
                    "string.pattern.base": "La etiqueta solo puede contener letras y espacios.",
                    "any.required": "La etiqueta es obligatoria.",
                }),
        )
        .min(1)
        .max(5)
        .messages({
            'array.empty': 'El campo etiquetas no puede estar vacío',
            'array.base': 'Las etiquetas deben ser un arreglo',
            'array.min': 'Debe haber al menos una etiqueta',
            'array.max': 'Debe haber como máximo 5 etiquetas',
            'any.required': 'El campo etiquetas es obligatorio',
        }),

})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos obligatorios: nombre, autorSubida, autores, descripcion, asignatura, fechaSubida, tipoApunte y etiquetas',
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
        .custom((value, helpers) => {
            const diaActual = obtenerDiaActual();
            if (value !== diaActual) {
                return helpers.message(`La fecha debe ser exactamente hoy: ${diaActual}.`);
            }
            return value;
        })
        .messages({
            "string.base": "La fecha debe ser de tipo string.",
            "string.pattern.base": "La fecha debe tener el formato DD-MM-AAAA.",

        }),
    tipoApunte: joi.string()
        .valid('Manuscrito', 'Documento tipeado', 'Resumen conceptual', 'Mapa mental', 'Diagrama y/o esquema',
            'Resolucion de ejercicio(s)', 'Flashcard', 'Formulario', 'Presentacion', 'Guia de ejercicios', 'Otro')
        .messages({
            "string.base": "El tipo de apunte debe ser de tipo string.",
            "any.only": "El tipo de apunte debe ser uno de los siguientes: Manuscrito, Documento tipeado, Resumen conceptual, Mapa mental, Diagrama y/o esquema, Resolucion de ejercicios, Flashcard, Formulario, Presentacion, Guia de ejercicios u Otro.",
        }),
    etiquetas: joi.array()
        .items(
            joi.string()
                .lowercase()
                .min(6)
                .max(30)
                .trim()
                .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
                .messages({
                    "string.base": "La etiqueta debe ser de tipo string.",
                    "string.empty": "La etiqueta no puede estar vacía.",
                    "string.min": "La etiqueta debe tener como mínimo 6 caracteres.",
                    "string.max": "La etiqueta debe tener como máximo 30 caracteres.",
                    "string.pattern.base": "La etiqueta solo puede contener letras y espacios.",
                    "any.required": "La etiqueta es obligatoria.",
                }),
        )
        .min(1)
        .max(5)
        .messages({
            'array.base': 'Las etiquetas deben ser un arreglo',
            'array.min': 'Debe haber al menos una etiqueta',
            'array.max': 'Debe haber como máximo 5 etiquetas',
        }),
    valoracion: joi.number()
        .min(1)
        .max(7)
        .integer()
        .messages({
            'number.base': 'La valoracion debe ser un número',
            'number.min': 'La valoracion debe ser al menos 1',
            'number.max': 'La valoracion no puede ser más de 7',
            'number.integer': 'La valoracion debe ser un número entero',
        }),
    visualizacion: joi.number()
        .valid(1)
        .integer()
        .messages({
            'number.base': 'Las visualizaciones deben ser un número',
            'any.only': 'Para incrementar las visualizaciones, el valor debe ser 1',
            'number.integer': 'Las visualizaciones deben ser un número entero',
        }),
})
    .or("nombre", "descripcion", "asignatura", "fechaSubida", "tipoApunte", "valoracion", "visualizacion")
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar al menos uno de los campos: nombre, descripcion, asignatura, fechaSubida, tipoApunte, valoracion o visualizacion',
    });

export const visualizacionValidation = joi.object({
    _id: joi.string()
        .required()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .messages({
            "string.base": "El ID del reporte debe ser de tipo string.",
            "string.empty": "El ID del reporte no puede estar vacío.",
            "string.pattern.base": "El ID del reporte debe ser un ObjectId válido de MongoDB.",
            "any.required": "El ID del reporte es obligatorio.",
        }),
    rutUsuario: joi.string()
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
})
    .or("rutUsuario")
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar el campo obligatorio: _id',
    });

export const valoracionValidation = joi.object({
    rutUserValoracion: joi.string()
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
    valoracion: joi.number()
        .required()
        .min(1)
        .max(7)
        .integer()
        .messages({
            'number.base': 'La valoracion debe ser un número',
            'number.empty': 'La valoracion no puede estar vacía',
            'number.min': 'La valoracion debe ser al menos 1',
            'number.max': 'La valoracion no puede ser más de 7',
            'number.integer': 'La valoracion debe ser un número entero',
            'any.required': 'La valoracion es obligatoria',
        }),
});