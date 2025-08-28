import perfilAcademico from "../models/perfilAcademico.model.js";
import User from "../models/user.model.js";
import Asignatura from "../models/asignatura.model.js";

export async function createPerfilAcademicoService(dataPerfilAcademico) {
    try {
        const { rutUser, asignaturasInteres } = dataPerfilAcademico;

        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const asignaturasInteresExist = await Asignatura.find({ nombre: { $in: asignaturasInteres } });

        if (!asignaturasInteresExist || asignaturasInteresExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        const newPerfilAcademico = new perfilAcademico({
            rutUser,
            asignaturasInteres: asignaturasInteresExist.map(asignatura => asignatura.nombre)
        });

        await newPerfilAcademico.save();

        return [newPerfilAcademico, null];
    } catch (error) {
        console.error('Error al crear el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function getPerfilAcademicoService(query) {
    try {
        const { rutUser: rutUserQuery } = query;

        const userExist = await User.findOne({ rut: rutUserQuery });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutUserQuery });

        if (!perfil) return [null, 'No existe un perfil académico para el usuario proporcionado'];

        return [perfil, null];
    } catch (error) {
        console.error('Error al obtener el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function updatePerfilAcademicoService(query, body) {
    try {
        const { rutUser: rutUserQuery } = query;

        const userExist = await User.findOne({ rut: rutUserQuery });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const { asignaturasInteres } = body;

        const asignaturasExist = await Asignatura.find({ nombre: { $in: asignaturasInteres } });

        if (!asignaturasExist || asignaturasExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutUserQuery });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        const perfilUpdated = await perfilAcademico.findOneAndUpdate(
            perfil._id,
            body,
            { new: true }
        );

        return [perfilUpdated, null];
    } catch (error) {
        console.error('Error al actualizar el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function deletePerfilAcademicoService(query) {
    try {
        const { rutUser: rutUserQuery } = query;

        const userExist = await User.findOne({ rut: rutUserQuery });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutUserQuery });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        const perfilDeleted = await perfilAcademico.deleteOne({ _id: perfil._id });

        return [perfilDeleted, null];
    } catch (error) {
        console.error('Error al eliminar el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}