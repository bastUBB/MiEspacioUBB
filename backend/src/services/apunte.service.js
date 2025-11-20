import mongoose from 'mongoose';
import Apunte from '../models/apunte.model.js';
import User from '../models/user.model.js';
import Reporte from '../models/reporte.model.js';
import Asignatura from '../models/asignatura.model.js';
import perfilAcademico from '../models/perfilAcademico.model.js';
import { uploadFileService } from './minio.service.js';
import { generarNombreArchivoForMinIO, diaActual } from '../helpers/ayudasVarias.helper.js';
import { asignarBucket } from '../helpers/asignarBucket.helper.js';
import { normalizarNombres } from '../helpers/ayudasVarias.helper.js';
import { asignarApunteToPerfilAcademicoService, poseePerfilAcademicoService, sumarDescargaApunteService } from './perfilAcademico.service.js';
import { realizarComentarioService, realizarComentarioRespuestaService } from "./comentario.service.js";
import { registrarSubidaApunteService, registrarComentarioService, registrarRespuestaComentarioService,
    registrarValoracionApunteService } from './historial.service.js';
import { notificacionNuevoComentarioApunteService, notificacionRespuestaComentarioService,
    notificacionNuevaValoracionApunteService } from "./notificacion.service.js";


export async function uploadApunteService(file, body) {
    try {
        const [bucketName, abreviacionAsignatura, bucketError] = asignarBucket(body.asignatura);

        if (bucketError) return [null, `Error asignando bucket: ${bucketError}`];

        const fileName = generarNombreArchivoForMinIO(file, body, abreviacionAsignatura);

        const normalizeMetadata = (str) => {
            return normalizarNombres(str);
        };

        const metadata = {
            'Content-Type': file.mimetype,
            'X-Original-Name': normalizeMetadata(file.originalname),
            'X-Upload-Date': diaActual,
            'X-Asignatura': normalizeMetadata(body.asignatura),
            'X-Tipo-Apunte': normalizeMetadata(body.tipoApunte),
            'X-Autor': body.autores
                ? normalizeMetadata(body.autores.join(','))
                : normalizeMetadata(body.autorSubida || 'desconocido')
        };

        const [fileData, fileError] = await uploadFileService(
            bucketName,
            fileName,
            file.buffer,
            metadata
        );

        if (fileError) return [null, `Error subiendo archivo: ${fileError}`];

        // 5. Retornar información estructurada para el controlador
        return [{
            fileName: fileName,
            filePath: fileData.filePath,
            bucket: fileData.bucket,
            objectName: fileData.objectName,
            size: fileData.size
        }, null];

    } catch (error) {
        console.error('Error en uploadApunteService:', error);
        return [null, 'Error interno al procesar archivo de apunte'];
    }
}

export async function createApunteService(body, file) {
    try {
        const { asignatura, rutAutorSubida } = body;

        const userExist = await User.findOne({ rut: rutAutorSubida });

        if (!userExist) return [null, 'El usuario autor de la subida no existe'];

        const existAsignatura = await Asignatura.findOne({ nombre: asignatura });

        if (!existAsignatura) return [null, 'La asignatura que desea asociar al apunte no existe'];

        const [uploadResult, uploadError] = await uploadApunteService(file, body);

        if (uploadError) return [null, uploadError];

        const apunteData = {
            ...body,
            archivo: {
                nombreOriginal: file.originalname,
                nombreArchivo: uploadResult.fileName,
                rutaCompleta: uploadResult.filePath,
                tamano: file.size,
                tipoMime: file.mimetype,
                bucket: uploadResult.bucket,
                objectName: uploadResult.objectName
            },
            visualizaciones: 0
        };

        const nuevoApunte = new Apunte(apunteData);

        await nuevoApunte.save();

        if (rutAutorSubida) {
            const [perfilActualizado, perfilError] = await asignarApunteToPerfilAcademicoService({
                rutAutorSubida: rutAutorSubida,
                apunteID: nuevoApunte._id
            });

            if (perfilError) return [null, perfilError];
        }

        const [historialCreado, historialError] = await registrarSubidaApunteService(
            rutAutorSubida,
            nuevoApunte._id
        );

        if (historialError) return [null, historialError];

        return [nuevoApunte, null];

    } catch (error) {
        console.error('Error creando apunte completo:', error);
        return [null, 'Error interno al crear el apunte'];
    }
}

