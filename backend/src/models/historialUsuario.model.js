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