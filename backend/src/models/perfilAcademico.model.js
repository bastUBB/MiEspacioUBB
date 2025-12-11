import mongoose from "mongoose";

const perfilAcademicoSchema = mongoose.Schema({
    rutUser: {
        type: String,
        required: true,
        unique: true,
        cast: false
    },
    asignaturasCursantes: [{
        type: String,
        cast: false,
    }],
    //Para ayudantes o docentes
    asignaturasImpartidasActuales: [{
        type: String,
        cast: false,
    }],
    informeCurricular: [{
        asignatura: {
            type: String,
            required: true,
            cast: false
        },
        evaluaciones: [{
            tipoEvaluacion: {
                type: String,
                cast: false
            },
            nota: {
                type: Number,
                cast: false
            },
            porcentaje: {
                type: Number,
                cast: false
            }
        }],
        ordenComplejidad: {
            type: Number,
            cast: false
        }
    }],
    asignaturasInteres: [{
        type: String,
        cast: false,
    }],
    metodosEstudiosPreferidos: [{
        type: String,
        cast: false
    }],
    apuntesSubidos: {
        type: Number,
        cast: false,
        default: 0
    },
    valoracionPromedioApuntes: {
        type: Number,
        cast: false,
        default: 0
    },
    apuntesDescargados: {
        type: Number,
        cast: false,
        default: 0
    },
    popularidad: {
        type: Number,
        cast: false,
        default: 0
    },
    apuntesIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apunte',
        cast: false
    }],
    apuntesValorados: [{
        apunteID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Apunte',
            cast: false
        },
        valoracion: {
            type: Number,
            cast: false
        }
    }],
    encuestas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Encuesta',
        cast: false
    }]
}, {
    versionKey: false,
    strict: true
});

const perfilAcademico = mongoose.model('perfilAcademico', perfilAcademicoSchema);
export default perfilAcademico;