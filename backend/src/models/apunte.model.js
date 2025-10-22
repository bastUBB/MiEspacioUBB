import mongoose from "mongoose";

const apunteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        cast: false
    },
    autorSubida: {
        type: String,
        required: true,
        cast: false
    },
    autores: [{
        type: String,
        cast: false
    }],
    descripcion: {
        type: String,
        required: true,
        cast: false
    },
    asignatura: {
        type: String,
        required: true,
        cast: false
    },
    fechaSubida: {
        type: String,
        required: true,
        cast: false
    },
    tipoApunte: {
        type: String,
        required: true,
        cast: false
    },
    valorizacion: {
        type: Number,
        cast: false
    },
    visualizaciones: {
        type: Number,
        cast: false
    },
    archivoEnlazado: {
        bucket: {
            type: String,
            required: true,
        },
        objectName: {
            type: String,
            required: true,
        },
    }
}, {
    versionKey: false,
    strict: true
});

const Apunte = mongoose.model('Apunte', apunteSchema);
export default Apunte;