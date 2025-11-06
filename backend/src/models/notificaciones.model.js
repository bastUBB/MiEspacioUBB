import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
    tipoNotificacion: {
        type: String, //comentario hacia un apunte, valorizacion a un apunte, apunte compartido
    },
    mensaje: {
        type: String,
    }
}, {
    versionKey: false,
    strict: true
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
export default Notificacion;