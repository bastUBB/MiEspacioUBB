import HistorialUsuario from "../models/historialUsuario.model.js";
import User from "../models/user.model.js";
import Apunte from "../models/apunte.model.js";
import Comentario from "../models/comentario.model.js";
import perfilAcademico from "../models/perfilAcademico.model.js";
import Encuesta from "../models/encuesta.model.js";
import { fechaActual } from "../helpers/ayudasVarias.helper.js";

//subida apunte, descarga apunte, realizar comentario, responder comentario, creacion perfil academico, valorar apunte, 
// editar campos de perfil de usuario, editar campos de perfil academico

export async function registrarSubidaApunteService(rutUser, apunteID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la subida no existe'];

        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte a registrar no existe'];

        const nombreUsuario = userExist.nombreCompleto;

        const nombreApunte = apunteExist.nombre;

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${nombreUsuario} ha subido el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${nombreUsuario} ha subido el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la subida de apunte en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

//TODO: Implementacion pendiente porque no he realizado el servicio de descarga de apunte y minio
export async function registrarDescargaApunteService(rutUser, apunteID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la descarga no existe'];

        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte a registrar no existe'];

        const nombreUsuario = userExist.nombreCompleto;

        const nombreApunte = apunteExist.nombre;

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${nombreUsuario} ha descargado el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${nombreUsuario} ha descargado el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la descarga de apunte en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarComentarioService(rutUser, apunteID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor del comentario no existe'];

        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte a registrar no existe'];

        const nombreUsuario = userExist.nombreCompleto;

        const nombreApunte = apunteExist.nombre;

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${nombreUsuario} ha comentado en el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${nombreUsuario} ha comentado en el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [historialUsuario, null];
    } catch (error) {
        console.error('Error al registrar el comentario en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarRespuestaComentarioService(rutUser, comentarioPadreID, apunteDelComentarioPadreID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la respuesta no existe'];

        const comentarioPadreExist = await Comentario.findById(comentarioPadreID);

        if (!comentarioPadreExist) return [null, 'El comentario padre no existe'];

        const apunteExist = await Apunte.findById(apunteDelComentarioPadreID);

        if (!apunteExist) return [null, 'El apunte asociado al comentario padre no existe'];

        const nombreUsuario = userExist.nombreCompleto;

        const nombreApunte = apunteExist.nombre;

        const AutorComentarioPadreUser = await User.findOne({ rut: comentarioPadreExist.rutAutor });

        const nombreAutorComentarioPadre = AutorComentarioPadreUser.nombreCompleto;

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${nombreUsuario} ha respondido al comentario de ${nombreAutorComentarioPadre} en el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${nombreUsuario} ha respondido al comentario de ${nombreAutorComentarioPadre} en el apunte ${nombreApunte}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la respuesta al comentario en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarCreacionPerfilAcademicoService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la creacion del perfil academico no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha creado su perfil académico.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha creado su perfil académico.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la creacion del perfil academico en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarValoracionApunteService(rutUser, apunteID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la valoración no existe'];

        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte a registrar no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha valorado el apunte ${apunteExist.nombre}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha valorado el apunte ${apunteExist.nombre}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la valoración de apunte en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarActualizacionPerfilService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la actualización del perfil no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha actualizado su perfil.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha actualizado su perfil.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la actualización del perfil en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarActualizacionPerfilAcademicoService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la actualización del perfil académico no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha actualizado su perfil académico.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha actualizado su perfil académico.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la actualización del perfil académico en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function getHistorialUsuarioService(rutUser) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (!historialUsuario) return [null, 'El usuario no tiene historial registrado'];

        return [historialUsuario, null];
    } catch (error) {
        console.error('Error al obtener el historial del usuario:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarCreateEncuestaService(rutUser, encuestaID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la encuesta no existe'];

        const encuestaExist = await Encuesta.findById(encuestaID);

        if (!encuestaExist) return [null, 'La encuesta que desea registrar no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha creado la encuesta ${encuestaExist.nombre}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha creado la encuesta ${encuestaExist.nombre}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la encuesta en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarUpdateEncuestaService(rutUser, encuestaID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la encuesta no existe'];

        const encuestaExist = await Encuesta.findById(encuestaID);

        if (!encuestaExist) return [null, 'La encuesta que desea actualizar y registrar no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha actualizado la encuesta ${encuestaExist.nombre}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha actualizado la encuesta ${encuestaExist.nombre}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la encuesta en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function registrarDeleteEncuestaService(rutUser, encuestaID) {
    try {
        const userExist = await User.findOne({ rut: rutUser });

        if (!userExist) return [null, 'El usuario autor de la encuesta no existe'];

        const encuestaExist = await Encuesta.findById(encuestaID);

        if (!encuestaExist) return [null, 'La encuesta que desea eliminar y registrar no existe'];

        const historialUsuario = await HistorialUsuario.findOne({ rutUser: rutUser });

        if (historialUsuario) {
            const nuevaAccion = {
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha eliminado la encuesta ${encuestaExist.nombre}.`,
                fechaAccion: fechaActual
            };

            historialUsuario.acciones.push(nuevaAccion);

            await historialUsuario.save();

            return [historialUsuario, null];
        }

        const nuevoHistorial = new HistorialUsuario({
            rutUser: rutUser,
            acciones: [{
                tipoAccion: `El usuario ${userExist.nombreCompleto} ha eliminado la encuesta ${encuestaExist.nombre}.`,
                fechaAccion: fechaActual
            }]
        });

        await nuevoHistorial.save();

        return [nuevoHistorial, null];
    } catch (error) {
        console.error('Error al registrar la encuesta en el historial:', error);
        return [null, 'Error interno del servidor'];
    }
}