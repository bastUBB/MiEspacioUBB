import mongoose from "mongoose";

const historialUsuario = new mongoose.Schema({
    rutUser: {
        type: String,
        required: true,
        unique: true,
        cast: false
    },
    acciones: [{
        //subida apunte, descarga apunte, realizar comentario, responder comentario, creacion perfil academico, valorar apunte, 
        // editar campos de perfil de usuario, editar campos de perfil academico

        tipoAccion: {
            type: String,  
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