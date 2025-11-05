import Apunte from '../models/apunte.model.js';
import Asignatura from '../models/asignatura.model.js';
import { uploadFileService } from './minio.service.js';
import { generarNombreArchivoForMinIO, diaActual } from '../helpers/ayudasVarias.helper.js';
import { asignarBucket } from '../helpers/asignarBucket.helper.js';
import { normalizarNombres } from '../helpers/ayudasVarias.helper.js';
import { asignarApunteToPerfilAcademicoService } from './perfilAcademico.service.js';

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

            if (perfilError) {
                console.warn('No se pudo asignar el apunte al perfil académico:', perfilError);
            } else {
                console.log('Apunte asignado automáticamente al perfil académico del usuario');
            }
        }

        return [nuevoApunte, null];

    } catch (error) {
        console.error('Error creando apunte completo:', error);
        return [null, 'Error interno al crear el apunte'];
    }
}

//TODO: La idea es mostrar todos los apuntes, y que el archivo correspondiente se llama de manera individual con la URL firmada
// export async function getAllApuntesService(){}

// export async function getApuntesRecommendations(){}

// export async function