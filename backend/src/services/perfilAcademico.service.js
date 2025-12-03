import perfilAcademico from "../models/perfilAcademico.model.js";
import User from "../models/user.model.js";
import Asignatura from "../models/asignatura.model.js";
import Apunte from "../models/apunte.model.js";
import { registrarCreacionPerfilAcademicoService, registrarActualizacionPerfilAcademicoService } from "./historial.service.js";

export async function createPerfilAcademicoService(dataPerfilAcademico) {
    try {
        const { rutUser, asignaturasCursantes, asignaturasInteres, informeCurricular } = dataPerfilAcademico;

        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const asignaturasCursantesExist = await Asignatura.find({ nombre: { $in: asignaturasCursantes } });

        if (!asignaturasCursantesExist || asignaturasCursantesExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        // Solo validar asignaturasInteres si el array no está vacío
        if (asignaturasInteres && asignaturasInteres.length > 0) {
            const asignaturasInteresExist = await Asignatura.find({ nombre: { $in: asignaturasInteres } });

            if (!asignaturasInteresExist || asignaturasInteresExist.length === 0) return [null, 'No existen asignaturas de interés con los nombres proporcionados'];
        }

        //acceder a las asignaturas del informe curricular y verificar que existen
        for (const informe of informeCurricular) {
            const asignaturasInformeCurricular = await Asignatura.findOne({ nombre: informe.asignatura });

            if (!asignaturasInformeCurricular) return [null, `No existe la asignatura ${informe.asignatura} en el informe curricular`];
        }

        const newPerfilAcademico = new perfilAcademico({
            ...dataPerfilAcademico,
        });

        await newPerfilAcademico.save();

        const [historial, errorHistorial] = await registrarCreacionPerfilAcademicoService(rutUser);

        if (errorHistorial) return [null, errorHistorial];

        return [newPerfilAcademico, null];
    } catch (error) {
        console.error('Error al crear el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function createPerfilAcademicoDocenteService(dataPerfilAcademico) {
    try {
        const { rutUser: rutDocente, asignaturasImpartidasActuales: asignaturasDocente } = dataPerfilAcademico;

        const userExist = await User.findOne({ rut: rutDocente });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const asignaturasDocenteExist = await Asignatura.find({ nombre: { $in: asignaturasDocente } });

        if (!asignaturasDocenteExist || asignaturasDocenteExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        const newPerfilAcademico = new perfilAcademico({
            ...dataPerfilAcademico,
        });

        await newPerfilAcademico.save();

        const [historial, errorHistorial] = await registrarCreacionPerfilAcademicoService(rutDocente);

        if (errorHistorial) return [null, errorHistorial];

        return [newPerfilAcademico, null];
    } catch (error) {
        console.error('Error al crear el perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function createPerfilAcademicoAyudanteService(dataPerfilAcademico) {
    try {
        const { rutUser, asignaturasCursantes, asignaturasInteres, asignaturasImpartidasActuales, informeCurricular } = dataPerfilAcademico;

        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const asignaturasCursantesExist = await Asignatura.find({ nombre: { $in: asignaturasCursantes } });

        if (!asignaturasCursantesExist || asignaturasCursantesExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        // Solo validar asignaturasInteres si el array no está vacío
        if (asignaturasInteres && asignaturasInteres.length > 0) {
            const asignaturasInteresExist = await Asignatura.find({ nombre: { $in: asignaturasInteres } });

            if (!asignaturasInteresExist || asignaturasInteresExist.length === 0) return [null, 'No existen asignaturas de interés con los nombres proporcionados'];
        }

        //acceder a las asignaturas del informe curricular y verificar que existen
        for (const informe of informeCurricular) {
            const asignaturasInformeCurricular = await Asignatura.findOne({ nombre: informe.asignatura });

            if (!asignaturasInformeCurricular) return [null, `No existe la asignatura ${informe.asignatura} en el informe curricular`];
        }

        const asignaturasImpartidasActualesExist = await Asignatura.find({ nombre: { $in: asignaturasImpartidasActuales } });

        if (!asignaturasImpartidasActualesExist || asignaturasImpartidasActualesExist.length === 0) return [null, 'No existen asignaturas con los nombres proporcionados'];

        const newPerfilAcademico = new perfilAcademico({
            ...dataPerfilAcademico,
        });

        await newPerfilAcademico.save();

        const [historial, errorHistorial] = await registrarCreacionPerfilAcademicoService(rutUser);

        if (errorHistorial) return [null, errorHistorial];

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

        const { asignaturasInteres: nuevasAsignaturasInteres, asignaturasCursantes: nuevasAsignaturasCursantes } = body;

        const asignaturasInteresExist = await Asignatura.find({ nombre: { $in: nuevasAsignaturasInteres } });

        if (!asignaturasInteresExist || asignaturasInteresExist.length === 0) return [null, 'No existen asignaturas de interes con los nombres proporcionados'];

        const asignaturasCursantesExist = await Asignatura.find({ nombre: { $in: nuevasAsignaturasCursantes } });

        if (!asignaturasCursantesExist || asignaturasCursantesExist.length === 0) return [null, 'No existen asignaturas cursantes con los nombres proporcionados'];

        const perfilUpdated = await perfilAcademico.findOneAndUpdate(
            { _id: perfil._id },
            body,
            { new: true }
        );

        if (!perfilUpdated) return [null, 'No se pudo actualizar el perfil académico'];

        const [historial, errorHistorial] = await registrarActualizacionPerfilAcademicoService(rutUserQuery);

        if (errorHistorial) return [null, errorHistorial];

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

export async function poseePerfilAcademicoService(rutUser) {
    try {
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

export async function asignarApunteToPerfilAcademicoService(dataUserApunte) {
    try {
        const { rutAutorSubida, apunteID } = dataUserApunte;

        const userExist = await User.findOne({ rut: rutAutorSubida });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutAutorSubida });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        const apunteExist = await Apunte.findOne({ _id: apunteID });

        if (!apunteExist) return [null, 'No existe un apunte con el ID proporcionado'];

        perfil.apuntesIDs.push(apunteID);

        await perfil.save();

        return [perfil, null];
    } catch (error) {
        console.error('Error al asignar apunte al perfil académico:', error);
        return [null, 'Error interno del servidor'];
    }
}

//hacer controlador
export async function numeroApuntesUserService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutUser });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        perfil.apuntesSubidos = perfil.apuntesIDs.length;

        await perfil.save();

        return [perfil.apuntesIDs.length, null];
    } catch (error) {
        console.error('Error al obtener el número de apuntes del usuario:', error);
        return [null, 'Error interno del servidor'];
    }
}

//asociar en el servicio de apunte (IMPLEMENTAR)
export async function sumarDescargaApunteService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutUser });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        perfil.apuntesDescargados += 1;

        await perfil.save();

        return [perfil.apuntesDescargados, null];
    } catch (error) {
        console.error('Error al sumar descarga de apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

//hacer controlador
export async function busquedaApuntesMismoAutorService(rutAutor, asignaturaApunteActual) {
    try {
        const userExist = await User.findOne({ rut: rutAutor });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutAutor });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        // buscar apuntes al azar, subidos por el mismo autor y que sean de una asignatura distina a asignaturaApunteActual (maximo 4)
        const apuntesMismoAutor = await Apunte.aggregate([
            { $match: { rutAutorSubida: rutAutor, asignatura: { $ne: asignaturaApunteActual } } },
            { $sample: { size: 4 } }
        ]);

        return [apuntesMismoAutor, null];

    } catch (error) {
        console.error('Error al buscar apuntes del mismo autor:', error);
        return [null, 'Error interno del servidor'];
    }
}

//hacer controlador
export async function busquedaApuntesMismaAsignaturaService(rutAutor, asignaturaApunteActual) {
    try {
        const userExist = await User.findOne({ rut: rutAutor });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutAutor });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        // buscar apuntes al azar, subidos de distintos autores y que sean de la misma asignatura a asignaturaApunteActual (maximo 4)
        const apuntesMismaAsignatura = await Apunte.aggregate([
            { $match: { rutAutorSubida: { $ne: rutAutor }, asignatura: asignaturaApunteActual } },
            { $sample: { size: 4 } }
        ]);

        // Si no hay apuntes, retornamos array vacío en lugar de error
        if (apuntesMismaAsignatura.length === 0) return [[], null];

        return [apuntesMismaAsignatura, null];

    } catch (error) {
        console.error('Error al buscar apuntes del mismo autor:', error);
        return [null, 'Error interno del servidor'];
    }
}

