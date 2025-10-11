import mongoose from "mongoose";

const perfilAcademicoSchema = mongoose.Schema({
    rutUser: {
        type: String,
        required: true,
        unique: true,
        cast: false
    },
    //TODO: Las asignaturas de interes serán: Asignaturas del semestre actual del usuario + (opcional) Asignaturas de interes
    asignaturasInteres: [{
        type: String,
        cast: false,
        required: true
    }],
    semestreActual: {
        type: Number,
        required: true,
        cast: false
    },
    tipoApuntesPreferido: {
        type: String,
        required: true,
        cast: false
    },
    //TODO: Ver si es mejor dejar las notas como un modelo aparte
    apuntesSubidos: {
        type: Number,
        cast: false
    },
    valoracionPerfil: {
        type: Number,
        cast: false
    },
    apuntesDescargados: {
        type: Number,
        cast: false
    },
    //TODO: Pensar bien en un sistema completo de reputacion
    reputacion: {
        type: Number,
        cast: false
    },
    apuntesIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apunte',
        cast: false,
        unique: true
    }]
}, {
    timestamps: true,
    versionKey: false,
    strict: true
});

const perfilAcademico = mongoose.model('perfilAcademico', perfilAcademicoSchema);
export default perfilAcademico;