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
    rutAutorSubida: {
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
    valoracion: [{
        cantidadValoraciones: {
            type: Number,
            cast: false,
            default: 0
        },
        promedioValoracion: {
            type: Number,
            cast: false,
            default: 0
        }
    }],
    visualizaciones: {
        type: Number,
        cast: false,
        default: 0
    },
    etiquetas: [{
        type: String,
        cast: false
    }],
    archivo: {
        nombreOriginal: {
            type: String,
            required: true,
        },
        nombreArchivo: {
            type: String,
            required: true,
        },
        rutaCompleta: {
            type: String,
            required: true,
        },
        tamano: {
            type: Number,
            required: true,
        },
        tipoMime: {
            type: String,
            required: true,
        },
        bucket: {
            type: String,
            required: true,
        },
        objectName: {
            type: String,
            required: true,
        },
    }, 
    reportes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reporte',
        cast: false
    }],
    estado: { //Activo, Bajo Revisión, Suspendido (aún en BD pero no visible para usuarios)
        type: String,
        default: 'Activo',
        cast: false
    },
    comentarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario',
        cast: false
    }],
}, {
    versionKey: false,
    strict: true
});

const Apunte = mongoose.model('Apunte', apunteSchema);
export default Apunte;


//TODO: Falta agregar campo: comentarios, descargas