export async function getApunteByIdService(apunteID) {
    try {
        const apunteExist = await Apunte.findById(apunteID)
            .populate({
                path: 'comentarios',
                populate: {
                    path: 'rutAutor',
                    select: 'nombreCompleto'
                }
            })
            .populate({
                path: 'valoracion',
                select: 'promedioValoracion cantidadValoraciones'
            });

        if (!apunteExist) return [null, 'El apunte solicitado no existe'];

        if (apunteExist.estado !== 'Activo') return [null, 'El apunte solicitado no está disponible'];

        // Obtener información del autor
        const autorInfo = await User.findOne({ rut: apunteExist.rutAutorSubida })
            .select('nombreCompleto rut');

        if (autorInfo) {
            // Obtener perfil académico del autor
            const perfilAutor = await perfilAcademico.findOne({ rutUser: apunteExist.rutAutorSubida });
            
            if (perfilAutor) {
                apunteExist._doc.autorInfo = {
                    nombreCompleto: autorInfo.nombreCompleto,
                    nivel: perfilAutor.nivel || 'Bronce',
                    reputacion: perfilAutor.reputacion || 0,
                    totalApuntes: perfilAutor.apuntesIDs?.length || 0,
                    totalValoraciones: perfilAutor.cantidadValoraciones || 0
                };
            } else {
                apunteExist._doc.autorInfo = {
                    nombreCompleto: autorInfo.nombreCompleto,
                    nivel: 'Bronce',
                    reputacion: 0,
                    totalApuntes: 0,
                    totalValoraciones: 0
                };
            }
        }

        // Transformar comentarios para incluir el nombre del autor
        if (apunteExist.comentarios && apunteExist.comentarios.length > 0) {
            apunteExist._doc.comentarios = apunteExist.comentarios.map(comentario => ({
                _id: comentario._id,
                contenido: comentario.contenido,
                fecha: comentario.fecha,
                likes: comentario.likes || 0,
                autor: comentario.rutAutor?.nombreCompleto || 'Usuario desconocido'
            }));
        }

        return [apunteExist, null];
    } catch (error) {
        console.error('Error al obtener el apunte por ID:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerLinkDescargaApunteURLFirmadaService(apunteID) {
    try {
        console.log('Obteniendo URL firmada para apunte:', apunteID);
        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) {
            console.log('Apunte no encontrado:', apunteID);
            return [null, 'El apunte solicitado no existe'];
        }

        if (apunteExist.estado !== 'Activo') {
            console.log('Apunte no está activo:', apunteExist.estado);
            return [null, 'El apunte solicitado no está disponible'];
        }

        console.log('Información del archivo:', {
            objectName: apunteExist.archivo?.objectName,
            bucket: apunteExist.archivo?.bucket,
            nombreOriginal: apunteExist.archivo?.nombreOriginal
        });

        if (!apunteExist.archivo || !apunteExist.archivo.objectName || !apunteExist.archivo.bucket) {
            console.log('Archivo incompleto en el apunte');
            return [null, 'El apunte no tiene un archivo asociado'];
        }

        // Importar el servicio de MinIO dinámicamente para evitar dependencias circulares
        const minioService = await import('./minio.service.js');
        
        // Generar URL firmada con tiempo de expiración de 2 horas, usando el bucket del apunte
        const [fileInfo, urlError] = await minioService.generarUrlFirmadaService(
            apunteExist.archivo.objectName, 
            7200,
            apunteExist.archivo.bucket
        );

        if (urlError) {
            console.log('Error al generar URL firmada:', urlError);
            return [null, urlError];
        }

        console.log('URL firmada generada exitosamente');
        return [fileInfo, null];
    } catch (error) {
        console.error('Error al obtener URL firmada del apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function updateApunteService(query, body) {
    try {
        const apunteExist = await Apunte.findById(query.apunteID);

        if (!apunteExist) return [null, 'El apunte que se desea actualizar no existe'];

        const { autorSubida: nuevoAutorSubida, asignatura: nuevaAsignatura } = body;

        if (nuevoAutorSubida && nuevoAutorSubida !== apunteExist.rutAutorSubida) {
            const userExist = await User.findOne({ rut: nuevoAutorSubida });

            if (!userExist) return [null, 'El nuevo usuario autor de la subida no existe'];
        }

        if (nuevaAsignatura && nuevaAsignatura !== apunteExist.asignatura) {
            const existAsignatura = await Asignatura.findOne({ nombre: nuevaAsignatura });

            if (!existAsignatura) return [null, 'La nueva asignatura que desea asociar al apunte no existe'];
        }

        const apunteActualizado = await Apunte.findByIdAndUpdate(
            { _id: query.apunteID },
            body,
            { new: true }
        );

        return [apunteActualizado, null];
    } catch (error) {
        console.error('Error al actualizar el apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function deleteApunteService(apunteID) {
    try {
        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte que se desea eliminar no existe'];

        apunteExist.estado = 'Suspendido';

        await apunteExist.save();

        //eliminar apunte del perfil academico
        const perfilUsuario = await perfilAcademico.findOne({ rutUser: apunteExist.rutAutorSubida });

        if (perfilUsuario) {
            perfilUsuario.apuntesIDs = perfilUsuario.apuntesIDs.filter(
                id => id.toString() !== apunteID.toString());
            await perfilUsuario.save();
        }

        return [deletedApunte, null];
    } catch (error) {
        console.error('Error al eliminar el apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerMisApuntesByRutService(rutUser) {
    try {
        const misApuntes = await Apunte.find({ rutAutorSubida: rutUser, estado: 'Activo' });

        if (!misApuntes || misApuntes.length === 0) return [null, 'No tienes apuntes subidos'];

        return [misApuntes, null];
    } catch (error) {
        console.error('Error al obtener mis apuntes:', error);
        return [null, 'Error interno del servidor'];
    }   
}

//para admin
export async function getAllApuntesService() {
    try {
        const allApuntes = await Apunte.find();

        if (!allApuntes || allApuntes.length === 0) return [null, 'No hay apuntes registrados en la BD'];

        return [allApuntes, null];
    } catch (error) {
        console.error('Error al obtener todos los apuntes:', error);
        return [null, 'Error interno del servidor'];
    }
}

// TODO: Mi idea aqui es generar una muestra de apuntes random para mostrar en una seccion 'Explorar Apuntes'
// export async function getApuntesService(query) {
//     try {
//         const apuntes = await Apunte.find(query);
//         if (!apuntes || apuntes.length === 0) return [null, 'No se encontraron apuntes que coincidan con la consulta'];

//         return [apuntes, null];
//     } catch (error) {
//         console.error('Error al obtener los apuntes:', error);
//         return [null, 'Error interno del servidor'];
//     }
// }

export async function sumarVisualizacionInvitadoApunteService(apunteID) {
    try {
        const apunte = await Apunte.findById(apunteID);

        if (!apunte) return [null, 'No se encontró el apunte con el ID proporcionado'];

        apunte.visualizaciones += 1;

        await apunte.save();

        return [apunte, null];
    } catch (error) {
        console.error('Error al sumar visualización al apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function sumarVisualizacionUsuariosApunteService(apunteID, rutUsuario) {
    try {
        const apunte = await Apunte.findById(apunteID);

        if (!apunte) return [null, 'No se encontró el apunte con el ID proporcionado'];

        const esDueño = apunte.rutAutorSubida === rutUsuario;

        if (esDueño) return [null, "El autor del apunte no puede sumar visualizaciones a su propio apunte"];

        apunte.visualizaciones += 1;

        await apunte.save();

        return [apunte, null];
    } catch (error) {
        console.error('Error al sumar visualización al apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function crearComentarioApunteService(apunteID, dataComentario) {
    try {
        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte al que se desea agregar el comentario no existe'];

        const [comentarioCreado, errorComentario] = await realizarComentarioService(dataComentario);

        if (errorComentario) return [null, errorComentario];

        //Crear notificación para el autor del apunte
        const [notificacionCreada, errorNotificacion] = await notificacionNuevoComentarioApunteService(
            dataComentario.rutAutor,
            apunteExist.rutAutorSubida,
            apunteID
        );

        if (errorNotificacion) return [null, errorNotificacion];

        apunteExist.comentarios.push(comentarioCreado._id);

        await apunteExist.save();

        const [historialCreado, historialError] = await registrarComentarioService(
            dataComentario.rutAutor,
            apunteID
        );

        if (historialError) return [null, historialError];

        return [comentarioCreado, null];

    } catch (error) {
        console.error('Error al agregar comentario al apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function crearRespuestaComentarioApunteService(apunteID, comentarioPadreID, dataComentario) {
    try {
        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte al que se desea agregar el comentario no existe'];

        const [comentarioCreado, rutAutorPadre, errorComentario] = await realizarComentarioRespuestaService(
            comentarioPadreID,
            dataComentario
        );

        if (errorComentario) return [null, errorComentario];

        //Crear notificación para el autor del comentario padre
        const [notificacionCreada, errorNotificacion] = await notificacionRespuestaComentarioService(
            rutAutorPadre,
            apunteExist.rutAutorSubida,
            apunteID
        );

        apunteExist.comentarios.push(comentarioCreado._id);

        await apunteExist.save();

        const [historialCreado, historialError] = await registrarRespuestaComentarioService(
            dataComentario.rutAutor,
            apunteID
        );

        if (historialError) return [null, historialError];

        return [comentarioCreado, null];

    } catch (error) {
        console.error('Error al agregar comentario al apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function realizarValoracionApunteService(apunteID, rutUserValoracion, nuevaValoracion) {
    try {
        // Verificar si el usuario ya posee un perfil académico
        const [poseePerfil, errorPerfil] = await poseePerfilAcademicoService(rutUserValoracion);

        if (errorPerfil) return [null, errorPerfil];

        const perfilUsuarioValoracion = await perfilAcademico.findOne({ rutUser: rutUserValoracion });

        const yaValorado = perfilUsuarioValoracion.apuntesValorados.some(v => v.apunteID.toString() === apunteID.toString());

        if (yaValorado) return [null, 'El usuario ya valoró este apunte'];

        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte que se desea valorar no existe'];

        const valoracionActualApunte = apunteExist.valoracion?.promedioValoracion || 0;
        const cantidadActualValoraciones = apunteExist.valoracion?.cantidadValoraciones || 0;

        // Calcular nuevo promedio: (suma total anterior + nueva valoración) / (cantidad + 1)
        const sumaTotalAnterior = valoracionActualApunte * cantidadActualValoraciones;
        const nuevaValoracionApunte = (sumaTotalAnterior + nuevaValoracion) / (cantidadActualValoraciones + 1);

        // Asegurarnos de que valoracion sea un objeto
        if (!apunteExist.valoracion) {
            apunteExist.valoracion = {};
        }

        apunteExist.valoracion.promedioValoracion = nuevaValoracionApunte;
        apunteExist.valoracion.cantidadValoraciones = cantidadActualValoraciones + 1;

        // añadir la nueva informacion al perfil academico del usuario que esta realizando la valoracion
        perfilUsuarioValoracion.apuntesValorados.push({
            apunteID: mongoose.Types.ObjectId.createFromHexString(apunteID),
            valoracion: nuevaValoracion,
        });

        await perfilUsuarioValoracion.save();
        await apunteExist.save();

        const [notificacionCreada, errorNotificacion] = await notificacionNuevaValoracionApunteService(
            apunteExist.rutAutorSubida,
            rutUserValoracion,
            apunteID
        );

        if (errorNotificacion) return [null, errorNotificacion];

        const [historialCreado, historialError] = await registrarValoracionApunteService(
            rutUserValoracion,
            apunteID
        );

        if (historialError) return [null, historialError];

        return [apunteExist, null];

    } catch (error) {
        console.error('Error al realizar la valoración del apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function verificarReportesApunteService(apunteID, rutUsuarioReporte) {
    try {
        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte que se desea reportar no existe'];

        const cantidadReportesApunte = apunteExist.reportes.length;

        if (cantidadReportesApunte >= 4) {
            apunteExist.estado = 'Bajo Revisión';
            await apunteExist.save();
        }
        return [apunteExist, null];
    } catch (error) {
        console.error('Error al verificar los reportes del apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function crearReporteApunteService(apunteID, dataReporte) {
    try {
        const { rutUsuarioReportado, rutUsuarioReporte } = dataReporte;

        const existUsuarioReportado = await User.findOne({ rut: rutUsuarioReportado });

        if (!existUsuarioReportado) return [null, 'El usuario reportado no existe'];

        const existUsuarioReporte = await User.findOne({ rut: rutUsuarioReporte });

        if (!existUsuarioReporte) return [null, 'El usuario que reporta no existe'];

        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte que desea reportar no existe'];

        const nuevoReporte = new Reporte(dataReporte);

        await nuevoReporte.save();

        apunteExist.reportes.push(nuevoReporte._id);

        await apunteExist.save();

        const [apunteVerificado, errorVerificacion] = await verificarReportesApunteService(apunteID, rutUsuarioReporte);

        if (errorVerificacion) return [null, errorVerificacion];

        return [nuevoReporte, null];
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerApuntesMasValoradosService() {
    try {
        const apuntesMasValorados = await Apunte.find({ estado: 'Activo' })
            .sort({ 'valoracion.promedioValoracion': -1, 'valoracion.cantidadValoraciones': -1 })
            .limit(10);

        // Si no hay apuntes, devolver array vacío en lugar de error
        return [apuntesMasValorados || [], null];
    } catch (error) {
        console.error('Error al obtener los apuntes más valorados:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function apuntesMasVisualizadosService() {
    try {
        const apuntes = await Apunte.find({ estado: 'Activo' })
            .sort({ visualizaciones: -1 })  
            .limit(5)
            .select('nombre asignatura visualizaciones autorSubida rutAutorSubida');

        if (apuntes.length === 0) {
            return [null, 'No hay apuntes activos'];
        }

        return [apuntes, null];
    } catch (error) {
        console.error('Error al obtener los apuntes más visualizados:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerAsignaturasConMasApuntesService() {
    try {
        const asignaturasConMasApuntes = await Apunte.aggregate([
            { $match: { estado: 'Activo' } },
            { $group: { _id: "$asignatura", totalApuntes: { $sum: 1 } } },
            { $sort: { totalApuntes: -1 } },
            { $limit: 5 }
        ]);

        return [asignaturasConMasApuntes, null];
    } catch (error) {
        console.error('Error al obtener las asignaturas con más apuntes:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function obtenerValoracionApunteService(apunteID, rutUsuarioValoracion) {
    try {
        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte solicitado no existe'];

        const perfilUsuarioValoracion = await perfilAcademico.findOne({ rutUser: rutUsuarioValoracion });

        if (!perfilUsuarioValoracion) return [null, 'El usuario no posee perfil académico'];

        const valoracionUsuario = perfilUsuarioValoracion.apuntesValorados.find(
            v => v.apunteID.toString() === apunteID.toString()
        );

        if (!valoracionUsuario) return [null, 'El usuario no ha valorado este apunte'];

        return [valoracionUsuario.valoracion, null];
    } catch (error) {
        console.error('Error al obtener la valoración del apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

export async function actualizarValoracionApunteService(apunteID, rutUserValoracion, nuevaValoracion) {
    try {
        const perfilUsuarioValoracion = await perfilAcademico.findOne({ rutUser: rutUserValoracion });

        if (!perfilUsuarioValoracion) return [null, 'El usuario no posee perfil académico'];

        const valoracionIndex = perfilUsuarioValoracion.apuntesValorados.findIndex(
            v => v.apunteID.toString() === apunteID.toString()
        );

        if (valoracionIndex === -1) return [null, 'El usuario no ha valorado este apunte previamente'];

        const valoracionAnterior = perfilUsuarioValoracion.apuntesValorados[valoracionIndex].valoracion;

        const apunteExist = await Apunte.findById(apunteID);

        if (!apunteExist) return [null, 'El apunte que se desea actualizar no existe'];

        // Recalcular el promedio de valoración
        const cantidadValoraciones = apunteExist.valoracion?.cantidadValoraciones || 0;
        const promedioActual = apunteExist.valoracion?.promedioValoracion || 0;

        // Restar la valoración anterior y agregar la nueva
        const sumaTotal = (promedioActual * cantidadValoraciones) - valoracionAnterior + nuevaValoracion;
        const nuevoPromedio = sumaTotal / cantidadValoraciones;

        // Asegurarnos de que valoracion sea un objeto
        if (!apunteExist.valoracion) {
            apunteExist.valoracion = {};
        }

        apunteExist.valoracion.promedioValoracion = nuevoPromedio;

        // Actualizar la valoración en el perfil del usuario
        perfilUsuarioValoracion.apuntesValorados[valoracionIndex].valoracion = nuevaValoracion;

        await perfilUsuarioValoracion.save();
        await apunteExist.save();

        return [apunteExist, null];
    } catch (error) {
        console.error('Error al actualizar la valoración del apunte:', error);
        return [null, 'Error interno del servidor'];
    }
}

// export async function generarRecomendacionApuntePersonalizadaService(rutUser) 

//Servicio para obtener apunte. Este servicio debe entregar el archivo para su posterior previsualización y link de descarga
// mediante URL firmada.
// export async function getApunteByIdService(apunteID)

// export async function getApuntesRecommendations(){}

// export async function
