import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
    tipoNotificacion: {
        type: String, //comentario hacia un apunte, valorizacion a un apunte, apunte compartido, reporte resuelto
        required: true,
        cast: false
    },
    mensaje: {
        type: String,
        required: true,
        cast: false
    },
    estadoLeido: {
        type: Boolean,
        default: false,
        cast: false
    },
}, {
    versionKey: false,
    strict: true
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
export default Notificacion;