// export async function actualizarValoracionPerfilAcademicoService -> aqui deberia de hacer una formula

export async function obtenerValoracionPromedioApuntesService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutUser });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        //obtener los apuntes subidos por el usuario
        const apuntes = await Apunte.find({ rutAutorSubida: rutUser });

        if (!apuntes || apuntes.length === 0) return [0, null];

        const { sumaTotal, cantidadTotal } = apuntes.reduce((acc, apunte) => {
            const cantidadValoraciones = apunte.valoracion?.cantidadValoraciones || 0;

            const promedioValoracion = apunte.valoracion?.promedioValoracion || 0;

            const sumaApunte = promedioValoracion * cantidadValoraciones;

            return {
                sumaTotal: acc.sumaTotal + sumaApunte,

                cantidadTotal: acc.cantidadTotal + cantidadValoraciones
            };
        }, { sumaTotal: 0, cantidadTotal: 0 });

        const valoracionPromedio = cantidadTotal > 0 ? sumaTotal / cantidadTotal : 0;

        return [valoracionPromedio, null];
    } catch (error) {
        console.error('Error al obtener la valoración promedio de apuntes:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerNumeroDescargasApuntesService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'No existe un usuario con el RUT proporcionado'];

        const perfil = await perfilAcademico.findOne({ rutUser: rutUser });

        if (!perfil) return [null, 'No existe un perfil académico para los datos proporcionados'];

        return [perfil.apuntesDescargados, null];
    } catch (error) {
        console.error('Error al obtener el número de descargas de apuntes:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerMayoresContribuidoresService() {
    try {
        const perfiles = await perfilAcademico.find({ apuntesSubidos: { $gt: 0 } }).sort({ apuntesSubidos: -1 }).limit(5);

        if (!perfiles || perfiles.length === 0) return [[], null];

        const contribuidores = await Promise.all(
            perfiles.map(async (perfil) => {
                const usuario = await User.findOne({ rut: perfil.rutUser });
                return {
                    nombreCompleto: usuario?.nombreCompleto || 'Usuario desconocido',
                    apuntesSubidos: perfil.apuntesSubidos || 0,
                };
            })
        );

        return [contribuidores, null];
    } catch (error) {
        console.error('Error al obtener los mayores contribuidores:', error);
        return [null, 'Error interno del servidor'];
    }
}



