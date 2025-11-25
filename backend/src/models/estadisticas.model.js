import mongoose from "mongoose";

const estadisticaSchema = mongoose.Schema({
    mayoresContribuidores: [{
        tipo: String,
        cast: false
    }],
    apuntesMasVisualizados: [{
        tipo: String,
        cast: false
    }],
    apuntesMejorValorados: [{
        tipo: String,
        cast: false
    }],
    apuntesMasVisualizados: [{
        tipo: String,
        cast: false
    }],
    asignaturaConMasApuntes: {
        tipo: String,
        cast: false
    },
    numeroTotalApuntes: {
        type: Number,
        cast: false
    },
    numeroTotalUsuarios: {
        type: Number,
        cast: false
    },
    numeroApuntesSubidos: {
        type: Number,
        cast: false
    },
    numeroComentarios: {
        type: Number,
        cast: false
    },
    numeroUsuariosCreados: {
        type: Number,
        cast: false
    },
    numeroPerfilesAcademicosCreados: {
        type: Number,
        cast: false
    },
    numeroApuntesValorados: {
        type: Number,
        cast: false
    },
}, {
    versionKey: false,
    strict: true
});

const Estadisticas = mongoose.model('Estadisticas', estadisticaSchema);
export default Estadisticas;

/*
1. mayores contribuidores
2. apuntes mas visualizados (10)
3. apuntes mejor valorados (10)
4. apuntes mas visualizados (10)
5. asignatura con mas cantidad de apuntes 
6. numero total de apuntes
7. numero total de usuarios
*/
