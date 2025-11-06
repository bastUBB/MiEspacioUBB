import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
    motivo: {
        type: String,
        required: true,
        cast: false
    },
    descripcion: {
        type: String,
        required: true,
        cast: false
    },
    fecha: {
        type: String,
        required: true,
        cast: false
    },
    estado: {
        type: String,
        cast: false
    },
    resolucion: {
        type: String,
        cast: false
    }
}, {
    versionKey: false,
    strict: true
});

const Reporte = mongoose.model('Reporte', reporteSchema);
export default Reporte;