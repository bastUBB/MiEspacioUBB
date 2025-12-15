import mongoose from "mongoose";

const encuestaSchema = new mongoose.Schema({
    nombreEncuesta: {
        type: String,
        required: true,
        cast: false
    },
    descripcion: {
        type: String,
        required: true,
        cast: false
    },
    enlaceGoogleForm: {
        type: String,
        required: true,
        cast: false
    },
    estado: {
        type: String,
        default: 'Activo',
        cast: false
    },
    visualizaciones: {
        type: Number,
        default: 0,
        cast: false
    }
}, {
    versionKey: false,
    strict: true,
    timestamps: true
});

const Encuesta = mongoose.model('Encuesta', encuestaSchema);
export default Encuesta;
