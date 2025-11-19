import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema({
    rutAutor: {
        type: String,
        required: true,
        cast: false
    },
    comentario: {
        type: String,
        required: true,
        cast: false
    },
    fechaComentario: {
        type: String,
        required: true,
        cast: false
    },
    Likes:  {
        type: Number,
        cast: false
    },
    Dislikes: {
        type: Number,
        cast: false
    },
    respuestas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario',
        cast: false
    }],
    reportes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reporte',
        cast: false
    }]
}, {
    versionKey: false,
    strict: true
});

const Comentario = mongoose.model('Comentario', comentarioSchema);
export default Comentario;