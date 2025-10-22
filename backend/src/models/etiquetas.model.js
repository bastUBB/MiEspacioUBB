import mongoose from "mongoose";

const etiquetaSchema = new mongoose.Schema({
    
}, {
    versionKey: false,
    strict: true
});

const Etiqueta = mongoose.model('Etiqueta', etiquetaSchema);
export default Etiqueta;