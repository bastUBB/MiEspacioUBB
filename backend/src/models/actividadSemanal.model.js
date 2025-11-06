import mongoose from "mongoose";

const actividadSemanalSchema = new mongoose.Schema({
    numeroApuntesSubidos: {
        type: Number,
        required: true,
        cast: false
    },
    numeroComentarios: {
        type: Number,
        required: true,
        cast: false
    },
    numeroUsuariosCreados: {
        type: Number,
        required: true,
        cast: false
    },
    numeroPerfilesAcademicosCreados: {
        type: Number,
        required: true,
        cast: false
    },
    fechaInicioSemana: {
        type: String,
        required: true,
        cast: false
    },
    fechaFinSemana: {
        type: String,
        required: true,
        cast: false
    }
}, {
    versionKey: false,
    strict: true
});

const ActividadSemanal = mongoose.model('ActividadSemanal', actividadSemanalSchema);
export default ActividadSemanal;