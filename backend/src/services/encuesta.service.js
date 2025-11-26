import Encuesta from '../models/encuesta.model.js';

export async function crearEncuestaService(dataEncuesta) {
    try {
        const nuevaEncuesta = new Encuesta(dataEncuesta);
        await nuevaEncuesta.save();
        return [nuevaEncuesta, null];
    } catch (error) {
        console.error('Error al crear la encuesta:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerTodasEncuestasActivasService() {
    try {
        const encuestasActivas = await Encuesta.find({ estado: 'Activo' }).sort({ createdAt: -1 });

        if (!encuestasActivas || encuestasActivas.length === 0) {
            return [[], null];
        }

        return [encuestasActivas, null];
    } catch (error) {
        console.error('Error al obtener las encuestas activas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerTodasEncuestasService() {
    try {
        const encuestas = await Encuesta.find().sort({ createdAt: -1 });

        if (!encuestas || encuestas.length === 0) {
            return [[], null];
        }

        return [encuestas, null];
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerEncuestaPorIdService(encuestaId) {
    try {
        const encuesta = await Encuesta.findById(encuestaId);

        if (!encuesta) {
            return [null, 'Encuesta no encontrada'];
        }

        // Incrementar visualizaciones
        encuesta.visualizaciones += 1;
        await encuesta.save();

        return [encuesta, null];
    } catch (error) {
        console.error('Error al obtener la encuesta:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function actualizarEncuestaService(encuestaId, dataActualizar) {
    try {
        const encuesta = await Encuesta.findById(encuestaId);

        if (!encuesta) {
            return [null, 'Encuesta no encontrada'];
        }

        // Actualizar campos
        Object.keys(dataActualizar).forEach(key => {
            encuesta[key] = dataActualizar[key];
        });

        const encuestaActualizada = await encuesta.save();

        return [encuestaActualizada, null];
    } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function eliminarEncuestaService(encuestaId) {
    try {
        const encuesta = await Encuesta.findById(encuestaId);

        if (!encuesta) {
            return [null, 'Encuesta no encontrada'];
        }

        await Encuesta.findByIdAndDelete(encuestaId);

        return [{ message: 'Encuesta eliminada exitosamente' }, null];
    } catch (error) {
        console.error('Error al eliminar la encuesta:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerCantidadEncuestasService() {
    try {
        const cantidad = await Encuesta.countDocuments({ estado: 'Activo' });
        return [cantidad, null];
    } catch (error) {
        console.error('Error al obtener la cantidad de encuestas:', error);
        return [null, 'Error interno del servidor'];
    }
}
