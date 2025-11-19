import mongoose from "mongoose";

const historialUsuario = new mongoose.Schema({
    rutUser: {
        type: String,
        required: true,
        unique: true,
        cast: false
    },
    acciones: [{
        tipoAccion: {
            type: String, //subida apunte, descarga apunte, realizar comentario, responder comentario, creacion perfil academico, valorar apunte, 
            cast: false
        },
        fechaAccion: {
            type: String,
            required: true,
            cast: false
        }
    }],
}, {
    versionKey: false,
    strict: true
});

const HistorialUsuario = mongoose.model('HistorialUsuario', historialUsuario);
export default HistorialUsuario;