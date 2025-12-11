import joi from "joi";
import { isValidObjectId } from "../helpers/customIdMongo.helper.js";

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
        'object.missing': 'Debe proporcionar al menos uno de los campos: rutUser',
    });

export const perfilAcademicoCreateEstudianteValidation = joi.object({
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
    asignaturasCursantes: joi.array()
        .items(
            joi.string()
                .required()
                .min(7)
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
    informeCurricular: joi.array()
        .items(
            joi.object({
                asignatura: joi.string()
                    .required()
                    .min(7)
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
                evaluaciones: joi.array()
                    .items(
                        joi.object({
                            tipoEvaluacion: joi.string()
                                .trim()
                                .messages({
                                    'string.base': 'El tipo de evaluación debe ser una cadena de texto',
                                }),
                            nota: joi.number()
                                .min(1)
                                .max(7)
                                .messages({
                                    'number.base': 'La nota debe ser un número',
                                    'number.min': 'La nota debe ser al menos 1',
                                    'number.max': 'La nota no puede ser más de 7',
                                }),
                            porcentaje: joi.number()
                                .min(0)
                                .max(100)
                                .messages({
                                    'number.base': 'El porcentaje debe ser un número',
                                    'number.min': 'El porcentaje debe ser al menos 0',
                                    'number.max': 'El porcentaje no puede ser más de 100',
                                }),
                        })
                    )
                    .messages({
                        'array.base': 'Las evaluaciones deben ser un arreglo',
                    }),
                ordenComplejidad: joi.number()
                    .min(1)
                    .max(10)
                    .messages({
                        'number.base': 'El orden de complejidad debe ser un número',
                        'number.min': 'El orden de complejidad debe ser al menos 1',
                        'number.max': 'El orden de complejidad no puede ser más de 10',
                    }),
            })
                .xor('evaluaciones', 'ordenComplejidad')
                .messages({
                    'object.xor': 'Debe incluir solo "evaluaciones" u "ordenComplejidad", pero no ambos.',
                })
        )
        .required()
        .min(1)
        .messages({
            'array.base': 'El informe curricular debe ser un arreglo',
            'array.min': 'Debe haber al menos un informe curricular',
            'array.required': 'El informe curricular es obligatorio',
        }),
    asignaturasInteres: joi.array()
        .items(
            joi.string()
                .required()
                .min(7)
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
        .max(55)
        .messages({
            'array.base': 'Las asignaturas de interés deben ser un arreglo',
            'array.max': 'No puede haber más de 55 asignaturas de interés',
        }),
    metodosEstudiosPreferidos: joi.array()
        .items(
            joi.string()
                .trim()
                .valid('Manuscritos', 'Documentos tipeados', 'Resúmenes conceptuales', 'Mapas mentales', 'Diagramas y esquemas',
                    'Resolución de ejercicios', 'Flashcards', 'Formularios', 'Presentaciones', 'Ninguno', 'Otros')
                .messages({
                    'string.base': 'El tipo de apuntes preferido debe ser una cadena de texto',
                    'any.only': 'El tipo de apuntes preferido debe ser uno de los siguientes: Manuscritos, Documentos tipeados, Resúmenes conceptuales, Mapas mentales, Diagramas y esquemas, Resolución de ejercicios, Flashcards, Formularios, Presentaciones, Ninguno, Otros',
                })
        )
        .required()
        .min(1)
        .messages({
            'array.base': 'Los tipos de apuntes preferidos deben ser un arreglo',
            'array.min': 'Debe haber al menos un tipo de apunte preferido',
            'array.required': 'Los tipos de apuntes preferidos son obligatorios',
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: rutUser, asignaturasInteres, semestreActual y metodosEstudiosPreferidos',
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
    asignaturasCursantes: joi.array()
        .items(
            joi.string()
                .min(7)
                .max(50)
                .strict()
                .trim()
                .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\.\-\d\,]+$/)
                .messages({
                    'string.base': 'El nombre de la asignatura debe ser una cadena de texto',
                    'string.min': 'El nombre de la asignatura debe tener al menos 7 caracteres',
                    'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
                    'string.pattern.base': 'El nombre de la asignatura solo puede contener letras, números, puntos, guiones, comas y espacios',
                }),
        )
        .min(0)
        .max(55)
        .messages({
            'array.base': 'Las asignaturas cursantes deben ser un arreglo',
            'array.max': 'No puede haber más de 55 asignaturas cursantes',
        }),
    asignaturasInteres: joi.array()
        .items(
            joi.string()
                .min(7)
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
    apuntesSubidos: joi.number()
        .default(0)
        .min(0)
        .messages({
            'number.base': 'El número de apuntes subidos debe ser un número',
            'number.min': 'El número de apuntes subidos no puede ser negativo',
        }),
    informeCurricular: joi.array()
        .items(
            joi.object({
                asignatura: joi.string()
                    .min(7)
                    .max(50)
                    .trim()
                    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\.\-\d\,]+$/)
                    .messages({
                        'string.base': 'El nombre de la asignatura debe ser una cadena de texto',
                        'string.min': 'El nombre de la asignatura debe tener al menos 10 caracteres',
                        'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
                        'string.pattern.base': 'El nombre de la asignatura solo puede contener letras, números, puntos, guiones, comas y espacios',
                    }),
                evaluaciones: joi.array()
                    .items(
                        joi.object({
                            tipoEvaluacion: joi.string()
                                .trim()
                                .messages({
                                    'string.base': 'El tipo de evaluación debe ser una cadena de texto',
                                }),
                            nota: joi.number()
                                .min(1)
                                .max(7)
                                .messages({
                                    'number.base': 'La nota debe ser un número',
                                    'number.min': 'La nota debe ser al menos 1',
                                    'number.max': 'La nota no puede ser más de 7',
                                }),
                            porcentaje: joi.number()
                                .min(0)
                                .max(100)
                                .messages({
                                    'number.base': 'El porcentaje debe ser un número',
                                    'number.min': 'El porcentaje debe ser al menos 0',
                                    'number.max': 'El porcentaje no puede ser más de 100',
                                }),
                        })
                    )
                    .messages({
                        'array.base': 'Las evaluaciones deben ser un arreglo',
                    }),
                ordenComplejidad: joi.number()
                    .min(1)
                    .max(10)
                    .messages({
                        'number.base': 'El orden de complejidad debe ser un número',
                        'number.min': 'El orden de complejidad debe ser al menos 1',
                        'number.max': 'El orden de complejidad no puede ser más de 10',
                    }),
            })
                .xor('evaluaciones', 'ordenComplejidad')
                .messages({
                    'object.xor': 'Debe incluir solo "evaluaciones" u "ordenComplejidad", pero no ambos.',
                })
        )
        .min(1)
        .messages({
            'array.base': 'El informe curricular debe ser un arreglo',
            'array.min': 'Debe haber al menos un informe curricular',
        }),
    apuntesDescargados: joi.number()
        .default(0)
        .min(0)
        .messages({
            'number.base': 'El número de apuntes descargados debe ser un número',
            'number.min': 'El número de apuntes descargados no puede ser negativo',
        }),
    popularidad: joi.number()
        .default(0)
        .min(0)
        .messages({
            'number.base': 'La popularidad debe ser un número',
            'number.min': 'La popularidad no puede ser negativa',
        }),
    valoracionPerfil: joi.number()
        .default(0)
        .min(0)
        .max(5)
        .messages({
            'number.base': 'La valoración del perfil debe ser un número',
            'number.min': 'La valoración del perfil no puede ser negativa',
        }),
    metodosEstudiosPreferidos: joi.array()
        .items(
            joi.string()
                .trim()
                .valid('Manuscritos', 'Documentos tipeados', 'Resúmenes conceptuales', 'Mapas mentales', 'Diagramas y esquemas',
                    'Resolución de ejercicios', 'Flashcards', 'Formularios', 'Presentaciones', 'Ninguno', 'Otros')
                .messages({
                    'string.base': 'El tipo de apuntes preferido debe ser una cadena de texto',
                    'any.only': 'El tipo de apuntes preferido debe ser uno de los siguientes: Manuscritos, Documentos tipeados, Resúmenes conceptuales, Mapas mentales, Diagramas y esquemas, Resolución de ejercicios, Flashcards, Formularios, Presentaciones, Ninguno, Otros',
                })
        )
        .messages({
            'array.base': 'Los tipos de apuntes preferidos deben ser un arreglo',
        }),
    apuntesIDs: joi.array()
        .items(
            joi.string()
                .trim()
                .custom(isValidObjectId, "validación de ObjectId")
                .messages({
                    "string.base": "El ID del apunte debe ser una cadena.",
                    "any.invalid": "El ID del apunte no es un ObjectId válido de MongoDB.",
                })
        )
        .min(1)
        .messages({
            "array.base": "Los IDs de los apuntes deben enviarse como un arreglo.",
            "array.min": "Debe incluir al menos un ID de apunte.",
        })
})
    .or("rutUser", "asignaturasCursantes", "asignaturasInteres", "semestreActual", "apuntesSubidos", "apuntesDescargados", "informeCurricular", "popularidad", "metodosEstudiosPreferidos", "apuntesIDs")
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar al menos uno de los campos: rutUser, asignaturasCursantes, asignaturasInteres, semestreActual, apuntesSubidos, apuntesDescargados, informeCurricular, popularidad, metodosEstudiosPreferidos o apuntesIDs',
    });

