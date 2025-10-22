import path from 'path';
import moment from "moment";

export const diaActual = moment().format("DD-MM-YYYY");

export const fechaActual = moment().format("DD-MM-YYYY-HH:mm");

export function generarNombreArchivoForMinIO(metadataArchivo, body, abreviacionAsignatura) {
    const extension = path.extname(metadataArchivo.originalname);

    const nombreSinExtension = path.basename(metadataArchivo.originalname, extension);

    return `${abreviacionAsignatura}-${nombreSinExtension}-${body.autorSubida}-${diaActual}${extension}`;
}