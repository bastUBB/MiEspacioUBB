import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    nombreCompleto: {
        type: String,
        required: true,
        cast: false
    },
    rut: {
        type: String,
        required: true,
        unique: true,
        cast: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        cast: false
    },
    password: {
        type: String,
        required: true,
        cast: false
    },
    role: {
        type: String,
        required: true,
        cast: false
    },
    isVerified: {
        type: Boolean,
        default: false,
        cast: false
    },
    verificationToken: {
        type: String,
        cast: false
    },
    verificationTokenExpires: {
        type: Date,
        cast: false
    },
    notificaciones: [{ //TODO: que luego de un tiempo se vayan borrando las notificaciones leidas
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notificacion',
        cast: false
    }],
    reportes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reporte',
        cast: false
    }],
    estado: { // activo, suspendido para subir apuntes e interactuar, baneado (aqui usar correo)
        type: String,
        cast: false
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: true
});

const User = mongoose.model('User', userSchema);
export default User;