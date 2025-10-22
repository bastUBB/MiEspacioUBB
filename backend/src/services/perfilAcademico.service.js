import perfilAcademico from "../models/perfilAcademico.model.js";
import User from "../models/user.model.js";
import Asignatura from "../models/asignatura.model.js";
import Apunte from "../models/apunte.model.js";

export async function createPerfilAcademicoService(dataPerfilAcademico) {
    try {
        const { rutUser, asignaturasCursantes, asignaturasInteres, informeCurricular } = dataPerfilAcademico;

        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const asignaturasCursantesExist = await Asignatura.find({ nombre: { $in: asignaturasCursantes } });

        if (!asignaturasCursantesExist || asignaturasCursantesExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        const asignaturasInteresExist = await Asignatura.find({ nombre: { $in: asignaturasInteres } });

        if (!asignaturasInteresExist || asignaturasInteresExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        //acceder a las asignaturas del informe curricular y verificar que existen
        for (const informe of informeCurricular) {
            const asignaturasInformeCurricular = await Asignatura.findOne({ nombre: informe.asignatura });

            if (!asignaturasInformeCurricular) return [null, `No existe la asignatura ${informe.asignatura} en el informe curricular`];
        }

        const newPerfilAcademico = new perfilAcademico({
            ...dataPerfilAcademico,
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
        const { rutUser } = query;

        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser });

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

        const perfil = await perfilAcademico.findOne({ rutUser: rutUserQuery });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        const { rutUser: rutUserBody, asignaturasInteres } = body; 

        const newUserExist = await User.findOne({ rut: rutUserBody });

        if(!newUserExist) return [null, 'No existe un usuario con el nuevo RUT proporcionado'];
        
        const asignaturasInteresExist = await Asignatura.find({ nombre: { $in: asignaturasInteres } });

        if (!asignaturasInteresExist || asignaturasInteresExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        const perfilUpdated = await perfilAcademico.findOneAndUpdate(
            { _id: perfil._id },
            body,
            { new: true }
        );

        if (!perfilUpdated) return [null, 'No se pudo actualizar el perfil académico'];
        
        return [perfilUpdated, null];
    } catch (error) {
        console.error('Error al actualizar el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function deletePerfilAcademicoService(query) {
    try {
        const { rutUser } = query;

        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        const perfilDeleted = await perfilAcademico.deleteOne({ _id: perfil._id });

        if (perfilDeleted.deletedCount === 0) return [null, 'No se pudo eliminar el perfil académico'];

        return [perfilDeleted, null];
    } catch (error) {
        console.error('Error al eliminar el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function poseePerfilAcademicoService(query) {
    try {
        const { rutUser } = query;

        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        return [perfil, null];
    } catch (error) {
        console.error('Error al obtener el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

// export async function addApunteToAcademicProfileService(dataUserApunte) {
//     try {
//         const { rutUser, apuntesIDs } = dataUserApunte;

//         const userExist = await User.findOne({ rut: rutUser });
        
//         if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

//         const perfil = await perfilAcademico.findOne({ rutUser });

//         if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];
        
//         const apuntesExist = await Apunte.find({ _id: { $in: apuntesIDs } });

//         if (!apuntesExist || apuntesExist.length === 0) return [null, 'No existen apuntes con los IDs proporcionados'];

//         const lengthInitial = perfil.apuntesIDs.length;

//         //añadir apuntesIDS al perfil académico sin duplicados
//         const apuntesIDsSet = new Set(perfil.apuntesIDs.map(id => id.toString()));

//         apuntesIDs.forEach(id => apuntesIDsSet.add(id.toString()));

//         perfil.apuntesIDs = Array.from(apuntesIDsSet);

//         await perfil.save();

//         if (perfil.apuntesIDs.length === lengthInitial) return ["Error al añadir apuntes al perfil", null];

//         return ["Apuntes agregados con exito al perfil", null];
//     } catch (error) {
//         console.error('Error al agregar apunte al usuario:', error);
//         return [null, 'Error interno del servidor'];
//     }
// }

// export async function getApuntesOfUserService(query) {
//     try {
//         const { rutUser } = query;

//         const userExist = await User.findOne({ rut: rutUser });

//         if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

//         const userApunte = await UserApunte.findOne({ rutUser }).populate('apuntesIDs');

//         if (!userApunte) return [null, 'No existen apuntes asociados al usuario proporcionado'];

//         return [userApunte.apuntesIDs, null];
//     } catch (error) {
//         console.error('Error al obtener los apuntes del usuario:', error);
//         return [null, 'Error interno del servidor'];
//     }
// }

// export async function deleteApunteOfAcademicProfile(query, body) {
//     try {
//         const { rutUser: rutUserQuery } = query;

//         const userExist = await User.findOne({ rut: rutUserQuery });
    






//     } catch (error) {
//         console.error('Error al eliminar los apuntes del usuario:', error);
//         return [null, 'Error interno del servidor'];
//     }
// }
