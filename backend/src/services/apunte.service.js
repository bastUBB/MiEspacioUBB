import Apunte from '../models/apunte.model.js';
import User from '../models/user.model.js';
import Asignatura from '../models/asignatura.model.js';
import { uploadFileService } from './minio.service.js';
import { generarNombreArchivoForMinIO, diaActual } from '../helpers/ayudasVarias.helper.js';
import { asignarBucket } from '../helpers/asignarBucket.helper.js';

export async function uploadApunteService(file, body) {
    try {
        const [bucketName, abreviacionAsignatura, bucketError] = asignarBucket(body.asignatura);

        if (bucketError) return [null, `Error asignando bucket: ${bucketError}`];

        const fileName = generarNombreArchivoForMinIO(file, body, abreviacionAsignatura);

        const metadata = {
            'Content-Type': file.mimetype,
            'X-Original-Name': file.originalname,
            'X-Upload-Date': diaActual,
            'X-Asignatura': body.asignatura,
            'X-Tipo-Apunte': body.tipoApunte,
            'X-Autor': body.autores ? body.autores.join(',') : (body.autorSubida || 'desconocido')
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

// Crear el apunte completo: validar, subir archivo y guardar en BD
export async function createApunteService(body, file) {
    try {
        const { autores, asignatura } = body;

        if (autores && Array.isArray(autores)) {
            const existUsuarios = await User.find({ nombreCompleto: { $in: autores } });
            if (existUsuarios.length !== autores.length) {
                return [null, 'Algunos autores no existen'];
            }
        }

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
            fechaCreacion: new Date(),
            visualizaciones: 0
        };

        const nuevoApunte = new Apunte(apunteData);
        await nuevoApunte.save();

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