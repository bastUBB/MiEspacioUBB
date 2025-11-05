import mongoose from "mongoose";

const reporteApunteSchema = new mongoose.Schema({
    reporte: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reporte',
        required: true
    },
    apunte: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apunte',
        required: true
    }
}, {
    versionKey: false,
    strict: true
});

const ReporteApunte = mongoose.model('ReporteApunte', reporteApunteSchema);
export default ReporteApunte;