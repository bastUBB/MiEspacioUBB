import mongoose from "mongoose";

const historialUsuario = new mongoose.Schema({
   
}, {
    versionKey: false,
    strict: true
});

const HistorialUsuario = mongoose.model('HistorialUsuario', historialUsuario);
export default HistorialUsuario;