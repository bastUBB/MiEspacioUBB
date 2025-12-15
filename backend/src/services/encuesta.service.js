import Encuesta from '../models/encuesta.model.js';
import User from '../models/user.model.js';
import perfilAcademico from "../models/perfilAcademico.model.js";
import {
    registrarCreateEncuestaService,
    registrarUpdateEncuestaService,
    registrarDeleteEncuestaService,
} from '../services/historial.service.js';

export async function crearEncuestaService(dataEncuesta) {
    try {
        const { rutAutor: rutAutorEncuesta } = dataEncuesta;

        const autorExist = await User.findOne({ rut: rutAutorEncuesta });

        if (!autorExist) return [null, 'El autor de la encuesta que desea crear no existe'];

        const encuestaExist = await Encuesta.findOne({ enlaceGoogleForm: dataEncuesta.enlaceGoogleForm });

        if (encuestaExist) return [null, 'La encuesta que desea crear ya existe'];

        const nuevaEncuesta = new Encuesta(dataEncuesta);

        await nuevaEncuesta.save();

        // Agregar la encuesta al perfil académico si existe
        const perfilAutor = await perfilAcademico.findOne({ rutUser: rutAutorEncuesta });
        if (perfilAutor) {
            if (!perfilAutor.encuestas) {
                perfilAutor.encuestas = [];
            }
            perfilAutor.encuestas.push(nuevaEncuesta._id);
            await perfilAutor.save();
        }

        // Registrar en historial (opcional, no bloquea la creación)
        try {
            await registrarCreateEncuestaService(rutAutorEncuesta, nuevaEncuesta._id);
        } catch (historialError) {
            console.warn('Error al registrar historial de encuesta:', historialError.message);
        }

        return [nuevaEncuesta, null];
    } catch (error) {
        console.error('Error al crear la encuesta:', error);
        return [null, `Error interno del servidor: ${error.message}`];
    }
}

export async function actualizarEncuestaService(encuestaId, dataUpdate) {
    try {
        const encuestaExist = await Encuesta.findById(encuestaId);

        if (!encuestaExist) return [null, 'Encuesta no encontrada'];

        if (encuestaExist.rutAutor !== dataUpdate.rutAutor) return [null, 'No tienes permiso para actualizar esta encuesta'];

        const encuestaActualizada = await Encuesta.findByIdAndUpdate(encuestaId, dataUpdate, { new: true });

        await encuestaActualizada.save();

        const [historialAutor, errorHistorialAutor] = await registrarUpdateEncuestaService(rutAutorEncuesta, encuestaActualizada._id);

        if (errorHistorialAutor) return [null, errorHistorialAutor];

        return [encuestaActualizada, null];
    } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
        return [null, 'Error interno del servidor'];
    }
}

//para usuario normal
export async function eliminarEncuestaService(encuestaId, rutUsuario) {
    try {
        const encuestaExist = await Encuesta.findById(encuestaId);

        if (!encuestaExist) return [null, 'Encuesta no encontrada'];

        const perfilAcademicoUsuario = await perfilAcademico.findOne({ rutUser: rutUsuario });

        if (!perfilAcademicoUsuario) return [null, 'Perfil académico no encontrado'];

        const encuestaPertenecePerfilAcademico = perfilAcademicoUsuario.encuestasCreadas.includes(encuestaId);

        if (!encuestaPertenecePerfilAcademico) return [null, 'No tienes permiso para eliminar esta encuesta'];

        await Encuesta.findByIdAndDelete(encuestaId);

        perfilAcademicoUsuario.encuestasCreadas.pull(encuestaId);

        await perfilAcademicoUsuario.save();

        const [historialAutor, errorHistorialAutor] = await registrarDeleteEncuestaService(rutAutorEncuesta, encuestaId);

        if (errorHistorialAutor) return [null, errorHistorialAutor];

        return [null, null];
    } catch (error) {
        console.error('Error al eliminar la encuesta:', error);
        return [null, 'Error interno del servidor'];
    }
}

//para todos
export async function obtenerTodasEncuestasActivasService() {
    try {
        const encuestasActivas = await Encuesta.find({ estado: 'Activo' }).sort({ createdAt: 1 });

        if (!encuestasActivas || encuestasActivas.length === 0) return [[], "No hay encuestas activas"];

        return [encuestasActivas, null];
    } catch (error) {
        console.error('Error al obtener las encuestas activas:', error);
        return [null, 'Error interno del servidor'];
    }
}

//para admin
export async function obtenerTodasEncuestasService() {
    try {
        const encuestas = await Encuesta.find().sort({ createdAt: -1 });

        if (!encuestas || encuestas.length === 0) return [[], "No hay encuestas registradas"];

        return [encuestas, null];
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerEncuestaPorIdService(encuestaId) {
    try {
        const encuesta = await Encuesta.findById(encuestaId);

        if (!encuesta) return [null, 'Encuesta no encontrada'];

        return [encuesta, null];
    } catch (error) {
        console.error('Error al obtener la encuesta:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerMisEncuestasService(perfilAcademicoID) {
    try {
        const perfilAcademicoExist = await perfilAcademico.findById(perfilAcademicoID);

        if (!perfilAcademicoExist) return [null, 'Perfil académico no encontrado'];

        const encuestasPerfilAcademico = perfilAcademicoExist.encuestas.sort({ createdAt: -1 });

        if (!encuestasPerfilAcademico || encuestasPerfilAcademico.length === 0) return [[], "No tienes encuestas registradas"];

        return [encuestasPerfilAcademico, null];
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerEncuestasPorRutService(rutAutor) {
    try {
        // Buscar el perfil académico del usuario
        const perfilAutor = await perfilAcademico.findOne({ rutUser: rutAutor }).populate('encuestas');

        if (!perfilAutor) return [[], "Perfil académico no encontrado"];

        const encuestas = perfilAutor.encuestas || [];

        if (encuestas.length === 0) return [[], "No tienes encuestas registradas"];

        return [encuestas, null];
    } catch (error) {
        console.error('Error al obtener las encuestas por rut:', error);
        return [null, 'Error interno del servidor'];
    }
}

