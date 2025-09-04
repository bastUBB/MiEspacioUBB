import mongoose from "mongoose";

const apunteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        cast: false
    },
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
    //TODO: Añadir cuando se implemente MinIO
    // archivo: {
        
    // }
}, {
    timestamps: true,
    versionKey: false,
    strict: true
});

const Apunte = mongoose.model('Apunte', apunteSchema);
export default Apunte;