export const busquedaApuntesValidation = joi.object({
    asignaturaApunteActual: joi.string()
        .required()
        .min(3)
        .trim()
        .max(50)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            'string.empty': 'El nombre de la asignatura no puede estar vacío',
            'string.base': 'El nombre de la asignatura debe ser de tipo string',
            'string.min': 'El nombre de la asignatura debe tener al menos 3 caracteres',
            'string.max': 'El nombre de la asignatura no puede tener más de 50 caracteres',
            'string.pattern.base': 'El nombre de la asignatura solo puede contener letras y espacios',
            'any.required': 'El nombre de la asignatura es obligatorio',
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en la consulta',
        'object.missing': 'Debe proporcionar el campo: asignaturaApunteActual',
    });

export const perfilAcademicoCreateDocenteValidation = joi.object({
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
    asignaturasImpartidasActuales: joi.array()
        .items(
            joi.string()
                .required()
                .min(7)
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
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: rutUser, asignaturasImpartidasActuales',
    });

export const perfilAcademicoCreateAyudanteValidation = joi.object({
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
    asignaturasCursantes: joi.array()
        .items(
            joi.string()
                .required()
                .min(7)
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
            'array.base': 'Las asignaturas cursantes deben ser un arreglo',
            'array.min': 'Debe haber al menos una asignatura cursante',
            'array.max': 'No puede haber más de 55 asignaturas cursantes',
            'array.required': 'Las asignaturas cursantes son obligatorias',
        }),
    asignaturasImpartidasActuales: joi.array()
        .items(
            joi.string()
                .required()
                .min(7)
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
            'array.base': 'Las asignaturas impartidas actuales deben ser un arreglo',
            'array.min': 'Debe haber al menos una asignatura impartida actual',
            'array.max': 'No puede haber más de 55 asignaturas impartidas actuales',
            'array.required': 'Las asignaturas impartidas actuales son obligatorias',
        }),
    informeCurricular: joi.array()
        .items(
            joi.object({
                asignatura: joi.string()
                    .required()
                    .min(7)
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
                evaluaciones: joi.array()
                    .items(
                        joi.object({
                            tipoEvaluacion: joi.string()
                                .trim()
                                .messages({
                                    'string.base': 'El tipo de evaluación debe ser una cadena de texto',
                                }),
                            nota: joi.number()
                                .min(1)
                                .max(7)
                                .messages({
                                    'number.base': 'La nota debe ser un número',
                                    'number.min': 'La nota debe ser al menos 1',
                                    'number.max': 'La nota no puede ser más de 7',
                                }),
                            porcentaje: joi.number()
                                .min(0)
                                .max(100)
                                .messages({
                                    'number.base': 'El porcentaje debe ser un número',
                                    'number.min': 'El porcentaje debe ser al menos 0',
                                    'number.max': 'El porcentaje no puede ser más de 100',
                                }),
                        })
                    )
                    .messages({
                        'array.base': 'Las evaluaciones deben ser un arreglo',
                    }),
                ordenComplejidad: joi.number()
                    .min(1)
                    .max(10)
                    .messages({
                        'number.base': 'El orden de complejidad debe ser un número',
                        'number.min': 'El orden de complejidad debe ser al menos 1',
                        'number.max': 'El orden de complejidad no puede ser más de 10',
                    }),
            })
                .xor('evaluaciones', 'ordenComplejidad')
                .messages({
                    'object.xor': 'Debe incluir solo "evaluaciones" u "ordenComplejidad", pero no ambos.',
                })
        )
        .required()
        .min(1)
        .messages({
            'array.base': 'El informe curricular debe ser un arreglo',
            'array.min': 'Debe haber al menos un informe curricular',
            'array.required': 'El informe curricular es obligatorio',
        }),
    asignaturasInteres: joi.array()
        .items(
            joi.string()
                .required()
                .min(7)
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
        .max(55)
        .messages({
            'array.base': 'Las asignaturas de interés deben ser un arreglo',
            'array.max': 'No puede haber más de 55 asignaturas de interés',
        }),
    metodosEstudiosPreferidos: joi.array()
        .items(
            joi.string()
                .trim()
                .valid('Manuscritos', 'Documentos tipeados', 'Resúmenes conceptuales', 'Mapas mentales', 'Diagramas y esquemas',
                    'Resolución de ejercicios', 'Flashcards', 'Formularios', 'Presentaciones', 'Ninguno', 'Otros')
                .messages({
                    'string.base': 'El tipo de apuntes preferido debe ser una cadena de texto',
                    'any.only': 'El tipo de apuntes preferido debe ser uno de los siguientes: Manuscritos, Documentos tipeados, Resúmenes conceptuales, Mapas mentales, Diagramas y esquemas, Resolución de ejercicios, Flashcards, Formularios, Presentaciones, Ninguno, Otros',
                })
        )
        .required()
        .min(1)
        .messages({
            'array.base': 'Los tipos de apuntes preferidos deben ser un arreglo',
            'array.min': 'Debe haber al menos un tipo de apunte preferido',
            'array.required': 'Los tipos de apuntes preferidos son obligatorios',
        }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'No se permiten propiedades adicionales en el cuerpo de la solicitud',
        'object.missing': 'Debe proporcionar todos los campos: rutUser, asignaturasCursantes, asignaturasImpartidas, informesCurriculares, asignaturasInteres y metodosEstudiosPreferidos',
    });
