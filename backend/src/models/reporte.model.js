import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
    rutUsuarioReportado: {
        type: String,
        required: true,
        cast: false
    },
    rutUsuarioReporte: {
        type: String,
        required: true,
        cast: false
    },
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
    estado: {// Pendiente, Resuelto
        type: String,
        default: 'Pendiente',
        cast: false
    },
    resolucion: {
        type: String,
        cast: false
    },
    apunteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apunte',
    }
}, {
    versionKey: false,
    strict: true
});

const Reporte = mongoose.model('Reporte', reporteSchema);
export default Reporte;