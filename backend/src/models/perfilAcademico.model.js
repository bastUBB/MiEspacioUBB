import mongoose from "mongoose";

const perfilAcademicoSchema = mongoose.Schema({
    rutUser: {
        type: String,
        required: true,
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
    //TODO: Ver si es mejor dejar las notas como un modelo aparte
    // notasRecientes: [{
    //     asignatura: {
    //         type: String,
    //         required: true,
    //         cast: false
    //     },
    //     nota: {
    //         type: Number,
    //         required: true,
    //         cast: false
    //     }
    // }],
    tipoApuntesPreferido: {
        type: String,
        required: true,
        cast: false
    }
    //TODO: Ver cómo guardare los apuntes subidos por los usuarios (me imagino que almacenaré los _id's)
    // apuntesSubidos: [{
    //     type: String,
    //     required: true,
    //     cast: false
    // }]
}, {
    timestamps: true,
    versionKey: false,
    strict: true
});

const perfilAcademico = mongoose.model('perfilAcademico', perfilAcademicoSchema);
export default perfilAcademico;